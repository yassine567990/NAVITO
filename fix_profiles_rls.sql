-- ============================================================
-- NAVITO: Fix Foreign Key Constraint on Orders
-- Run this in Supabase SQL Editor (https://supabase.com/dashboard)
-- ============================================================

-- Step 1: Check current RLS status on profiles table
SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'profiles';

-- Step 2: Ensure RLS policies allow users to INSERT their own profile
-- Drop existing policies first (safe — won't error if they don't exist)
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Allow authenticated insert own profile" ON profiles;
DROP POLICY IF EXISTS "Allow public read profiles" ON profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON profiles;

-- Step 3: Enable RLS (idempotent)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Step 4: Create proper RLS policies

-- Allow any authenticated user to SELECT their own profile
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

-- Allow any authenticated user to INSERT their own profile row
CREATE POLICY "Users can insert own profile"
ON profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- Allow any authenticated user to UPDATE their own profile
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Step 5: Create a trigger to auto-create a profile on user signup
-- This is the MOST RELIABLE fix — it ensures a profile always exists
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, fullname, phone, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'fullname', NEW.raw_user_meta_data ->> 'full_name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'phone', ''),
    'user'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Drop existing trigger if it exists, then recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Step 6: Backfill profiles for any existing users who are missing profiles
INSERT INTO public.profiles (id, fullname, phone, role)
SELECT
  u.id,
  COALESCE(u.raw_user_meta_data ->> 'fullname', u.raw_user_meta_data ->> 'full_name', ''),
  COALESCE(u.raw_user_meta_data ->> 'phone', ''),
  'user'
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
WHERE p.id IS NULL;

-- Step 7: Verify the fix
SELECT 'Auth users without profiles:' AS check_type, COUNT(*) AS count
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
WHERE p.id IS NULL;

SELECT 'Total profiles:' AS check_type, COUNT(*) AS count FROM profiles;
SELECT 'Total auth users:' AS check_type, COUNT(*) AS count FROM auth.users;

-- Step 8: Also verify orders FK references profiles (not auth.users)
SELECT
    tc.constraint_name,
    kcu.column_name,
    ccu.table_schema AS fk_schema,
    ccu.table_name AS fk_table,
    ccu.column_name AS fk_column
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_name = 'orders';
