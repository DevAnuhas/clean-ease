import Link from "next/link";
import { Button } from "@/components/ui/button";

const DashboardPage = () => {
	return (
		<div className="container mx-auto px-4 py-8">
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
				<div>
					<h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
					<p className="text-muted-foreground">View and manage your bookings</p>
				</div>

				<div className="flex items-center gap-2">
					<div className="flex items-center"></div>

					<Link href="/booking">
						<Button>New Booking</Button>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default DashboardPage;
