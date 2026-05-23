/**
 * تطبيق نافيتو المتطور (Storefront App) - منظم ومحمي
 * (C) 2026 NAVITO
 */

window.NAVITO = {
    Config: {
        FREE_SHIPPING_THRESHOLD: 500, // حد الشحن المجاني
        CURRENCY_DEFAULT: 'MAD', // العملة الافتراضية
        LOCALE_DEFAULT: 'ar' // اللغة الافتراضية
    },

    State: {
        products: [],
        currentCategory: 'الكل',
        get currentLang() {
            // قراءة اللغة من التخزين المحلي لضمان التحديث الفوري
            return localStorage.getItem('navito_language') || 'ar';
        }
    },

    UI: {
        // واجهة المستخدم للمصادقة (Auth UI)
        updateAuth: function () {
            const btn = document.getElementById('mobile-account-btn');
            const desktopBtnText = document.getElementById('desktop-account-text');
            const welcomeGuest = document.getElementById('welcome-text-guest');
            const welcomeUser = document.getElementById('welcome-text-user');

            const isLoggedIn = typeof Utils !== 'undefined' ? Utils.isLoggedIn() : (!!localStorage.getItem('navito_current_user'));

            if (isLoggedIn) {
                const user = JSON.parse(localStorage.getItem('navito_current_user') || '{}');
                const name = user.fullname ? user.fullname.split(' ')[0] : (typeof t === 'function' ? t('account') : 'حسابي');
                if (btn) {
                    btn.querySelector('span').textContent = name;
                    btn.classList.add('logged-in');
                }
                if (desktopBtnText) desktopBtnText.textContent = name;
                if (welcomeGuest) welcomeGuest.style.display = 'none';
                if (welcomeUser) {
                    welcomeUser.style.display = 'inline';
                    const lang = localStorage.getItem('navito_language') || 'ar';
                    welcomeUser.textContent = (lang === 'en' ? 'Welcome, ' : 'مرحباً، ') + name;
                }
            } else {
                if (btn) {
                    btn.querySelector('span').textContent = typeof t === 'function' ? t('account') : 'حسابي';
                    btn.classList.remove('logged-in');
                }
                if (desktopBtnText) desktopBtnText.textContent = typeof t === 'function' ? t('account') : 'حسابي';
                if (welcomeGuest) welcomeGuest.style.display = 'inline';
                if (welcomeUser) welcomeUser.style.display = 'none';
            }
        },

        // تبديل حالة العربة (إغلاق / فتح)
        toggleCart: function (forceClose = false) {
            try {
                const sidebar = document.getElementById('cart-sidebar');
                const overlay = document.getElementById('cart-overlay');
                if (!sidebar || !overlay) return;

                const isActive = sidebar.classList.contains('active');
                if (forceClose || isActive) {
                    sidebar.classList.remove('active');
                    overlay.classList.remove('active');
                    overlay.style.display = 'none';
                    document.body.style.overflow = '';
                } else {
                    sidebar.classList.add('active');
                    overlay.classList.add('active');
                    overlay.style.display = 'block';
                    document.body.style.overflow = 'hidden';
                    NAVITO.UI.renderCart();
                    
                    // تشغيل صوت العربة (بأمان)
                    setTimeout(() => { try { playCartSound(); } catch(e){} }, 50);
                }
            } catch (err) {
                console.error('خطأ في NAVITO.UI.toggleCart:', err);
            }
        },

        // عرض محتويات العربة
        renderCart: function () {
            const container = document.getElementById('cart-items');
            const totalEl = document.getElementById('cart-total');
            if (!container) return;

            const items = (typeof CartManager !== 'undefined') ? CartManager.items : [];
            const lang = NAVITO.State.currentLang;
            const isEnglish = (lang === 'en');
            const currency = (typeof t === 'function' ? t('currency') : 'MAD') || 'MAD';

            if (items.length === 0) {
                container.innerHTML = `
                    <div class="empty-cart-premium">
                        <div class="empty-cart-icon">🛍️</div>
                        <h4 data-i18n="cart_empty">${typeof t === 'function' ? t('cart_empty') : 'السلة فارغة'}</h4>
                        <p style="opacity: 0.7; font-size: 0.9rem; margin-top: 0.5rem;">
                            ${isEnglish ? 'Discover our luxury collection.' : 'اكتشف مجموعتنا الفاخرة.'}
                        </p>
                        <button class="btn-primary-luxury navito-action-start-shopping" style="margin-top: 2rem; width: auto; padding: 0.8rem 2rem;">
                            ${isEnglish ? 'Start Shopping' : 'ابدأ التسوق'}
                        </button>
                    </div>`;
                if (totalEl) totalEl.innerHTML = `<span>${isEnglish ? 'Total' : 'المجموع'}</span> <strong style="color: var(--luxury-gold);">${currency} 0.00</strong>`;
                return;
            }

            container.innerHTML = items.map(item => NAVITO.Templates.cartItem(item)).join('');
            
            if (totalEl) {
                const total = (typeof CartManager !== 'undefined') ? CartManager.getTotal() : 0;
                const label = isEnglish ? 'Total' : 'المجموع';
                totalEl.innerHTML = `<span>${label}</span> <strong style="color: var(--luxury-gold); font-size: 1.25rem;">${currency} ${total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>`;
                
                // Update Progress Bar
                NAVITO.UI.updateShippingProgress(total);
            }
        },

        updateShippingProgress: function(total) {
            const bar = document.querySelector('.progress-bar-fill');
            const text = document.querySelector('.progress-text');
            if (!bar || !text) return;

            const threshold = NAVITO.Config.FREE_SHIPPING_THRESHOLD;
            const percentage = Math.min((total / threshold) * 100, 100);
            const remaining = threshold - total;
            const isEnglish = (NAVITO.State.currentLang === 'en');

            bar.style.width = percentage + '%';
            if (remaining > 0) {
                text.innerHTML = isEnglish ? `Add <strong>MAD ${remaining.toFixed(2)}</strong> for FREE Shipping!` : `أضف <strong>MAD ${remaining.toFixed(2)}</strong> للحصول على شحن مجاني!`;
            } else {
                text.innerHTML = isEnglish ? '🎉 You got <strong>FREE SHIPPING!</strong>' : '🎉 مبروك! حصلت على <strong>شحن مجاني!</strong>';
            }
        },
        // عرض شبكة المنتجات
        renderProducts: function(products) {
            const mainGrid = document.getElementById('products-grid');
            if (!mainGrid) return;
            if (products.length === 0) {
                const noProducts = typeof t === 'function' ? t('no_products_available') : 'لا توجد منتجات متاحة حالياً';
                mainGrid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-secondary);"><h3>${noProducts}</h3></div>`;
                return;
            }
            mainGrid.innerHTML = products.map(p => NAVITO.Templates.productCard(p)).join('');
        }
    },

    Logic: {
        // الشراء الفوري
        buyNow: function (id) {
            if (typeof Utils !== 'undefined' && !Utils.isLoggedIn()) {
                if (typeof showToast === 'function') showToast(t('please_login'), 'warning');
                window.location.href = 'login.html';
                return;
            }
            const product = NAVITO.State.products.find(p => p._id == id || p.id == id);
            if (product && typeof CartManager !== 'undefined') {
                CartManager.addItem(product, null, 1);
                window.location.href = 'checkout.html';
            }
        },

        // الإضافة للسلة
        addToCart: function (id, btnElement) {
            const product = NAVITO.State.products.find(p => p._id == id || p.id == id);
            if (product && typeof CartManager !== 'undefined') {
                const isEnglish = (NAVITO.State.currentLang === 'en');
                const name = isEnglish ? (product.nameEn || product.name) : (product.name_ar || product.name);
                CartManager.addItem(product, btnElement, 1);
                if (typeof showToast === 'function') {
                    showToast(isEnglish ? `${name} added to cart ✓` : `تمت إضافة ${name} إلى السلة ✓`, 'success');
                }
            }
        },
        // الفلترة حسب التصنيف
        filterByCategory: function(category) {
            NAVITO.State.currentCategory = category;
            document.querySelectorAll('.category-pill').forEach(pill => {
                pill.classList.toggle('active', pill.textContent === category || (category === 'الكل' && pill.getAttribute('data-i18n') === 'category_all'));
            });
            const term = document.getElementById('main-search-input')?.value.toLowerCase() || '';
            NAVITO.Logic.applyFilters(term, category);
        },

        // تطبيق الفلاتر (البحث والتصنيف)
        applyFilters: function(term, category) {
            let filtered = NAVITO.State.products;
            if (category !== 'الكل') filtered = filtered.filter(p => p.category === category);
            if (term) {
                filtered = filtered.filter(p => 
                    (p.name?.toLowerCase().includes(term)) || 
                    (p.nameEn?.toLowerCase().includes(term)) ||
                    (p.description?.toLowerCase().includes(term))
                );
            }
            NAVITO.UI.renderProducts(filtered);
        }
    },

    Templates: {
        // قالب بطاقة المنتج
        productCard: function(product) {
            const isEnglish = (NAVITO.State.currentLang === 'en');
            const name = isEnglish ? (product.nameEn || product.name) : (product.name_ar || product.name);
            const rating = product.rating || 4.5;
            const currency = (typeof t === 'function' ? t('currency') : 'MAD');
            const discount = product.oldPrice ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0;
            const soldCount = product.soldCount || (Math.floor(Math.random() * 800) + 200);

            return `
                <div class="store-product-card" data-id="${product._id || product.id}">
                    <div class="store-card-img-wrapper">
                        <img class="store-card-img" src="${product.image}" alt="${name}" loading="lazy">
                        ${discount > 0 ? `<div class="discount-badge-luxury">-${discount}%</div>` : ''}
                        
                        <div class="product-card-actions">
                            <button class="action-btn-luxury navito-action-details" data-id="${product._id || product.id}">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="action-btn-luxury navito-action-buy" data-id="${product._id || product.id}">
                                <i class="fas fa-shopping-cart"></i>
                            </button>
                        </div>
                    </div>
                    <div class="luxury-body">
                        <div class="meta-row-luxury">
                            <div class="rating-container-luxury">
                                <div class="stars-luxury">
                                    ${Array(5).fill(0).map((_, i) => `<i class="${i < Math.floor(rating) ? 'fas' : 'far'} fa-star"></i>`).join('')}
                                </div>
                                <span class="rating-value">${rating.toFixed(1)}</span>
                            </div>
                            <span class="sold-count-badge"><i class="fas fa-fire"></i> ${soldCount}+ ${isEnglish ? 'Sold' : 'تم البيع'}</span>
                        </div>
                        <h3 class="title-luxury">${name}</h3>
                        <div class="price-row-luxury">
                            <div class="price-stack">
                                <div class="price-luxury">${currency} ${product.price.toFixed(2)}</div>
                                ${product.oldPrice ? `<div class="old-price-luxury">${currency} ${product.oldPrice.toFixed(2)}</div>` : ''}
                            </div>
                            ${product.category === 'العروض' ? `<span class="bundle-badge-luxury"><i class="fas fa-gift"></i> باقة</span>` : ''}
                        </div>
                        <div class="card-actions-dual">
                            <button class="btn-buy-now-luxury navito-action-buy" data-id="${product._id || product.id}">
                                <i class="fas fa-tag"></i>
                                <span>${isEnglish ? 'Buy Now' : 'اطلب الآن'}</span>
                            </button>
                            <button class="btn-add-cart-luxury navito-action-add-cart" data-id="${product._id || product.id}" title="${isEnglish ? 'Add to Cart' : 'أضف للسلة'}">
                                <i class="fas fa-shopping-basket"></i>
                            </button>
                        </div>
                    </div>
                </div>`;
        },

        // قالب عنصر العربة
        cartItem: function(item) {
            const isEnglish = (NAVITO.State.currentLang === 'en');
            const name = isEnglish ? (item.nameEn || item.name) : item.name;
            const currency = (typeof t === 'function' ? t('currency') : 'MAD');
            return `
                <div class="cart-item">
                    <img src="${item.image}" alt="${name}">
                    <div class="cart-item-details">
                        <div class="cart-item-title">${name} ${item.isBundle ? '<span class="badge-bundle-small">Bundle</span>' : ''}</div>
                        <div class="cart-item-price">${currency} ${item.price.toFixed(2)} × ${item.quantity}</div>
                        <div class="cart-item-controls">
                            <button class="qty-btn navito-action-qty" data-name="${item.name}" data-delta="-1">${item.quantity === 1 ? '<i class="fas fa-trash-alt" style="font-size:0.8rem;"></i>' : '-'}</button>
                            <span style="min-width:30px; text-align:center;">${item.quantity}</span>
                            <button class="qty-btn navito-action-qty" data-name="${item.name}" data-delta="1">+</button>
                        </div>
                    </div>
                    <button class="navito-action-remove" data-name="${item.name}" style="background:none; border:none; color:var(--danger-color); cursor:pointer; padding:0.5rem; font-size:1.2rem;">✕</button>
                </div>`;
        }
    },

    Init: {
        // تهيئة الأحداث (Event Listeners)
        events: function() {
            // تفويض النقرات المركزي (Centralized Click Delegation)
            document.addEventListener('click', (e) => {
                const target = e.target;
                
                // نقرة الحساب
                if (target.closest('#mobile-account-btn') || target.closest('.top-bar-link[data-i18n="account"]') || target.closest('.nav-item-account')) {
                    if (typeof handleAccountClick === 'function') handleAccountClick();
                }

                // نقرة التفاصيل (الزر أو الصورة)
                if (target.closest('.navito-action-details') || target.closest('.view-details-pill') || target.closest('.store-card-img-wrapper')) {
                    const container = target.closest('.store-product-card');
                    const id = container ? container.getAttribute('data-id') : null;
                    if (id && typeof openProductModal === 'function') openProductModal(id);
                }
                
                // نقرة الشراء الآن
                if (target.closest('.navito-action-buy') || target.id === 'modal-buy-now') {
                    const btn = target.closest('.navito-action-buy') || target;
                    const id = btn.getAttribute('data-id') || target.getAttribute('data-id') || window.currentProductId;
                    NAVITO.Logic.buyNow(id);
                }

                // نقرة إضافة للسلة من بطاقة المنتج
                if (target.closest('.navito-action-add-cart') && !target.closest('.product-modal')) {
                    const btn = target.closest('.navito-action-add-cart');
                    const id = btn.getAttribute('data-id');
                    if (id) NAVITO.Logic.addToCart(id, btn);
                }

                // الإضافة للسلة من النافذة المنبثقة
                if (target.id === 'modal-add-cart' || target.closest('#modal-add-cart')) {
                    if (typeof addToCartFromModal === 'function') addToCartFromModal();
                }
                
                
                // ابدأ التسوق (عندما تكون السلة فارغة)
                if (target.classList.contains('navito-action-start-shopping')) {
                    NAVITO.UI.toggleCart(true);
                    document.getElementById('shop-section')?.scrollIntoView({ behavior: 'smooth' });
                }

                // إتمام الطلب (Checkout)
                if (target.id === 'cart-checkout-btn' || target.classList.contains('navito-checkout-trigger')) {
                    if (typeof window.startCartCheckout === 'function') window.startCartCheckout();
                }

                // أزرار كمية العناصر في العربة
                if (target.closest('.navito-action-qty')) {
                    const btn = target.closest('.navito-action-qty');
                    if (typeof CartManager !== 'undefined') {
                        CartManager.updateQuantity(btn.getAttribute('data-name'), parseInt(btn.getAttribute('data-delta')));
                    }
                }

                // زر حذف عنصر من العربة
                if (target.closest('.navito-action-remove')) {
                    if (typeof CartManager !== 'undefined') {
                        CartManager.removeItem(target.closest('.navito-action-remove').getAttribute('data-name'));
                    }
                }
                
                // تبديل القائمة الجانبية للهاتف
                if (target.closest('.mobile-menu-toggle') || target.closest('.drawer-close') || target.id === 'drawer-overlay' || target.closest('.menu-toggle')) {
                    if (typeof toggleMobileMenu === 'function') toggleMobileMenu();
                }

                // تبديل السمة (ليلي/نهاري)
                if (target.closest('#theme-toggle-nav') || target.closest('#theme-toggle-drawer')) {
                    if (typeof toggleTheme === 'function') {
                        toggleTheme();
                        if (target.closest('#theme-toggle-drawer')) toggleMobileMenu();
                    }
                }

                // تبديل اللغة
                if (target.closest('#lang-toggle-nav') || target.closest('#lang-toggle-drawer') || target.closest('.language-switcher')) {
                    if (typeof toggleLanguage === 'function') {
                        toggleLanguage();
                        if (target.closest('#lang-toggle-drawer')) toggleMobileMenu();
                    }
                }

                // تبديل الدولة
                if (target.closest('#country-toggle-top') || target.closest('#country-toggle-drawer')) {
                    if (typeof toggleCountry === 'function') {
                        toggleCountry();
                        if (target.closest('#country-toggle-drawer')) toggleMobileMenu();
                    }
                }

                // إغلاق نافذة المنتج
                if (target.closest('.modal-close') || target.closest('.btn-close-bottom')) {
                    if (typeof closeProductModal === 'function') closeProductModal();
                }

                // إغلاق النافذة المنبثقة
                if (target.closest('.popup-close') || target.closest('.btn-text-luxury[data-i18n="no_thanks"]')) {
                    if (typeof closePopup === 'function') closePopup();
                }

                // أزرار الانتقال السلس
                if (target.closest('.hero-action-btn')) {
                    document.getElementById('shop-section')?.scrollIntoView({ behavior: 'smooth' });
                }
            });

            // شريط البحث
            const input = document.getElementById('main-search-input');
            const searchBtn = document.getElementById('main-search-btn');
            
            if (input && typeof Utils !== 'undefined') {
                input.addEventListener('input', Utils.debounce(() => {
                    NAVITO.Logic.applyFilters(input.value.toLowerCase(), NAVITO.State.currentCategory);
                }, 300));
                
                if (searchBtn) {
                    searchBtn.addEventListener('click', (e) => {
                        e.preventDefault();
                        input.focus();
                        
                        // Scroll to shop section to see results if user searches
                        if (input.value.trim() !== '') {
                            document.getElementById('shop-section')?.scrollIntoView({ behavior: 'smooth' });
                        }
                    });
                }
            }
            
            // تبويبات التصنيفات
            document.addEventListener('click', (e) => {
                if (e.target.classList.contains('category-pill')) {
                    NAVITO.Logic.filterByCategory(e.target.textContent);
                }
            });
        },

        // تهيئة التطبيق الرئيسية
        app: async function() {
            // مزامنة حالة اللغة من التخزين المحلي
            const lang = localStorage.getItem('navito_language') || 'ar';
            document.documentElement.lang = lang;
            document.documentElement.dir = lang === 'en' ? 'ltr' : 'rtl';

            // تحميل المنتجات من الخادم
            try {
                NAVITO.State.products = await getLocalStoreProducts();
            } catch (e) {
                console.error('[NAVITO] فشل تحميل المنتجات الحقيقية:', e);
            }
            
            // استعادة الجلسة إذا كانت موجودة
            if (typeof Utils !== 'undefined' && Utils.init) {
                await Utils.init();
            }

            if (typeof CartManager !== 'undefined') CartManager.init();
            NAVITO.UI.updateAuth();
            if (window.IS_OFFERS_PAGE) {
                NAVITO.Logic.applyFilters('', 'العروض');
            } else {
                NAVITO.Logic.applyFilters('', 'الكل');
            }
            NAVITO.Init.events();

            // المزامنة في الوقت الفعلي عند تغيير المنتجات في تبويب آخر
            // Re-fetch when Supabase session changes in another tab
            window.addEventListener('storage', async (e) => {
                if (e.key === 'navito_session' || e.key === 'admin_products_prod_v1') {
                    NAVITO.State.products = await getLocalStoreProducts();
                    NAVITO.Logic.applyFilters('', NAVITO.State.currentCategory);
                }
            });

            console.log(`💎 تم تهيئة تطبيق نافيتو الفاخر | اللغة: ${lang} | عدد المنتجات: ${NAVITO.State.products.length}`);
        }

    }
};

