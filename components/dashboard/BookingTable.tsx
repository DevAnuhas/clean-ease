"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import type { Booking, Service } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit, X } from "lucide-react";
import { deleteBooking, updateBooking } from "@/lib/api-client";
import { useAdmin } from "@/lib/use-admin";

interface BookingTableProps {
	bookings: Booking[];
	services: Service[];
	onNewBooking?: () => void;
	onDelete?: (id: string) => void;
	onStatusUpdate?: (id: string, status: Booking["status"]) => void;
	onViewDetails?: (id: string) => void;
	onEditBooking?: (id: string) => void;
}

const BookingTable = ({
	bookings,
	services,
	onNewBooking,
	onDelete,
	onStatusUpdate,
	onViewDetails,
	onEditBooking,
}: BookingTableProps) => {
	const { isAdmin } = useAdmin();
	const router = useRouter();
	const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
	const [isDeleting, setIsDeleting] = useState(false);

	if (!bookings.length) {
		return (
			<Card className="w-full">
				<CardHeader>
					<CardTitle>No Bookings</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-center text-gray-500 py-8">
						You don&apos;t have any bookings yet.
					</p>
					<Button onClick={onNewBooking} className="mx-auto flex">
						Book a Service
					</Button>
				</CardContent>
			</Card>
		);
	}

	const getServiceName = (serviceId: string) => {
		const service = services.find((s) => s.id === serviceId);
		return service ? service.name : "Unknown Service";
	};

	const getStatusVariant = (
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

	const handleDelete = (id: string) => {
		setConfirmDelete(id);
	};

	const confirmDeleteBooking = async () => {
		if (confirmDelete) {
			setIsDeleting(true);
			try {
				await deleteBooking(confirmDelete);
				if (onDelete) {
					onDelete(confirmDelete);
				} else {
					// Refresh the page to show updated data
					router.refresh();
				}
			} catch (error) {
				console.error("Error deleting booking:", error);
			} finally {
				setIsDeleting(false);
				setConfirmDelete(null);
			}
		}
	};

	const handleStatusChange = async (id: string, status: Booking["status"]) => {
		try {
			await updateBooking(id, {
				status,
				customer_name: "",
				address: "",
				date_time: "",
				service_id: "",
			});
			if (onStatusUpdate) {
				onStatusUpdate(id, status);
			} else {
				// Refresh the page to show updated data
				router.refresh();
			}
		} catch (error) {
			console.error("Error updating booking status:", error);
		}
	};

	return (
		<>
			<Card>
				<CardHeader>
					<CardTitle>Bookings</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="rounded-md border overflow-auto">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Service</TableHead>
									<TableHead className="hidden md:table-cell">Date</TableHead>
									<TableHead className="hidden lg:table-cell">
										Customer
									</TableHead>
									<TableHead>Status</TableHead>
									<TableHead className="text-right">Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{bookings.map((booking) => (
									<TableRow key={booking.id}>
										<TableCell>
											<div>
												<p className="font-medium">
													{getServiceName(booking.service_id)}
												</p>
												<p className="text-sm text-muted-foreground md:hidden">
													{format(new Date(booking.date_time), "PPP")}
												</p>
											</div>
										</TableCell>
										<TableCell className="hidden md:table-cell">
											{format(new Date(booking.date_time), "PPP")}
										</TableCell>
										<TableCell className="max-w-[200px] truncate hidden lg:table-cell">
											{booking.customer_name}
										</TableCell>
										<TableCell>
											<Badge variant={getStatusVariant(booking.status)}>
												{booking.status.charAt(0).toUpperCase() +
													booking.status.slice(1)}
											</Badge>
										</TableCell>
										<TableCell className="text-right">
											<div className="flex justify-end gap-2">
												{/* View details button */}
												{onViewDetails && (
													<Button
														size="sm"
														variant="outline"
														onClick={() => onViewDetails(booking.id)}
														className="h-8 w-8 p-0"
													>
														<Eye className="h-4 w-4" />
														<span className="sr-only">View details</span>
													</Button>
												)}

												{/* Only show status change options for admin */}
												{isAdmin && booking.status !== "cancelled" && (
													<select
														value={booking.status}
														onChange={(e) =>
															handleStatusChange(
																booking.id,
																e.target.value as Booking["status"]
															)
														}
														className="text-xs rounded border px-2 py-1"
													>
														<option value="pending">Pending</option>
														<option value="confirmed">Confirmed</option>
														<option value="completed">Completed</option>
														<option value="cancelled">Cancelled</option>
													</select>
												)}

												{/* Show edit button for non-cancelled bookings */}
												{onEditBooking &&
													booking.status !== "cancelled" &&
													booking.status !== "completed" && (
														<Button
															size="sm"
															variant="outline"
															onClick={() => onEditBooking(booking.id)}
															className="h-8 w-8 p-0"
														>
															<Edit className="h-4 w-4" />
															<span className="sr-only">Edit</span>
														</Button>
													)}
												{}

												{/* Show cancel button for non-completed, non-cancelled bookings */}
												{booking.status !== "completed" &&
													booking.status !== "cancelled" && (
														<Button
															size="sm"
															variant="destructive"
															onClick={() => handleDelete(booking.id)}
															className="h-8 w-8 p-0"
														>
															<X className="h-4 w-4" />
															<span className="sr-only">Cancel</span>
														</Button>
													)}
											</div>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				</CardContent>
			</Card>

			<Dialog
				open={!!confirmDelete}
				onOpenChange={(open) => !open && setConfirmDelete(null)}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Cancel Booking</DialogTitle>
						<DialogDescription>
							Are you sure you want to cancel this booking? This action cannot
							be undone.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setConfirmDelete(null)}
							disabled={isDeleting}
						>
							Close
						</Button>
						<Button
							variant="destructive"
							onClick={confirmDeleteBooking}
							disabled={isDeleting}
						>
							{isDeleting ? "Cancelling..." : "Yes, Cancel Booking"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default BookingTable;
