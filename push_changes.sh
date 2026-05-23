#!/bin/bash
git add -A
git commit -m "fix: prevent automatic admin logout in dashboard by retaining admin user metadata

- Updated isLoggedIn in public/utils.js:
  * Ensures that when adminToken is active, the admin's 'navito_current_user' is never cleared or cleaned up by the stale state logic.
  * This completely resolves the admin login loop where entering admin@gmail.com and password 0000 would login and immediately logout/redirect back to login.html."
git push origin main
echo "✅ Done! Pushed to GitHub."
