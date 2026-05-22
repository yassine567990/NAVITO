#!/bin/bash
KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlmam16anNpYmJvZ2ZpbGJwZmlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzMzI5NzQsImV4cCI6MjA5MzkwODk3NH0.lsfC653oKuHy2RW0its5bwNPobUxU96xDWAiPBB-WLE"
URL="https://yfjmzjsibbogfilbpfir.supabase.co/rest/v1"

echo "=== PROFILES ==="
curl -s "$URL/profiles?select=id,fullname,role" \
  -H "apikey: $KEY" \
  -H "Authorization: Bearer $KEY"

echo ""
echo "=== ORDERS ==="
curl -s "$URL/orders?select=id,user_id,status&limit=5" \
  -H "apikey: $KEY" \
  -H "Authorization: Bearer $KEY"

echo ""
echo "=== TEST INSERT ORDER (dry run - checking what user_id Yassine has) ==="
echo "Yassine profile ID: 09176d57-f235-46cd-81c7-0a15d0de014f"

echo ""
echo "=== TRY INSERT TEST ORDER ==="
curl -s -X POST "$URL/orders" \
  -H "apikey: $KEY" \
  -H "Authorization: Bearer $KEY" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  -d '{"user_id":"09176d57-f235-46cd-81c7-0a15d0de014f","items":[{"name":"Test","price":1,"quantity":1}],"total_amount":1,"shipping_address":{"fullname":"Test","address":"Test","city":"Test","postal":"00000","phone":"0000000000"},"payment_method":"Cash on Delivery","status":"Pending"}'
