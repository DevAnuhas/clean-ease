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
import { getBooking, getServices, updateBooking } from "@/lib/api-client";
import { bookingFormSchema, type BookingFormValues } from "@/lib/form-schemas";
import type { Service, Booking } from "@/types";
import { format } from "date-fns";

interface EditBookingFormProps {
	bookingId: string;
	onSuccess: (booking: Booking) => void;
}

export default function EditBookingForm({
	bookingId,
	onSuccess,
}: EditBookingFormProps) {
	const [booking, setBooking] = useState<Booking | null>(null);
	const [services, setServices] = useState<Service[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const form = useForm<BookingFormValues>({
		resolver: zodResolver(bookingFormSchema),
	});

	useEffect(() => {
		loadData();
	});

	async function loadData() {
		try {
			const [bookingData, servicesData] = await Promise.all([
				getBooking(bookingId),
				getServices(),
			]);

			setBooking(bookingData);
			setServices(servicesData);

			form.reset({
				customer_name: bookingData.customer_name,
				address: bookingData.address,
				date_time: format(
					new Date(bookingData.date_time),
					"yyyy-MM-dd'T'HH:mm"
				),
				service_id: bookingData.service_id,
			});
		} catch {
			setError("Failed to load booking data");
		} finally {
			setIsLoading(false);
		}
	}

	async function onSubmit(data: BookingFormValues) {
		try {
			const updated = await updateBooking(bookingId, data);
			onSuccess(updated);
		} catch {
			setError("Failed to update booking");
		}
	}

	if (isLoading) return <LoadingSpinner />;
	if (!booking) return <div>Booking not found</div>;

	return (
		<>
			<DialogHeader>
				<DialogTitle>Edit Booking</DialogTitle>
				<DialogDescription>Update the booking details</DialogDescription>
			</DialogHeader>

			{error && <div className="text-red-500">{error}</div>}

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
					<BookingFormFields form={form} services={services} />
					<DialogFooter>
						<DialogClose asChild>
							<Button variant="outline">Cancel</Button>
						</DialogClose>
						<Button type="submit" disabled={form.formState.isSubmitting}>
							{form.formState.isSubmitting ? "Saving..." : "Save Changes"}
						</Button>
					</DialogFooter>
				</form>
			</Form>
		</>
	);
}
