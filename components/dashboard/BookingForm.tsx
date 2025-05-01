"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
	DialogClose,
	DialogHeader,
	DialogFooter,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";
import LoadingSpinner from "@/components/ui/spinner";
import { BookingFormFields } from "./BookingFormFields";
import type { Service, Booking } from "@/types";
import { getServices, createBooking } from "@/lib/api-client";
import { bookingFormSchema, type BookingFormValues } from "@/lib/form-schemas";

interface BookingFormProps {
	onSuccess: (booking: Booking) => void;
}

export default function BookingForm({ onSuccess }: BookingFormProps) {
	const [services, setServices] = useState<Service[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const form = useForm<BookingFormValues>({
		resolver: zodResolver(bookingFormSchema),
		defaultValues: {
			customer_name: "",
			address: "",
			date_time: "",
			service_id: "",
		},
	});

	useEffect(() => {
		loadServices();
	}, []);

	async function loadServices() {
		try {
			const services = await getServices();
			setServices(services);
		} catch (error) {
			setError("Error loading data: " + error);
		} finally {
			setIsLoading(false);
		}
	}

	async function onSubmit(data: BookingFormValues) {
		try {
			const booking = await createBooking({
				...data,
				status: "pending",
			});
			onSuccess(booking);
		} catch {
			setError("Failed to create booking");
		}
	}

	if (isLoading) return <LoadingSpinner />;

	return (
		<div className="animate-in fade-in zoom-in-95 duration-400 space-y-4">
			<DialogHeader>
				<DialogTitle>Book a Service</DialogTitle>
				<DialogDescription>
					Book a service for your cleaning needs
				</DialogDescription>
			</DialogHeader>

			{error && <div className="text-red-500">{error}</div>}

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
					<BookingFormFields form={form} services={services} />
					<DialogFooter className="flex justify-end gap-2 pt-4">
						<DialogClose asChild>
							<Button variant="outline">Cancel</Button>
						</DialogClose>
						<Button type="submit" disabled={form.formState.isSubmitting}>
							{form.formState.isSubmitting ? "Booking..." : "Book Service"}
						</Button>
					</DialogFooter>
				</form>
			</Form>
		</div>
	);
}
