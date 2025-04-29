"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const loginFormSchema = z.object({
	email: z.string().email({ message: "Please enter a valid email address" }),
	password: z
		.string()
		.min(6, { message: "Password must be at least 6 characters" }),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

const LoginPage = () => {
	// const { login } = useAuth();
	const navigate = useRouter().push;
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm<LoginFormValues>({
		resolver: zodResolver(loginFormSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const onSubmit = async (data: LoginFormValues) => {
		setIsLoading(true);
		try {
			// await login(data.email, data.password);
			navigate("/dashboard");
			toast.message("Login successful", {
				description: "Welcome back to CleanEase!",
			});
		} catch (error) {
			console.error("Login error:", error);
			toast.error("Login failed", {
				description: "Please check your credentials and try again.",
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
			<div className="w-full max-w-sm space-y-6 animate-fade-in">
				<div className="text-center">
					<h1 className="text-4xl font-bold tracking-tight gradient-text">
						CleanEase
					</h1>
					<p className="mt-2 text-lg text-gray-600">Sign in to your account</p>
				</div>

				<Card>
					<CardHeader>
						<CardTitle className="text-2xl tracking-tight">Log in</CardTitle>
						<CardDescription>
							Enter your email and password to access your account
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className="space-y-4"
							>
								<FormField
									control={form.control}
									name="email"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Email</FormLabel>
											<FormControl>
												<Input placeholder="email@example.com" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="password"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Password</FormLabel>
											<FormControl>
												<Input
													type="password"
													placeholder="Enter your password"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<Button
									type="submit"
									className="w-full mt-2"
									disabled={isLoading}
								>
									{isLoading ? "Signing in..." : "Sign in"}
								</Button>
							</form>
						</Form>
					</CardContent>
					<CardFooter className="flex flex-col items-center space-y-2">
						<div className="text-sm text-gray-500">
							Don&apos;t have an account?{" "}
							<Link
								href="/register"
								className="text-cleaning-600 hover:underline"
							>
								Sign up
							</Link>
						</div>
					</CardFooter>
				</Card>
			</div>
		</div>
	);
};

export default LoginPage;
