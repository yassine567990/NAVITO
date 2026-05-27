/**
 * نافيتو - الأدوات المساعدة المشتركة (Navito Shared Utilities)
 * Powered by Supabase — no backend server required.
 */

const Utils = {

    escapeHtml: function (str) {
        return String(str ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    },

    getProductId: function (product) {
        return product?._id || product?.id || null;
    },

    isProduction: function () {
        const h = window.location.hostname;
        return h !== 'localhost' && h !== '127.0.0.1' && !h.endsWith('.local');
    },

    /**
     * مساعدات المصادقة (Authentication Helpers) — Supabase Auth
     */
    isLoggedIn: function () {
        const sessionStr = localStorage.getItem('navito_session');
        let currentUserStr = localStorage.getItem('navito_current_user');

        if (sessionStr) {
            try {
                const session = JSON.parse(sessionStr);
                if (session && session.user) {
                    // Self-healing: if currentUser is missing or invalid, reconstruct it from the session
                    if (!currentUserStr) {
                        const userData = {
                            id: session.user.id,
                            email: session.user.email,
                            fullname: session.user.user_metadata?.fullname || session.user.user_metadata?.full_name || 'Google User',
                            phone: session.user.user_metadata?.phone || '',
                            role: 'user'
                        };
                        localStorage.setItem('navito_current_user', JSON.stringify(userData));
                        currentUserStr = JSON.stringify(userData);
                        console.log('🔄 Self-healed missing currentUser from active session.');
                    }
                    
                    const user = JSON.parse(currentUserStr);
                    const hasValidUser = !!(user && (user.id || user._id) && user.email);
                    if (hasValidUser) {
                        return true;
                    }
                }
            } catch (e) {
                return false;
            }
        }
        
        // If no session but currentUser exists, clear it to avoid stale state (only for regular users)
        if (currentUserStr) {
            try {
                const parsed = JSON.parse(currentUserStr);
                if (parsed.role !== 'admin') {
                    localStorage.removeItem('navito_current_user');
                }
            } catch (e) {
                localStorage.removeItem('navito_current_user');
            }
        }
        return false;
    },

    isAdmin: function () {
        // يُشترط وجود جلسة Supabase حقيقية مع دور admin في الـ profile
        // هذا يمنع أي شخص من رفع قيمة admin_token أو تعديل localStorage يدوياً
        const sessionStr = localStorage.getItem('navito_session');
        const user = JSON.parse(localStorage.getItem('navito_current_user') || '{}');
        if (!sessionStr || user.role !== 'admin') return false;
        try {
            const session = JSON.parse(sessionStr);
            // يجب أن يكون للجلسة user.id مطابق للمستخدم الحالي
            return !!(session && session.user && session.user.id && session.user.id === user.id);
        } catch (e) {
            return false;
        }
    },

    getSession: async function () {
        const { data: { session } } = await window.supabase.auth.getSession();
        return session;
    },

    logout: async function (redirectUrl = 'index.html') {
        try {
            await window.supabase.auth.signOut();
        } catch (e) {
            console.warn('⚠️ Supabase signOut error (ignoring to proceed with local logout):', e.message);
        }
        localStorage.removeItem('navito_current_user');
        localStorage.removeItem('navito_session');
        // Force clear Supabase tokens to prevent auto-login loop
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith('sb-')) {
                localStorage.removeItem(key);
            }
        });
        window.location.href = redirectUrl;
    },

    /** تنظيف أخطاء OAuth في الرابط (مثل otp_expired) */
    handleAuthHashErrors: function () {
        const hash = window.location.hash || '';
        if (!hash.includes('error=')) return;
        if (hash.includes('otp_expired') || hash.includes('access_denied')) {
            const msg = 'انتهت صلاحية رابط البريد. سجّل الدخول بالبريد وكلمة المرور من صفحة login.';
            if (typeof window.showToast === 'function') window.showToast(msg, 'error');
            else alert(msg);
        }
        history.replaceState(null, '', window.location.pathname + window.location.search);
    },

    // Initial Session Check
    async init() {
        this.handleAuthHashErrors();
        localStorage.removeItem('admin_token');
        localStorage.removeItem('demo_token_v1');
        localStorage.removeItem('navito_rem_pass');

        const sessionStr = localStorage.getItem('navito_session');
        if (sessionStr) {
            try {
                const session = JSON.parse(sessionStr);
                await window.supabase.auth.setSession(session);
            } catch (e) {
                localStorage.removeItem('navito_session');
            }
        }
    },

    /** جلب الدور الحالي من Supabase (مصدر الحقيقة) */
    syncProfileFromDb: async function () {
        const { data: { session } } = await window.supabase.auth.getSession();
        if (!session?.user) return null;

        const { data: profile, error } = await window.supabase
            .from('profiles')
            .select('id, fullname, phone, role')
            .eq('id', session.user.id)
            .maybeSingle();

        if (error) {
            console.warn('[Utils] syncProfileFromDb:', error.message);
        }

        const userData = {
            id: session.user.id,
            email: session.user.email,
            fullname: profile?.fullname || session.user.user_metadata?.fullname || session.user.user_metadata?.full_name || '',
            phone: profile?.phone || '',
            role: profile?.role || 'user',
        };

        localStorage.setItem('navito_session', JSON.stringify(session));
        localStorage.setItem('navito_current_user', JSON.stringify(userData));
        return userData;
    },

    login: async function (email, password) {
        const { data, error } = await window.supabase.auth.signInWithPassword({ email, password });
        
        if (error) {
            // Check for specific error "Email not confirmed"
            if (error.message.includes('Email not confirmed')) {
                const err = new Error(error.message);
                err.code = 'email_not_confirmed';
                throw err;
            }
            throw new Error(error.message);
        }

        localStorage.setItem('navito_session', JSON.stringify(data.session));
        await window.supabase.auth.setSession(data.session);
        return await this.syncProfileFromDb();
    },

    resendConfirmationEmail: async function (email) {
        const { data, error } = await window.supabase.auth.resend({
            type: 'signup',
            email: email,
        });
        if (error) throw new Error(error.message);
        return data;
    },

    register: async function (userData) {
        const { fullname, email, password, phone } = userData;

        const { data, error } = await window.supabase.auth.signUp({
            email,
            password,
            options: {
                data: { fullname, phone }
            }
        });

        if (error) throw new Error(error.message);

        // Ensure profile row exists immediately after signup
        if (data.user?.id) {
            await this.ensureProfile(data.user.id, { fullname, phone });
        }

        const user = {
            id: data.user?.id,
            email: data.user?.email,
            fullname,
            phone,
            role: 'user'
        };

        // Save user data to localStorage for immediate UI update
        localStorage.setItem('navito_current_user', JSON.stringify(user));

        if (data.session) {
            localStorage.setItem('navito_session', JSON.stringify(data.session));
        }

        return { user, session: data.session };
    },

    resetPassword: async function (email) {
        // Construct the redirect URL dynamically based on current path
        const currentPath = window.location.pathname;
        const redirectPath = currentPath.substring(0, currentPath.lastIndexOf('/') + 1) + 'reset-password.html';
        const redirectTo = window.location.origin + redirectPath;

        const { data, error } = await window.supabase.auth.resetPasswordForEmail(email, {
            redirectTo: redirectTo,
        });
        if (error) throw new Error(error.message);
        return data;
    },

    loginWithGoogle: async function () {
        const { data, error } = await window.supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/index.html`
            }
        });
        if (error) throw new Error(error.message);
        return data;
    },

    /**
     * جلب المنتجات (Products)
     */
    getProducts: async function () {
        const { data, error } = await window.supabase
            .from('products')
            .select('*')
            .eq('is_active', true)
            .order('created_at', { ascending: false });

        if (error) throw new Error(error.message);
        return data || [];
    },

    getProductById: async function (id) {
        const { data, error } = await window.supabase
            .from('products')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw new Error(error.message);
        return data;
    },

    /**
     * إدارة المنتجات — للأدمن فقط (Admin Product Management)
     */
    createProduct: async function (productData) {
        if (!this.isAdmin()) throw new Error('غير مصرح');
        const { data, error } = await window.supabase
            .from('products')
            .insert([productData])
            .select()
            .single();
        if (error) throw new Error(error.message);
        return data;
    },

    updateProduct: async function (id, productData) {
        if (!this.isAdmin()) throw new Error('غير مصرح');
        const { data, error } = await window.supabase
            .from('products')
            .update(productData)
            .eq('id', id)
            .select()
            .single();
        if (error) throw new Error(error.message);
        return data;
    },

    deleteProduct: async function (id) {
        if (!this.isAdmin()) throw new Error('غير مصرح');
        const { error } = await window.supabase
            .from('products')
            .delete()
            .eq('id', id);
        if (error) throw new Error(error.message);
        return true;
    },

    /**
     * الطلبات (Orders)
     */
    /**
     * ضمان وجود سطر في جدول profiles للمستخدم الحالي
     * يمنع خطأ foreign key عند إنشاء الطلبات
     */
    ensureProfile: async function (userId, metadata) {
        if (!userId) return;

        // Fetch current user email to see if they are the target admin
        const { data: { session: currentSession } } = await window.supabase.auth.getSession();
        const userEmail = currentSession?.user?.email;
        const isTargetAdmin = userEmail && userEmail.toLowerCase() === 'yassinesabiri2003@gmail.com';

        // Step 1: Check if profile already exists
        try {
            const { data: existing } = await window.supabase
                .from('profiles')
                .select('id, role')
                .eq('id', userId)
                .maybeSingle();

            if (existing) {
                console.log('✅ Profile exists for:', userId);
                // If the profile already exists and is admin (or not our target admin), return early
                if (!isTargetAdmin || existing.role === 'admin') {
                    return;
                }
                console.log('🔄 Target admin found but not yet admin. Forcing API sync to promote.');
            }
        } catch (e) {
            console.warn('⚠️ ensureProfile SELECT error:', e.message);
        }

        const profileData = {
            id: userId,
            fullname: metadata?.fullname || metadata?.full_name || '',
            phone: metadata?.phone || '',
            role: isTargetAdmin ? 'admin' : 'user'
        };

        // Step 2: Try direct upsert (works if RLS allows it)
        let directSuccess = false;
        try {
            const { error: upsertErr } = await window.supabase
                .from('profiles')
                .upsert(profileData, { onConflict: 'id' });

            if (!upsertErr) {
                directSuccess = true;
                console.log('✅ Profile created via direct upsert for:', userId);
            } else {
                console.warn('⚠️ Direct upsert failed:', upsertErr.message);
            }
        } catch (e) {
            console.warn('⚠️ Direct upsert exception:', e.message);
        }

        // Step 3: Fallback — call serverless API (uses service_role, bypasses RLS safely)
        if (!directSuccess) {
            try {
                const { data: { session } } = await window.supabase.auth.getSession();
                const token = session?.access_token;

                if (token) {
                    const apiRes = await fetch('/api/ensure-profile', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            fullname: profileData.fullname,
                            phone: profileData.phone
                        })
                    });

                    if (apiRes.ok) {
                        const result = await apiRes.json();
                        console.log('✅ Profile created via API:', result.message);
                        directSuccess = true;
                    } else {
                        const errBody = await apiRes.text();
                        console.error('❌ API ensure-profile failed:', errBody);
                    }
                } else {
                    console.warn('⚠️ No session token available for API call');
                }
            } catch (apiErr) {
                console.error('❌ API ensure-profile exception:', apiErr.message);
            }
        }

        // Step 4: Final verification
        try {
            const { data: verify } = await window.supabase
                .from('profiles')
                .select('id')
                .eq('id', userId)
                .maybeSingle();

            if (verify) {
                console.log('✅ Profile verified for:', userId);
                return;
            }
        } catch (e) {
            console.warn('⚠️ Verification SELECT error:', e.message);
        }

        // If we got directSuccess but SELECT fails (RLS on SELECT), don't throw
        if (directSuccess) {
            console.log('✅ Profile was created (SELECT blocked by RLS but insert succeeded)');
            return;
        }

        console.error('❌ Profile creation failed for:', userId);
        throw new Error('فشل في إنشاء الملف الشخصي. يرجى تسجيل الخروج وإعادة الدخول.');
    },

    createOrder: async function (orderData) {
        // Step 0: Clear block for Admin accounts
        if (this.isAdmin()) {
            throw new Error('حساب المشرف مخصص للإدارة فقط لوحة التحكم. يرجى تسجيل الدخول بحساب زبون عادي لتجربة الشراء.');
        }

        let userId = null;
        let userMeta = {};

        // Step 1: Try to get/refresh the active Supabase session
        try {
            // First try to refresh the session to make sure it's valid
            const { data: refreshData } = await window.supabase.auth.refreshSession();
            if (refreshData?.session?.user) {
                userId = refreshData.session.user.id;
                userMeta = refreshData.session.user.user_metadata || {};
                // Update stored session with refreshed one
                localStorage.setItem('navito_session', JSON.stringify(refreshData.session));
                console.log('✅ createOrder: using refreshed session user_id:', userId);
            } else {
                // Fallback to getSession if refresh fails
                const { data: { session } } = await window.supabase.auth.getSession();
                if (session && session.user) {
                    userId = session.user.id;
                    userMeta = session.user.user_metadata || {};
                    console.log('✅ createOrder: using session user_id:', userId);
                }
            }
        } catch (e) {
            console.warn('⚠️ createOrder: session retrieval failed:', e.message);
        }

        // Step 2: Fallback to localStorage session if no active Supabase session
        if (!userId) {
            const sessionStr = localStorage.getItem('navito_session');
            if (sessionStr) {
                try {
                    const parsedSession = JSON.parse(sessionStr);
                    userId = parsedSession.user?.id || parsedSession.user_id;
                    userMeta = parsedSession.user?.user_metadata || {};
                    if (userId) console.log('✅ createOrder: using localStorage session user_id:', userId);
                } catch (e) {}
            }
        }

        // Step 3: Fallback to navito_current_user (robust parsing)
        if (!userId) {
            const currentUserStr = localStorage.getItem('navito_current_user');
            if (currentUserStr) {
                try {
                    const parsedUser = JSON.parse(currentUserStr);
                    // Only use if it has a valid ID
                    if (parsedUser.id || parsedUser._id) {
                        userId = parsedUser.id || parsedUser._id;
                        userMeta = { fullname: parsedUser.fullname, phone: parsedUser.phone };
                        console.log('✅ createOrder: using current_user id:', userId);
                    }
                } catch (e) {}
            }
        }

        // If still no valid user_id found, throw a clear login message
        if (!userId) {
            console.error('❌ createOrder: No valid user_id found!');
            throw new Error('يجب تسجيل الدخول أولاً لإتمام عملية الشراء.');
        }

        // Ensure profile exists before inserting order
        try {
            await this.ensureProfile(userId, userMeta);
        } catch (profileError) {
            console.error('❌ createOrder: ensureProfile failed:', profileError.message);
            throw new Error('خطأ في الحساب: يرجى تسجيل الخروج وإعادة تسجيل الدخول ثم المحاولة مجدداً');
        }

        const { data: { session } } = await window.supabase.auth.getSession();
        const token = session?.access_token;
        if (!token) {
            throw new Error('يجب تسجيل الدخول أولاً لإتمام عملية الشراء.');
        }

        const apiRes = await fetch('/api/create-order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                orderItems: orderData.orderItems,
                shippingAddress: orderData.shippingAddress,
                paymentMethod: orderData.paymentMethod || 'Cash on Delivery',
            }),
        });

        const result = await apiRes.json().catch(() => ({}));
        if (!apiRes.ok) {
            throw new Error(result.error || 'فشل تسجيل الطلب');
        }

        return {
            ...result,
            orderId: result.orderId || result.id,
        };
    },

    trackOrder: async function (orderId, phone) {
        const apiRes = await fetch('/api/track-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId, phone }),
        });
        const result = await apiRes.json().catch(() => ({}));
        if (!apiRes.ok) throw new Error(result.error || 'تعذر تتبع الطلب');
        return result;
    },

    getMyOrders: async function () {
        let userId = null;
        const session = await this.getSession();
        
        if (session && session.user) {
            userId = session.user.id;
        } else {
            const sessionStr = localStorage.getItem('navito_session');
            const currentUserStr = localStorage.getItem('navito_current_user');
            if (sessionStr) {
                try {
                    const parsedSession = JSON.parse(sessionStr);
                    userId = parsedSession.user?.id || parsedSession.user_id;
                } catch (e) {}
            }
            if (!userId && currentUserStr) {
                try {
                    const parsedUser = JSON.parse(currentUserStr);
                    userId = parsedUser.id || parsedUser._id || null;
                } catch (e) {}
            }
        }

        if (!userId) return [];

        const { data, error } = await window.supabase
            .from('orders')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw new Error(error.message);
        return data || [];
    },

    getAllOrders: async function () {
        if (!this.isAdmin()) throw new Error('غير مصرح');
        const { data, error } = await window.supabase
            .from('orders')
            .select('*, profiles(fullname, email)')
            .order('created_at', { ascending: false });
        if (error) throw new Error(error.message);
        return data || [];
    },

    updateOrderStatus: async function (orderId, status) {
        if (!this.isAdmin()) throw new Error('غير مصرح');
        const { data, error } = await window.supabase
            .from('orders')
            .update({ status })
            .eq('id', orderId)
            .select();
        if (error) throw new Error(error.message);
        return data;
    },

    /**
     * مساعدات التدويل واللغة (Localization Helpers)
     */
    getLanguage: function () {
        return localStorage.getItem('navito_language') || 'ar';
    },

    isEnglish: function () {
        return this.getLanguage() === 'en';
    },

    /**
     * مساعدات السمات (Theme Helpers)
     */
    getTheme: function () {
        return localStorage.getItem('theme') || 'light';
    },

    applyTheme: function (theme) {
        const root = document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark-mode');
            root.classList.remove('light-mode');
        } else {
            root.classList.add('light-mode');
            root.classList.remove('dark-mode');
        }
        localStorage.setItem('theme', theme);
        this.updateThemeUI();
    },

    toggleTheme: function () {
        const currentTheme = this.getTheme();
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(newTheme);

        if (typeof window.showToast === 'function') {
            const msgKey = newTheme === 'dark' ? 'dark_mode_activated' : 'light_mode_activated';
            window.showToast(typeof window.t === 'function' ? window.t(msgKey) : (newTheme === 'dark' ? 'Dark mode activated' : 'Light mode activated'), 'success');
        }
    },

    updateThemeUI: function () {
        const isDark = this.getTheme() === 'dark';
        const icon = document.getElementById('theme-icon');
        const text = document.getElementById('theme-text');

        if (icon) icon.innerHTML = isDark ? '🌙' : '☀️';
        if (text) {
            const key = isDark ? 'light_mode' : 'dark_mode';
            text.textContent = typeof window.t === 'function' ? window.t(key) : (isDark ? 'Light Mode' : 'Dark Mode');
        }
    },

    /**
     * مساعد debounce
     */
    debounce: function (func, delay) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    },

    /**
     * مساعدات واجهة المستخدم (UI Helpers)
     */
    showToast: function (message, type = 'success') {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        const icon = type === 'success' ? '✓' : '✕';

        toast.innerHTML = `
            <span style="font-weight:bold; font-size:1.2rem;">${icon}</span>
            <span>${message}</span>
        `;

        container.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'fadeOut 0.3s ease-out forwards';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    },

    formatCurrency: function (amount) {
        const currency = typeof window.t === 'function' ? window.t('currency') : 'MAD';
        const n = Number(amount);
        return `${currency} ${(Number.isFinite(n) ? n : 0).toFixed(2)}`;
    },

    formatPrice: function (price) {
        const n = Number(price);
        return (Number.isFinite(n) ? n : 0).toFixed(2);
    },

    /**
     * تحديث يدوي للبيانات والجلسة
     */
    manualSync: async function () {
        if (typeof showToast === 'function') showToast(this.isEnglish() ? 'Syncing data...' : 'جاري تحديث البيانات...', 'success');
        
        try {
            // 1. إعادة تهيئة الجلسة
            await this.init();
            
            // 2. تحديث المنتجات
            if (window.getLocalStoreProducts) {
                await window.getLocalStoreProducts();
            }

            // 3. تحديث واجهة المستخدم
            if (window.NAVITO && window.NAVITO.UI && window.NAVITO.UI.updateAuth) {
                window.NAVITO.UI.updateAuth();
            }
            
            // 4. إعادة تطبيق الفلاتر إذا كنا في صفحة المتجر
            if (window.NAVITO && window.NAVITO.Logic && window.NAVITO.Logic.applyFilters) {
                const term = document.getElementById('main-search-input')?.value || '';
                window.NAVITO.Logic.applyFilters(term, window.NAVITO.State.currentCategory || 'الكل');
            }

            if (typeof showToast === 'function') showToast(this.isEnglish() ? 'Data synced successfully' : 'تم تحديث البيانات بنجاح', 'success');
        } catch (e) {
            console.error('Manual sync failed:', e);
            if (typeof showToast === 'function') showToast(e.message, 'error');
        }
    }
};

// ─── Supabase Auth State Listener ────────────────────────────────────────────
// Keep localStorage in sync with Supabase session
if (window.supabase) {
    window.supabase.auth.onAuthStateChange(async (event, session) => {
        if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION') && session) {
            localStorage.setItem('navito_session', JSON.stringify(session));
            
            // Ensure profile row exists safely wrapped
            if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
                try {
                    await Utils.ensureProfile(session.user.id, session.user.user_metadata);
                } catch (profileErr) {
                    console.error('⚠️ ensureProfile background error:', profileErr.message);
                }
            }

            // Sync user data if missing, or on explicit sign-in/initial load
            const currentUser = localStorage.getItem('navito_current_user');
            if (!currentUser || event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
                try {
                    const { data: profile } = await window.supabase
                         .from('profiles')
                         .select('*')
                         .eq('id', session.user.id)
                         .maybeSingle();

                    const userData = {
                        id: session.user.id,
                        email: session.user.email,
                        fullname: profile?.fullname || session.user.user_metadata?.fullname || session.user.user_metadata?.full_name || '',
                        phone: profile?.phone || '',
                        role: profile?.role || 'user'
                    };
                    localStorage.setItem('navito_current_user', JSON.stringify(userData));
                    
                    // Trigger UI update if NAVITO is available
                    if (window.NAVITO && window.NAVITO.UI && window.NAVITO.UI.updateAuth) {
                        window.NAVITO.UI.updateAuth();
                    }
                } catch (e) {
                    console.error('Error syncing user profile:', e);
                }
            }
        } else if (event === 'SIGNED_OUT') {
            localStorage.removeItem('navito_session');
            localStorage.removeItem('navito_current_user');
            
            // Trigger UI update
            if (window.NAVITO && window.NAVITO.UI && window.NAVITO.UI.updateAuth) {
                window.NAVITO.UI.updateAuth();
            }
        }
    });
}

// التصدير العام (Global Exposure)
window.Utils = Utils;
window.showToast = Utils.showToast.bind(Utils);
window.isLoggedIn = Utils.isLoggedIn.bind(Utils);
window.toggleTheme = Utils.toggleTheme.bind(Utils);
