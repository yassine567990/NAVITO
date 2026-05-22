#!/bin/bash
git add -A
git commit -m "fix: serverless API for profile creation + robust ensureProfile with API fallback

- Added /api/ensure-profile.js Vercel serverless function
  * Uses SUPABASE_SERVICE_ROLE_KEY (env var) to bypass RLS safely
  * Verifies user JWT before creating profile
  * Returns 200 if profile already exists

- Updated public/utils.js ensureProfile():
  * Step 1: Check if profile exists (SELECT)
  * Step 2: Try direct upsert (works if RLS configured)
  * Step 3: Fallback to /api/ensure-profile serverless API
  * Step 4: Verify creation with graceful RLS-aware logic

This fixes the foreign key constraint error for Google OAuth users
during checkout by ensuring profile always exists before order insert."
git push origin main
echo "✅ Done! Pushed to GitHub."
