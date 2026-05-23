-- تحقق من جميع الحسابات وأدوارها
SELECT u.id, u.email, p.role, p.fullname
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
ORDER BY u.created_at DESC;

-- عيّن مشرفاً (غيّر البريد إذا لزم)
UPDATE public.profiles SET role = 'admin'
WHERE id = (
  SELECT id FROM auth.users WHERE email = 'yassinesabiri2003@gmail.com'
);

-- تحقق بعد التحديث
SELECT u.email, p.role FROM auth.users u
JOIN public.profiles p ON p.id = u.id
WHERE u.email = 'yassinesabiri2003@gmail.com';
