"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

export function useAdmin() {
	const [isAdmin, setIsAdmin] = useState(false);

	useEffect(() => {
		async function checkAdminStatus() {
			const supabase = createClient();
			const {
				data: { user },
			} = await supabase.auth.getUser();

			if (user) {
				setIsAdmin(user.app_metadata.role === "admin");
			}
		}

		checkAdminStatus();
	}, []);

	return { isAdmin };
}
