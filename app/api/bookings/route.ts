import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { bookingSchema } from "@/lib/types";
import { validateRequest, errorResponse } from "@/lib/api-utils";
import { requireUser } from "@/lib/auth";

// GET /api/bookings - Get all bookings for the authenticated user
export async function GET() {
	try {
		const user = await requireUser();
		const supabase = await createClient();

		const { data, error } = await supabase
			.from("bookings")
			.select("*, services(*)")
			.eq("user_id", user.id);

		if (error) {
			return errorResponse(error.message, 500);
		}

		return NextResponse.json(data);
	} catch (error) {
		console.error("Error fetching bookings:", error);
		return errorResponse("Failed to fetch bookings", 500);
	}
}

// POST /api/bookings - Create a new booking
export async function POST(req: NextRequest) {
	try {
		const user = await requireUser();
		const validation = await validateRequest(req, bookingSchema);

		if (!validation.success) {
			return errorResponse(validation.error.error, validation.error.status);
		}

		const bookingData = validation.data;
		const supabase = await createClient();

		// Check if the service exists
		const { data: serviceExists, error: serviceError } = await supabase
			.from("services")
			.select("id")
			.eq("id", bookingData.service_id)
			.single();

		if (serviceError || !serviceExists) {
			return errorResponse("Service not found", 404);
		}

		// Insert the booking
		const { data, error } = await supabase
			.from("bookings")
			.insert({
				...bookingData,
				user_id: user.id,
				status: bookingData.status || "pending",
			})
			.select()
			.single();

		if (error) {
			return errorResponse(error.message, 500);
		}

		return NextResponse.json(data, { status: 201 });
	} catch (error) {
		console.error("Error creating booking:", error);
		return errorResponse("Failed to create booking", 500);
	}
}
