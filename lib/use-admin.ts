"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export function useAdmin() {
	const [isAdmin, setIsAdmin] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		async function checkAdmin() {
			try {
				const supabase = createClient();
				const {
					data: { user },
				} = await supabase.auth.getUser();

				if (!user) {
					setIsAdmin(false);
					return;
				}

				// Check if user's email ends with admin domain
				// This is a simplified check - in production you should use a proper role system
				setIsAdmin(user.email?.endsWith("@youradmindomain.com") || false);
			} catch (error) {
				console.error("Error checking admin status:", error);
				setIsAdmin(false);
			} finally {
				setIsLoading(false);
			}
		}

		checkAdmin();
	}, []);

	return { isAdmin, isLoading };
}
