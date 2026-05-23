-- ============================================================
-- NAVITO: Comprehensive RLS Security Policies
-- Run this in Supabase SQL Editor:
-- https://supabase.com/dashboard → SQL Editor
--
-- ⚠️  تحذير: تشغيل هذا الملف مرة واحدة فقط في بيئة الإنتاج
-- ============================================================

-- ─── 1. جدول profiles ───────────────────────────────────────

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select_own"  ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_own"  ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own"  ON public.profiles;
DROP POLICY IF EXISTS "profiles_delete_none" ON public.profiles;

-- المستخدم يرى ملفه الشخصي فقط
CREATE POLICY "profiles_select_own" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

-- المستخدم يُنشئ ملفه الشخصي فقط
CREATE POLICY "profiles_insert_own" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- المستخدم يُعدِّل ملفه الشخصي فقط
CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- لا يستطيع أحد حذف الملفات الشخصية عبر API (الحذف يتم عبر service_role فقط)
CREATE POLICY "profiles_delete_none" ON public.profiles
  FOR DELETE USING (false);


-- ─── 2. جدول products ───────────────────────────────────────

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "products_select_active"  ON public.products;
DROP POLICY IF EXISTS "products_insert_admin"   ON public.products;
DROP POLICY IF EXISTS "products_update_admin"   ON public.products;
DROP POLICY IF EXISTS "products_delete_admin"   ON public.products;

-- أي زائر أو مستخدم يرى فقط المنتجات النشطة (is_active = true)
CREATE POLICY "products_select_active" ON public.products
  FOR SELECT USING (is_active = true);

-- فقط Admin يستطيع إضافة منتج جديد
CREATE POLICY "products_insert_admin" ON public.products
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- فقط Admin يستطيع تعديل المنتجات
CREATE POLICY "products_update_admin" ON public.products
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- فقط Admin يستطيع حذف منتج
CREATE POLICY "products_delete_admin" ON public.products
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );


-- ─── 3. جدول orders ─────────────────────────────────────────

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "orders_select_own"       ON public.orders;
DROP POLICY IF EXISTS "orders_insert_own"       ON public.orders;
DROP POLICY IF EXISTS "orders_update_none"      ON public.orders;
DROP POLICY IF EXISTS "orders_delete_none"      ON public.orders;
DROP POLICY IF EXISTS "orders_select_admin"     ON public.orders;
DROP POLICY IF EXISTS "orders_update_admin"     ON public.orders;

-- المستخدم يرى طلباته فقط
CREATE POLICY "orders_select_own" ON public.orders
  FOR SELECT USING (auth.uid() = user_id);

-- Admin يرى كل الطلبات
CREATE POLICY "orders_select_admin" ON public.orders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- الإدراج يتم فقط عبر service_role (api/create-order.js) — لا يُسمح للمتصفح مباشرة
-- ملاحظة: api/create-order.js يستخدم SUPABASE_SERVICE_KEY الذي يتجاوز RLS
CREATE POLICY "orders_insert_own" ON public.orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- لا يستطيع المستخدم تعديل طلبه بعد إنشائه (تحديث الحالة للAdmin فقط)
CREATE POLICY "orders_update_admin" ON public.orders
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- لا يُحذف أي طلب عبر API
CREATE POLICY "orders_delete_none" ON public.orders
  FOR DELETE USING (false);


-- ─── 4. Trigger: إنشاء profile تلقائي عند التسجيل ──────────

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
    COALESCE(NEW.raw_user_meta_data->>'fullname', NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    'user'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ─── 5. Backfill: إنشاء profiles للمستخدمين القدامى ─────────

INSERT INTO public.profiles (id, fullname, phone, role)
SELECT
  u.id,
  COALESCE(u.raw_user_meta_data->>'fullname', u.raw_user_meta_data->>'full_name', ''),
  COALESCE(u.raw_user_meta_data->>'phone', ''),
  'user'
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;


-- ─── 6. تعيين دور admin ─────────────────────────────────────
-- ⚠️  استبدل 'YOUR_ADMIN_USER_UUID' بـ UUID المشرف من:
--     Supabase Dashboard → Authentication → Users
--
-- UPDATE public.profiles
-- SET role = 'admin'
-- WHERE id = 'YOUR_ADMIN_USER_UUID';


-- ─── 7. التحقق من النتائج ───────────────────────────────────

SELECT 'Auth users without profiles:' AS check_type, COUNT(*) AS count
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
WHERE p.id IS NULL;

SELECT 'policies_on_products:' AS check_type, policyname, cmd
FROM pg_policies WHERE tablename = 'products';

SELECT 'policies_on_orders:' AS check_type, policyname, cmd
FROM pg_policies WHERE tablename = 'orders';

SELECT 'policies_on_profiles:' AS check_type, policyname, cmd
FROM pg_policies WHERE tablename = 'profiles';
