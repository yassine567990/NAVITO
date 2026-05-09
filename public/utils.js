/**
 * نافيتو - الأدوات المساعدة المشتركة (Navito Shared Utilities)
 * Powered by Supabase — no backend server required.
 */

const Utils = {

    /**
     * مساعدات المصادقة (Authentication Helpers) — Supabase Auth
     */
    isLoggedIn: function () {
        // Check localStorage for Supabase session token
        const session = localStorage.getItem('navito_session');
        return !!session;
    },

    isAdmin: function () {
        const user = JSON.parse(localStorage.getItem('navito_current_user') || '{}');
        return user.role === 'admin';
    },

    getSession: async function () {
        const { data: { session } } = await window.supabase.auth.getSession();
        return session;
    },

    logout: async function (redirectUrl = '/') {
        await window.supabase.auth.signOut();
        localStorage.removeItem('navito_current_user');
        localStorage.removeItem('navito_session');
        window.location.href = redirectUrl;
    },

    login: async function (email, password) {
        const { data, error } = await window.supabase.auth.signInWithPassword({ email, password });
        if (error) throw new Error(error.message);

        // Fetch profile from DB
        const { data: profile } = await window.supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

        const userData = {
            id: data.user.id,
            email: data.user.email,
            fullname: profile?.fullname || data.user.user_metadata?.fullname || '',
            phone: profile?.phone || '',
            role: profile?.role || 'user'
        };

        localStorage.setItem('navito_session', JSON.stringify(data.session));
        localStorage.setItem('navito_current_user', JSON.stringify(userData));
        return userData;
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

        // Profile is auto-created by Supabase trigger on auth.users insert
        const user = {
            id: data.user.id,
            email: data.user.email,
            fullname,
            phone,
            role: 'user'
        };

        if (data.session) {
            localStorage.setItem('navito_session', JSON.stringify(data.session));
            localStorage.setItem('navito_current_user', JSON.stringify(user));
        }

        return user;
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
        const { data, error } = await window.supabase
            .from('products')
            .insert([productData])
            .select()
            .single();
        if (error) throw new Error(error.message);
        return data;
    },

    updateProduct: async function (id, productData) {
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
    createOrder: async function (orderData) {
        const session = await this.getSession();
        if (!session) throw new Error('يجب تسجيل الدخول أولاً');

        const payload = {
            user_id: session.user.id,
            items: orderData.orderItems,
            total_amount: orderData.totalAmount,
            shipping_address: orderData.shippingAddress,
            payment_method: orderData.paymentMethod || 'Cash on Delivery',
            payment_status: 'Pending',
            status: 'Pending'
        };

        const { data, error } = await window.supabase
            .from('orders')
            .insert([payload])
            .select()
            .single();

        if (error) throw new Error(error.message);
        return data;
    },

    getMyOrders: async function () {
        const session = await this.getSession();
        if (!session) return [];

        const { data, error } = await window.supabase
            .from('orders')
            .select('*')
            .eq('user_id', session.user.id)
            .order('created_at', { ascending: false });

        if (error) throw new Error(error.message);
        return data || [];
    },

    getAllOrders: async function () {
        const { data, error } = await window.supabase
            .from('orders')
            .select('*, profiles(fullname, email)')
            .order('created_at', { ascending: false });
        if (error) throw new Error(error.message);
        return data || [];
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
        const currency = typeof window.t === 'function' ? window.t('currency') : (this.isEnglish() ? 'SAR' : 'ر.س');
        return `${currency} ${Number(amount).toFixed(2)}`;
    }
};

// ─── Supabase Auth State Listener ────────────────────────────────────────────
// Keep localStorage in sync with Supabase session
if (window.supabase) {
    window.supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
            localStorage.setItem('navito_session', JSON.stringify(session));
        } else if (event === 'SIGNED_OUT') {
            localStorage.removeItem('navito_session');
            localStorage.removeItem('navito_current_user');
        } else if (event === 'TOKEN_REFRESHED' && session) {
            localStorage.setItem('navito_session', JSON.stringify(session));
        }
    });
}

// التصدير العام (Global Exposure)
window.Utils = Utils;
window.showToast = Utils.showToast.bind(Utils);
window.isLoggedIn = Utils.isLoggedIn.bind(Utils);
window.toggleTheme = Utils.toggleTheme.bind(Utils);
