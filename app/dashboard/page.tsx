"use client";

import { Suspense, useState, useEffect } from "react";
import type { Booking } from "@/types";
import { getBookings } from "@/lib/api-client";
import { useAdmin } from "@/lib/use-admin";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";
import { redirect } from "next/navigation";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
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
		const checkSession = async () => {
			const {
				data: { session },
			} = await supabase.auth.getSession();

			if (!session) {
				toast.warning("Authentication required", {
					description: "Please sign in to access the dashboard",
				});
				redirect("/login");
			}

			setUser(session.user);
			await fetchBookings();
		};

		checkSession();
	}, []);

	const fetchBookings = async () => {
		try {
			setIsLoading(true);
			const data = await getBookings();
			setBookings(data);
		} catch (error) {
			console.error("Error fetching bookings:", error);
			toast.error("Error", {
				description: "Failed to load bookings. Please try again.",
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
						<h1 className="text-2xl font-bold tracking-tight">
							{isAdmin ? "Admin Panel" : "Dashboard"}
						</h1>
						<p className="text-muted-foreground">
							{isAdmin
								? "View and manage all bookings"
								: "View and manage your bookings"}
						</p>
					</div>

					<div className="flex items-center gap-4">
						<div className="flex items-center">
							<label className="mr-2 text-sm">Status:</label>
							<Select
								onValueChange={(value) => setStatusFilter(value)}
								defaultValue="all"
							>
								<SelectTrigger className="w-[180px]">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										<SelectItem value="all">All</SelectItem>
										<SelectItem value="pending">Pending</SelectItem>
										<SelectItem value="confirmed">Confirmed</SelectItem>
										<SelectItem value="completed">Completed</SelectItem>
										<SelectItem value="cancelled">Cancelled</SelectItem>
									</SelectGroup>
								</SelectContent>
							</Select>
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
