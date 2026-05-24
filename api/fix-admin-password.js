/**
 * NAVITO — /api/fix-admin-password
 * 
 * Uses Supabase Admin API (service_role) to properly set
 * the admin user's password — creates the email identity if missing.
 * 
 * Called ONCE from the browser to set up password auth for the admin account.
 * Protected by a server-side secret header.
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://yfjmzjsibbogfilbpfir.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// The admin email and password we want to set
const ADMIN_EMAIL = 'yassinesabiri2003@gmail.com';
const ADMIN_PASSWORD = 'yasin2020';

// A simple server-side secret to protect this endpoint
const SETUP_SECRET = process.env.ADMIN_SETUP_SECRET || 'navito-setup-2024';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-setup-secret');

  if (req.method === 'OPTIONS') return res.status(200).end();

  // Validate setup secret
  const secret = req.headers['x-setup-secret'] || req.query.secret;
  if (secret !== SETUP_SECRET) {
    return res.status(403).json({ error: 'Forbidden: invalid setup secret' });
  }

  if (!SUPABASE_SERVICE_KEY) {
    return res.status(500).json({ error: 'SUPABASE_SERVICE_ROLE_KEY not configured' });
  }

  // Create admin Supabase client
  const adminSupabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false }
  });

  try {
    // Step 1: Find the admin user by email
    const { data: listData, error: listError } = await adminSupabase.auth.admin.listUsers();
    if (listError) throw new Error(`listUsers failed: ${listError.message}`);

    const adminUser = listData?.users?.find(u => u.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase());

    let userId;

    if (!adminUser) {
      // User doesn't exist at all — create them fresh with email+password
      const { data: newUser, error: createError } = await adminSupabase.auth.admin.createUser({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        email_confirm: true,
        user_metadata: { fullname: 'Yassine Sabiri' }
      });
      if (createError) throw new Error(`createUser failed: ${createError.message}`);
      userId = newUser.user.id;
      console.log(`✅ Created new admin user: ${userId}`);
    } else {
      userId = adminUser.id;
      // Step 2: Update the password using Admin API (properly adds email identity)
      const { error: updateError } = await adminSupabase.auth.admin.updateUserById(userId, {
        password: ADMIN_PASSWORD,
        email_confirm: true
      });
      if (updateError) throw new Error(`updateUserById failed: ${updateError.message}`);
      console.log(`✅ Updated password for admin user: ${userId}`);
    }

    // Step 3: Ensure admin profile exists with role='admin'
    const { error: profileError } = await adminSupabase
      .from('profiles')
      .upsert({
        id: userId,
        fullname: 'Yassine Sabiri',
        phone: '',
        role: 'admin'
      }, { onConflict: 'id' });

    if (profileError) {
      console.warn('Profile upsert warning:', profileError.message);
    }

    return res.status(200).json({
      success: true,
      message: `Admin password set to "yasin2020" for ${ADMIN_EMAIL}`,
      userId,
      instructions: 'You can now login with email/password at /login.html'
    });

  } catch (e) {
    console.error('fix-admin-password error:', e);
    return res.status(500).json({ error: e.message });
  }
}
