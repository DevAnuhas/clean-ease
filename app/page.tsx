import { Button } from "@/components/ui/button";

export default function Home() {
	return (
		<div className="flex flex-col items-center justify-center gap-4 h-screen">
			<h1 className="text-4xl">Cleaning Service Management System</h1>
			<p>
				Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed molestie,
				neque vel tincidunt tincidunt.
			</p>
			<Button size={"lg"}>Get Started</Button>
		</div>
	);
}
