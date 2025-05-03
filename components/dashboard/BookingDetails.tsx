"use client";

import { format } from "date-fns";
import {
	DialogClose,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
} from "@/components/ui/dialog";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import type { Booking } from "@/types";
import { updateBooking } from "@/lib/api-client";
import { useState } from "react";

interface BookingDetailsProps {
	booking: Booking;
	onEdit?: () => void;
	onCancel?: () => void;
	onBookingChange?: () => void;
	isAdmin?: boolean;
}

const BookingDetails = ({
	booking,
	onEdit,
	onCancel,
	onBookingChange,
	isAdmin,
}: BookingDetailsProps) => {
	const [isUpdating, setIsUpdating] = useState(false);

	const getStatusColor = (
		status: Booking["status"]
	): "default" | "destructive" | "outline" | "secondary" | null => {
		switch (status) {
			case "confirmed":
				return "default";
			case "pending":
				return "secondary";
			case "completed":
				return "default";
			case "cancelled":
				return "destructive";
			default:
				return "outline";
		}
	};

	const handleStatusChange = async (id: string, status: Booking["status"]) => {
		setIsUpdating(true);
		try {
			await updateBooking(id, {
				...booking,
				status,
			});
			toast.success(`Booking status updated to ${status}`);
			onBookingChange?.();
		} catch (error) {
			console.error("Error updating booking status:", error);
			toast.error("Error", {
				description:
					"There was a problem updating the booking status. Please try again.",
			});
		} finally {
			setIsUpdating(false);
		}
	};

	return (
		<div className="space-y-4">
			<DialogHeader>
				<DialogTitle className="text-2xl font-bold text-left">
					Booking Details
				</DialogTitle>
				<DialogDescription className="flex items-center justify-between text-md font-medium">
					<span>Booking #{parseInt(booking.id.substring(0, 5), 16)}</span>
					<Badge variant={getStatusColor(booking.status)}>
						{booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
					</Badge>
				</DialogDescription>
			</DialogHeader>

			<div className="py-4 space-y-4">
				<div className="grid grid-cols-2 gap-4">
					<div>
						<h3 className="text-sm font-medium text-muted-foreground">
							Customer
						</h3>
						<p className="mt-1">{booking.customer_name}</p>
					</div>

					<div>
						<h3 className="text-sm font-medium text-muted-foreground">
							Service Address
						</h3>
						<p className="mt-1">{booking.address}</p>
					</div>
				</div>

				<div className="grid grid-cols-2 gap-4">
					<div>
						<h3 className="text-sm font-medium text-muted-foreground">
							Service Date & Time
						</h3>
						<p className="mt-1">
							{format(new Date(booking.date_time), "PPP p")}
						</p>
					</div>

					<div>
						<h3 className="text-sm font-medium text-muted-foreground">
							Booking Created
						</h3>
						<p className="mt-1">
							{format(new Date(booking.created_at), "PPP p")}
						</p>
					</div>
				</div>

				<div className="border-t pt-4">
					<h3 className="text-sm font-medium text-muted-foreground">
						Service Details
					</h3>
					<div className="mt-2 bg-muted p-4 rounded-md">
						<div className="flex justify-between items-center">
							<span className="text-sm font-medium">
								{booking.service?.name}
							</span>
							<span className="text-md font-semibold tracking-tight">
								Rs.{" "}
								{typeof booking.service?.price === "number"
									? booking.service.price.toLocaleString("en", {
											minimumFractionDigits: 2,
											maximumFractionDigits: 2,
									  })
									: "0.00"}
							</span>
						</div>
						<p className="mt-1 text-xs text-muted-foreground">
							{booking.service?.description}
						</p>
					</div>
				</div>

				{isAdmin &&
					booking.status !== "cancelled" &&
					booking.status !== "completed" && (
						<div className="border-t pt-4 mt-4">
							<h3 className="text-sm font-medium text-muted-foreground mb-2">
								Update Status
							</h3>
							<Select
								onValueChange={(value) =>
									handleStatusChange(booking.id, value as Booking["status"])
								}
							>
								<SelectTrigger className="w-[180px]" disabled={isUpdating}>
									<SelectValue
										placeholder={
											booking.status.charAt(0).toUpperCase() +
											booking.status.slice(1)
										}
									/>
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										<SelectItem value="pending">Pending</SelectItem>
										<SelectItem value="confirmed">Confirmed</SelectItem>
										<SelectItem value="completed">Completed</SelectItem>
									</SelectGroup>
								</SelectContent>
							</Select>
						</div>
					)}
			</div>

			<DialogFooter>
				{(booking.status === "pending" || !isAdmin) && onCancel && (
					<Button variant="destructive" onClick={onCancel}>
						Cancel Booking
					</Button>
				)}
				{(booking.status === "pending" || isAdmin) && onEdit && (
					<Button variant="default" onClick={onEdit}>
						Edit Booking
					</Button>
				)}
				<DialogClose asChild>
					<Button variant="outline">Close</Button>
				</DialogClose>
			</DialogFooter>
		</div>
	);
};

export default BookingDetails;
