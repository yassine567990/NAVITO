-- ========================================================
-- NAVITO Admin Setup SQL
-- Run this in: https://supabase.com/dashboard/project/yfjmzjsibbogfilbpfir/sql/new
-- ========================================================

-- الخطوة 1: تعيين كلمة المرور للمستخدم الحالي (يعمل مع Google OAuth أيضاً)
UPDATE auth.users 
SET 
  encrypted_password = crypt('yasin2020', gen_salt('bf')),
  email_confirmed_at = COALESCE(email_confirmed_at, NOW()),
  updated_at = NOW()
WHERE email = 'yassinesabiri2003@gmail.com';

-- الخطوة 2: ضمان وجود profile بدور admin (INSERT أو UPDATE)
INSERT INTO public.profiles (id, fullname, phone, role)
SELECT 
  id, 
  COALESCE(raw_user_meta_data->>'full_name', raw_user_meta_data->>'fullname', 'Yassine Sabiri'),
  '',
  'admin'
FROM auth.users 
WHERE email = 'yassinesabiri2003@gmail.com'
ON CONFLICT (id) DO UPDATE SET 
  role = 'admin',
  updated_at = NOW();

-- الخطوة 3: تحقق من النتيجة
SELECT 
  u.email,
  u.email_confirmed_at,
  u.created_at,
  p.role
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
WHERE u.email = 'yassinesabiri2003@gmail.com';
