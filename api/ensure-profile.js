/**
 * NAVITO — Vercel Serverless API: /api/ensure-profile
 * 
 * Creates/updates a user profile in Supabase using the service_role key.
 * This bypasses RLS safely since it runs server-side.
 * 
 * Called by the frontend after Google OAuth or any auth flow
 * where the user might not have a profile row yet.
 * 
 * Special behavior: yassinesabiri2003@gmail.com is ALWAYS promoted to admin.
 */

const SUPABASE_URL = 'https://yfjmzjsibbogfilbpfir.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Validate the caller has a valid Supabase JWT (user must be authenticated)
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: missing token' });
  }

  const userToken = authHeader.replace('Bearer ', '');

  // Verify the user token by calling Supabase Auth
  let userId, userMeta, userEmail;
  try {
    const verifyRes = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${userToken}`
      }
    });
 
    if (!verifyRes.ok) {
      return res.status(401).json({ error: 'Unauthorized: invalid token' });
    }
 
    const userData = await verifyRes.json();
    userId = userData.id;
    userEmail = userData.email;
    userMeta = userData.user_metadata || {};
  } catch (e) {
    return res.status(401).json({ error: 'Token verification failed', detail: e.message });
  }
 
  if (!userId) {
    return res.status(400).json({ error: 'Could not extract user ID from token' });
  }

  // Determine if this is the target admin email
  const isTargetAdmin = userEmail && userEmail.toLowerCase() === 'yassinesabiri2003@gmail.com';
 
  // Parse optional metadata from request body
  let bodyMeta = {};
  try {
    bodyMeta = req.body || {};
  } catch (e) {}
 
  // Build profile data
  const profileData = {
    id: userId,
    fullname: bodyMeta.fullname || userMeta.fullname || userMeta.full_name || '',
    phone: bodyMeta.phone || userMeta.phone || '',
    role: isTargetAdmin ? 'admin' : 'user'
  };
 
  const serviceHeaders = {
    'apikey': SUPABASE_SERVICE_KEY,
    'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
    'Content-Type': 'application/json'
  };

  try {
    // Check if profile already exists
    const checkRes = await fetch(
      `${SUPABASE_URL}/rest/v1/profiles?id=eq.${userId}&select=id,role`,
      { headers: serviceHeaders }
    );
    const existing = await checkRes.json();
 
    if (existing && existing.length > 0) {
      const currentRole = existing[0].role;

      // Always ensure the target admin has admin role
      if (isTargetAdmin && currentRole !== 'admin') {
        await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${userId}`, {
          method: 'PATCH',
          headers: serviceHeaders,
          body: JSON.stringify({ role: 'admin' })
        });
        console.log(`💪 Force-promoted existing user ${userEmail} to admin`);
        return res.status(200).json({
          success: true,
          message: 'Profile updated: role promoted to admin',
          id: userId,
          role: 'admin'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Profile already exists',
        id: userId,
        role: currentRole
      });
    }

    // Insert new profile using service_role (bypasses RLS safely)
    const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/profiles`, {
      method: 'POST',
      headers: { ...serviceHeaders, 'Prefer': 'return=minimal' },
      body: JSON.stringify(profileData)
    });

    if (!insertRes.ok) {
      const errText = await insertRes.text();
      // If duplicate (race condition), that's fine — try to read role
      if (errText.includes('duplicate') || errText.includes('23505')) {
        // Try to get the existing role
        const recheckRes = await fetch(
          `${SUPABASE_URL}/rest/v1/profiles?id=eq.${userId}&select=role`,
          { headers: serviceHeaders }
        );
        const recheckData = await recheckRes.json();
        const existingRole = recheckData?.[0]?.role || (isTargetAdmin ? 'admin' : 'user');
        return res.status(200).json({
          success: true,
          message: 'Profile already exists (race)',
          id: userId,
          role: existingRole
        });
      }
      console.error('Profile insert error:', errText);
      return res.status(500).json({ error: 'Failed to create profile', detail: errText });
    }

    console.log(`✅ Profile created for user: ${userId} (${userEmail}) with role: ${profileData.role}`);
    return res.status(200).json({
      success: true,
      message: 'Profile created',
      id: userId,
      role: profileData.role
    });

  } catch (e) {
    console.error('ensure-profile error:', e);
    return res.status(500).json({ error: 'Internal server error', detail: e.message });
  }
}
