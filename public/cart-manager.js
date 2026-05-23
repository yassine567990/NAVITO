/**
 * CartManager Module - NAVITO Elite Store
 * Handles all shopping cart state and operations.
 * Depends on: utils.js (showToast, t), i18n.js (t)
 */

const CartManager = {
    items: [],

    _itemKey(item) {
        if (typeof Utils !== 'undefined' && Utils.getProductId) {
            const id = Utils.getProductId(item);
            if (id) return String(id);
        }
        return item._id || item.id || item.name;
    },

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
        if (typeof NAVITO !== 'undefined' && typeof NAVITO.UI.renderCart === 'function') {
            NAVITO.UI.renderCart();
        }
        if (typeof window.renderCheckoutPage === 'function') {
            window.renderCheckoutPage();
        }
    },

    /** Add a product to the cart (merges if already present) */
    addItem(product, btnElement = null, quantity = 1) {
        const key = this._itemKey(product);
        const existing = this.items.find(i => this._itemKey(i) === key);
        const stock = parseInt(product.stock, 10);
        const qty = Math.max(1, parseInt(quantity, 10) || 1);

        if (Number.isFinite(stock) && stock <= 0) {
            if (typeof showToast === 'function') {
                showToast(typeof t === 'function' ? t('out_of_stock') || 'نفد المخزون' : 'نفد المخزون', 'error');
            }
            return;
        }
        if (Number.isFinite(stock) && existing && existing.quantity + qty > stock) {
            if (typeof showToast === 'function') {
                showToast(`الكمية المتوفرة: ${stock}`, 'error');
            }
            return;
        }

        if (existing) {
            existing.quantity += qty;
        } else {
            this.items.push({
                ...product,
                _id: product._id || product.id,
                id: product.id || product._id,
                quantity: qty,
            });
        }
        this.save();
        this._animateButton(btnElement, product);
        this._pulseBadge();
    },

    /** Remove item by key */
    removeItem(itemKey) {
        this.items = this.items.filter(i => this._itemKey(i) !== itemKey);
        this.save();
    },

    /** Update item quantity by delta. Removes if quantity reaches 0 */
    updateQuantity(itemKey, delta) {
        const item = this.items.find(i => this._itemKey(i) === itemKey);
        if (!item) return;
        item.quantity += delta;
        if (item.quantity <= 0) {
            this.removeItem(itemKey);
        } else {
            const stock = parseInt(item.stock, 10);
            if (Number.isFinite(stock) && item.quantity > stock) {
                item.quantity = stock;
                if (typeof showToast === 'function') showToast(`الكمية المتوفرة: ${stock}`, 'warning');
            }
            this.save();
        }
    },

    /** Get total price */
    getTotal() {
        return this.items.reduce((sum, i) => {
            const price = parseFloat(i.price) || 0;
            const quantity = parseInt(i.quantity, 10) || 0;
            return sum + (price * quantity);
        }, 0);
    },

    /** Get total item count */
    getCount() {
        return this.items.reduce((sum, i) => sum + (parseInt(i.quantity, 10) || 0), 0);
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

    _animateButton(btn, product) {
        if (!btn) return;
        const orig = btn.innerHTML;
        btn.classList.add('btn-success', 'btn-pop-animation');
        btn.innerHTML = '<span style="font-weight:bold; font-size:1.2rem;">✓</span>';

        if (typeof createParticles === 'function') createParticles(btn);
        if (product.image && typeof animateFlyToCart === 'function') animateFlyToCart(btn, product.image);

        setTimeout(() => {
            btn.classList.remove('btn-success', 'btn-pop-animation');
            btn.innerHTML = orig;
        }, 1000);
    },

    _pulseBadge() {
        const badge = document.getElementById('cart-badge');
        if (badge) {
            badge.classList.remove('pulse-animation');
            void badge.offsetWidth;
            badge.classList.add('pulse-animation');
        }
    }
};

window.CartManager = CartManager;
