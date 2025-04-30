export type Booking = {
	id: string;
	customer_name: string;
	address: string;
	date_time: string;
	service_id: string;
	user_id: string;
	created_at: string;
	status: "pending" | "confirmed" | "completed" | "cancelled";
	service?: Service;
};

export type Service = {
	id: string;
	name: string;
	description: string;
	price: number;
	created_at: string;
};

export type User = {
	id: string;
	email: string;
	isAdmin?: boolean;
};
