"use client";

import { Button } from "../ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import type { Service } from "@/types";
import { BookingFormValues } from "@/lib/form-schemas";
import { UseFormReturn } from "react-hook-form";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface BookingFormFieldsProps {
	form: UseFormReturn<BookingFormValues>;
	services: Service[];
}

export function BookingFormFields({ form, services }: BookingFormFieldsProps) {
	const { isSubmitting } = form.formState;

	return (
		<>
			<FormField
				control={form.control}
				name="service_id"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Service Type</FormLabel>
						<Select
							onValueChange={field.onChange}
							defaultValue={field.value}
							disabled={isSubmitting}
						>
							<FormControl>
								<SelectTrigger className="w-full sm:w-72">
									<SelectValue placeholder="Select a service" />
								</SelectTrigger>
							</FormControl>
							<SelectContent>
								{services.map((service) => (
									<SelectItem key={service.id} value={service.id}>
										{service.name} - Rs. {service.price.toFixed(2)}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<FormDescription>
							Choose the cleaning service you need.
						</FormDescription>
						<FormMessage />
					</FormItem>
				)}
			/>
			<FormField
				control={form.control}
				name="customer_name"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Your Name</FormLabel>
						<FormControl>
							<Input {...field} disabled={isSubmitting} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name="address"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Service Address</FormLabel>
						<FormControl>
							<Textarea
								{...field}
								disabled={isSubmitting}
								className="overflow-auto resize-none"
							/>
						</FormControl>
						<FormDescription>
							The complete address where you need cleaning service.
						</FormDescription>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name="date_time"
				render={({ field }) => (
					<FormItem className="flex flex-col">
						<FormLabel>Date and Time</FormLabel>
						<Popover>
							<PopoverTrigger asChild>
								<FormControl>
									<Button
										variant={"outline"}
										className={cn(
											"w-full sm:w-72 pl-3 text-left font-normal",
											!field.value && "text-muted-foreground"
										)}
									>
										{field.value ? (
											format(new Date(field.value), "PPP p")
										) : (
											<span>Pick a date and time</span>
										)}
										<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
									</Button>
								</FormControl>
							</PopoverTrigger>
							<PopoverContent className="w-auto p-0" align="start">
								<Calendar
									mode="single"
									selected={field.value ? new Date(field.value) : undefined}
									onSelect={(date) => {
										if (date) {
											// Set time to noon by default
											const datetime = new Date(date);
											datetime.setHours(12, 0, 0, 0);
											field.onChange(datetime.toISOString());
										}
									}}
									disabled={(date) =>
										date < new Date(new Date().setHours(0, 0, 0, 0)) ||
										date.getDay() === 0
									}
									initialFocus
								/>
								<div className="p-3 border-t">
									<Select
										onValueChange={(value) => {
											const [hours, minutes] = value.split(":").map(Number);
											const date = field.value
												? new Date(field.value)
												: new Date();
											date.setHours(hours, minutes, 0, 0);
											field.onChange(date.toISOString());
										}}
									>
										<SelectTrigger>
											<SelectValue placeholder="Select time" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="09:00">9:00 AM</SelectItem>
											<SelectItem value="10:00">10:00 AM</SelectItem>
											<SelectItem value="11:00">11:00 AM</SelectItem>
											<SelectItem value="12:00">12:00 PM</SelectItem>
											<SelectItem value="13:00">1:00 PM</SelectItem>
											<SelectItem value="14:00">2:00 PM</SelectItem>
											<SelectItem value="15:00">3:00 PM</SelectItem>
											<SelectItem value="16:00">4:00 PM</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</PopoverContent>
						</Popover>
						<FormDescription>
							Choose a date and time for your cleaning service. We are available
							Monday-Saturday.
						</FormDescription>
						<FormMessage />
					</FormItem>
				)}
			/>
		</>
	);
}
