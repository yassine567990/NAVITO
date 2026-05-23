#!/bin/bash
git add -A
git commit -m "fix: auto-clear admin session in storefront pages to keep guest shopping empty by default

- Updated Utils.init() in public/utils.js:
  * Detects if the current page is a storefront page (not admin.html).
  * Automatically clears 'admin_token' and admin 'navito_current_user' from localStorage if present.
  * This guarantees that when entering the store, it defaults to a clean guest/empty account as requested, while keeping the admin dashboard intact and fully secure."
git push origin main
echo "✅ Done! Pushed to GitHub."
