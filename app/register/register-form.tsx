"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { signup } from "./actions";

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

import React from "react";

const RegisterForm = () => {
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

	const onSubmit = async (formData: RegisterFormValues) => {
		setIsLoading(true);
		try {
			const data = new FormData();
			data.append("email", formData.email);
			data.append("password", formData.password);

			const response = await signup(data);

			if (response.success) {
				navigate("/login");
				toast(response.message, {
					description: response.description,
					duration: 5000,
				});
			} else {
				toast.error(response.message, {
					description: response.description,
				});
			}
		} catch {
			toast.error("Login failed", {
				description: "An unexpected error occurred. Please try again.",
			});
		} finally {
			setIsLoading(false);
		}
	};
	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-2xl tracking-tight">Sign up</CardTitle>
				<CardDescription>
					Create an account to book cleaning services
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

						<Button type="submit" className="w-full mt-2" disabled={isLoading}>
							{isLoading ? "Creating account..." : "Create account"}
						</Button>
					</form>
				</Form>
			</CardContent>
			<CardFooter className="flex flex-col items-center space-y-2">
				<div className="text-sm text-muted-foreground">
					Already have an account? <Link href="/login">Sign in</Link>
				</div>
			</CardFooter>
		</Card>
	);
};

export default RegisterForm;
