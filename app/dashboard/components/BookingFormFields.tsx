"use client";

import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { Service } from "@/types";
import { BookingFormValues } from "@/lib/form-schemas";

interface BookingFormFieldsProps {
	form: UseFormReturn<BookingFormValues>;
	services: Service[];
}

export function BookingFormFields({ form, services }: BookingFormFieldsProps) {
	const { isSubmitting } = form.formState;

	return (
		<>
			<FormField
				control={form.control}
				name="service_id"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Service</FormLabel>
						<Select
							onValueChange={field.onChange}
							defaultValue={field.value}
							disabled={isSubmitting}
						>
							<FormControl>
								<SelectTrigger>
									<SelectValue placeholder="Select a service" />
								</SelectTrigger>
							</FormControl>
							<SelectContent>
								{services.map((service) => (
									<SelectItem key={service.id} value={service.id}>
										{service.name} - Rs. {service.price.toFixed(2)}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<FormMessage />
					</FormItem>
				)}
			/>
			<FormField
				control={form.control}
				name="customer_name"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Your Name</FormLabel>
						<FormControl>
							<Input {...field} disabled={isSubmitting} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name="address"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Service Address</FormLabel>
						<FormControl>
							<Textarea {...field} disabled={isSubmitting} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name="date_time"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Date & Time</FormLabel>
						<FormControl>
							<Input type="datetime-local" {...field} disabled={isSubmitting} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
		</>
	);
}
