# Cleaning Service Management System

A full-stack web application for managing cleaning service bookings, built with Next.js, Supabase, and Shadcn UI.

## Overview

This application provides a platform for users to book cleaning services and for administrators to manage services and bookings. It features a responsive UI, user authentication, and a comprehensive booking management system.

## Features

### User Features

- **Authentication**: Sign up and log in to access personalized dashboard
- **Booking Creation**: Form to input customer details, address, date/time, and select service type
- **Booking Management**: View, edit, and cancel existing bookings
- **Responsive UI**: Works seamlessly on mobile and desktop devices

### Admin Features

- **Service Management**: Add, edit, and delete service types
- **Booking Oversight**: View all bookings, filter by user or status
<!--- - **User Management**: View and manage user accounts -->

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React, Tailwind CSS, Shadcn UI
- **Backend**: Next.js API Routes, Supabase
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth
- **Form Validation**: Zod, React Hook Form
- **Styling**: Tailwind CSS, Shadcn UI components

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- Supabase account

### Installation

1. Clone the repository:

   ```shellscript
   git clone https://github.com/DevAnuhas/clean-ease.git
   cd clean-ease
   ```

2. Install dependencies:

   ```shellscript
   npm install
   ```

3. Set up environment variables: Create a `.env.local` file in the root directory with the following variables:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Run the development server:

   ```shellscript
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Database Setup

The application requires the following tables in your Supabase database:

1. **Users**:

   ```sql
   CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY,
      username VARCHAR(255) NOT NULL UNIQUE,
      email VARCHAR(255) NOT NULL UNIQUE,
      is_admin BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

2. **Services**:

   ```sql
   CREATE TABLE IF NOT EXISTS services (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(255) NOT NULL,
      description TEXT,
      price DECIMAL(10, 2) NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

3. **Bookings**:

   ```sql
   CREATE TABLE IF NOT EXISTS bookings (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      customer_name VARCHAR(255) NOT NULL,
      address TEXT NOT NULL,
      date_time TIMESTAMP WITH TIME ZONE NOT NULL,
      service_id UUID NOT NULL REFERENCES services(id),
      user_id UUID NOT NULL REFERENCES users(id),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

### Row Level Security (RLS) Policies

Set up the following RLS policies in Supabase:

1. **Users Table**:

   - Users can only access their own data
   - Admins can access all user data

1. **Services Table**:

   - All users can read services
   - Only admins can create, update, or delete services

1. **Bookings Table**:

   - Users can only access their own bookings
   - Admins can access all bookings

## API Endpoints

### Authentication

- `POST /api/auth/signup`: Create a new user
- `POST /api/auth/login`: Authenticate and return a session token
- `POST /api/auth/logout`: Invalidate session

### Bookings

- `GET /api/bookings`: Fetch bookings for the authenticated user
- `POST /api/bookings`: Create a new booking
- `PUT /api/bookings/[id]`: Update a booking
- `DELETE /api/bookings/[id]`: Delete a booking

### Services

- `GET /api/services`: Fetch all service types
- `POST /api/services`: Create a new service (admin only)
- `PUT /api/services/[id]`: Update a service (admin only)
- `DELETE /api/services/[id]`: Delete a service (admin only)

## Deployment

This application can be easily deployed to Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FDevAnuhas%2Fclean-ease)

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the [MIT License](License.txt).
