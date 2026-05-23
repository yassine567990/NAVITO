#!/bin/bash
git add -A
git commit -m "fix: robust handleAccountClick logic to force login page redirect when user is a guest

- Updated handleAccountClick in public/app.js:
  * Strictly checks if there is a valid user with non-empty attributes (id, email, or fullname) in localStorage.
  * If the user is a guest/empty account, clicking the 'My Account' (حسابي) button will ALWAYS automatically clear any partial/corrupted localStorage keys and redirect the user instantly to login.html to create an account or sign in.
  * This prevents showing empty account details modals for logged out guests."
git push origin main
echo "✅ Done! Pushed to GitHub."
