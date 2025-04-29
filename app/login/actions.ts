"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

export type LoginResponse = {
	success: boolean;
	message: string;
	description?: string;
	isAdmin?: boolean;
};

export async function login(formData: FormData): Promise<LoginResponse> {
	const supabase = await createClient();

	const data = {
		email: formData.get("email") as string,
		password: formData.get("password") as string,
	};

	const { error } = await supabase.auth.signInWithPassword(data);

	if (error) {
		return {
			success: false,
			message: "Login failed",
			description: error.message,
		};
	}

	const {
		data: { user },
	} = await supabase.auth.getUser();

	const isAdmin = user?.app_metadata.role === "admin";

	revalidatePath("/", "layout");
	return {
		success: true,
		message: "Login successful",
		description: "Welcome back to CleanEase!",
		isAdmin: isAdmin,
	};
}

export async function signOut() {
	const supabase = await createClient();
	await supabase.auth.signOut();
	revalidatePath("/", "layout");
}
