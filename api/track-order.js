/**
 * NAVITO — POST /api/track-order
 * Lookup order by ID + phone (no login required).
 */

const SUPABASE_URL = 'https://yfjmzjsibbogfilbpfir.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function normalizePhone(phone) {
  return String(phone || '').replace(/\D/g, '').slice(-9);
}

export default async function handler(req, res) {
  setCors(res);

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  if (!SUPABASE_SERVICE_KEY) {
    return res.status(500).json({ error: 'Server misconfigured' });
  }

  const { orderId, phone } = req.body || {};
  if (!orderId || !phone) {
    return res.status(400).json({ error: 'رقم الطلب والهاتف مطلوبان' });
  }

  const cleanId = String(orderId).trim().replace(/^#/, '');

  const fetchRes = await fetch(
    `${SUPABASE_URL}/rest/v1/orders?id=eq.${encodeURIComponent(cleanId)}&select=id,status,total_amount,created_at,shipping_address,items`,
    {
      headers: {
        apikey: SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
      },
    }
  );

  if (!fetchRes.ok) {
    return res.status(500).json({ error: 'تعذر البحث عن الطلب' });
  }

  const orders = await fetchRes.json();
  const order = orders[0];

  if (!order) {
    return res.status(404).json({ error: 'لم يتم العثور على الطلب' });
  }

  const orderPhone = normalizePhone(order.shipping_address?.phone);
  const inputPhone = normalizePhone(phone);

  if (!orderPhone || orderPhone !== inputPhone) {
    return res.status(403).json({ error: 'رقم الهاتف لا يطابق الطلب' });
  }

  return res.status(200).json({
    id: order.id,
    status: order.status,
    total_amount: order.total_amount,
    created_at: order.created_at,
    items: order.items,
    shipping_address: {
      city: order.shipping_address?.city,
      fullname: order.shipping_address?.fullname,
    },
  });
}
