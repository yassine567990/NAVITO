#!/bin/bash
git add -A
git commit -m "fix: robust logout logic and smart navbar display name fallbacks

- Updated public/utils.js:
  * Wrapped Supabase signOut in try-catch block inside Utils.logout() so network or session failures never block client-side session deletion and redirect.
- Updated public/app.js:
  * Enhanced UI.updateAuth(): if the user has no fullname set, it smartly displays their email prefix or phone number instead of generic 'My Account' (حسابي), providing a highly premium personalized UX."
git push origin main
echo "✅ Done! Pushed to GitHub."
