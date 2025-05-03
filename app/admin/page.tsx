"use client";

import { Suspense, useState, useEffect } from "react";
import type { Booking } from "@/types";
import { getBookings } from "@/lib/api-client";
import { useAdmin } from "@/lib/use-admin";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";
import { redirect } from "next/navigation";

import LoadingSpinner from "@/components/ui/spinner";
import { toast } from "sonner";
import BookingTable from "@/components/dashboard/BookingTable";

export default function Dashboard() {
	const { isAdmin } = useAdmin();
	const [user, setUser] = useState<User | null>(null);
	const [bookings, setBookings] = useState<Booking[]>([]);
	const [statusFilter, setStatusFilter] = useState<string>("all");
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const supabase = createClient();

		const initialize = async () => {
			const {
				data: { session },
			} = await supabase.auth.getSession();

			if (!session || !isAdmin) {
				toast.warning("Forbidden", {
					description: "Please sign in as admin to access the admin panel",
				});
				redirect("/login");
			}

			setUser(session.user);
			await fetchBookings();

			// Set up subscription for real-time updates
			const { data: authData } = await supabase.auth.getSession();
			if (!authData.session) return;

			const userId = authData.session.user.id;

			const subscription = supabase
				.channel("booking-changes")
				.on(
					"postgres_changes",
					{
						event: "*",
						schema: "public",
						table: "bookings",
						filter: `user_id=eq.${userId}`,
					},
					() => {
						console.log("Change received!");
						fetchBookings();
					}
				)
				.subscribe();

			return () => {
				if (subscription) {
					supabase.removeChannel(subscription);
				}
			};
		};

		const cleanup = initialize();
		return () => {
			cleanup.then((cleanupFn) => cleanupFn && cleanupFn());
		};
	}, [isAdmin]);

	const fetchBookings = async () => {
		try {
			setIsLoading(true);
			const data = await getBookings();
			setBookings(data);
		} catch (error) {
			console.error("Error fetching bookings:", error);
			toast.error("Error", {
				description: "Failed to load your bookings. Please try again.",
			});
		} finally {
			setIsLoading(false);
		}
	};

	const filteredBookings =
		statusFilter === "all"
			? bookings
			: bookings.filter((booking) => booking.status === statusFilter);

	if (isLoading) {
		return <LoadingSpinner />;
	}

	return (
		<div className="container mx-auto px-4 py-8 animate-in fade-in duration-400">
			<Suspense fallback={<LoadingSpinner />}>
				<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
					<div>
						<h1 className="text-2xl font-bold tracking-tight">Admin Panel</h1>
						<p className="text-muted-foreground">
							View and manage all bookings
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
					</div>
				</div>

				<div className="grid grid-cols-1 gap-6">
					<BookingTable
						bookings={filteredBookings}
						onBookingChange={() => fetchBookings()}
						userId={user?.id || ""}
					/>
				</div>
			</Suspense>
		</div>
	);
}
