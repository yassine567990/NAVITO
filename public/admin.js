/**
 * Admin Panel Logic - Interactive Mock Mode
 * Handles Product Management with Local Simulation
 */

// Initialized

// Auth Guard and Logout are handled by Utils (linked in HTML)
window.adminLogout = function () {
    Utils.logout('admin-login.html');
};

const ADMIN_API_URL = '/api/products';
const STORAGE_KEY = 'admin_products_prod_v1';

// Mock Data for Fallback (Initial State)
const INITIAL_MOCK_PRODUCTS = [];

// Mock Orders Data
const ORDERS_STORAGE_KEY = 'admin_orders_prod_v1';
const INITIAL_MOCK_ORDERS = [];

// --- API Data Management ---

async function fetchProducts() {
    try {
        if (typeof Utils !== 'undefined' && Utils.apiFetch) {
            const products = await Utils.apiFetch('/products');
            window.allStoreProducts = products;
            renderAdminProductsTable(products);
            updateDashboardStats(products);
            return products;
        }
    } catch (error) {
        console.error('Error fetching products:', error);
        showToast(t('load_failed'), 'error');
    }
}

async function saveProductToCloud(product) {
    try {
        const method = product._id ? 'PUT' : 'POST';
        const endpoint = product._id ? `/products/${product._id}` : '/products';
        
        await Utils.apiFetch(endpoint, {
            method,
            body: JSON.stringify(product)
        });

        await fetchProducts();
        showToast(t('product_saved'), 'success');
        closeModal();
        return true;
    } catch (error) {
        console.error("Error saving product:", error);
        showToast(t('save_error'), 'error');
        return false;
    }
}

async function deleteProductFromCloud(productId) {
    try {
        await Utils.apiFetch(`/products/${productId}`, {
            method: 'DELETE'
        });
        await fetchProducts();
        showToast(t('product_deleted'), 'success');
        return true;
    } catch (error) {
        console.error("Error deleting product:", error);
        showToast(t('delete_failed'), 'error');
        return false;
    }
}

let previousOrdersCount = -1;

async function fetchOrders() {
    try {
        const orders = await Utils.apiFetch('/orders');
        
        // التحقق من وجود طلبيات جديدة
        if (previousOrdersCount !== -1 && orders.length > previousOrdersCount) {
            const newCount = orders.length - previousOrdersCount;
            showNewOrderNotification(newCount);
        }
        previousOrdersCount = orders.length;

        window.currentOrders = orders;
        renderOrdersTable(orders);
        updateDashboardStats(window.allStoreProducts || []);
        return orders;
    } catch (error) {
        console.error('Error fetching orders:', error);
    }
}

function showNewOrderNotification(count) {
    // تشغيل صوت تنبيه احترافي
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
    audio.play().catch(e => console.log("Audio play blocked by browser policy"));

    const msg = count === 1 ? 'طلبية جديدة واردة! 🛍️' : `${count} طلبيات جديدة واردة! 🛍️`;
    showToast(msg, 'success');
}

// فحص تلقائي كل 30 ثانية
setInterval(fetchOrders, 30000);

function getLocalProducts() {
    return window.allStoreProducts || [];
}

// --- Global Functions (Bound to Window immediately) ---

// Toast and Modal helpers consolidated/using Utils

