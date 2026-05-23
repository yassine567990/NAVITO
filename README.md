# NAVITO — متجر إلكتروني

متجر فاخر (واجهة ثابتة + Supabase + Vercel Serverless).

- **المتجر:** [navito-one.vercel.app](https://navito-one.vercel.app)
- **GitHub:** [yassine567990/NAVITO](https://github.com/yassine567990/NAVITO)
- **Vercel:** [لوحة المشروع](https://vercel.com/yassines-projects-844eb5a4/navito)
- **Supabase:** [المشروع](https://supabase.com/dashboard/project/yfjmzjsibbogfilbpfir)

---

## إعداد سريع (مرة واحدة)

### 1) Supabase — SQL

افتح [SQL Editor](https://supabase.com/dashboard/project/yfjmzjsibbogfilbpfir/sql) وشغّل الملف:

`supabase/complete_store_setup.sql`

ثم عيّن حسابك كمشرف (غيّر البريد):

```sql
UPDATE profiles SET role = 'admin'
WHERE id = (SELECT id FROM auth.users WHERE email = 'your-email@example.com');
```

### 2) Vercel — متغيرات البيئة

في [Environment Variables](https://vercel.com/yassines-projects-844eb5a4/navito/settings/environment-variables) أضف:

| الاسم | القيمة |
|--------|--------|
| `SUPABASE_SERVICE_ROLE_KEY` | من [Supabase API Keys](https://supabase.com/dashboard/project/yfjmzjsibbogfilbpfir/settings/api-keys) (service_role — سري) |

بدون هذا المفتاح لن تعمل: إنشاء الطلبات، تتبع الطلب، و`ensure-profile`.

### 3) Supabase — Google OAuth

في [Authentication → Providers → Google](https://supabase.com/dashboard/project/yfjmzjsibbogfilbpfir/auth/providers):

- فعّل Google
- في [Google Cloud Console](https://console.cloud.google.com/auth/clients/785293636026-4kro2u79fo90dilqiiet21s6di98lgog.apps.googleusercontent.com) أضف **Authorized redirect URIs:**
  - `https://yfjmzjsibbogfilbpfir.supabase.co/auth/v1/callback`

في Supabase → **URL Configuration** → **Redirect URLs** أضف:

- `https://navito-one.vercel.app/index.html`
- `http://localhost:3000/index.html` (للتطوير المحلي)

### 4) النشر

اربط المستودع بـ Vercel (Connect Git) أو:

```bash
git push origin main
```

---

## لوحة الإدارة

1. سجّل حساباً عادياً في Supabase (أو استخدم حسابك الحالي).
2. نفّذ SQL تعيين `role = 'admin'` أعلاه.
3. ادخل من `login.html` بنفس البريد وكلمة المرور → يُوجَّه تلقائياً إلى `admin.html`.

> **ملاحظة:** تم إزالة الدخول التجريبي `admin@gmail.com` / `0000` لأسباب أمنية.

---

## API (Vercel)

| المسار | الوظيفة |
|--------|---------|
| `POST /api/create-order` | إنشاء طلب مع التحقق من السعر والمخزون |
| `POST /api/track-order` | تتبع طلب (رقم الطلب + الهاتف) |
| `POST /api/ensure-profile` | إنشاء profile بعد التسجيل/OAuth |

---

## التطوير المحلي

```bash
npx vercel dev
```

يفتح المتجر مع دوال `/api/*` محلياً.

---

## هيكل المشروع

```
public/          ← واجهة المتجر
api/             ← دوال Vercel (serverless)
supabase/        ← سكربتات SQL
```
