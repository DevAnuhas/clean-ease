"use client";

import { useState } from "react";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { signOut } from "@/app/login/actions";

const SignOutButton = () => {
	const router = useRouter();
	const navigate = router.push;
	const [isLoading, setIsLoading] = useState(false);

	const handleSignOut = async () => {
		try {
			setIsLoading(true);
			await signOut();
			navigate("/login");
			toast("Signed out successfully!");
		} catch {
			toast.error("Sign out failed!");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="outline">Sign Out</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Sign Out</DialogTitle>
					<DialogDescription>
						Are you sure you want to sign out?
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<DialogClose asChild>
						<Button variant="outline">Cancel</Button>
					</DialogClose>
					<Button onClick={handleSignOut} disabled={isLoading}>
						{isLoading ? "Signing out..." : "Yes, Sign out"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default SignOutButton;