function openModal() {
    const modal = document.getElementById('product-modal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal() {
    const modal = document.getElementById('product-modal');
    if (modal) modal.classList.remove('active');
    document.body.style.overflow = '';
    resetForm();
}

// --- Image Handling Functions ---
let additionalImages = []; // Store additional images as Base64

function toggleImageMode(mode) {
    const uploadSection = document.getElementById('upload-mode-section');
    const urlSection = document.getElementById('url-mode-section');
    const uploadBtn = document.getElementById('btn-upload-mode');
    const urlBtn = document.getElementById('btn-url-mode');

    if (mode === 'upload') {
        uploadSection.style.display = 'block';
        urlSection.style.display = 'none';
        uploadBtn.style.background = 'var(--accent-color)';
        uploadBtn.style.color = 'white';
        urlBtn.style.background = '';
        urlBtn.style.color = '';
    } else {
        uploadSection.style.display = 'none';
        urlSection.style.display = 'block';
        urlBtn.style.background = 'var(--accent-color)';
        urlBtn.style.color = 'white';
        uploadBtn.style.background = '';
        uploadBtn.style.color = '';
    }
}

function handleImageUpload(event, type, index) {
    const file = event.target.files[0];
    if (!file) return;

    // Check file size (limit to 500KB for localStorage)
    if (file.size > 500000) {
        showToast(t('image_too_large'), 'error');
        event.target.value = '';
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        const base64 = e.target.result;

        if (type === 'main') {
            // Set main image
            document.getElementById('image').value = base64;

            // Show preview
            const preview = document.getElementById('image-preview');
            const previewImg = document.getElementById('preview-img');
            previewImg.src = base64;
            preview.style.display = 'block';
        } else if (type === 'additional') {
            // Store additional image
            additionalImages[index] = base64;

            // Show preview
            updateAdditionalPreviews();
        }
    };
    reader.readAsDataURL(file);
}

function updateAdditionalPreviews() {
    const container = document.getElementById('additional-previews');
    container.innerHTML = '';

    additionalImages.forEach((img, index) => {
        if (img) {
            const div = document.createElement('div');
            div.style.position = 'relative';
            div.innerHTML = `
                <img src="${img}" style="width: 100%; height: 80px; object-fit: cover; border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
                <button type="button" onclick="removeAdditionalImage(${index})" style="position: absolute; top: 2px; right: 2px; background: var(--danger-color); color: white; border: none; border-radius: 50%; width: 20px; height: 20px; cursor: pointer; font-size: 0.7rem; line-height: 1;">×</button>
            `;
            container.appendChild(div);
        }
    });
}

function removeAdditionalImage(index) {
    additionalImages[index] = null;
    const inputs = document.querySelectorAll('.additional-image-input');
    if (inputs[index]) inputs[index].value = '';
    updateAdditionalPreviews();
}

window.toggleImageMode = toggleImageMode;
window.handleImageUpload = handleImageUpload;
window.removeAdditionalImage = removeAdditionalImage;

function resetForm() {
    const form = document.getElementById('product-form');
    const productIdInput = document.getElementById('product-id');
    const submitBtn = document.getElementById('submit-btn');

    if (form) form.reset();
    if (productIdInput) productIdInput.value = '';

    if (submitBtn) {
        submitBtn.textContent = t('save_product');
        submitBtn.classList.remove('btn-warning');
    }

    const modalTitle = document.querySelector('.modal-title');
    if (modalTitle) modalTitle.textContent = t('add_product_title');

    // Clear image previews and data
    additionalImages = [];
    const preview = document.getElementById('image-preview');
    if (preview) preview.style.display = 'none';
    const additionalPreviews = document.getElementById('additional-previews');
    if (additionalPreviews) additionalPreviews.innerHTML = '';
    const imageInputs = document.querySelectorAll('.additional-image-input');
    imageInputs.forEach(input => input.value = '');
}

// Expose globally
window.openModal = openModal;
window.closeModal = closeModal;
window.showToast = showToast;

// Sample Data Generator
function generateSampleProducts() {
    const sampleProducts = [
        {
            _id: "prod_001",
            name: "أحمر شفاه مات فاخر",
            nameEn: "Luxury Matte Lipstick",
            category: "مكياج",
            price: 29.99,
            image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400",
            description: "أحمر شفاه مات طويل الأمد بتركيبة غنية ومرطبة",
            descriptionEn: "Long-lasting matte lipstick with a rich, moisturizing formula",
            stock: 50
        },
        {
            _id: "prod_002",
            name: "سيروم فيتامين سي",
            nameEn: "Vitamin C Serum",
            category: "عناية بالبشرة",
            price: 45.00,
            image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400",
            description: "سيروم مضاد للأكسدة يعمل على تفتيح البشرة وتوحيد لونها",
            descriptionEn: "Antioxidant serum that brightens skin and evens out tone",
            stock: 30
        },
        {
            _id: "prod_003",
            name: "عطر عود الملكي",
            nameEn: "Royal Oud Perfume",
            category: "عطور",
            price: 120.00,
            image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400",
            description: "عطر فاخر برائحة العود الأصيل مع لمسات زهرية",
            descriptionEn: "Luxury fragrance with authentic oud scent and floral touches",
            stock: 15
        },
        {
            _id: "prod_004",
            name: "ماسكارا حجم مضاعف",
            nameEn: "Volume Mascara",
            category: "مكياج",
            price: 24.99,
            image: "https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?w=400",
            description: "ماسكارا تمنح رموشك حجماً وكثافة مذهلة",
            descriptionEn: "Mascara that gives your lashes amazing volume and thickness",
            stock: 60
        },
        {
            _id: "prod_005",
            name: "كريم الليل المغذي",
            nameEn: "Nourishing Night Cream",
            category: "عناية بالبشرة",
            price: 38.50,
            image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400",
            description: "كريم ليلي غني يعمل على تجديد البشرة أثناء النوم",
            descriptionEn: "Rich night cream that regenerates skin while you sleep",
            stock: 40
        }
    ];

    saveLocalProducts(sampleProducts);
    fetchProducts();
    showToast(t('sample_created'), 'success');
}
window.generateSampleProducts = generateSampleProducts;

function renderAdminProductsTable(products) {
    console.log('🎨 renderAdminProductsTable called with', products?.length || 0, 'products');

    // Target the TABLE BODY, not the hidden grid
    const tableBody = document.getElementById('products-list');

    if (!tableBody) {
        console.warn('⚠️ Product table body not found (might be on dashboard)');
        return;
    }

    // Check for URL filters
    const urlParams = new URLSearchParams(window.location.search);
    const filter = urlParams.get('filter');
    let displayProducts = [...products];

    if (filter === 'low-stock') {
        displayProducts = products.filter(p => (parseInt(p.stock) || 0) < 10);
        console.log('🔍 Filtering by low stock:', displayProducts.length);

        // Add a "Clear Filter" message if filtering
        const header = document.querySelector('.admin-header h2');
        if (header && !document.getElementById('clear-filter-btn')) {
            const clearBtn = document.createElement('button');
            clearBtn.id = 'clear-filter-btn';
            clearBtn.className = 'btn-secondary';
            clearBtn.style.marginInlineStart = '15px';
            clearBtn.style.fontSize = '0.8rem';
            clearBtn.innerHTML = t('show_all');
            clearBtn.onclick = () => window.location.href = 'products.html';
            header.appendChild(clearBtn);
        }
    }

    // Empty State
    if (!displayProducts || displayProducts.length === 0) {
        const emptyMsg = filter === 'low-stock'
            ? t('no_low_stock')
            : t('no_products_available');
        const sampleBtnText = t('generate_sample');
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align:center; padding: 4rem 2rem;">
                    <div style="color: var(--text-secondary); margin-bottom: 1.5rem;">
                        <span style="font-size: 3rem; display: block; margin-bottom: 1rem; opacity: 0.5;">🔍</span>
                        <p style="font-size: 1.1rem; margin-bottom: 1rem;">${emptyMsg}</p>
                    </div>
                    ${filter === 'low-stock' ? '' : `
                    <button onclick="generateSampleProducts()" class="btn-premium-add" style="margin: 0 auto; display: inline-flex;">
                        ${sampleBtnText}
                    </button>
                    `}
                </td>
            </tr>
        `;
        return;
    }

    // Get current language
    const currentLang = document.documentElement.getAttribute('lang') || (localStorage.getItem('navito_language') || 'ar');
    const isEnglish = currentLang === 'en';

    console.log('🖌️ Rendering', displayProducts.length, 'rows...');

    // Helper to translate category
    const translateCategory = (cat) => {
        if (!isEnglish) return cat;
        const mapping = {
            'مكياج': t('makeup'),
            'عناية بالبشرة': t('skincare'),
            'عطور': t('perfumes'),
            'العناية بالشعر': t('haircare'),
            'أدوات المكياج': t('makeup_tools'),
            'الكل': t('all')
        };
        return mapping[cat] || cat;
    };

    tableBody.innerHTML = displayProducts.map(p => {
        const primaryName = isEnglish ? (p.nameEn || p.name) : p.name;
        // Hide secondary name always for a cleaner localized experience (As requested by user)
        const secondaryName = '';

        return `
        <tr class="product-row">
            <td>
                <div style="width: 50px; height: 50px; border-radius: var(--radius-sm); overflow: hidden; border: 1px solid var(--border-color);">
                    <img src="${p.image || 'https://via.placeholder.com/50'}" alt="${primaryName}" style="width: 100%; height: 100%; object-fit: cover;">
                </div>
            </td>
            <td>
                <div style="font-weight: 600; color: var(--text-primary);">${primaryName}</div>
                ${secondaryName ? `<div style="font-size: 0.8rem; color: var(--text-secondary);">${secondaryName}</div>` : ''}
            </td>
            <td>
                <span style="background: rgba(var(--accent-rgb), 0.1); color: var(--accent-color); padding: 4px 12px; border-radius: 50px; font-size: 0.85rem; font-weight: 600; border: 1px solid rgba(var(--accent-rgb), 0.2);">
                    ${translateCategory(p.category) || (isEnglish ? 'General' : 'عام')}
                </span>
            </td>
            <td>
                <div style="font-weight: 700; color: var(--text-primary);">${Utils.formatCurrency(p.price)}</div>
            </td>
            <td>
                <span style="${(p.stock || 0) < 10 ? 'color: var(--danger-color); font-weight:700;' : ''}">${p.stock || 0}</span>
            </td>
            <td>
                <div style="display: flex; gap: 0.5rem; justify-content: center;">
                    <button onclick="editProduct('${p._id || p.id}')" class="btn-secondary" style="padding: 0.4rem 0.6rem;" title="${t('edit')}">✏️</button>
                    <button onclick="deleteProduct('${p._id || p.id}')" class="btn-danger" style="padding: 0.4rem 0.6rem;" title="${t('delete')}">🗑️</button>
                </div>
            </td>
        </tr>`;
    }).join('');

    // Update the category summary if we are on the products page
    updateCategoryStats(displayProducts);
}

/**
 * Updates the summary of product counts - Simplified to only show Total
 */
function updateCategoryStats(products) {
    const container = document.getElementById('category-summary-container');
    if (!container) return;

    const totalText = t('total_products');

    // Simplified to just one elegant badge for the total
    container.innerHTML = `
        <div class="category-stat-pill total" style="margin: 0 auto; padding: 0.8rem 2rem; transform: none;">
            <span class="label" style="font-size: 1rem;">${totalText}</span>
            <span class="count" style="font-size: 1.1rem; padding: 4px 15px;">${products.length}</span>
        </div>
    `;

    // Ensure the container itself centers the badge
    container.style.justifyContent = 'center';
    container.style.padding = '0';
}

function updateDashboardStats(products) {
    // 1. Total Products
    const total = products.length;
    const elTotal = document.getElementById('stat-total-products');
    if (elTotal) elTotal.textContent = total;

    // 2. Low Stock (Count of products with < 5 items)
    const lowStockCount = products.filter(p => (p.stock || 0) < 5).length;
    const elLowStock = document.getElementById('stat-low-stock');
    if (elLowStock) {
        elLowStock.textContent = lowStockCount;
        elLowStock.style.color = lowStockCount > 0 ? 'var(--danger-color)' : 'var(--text-primary)';
    }

    // 3. Revenue & Sales (From Orders)
    const orders = window.currentOrders && window.currentOrders.length > 0 ? window.currentOrders : (typeof getLocalOrders === 'function' ? getLocalOrders() : []);

    const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
    // Counting total pieces sold (sum of quantities)
    const totalSalesItems = orders.reduce((sum, order) => {
        return sum + (order.items ? order.items.reduce((acc, item) => acc + (item.quantity || 1), 0) : 0);
    }, 0);

    if (elRev) elRev.textContent = Utils.formatCurrency(totalRevenue);

    const elSales = document.getElementById('stat-total-sales');
    if (elSales) elSales.textContent = totalSalesItems.toLocaleString('en-US');

    // Run Smart Insights
    updateDashboardInsights(products, orders);
}

/**
 * Smart Insights - Analyzes patterns and alerts the admin
 */
function updateDashboardInsights(products, orders) {
    const insightList = document.getElementById('insight-content');
    if (!insightList) return;

    let alerts = [];
    const t_func = (typeof t === 'function') ? t : (key) => key;

    const translatedLabel = (key, params) => {
        let text = t_func(key);
        if (params) {
            Object.keys(params).forEach(p => {
                // Use a proper regex to replace all occurrences of {key}
                const regex = new RegExp(`{${p}}`, 'g');
                text = text.replace(regex, params[p]);
            });
        }
        return text;
    };

    const getDisplayName = (p) => {
        const lang = document.documentElement.lang || 'ar';
        return lang === 'en' ? (p.nameEn || p.name) : p.name;
    };

    // 1. Out of Stock Alerts
    const outOfStock = products.filter(p => (parseInt(p.stock) || 0) <= 0);
    outOfStock.slice(0, 2).forEach(p => {
        alerts.push({
            type: 'danger',
            text: translatedLabel('out_of_stock_alert', { name: getDisplayName(p) })
        });
    });

    // 2. Low Stock Alerts
    const lowStock = products.filter(p => {
        const s = parseInt(p.stock) || 0;
        return s > 0 && s < 10; // Threshold matched to 10 for consistency
    });
    lowStock.slice(0, 2).forEach(p => {
        alerts.push({
            type: 'warning',
            text: translatedLabel('low_stock_alert', { name: getDisplayName(p), count: p.stock })
        });
    });

    // 3. Sales Insights
    const today = new Date().toISOString().split('T')[0];
    const todaysOrders = orders.filter(o => o.date && o.date.startsWith(today));

    if (todaysOrders.length === 0 && orders.length > 0) {
        alerts.push({
            type: 'warning',
            text: translatedLabel('no_sales_today_alert')
        });
    } else if (todaysOrders.length >= 1) {
        alerts.push({
            type: 'success',
            text: translatedLabel('high_revenue_alert')
        });
    }

    // Render alerts
    if (alerts.length === 0) {
        insightList.innerHTML = `<div class="insight-item success">✨ ${translatedLabel('no_alerts')}</div>`;
    } else {
        insightList.innerHTML = alerts.map(a => `
            <div class="insight-item ${a.type}">
                ${a.text}
            </div>
        `).join('');
    }
}

// --- Main Execution ---

document.addEventListener('DOMContentLoaded', () => {

    // DOM Elements
    const form = document.getElementById('product-form');
    const submitBtn = document.getElementById('submit-btn');
    const productIdInput = document.getElementById('product-id');
    const loader = document.getElementById('admin-loader');

    // Force loader visibility at start if it exists
    if (loader) loader.style.display = 'block';

    // Fetch Logic
    async function initAdmin() {
        if (loader) loader.style.display = 'block';
        try {
            await Promise.all([
                fetchProducts(),
                fetchOrders()
            ]);
        } catch (err) {
            console.error('Initialization error:', err);
        } finally {
            if (loader) loader.style.display = 'none';
        }
    }

    // Run initialization
    initAdmin();





    // Expose functions globally for external access (e.g. language toggle)
    window.renderAdminProductsTable = renderAdminProductsTable;
    window.updateDashboardStats = updateDashboardStats;

    // Theme Toggle Function
    window.toggleTheme = function () {
        const root = document.documentElement;
        const isCurrentlyDark = root.classList.contains('dark-mode');

        if (isCurrentlyDark) {
            root.classList.remove('dark-mode');
            root.classList.add('light-mode');
            localStorage.setItem('theme', 'light');
        } else {
            Utils.applyTheme('dark');
        }

        const isDark = root.classList.contains('dark-mode');

        // Update Admin Header structure if exists
        const icon = document.getElementById('theme-icon');
        const text = document.getElementById('theme-text');

        if (icon) icon.innerHTML = isDark ? '🌙' : '☀️';
        if (text) text.textContent = isDark ? (typeof t === 'function' ? t('dark_mode') : 'Dark Mode') : (typeof t === 'function' ? t('light_mode') : 'Light Mode');

        if (typeof showToast === 'function') {
            showToast(isDark ? (typeof t === 'function' ? t('dark_mode_activated') : 'Dark mode activated') : (typeof t === 'function' ? t('light_mode_activated') : 'Light mode activated'), 'success');
        }
    };

    // Initialize Theme UI State (Class already applied by Head Script)
    const savedTheme = localStorage.getItem('theme') || 'light';
    const isDark = savedTheme === 'dark';
    const icon = document.getElementById('theme-icon');
    const text = document.getElementById('theme-text');
    if (icon) icon.innerHTML = isDark ? '🌙' : '☀️';
    if (text) text.textContent = isDark ? (typeof t === 'function' ? t('dark_mode') : 'Dark Mode') : (typeof t === 'function' ? t('light_mode') : 'Light Mode');

    // Expose refresh function for language toggle
    window.refreshProductsGrid = () => {
        const localData = getLocalProducts();
        renderAdminProductsTable(localData);
    };


    // --- Actions (Local + API Support) ---

    window.deleteProduct = async (id) => {
        if (!confirm(t('confirm_delete'))) return;

        try {
            // Always use LocalStorage in demo mode
            await deleteProductFromCloud(id);
        } catch (e) {
            console.error('Delete error:', e);
            showToast(t('delete_failed'), 'error');
        }
    };

    window.editProduct = async (id) => {
        try {
            // Always use LocalStorage in demo mode
            // Ensure ID is compared correctly (string vs string)
            const p = getLocalProducts().find(prod => String(prod._id) === String(id) || String(prod.id) === String(id));
            if (!p) {
                showToast(t('product_not_found'), 'error');
                console.error('Edit failed: Product ID not found', id);
                return;
            }
            populateForm(p);
        } catch (e) {
            console.error('Edit error:', e);
            showToast(t('load_failed'), 'error');
        }
    };

    function populateForm(p) {
        if (productIdInput) productIdInput.value = p._id;
        document.getElementById('name').value = p.name;
        document.getElementById('nameEn').value = p.nameEn || '';
        document.getElementById('price').value = p.price;
        document.getElementById('category').value = p.category || '';
        document.getElementById('image').value = p.image || '';
        document.getElementById('description').value = p.description || '';
        document.getElementById('descriptionEn').value = p.descriptionEn || ''; // Load English description
        document.getElementById('shipping').value = p.shipping || 0;
        document.getElementById('stock').value = p.stock !== undefined ? p.stock : 0;
        document.getElementById('rating').value = p.rating !== undefined ? p.rating : 5;
        document.getElementById('review_count').value = p.review_count !== undefined ? p.review_count : 0;

        // Load additional images if they exist
        if (p.images && Array.isArray(p.images)) {
            additionalImages = [...p.images];
            updateAdditionalPreviews();
        }

        // Show main image preview if it's a base64 or URL
        if (p.image) {
            const preview = document.getElementById('image-preview');
            const previewImg = document.getElementById('preview-img');
            if (preview && previewImg) {
                previewImg.src = p.image;
                preview.style.display = 'block';
            }
        }

        if (submitBtn) {
            submitBtn.textContent = t('update_product');
            submitBtn.classList.add('btn-warning');
        }

        const modalTitle = document.querySelector('.modal-title');
        if (modalTitle) modalTitle.textContent = t('edit_product_title');

        openModal();
    }

    // Form Submit
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Gather Data
            const id = productIdInput.value;
            const name = document.getElementById('name').value;
            const nameEn = document.getElementById('nameEn').value;
            const price = parseFloat(document.getElementById('price').value);
            const category = document.getElementById('category').value;
            const image = document.getElementById('image').value;
            const description = document.getElementById('description').value;
            const descriptionEn = document.getElementById('descriptionEn').value;
            const shipping = parseFloat(document.getElementById('shipping').value) || 0;
            const stock = parseInt(document.getElementById('stock').value) || 0;
            const rating = parseFloat(document.getElementById('rating').value) || 5;
            const review_count = parseInt(document.getElementById('review_count').value) || 0;

            const productData = {
                id: id || Date.now(), // Generate ID if new
                _id: id || Date.now(),
                name,
                nameEn,
                price,
                category,
                image,
                description,
                descriptionEn, // Save English description
                shipping,
                stock,
                rating,
                review_count,
                images: additionalImages.filter(img => img), // Helper array
                lastUpdated: new Date().toISOString()
            };

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = typeof t === 'function' ? t('saving') : 'Saving...';
            }

            try {
                // Save to Cloud
                await saveProductToCloud(productData);

                // Success Handling
                closeModal();
                // No need to call fetchProducts() because the listener will update UI
            } catch (error) {
                console.error('Save failed:', error);
                showToast(typeof t === 'function' ? t('save_error') : 'An error occurred while saving', 'error');
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = id ? (typeof t === 'function' ? t('update_product') : 'Update Product') : (typeof t === 'function' ? t('save_product') : 'Save Product');
                }
            }
        });
    }


    // Auto-Run
    fetchProducts();

    // Listen for storage changes (Products)
    window.addEventListener('storage', (e) => {
        if (e.key === STORAGE_KEY) {
            console.log('🔄 Products sync triggered!');
            fetchProducts();
        }
        if (e.key === ORDERS_STORAGE_KEY) {
            console.log('🔄 Orders sync triggered!');
            fetchOrders();
        }
        // Also listen for new purchases via fallback mechanism if needed
    });
});

// ===== ORDERS MANAGEMENT FUNCTIONS =====

let currentOrders = [];

async function fetchOrders() {
    console.log('🚀 fetchOrders called');
    const loader = document.getElementById('admin-loader');
    if (loader) loader.style.display = 'block';

    try {
        // Try API first (will fail in demo mode)
        const timeout = new Promise((_, reject) => setTimeout(() => reject('Timeout'), 2000));
        const res = await Promise.race([fetch('/api/orders'), timeout]);
        const orders = await res.json();
        currentOrders = orders;
        renderOrders(orders);
        updateOrderStats(orders);
    } catch (err) {
        console.log('📦 Using LocalStorage (demo mode)');
        // Simply read from LocalStorage - init-demo-data.js has already populated it
        const localOrders = getLocalOrders();
        console.log('📂 Orders from LocalStorage:', localOrders.length);

        const localProducts = getLocalProducts();
        console.log('📦 Products from LocalStorage:', localProducts.length);

        // We NO LONGER sync orders with current product data to preserve historical pricing integrity.
        // Once an order is placed, its price must remain fixed.
        currentOrders = localOrders;
        console.log('🎨 Rendering', localOrders.length, 'orders');
        renderOrders(localOrders);
        updateOrderStats(localOrders);
    } finally {
        if (loader) loader.style.display = 'none';

        // Update Chart if on Dashboard
        if (document.getElementById('salesChart')) {
            initDashboard();
        }
    }
}

// Helper: Create sample orders from available products
function createSampleOrders(products) {
    console.log('🔧 createSampleOrders called with products:', products?.length || 0);

    if (!products || products.length === 0) {
        console.warn('⚠️ No products available to create sample orders');
        return [];
    }

    const statuses = ['completed', 'processing', 'pending'];
    const customers = [
        { name: 'أحمد محمد', email: 'ahmed@example.com', phone: '0612345678' },
        { name: 'فاطمة علي', email: 'fatima@example.com', phone: '0623456789' },
        { name: 'محمد حسن', email: 'mohamed@example.com', phone: '0634567890' }
    ];

    const orders = [];
    const now = Date.now();

    for (let i = 0; i < 3; i++) {
        const customer = customers[i];
        const numProducts = Math.floor(Math.random() * 2) + 1; // 1-2 products per order
        const selectedProducts = [];

        for (let j = 0; j < numProducts; j++) {
            const product = products[Math.floor(Math.random() * products.length)];
            selectedProducts.push({
                productId: product._id,
                productName: product.name,
                price: product.price,
                quantity: Math.floor(Math.random() * 2) + 1,
                image: product.image
            });
        }

        const subtotal = selectedProducts.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shipping = 0; // Free shipping

        orders.push({
            _id: `order_${Date.now()}_${i} `,
            orderNumber: `#${1900 + i}#`,
            orderDate: new Date(now - (i * 24 * 60 * 60 * 1000)).toISOString(), // Last 3 days
            status: statuses[i],
            customerName: customer.name,
            customerEmail: customer.email,
            customerPhone: customer.phone,
            postalCode: `${10000 + i * 100} `,
            shippingAddress: `${i + 10} شارع المثال، الدار البيضاء`,
            items: selectedProducts,
            subtotal: subtotal,
            shipping: shipping,
            total: subtotal + shipping
        });
    }

    console.log('✅ Created sample orders:', orders.length);
    return orders;
}

