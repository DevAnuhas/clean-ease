import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
	return (
		<div className="flex flex-col items-center justify-center gap-4 h-screen">
			<h1 className="text-6xl">Hassle-Free Cleaning Services</h1>
			<p>
				Professional, reliable, and thorough cleaning services for your home or
				business. We make it sparkle so you don&apos;t have to.
			</p>
			<div className="flex items-center justify-center gap-4">
				<Link href="/dashboard">
					<Button size={"lg"}>Get Started</Button>
				</Link>
				<Button size={"lg"} variant={"outline"}>
					View Services
				</Button>
			</div>
		</div>
	);
}
