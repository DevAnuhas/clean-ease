# Cleaning Service Management System

A full-stack web application for managing cleaning service bookings, built with Next.js, Supabase, and Shadcn UI.

## Overview

This application provides a platform for users to book cleaning services and for administrators to manage services and bookings. It features a responsive UI, user authentication, and a comprehensive booking management system.

## Features

- **User Authentication**: Secure login and registration with Supabase Auth
- **Role-Based Access Control**: Different permissions for users and administrators
- **Service Management**: Create, update, and delete services
- **Booking Management**: Full CRUD operations for bookings
- **Dashboard**: User-friendly dashboard to view and manage bookings
- **Admin Panel**: Comprehensive admin tools for business management
- **Form Validation**: Client and server-side validation using Zod
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Real-time Updates**: Instant updates when bookings are created or modified
- **API Documentation**: Well-documented API endpoints for developers

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React, Tailwind CSS, Shadcn UI
- **Backend**: Next.js API Routes, Supabase, TypeScript
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth
- **Form Validation**: Zod, React Hook Form

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- Supabase account

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/DevAnuhas/clean-ease.git
   cd clean-ease
   ```

2. Install dependencies:

   ```bash
   npm install --legacy-peer-deps
   ```

3. Set up environment variables: Create a `.env.local` file in the root directory with the following variables:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=<your_supabase_url>
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<your_supabase_anon_key>
   ```

4. Set up the database: Run the SQL scripts in the [`schema.sql`](schema.sql) file in your Supabase SQL editor to create the necessary tables and policies.

5. Run the development server:

   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Database Schema

The application uses the following database tables:

- **services**: Stores information about available services
- **bookings**: Stores booking information

### Row Level Security (RLS) Policies

The application uses Supabase Auth for authentication and implements role-based access control:

- **Public**: Can view services
- **Users**: Can create, view, update, and delete their own bookings
- **Admins**: Can manage all bookings and services

You can modify a user's role by running the following SQL command in the Supabase SQL Editor:

```sql
-- Replace 'user_email@example.com' with the email of the user you want to make an admin
UPDATE auth.users
SET raw_app_meta_data = raw_app_meta_data || '{"role": "admin"}'
WHERE email = 'user_email@example.com';
```

## API Endpoints

### Authentication

- `POST /api/auth/confirm`: Confirm email address

### Bookings

- `GET /api/bookings`: Get all bookings for the authenticated user
- `POST /api/bookings`: Create a new booking
- `GET /api/bookings/:id`: Get a specific booking
- `PUT /api/bookings/:id`: Update a booking
- `DELETE /api/bookings/:id`: Delete a booking

### Services

- `GET /api/services`: Get all services (public)
- `POST /api/services`: Create a new service (admin only)
- `GET /api/services/:id`: Get a specific service
- `PUT /api/services/:id`: Update a service (admin only)
- `DELETE /api/services/:id`: Delete a service (admin only)

## Deployment

This application can be easily deployed to Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FDevAnuhas%2Fclean-ease)

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the [MIT License](License.txt).