// Helper: Sync Mock Orders with real Product Data
function syncMockOrdersWithProducts(orders, products) {
    if (!orders || !products) return orders;

    return orders.map(order => {
        let orderSubtotal = 0;
        let maxShipping = 0;
        let itemsChanged = false;

        const updatedItems = order.items.map(item => {
            const product = products.find(p => p._id === item.productId);
            if (product) {
                // Determine effective shipping for this item (simplified logic: take product shipping)
                const prodShipping = parseFloat(product.shipping) || 0;
                if (prodShipping > maxShipping) maxShipping = prodShipping;

                // Update item details if changed
                if (item.price !== product.price || item.productName !== product.name || item.image !== product.image) {
                    itemsChanged = true;
                    return {
                        ...item,
                        productName: product.name,
                        price: product.price,
                        image: product.image
                    };
                }
            }
            return item;
        });

        // Recalculate Subtotal
        updatedItems.forEach(item => {
            orderSubtotal += (item.price * item.quantity);
        });

        // Update Order level fields
        // Only update if shipping is different or we changed items
        // Note: In real app, order prices shouldn't change after placed. 
        // But for this DEMO/ADMIN BUILDER, keeping them in sync is the expected behavior.
        if (order.shipping !== maxShipping || itemsChanged || Math.abs(order.subtotal - orderSubtotal) > 0.01) {
            return {
                ...order,
                items: updatedItems,
                shipping: maxShipping,
                subtotal: orderSubtotal,
                total: orderSubtotal + maxShipping
            };
        }

        return order;
    });
}

