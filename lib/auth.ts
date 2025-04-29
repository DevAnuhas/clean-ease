import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function getUser() {
	const supabase = await createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return null;
	}

	return user;
}

export async function requireUser() {
	const user = await getUser();

	if (!user) {
		redirect("/login");
	}

	return user;
}

export async function isAdmin() {
	const supabase = await createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return false;
	}

	return user.app_metadata?.role === "admin";
}

export async function requireAdmin() {
	const isUserAdmin = await isAdmin();

	if (!isUserAdmin) {
		redirect("/unauthorized");
	}

	return true;
}
