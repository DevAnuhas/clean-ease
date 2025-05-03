"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

export function useAdmin() {
	const [isAdmin, setIsAdmin] = useState(false);
	const [isAdminLoading, setIsAdminLoading] = useState(true);

	useEffect(() => {
		async function checkAdminStatus() {
			const supabase = createClient();
			const {
				data: { user },
			} = await supabase.auth.getUser();

			if (!user) {
				setIsAdmin(false);
				return;
			}

			if (user.app_metadata.role === "admin") {
				setIsAdmin(true);
				setIsAdminLoading(false);
			}
		}

		checkAdminStatus();
	}, []);

	return { isAdmin, isAdminLoading };
}