// ─────────────────────────────────────────────
// أسماء مستعارة للتوافق مع الإصدارات السابقة
// ─────────────────────────────────────────────
window.toggleCart = NAVITO.UI.toggleCart.bind(NAVITO.UI);
window.renderCart = NAVITO.UI.renderCart.bind(NAVITO.UI);
window.buyNow = NAVITO.Logic.buyNow.bind(NAVITO.Logic);
window.addToCart = NAVITO.Logic.addToCart.bind(NAVITO.Logic);
window.filterByCategory = NAVITO.Logic.filterByCategory.bind(NAVITO.Logic);
window.allStoreProducts = NAVITO.State.products;

// ─────────────────────────────────────────────
// الوصول إلى بيانات المنتجات من الخادم
// ─────────────────────────────────────────────
async function getLocalStoreProducts() {
    let cloudProducts = [];
    try {
        // Load products from Supabase
        if (typeof Utils !== 'undefined' && Utils.getProducts) {
            cloudProducts = await Utils.getProducts();
        }
    } catch (e) {
        console.warn('[NAVITO] فشل جلب المنتجات من السحابة:', e);
    }

    // Get Local Products
    const localProducts = JSON.parse(localStorage.getItem('admin_products_prod_v1') || '[]');
    
    // Normalize Cloud Products (Supabase uses snake_case)
    const normalizedCloud = cloudProducts.map(p => ({
        ...p,
        _id: p.id,
        nameEn: p.name_en || p.nameEn,
        descriptionEn: p.description_en || p.descriptionEn,
        isActive: p.is_active !== undefined ? p.is_active : true
    }));

    // Merge: Cloud products take precedence. Filter out local duplicates.
    const cloudIds = new Set(normalizedCloud.map(p => String(p.id)));
    const combined = [
        ...normalizedCloud,
        ...localProducts.filter(p => !cloudIds.has(String(p.id)) && !cloudIds.has(String(p._id)))
    ];

    window.allStoreProducts = combined;
    return combined;
}
window.getLocalStoreProducts = getLocalStoreProducts;

