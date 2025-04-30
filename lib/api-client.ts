import type { Booking, Service } from "@/types";

// Bookings API
export async function getBookings(): Promise<Booking[]> {
	const res = await fetch("/api/bookings");

	if (!res.ok) {
		const error = await res.json();
		throw new Error(error.error || "Failed to fetch bookings");
	}

	return res.json();
}

export async function getBooking(id: string): Promise<Booking> {
	const res = await fetch(`/api/bookings/${id}`);

	if (!res.ok) {
		const error = await res.json();
		throw new Error(error.error || "Failed to fetch booking");
	}

	return res.json();
}

export async function createBooking(
	booking: Omit<Booking, "id" | "user_id" | "created_at">
): Promise<Booking> {
	const res = await fetch("/api/bookings", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(booking),
	});

	if (!res.ok) {
		const error = await res.json();
		throw new Error(error.error || "Failed to create booking");
	}

	return res.json();
}

export async function updateBooking(
	id: string,
	booking: Partial<Booking>
): Promise<Booking> {
	const res = await fetch(`/api/bookings/${id}`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(booking),
	});

	if (!res.ok) {
		const error = await res.json();
		throw new Error(error.error || "Failed to update booking");
	}

	return res.json();
}

export async function deleteBooking(id: string): Promise<void> {
	const res = await fetch(`/api/bookings/${id}`, {
		method: "DELETE",
	});

	if (!res.ok) {
		const error = await res.json();
		throw new Error(error.error || "Failed to delete booking");
	}
}

// Services API
export async function getServices(): Promise<Service[]> {
	const res = await fetch("/api/services");

	if (!res.ok) {
		const error = await res.json();
		throw new Error(error.error || "Failed to fetch services");
	}

	return res.json();
}

export async function getService(id: string): Promise<Service> {
	const res = await fetch(`/api/services/${id}`);

	if (!res.ok) {
		const error = await res.json();
		throw new Error(error.error || "Failed to fetch service");
	}

	return res.json();
}