function renderOrders(orders) {
    const container = document.getElementById('orders-container');
    const tableContainer = document.getElementById('recent-orders-list'); // Dashboard Table Body

    // 1. Render Table (Dashboard)
    if (tableContainer) {
        if (orders.length === 0) {
            tableContainer.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:2rem;">${t('no_recent_orders')}</td></tr>`;
        } else {
            const statusLabels = {
                pending: t('pending'),
                processing: t('processing'),
                completed: t('completed'),
                cancelled: t('cancelled')
            };
            const statusClasses = {
                pending: 'status-pending',
                processing: 'status-processing',
                completed: 'status-completed',
                cancelled: 'status-cancelled'
            };

            // Take top 5 for dashboard
            tableContainer.innerHTML = orders.slice(0, 5).map(order => `
    < tr >
                    <td>${order.orderNumber}</td>
                    <td>${order.customerName}</td>
                    <td>$${order.total.toFixed(2)}</td>
                    <td><span class="status-badge ${statusClasses[order.status] || ''}">${statusLabels[order.status]}</span></td>
                    <td>${new Date(order.orderDate).toLocaleDateString('en-US')}</td>
                </tr >
    `).join('');
        }
    }

    // 2. Render Cards (Sales Page)
    if (container) {
        if (orders.length === 0) {
            container.innerHTML = `<div style="text-align:center; padding:3rem; color:var(--text-secondary);">${t('noOrders')}</div>`;
            return;
        }

        const statusColors = {
            pending: '#f59e0b',
            processing: '#3b82f6',
            completed: '#10b981',
            cancelled: '#ef4444'
        };

        const statusLabels = {
            pending: t('pending'),
            processing: t('processing'),
            completed: t('completed'),
            cancelled: t('cancelled')
        };

        container.innerHTML = orders.map(order => `
    < div class="order-card" onclick = "viewOrderDetails('${order._id}')" style = "background: var(--card-bg); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 1.5rem; margin-bottom: 1rem; cursor: pointer; transition: var(--transition);" >
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                    <div>
                        <h3 style="font-size: 1.1rem; margin-bottom: 0.5rem;">${order.orderNumber}</h3>
                        <p style="color: var(--text-secondary); font-size: 0.9rem;">${order.customerName}</p>
                    </div>
                    <span style="background: ${statusColors[order.status]}; color: white; padding: 0.25rem 0.75rem; border-radius: 999px; font-size: 0.85rem; font-weight: 600;">
                        ${statusLabels[order.status]}
                    </span>
                </div>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; margin-bottom: 1rem;">
                    <div>
                        <p style="color: var(--text-secondary); font-size: 0.85rem;">${t('totalAmount')}</p>
                        <p style="font-weight: 700; color: var(--accent-color);">$${order.total.toFixed(2)}</p>
                    </div>
                    <div>
                        <p style="color: var(--text-secondary); font-size: 0.85rem;">${t('productCount')}</p>
                        <p style="font-weight: 600;">${order.items.reduce((sum, item) => sum + item.quantity, 0)}</p>
                    </div>
                    <div>
                        <p style="color: var(--text-secondary); font-size: 0.85rem;">${t('date')}</p>
                        <p style="font-weight: 600;">${new Date(order.orderDate).toLocaleDateString('en-US')}</p>
                    </div>
                </div>
                <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                    ${order.items.slice(0, 3).map(item => `
                        <img src="${item.image}" alt="${item.productName}" style="width: 50px; height: 50px; object-fit: cover; border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
                    `).join('')}
                    ${order.items.length > 3 ? `<div style="width: 50px; height: 50px; background: var(--border-color); border-radius: var(--radius-sm); display: flex; align-items: center; justify-content: center; font-size: 0.85rem; font-weight: 600;">+${order.items.length - 3}</div>` : ''}
                </div>
            </div >
    `).join('');
    }
}