// ─────────────────────────────────────────────
// منطق إتمام الطلب (Checkout)
// ─────────────────────────────────────────────
window.startCartCheckout = function () {
    localStorage.removeItem('navito_direct_buy');
    if (CartManager.items.length === 0) {
        if (typeof showToast === 'function') showToast(typeof t === 'function' ? t('cart_empty') : 'سلتك فارغة', 'error');
        return;
    }
    window.location.href = 'checkout.html';
};

window.renderCheckoutPage = function () {
    const container = document.getElementById('checkout-items');
    if (!container) return;
    const items = CartManager.items;
    if (items.length === 0) {
        window.location.href = 'index.html';
        return;
    }
    const currency = typeof t === 'function' ? t('currency') : 'MAD';

    let html = '';
    items.forEach(item => {
        const price = parseFloat(item.price) || 0;
        const qty = parseInt(item.quantity) || 1;
        const itemTotal = price * qty;

        html += `
            <div class="order-item">
                <img src="${item.image}" alt="${item.name}" class="item-image">
                <div class="item-details">
                    <div class="item-name">${item.name || 'Product'}</div>
                    <div class="item-quantity">
                        <div class="cart-item-controls" style="margin: 0.5rem 0; display: flex; align-items: center; gap: 10px;">
                            <button class="qty-btn navito-action-qty" data-name="${item.name}" data-delta="-1" style="width:24px; height:24px; border-radius:4px; border:1px solid var(--border-color); background:var(--bg-secondary); cursor:pointer; display:flex; align-items:center; justify-content:center;">
                                ${qty === 1 ? '<i class="fas fa-trash-alt" style="font-size:0.7rem; color:var(--danger-color);"></i>' : '-'}
                            </button>
                            <span style="font-weight:700;">${qty}</span>
                            <button class="qty-btn navito-action-qty" data-name="${item.name}" data-delta="1" style="width:24px; height:24px; border-radius:4px; border:1px solid var(--border-color); background:var(--bg-secondary); cursor:pointer;">+</button>
                        </div>
                        <span style="opacity: 0.8;">${currency} ${price.toFixed(2)}</span>
                    </div>
                    <div class="item-price">${currency} ${itemTotal.toFixed(2)}</div>
                </div>
            </div>`;
    });
    container.innerHTML = html;

    const subtotal = CartManager.getTotal();
    const itemCount = CartManager.getCount();
    const subLabel = document.querySelector('[data-i18n="subtotal"]');
    const sub = document.getElementById('checkout-subtotal');
    const tot = document.getElementById('checkout-total');
    
    const lang = localStorage.getItem('navito_language') || 'ar';
    if (subLabel) {
        const text = lang === 'en' ? `Subtotal (${itemCount} items)` : `المجموع الفرعي (${itemCount} قطع)`;
        subLabel.textContent = text;
    }

    if (sub) sub.textContent = `${currency} ${subtotal.toFixed(2)}`;
    if (tot) tot.textContent = `${currency} ${subtotal.toFixed(2)}`;
};

