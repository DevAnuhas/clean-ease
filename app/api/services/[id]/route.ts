import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { serviceSchema } from "@/lib/types";
import { validateRequest } from "@/lib/api-utils";
import { requireAdmin } from "@/lib/auth";

// GET /api/services/[id] - Get a specific service
export async function GET(
	request: NextRequest,
	{ params }: { params: { id: string } }
): Promise<NextResponse> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.from("services")
		.select("*")
		.eq("id", params.id)
		.single();

	if (error) {
		return NextResponse.json(
			{ message: error.message },
			{ status: error.code === "PGRST116" ? 404 : 500 }
		);
	}

	return NextResponse.json(data);
}

// PUT /api/services/[id] - Update a service (admin only)
export async function PUT(
	request: NextRequest,
	{ params }: { params: { id: string } }
): Promise<NextResponse> {
	// Check if user is admin
	await requireAdmin();

	const validation = await validateRequest(request, serviceSchema);

	if (!validation.success) {
		return NextResponse.json(
			{ message: validation.error.error },
			{ status: validation.error.status }
		);
	}

	const serviceData = validation.data;
	const supabase = await createClient();

	// Check if the service exists
	const { data: existingService, error: fetchError } = await supabase
		.from("services")
		.select("id")
		.eq("id", params.id)
		.single();

	if (fetchError || !existingService) {
		return NextResponse.json({ message: "Service not found" }, { status: 404 });
	}

	// Update the service
	const { data, error } = await supabase
		.from("services")
		.update(serviceData)
		.eq("id", params.id)
		.select()
		.single();

	if (error) {
		return NextResponse.json(
			{ message: error.message },
			{ status: error.code === "PGRST116" ? 404 : 500 }
		);
	}

	return NextResponse.json(data);
}

// DELETE /api/services/[id] - Delete a service (admin only)
export async function DELETE(
	request: NextRequest,
	{ params }: { params: { id: string } }
): Promise<NextResponse> {
	// Check if user is admin
	await requireAdmin();

	const supabase = await createClient();

	// Check if the service exists
	const { data: existingService, error: fetchError } = await supabase
		.from("services")
		.select("id")
		.eq("id", params.id)
		.single();

	if (fetchError || !existingService) {
		return NextResponse.json({ message: "Service not found" }, { status: 404 });
	}

	// Check if there are any bookings using this service
	const { data: bookingsWithService, error: bookingsError } = await supabase
		.from("bookings")
		.select("id")
		.eq("service_id", params.id)
		.limit(1);

	if (!bookingsError && bookingsWithService && bookingsWithService.length > 0) {
		return NextResponse.json(
			{ message: "Cannot delete service that has associated bookings" },
			{ status: 400 }
		);
	}

	// Delete the service
	const { error } = await supabase
		.from("services")
		.delete()
		.eq("id", params.id);

	if (error) {
		return NextResponse.json({ message: error.message }, { status: 500 });
	}

	return new NextResponse(null, { status: 204 });
}