function updateOrderStats(orders) {
    const total = orders.length;
    const pending = orders.filter(o => o.status === 'pending').length;
    const processing = orders.filter(o => o.status === 'processing').length;
    const completed = orders.filter(o => o.status === 'completed').length;

    const elTotal = document.getElementById('stat-total-orders');
    const elPending = document.getElementById('stat-pending-orders');
    const elProcessing = document.getElementById('stat-processing-orders');
    const elCompleted = document.getElementById('stat-completed-orders');

    if (elTotal) elTotal.textContent = total;
    if (elPending) elPending.textContent = pending;
    if (elProcessing) elProcessing.textContent = processing;
    if (elCompleted) elCompleted.textContent = completed;
}

function filterOrders() {
    const filter = document.getElementById('status-filter').value;
    if (filter === 'all') {
        renderOrders(currentOrders);
    } else {
        const filtered = currentOrders.filter(o => o.status === filter);
        renderOrders(filtered);
    }
}

function viewOrderDetails(orderId) {
    const order = currentOrders.find(o => o._id === orderId);
    if (!order) return;

    const statusColors = {
        pending: '#f59e0b',
        processing: '#3b82f6',
        completed: '#10b981',
        cancelled: '#ef4444'
    };

    const statusLabels = {
        pending: typeof t === 'function' ? t('pending') : 'Pending',
        processing: typeof t === 'function' ? t('processing') : 'Processing',
        completed: typeof t === 'function' ? t('completed') : 'Completed',
        cancelled: typeof t === 'function' ? t('cancelled') : 'Cancelled'
    };

    const content = document.getElementById('order-details-content');
    content.innerHTML = `
    < div style = "padding: 1rem 0;" >
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border-color);">
                <div>
                    <h2 style="font-size: 1.5rem; margin-bottom: 0.5rem;">${order.orderNumber}</h2>
                    <p style="color: var(--text-secondary);">${new Date(order.orderDate).toLocaleString('en-US')}</p>
                </div>
                <select onchange="updateOrderStatus('${order._id}', this.value)" style="padding: 0.5rem 1rem; border-radius: var(--radius-sm); border: 1px solid var(--border-color); background: var(--card-bg); color: var(--text-primary); font-weight: 600;">
                    <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>${statusLabels.pending}</option>
                    <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>${statusLabels.processing}</option>
                    <option value="completed" ${order.status === 'completed' ? 'selected' : ''}>${statusLabels.completed}</option>
                    <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>${statusLabels.cancelled}</option>
                </select>
            </div>

            <div style="margin-bottom: 1.5rem;">
                <h3 style="margin-bottom: 1rem;">${typeof t === 'function' ? t('customer_info') : 'Customer Information'}</h3>
                <div style="background: rgba(99, 102, 241, 0.1); padding: 1rem; border-radius: var(--radius-sm);">
                    <p style="margin-bottom: 0.5rem;"><strong>${typeof t === 'function' ? t('customer_name_label') : 'Name'}:</strong> ${order.customerName}</p>
                    <p style="margin-bottom: 0.5rem;">
                        <strong>${typeof t === 'function' ? t('customer_email_label') : 'Email'}:</strong> 
                        <a href="mailto:${order.customerEmail}" style="color: var(--accent-color); text-decoration: none; transition: opacity 0.3s;" onmouseover="this.style.opacity='0.7'" onmouseout="this.style.opacity='1'">
                            ${order.customerEmail}
                        </a>
                    </p>
                    <p style="margin-bottom: 0.5rem;">
                        <strong>${typeof t === 'function' ? t('customer_phone_label') : 'Phone'}:</strong> 
                        <a href="https://wa.me/${order.customerPhone.replace(/^0/, '212').replace(/\s/g, '')}" target="_blank" style="color: #25D366; text-decoration: none; transition: opacity 0.3s;" onmouseover="this.style.opacity='0.7'" onmouseout="this.style.opacity='1'">
                            ${order.customerPhone} 📱
                        </a>
                    </p>
                    <p style="margin-bottom: 0.5rem;"><strong>${typeof t === 'function' ? t('postal_code_label') : 'Postal Code'}:</strong> ${order.postalCode || (typeof t === 'function' ? t('not_available') : 'N/A')}</p>
                    <p><strong>${typeof t === 'function' ? t('address_label') : 'Address'}:</strong> ${order.shippingAddress}</p>
                </div>
            </div>

            <div style="margin-bottom: 1.5rem;">
                <h3 style="margin-bottom: 1rem;">${typeof t === 'function' ? t('ordered_products') : 'Products'}</h3>
                ${order.items.map(item => `
                    <div style="display: flex; gap: 1rem; padding: 1rem; background: var(--card-bg); border: 1px solid var(--border-color); border-radius: var(--radius-sm); margin-bottom: 0.75rem;">
                        <img src="${item.image}" alt="${item.productName}" style="width: 80px; height: 80px; object-fit: cover; border-radius: var(--radius-sm);">
                        <div style="flex: 1;">
                            <h4 style="margin-bottom: 0.5rem;">${item.productName}</h4>
                            <p style="color: var(--text-secondary); font-size: 0.9rem;">${typeof t === 'function' ? t('quantity') : 'Quantity'}: ${item.quantity}</p>
                        </div>
                        <div style="text-align: left;">
                            <p style="font-weight: 700; color: var(--accent-color);">$${(item.price * item.quantity).toFixed(2)}</p>
                            <p style="color: var(--text-secondary); font-size: 0.85rem;">$${item.price.toFixed(2)} × ${item.quantity}</p>
                        </div>
                    </div>
                `).join('')}
            </div>

            <div style="background: rgba(99, 102, 241, 0.05); padding: 1rem; border-radius: var(--radius-sm);">
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                    <span>${typeof t === 'function' ? t('subtotal') : 'Subtotal'}:</span>
                    <span>$${order.subtotal.toFixed(2)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                    <span>${typeof t === 'function' ? t('shipping') : 'Shipping'}:</span>
                    <span>${order.shipping === 0 ? (typeof t === 'function' ? t('free_shipping') : 'Free') : '$' + order.shipping.toFixed(2)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; padding-top: 0.5rem; border-top: 1px solid var(--border-color); font-size: 1.2rem; font-weight: 700;">
                    <span>${typeof t === 'function' ? t('total') : 'Total'}:</span>
                    <span style="color: var(--accent-color);">$${order.total.toFixed(2)}</span>
                </div>
            </div>
        </div >
    `;

    const modal = document.getElementById('order-modal');
    if (modal) modal.classList.add('active');
}

