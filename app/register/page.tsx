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

const registerFormSchema = z
	.object({
		email: z.string().email({ message: "Please enter a valid email address" }),
		password: z
			.string()
			.min(6, { message: "Password must be at least 6 characters" }),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

type RegisterFormValues = z.infer<typeof registerFormSchema>;

const RegisterPage = () => {
	// const { register } = useAuth();
	const navigate = useRouter().push;
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm<RegisterFormValues>({
		resolver: zodResolver(registerFormSchema),
		defaultValues: {
			email: "",
			password: "",
			confirmPassword: "",
		},
	});

	const onSubmit = async (data: RegisterFormValues) => {
		setIsLoading(true);
		try {
			// await register(data.email, data.password);
			toast.message("Your account has been created", {
				description: "Check your email for a verification link.",
				duration: 5000,
			});
			navigate("/login");
		} catch (error) {
			console.error("Registration error:", error);
			toast.error("Registration failed", {
				description:
					"There was an error creating your account. Please try again.",
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
					<p className="mt-2 text-lg text-gray-600">Create a new account</p>
				</div>

				<Card>
					<CardHeader>
						<CardTitle className="text-2xl tracking-tight">Sign up</CardTitle>
						<CardDescription>
							Create an account to book cleaning services
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
													placeholder="Create a password"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="confirmPassword"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Confirm Password</FormLabel>
											<FormControl>
												<Input
													type="password"
													placeholder="Confirm your password"
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
									{isLoading ? "Creating account..." : "Create account"}
								</Button>
							</form>
						</Form>
					</CardContent>
					<CardFooter className="flex flex-col items-center space-y-2">
						<div className="text-sm text-gray-500">
							Already have an account?{" "}
							<Link href="/login" className="text-cleaning-600 hover:underline">
								Sign in
							</Link>
						</div>
					</CardFooter>
				</Card>
			</div>
		</div>
	);
};

export default RegisterPage;
