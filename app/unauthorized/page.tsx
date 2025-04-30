import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function UnauthorizedPage() {
	return (
		<div className="flex flex-col items-center justify-center min-h-[80vh] p-4">
			<h1 className="text-2xl font-bold mb-4">Unauthorized Access</h1>
			<p className="text-muted-foreground mb-6">
				You do not have permission to access this resource.
			</p>
			<Link href="/">
				<Button size={"lg"}>Return to Home</Button>
			</Link>
		</div>
	);
}
