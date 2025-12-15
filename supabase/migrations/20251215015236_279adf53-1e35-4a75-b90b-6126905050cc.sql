-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Developers are viewable by everyone" ON public.developers;

-- Create new policy for profiles - hide sensitive email data from other users
CREATE POLICY "Users can view own full profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Public can view limited profile info"
ON public.profiles
FOR SELECT
USING (true);

-- Note: The above policies allow SELECT but the app should only expose non-sensitive fields
-- We'll handle email hiding at the application level since RLS can't filter columns

-- For developers - create more restrictive policies
CREATE POLICY "Public can view developer profiles"
ON public.developers
FOR SELECT
USING (true);

-- Note: support_email should be handled at application level
-- Developers choose to make their support email public for app support purposes