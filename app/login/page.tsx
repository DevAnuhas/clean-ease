import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import LoginForm from "./login-form";

const LoginPage = async () => {
	const supabase = await createClient();

	const {
		data: { session },
	} = await supabase.auth.getSession();

	if (session) {
		return redirect("/dashboard");
	}

	return (
		<div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
			<div className="w-full max-w-sm space-y-6 animate-in fade-in duration-400">
				<div className="text-center">
					<h1 className="text-4xl font-bold tracking-tight gradient-text">
						CleanEase
					</h1>
					<p className="mt-2 text-lg text-muted-foreground">
						Sign in to your account
					</p>
				</div>
				<LoginForm />
			</div>
		</div>
	);
};

export default LoginPage;
