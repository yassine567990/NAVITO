// Product Modal Logic - REFACTORED
window.currentProductId = null;
window.currentSelectedQty = 1;

/**
 * Open the product modal with full details
 * @param {string} productId 
 */
function openProductModal(productId) {
    const isEnglish = Utils.isEnglish();

    // 1. Check if logged in (per user requirements in app.js)
    if (!Utils.isLoggedIn()) {
        alert(t('please_login'));
        window.location.href = '/login';
        return;
    }

    // 2. Clear previous state and get data
    window.currentProductId = productId;
    const product = typeof window.getLocalStoreProducts === 'function' ?
        window.getLocalStoreProducts().find(p => p._id == productId || p.id == productId) :
        (window.allStoreProducts?.find(p => p._id == productId || p.id == productId));

    if (!product) {
        console.error('Product not found:', productId);
        return;
    }

    const modalOverlay = document.getElementById('product-modal');
    if (!modalOverlay) {
        console.error('Modal overlay element not found');
        return;
    }

    // 3. Populate Modal Content

    // Name
    const nameEl = document.getElementById('modal-product-name');
    if (nameEl) nameEl.textContent = isEnglish ? (product.nameEn || product.name) : product.name;

    // Price
    const priceEl = document.getElementById('modal-price');
    if (priceEl) {
        priceEl.textContent = Utils.formatCurrency(product.price);
    }

    // Description
    const descEl = document.getElementById('modal-description');
    if (descEl) {
        descEl.textContent = isEnglish ?
            (product.detailedDescriptionEn || product.descriptionEn || product.description) :
            (product.detailedDescription || product.description);
    }

    // Images
    const mainImg = document.getElementById('modal-main-image');
    const thumbContainer = document.getElementById('modal-thumbnails');
    const images = product.images || [product.image];

    if (mainImg) mainImg.src = images[0];

    if (thumbContainer) {
        thumbContainer.innerHTML = images.map((img, idx) => `
            <div class="thumbnail ${idx === 0 ? 'active' : ''}" onclick="changeMainImage('${img}', this)">
                <img src="${img}" alt="Thumbnail ${idx}">
            </div>
        `).join('');
    }

    // Rating & Reviews
    const ratingContainer = document.getElementById('modal-rating');
    if (ratingContainer) {
        ratingContainer.innerHTML = renderStarRating(product.rating || 5);
    }

    const reviewsEl = document.getElementById('modal-reviews');
    if (reviewsEl) {
        reviewsEl.textContent = `(${product.reviews || 0} ${t('reviews')})`;
    }

    // Stock
    const stockEl = document.getElementById('modal-stock');
    if (stockEl) {
        stockEl.innerHTML = `<span>✓</span> ${t('in_stock')}: ${product.stock || 15}`;
    }

    // Features
    const branchContainer = document.getElementById('modal-features');
    if (branchContainer) {
        const features = isEnglish ? (product.featuresEn || []) : (product.features || []);
        branchContainer.innerHTML = features.length > 0 ?
            features.map(f => `<li>${f}</li>`).join('') :
            `<li>${isEnglish ? 'High Quality' : 'جودة عالية'}</li><li>${isEnglish ? 'Fast Shipping' : 'شحن سريع'}</li>`;
    }

    // 4. Update Bundle Prices
    const basePrice = Number(product.price);
    const b1 = document.getElementById('bundle-1-price');
    const b2 = document.getElementById('bundle-2-price');
    const b3 = document.getElementById('bundle-3-price');
    const cur = typeof t === 'function' ? t('currency') : (isEnglish ? 'SAR' : 'ر.س');

    if (b1) b1.textContent = Utils.formatCurrency(basePrice);
    if (b2) b2.textContent = Utils.formatCurrency(basePrice * 2 * 0.9); // 10% off
    if (b3) b3.textContent = Utils.formatCurrency(basePrice * 3 * 0.8); // 20% off

    // Reset bundle selection to 1
    const bundleRadios = document.getElementsByName('bundle');
    bundleRadios.forEach(r => {
        r.checked = r.value == "1";
        r.parentElement.classList.toggle('active', r.value == "1");
    });
    window.currentSelectedQty = 1;

    // 5. Show Modal
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // Stop background scrolling
}

/**
 * Handle bundle price selection
 */
window.updateBundlePrice = function (qty) {
    window.currentSelectedQty = parseInt(qty);
    const bundleRadios = document.getElementsByName('bundle');
    bundleRadios.forEach(r => {
        r.parentElement.classList.toggle('active', r.value == qty);
    });
};

/**
 * Close the product modal
 */
function closeProductModal() {
    const modalOverlay = document.getElementById('product-modal');
    if (modalOverlay) {
        modalOverlay.classList.remove('active');
    }
    document.body.style.overflow = ''; // Restore scrolling
    window.currentProductId = null;
}

/**
 * Change the main display image in the modal
 */
function changeMainImage(imgSrc, thumbEl) {
    const mainImg = document.getElementById('modal-main-image');
    if (mainImg) mainImg.src = imgSrc;

    // Update active thumb
    document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
    if (thumbEl) thumbEl.classList.add('active');
}

/**
 * Render star rating using FontAwesome consistent with product cards
 */
function renderStarRating(rating) {
    let starsHtml = '';
    const floorRating = Math.floor(rating);

    for (let i = 0; i < 5; i++) {
        if (i < floorRating) {
            starsHtml += '<i class="fas fa-star"></i>';
        } else if (i === floorRating && rating % 1 >= 0.5) {
            starsHtml += '<i class="fas fa-star-half-alt"></i>';
        } else {
            starsHtml += '<i class="far fa-star"></i>';
        }
    }
    return starsHtml;
}

// Global Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    const modalOverlay = document.getElementById('product-modal');
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            // Close if clicking the blurred area, not the white box
            if (e.target === modalOverlay) {
                closeProductModal();
            }
        });
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeProductModal();
});

// Expose to window
window.openProductModal = openProductModal;
window.closeProductModal = closeProductModal;
window.changeMainImage = changeMainImage;
window.renderStarRating = renderStarRating;
