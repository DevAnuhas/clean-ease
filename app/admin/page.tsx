import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

const AdminPage = async () => {
	const supabase = await createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	const isAdmin = user?.app_metadata.role === "admin";

	if (!isAdmin) {
		return redirect("/dashboard");
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
				<div>
					<h1 className="text-2xl font-bold tracking-tight">Admin Panel</h1>
					<p className="text-muted-foreground">
						View and manage bookings and services
					</p>
				</div>
			</div>
		</div>
	);
};

export default AdminPage;
