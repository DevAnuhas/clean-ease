import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { serviceSchema } from "@/lib/types";
import { validateRequest, errorResponse } from "@/lib/api-utils";
import { requireAdmin } from "@/lib/auth";

// GET /api/services - Get all services (public)
export async function GET() {
	try {
		const supabase = await createClient();

		const { data, error } = await supabase
			.from("services")
			.select("*")
			.order("name");

		if (error) {
			return errorResponse(error.message, 500);
		}

		return NextResponse.json(data);
	} catch (error) {
		console.error("Error fetching services:", error);
		return errorResponse("Failed to fetch services", 500);
	}
}

// POST /api/services - Create a new service (admin only)
export async function POST(req: NextRequest) {
	try {
		// Check if user is admin
		await requireAdmin();

		const validation = await validateRequest(req, serviceSchema);

		if (!validation.success) {
			return errorResponse(validation.error.error, validation.error.status);
		}

		const serviceData = validation.data;
		const supabase = await createClient();

		const { data, error } = await supabase
			.from("services")
			.insert(serviceData)
			.select()
			.single();

		if (error) {
			return errorResponse(error.message, 500);
		}

		return NextResponse.json(data, { status: 201 });
	} catch (error) {
		console.error("Error creating service:", error);
		return errorResponse("Failed to create service", 500);
	}
}
