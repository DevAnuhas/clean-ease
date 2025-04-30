import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { bookingSchema } from "@/lib/types";
import { validateRequest } from "@/lib/api-utils";
import { requireUser } from "@/lib/auth";

// GET /api/bookings/[id] - Get a specific booking
export async function GET(
	request: NextRequest,
	{ params }: { params: { id: string } }
): Promise<NextResponse> {
	const user = await requireUser();
	const supabase = await createClient();

	const { data, error } = await supabase
		.from("bookings")
		.select("*, services(*)")
		.eq("id", params.id)
		.eq("user_id", user.id)
		.single();

	if (error) {
		return NextResponse.json(
			{ message: error.message },
			{ status: error.code === "PGRST116" ? 404 : 500 }
		);
	}

	return NextResponse.json(data);
}

// PUT /api/bookings/[id] - Update a booking
export async function PUT(
	request: Request,
	{ params }: { params: { id: string } }
): Promise<Response> {
	const user = await requireUser();
	const validation = await validateRequest(request, bookingSchema);

	if (!validation.success) {
		return NextResponse.json(
			{ message: validation.error.error },
			{ status: validation.error.status }
		);
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
		return NextResponse.json({ message: "Booking not found" }, { status: 404 });
	}

	if (existingBooking.user_id !== user.id) {
		return NextResponse.json(
			{ message: "You do not have permission to update this booking" },
			{ status: 403 }
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
		return NextResponse.json({ message: error.message }, { status: 500 });
	}

	return NextResponse.json(data);
}

// DELETE /api/bookings/[id] - Delete a booking
export async function DELETE(
	request: Request,
	{ params }: { params: { id: string } }
): Promise<Response> {
	const user = await requireUser();
	const supabase = await createClient();

	// Check if the booking exists and belongs to the user
	const { data: existingBooking, error: fetchError } = await supabase
		.from("bookings")
		.select("id, user_id")
		.eq("id", params.id)
		.single();

	if (fetchError || !existingBooking) {
		return NextResponse.json({ message: "Booking not found" }, { status: 404 });
	}

	if (existingBooking.user_id !== user.id) {
		return NextResponse.json(
			{ message: "You do not have permission to delete this booking" },
			{ status: 403 }
		);
	}

	// Delete the booking
	const { error } = await supabase
		.from("bookings")
		.delete()
		.eq("id", params.id);

	if (error) {
		return NextResponse.json({ message: error.message }, { status: 500 });
	}

	return new NextResponse(null, { status: 204 });
}
