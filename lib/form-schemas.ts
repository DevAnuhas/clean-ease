import { z } from "zod";

// Schema for booking form validation
export const bookingFormSchema = z.object({
	customer_name: z.string().min(1, "Customer name is required"),
	address: z.string().min(1, "Address is required"),
	date_time: z.string().refine((date) => !isNaN(Date.parse(date)), {
		message: "Invalid date format",
	}),
	service_id: z.string().uuid("Please select a valid service"),
});

export type BookingFormValues = z.infer<typeof bookingFormSchema>;
