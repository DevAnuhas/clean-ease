import { type NextRequest, NextResponse } from "next/server";
import { ZodError, type ZodSchema } from "zod";
import { ValidationError } from "@/lib/errors";

export async function validateRequest<T>(
	req: NextRequest,
	schema: ZodSchema<T>
): Promise<T> {
	try {
		const body = await req.json();
		return schema.parse(body);
	} catch (error) {
		if (error instanceof ZodError) {
			const message = error.errors
				.map((e) => `${e.path.join(".")}: ${e.message}`)
				.join(", ");
			throw new ValidationError(message);
		}

		throw new ValidationError("Invalid request body");
	}
}

export function errorResponse(message: string, status = 400): NextResponse {
	return NextResponse.json({ error: message }, { status });
}
