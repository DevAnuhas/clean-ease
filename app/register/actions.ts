"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

export type LoginResponse = {
	success: boolean;
	message: string;
	description?: string;
};

export async function signup(formData: FormData): Promise<LoginResponse> {
	const supabase = await createClient();

	const data = {
		email: formData.get("email") as string,
		password: formData.get("password") as string,
	};

	const { error } = await supabase.auth.signUp(data);

	if (error) {
		return {
			success: false,
			message: "Registration failed",
			description: error.message,
		};
	}

	revalidatePath("/", "layout");
	return {
		success: true,
		message: "Your account has been created",
		description: "Check your email for a verification link.",
	};
}
