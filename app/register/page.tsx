import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import RegisterForm from "./register-form";

const RegisterPage = async () => {
	const supabase = await createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	const isAdmin = user?.app_metadata.role === "admin";

	if (user) {
		return redirect(`${isAdmin ? "/admin" : "/dashboard"}`);
	}

	return (
		<div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
			<div className="w-full max-w-sm space-y-6 animate-in fade-in duration-400">
				<div className="text-center">
					<h1 className="text-4xl font-bold tracking-tight gradient-text">
						CleanEase
					</h1>
					<p className="mt-2 text-lg text-muted-foreground">
						Create a new account
					</p>
				</div>
				<RegisterForm />
			</div>
		</div>
	);
};

export default RegisterPage;
