import type { Metadata } from "next";
import { Maven_Pro } from "next/font/google";
import "./globals.css";

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
			<body className={`${mavenPro.variable} antialiased`}>{children}</body>
		</html>
	);
}
