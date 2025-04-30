import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { serviceSchema } from "@/lib/types";
import { validateRequest } from "@/lib/api-utils";
import { withErrorHandler, withAdminAuth } from "@/middleware/error-handler";
import { DatabaseError } from "@/lib/errors";

// GET /api/services - Get all services (public)
async function getServices() {
	const supabase = await createClient();

	const { data, error } = await supabase
		.from("services")
		.select("*")
		.order("name");

	if (error) {
		throw new DatabaseError(error.message);
	}

	return NextResponse.json(data);
}

// POST /api/services - Create a new service (admin only)
async function createService(req: NextRequest) {
	const serviceData = await validateRequest(req, serviceSchema);
	const supabase = await createClient();

	const { data, error } = await supabase
		.from("services")
		.insert(serviceData)
		.select()
		.single();

	if (error) {
		throw new DatabaseError(error.message);
	}

	return NextResponse.json(data, { status: 201 });
}

// Public endpoint - no auth required
export const GET = withErrorHandler(getServices);
// Admin only endpoint
export const POST = withErrorHandler(withAdminAuth(createService));
