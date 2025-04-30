-- Create a table for services
CREATE TABLE public.services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create a table for bookings
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name VARCHAR NOT NULL,
  address TEXT NOT NULL,
  date_time TIMESTAMP WITH TIME ZONE NOT NULL,
  service_id UUID NOT NULL REFERENCES public.services(id),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  status VARCHAR NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled'))
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Create policies for services table
CREATE POLICY "Enable read access for all users" 
ON public.services FOR SELECT 
USING (true);

CREATE POLICY "Enable write access for admin users only" 
ON public.services FOR INSERT 
WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Enable update access for admin users only" 
ON public.services FOR UPDATE 
USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Enable delete access for admin users only" 
ON public.services FOR DELETE 
USING (auth.jwt() ->> 'role' = 'admin');

-- Create policies for bookings table
CREATE POLICY "Users can view their own bookings" 
ON public.bookings FOR SELECT 
USING (auth.uid() = user_id OR auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Users can create their own bookings" 
ON public.bookings FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookings" 
ON public.bookings FOR UPDATE 
USING (auth.uid() = user_id OR auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Users can delete their own bookings" 
ON public.bookings FOR DELETE 
USING (auth.uid() = user_id OR auth.jwt() ->> 'role' = 'admin');

-- Insert some initial service data
INSERT INTO public.services (name, description, price) VALUES
('Standard Cleaning', 'Basic home cleaning including dusting, vacuuming, and sanitizing surfaces', 99.99),
('Deep Cleaning', 'Thorough cleaning including baseboards, inside appliances, and detailed bathroom cleaning', 199.99),
('Move-out Cleaning', 'Complete cleaning service when vacating a property', 249.99),
('Window Cleaning', 'Interior and exterior window cleaning service', 149.99);
