/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { AppError, UnauthorizedError, ForbiddenError } from "@/lib/errors";
import { createClient } from "@/utils/supabase/server";

export type ApiHandler = (
	req: NextRequest,
	context?: any
) => Promise<NextResponse>;

export function withErrorHandler(handler: ApiHandler): ApiHandler {
	return async (req: NextRequest, context?: any) => {
		try {
			return await handler(req, context);
		} catch (error) {
			console.error("API Error:", error);

			// Handle known error types
			if (error instanceof AppError) {
				return NextResponse.json(
					{ error: error.message },
					{ status: error.statusCode }
				);
			}

			// Handle Zod validation errors
			if (error instanceof ZodError) {
				const message = error.errors
					.map((e) => `${e.path.join(".")}: ${e.message}`)
					.join(", ");
				return NextResponse.json({ error: message }, { status: 400 });
			}

			// Handle Supabase errors
			if (
				error instanceof Error &&
				"code" in error &&
				typeof error.code === "string"
			) {
				// PostgreSQL error codes
				if (error.code === "PGRST116") {
					return NextResponse.json(
						{ error: "Resource not found" },
						{ status: 404 }
					);
				}

				if (error.code === "23505") {
					return NextResponse.json(
						{ error: "Duplicate entry" },
						{ status: 409 }
					);
				}

				if (error.code === "23503") {
					return NextResponse.json(
						{ error: "Referenced resource not found" },
						{ status: 400 }
					);
				}
			}

			// Handle unknown errors
			return NextResponse.json(
				{ error: "Internal server error" },
				{ status: 500 }
			);
		}
	};
}

export function withAuth(handler: ApiHandler): ApiHandler {
	return async (req: NextRequest, context?: any) => {
		try {
			const supabase = await createClient();
			const {
				data: { user },
				error,
			} = await supabase.auth.getUser();

			if (error || !user) {
				throw new UnauthorizedError("Authentication required");
			}

			// Add user to request for downstream handlers
			const requestWithUser = new NextRequest(req, {
				headers: {
					...Object.fromEntries(req.headers.entries()),
					"x-user-id": user.id,
				},
			});

			return handler(requestWithUser, context);
		} catch (error) {
			if (error instanceof AppError) {
				return NextResponse.json(
					{ error: error.message },
					{ status: error.statusCode }
				);
			}

			return NextResponse.json(
				{ error: "Authentication failed" },
				{ status: 401 }
			);
		}
	};
}

export function withAdminAuth(handler: ApiHandler): ApiHandler {
	return async (req: NextRequest, context?: any) => {
		try {
			const supabase = await createClient();
			const {
				data: { user },
				error,
			} = await supabase.auth.getUser();

			if (error || !user) {
				throw new UnauthorizedError("Authentication required");
			}

			// Check if user is an admin
			// Since we don't have a user_roles table, we'll use a custom claim or email domain check
			// This is a simplified example - in production, you should use a proper role system
			const isAdmin = user.email?.endsWith("@youradmindomain.com") || false;

			if (!isAdmin) {
				throw new ForbiddenError("Admin access required");
			}

			// Add user to request for downstream handlers
			const requestWithUser = new NextRequest(req, {
				headers: {
					...Object.fromEntries(req.headers.entries()),
					"x-user-id": user.id,
					"x-is-admin": "true",
				},
			});

			return handler(requestWithUser, context);
		} catch (error) {
			if (error instanceof AppError) {
				return NextResponse.json(
					{ error: error.message },
					{ status: error.statusCode }
				);
			}

			return NextResponse.json(
				{ error: "Admin authentication failed" },
				{ status: 403 }
			);
		}
	};
}
