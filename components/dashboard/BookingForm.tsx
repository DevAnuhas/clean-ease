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
import { toast } from "sonner";
import LoadingSpinner from "@/components/ui/spinner";
import { BookingFormFields } from "./BookingFormFields";
import type { Service, Booking } from "@/types";
import { getServices } from "@/lib/api-client";
import { bookingFormSchema, type BookingFormValues } from "@/lib/form-schemas";

interface BookingFormProps {
	onSubmit: (data: BookingFormValues) => Promise<void>;
	booking?: Partial<Booking>;
}

export default function BookingForm({ onSubmit, booking }: BookingFormProps) {
	const [services, setServices] = useState<Service[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	const form = useForm<BookingFormValues>({
		resolver: zodResolver(bookingFormSchema),
		defaultValues: {
			customer_name: booking?.customer_name || "",
			address: booking?.address || "",
			date_time: booking?.date_time || "",
			service_id: booking?.service_id || "",
			status: booking?.status || "pending",
		},
	});

	useEffect(() => {
		const fetchServices = async () => {
			try {
				const serviceData = await getServices();
				setServices(serviceData);
			} catch (error) {
				console.error("Failed to fetch services:", error);
				toast.error("Error", {
					description: "Failed to load services. Please try again later.",
				});
			} finally {
				setIsLoading(false);
			}
		};
		fetchServices();
	}, []);

	const handleSubmit = async (data: BookingFormValues) => {
		try {
			await onSubmit(data);
		} catch (error) {
			console.error("Error submitting booking:", error);
			toast.error("Error", {
				description: "Failed to save booking. Please try again.",
			});
		} finally {
			setIsLoading(false);
		}
	};

	if (isLoading) return <LoadingSpinner />;

	return (
		<div className="animate-in fade-in zoom-in-100 duration-400 space-y-4">
			<DialogHeader>
				<DialogTitle className="text-2xl font-bold">
					{booking ? "Edit Booking Details" : "Book a Service"}
				</DialogTitle>
				<DialogDescription>
					{booking
						? "Edit the details of your booking"
						: "Book a service for your cleaning needs"}
				</DialogDescription>
			</DialogHeader>

			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(handleSubmit)}
					className="py-4 space-y-4"
				>
					<BookingFormFields form={form} services={services} />
					<DialogFooter className="flex justify-end gap-2 pt-4">
						<DialogClose asChild>
							<Button variant="outline">Cancel</Button>
						</DialogClose>
						<Button type="submit" disabled={form.formState.isSubmitting}>
							{form.formState.isSubmitting
								? "Submitting..."
								: booking
								? "Save Changes"
								: "Book Service"}
						</Button>
					</DialogFooter>
				</form>
			</Form>
		</div>
	);
}