function closeOrderModal() {
    const modal = document.getElementById('order-modal');
    if (modal) modal.classList.remove('active');
}

function updateOrderStatus(orderId, newStatus) {
    const orders = getLocalOrders();
    const orderIndex = orders.findIndex(o => o._id === orderId);
    if (orderIndex !== -1) {
        orders[orderIndex].status = newStatus;
        saveLocalOrders(orders);
        currentOrders = orders;
        renderOrders(orders);
        updateOrderStats(orders);
        showToast(typeof t === 'function' ? t('order_status_updated') : 'Order status updated', 'success');
        closeOrderModal();
    }
}

// Expose globally
window.fetchOrders = fetchOrders;
window.filterOrders = filterOrders;
window.viewOrderDetails = viewOrderDetails;
window.closeOrderModal = closeOrderModal;
window.updateOrderStats = updateOrderStats;
window.updateOrderStatus = updateOrderStatus;

// ===== DASHBOARD ENHANCEMENTS =====

// Initialize Dashboard
function initDashboard() {
    const ctx = document.getElementById('salesChart');
    if (!ctx) return;

    // Destroy existing chart if any
    if (window.salesChartInstance) {
        window.salesChartInstance.destroy();
    }

    const orders = window.currentOrders || getLocalOrders();

    // Prepare Data: Sales Last 7 Days
    const labels = [];
    const data = [];
    const days = 7;

    for (let i = days - 1; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        const currentLang = document.documentElement.lang || 'ar';
        const locale = currentLang === 'ar' ? 'ar-MA' : 'en-US';

        // Ensure Western digits (0-9) by using 'ar-u-nu-latn' if needed
        const labelLocale = currentLang === 'ar' ? 'ar-u-nu-latn' : 'en-US';
        labels.push(d.toLocaleDateString(labelLocale, { weekday: 'long' }));

        // Sum total of orders for this day
        const dailyTotal = orders
            .filter(o => o.orderDate.startsWith(dateStr))
            .reduce((sum, o) => sum + o.total, 0);

        data.push(dailyTotal);
    }

    const isDarkMode = document.body.classList.contains('dark-mode');
    const accentColor = '#D4AF37';
    const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)';
    const textColor = isDarkMode ? '#9ca3af' : '#6b7280';

    // Create Gradient
    const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, 'rgba(212, 175, 55, 0.3)');
    gradient.addColorStop(1, 'rgba(212, 175, 55, 0)');

    window.salesChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: currentLang === 'ar' ? 'المبيعات ($)' : 'Sales ($)',
                data: data,
                borderColor: accentColor,
                backgroundColor: gradient,
                borderWidth: 3,
                tension: 0.4,
                fill: true,
                pointBackgroundColor: isDarkMode ? '#18181B' : '#fff',
                pointBorderColor: accentColor,
                pointHoverRadius: 6,
                pointRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: isDarkMode ? 'rgba(24, 24, 27, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                    titleColor: accentColor,
                    bodyColor: isDarkMode ? '#fff' : '#000',
                    borderColor: 'rgba(212, 175, 55, 0.2)',
                    borderWidth: 1,
                    padding: 12,
                    bodyFont: { family: 'Cairo', size: 13 },
                    titleFont: { family: 'Cairo', size: 14, weight: 'bold' }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: gridColor,
                        drawBorder: false
                    },
                    ticks: {
                        color: textColor,
                        font: { family: 'Cairo' },
                        padding: 10,
                        // Force Western digits (0-9)
                        callback: function (value) {
                            return value.toLocaleString('en-US');
                        }
                    }
                },
                x: {
                    grid: { display: false },
                    ticks: {
                        color: textColor,
                        font: { family: 'Cairo' },
                        padding: 10
                    }
                }
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Manually trigger fetch logic for this page
    if (typeof fetchOrders === 'function') {
        fetchOrders().then(() => {
            // initDashboard() will be called inside fetchOrders success or here after
        });
    }

    if (document.getElementById('salesChart')) {
        // We wait for fetchOrders to populate data, then initDashboard is best called from renderOrders or updated stats
        // But for safety, call it here too with potentially empty data then update later
        initDashboard();
    }
});