window.handleCheckout = async function (e) {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    
    // التحقق من تسجيل الدخول
    if (typeof Utils !== 'undefined' && !Utils.isLoggedIn()) {
        if (typeof showToast === 'function') showToast(typeof t === 'function' ? t('please_login') : 'يرجى تسجيل الدخول أولاً', 'error');
        setTimeout(() => window.location.href = 'login.html', 1500);
        return;
    }

    if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري تأكيد الطلب...';
    }

    const formData = new FormData(e.target);
    const shippingDetails = Object.fromEntries(formData.entries());

    const orderData = {
        orderItems: (typeof CartManager !== 'undefined' ? CartManager.items : []).map(item => ({
            product: item._id, // تأكد أن ID المنتج قادم من الخادم
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image
        })),
        totalAmount: typeof CartManager !== 'undefined' ? CartManager.getTotal() : 0,
        shippingAddress: {
            fullname: shippingDetails.full_name,
            address: shippingDetails.full_address,
            city: shippingDetails.city,
            postal: shippingDetails.postal,
            phone: shippingDetails.phone
        },
        paymentMethod: 'Cash on Delivery'
    };

    try {
        if (typeof Utils !== 'undefined' && Utils.createOrder) {
            const result = await Utils.createOrder(orderData);
            if (typeof CartManager !== 'undefined') CartManager.clear();
            if (typeof showToast === 'function') {
                const msg = (typeof t === 'function' ? t('order_success_msg') : 'تم تسجيل طلبك بنجاح! رقم الطلب: ') + result.orderId;
                showToast(msg, 'success');
            }
            setTimeout(() => window.location.href = 'index.html', 3000);
        }
    } catch (error) {
        if (typeof showToast === 'function') showToast(error.message || 'حدث خطأ أثناء معالجة الطلب', 'error');
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = typeof t === 'function' ? t('confirm_order') : 'تأكيد الطلب';
        }
    }
};

