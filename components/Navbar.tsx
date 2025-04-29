"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { usePathname, useRouter } from "next/navigation";

const Navbar = () => {
	const user = null;
	const isAdmin = false;
	const location = usePathname();
	const navigate = useRouter().push;

	const handleLogout = () => {
		console.log("Logout");
		navigate("/");
	};

	const isActive = (path: string) => {
		return location === path;
	};

	return (
		<header className="bg-white shadow-sm py-4">
			<div className="container mx-auto flex justify-between items-center px-4">
				<Link href="/" className="flex items-center gap-2">
					<span className="text-2xl font-bold tracking-tight text-primary">
						CleanEase
					</span>
				</Link>

				<div className="flex items-center gap-4">
					{user ? (
						<>
							<div className="hidden md:flex items-center gap-6">
								{isAdmin ? (
									<Link
										href="/admin"
										className={`text-sm font-medium ${
											isActive("/admin")
												? "text-primary"
												: "text-gray-600 hover:text-primary"
										}`}
									>
										Admin Panel
									</Link>
								) : (
									<>
										<Link
											href="/dashboard"
											className={`text-sm font-medium ${
												isActive("/dashboard")
													? "text-primary"
													: "text-gray-600 hover:text-primary"
											}`}
										>
											Dashboard
										</Link>
										<Link
											href="/booking"
											className={`text-sm font-medium ${
												isActive("/booking")
													? "text-primary"
													: "text-gray-600 hover:text-primary"
											}`}
										>
											New Booking
										</Link>
									</>
								)}
							</div>
							<Button onClick={handleLogout} variant="outline">
								Logout
							</Button>
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
