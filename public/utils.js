/**
 * نافيتو - الأدوات المساعدة المشتركة (Navito Shared Utilities)
 * توحد المنطق البرمجي المشترك بين واجهة المتجر ولوحة الإدارة
 */

const Utils = {
    API_URL: 'http://localhost:5000/api',

    /**
     * مساعد جلب البيانات المركزي (Central API Fetcher)
     */
    apiFetch: async function (endpoint, options = {}) {
        const token = localStorage.getItem('navito_token');
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        try {
            const response = await fetch(`${this.API_URL}${endpoint}`, {
                ...options,
                headers
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'خطأ في الاتصال بالخادم');
            return data;
        } catch (error) {
            console.error(`[API Error] ${endpoint}:`, error);
            throw error;
        }
    },

    /**
     * مساعدات المصادقة (Authentication Helpers)
     */
    isLoggedIn: function () {
        return localStorage.getItem('navito_token') !== null;
    },

    isAdmin: function () {
        const user = JSON.parse(localStorage.getItem('navito_current_user') || '{}');
        return user.role === 'admin';
    },

    logout: function (redirectUrl = 'index.html') {
        localStorage.removeItem('navito_current_user');
        localStorage.removeItem('navito_token');
        window.location.href = redirectUrl;
    },

    login: async function (email, password) {
        try {
            const data = await this.apiFetch('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password })
            });
            if (data.token) {
                localStorage.setItem('navito_token', data.token);
                localStorage.setItem('navito_current_user', JSON.stringify(data));
                return data;
            }
        } catch (error) {
            throw error;
        }
    },

    register: async function (userData) {
        try {
            const data = await this.apiFetch('/auth/register', {
                method: 'POST',
                body: JSON.stringify(userData)
            });
            if (data.token) {
                localStorage.setItem('navito_token', data.token);
                localStorage.setItem('navito_current_user', JSON.stringify(data));
                return data;
            }
        } catch (error) {
            throw error;
        }
    },

    createOrder: async function (orderData) {
        try {
            return await this.apiFetch('/orders', {
                method: 'POST',
                body: JSON.stringify(orderData)
            });
        } catch (error) {
            throw error;
        }
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
     * مساعدات السمات (ليلي/نهاري) (Theme Helpers)
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

// التصدير العام (Global Exposure)
window.Utils = Utils;
window.showToast = Utils.showToast.bind(Utils);
window.isLoggedIn = Utils.isLoggedIn.bind(Utils);
window.toggleTheme = Utils.toggleTheme.bind(Utils);
