/**
 * NAVITO — POST /api/create-order
 * Validates prices & stock server-side, then inserts the order.
 */

const SUPABASE_URL = 'https://yfjmzjsibbogfilbpfir.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

async function verifyUser(token) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: {
      apikey: SUPABASE_SERVICE_KEY,
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) return null;
  return res.json();
}

async function fetchProduct(productId) {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/products?id=eq.${productId}&select=id,name,name_en,price,stock,is_active`,
    {
      headers: {
        apikey: SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
      },
    }
  );
  if (!res.ok) return null;
  const rows = await res.json();
  return rows[0] || null;
}

async function decrementStock(productId, quantity) {
  const product = await fetchProduct(productId);
  if (!product) return;
  const newStock = Math.max(0, (parseInt(product.stock, 10) || 0) - quantity);
  await fetch(`${SUPABASE_URL}/rest/v1/products?id=eq.${productId}`, {
    method: 'PATCH',
    headers: {
      apikey: SUPABASE_SERVICE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({ stock: newStock }),
  });
}

export default async function handler(req, res) {
  setCors(res);

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  if (!SUPABASE_SERVICE_KEY) {
    return res.status(500).json({ error: 'Server misconfigured: missing SUPABASE_SERVICE_ROLE_KEY' });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const userToken = authHeader.replace('Bearer ', '');
  const user = await verifyUser(userToken);
  if (!user?.id) {
    return res.status(401).json({ error: 'Invalid session' });
  }

  const { orderItems, shippingAddress, paymentMethod } = req.body || {};
  if (!Array.isArray(orderItems) || orderItems.length === 0) {
    return res.status(400).json({ error: 'No order items' });
  }
  if (!shippingAddress?.phone || !shippingAddress?.fullname || !shippingAddress?.address) {
    return res.status(400).json({ error: 'Incomplete shipping address' });
  }

  const validatedItems = [];
  let totalAmount = 0;

  for (const item of orderItems) {
    const productId = item.product || item._id || item.id;
    const qty = Math.max(1, parseInt(item.quantity, 10) || 1);

    if (!productId || !UUID_RE.test(String(productId))) {
      return res.status(400).json({
        error: 'منتج غير صالح في السلة. يرجى تحديث الصفحة وإعادة إضافة المنتجات.',
      });
    }

    const dbProduct = await fetchProduct(productId);
    if (!dbProduct || dbProduct.is_active === false) {
      return res.status(400).json({ error: `المنتج "${item.name || productId}" غير متوفر.` });
    }

    const stock = parseInt(dbProduct.stock, 10) || 0;
    if (stock < qty) {
      return res.status(400).json({
        error: `الكمية المطلوبة من "${dbProduct.name}" غير متوفرة (المتوفر: ${stock}).`,
      });
    }

    const unitPrice = parseFloat(dbProduct.price) || 0;
    const lineTotal = unitPrice * qty;
    totalAmount += lineTotal;

    validatedItems.push({
      product: productId,
      name: dbProduct.name,
      name_en: dbProduct.name_en,
      price: unitPrice,
      quantity: qty,
      image: item.image || null,
    });
  }

  totalAmount = Math.round(totalAmount * 100) / 100;

  const orderPayload = {
    user_id: user.id,
    items: validatedItems,
    total_amount: totalAmount,
    shipping_address: shippingAddress,
    payment_method: paymentMethod || 'Cash on Delivery',
    status: 'Pending',
  };

  const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/orders`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_SERVICE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify(orderPayload),
  });

  if (!insertRes.ok) {
    const errText = await insertRes.text();
    console.error('Order insert failed:', errText);
    return res.status(500).json({ error: 'فشل تسجيل الطلب', detail: errText });
  }

  const [created] = await insertRes.json();

  for (const item of validatedItems) {
    await decrementStock(item.product, item.quantity);
  }

  return res.status(201).json({
    id: created.id,
    orderId: created.id,
    total_amount: created.total_amount,
    status: created.status,
  });
}
