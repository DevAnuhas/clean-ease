"use client";

import { Suspense, useState, useEffect } from "react";
import type { Booking, Service } from "@/types";
import { getBookings, getServices } from "@/lib/api-client";
import { useAdmin } from "@/lib/use-admin";

import LoadingSpinner from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import BookingTable from "@/app/dashboard/components/BookingTable";
import BookingForm from "@/app/dashboard/components/BookingForm";
import BookingDetails from "@/app/dashboard/components/BookingDetails";
import EditBookingForm from "@/app/dashboard/components/EditBookingForm";

export default function Dashboard() {
	const { isAdmin, isLoading: isAdminLoading } = useAdmin();
	const [bookings, setBookings] = useState<Booking[]>([]);
	const [services, setServices] = useState<Service[]>([]);
	const [statusFilter, setStatusFilter] = useState<string>("all");
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

	const [dialogState, setDialogState] = useState<{
		type: "new" | "edit" | "details" | null;
		bookingId?: string;
		isClosing?: boolean;
	}>({ type: null });

	const handleNewBooking = () => setDialogState({ type: "new" });
	const handleEditBooking = (id: string) =>
		setDialogState({ type: "edit", bookingId: id });
	const handleViewDetails = (id: string) =>
		setDialogState({ type: "details", bookingId: id });
	const handleCloseDialog = () => setDialogState({ type: null });

	useEffect(() => {
		async function fetchData() {
			try {
				const [bookingsData, servicesData] = await Promise.all([
					getBookings(),
					getServices(),
				]);

				// Add service details to each booking
				const bookingsWithServices = bookingsData.map((booking) => {
					const service = servicesData.find((s) => s.id === booking.service_id);
					return { ...booking, service };
				});

				setBookings(bookingsWithServices);
				setServices(servicesData);
			} catch (err) {
				console.error("Error fetching data:", err);
				setError("Failed to load data. Please try again later.");
			} finally {
				setIsLoading(false);
			}
		}

		fetchData();
	}, []);

	const filteredBookings =
		statusFilter === "all"
			? bookings
			: bookings.filter((booking) => booking.status === statusFilter);

	const handleStatusUpdate = (id: string, status: Booking["status"]) => {
		setBookings(
			bookings.map((booking) =>
				booking.id === id ? { ...booking, status } : booking
			)
		);

		// If the currently selected booking is being updated, update it too
		if (selectedBooking && selectedBooking.id === id) {
			setSelectedBooking({ ...selectedBooking, status });
		}
	};

	const reloadTable = (id: string) => {
		setBookings(bookings.filter((booking) => booking.id !== id));
	};

	if (isLoading || isAdminLoading) {
		return <LoadingSpinner />;
	}

	if (error) {
		return <div className="text-red-500">{error}</div>;
	}

	return (
		<div className="container mx-auto px-4 py-8 animate-in fade-in duration-400">
			<Suspense fallback={<LoadingSpinner />}>
				<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
					<div>
						<h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
						<p className="text-muted-foreground">
							{isAdmin
								? "View and manage all bookings"
								: "View and manage your bookings"}
						</p>
					</div>

					<div className="flex items-center gap-4">
						<div className="flex items-center">
							<label htmlFor="status-filter" className="mr-2 text-sm">
								Status:
							</label>
							<select
								id="status-filter"
								value={statusFilter}
								onChange={(e) => setStatusFilter(e.target.value)}
								className="text-sm rounded border p-2"
							>
								<option value="all">All</option>
								<option value="pending">Pending</option>
								<option value="confirmed">Confirmed</option>
								<option value="completed">Completed</option>
								<option value="cancelled">Cancelled</option>
							</select>
						</div>

						<Button onClick={handleNewBooking}>New Booking</Button>
					</div>
				</div>

				<div className="grid grid-cols-1 gap-6">
					<BookingTable
						bookings={filteredBookings}
						services={services}
						onNewBooking={handleNewBooking}
						onStatusUpdate={handleStatusUpdate}
						onViewDetails={handleViewDetails}
						onEditBooking={handleEditBooking}
						onDelete={reloadTable}
					/>
				</div>

				<Dialog
					open={dialogState.type !== null}
					onOpenChange={() => handleCloseDialog()}
				>
					<DialogContent className="sm:max-w-[500px] p-8 dialog-content">
						{dialogState.type === "new" && (
							<BookingForm
								onSuccess={(booking) => {
									setBookings([...bookings, booking]);
									handleCloseDialog();
								}}
							/>
						)}

						{dialogState.type === "edit" && dialogState.bookingId && (
							<EditBookingForm
								bookingId={dialogState.bookingId}
								onSuccess={(booking) => {
									setBookings(
										bookings.map((b) => (b.id === booking.id ? booking : b))
									);
									handleCloseDialog();
								}}
							/>
						)}

						{dialogState.type === "details" && dialogState.bookingId && (
							<BookingDetails
								bookingId={dialogState.bookingId}
								onUpdateStatus={handleStatusUpdate}
							/>
						)}
					</DialogContent>
				</Dialog>
			</Suspense>
		</div>
	);
}
