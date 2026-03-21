/**
 * CartManager Module - NAVITO Elite Store
 * Handles all shopping cart state and operations.
 * Depends on: utils.js (showToast, t), i18n.js (t)
 */

const CartManager = {
    items: [],

    /** Load saved cart from localStorage */
    init() {
        try {
            this.items = JSON.parse(localStorage.getItem('navito_cart') || '[]');
        } catch (e) {
            console.warn('[CartManager] Failed to parse saved cart, resetting.', e);
            this.items = [];
        }
        this.updateBadges();
    },

    /** Persist cart to localStorage and update UI */
    save() {
        localStorage.setItem('navito_cart', JSON.stringify(this.items));
        this.updateBadges();
        // Re-render cart sidebar
        if (typeof NAVITO !== 'undefined' && typeof NAVITO.UI.renderCart === 'function') {
            NAVITO.UI.renderCart();
        }
        // Re-render checkout page if on it
        if (typeof window.renderCheckoutPage === 'function') {
            window.renderCheckoutPage();
        }
    },

    /** Add a product to the cart (merges if already present) */
    addItem(product, btnElement = null, quantity = 1) {
        const existing = this.items.find(i => i.name === product.name);
        if (existing) {
            existing.quantity += quantity;
        } else {
            this.items.push({ ...product, quantity });
        }
        this.save();
        this._animateButton(btnElement, product);
        this._pulseBadge();
    },

    /** Remove item by name */
    removeItem(productName) {
        this.items = this.items.filter(i => i.name !== productName);
        this.save();
    },

    /** Update item quantity by delta. Removes if quantity reaches 0 */
    updateQuantity(productName, delta) {
        const item = this.items.find(i => i.name === productName);
        if (!item) return;
        item.quantity += delta;
        if (item.quantity <= 0) {
            this.removeItem(productName);
        } else {
            this.save();
        }
    },

    /** Get total price */
    getTotal() {
        return this.items.reduce((sum, i) => {
            const price = parseFloat(i.price) || 0;
            const quantity = parseInt(i.quantity) || 0;
            return sum + (price * quantity);
        }, 0);
    },

    /** Get total item count */
    getCount() {
        return this.items.reduce((sum, i) => sum + i.quantity, 0);
    },

    /** Empty the cart */
    clear() {
        this.items = [];
        this.save();
    },

    /** Update all badge elements across the page */
    updateBadges() {
        const count = this.getCount();
        const show = count > 0 ? 'flex' : 'none';

        ['cart-badge', 'mobile-cart-badge'].forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.textContent = count;
                el.style.display = show;
            }
        });
    },

    /** Visual feedback on add-to-cart button */
    _animateButton(btn, product) {
        if (!btn) return;
        const orig = btn.innerHTML;
        btn.classList.add('btn-success', 'btn-pop-animation');
        btn.innerHTML = '<span style="font-weight:bold; font-size:1.2rem;">✓</span>';

        // Particle effect
        if (typeof createParticles === 'function') createParticles(btn);
        // Fly-to-cart animation
        if (product.image && typeof animateFlyToCart === 'function') animateFlyToCart(btn, product.image);

        setTimeout(() => {
            btn.classList.remove('btn-success', 'btn-pop-animation');
            btn.innerHTML = orig;
        }, 1000);
    },

    /** Pulse the cart badge on add */
    _pulseBadge() {
        const badge = document.getElementById('cart-badge');
        if (badge) {
            badge.classList.remove('pulse-animation');
            void badge.offsetWidth; // Trigger reflow
            badge.classList.add('pulse-animation');
        }
    }
};

// Expose to window for compatibility with existing inline references
window.CartManager = CartManager;
