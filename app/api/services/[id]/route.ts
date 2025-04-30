import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { serviceSchema } from "@/lib/types";
import { validateRequest, errorResponse } from "@/lib/api-utils";
import { requireAdmin } from "@/lib/auth";

// GET /api/services/[id] - Get a specific service
export async function GET(
	request: Request,
	{ params }: { params: { id: string } } & { searchParams: URLSearchParams }
): Promise<Response> {
	try {
		const supabase = await createClient();

		const { data, error } = await supabase
			.from("services")
			.select("*")
			.eq("id", params.id)
			.single();

		if (error) {
			return errorResponse(
				error.message,
				error.code === "PGRST116" ? 404 : 500
			);
		}

		return NextResponse.json(data);
	} catch (error) {
		console.error("Error fetching service:", error);
		return errorResponse("Failed to fetch service", 500);
	}
}

// PUT /api/services/[id] - Update a service (admin only)
export async function PUT(
	request: Request,
	{ params }: { params: { id: string } } & { searchParams: URLSearchParams }
): Promise<Response> {
	try {
		// Check if user is admin
		await requireAdmin();

		const validation = await validateRequest(request, serviceSchema);

		if (!validation.success) {
			return errorResponse(validation.error.error, validation.error.status);
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
			return errorResponse("Service not found", 404);
		}

		// Update the service
		const { data, error } = await supabase
			.from("services")
			.update(serviceData)
			.eq("id", params.id)
			.select()
			.single();

		if (error) {
			return errorResponse(error.message, 500);
		}

		return NextResponse.json(data);
	} catch (error) {
		console.error("Error updating service:", error);
		return errorResponse("Failed to update service", 500);
	}
}

// DELETE /api/services/[id] - Delete a service (admin only)
export async function DELETE(
	request: Request,
	{ params }: { params: { id: string } } & { searchParams: URLSearchParams }
): Promise<Response> {
	try {
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
			return errorResponse("Service not found", 404);
		}

		// Check if there are any bookings using this service
		const { data: bookingsWithService, error: bookingsError } = await supabase
			.from("bookings")
			.select("id")
			.eq("service_id", params.id)
			.limit(1);

		if (
			!bookingsError &&
			bookingsWithService &&
			bookingsWithService.length > 0
		) {
			return errorResponse(
				"Cannot delete service that has associated bookings",
				400
			);
		}

		// Delete the service
		const { error } = await supabase
			.from("services")
			.delete()
			.eq("id", params.id);

		if (error) {
			return errorResponse(error.message, 500);
		}

		return new NextResponse(null, { status: 204 });
	} catch (error) {
		console.error("Error deleting service:", error);
		return errorResponse("Failed to delete service", 500);
	}
}
