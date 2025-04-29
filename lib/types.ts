import { z } from "zod";

// Service schema for validation
export const serviceSchema = z.object({
	name: z.string().min(1, "Service name is required"),
	description: z.string().min(1, "Description is required"),
	price: z.number().positive("Price must be a positive number"),
});

export type Service = z.infer<typeof serviceSchema> & {
	id: string;
	created_at: string;
};

// Booking schema for validation
export const bookingSchema = z.object({
	customer_name: z.string().min(1, "Customer name is required"),
	address: z.string().min(1, "Address is required"),
	date_time: z.string().refine((date) => !isNaN(Date.parse(date)), {
		message: "Invalid date format",
	}),
	service_id: z.string().uuid("Invalid service ID"),
	status: z.enum(["pending", "confirmed", "completed", "cancelled"]).optional(),
});

export type Booking = z.infer<typeof bookingSchema> & {
	id: string;
	user_id: string;
	created_at: string;
	status: "pending" | "confirmed" | "completed" | "cancelled";
};

// Error response type
export type ErrorResponse = {
	error: string;
	status: number;
};
