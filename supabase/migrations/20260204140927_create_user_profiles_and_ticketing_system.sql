/*
  # User Profiles and Ticketing System Setup

  ## Overview
  This migration creates the complete database structure for user authentication and a ticketing support system.

  ## New Tables
  
  ### 1. `profiles`
  - `id` (uuid, primary key) - References auth.users
  - `email` (text) - User email
  - `full_name` (text) - User's full name
  - `phone` (text, optional) - Contact number
  - `created_at` (timestamptz) - Account creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 2. `tickets`
  - `id` (uuid, primary key) - Unique ticket identifier
  - `user_id` (uuid) - References profiles.id
  - `title` (text) - Ticket subject/title
  - `description` (text) - Detailed description of the issue
  - `category` (text) - Service category (web-design, hosting, company-services, etc.)
  - `priority` (text) - Priority level (low, medium, high, urgent)
  - `status` (text) - Current status (open, in-progress, resolved, closed)
  - `created_at` (timestamptz) - Ticket creation time
  - `updated_at` (timestamptz) - Last update time

  ### 3. `ticket_messages`
  - `id` (uuid, primary key) - Unique message identifier
  - `ticket_id` (uuid) - References tickets.id
  - `user_id` (uuid) - References profiles.id
  - `message` (text) - Message content
  - `is_staff` (boolean) - Whether message is from staff
  - `created_at` (timestamptz) - Message timestamp

  ## Security
  - RLS enabled on all tables
  - Users can only access their own data
  - Authenticated users can create and read their own tickets
  - Staff role for ticket management (future enhancement)

  ## Important Notes
  1. All tables use RLS for data security
  2. Policies ensure users only see their own tickets
  3. Cascade deletes maintain referential integrity
  4. Timestamps track all changes
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  phone text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create tickets table
CREATE TABLE IF NOT EXISTS tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL CHECK (category IN ('web-design', 'hosting', 'company-services', 'smartphone-repairs', 'general')),
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status text DEFAULT 'open' CHECK (status IN ('open', 'in-progress', 'resolved', 'closed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create ticket_messages table
CREATE TABLE IF NOT EXISTS ticket_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id uuid NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  message text NOT NULL,
  is_staff boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_messages ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Tickets Policies
CREATE POLICY "Users can view own tickets"
  ON tickets FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create tickets"
  ON tickets FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tickets"
  ON tickets FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Ticket Messages Policies
CREATE POLICY "Users can view messages for their tickets"
  ON ticket_messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM tickets
      WHERE tickets.id = ticket_messages.ticket_id
      AND tickets.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create messages for their tickets"
  ON ticket_messages FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM tickets
      WHERE tickets.id = ticket_messages.ticket_id
      AND tickets.user_id = auth.uid()
    )
  );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tickets_updated_at
  BEFORE UPDATE ON tickets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tickets_user_id ON tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);
CREATE INDEX IF NOT EXISTS idx_ticket_messages_ticket_id ON ticket_messages(ticket_id);
CREATE INDEX IF NOT EXISTS idx_ticket_messages_user_id ON ticket_messages(user_id);
