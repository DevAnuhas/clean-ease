import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { bookingSchema } from "@/lib/types";
import { validateRequest } from "@/lib/api-utils";
import { withErrorHandler, withAuth } from "@/middleware/error-handler";
import { DatabaseError, NotFoundError, ForbiddenError } from "@/lib/errors";

// GET /api/bookings/[id] - Get a specific booking
async function getBooking(
	req: NextRequest,
	context: { params: { id: string } }
) {
	const { id } = await Promise.resolve(context.params);
	const supabase = await createClient();

	const userId = req.headers.get("x-user-id");
	if (userId === null) {
		throw new ForbiddenError("User not authenticated");
	}

	const { data, error } = await supabase
		.from("bookings")
		.select("*, services(*)")
		.eq("id", id)
		.eq("user_id", userId)
		.single();

	if (error) {
		if (error.code === "PGRST116") {
			throw new NotFoundError("Booking not found");
		}
		throw new DatabaseError(error.message);
	}

	return NextResponse.json(data);
}

// PUT /api/bookings/[id] - Update a booking
async function updateBooking(
	req: NextRequest,
	context: { params: { id: string } }
) {
	const { id } = await Promise.resolve(context.params);
	const userId = req.headers.get("x-user-id");
	const bookingData = await validateRequest(req, bookingSchema);
	const supabase = await createClient();

	// Check if the booking exists and belongs to the user
	const { data: existingBooking, error: fetchError } = await supabase
		.from("bookings")
		.select("id, user_id")
		.eq("id", id)
		.single();

	if (fetchError) {
		throw new NotFoundError("Booking not found");
	}

	if (existingBooking.user_id !== userId) {
		throw new ForbiddenError(
			"You do not have permission to update this booking"
		);
	}

	// Update the booking
	const { data, error } = await supabase
		.from("bookings")
		.update(bookingData)
		.eq("id", id)
		.select()
		.single();

	if (error) {
		throw new DatabaseError(error.message);
	}

	return NextResponse.json(data);
}

// DELETE /api/bookings/[id] - Delete a booking
async function deleteBooking(
	req: NextRequest,
	context: { params: { id: string } }
) {
	const { id } = await Promise.resolve(context.params);
	const userId = req.headers.get("x-user-id");
	const supabase = await createClient();

	// Check if the booking exists and belongs to the user
	const { data: existingBooking, error: fetchError } = await supabase
		.from("bookings")
		.select("id, user_id")
		.eq("id", id)
		.single();

	if (fetchError) {
		throw new NotFoundError("Booking not found");
	}

	if (existingBooking.user_id !== userId) {
		throw new ForbiddenError(
			"You do not have permission to delete this booking"
		);
	}

	// Delete the booking
	const { error } = await supabase.from("bookings").delete().eq("id", id);

	if (error) {
		throw new DatabaseError(error.message);
	}

	return new NextResponse(null, { status: 204 });
}

export const GET = withErrorHandler(withAuth(getBooking));
export const PUT = withErrorHandler(withAuth(updateBooking));
export const DELETE = withErrorHandler(withAuth(deleteBooking));
