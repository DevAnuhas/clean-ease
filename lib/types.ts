import { z } from "zod";
import type { Database } from "@/types/supabase";

// Service schema for validation
export const serviceSchema = z.object({
	name: z.string().min(1, "Service name is required"),
	description: z.string().min(1, "Description is required"),
	price: z.number().positive("Price must be a positive number"),
});

export type Service = Database["public"]["Tables"]["services"]["Row"];

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

export type Booking = Database["public"]["Tables"]["bookings"]["Row"];

// Error response type
export type ErrorResponse = {
	error: string;
	status: number;
};
