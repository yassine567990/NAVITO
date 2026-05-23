#!/bin/bash
git add -A
git commit -m "fix: self-healing session and robust auth state listener logic for Google OAuth

- Updated public/utils.js:
  * Enhanced isLoggedIn(): if navito_session exists but navito_current_user is missing (e.g. during OAuth return), it immediately self-heals by parsing the active session and reconstructing the user object on-the-fly, returning true. This prevents session loss.
  * Wrapped ensureProfile() in a try-catch within onAuthStateChange: any backend database delay/error during background profile checks will never block session activation or UI rendering."
git push origin main
echo "✅ Done! Pushed to GitHub."
