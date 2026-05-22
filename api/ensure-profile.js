/**
 * NAVITO — Vercel Serverless API: /api/ensure-profile
 * 
 * Creates a user profile in Supabase using the service_role key.
 * This bypasses RLS safely since it runs server-side.
 * 
 * Called by the frontend after Google OAuth or any auth flow
 * where the user might not have a profile row yet.
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
  let userId, userMeta;
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
    userMeta = userData.user_metadata || {};
  } catch (e) {
    return res.status(401).json({ error: 'Token verification failed' });
  }

  if (!userId) {
    return res.status(400).json({ error: 'Could not extract user ID from token' });
  }

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
    role: 'user'
  };

  try {
    // Check if profile already exists
    const checkRes = await fetch(
      `${SUPABASE_URL}/rest/v1/profiles?id=eq.${userId}&select=id`,
      {
        headers: {
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`
        }
      }
    );
    const existing = await checkRes.json();

    if (existing && existing.length > 0) {
      return res.status(200).json({ success: true, message: 'Profile already exists', id: userId });
    }

    // Insert profile using service_role (bypasses RLS safely)
    const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/profiles`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify(profileData)
    });

    if (!insertRes.ok) {
      const errText = await insertRes.text();
      // If duplicate (race condition), that's fine
      if (errText.includes('duplicate') || errText.includes('23505')) {
        return res.status(200).json({ success: true, message: 'Profile already exists (race)', id: userId });
      }
      console.error('Profile insert error:', errText);
      return res.status(500).json({ error: 'Failed to create profile', detail: errText });
    }

    console.log(`✅ Profile created for user: ${userId}`);
    return res.status(200).json({ success: true, message: 'Profile created', id: userId });

  } catch (e) {
    console.error('ensure-profile error:', e);
    return res.status(500).json({ error: 'Internal server error', detail: e.message });
  }
}
