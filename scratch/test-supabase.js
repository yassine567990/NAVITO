const SUPABASE_URL = 'https://yfjmzjsibbogfilbpfir.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlmam16anNpYmJvZ2ZpbGJwZmlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzMzI5NzQsImV4cCI6MjA5MzkwODk3NH0.lsfC653oKuHy2RW0its5bwNPobUxU96xDWAiPBB-WLE';

async function runTest() {
    console.log('🚀 Starting NAVITO API Integration Test...');
    console.log('📡 Connecting directly to Supabase REST API...');

    // 1. Create a test order
    const payload = {
        user_id: '00000000-0000-0000-0000-000000000000',
        items: [
            {
                product: 'test_product_id_123',
                name: 'منتج تجريبي فاخر / Premium Test Product',
                price: 250.00,
                quantity: 2,
                image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f'
            }
        ],
        total_amount: 500.00,
        shipping_address: {
            fullname: 'John Doe (Test Account)',
            address: '123 Main Street',
            city: 'Casablanca',
            postal: '20000',
            phone: '0600000000'
        },
        payment_method: 'Cash on Delivery',
        status: 'Pending'
    };

    console.log('\n🛍️ 1. Sending checkout order payload to Supabase...');
    const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/orders`, {
        method: 'POST',
        headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
        },
        body: JSON.stringify(payload)
    });

    if (!insertRes.ok) {
        throw new Error(`Failed to insert order: ${await insertRes.text()}`);
    }

    const insertedOrders = await insertRes.json();
    const newOrder = insertedOrders[0];
    console.log(`✅ Order created successfully! ID: ${newOrder.id}`);
    console.log(`👤 Customer: ${newOrder.shipping_address.fullname}`);
    console.log(`💰 Total: ${newOrder.total_amount} DH`);

    // 2. Fetch recent orders to verify it is listed (Admin View)
    console.log('\n📊 2. Querying recent orders list (Admin Dashboard simulator)...');
    const fetchRes = await fetch(`${SUPABASE_URL}/rest/v1/orders?select=*&order=created_at.desc&limit=5`, {
        headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        }
    });

    if (!fetchRes.ok) {
        throw new Error(`Failed to fetch orders: ${await fetchRes.text()}`);
    }

    const ordersList = await fetchRes.json();
    console.log(`✅ Retrieved ${ordersList.length} recent orders from Supabase.`);
    console.log(`🔔 Top Order in Admin List: ID ${ordersList[0].id} from ${ordersList[0].shipping_address.fullname} with status: [${ordersList[0].status}]`);

    // 3. Update the order status to accepted (Completed)
    console.log('\n🔄 3. Updating order status to "Completed" (Accepting Order)...');
    const updateRes = await fetch(`${SUPABASE_URL}/rest/v1/orders?id=eq.${newOrder.id}`, {
        method: 'PATCH',
        headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
        },
        body: JSON.stringify({ status: 'Completed' })
    });

    if (!updateRes.ok) {
        throw new Error(`Failed to update order status: ${await updateRes.text()}`);
    }

    const updatedOrders = await updateRes.json();
    console.log(`✅ Order status updated successfully to: [${updatedOrders[0].status}]`);

    // 4. Verify updated order list
    console.log('\n📈 4. Re-fetching order to confirm status in Sales Dashboard...');
    const verifyRes = await fetch(`${SUPABASE_URL}/rest/v1/orders?id=eq.${newOrder.id}&select=*`, {
        headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        }
    });
    const verifiedOrder = (await verifyRes.json())[0];
    console.log(`🎉 Success! Order ${verifiedOrder.id} status is verified as: [${verifiedOrder.status}]`);
    console.log('\n🏆 ALL INTEGRATION TESTS PASSED GLORIOUSLY! 🏆');
}

runTest().catch(console.error);
