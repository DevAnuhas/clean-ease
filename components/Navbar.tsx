import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { Button } from "@/components/ui/button";
import SignOutButton from "@/components/SignOutButton";

const Navbar = async () => {
	const supabase = await createClient();

	const {
		data: { session },
	} = await supabase.auth.getSession();

	return (
		<header className="bg-white shadow-sm py-4">
			<div className="container mx-auto flex justify-between items-center px-4">
				<Link href="/" className="flex items-center gap-2">
					<span className="text-2xl font-bold tracking-tight text-primary">
						CleanEase
					</span>
				</Link>

				<div className="flex items-center gap-4">
					{session ? (
						<>
							<SignOutButton />
							<div className="hidden md:flex items-center gap-6">
								{session && (
									<Link href="/dashboard">
										<Button>Dashboard</Button>
									</Link>
								)}
							</div>
						</>
					) : (
						<>
							<Link href="/login">
								<Button variant="outline">Login</Button>
							</Link>
							<Link href="/register" className="hidden md:block">
								<Button>Sign Up</Button>
							</Link>
						</>
					)}
				</div>
			</div>
		</header>
	);
};

export default Navbar;