// ─────────────────────────────────────────────
// معالج الحساب (Account Handler)
// ─────────────────────────────────────────────
window.handleAccountClick = function () {
    const isLoggedIn = typeof Utils !== 'undefined' ? Utils.isLoggedIn() : (!!localStorage.getItem('navito_current_user'));
    
    let user = {};
    let hasValidUser = false;
    try {
        const userStr = localStorage.getItem('navito_current_user');
        if (userStr) {
            user = JSON.parse(userStr);
            // User must have real attributes to be considered valid
            hasValidUser = !!(user && (user.id || user._id || user.email || user.fullname));
        }
    } catch (e) {}

    if (isLoggedIn && hasValidUser) {
        // تعبئة البيانات في النافذة المنبثقة
        const nameEl = document.getElementById('account-name');
        const emailEl = document.getElementById('account-email');
        const phoneEl = document.getElementById('account-phone');
        const cityEl = document.getElementById('account-city');
        const streetEl = document.getElementById('account-street');
        const zipEl = document.getElementById('account-zip');
        
        // Fix phone number bug: don't default to email if phone is not provided
        const phoneValue = user.phone && user.phone !== user.email ? user.phone : '';
        
        if (nameEl) nameEl.value = user.fullname || '';
        if (emailEl) emailEl.textContent = user.email || '-';
        if (phoneEl) phoneEl.value = phoneValue;
        if (cityEl) cityEl.value = user.city || '';
        if (streetEl) streetEl.value = user.street || '';
        if (zipEl) zipEl.value = user.zip || '';
        
        // إظهار النافذة
        const modal = document.getElementById('account-modal');
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    } else {
        // If not a valid logged-in user, clear everything and redirect to login
        localStorage.removeItem('navito_session');
        localStorage.removeItem('navito_current_user');
        localStorage.removeItem('admin_token');
        window.location.href = 'login.html';
    }
};

