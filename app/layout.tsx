import type { Metadata } from "next";
import { Maven_Pro } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const mavenPro = Maven_Pro({
	variable: "--font-maven-pro",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Cleaning Service Management System",
	description: "Cleaning Service Management System",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${mavenPro.variable} antialiased min-h-screen flex flex-col`}
				suppressHydrationWarning={true}
			>
				<Navbar />
				<main className="flex-grow">{children}</main>
				<Footer />
				<Toaster richColors />
			</body>
		</html>
	);
}
