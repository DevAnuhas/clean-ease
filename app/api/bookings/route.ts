import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { bookingSchema } from "@/lib/types";
import { validateRequest } from "@/lib/api-utils";
import { withErrorHandler, withAuth } from "@/middleware/error-handler";
import { DatabaseError, ForbiddenError, NotFoundError } from "@/lib/errors";

// GET /api/bookings - Get all bookings for the authenticated user
async function getBookings(req: NextRequest) {
	const supabase = await createClient();

	const userId = req.headers.get("x-user-id");
	if (userId === null) {
		throw new ForbiddenError("User not authenticated");
	}

	const { data, error } = await supabase
		.from("bookings")
		.select("*, services(*)")
		.eq("user_id", userId);

	if (error) {
		throw new DatabaseError(error.message);
	}

	return NextResponse.json(data);
}

// POST /api/bookings - Create a new booking
async function createBooking(req: NextRequest) {
	const bookingData = await validateRequest(req, bookingSchema);

	const userId = req.headers.get("x-user-id");
	if (userId === null) {
		throw new ForbiddenError("User not authenticated");
	}

	const supabase = await createClient();

	// Check if the service exists
	const { data: serviceExists, error: serviceError } = await supabase
		.from("services")
		.select("id")
		.eq("id", bookingData.service_id)
		.single();

	if (serviceError || !serviceExists) {
		throw new NotFoundError("Service not found");
	}

	// Insert the booking
	const { data, error } = await supabase
		.from("bookings")
		.insert({
			...bookingData,
			user_id: userId,
			status: bookingData.status || "pending",
		})
		.select()
		.single();

	if (error) {
		throw new DatabaseError(error.message);
	}

	return NextResponse.json(data, { status: 201 });
}

export const GET = withErrorHandler(withAuth(getBookings));
export const POST = withErrorHandler(withAuth(createBooking));
