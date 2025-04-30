import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { serviceSchema } from "@/lib/types";
import { validateRequest } from "@/lib/api-utils";
import { withErrorHandler, withAdminAuth } from "@/middleware/error-handler";
import { DatabaseError, NotFoundError, ValidationError } from "@/lib/errors";

// GET /api/services/[id] - Get a specific service
async function getService(
	req: NextRequest,
	{ params }: { params: { id: string } }
) {
	const supabase = await createClient();

	const { data, error } = await supabase
		.from("services")
		.select("*")
		.eq("id", params.id)
		.single();

	if (error) {
		if (error.code === "PGRST116") {
			throw new NotFoundError("Service not found");
		}
		throw new DatabaseError(error.message);
	}

	return NextResponse.json(data);
}

// PUT /api/services/[id] - Update a service (admin only)
async function updateService(
	req: NextRequest,
	{ params }: { params: { id: string } }
) {
	const serviceData = await validateRequest(req, serviceSchema);
	const supabase = await createClient();

	// Check if the service exists
	const { error: fetchError } = await supabase
		.from("services")
		.select("id")
		.eq("id", params.id)
		.single();

	if (fetchError) {
		throw new NotFoundError("Service not found");
	}

	// Update the service
	const { data, error } = await supabase
		.from("services")
		.update(serviceData)
		.eq("id", params.id)
		.select()
		.single();

	if (error) {
		throw new DatabaseError(error.message);
	}

	return NextResponse.json(data);
}

// DELETE /api/services/[id] - Delete a service (admin only)
async function deleteService(
	req: NextRequest,
	{ params }: { params: { id: string } }
) {
	const supabase = await createClient();

	// Check if the service exists
	const { error: fetchError } = await supabase
		.from("services")
		.select("id")
		.eq("id", params.id)
		.single();

	if (fetchError) {
		throw new NotFoundError("Service not found");
	}

	// Check if there are any bookings using this service
	const { data: bookingsWithService, error: bookingsError } = await supabase
		.from("bookings")
		.select("id")
		.eq("service_id", params.id)
		.limit(1);

	if (!bookingsError && bookingsWithService && bookingsWithService.length > 0) {
		throw new ValidationError(
			"Cannot delete service that has associated bookings"
		);
	}

	// Delete the service
	const { error } = await supabase
		.from("services")
		.delete()
		.eq("id", params.id);

	if (error) {
		throw new DatabaseError(error.message);
	}

	return new NextResponse(null, { status: 204 });
}

// Public endpoint - no auth required
export const GET = withErrorHandler(getService);
// Admin only endpoints
export const PUT = withErrorHandler(withAdminAuth(updateService));
export const DELETE = withErrorHandler(withAdminAuth(deleteService));
