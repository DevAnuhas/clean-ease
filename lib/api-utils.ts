import { NextResponse } from "next/server";
import { ZodError, type ZodSchema } from "zod";
import type { ErrorResponse } from "./types";

export async function validateRequest<T>(
	req: Request,
	schema: ZodSchema<T>
): Promise<
	{ success: true; data: T } | { success: false; error: ErrorResponse }
> {
	try {
		const body = await req.json();
		const data = schema.parse(body);
		return { success: true, data };
	} catch (error) {
		if (error instanceof ZodError) {
			return {
				success: false,
				error: {
					error: error.errors
						.map((e) => `${e.path.join(".")}: ${e.message}`)
						.join(", "),
					status: 400,
				},
			};
		}

		return {
			success: false,
			error: {
				error: "Invalid request body",
				status: 400,
			},
		};
	}
}

export function errorResponse(message: string, status = 400): Response {
	return NextResponse.json({ error: message }, { status });
}
