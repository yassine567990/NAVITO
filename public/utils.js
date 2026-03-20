/**
 * Navito Shared Utilities
 * Consolidates common logic for Storefront and Admin Panel
 */

const Utils = {
    /**
     * Authentication Helpers
     */
    isLoggedIn: function () {
        return localStorage.getItem('navito_current_user') !== null || localStorage.getItem('admin_token') !== null;
    },

    isAdmin: function () {
        return localStorage.getItem('admin_token') !== null;
    },

    logout: function (redirectUrl = 'login.html') {
        localStorage.removeItem('navito_current_user');
        localStorage.removeItem('admin_token');
        window.location.href = redirectUrl;
    },

    /**
     * Localization Helpers
     */
    getLanguage: function () {
        return localStorage.getItem('navito_language') || 'ar';
    },

    isEnglish: function () {
        return this.getLanguage() === 'en';
    },

    /**
     * Theme Helpers
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
     * UI Helpers
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

// Global Exposure
window.Utils = Utils;
window.showToast = Utils.showToast.bind(Utils);
window.isLoggedIn = Utils.isLoggedIn.bind(Utils);
window.toggleTheme = Utils.toggleTheme.bind(Utils);
