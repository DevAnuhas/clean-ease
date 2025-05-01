"use client";

import { format } from "date-fns";
import {
	DialogClose,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import LoadingSpinner from "@/components/ui/spinner";
import type { Booking } from "@/types";
import { useAdmin } from "@/lib/use-admin";
import { getBooking, getServices, updateBooking } from "@/lib/api-client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface BookingDetailsProps {
	bookingId: string;
	onUpdateStatus: (
		id: string,
		status: "pending" | "confirmed" | "completed" | "cancelled"
	) => void;
}

const BookingDetails = ({ bookingId, onUpdateStatus }: BookingDetailsProps) => {
	const [booking, setBooking] = useState<Booking | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const { isAdmin } = useAdmin();
	const router = useRouter();
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

	useEffect(() => {
		loadData();
	}, [bookingId]);

	async function loadData() {
		try {
			const [bookingData, servicesData] = await Promise.all([
				getBooking(bookingId),
				getServices(),
			]);

			const bookingService = servicesData.find(
				(s) => s.id === bookingData.service_id
			);

			setBooking({
				...bookingData,
				service: bookingService ?? undefined,
			});
		} catch (error) {
			setError("Error loading data: " + error);
		} finally {
			setIsLoading(false);
		}
	}

	if (isLoading) return <LoadingSpinner />;
	if (!booking) return <div>Booking not found</div>;

	const handleStatusChange = async (status: Booking["status"]) => {
		setIsUpdating(true);
		try {
			await updateBooking(booking.id, { status });
			if (onUpdateStatus) {
				onUpdateStatus(booking.id, status);
			} else {
				// Refresh the page to show updated data
				router.refresh();
			}
		} catch (error) {
			console.error("Error updating booking status:", error);
		} finally {
			setIsUpdating(false);
		}
	};

	return (
		<div className="animate-in fade-in zoom-in-95 duration-400 space-y-4">
			<DialogHeader>
				<DialogTitle>Booking Details</DialogTitle>
				<DialogDescription>
					Complete information about this booking
				</DialogDescription>
			</DialogHeader>

			{error && <div className="text-red-500">{error}</div>}

			<div className="py-4 space-y-4">
				<div className="grid grid-cols-2 gap-4">
					<div>
						<h3 className="text-sm font-medium text-gray-500">Service</h3>
						<p className="mt-1 text-base font-medium">
							{booking.service?.name || "Unknown Service"}
						</p>
					</div>

					<div>
						<h3 className="text-sm font-medium text-gray-500">Status</h3>
						<div className="mt-1">
							<Badge variant={getStatusColor(booking.status)}>
								{booking.status.charAt(0).toUpperCase() +
									booking.status.slice(1)}
							</Badge>
						</div>
					</div>
				</div>

				<div>
					<h3 className="text-sm font-medium text-gray-500">Customer</h3>
					<p className="mt-1">{booking.customer_name}</p>
				</div>

				<div>
					<h3 className="text-sm font-medium text-gray-500">Address</h3>
					<p className="mt-1">{booking.address}</p>
				</div>

				<div className="grid grid-cols-2 gap-4">
					<div>
						<h3 className="text-sm font-medium text-gray-500">Date & Time</h3>
						<p className="mt-1">
							{format(new Date(booking.date_time), "PPP p")}
						</p>
					</div>

					<div>
						<h3 className="text-sm font-medium text-gray-500">
							Booking Created
						</h3>
						<p className="mt-1">
							{format(new Date(booking.created_at), "PPP")}
						</p>
					</div>
				</div>

				<div>
					<h3 className="text-sm font-medium text-gray-500">Service Details</h3>
					<p className="mt-1">
						{booking.service?.description || "No details available"}
					</p>
				</div>

				<div>
					<h3 className="text-sm font-medium text-gray-500">Price</h3>
					<p className="mt-1 text-lg font-bold">
						Rs. {booking.service?.price.toFixed(2) || "0.00"}
					</p>
				</div>

				{isAdmin &&
					booking.status !== "cancelled" &&
					booking.status !== "completed" && (
						<div className="border-t pt-4 mt-4">
							<h3 className="text-sm font-medium text-gray-500 mb-2">
								Update Status
							</h3>
							<div className="flex gap-2">
								{booking.status !== "pending" && (
									<Button
										variant="outline"
										size="sm"
										onClick={() => handleStatusChange("pending")}
										disabled={isUpdating}
									>
										Mark as Pending
									</Button>
								)}
								{booking.status !== "confirmed" && (
									<Button
										variant="outline"
										size="sm"
										onClick={() => handleStatusChange("confirmed")}
										className="bg-green-50 text-green-700 hover:bg-green-100"
										disabled={isUpdating}
									>
										Confirm
									</Button>
								)}
								{booking.status === "confirmed" && (
									<Button
										variant="outline"
										size="sm"
										onClick={() => handleStatusChange("completed")}
										className="bg-blue-50 text-blue-700 hover:bg-blue-100"
										disabled={isUpdating}
									>
										Mark Complete
									</Button>
								)}
								{(booking.status === "pending" ||
									booking.status === "confirmed") && (
									<Button
										variant="outline"
										size="sm"
										onClick={() => handleStatusChange("cancelled")}
										className="bg-red-50 text-red-700 hover:bg-red-100"
										disabled={isUpdating}
									>
										Cancel
									</Button>
								)}
							</div>
						</div>
					)}
			</div>

			<DialogFooter>
				<DialogClose asChild>
					<Button variant="outline">Close</Button>
				</DialogClose>
			</DialogFooter>
		</div>
	);
};

export default BookingDetails;
