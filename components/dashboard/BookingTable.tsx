"use client";

import { useState } from "react";
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
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import BookingDetails from "@/components/dashboard/BookingDetails";
import BookingForm from "@/components/dashboard/BookingForm";
import { Plus } from "lucide-react";
import type { Booking } from "@/types";
import { Eye } from "lucide-react";
import { createBooking, deleteBooking, updateBooking } from "@/lib/api-client";
import { useAdmin } from "@/lib/use-admin";
import { type BookingFormValues } from "@/lib/form-schemas";

interface BookingTableProps {
	bookings: Booking[];
	userId: string;
	onBookingChange?: () => void;
}

const BookingTable = ({
	bookings,
	userId,
	onBookingChange,
}: BookingTableProps) => {
	const { isAdmin } = useAdmin();
	const [isNewBookingDialogOpen, setIsNewBookingDialogOpen] = useState(false);
	const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleCreateBooking = async (data: BookingFormValues) => {
		setIsSubmitting(true);
		try {
			const newBooking = {
				...data,
				user_id: userId,
				status: "pending" as Booking["status"],
			};

			await createBooking(newBooking);
			toast.success("Your booking has been created successfully");
			setIsNewBookingDialogOpen(false);
			onBookingChange?.();
		} catch (error) {
			console.error("Error creating booking:", error);
			toast.error("Error", {
				description:
					"There was a problem creating your booking. Please try again.",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleUpdateBooking = async (data: BookingFormValues) => {
		if (!selectedBooking) return;

		setIsSubmitting(true);
		try {
			await updateBooking(selectedBooking.id, {
				...data,
				status: data.status as Booking["status"],
			});

			toast.success("Your booking has been updated successfully");
			setIsEditDialogOpen(false);
			onBookingChange?.();
		} catch (error) {
			console.error("Error updating booking:", error);
			toast.error("Error", {
				description:
					"There was a problem updating your booking. Please try again.",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleDeleteBooking = async () => {
		if (!selectedBooking) return;

		setIsSubmitting(true);
		try {
			await deleteBooking(selectedBooking.id);
			toast.success("Your booking has been cancelled successfully");
			setIsDeleteDialogOpen(false);
			onBookingChange?.();
		} catch (error) {
			console.error("Error cancelling booking:", error);
			toast.error("Error", {
				description:
					"There was a problem cancelling your booking. Please try again.",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	const openViewDialog = (booking: Booking) => {
		setSelectedBooking(booking);
		setIsViewDialogOpen(true);
	};

	const openEditDialog = (booking: Booking) => {
		setSelectedBooking(booking);
		setIsEditDialogOpen(true);
	};

	const openDeleteDialog = (booking: Booking) => {
		setSelectedBooking(booking);
		setIsDeleteDialogOpen(true);
	};

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
					<Button
						onClick={() => setIsNewBookingDialogOpen(true)}
						className="mx-auto flex"
					>
						<Plus className="mr-1 h-4 w-4" />
						Book a Service
					</Button>
				</CardContent>
			</Card>
		);
	}

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

	return (
		<>
			<Card>
				<CardHeader className="flex justify-between">
					<CardTitle>Bookings</CardTitle>
					{/* New Booking Dialog */}
					<Dialog
						open={isNewBookingDialogOpen}
						onOpenChange={setIsNewBookingDialogOpen}
					>
						<DialogTrigger asChild>
							<Button>
								<Plus className="mr-1 h-4 w-4" />
								New Booking
							</Button>
						</DialogTrigger>
						<DialogContent className="sm:max-w-[600px]">
							<BookingForm onSubmit={handleCreateBooking} />
						</DialogContent>
					</Dialog>
				</CardHeader>
				<CardContent>
					<div className="rounded-md border overflow-auto">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead className="pl-4">Service</TableHead>
									<TableHead className="hidden md:table-cell">
										Date & Time
									</TableHead>
									<TableHead className="hidden lg:table-cell">
										Address
									</TableHead>
									<TableHead>Status</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{bookings.map((booking) => (
									<TableRow key={booking.id}>
										<TableCell className="py-4 pl-4">
											<div>
												<p className="font-medium">{booking.service?.name}</p>
												<p className="text-sm text-muted-foreground tracking-tight">
													Rs.{" "}
													{typeof booking.service?.price === "number"
														? booking.service.price.toLocaleString("en", {
																minimumFractionDigits: 2,
																maximumFractionDigits: 2,
														  })
														: "0.00"}
												</p>
											</div>
										</TableCell>
										<TableCell className="hidden md:table-cell">
											{format(new Date(booking.date_time), "PPP p")}
										</TableCell>
										<TableCell className="max-w-[200px] truncate hidden lg:table-cell">
											{booking.address}
										</TableCell>
										<TableCell>
											<Badge variant={getStatusVariant(booking.status)}>
												{booking.status.charAt(0).toUpperCase() +
													booking.status.slice(1)}
											</Badge>
										</TableCell>
										<TableCell className="pr-4 text-right">
											<Button
												variant="outline"
												onClick={() => openViewDialog(booking)}
											>
												<Eye className="h-4 w-4 mr-1" />
												View details
											</Button>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				</CardContent>
			</Card>

			{/* View Dialog */}
			<Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
				<DialogContent className="sm:max-w-[600px]">
					{selectedBooking && (
						<BookingDetails
							booking={selectedBooking}
							onEdit={() => {
								setIsViewDialogOpen(false);
								openEditDialog(selectedBooking);
							}}
							isAdmin={isAdmin}
							onCancel={() => openDeleteDialog(selectedBooking)}
							onBookingChange={onBookingChange}
						/>
					)}
				</DialogContent>
			</Dialog>

			{/* Edit Dialog */}
			<Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
				<DialogContent className="sm:max-w-[600px]">
					{selectedBooking && (
						<BookingForm
							booking={selectedBooking}
							onSubmit={handleUpdateBooking}
						/>
					)}
				</DialogContent>
			</Dialog>

			{/* Delete Dialog */}
			<AlertDialog
				open={isDeleteDialogOpen}
				onOpenChange={setIsDeleteDialogOpen}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Cancel Booking</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to cancel this booking? This action cannot
							be undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel disabled={isSubmitting}>
							Cancel
						</AlertDialogCancel>
						<AlertDialogAction
							disabled={isSubmitting}
							onClick={(e: { preventDefault: () => void }) => {
								e.preventDefault();
								handleDeleteBooking();
							}}
							className="bg-destructive hover:bg-destructive/90"
						>
							{isSubmitting ? "Cancelling..." : "Yes, Cancel Booking"}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
};

export default BookingTable;
