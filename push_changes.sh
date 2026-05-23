#!/bin/bash
git add -A
git commit -m "fix: prevent admin checkout with custom error + robust createOrder session fallback

- Updated createOrder in public/utils.js:
  * Prevents Admin user accounts (such as admin@gmail.com) from checking out and displays a clear message asking them to log in with a customer account to test checkout.
  * Robustly falls back to localStorage current_user and session IDs if Supabase session fails to sync or fetch, preventing unexpected 'login first' errors for Google OAuth users."
git push origin main
echo "✅ Done! Pushed to GitHub."