window.handleGetLocation = function () {
    const cityEl = document.getElementById('account-city');
    const streetEl = document.getElementById('account-street');
    const zipEl = document.getElementById('account-zip');
    
    if (!navigator.geolocation) {
        if (typeof showToast === 'function') showToast("متصفحك لا يدعم تحديد الموقع.", "error");
        return;
    }
    
    if (typeof showToast === 'function') showToast("جاري تحديد الموقع بدقة...", "success");
    
    navigator.geolocation.getCurrentPosition(async (position) => {
        try {
            const { latitude, longitude } = position.coords;
            // استخدام خدمة مجانية لجلب تفاصيل العنوان بالكامل
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=ar`);
            const data = await response.json();
            
            if (data && data.address) {
                // استخراج المدينة
                const city = data.address.city || data.address.town || data.address.village || data.address.state || '';
                if (cityEl && city) cityEl.value = city;
                
                // استخراج الشارع والحي
                const road = data.address.road || '';
                const neighborhood = data.address.neighbourhood || data.address.suburb || data.address.quarter || '';
                const houseNumber = data.address.house_number ? 'رقم ' + data.address.house_number : '';
                
                let streetFull = [road, neighborhood, houseNumber].filter(Boolean).join('، ');
                if (streetEl && streetFull) streetEl.value = streetFull;
                
                // استخراج الرمز البريدي
                const postcode = data.address.postcode || '';
                if (zipEl && postcode) zipEl.value = postcode;
                
                if (typeof showToast === 'function') showToast("تم جلب تفاصيل موقعك والشارع بنجاح!", "success");
            } else {
                if (cityEl) cityEl.value = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
            }
        } catch (error) {
            console.error(error);
            if (typeof showToast === 'function') showToast("حدث خطأ أثناء تحديد الموقع.", "error");
        }
    }, (error) => {
        if (typeof showToast === 'function') showToast("يرجى تفعيل صلاحية الوصول للموقع.", "error");
    }, {
        timeout: 10000,
        maximumAge: 60000
    });
};

window.handleSaveAccountInfo = async function () {
    const nameEl = document.getElementById('account-name');
    const phoneEl = document.getElementById('account-phone');
    const cityEl = document.getElementById('account-city');
    const streetEl = document.getElementById('account-street');
    const zipEl = document.getElementById('account-zip');
    
    const user = JSON.parse(localStorage.getItem('navito_current_user') || '{}');
    
    // تحديث البيانات محلياً
    user.fullname = nameEl ? nameEl.value : user.fullname;
    user.phone = phoneEl ? phoneEl.value : user.phone;
    user.city = cityEl ? cityEl.value : user.city;
    user.street = streetEl ? streetEl.value : user.street;
    user.zip = zipEl ? zipEl.value : user.zip;
    
    localStorage.setItem('navito_current_user', JSON.stringify(user));
    
    if (typeof showToast === 'function') showToast("جاري الحفظ...", "success");
    
    // محاولة حفظ البيانات في Supabase إذا كان موجوداً
    if (window.supabase && window.supabase.auth) {
        try {
            const { data: { session } } = await window.supabase.auth.getSession();
            if (session && session.user) {
                // تحديث جدول profiles
                const { error } = await window.supabase
                    .from('profiles')
                    .update({
                        fullname: user.fullname,
                        phone: user.phone
                    })
                    .eq('id', session.user.id);
                    
                if (error && error.code !== 'PGRST116') {
                    console.error('Error saving profile:', error);
                }
            }
        } catch (e) {
            console.error('Supabase save error:', e);
        }
    }
    
    if (typeof showToast === 'function') showToast("تم حفظ معلومات الحساب بنجاح!", "success");
    closeAccountModal();
};

window.closeAccountModal = function () {
    const modal = document.getElementById('account-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
};

window.handleLogout = async function () {
    const lang = localStorage.getItem('navito_language') || 'ar';
    const msg = lang === 'en' ? 'Are you sure you want to logout?' : 'هل أنت متأكد من تسجيل الخروج؟';
    if (confirm(msg)) {
        if (typeof Utils !== 'undefined' && Utils.logout) {
            await Utils.logout();
        } else {
            localStorage.removeItem('navito_current_user');
            localStorage.removeItem('navito_session');
            window.location.reload();
        }
    }
};

// ─────────────────────────────────────────────
// القائمة الجانبية للهاتف
// ─────────────────────────────────────────────
window.toggleMobileMenu = function () {
    const drawer = document.getElementById('mobile-drawer');
    const overlay = document.getElementById('drawer-overlay');
    if (!drawer || !overlay) return;
    const isOpen = drawer.classList.toggle('active');
    overlay.classList.toggle('active', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
    // مزامنة واجهة القائمة الجانبية
    const lang = localStorage.getItem('navito_language') || 'ar';
    const isDark = document.documentElement.classList.contains('dark-mode');
    const themeText = document.getElementById('drawer-theme-text');
    const themeIcon = document.getElementById('drawer-theme-icon');
    const langText = document.getElementById('drawer-lang-text');
    if (themeText) themeText.textContent = isDark ? (lang === 'en' ? 'Light Mode' : 'الوضع النهاري') : (lang === 'en' ? 'Dark Mode' : 'الوضع الليلي');
    if (themeIcon) themeIcon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
    if (langText) langText.textContent = lang === 'ar' ? 'English' : 'العربية';
};

// ─────────────────────────────────────────────
// مساعدات الجزيئات والرسوم المتحركة (تستخدم بواسطة CartManager)
// ─────────────────────────────────────────────
function createParticles(btn) {
    if (!btn) return;
    for (let i = 0; i < 8; i++) {
        const p = document.createElement('div');
        p.classList.add('cart-particle');
        p.style.cssText = `left:${Math.random()*40}px; top:${Math.random()*40}px; background:hsl(${Math.random()*60+30},90%,60%); width:${4+Math.random()*4}px; height:${4+Math.random()*4}px;`;
        btn.style.position = 'relative';
        btn.appendChild(p);
        setTimeout(() => p.remove(), 700);
    }
}

function animateFlyToCart(btn, imgSrc) {
    const cartIcon = document.getElementById('cart-badge') || document.querySelector('.fa-shopping-bag');
    if (!btn || !cartIcon) return;
    const startRect = btn.getBoundingClientRect();
    const endRect = cartIcon.getBoundingClientRect();
    const img = document.createElement('img');
    img.src = imgSrc;
    img.style.cssText = `position:fixed; width:40px; height:40px; border-radius:50%; object-fit:cover; z-index:99999; top:${startRect.top}px; left:${startRect.left}px; transition: all 0.8s cubic-bezier(.2,.8,.4,1); opacity:1; pointer-events:none;`;
    document.body.appendChild(img);
    requestAnimationFrame(() => {
        img.style.top = endRect.top + 'px';
        img.style.left = endRect.left + 'px';
        img.style.opacity = '0';
        img.style.width = '15px';
        img.style.height = '15px';
    });
    setTimeout(() => img.remove(), 900);
}

// ─────────────────────────────────────────────
// أداة الصوت العامة
// ─────────────────────────────────────────────
function playCartSound() {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        [[0, 880, 0.15], [0.12, 1100, 0.1]].forEach(([delay, freq, dur]) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain); gain.connect(ctx.destination);
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
            gain.gain.setValueAtTime(0.18, ctx.currentTime + delay);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + dur);
            osc.start(ctx.currentTime + delay);
            osc.stop(ctx.currentTime + delay + dur + 0.05);
        });
    } catch (e) {}
}

// ─────────────────────────────────────────────
// تهيئة التطبيق - تعمل بعد تحميل كافة السكريبتات
// ─────────────────────────────────────────────
// Use window.addEventListener('load') instead of DOMContentLoaded
// so that add-sample-products.js has already seeded the localStorage
window.addEventListener('load', () => {
    NAVITO.Init.app();
});
