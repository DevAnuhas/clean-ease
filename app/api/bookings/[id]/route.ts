import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { bookingSchema } from "@/lib/types";
import { validateRequest, errorResponse } from "@/lib/api-utils";
import { requireUser } from "@/lib/auth";

type Params = {
	id: string;
};

// GET /api/bookings/[id] - Get a specific booking
export async function GET(req: NextRequest, { params }: { params: Params }) {
	try {
		const user = await requireUser();
		const supabase = await createClient();

		const { data, error } = await supabase
			.from("bookings")
			.select("*, services(*)")
			.eq("id", params.id)
			.eq("user_id", user.id)
			.single();

		if (error) {
			return errorResponse(
				error.message,
				error.code === "PGRST116" ? 404 : 500
			);
		}

		return NextResponse.json(data);
	} catch (error) {
		console.error("Error fetching booking:", error);
		return errorResponse("Failed to fetch booking", 500);
	}
}

// PUT /api/bookings/[id] - Update a booking
export async function PUT(req: NextRequest, { params }: { params: Params }) {
	try {
		const user = await requireUser();
		const validation = await validateRequest(req, bookingSchema);

		if (!validation.success) {
			return errorResponse(validation.error.error, validation.error.status);
		}

		const bookingData = validation.data;
		const supabase = await createClient();

		// Check if the booking exists and belongs to the user
		const { data: existingBooking, error: fetchError } = await supabase
			.from("bookings")
			.select("id, user_id")
			.eq("id", params.id)
			.single();

		if (fetchError || !existingBooking) {
			return errorResponse("Booking not found", 404);
		}

		if (existingBooking.user_id !== user.id) {
			return errorResponse(
				"You do not have permission to update this booking",
				403
			);
		}

		// Update the booking
		const { data, error } = await supabase
			.from("bookings")
			.update(bookingData)
			.eq("id", params.id)
			.select()
			.single();

		if (error) {
			return errorResponse(error.message, 500);
		}

		return NextResponse.json(data);
	} catch (error) {
		console.error("Error updating booking:", error);
		return errorResponse("Failed to update booking", 500);
	}
}

// DELETE /api/bookings/[id] - Delete a booking
export async function DELETE(req: NextRequest, { params }: { params: Params }) {
	try {
		const user = await requireUser();
		const supabase = await createClient();

		// Check if the booking exists and belongs to the user
		const { data: existingBooking, error: fetchError } = await supabase
			.from("bookings")
			.select("id, user_id")
			.eq("id", params.id)
			.single();

		if (fetchError || !existingBooking) {
			return errorResponse("Booking not found", 404);
		}

		if (existingBooking.user_id !== user.id) {
			return errorResponse(
				"You do not have permission to delete this booking",
				403
			);
		}

		// Delete the booking
		const { error } = await supabase
			.from("bookings")
			.delete()
			.eq("id", params.id);

		if (error) {
			return errorResponse(error.message, 500);
		}

		return new NextResponse(null, { status: 204 });
	} catch (error) {
		console.error("Error deleting booking:", error);
		return errorResponse("Failed to delete booking", 500);
	}
}
