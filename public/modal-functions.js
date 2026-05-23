// Product Modal Logic - NAVITO
window.currentProductId = null;
window.currentSelectedQty = 1;

async function openProductModal(productId) {
    const isEnglish = typeof Utils !== 'undefined' && Utils.isEnglish();

    window.currentProductId = productId;

    let products = window.allStoreProducts || [];
    if (typeof window.getLocalStoreProducts === 'function') {
        try {
            products = await window.getLocalStoreProducts();
        } catch (e) {
            console.warn('[Modal] product load failed', e);
        }
    }

    const product = products.find(p => String(p._id) === String(productId) || String(p.id) === String(productId));

    if (!product) {
        console.error('Product not found:', productId);
        if (typeof showToast === 'function') showToast('المنتج غير متوفر', 'error');
        return;
    }

    const modalOverlay = document.getElementById('product-modal');
    if (!modalOverlay) {
        console.error('Modal overlay element not found');
        return;
    }

    const esc = typeof Utils !== 'undefined' && Utils.escapeHtml ? Utils.escapeHtml.bind(Utils) : (s) => String(s ?? '');
    const name = isEnglish ? (product.nameEn || product.name_en || product.name) : (product.name_ar || product.name);
    const price = Number(product.price) || 0;
    const stock = parseInt(product.stock, 10);
    const inStock = !Number.isFinite(stock) || stock > 0;

    const nameEl = document.getElementById('modal-product-name');
    if (nameEl) nameEl.textContent = name;

    const priceEl = document.getElementById('modal-price');
    if (priceEl) priceEl.textContent = Utils.formatCurrency(price);

    const descEl = document.getElementById('modal-description');
    if (descEl) {
        descEl.textContent = isEnglish ?
            (product.detailedDescriptionEn || product.description_en || product.descriptionEn || product.description) :
            (product.detailedDescription || product.description);
    }

    const mainImg = document.getElementById('modal-main-image');
    const thumbContainer = document.getElementById('modal-thumbnails');
    const images = product.images?.length ? product.images : [product.image].filter(Boolean);

    if (mainImg && images[0]) mainImg.src = images[0];

    if (thumbContainer) {
        thumbContainer.innerHTML = images.map((img, idx) => `
            <div class="thumbnail ${idx === 0 ? 'active' : ''}" data-img="${esc(img)}" role="button" tabindex="0">
                <img src="${esc(img)}" alt="Thumbnail ${idx + 1}">
            </div>
        `).join('');
        thumbContainer.querySelectorAll('.thumbnail').forEach((el) => {
            el.addEventListener('click', () => changeMainImage(el.getAttribute('data-img'), el));
        });
    }

    const ratingContainer = document.getElementById('modal-rating');
    if (ratingContainer) ratingContainer.innerHTML = renderStarRating(product.rating || 5);

    const reviewsEl = document.getElementById('modal-reviews');
    if (reviewsEl) reviewsEl.textContent = `(${product.reviews || product.review_count || 0} ${typeof t === 'function' ? t('reviews') : 'تقييم'})`;

    const stockEl = document.getElementById('modal-stock');
    if (stockEl) {
        const soldCount = product.soldCount || 0;
        const stockLabel = inStock
            ? (typeof t === 'function' ? t('in_stock') : 'في المخزون')
            : (isEnglish ? 'Out of stock' : 'نفد المخزون');
        const stockClass = inStock ? 'stock-status-luxury' : 'stock-status-luxury out-of-stock';
        stockEl.innerHTML = `
            <div class="modal-badges-row">
                <span class="${stockClass}"><i class="fas fa-${inStock ? 'check' : 'times'}-circle"></i> ${stockLabel}${Number.isFinite(stock) ? ` (${stock})` : ''}</span>
                ${inStock ? `<span class="free-shipping-badge-luxury"><i class="fas fa-truck"></i> ${isEnglish ? 'Free Shipping' : 'شحن مجاني'}</span>` : ''}
                ${soldCount > 0 ? `<span class="sold-count-modal-luxury"><i class="fas fa-fire"></i> ${soldCount}+ ${isEnglish ? 'Sold' : 'تم البيع'}</span>` : ''}
            </div>`;
    }

    const branchContainer = document.getElementById('modal-features');
    if (branchContainer) {
        const features = isEnglish ? (product.featuresEn || product.features_en || []) : (product.features || []);
        branchContainer.innerHTML = features.length > 0
            ? features.map(f => `<li>${esc(f)}</li>`).join('')
            : `<li>${isEnglish ? 'High Quality' : 'جودة عالية'}</li><li>${isEnglish ? 'Fast Shipping' : 'شحن سريع'}</li>`;
    }

    const b1 = document.getElementById('bundle-1-price');
    const b2 = document.getElementById('bundle-2-price');
    const b3 = document.getElementById('bundle-3-price');

    if (b1) b1.textContent = Utils.formatCurrency(price);
    if (b2) b2.textContent = Utils.formatCurrency(price * 2 * 0.9);
    if (b3) b3.textContent = Utils.formatCurrency(price * 3 * 0.8);

    const bundleRadios = document.getElementsByName('bundle');
    bundleRadios.forEach(r => {
        r.checked = r.value == '1';
        r.parentElement.classList.toggle('active', r.value == '1');
    });
    window.currentSelectedQty = 1;

    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

window.updateBundlePrice = function (qty) {
    window.currentSelectedQty = parseInt(qty, 10) || 1;
    const bundleRadios = document.getElementsByName('bundle');
    bundleRadios.forEach(r => {
        r.parentElement.classList.toggle('active', r.value == qty);
    });
};

function closeProductModal() {
    const modalOverlay = document.getElementById('product-modal');
    if (modalOverlay) modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
    window.currentProductId = null;
}

function changeMainImage(imgSrc, thumbEl) {
    const mainImg = document.getElementById('modal-main-image');
    if (mainImg) mainImg.src = imgSrc;
    document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
    if (thumbEl) thumbEl.classList.add('active');
}

function renderStarRating(rating) {
    let starsHtml = '';
    const floorRating = Math.floor(rating);
    for (let i = 0; i < 5; i++) {
        if (i < floorRating) starsHtml += '<i class="fas fa-star"></i>';
        else if (i === floorRating && rating % 1 >= 0.5) starsHtml += '<i class="fas fa-star-half-alt"></i>';
        else starsHtml += '<i class="far fa-star"></i>';
    }
    return starsHtml;
}

document.addEventListener('DOMContentLoaded', () => {
    const modalOverlay = document.getElementById('product-modal');
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) closeProductModal();
        });
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeProductModal();
});

function addToCartFromModal() {
    const id = window.currentProductId;
    if (!id) return;

    const products = window.allStoreProducts || (window.NAVITO && NAVITO.State.products) || [];
    const product = products.find(p => String(p._id) === String(id) || String(p.id) === String(id));
    if (!product || typeof CartManager === 'undefined') return;

    const qty = window.currentSelectedQty || 1;
    CartManager.addItem(product, document.getElementById('modal-add-cart'), qty);

    const isEnglish = typeof Utils !== 'undefined' && Utils.isEnglish();
    const name = isEnglish ? (product.nameEn || product.name) : (product.name_ar || product.name);
    if (typeof showToast === 'function') {
        showToast(isEnglish ? `${name} added to cart` : `تمت إضافة ${name} إلى السلة`, 'success');
    }
    closeProductModal();
}

window.openProductModal = openProductModal;
window.closeProductModal = closeProductModal;
window.changeMainImage = changeMainImage;
window.renderStarRating = renderStarRating;
window.addToCartFromModal = addToCartFromModal;
