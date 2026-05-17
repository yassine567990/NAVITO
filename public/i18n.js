// Translation System for NAVITO
const translations = {
    ar: {
        // Admin Panel
        'admin_panel': 'لوحة الإدارة',
        'menu_dashboard': 'لوحة المعلومات',
        'menu_products': 'المنتجات',
        'menu_sales': 'المبيعات',
        'menu_store': 'المتجر',
        'logout': 'تسجيل الخروج',

        // Dashboard
        'dashboard_title': 'لوحة المعلومات',
        'total_products': 'إجمالي المنتجات',
        'total_revenue': 'إجمالي المداخيل المالية',
        'total_sales': 'إجمالي المبيعات',
        'low_stock': 'منتجات قليلة المخزون',
        'sales_analysis': 'تحليل المبيعات',
        'sales_last_7_days': 'مبيعات آخر 7 أيام',
        'top_products': 'أفضل المنتجات',
        'recent_orders': 'أحدث الطلبات',
        'no_recent_orders': 'لا توجد طلبات حديثة',
        'order_number': 'رقم الطلب',
        'customer': 'العميل',
        'amount': 'المبلغ',
        'status': 'الحالة',
        'date': 'التاريخ',
        'sales': 'مبيعات',
        'sold': 'مبيع',
        'store_insights': 'تنبيهات ورؤى المتجر',
        'analyzing_data': 'جاري تحليل البيانات...',
        'no_alerts': 'رائع! كل شيء يسير بشكل مثالي في متجرك اليوم.',
        'out_of_stock_alert': '⚠️ نفاذ المخزون: {name}',
        'low_stock_alert': '📉 مخزون منخفض: {name} ({count} قطعة)',
        'no_sales_today_alert': '⌛ لم يتم تسجيل أي طلبات اليوم حتى الآن.',
        'high_revenue_alert': '💰 أداء رائع! مبيعاتك اليوم ممتازة.',

        'products_management': 'إدارة المنتجات',
        'add_new_product': 'إضافة منتج جديد',
        'modal_title': 'إضافة / تعديل منتج',
        'product_name': 'اسم المنتج (بالعربية)',
        'product_name_en': 'اسم المنتج (بالإنجليزية)',
        'select_category': 'اختر تصنيف...',
        'shipping_cost': 'تكلفة الشحن ($)',
        'main_image': 'الصورة الرئيسية',
        'upload_from_device': '📁 رفع من الجهاز',
        'url_link': '🔗 رابط URL',
        'additional_images': 'صور إضافية (اختياري)',
        'save_product': 'حفظ المنتج',
        'cancel': 'إلغاء',
        'stock': 'المخزون',
        'edit': 'تعديل',
        'delete': 'حذف',
        'rating': 'التقييم',
        'review_count': 'عدد المقيّمين',

        // Sales & Orders (New)
        'sales_management': '💰 إدارة المبيعات والطلبات',
        'total_orders': 'إجمالي الطلبات',
        'all_orders': 'جميع الطلبات',
        'pending': 'قيد الانتظار',
        'awaiting_processing': 'بانتظار المعالجة',
        'processing': 'قيد المعالجة',
        'in_progress': 'جاري التنفيذ',
        'completed': 'مكتملة',
        'delivered': 'تم التسليم',
        'cancelled': 'ملغية',
        'search_placeholder': 'ابحث عن طلب، عميل، أو رقم طلب...',
        'all_statuses': '🔍 جميع الحالات',
        'export': 'تصدير',
        'print': 'طباعة',
        'noOrders': 'لا توجد طلبات',
        'noOrdersFound': 'لم يتم العثور على أي طلبات بعد',
        'totalAmount': 'المبلغ الإجمالي',
        'productCount': 'عدد المنتجات',
        'shipping': 'الشحن',
        'phoneNumber': 'رقم الهاتف',
        'freeShipping': 'مجاني 🎁',
        'products': 'منتج',
        'purchasedProducts': '📦 المنتجات المشتراة:',
        'customerInfo': 'معلومات العميل',
        'name': 'الاسم',
        'zip': 'رمز البريد',

        // Header & Navigation
        'home': 'الرئيسية',
        'shop': 'المتجر',
        'account': 'حسابي',
        'login': 'دخول',
        'logout': 'خروج',
        'language': 'English',
        'dark_mode': 'الوضع الليلي',
        'light_mode': 'الوضع النهاري',
        'shopping_cart': 'السلة',
        'cart_items': 'منتجات',
        'download_app': 'تحميل التطبيق',
        'help': 'المساعدة',

        // Search & Filters
        'search_products': 'ابحث عن منتجات...',
        'search': 'بحث',
        'all': 'الكل',
        'category_all': 'جميع المنتجات',
        'category_skincare': 'عناية بالبشرة',
        'category_makeup': 'مكياج',
        'category_haircare': 'عناية بالشعر',
        'category_perfumes': 'عطور',
        'category_makeup_tools': 'أدوات مكياج',
        'exclusive_offer': 'عرض حصري',
        // Removed old category keys: 'makeup', 'skincare', 'perfumes', 'haircare', 'makeup_tools'

        // Product Actions
        'add_to_cart': 'إضافة للسلة',
        'buy_now': 'شراء الآن',
        'view_details': 'عرض التفاصيل',
        'best_sellers': 'الأكثر مبيعاً',
        'latest_products': 'أحدث صيحات الجمال',
        'product_description': 'وصف المنتج',
        'product_features': 'المميزات',
        'in_stock': 'في المخزون',
        'reviews': 'تقييم',

        // Cart
        'cart_title': 'سلة المشتريات',
        'cart_empty': 'سلة المشتريات فارغة',
        'subtotal': 'المجموع الفرعي',
        'total': 'الإجمالي',
        'checkout': 'إتمام الطلب',
        'continue_shopping': 'مواصلة التسوق',

        // Checkout
        'shipping_info': 'معلومات الشحن',
        'payment_method': 'طريقة الدفع',
        'order_summary': 'ملخص الطلب',
        'full_name': 'الاسم الكامل',
        'email': 'البريد الإلكتروني',
        'phone': 'رقم الهاتف',
        'address': 'العنوان',
        'city': 'المدينة',
        'postal': 'الرمز البريدي',
        'cash_on_delivery': 'الدفع عند الاستلام',
        'card_payment': 'الدفع الإلكتروني',
        'confirm_order': 'تأكيد الطلب',
        'secure_payment': 'جميع المعاملات مشفرة وآمنة',
        'shipping': 'الشحن',
        'free': 'مجاني',
        'checkout_subtitle': 'يرجى ملء بيانات الشحن لإكمال طلبك بنجاح',
        'full_address': 'العنوان الكامل',
        'cod_desc': 'ادفع نقداً عند استلام الطلب',
        'card_desc': 'بطاقة ائتمانية أو مدى (قريباً)',
        'secure_msg': 'جميع المعاملات مشفرة وآمنة',
        'copyright': 'حقوق النشر © 2024 NAVITO',
        'close': 'إغلاق',

        // Auth
        'welcome_back': 'مرحباً بزيارتكم لـ Navito المغرب 🇲🇦',
        'marquee_msg': 'شحن مجاني لكل المدن المغربية • الدفع عند الاستلام • منتجات أصلية 100%',
        'hero_title': 'أحدث صيحات الجمال',
        'hero_subtitle': 'اكتشفوا مجموعتنا الحصرية من منتجات العناية والجمال المختارة بعناية لأجلك.',
        'login_subtitle': 'سجل دخولك للمتابعة',
        'password': 'كلمة المرور',
        'remember_me': 'تذكرني',
        'forgot_password': 'نسيت كلمة المرور؟',
        'no_account': 'ليس لديك حساب؟',
        'create_account': 'إنشاء حساب جديد',
        'have_account': 'لديك حساب بالفعل؟',
        'register_title': 'إنشاء حساب جديد',
        'register_subtitle': 'انضم إلينا اليوم',
        'confirm_password': 'تأكيد كلمة المرور',

        // Messages
        'added_to_cart': 'تمت الإضافة للسلة',
        'order_success': 'تم استلام طلبك بنجاح!',
        'shipping_calculating': 'جاري حساب الشحن...',
        'order_number': 'رقم الطلب',

        'quantity': 'الكمية',
        'col_price': 'السعر',
        'col_stock': 'المخزون',
        'col_category': 'التصنيف',
        'col_image': 'الصورة',
        'col_name': 'الاسم',
        'switched_to_en': 'تم التحويل للغة الإنجليزية ✅',
        'switched_to_ar': 'تم التحويل للغة العربية ✅',
        'currency_sa': 'ر.س',
        'currency_ma': 'MAD',
        'currency': 'MAD',
        'shipping_ma': 'توصيل لجميع مدن المغرب',
        'shipping_sa': 'شحن سريع للمملكة',
        'country_ma': 'المغرب 🇲🇦',
        'country_sa': 'السعودية 🇸🇦',
        'shipping_sa': 'شحن سريع للمملكة',
        'shipping_ma': 'توصيل لجميع مدن المغرب',

        // Footer
        'footer_about': 'اقرأ المزيد',
        'about_us': 'من نحن',
        'contact_us': 'تواصل معنا',
        'sitemap': 'خريطة الموقع',
        'buyer_services': 'خدمات المشتري',
        'search_products_footer': 'البحث عن منتجات',
        'search_suppliers': 'البحث عن موردين',
        'purchase_requests': 'طلبات الشراء',
        'supplier_services': 'خدمات المورد',
        'display_products': 'عرض المنتجات',
        'premium_membership': 'العضوية المميزة',
        'platform_description': 'منصتكم الرائدة لتجربة تسوق فريدة ومتميزة في عالم الجمال.',
        'copyright': 'حقوق النشر © 2024 NAVITO. جميع الحقوق محفوظة.',

        // Missing Keys for Dashboard & Sales
        'premium_insight': 'رؤية احترافية',
        'premium_tip': 'تلميحة احترافية',
        'tip_text': 'استخدم تحليلات المبيعات لتحديد أفضل الأوقات لإطلاق العروض الترويجية.',
        'premium_tip_text': 'النمو الحقيقي يبدأ من تحليل البيانات. تأكد من مراجعة تفضيلات عملائك بانتظام لتطوير مخزونك.',
        'view_all': 'عرض الكل',
        'order_date': 'تاريخ الطلب',
        'order_status': 'حالة الطلب',
        'order_total': 'إجمالي الطلب',
        'actions': 'عمليات',
        'jan': 'يناير', 'feb': 'فبراير', 'mar': 'مارس', 'apr': 'أبريل', 'may': 'مايو', 'jun': 'يونيو',
        'jul': 'يوليو', 'aug': 'أغسطس', 'sep': 'سبتمبر', 'oct': 'أكتوبر', 'nov': 'نوفمبر', 'dec': 'ديسمبر',
        'all_orders': 'جميع الطلبات',
        'awaiting_processing': 'بانتظار المعالجة',
        'in_progress': 'جاري التنفيذ',
        'delivered': 'تم التسليم',
        'sales_management': 'إدارة المبيعات والطلبات',
        'total_orders': 'إجمالي الطلبات',
        'pending': 'قيد الانتظار',
        'processing': 'قيد المعالجة',
        'completed': 'مكتملة',
        'mon': 'الإثنين', 'tue': 'الثلاثاء', 'wed': 'الأربعاء', 'thu': 'الخميس', 'fri': 'الجمعة', 'sat': 'السبت', 'sun': 'الأحد',

        // Services & Footer (New)
        'fast_delivery': 'توصيل سريع',
        'fast_delivery_desc': 'توصيل لجميع المناطق في وقت قياسي',
        'secure_payment_title': 'دفع آمن',
        'secure_payment_desc': 'خيارات دفع متعددة وآمنة تماماً',
        'return_policy': 'سياسة الاسترجاع',
        'return_policy_desc': 'إمكانية الاسترجاع خلال 14 يوماً',
        'support_24': 'دعم متواصل',
        'support_24_desc': 'فريق دعم متواجد لخدمتكم دائماً',
        'quick_links': 'روابط سريعة',
        'customer_service': 'خدمة العملاء',
        'contact_info': 'اتصل بنا',
        'faq': 'الأسئلة الشائعة',
        'shipping_policy': 'سياسة الشحن',
        'footer_address': '📍 المغرب، الدار البيضاء',
        'footer_email': '📧 info@navito.ma',
        'footer_phone': '📞 +212 522 00 00 00',
        'language_selection': 'اللغة / Language',
        'theme_selection': 'الوضع / Theme',

        // Order Details Modal & Admin Actions
        'order_details': '📋 تفاصيل الطلب',
        'account_info': '👤 معلومات الحساب',
        'details': 'التفاصيل',
        'customer_info': 'معلومات العميل',
        'customer_name_label': 'الاسم',
        'customer_email_label': 'البريد الإلكتروني',
        'customer_phone_label': 'الهاتف',
        'postal_code_label': 'رمز البريد',
        'address_label': 'العنوان',
        'ordered_products': 'المنتجات',
        'not_available': 'غير متوفر',
        'save_product': 'حفظ المنتج',
        'update_product': 'تحديث المنتج',
        'edit_product_title': 'تعديل المنتج',
        'add_product_title': 'إضافة منتج جديد',
        'saving': 'جاري الحفظ...',
        'confirm_delete': 'هل أنت متأكد من الحذف؟',
        'delete_failed': 'فشل الحذف',
        'product_not_found': 'المنتج غير موجود',
        'load_failed': 'فشل التحميل',
        'save_error': 'حدث خطأ أثناء الحفظ',
        'no_products_available': 'لا توجد منتجات حالياً',
        'no_low_stock': 'رائع! لا توجد منتجات منخفضة المخزون حالياً',
        'generate_sample': '✨ إنشاء منتجات تجريبية',
        'sample_created': '✅ تم إنشاء منتجات تجريبية',
        'show_all': '🔄 عرض الكل',
        'image_too_large': 'الصورة كبيرة جداً. الحد الأقصى 500KB',
        'dark_mode_activated': 'تم تفعيل الوضع الليلي',
        'light_mode_activated': 'تم تفعيل الوضع النهاري',
        'order_status_updated': 'تم تحديث حالة الطلب',
        'no_orders_to_export': 'لا توجد طلبات للتصدير',
        'orders_exported': 'تم تصدير الطلبات بنجاح',
        'export_order_number': 'رقم الطلب',
        'export_customer_name': 'اسم العميل',
        'export_email': 'البريد الإلكتروني',
        'export_phone': 'الهاتف',
        'export_postal': 'رمز البريد',
        'export_total': 'المبلغ الإجمالي',
        'export_status': 'الحالة',
        'export_date': 'التاريخ',
        'no_products_to_show': 'لا توجد منتجات لعرضها',
        'please_login': 'يرجى تسجيل الدخول أولاً للمتابعة',
        'quick_buy_notice': 'شراء سريع (عنصر واحد) - لن يتم حفظه في السلة',
        'empty_cart_msg': 'السلة فارغة. تصفح المنتجات',
        'order_success_msg': 'تم استلام طلبك بنجاح! رقم الطلب: ',
        'go_shopping': 'تصفح المنتجات',
        'shop_now': 'تسوق الآن',
        'discover_products': 'اكتشف المنتجات',
        'discover_offers': 'اكتشف العروض',
        'offers_title': 'عروض نافيتو | Navito Offers',
        'category_offers': 'العروض',
        'social_proof_watching': '24 شخص يشاهدون المنتج الآن',
        'social_proof_purchased': 'تم شراء هذا المنتج 120 مرة اليوم',
        'offer_ends_in': 'العرض ينتهي خلال:',
        'why_choose_us_title': 'لماذا تختار Navito؟',
        'original_products': 'منتجات أصلية',
        'original_products_desc': 'جميع منتجاتنا أصلية 100%',
        'track_order_btn': 'تتبع طلبك',
        'reviews_title': 'تقييمات عملائنا',
        'discount_popup_title': 'احصل على خصم 10% خصيصاً لك!',
        'discount_popup_desc': 'اشترك اليوم لتصلك أفضل العروض والخصومات الحصرية.',
        'subscribe_btn': 'احصل على الخصم',
        'no_thanks': 'لا شكراً، أريد التسوق فقط',
        'bundle_1': 'قطعة واحدة',
        'bundle_2': 'قطعتان - خصم إضافي',
        'bundle_3': '3 قطع - أفضل قيمة',
        'limited_offer': 'عرض لفترة محدودة 🔥',
        'free_delivery_today': 'شحن مجاني للطلبات لهذا اليوم فقط! 🚚',
        'product_saved': 'تم حفظ المنتج بنجاح',
        'product_deleted': 'تم حذف المنتج',
        'save_failed_prefix': 'فشل الحفظ: ',
        'no_products_to_show': 'لا توجد منتجات لعرضها',
        'faq': 'الأسئلة الشائعة',
        'about_us': 'من نحن',
        'contact_us': 'تواصل معنا',
        'shipping_policy': 'سياسة الشحن',
        'details': 'التفاصيل',
        'empty_cart_msg': 'سلتك فارغة حالياً',
        'quick_buy_notice': 'إتمام الطلب السريع',
        'quantity': 'الكمية',
        'order_success_msg': 'تم تسجيل طلبك بنجاح! رقم الطلب: ',
        'enter_order_id': 'أدخل رقم طلبك من البريد/الرسالة',
        'close': 'إغلاق',
        'continue_shopping': 'مواصلة التسوق'
    },

    en: {
        // Admin Panel
        'admin_panel': 'Admin Panel',
        'menu_dashboard': 'Dashboard',
        'menu_products': 'Products',
        'menu_sales': 'Sales',
        'menu_store': 'Store',
        'logout': 'Logout',

        // Dashboard
        'dashboard_title': 'Dashboard',
        'total_products': 'Total Products',
        'total_revenue': 'Total Revenue',
        'total_sales': 'Total Sales',
        'low_stock': 'Low Stock Products',
        'sales_analysis': 'Sales Analysis',
        'sales_last_7_days': 'Sales Last 7 Days',
        'top_products': 'Top Products',
        'recent_orders': 'Recent Orders',
        'no_recent_orders': 'No recent orders',
        'order_number': 'Order Number',
        'customer': 'Customer',
        'amount': 'Amount',
        'status': 'Status',
        'date': 'Date',
        'sales': 'sales',
        'sold': 'Sold',
        'store_insights': 'Store Insights & Alerts',
        'analyzing_data': 'Analyzing store data...',
        'no_alerts': 'Great! Everything is running perfectly today.',
        'out_of_stock_alert': '⚠️ Out of Stock: {name}',
        'low_stock_alert': '📉 Low Stock: {name} ({count} items)',
        'no_sales_today_alert': '⌛ No orders recorded today yet.',
        'high_revenue_alert': '💰 Great job! Today\'s revenue is excellent!',

        'products_management': 'Products Management',
        'add_new_product': 'Add New Product',
        'modal_title': 'Add / Edit Product',
        'product_name': 'Product Name',
        'select_category': 'Select category...',
        'shipping_cost': 'Shipping Cost ($)',
        'main_image': 'Main Image',
        'upload_from_device': '📁 Upload from Device',
        'url_link': '🔗 URL Link',
        'additional_images': 'Additional Images (Optional)',
        'save_product': 'Save Product',
        'cancel': 'Cancel',
        'stock': 'Stock',
        'edit': 'Edit',
        'delete': 'Delete',
        'rating': 'Rating',
        'review_count': 'Review Count',

        // Sales & Orders (New)
        'sales_management': '💰 Sales & Orders Management',
        'total_orders': 'Total Orders',
        'all_orders': 'All Orders',
        'pending': 'Pending',
        'awaiting_processing': 'Awaiting Processing',
        'processing': 'Processing',
        'in_progress': 'In Progress',
        'completed': 'Completed',
        'delivered': 'Delivered',
        'cancelled': 'Cancelled',
        'search_placeholder': 'Search for order, customer, or order number...',
        'all_statuses': '🔍 All Statuses',
        'export': 'Export',
        'print': 'Print',
        'noOrders': 'No Orders',
        'noOrdersFound': 'No orders found yet',
        'totalAmount': 'Total Amount',
        'productCount': 'Product Count',
        'shipping': 'Shipping',
        'phoneNumber': 'Phone Number',
        'freeShipping': 'Free 🎁',
        'products': 'product',
        'purchasedProducts': '📦 Purchased Products:',
        'col_image': 'Image',
        'col_name': 'Name',
        'col_category': 'Category',
        'col_price': 'Price',
        'col_stock': 'Stock',

        'product_name': 'Product Name (Arabic)',
        'product_name_en': 'Product Name (English)',
        'description': 'Description (Arabic)',
        'description_en': 'Description (English)',
        'zip': 'Postal Code',
        'home': 'Home',
        'shop': 'Shop',
        'account': 'Account',
        'login': 'Login',
        'logout': 'Logout',
        'language': 'العربية',
        'dark_mode': 'Dark Mode',
        'light_mode': 'Light Mode',
        'shopping_cart': 'Cart',
        'cart_items': 'items',
        'download_app': 'Download App',
        'help': 'Help',

        // Search & Filters
        'search_products': 'Search products...',
        'search': 'Search',
        'all': 'All',
        'category_all': 'All Products',
        'category_skincare': 'Skincare',
        'category_makeup': 'Makeup',
        'category_haircare': 'Hair Care',
        'category_perfumes': 'Perfumes',
        'category_makeup_tools': 'Makeup Tools',
        'exclusive_offer': 'Exclusive Offer',
        // Removed old category keys: 'makeup', 'skincare', 'perfumes', 'haircare', 'makeup_tools'

        // Product Actions
        'add_to_cart': 'Add to Cart',
        'buy_now': 'Buy Now',
        'view_details': 'View Details',
        'best_sellers': 'Best Sellers',
        'latest_products': 'The Essence of Beauty',
        'product_description': 'Product Description',
        'product_features': 'Features',
        'in_stock': 'In Stock',
        'reviews': 'reviews',

        // Cart
        'cart_title': 'Shopping Cart',
        'cart_empty': 'Your cart is empty',
        'subtotal': 'Subtotal',
        'total': 'Total',
        'checkout': 'Checkout',
        'continue_shopping': 'Continue Shopping',

        // Checkout
        'shipping_info': 'Shipping Information',
        'payment_method': 'Payment Method',
        'order_summary': 'Order Summary',
        'full_name': 'Full Name',
        'email': 'Email',
        'phone': 'Phone Number',
        'address': 'Address',
        'city': 'City',
        'postal': 'Postal Code',
        'cash_on_delivery': 'Cash on Delivery',
        'card_payment': 'Card Payment',
        'confirm_order': 'Confirm Order',
        'secure_payment': 'All transactions are secure and encrypted',
        'shipping': 'Shipping',
        'free': 'Free',
        'checkout_subtitle': 'Please fill in shipping information to complete your order',
        'full_address': 'Full Address',
        'cod_desc': 'Pay in cash upon delivery',
        'card_desc': 'Credit card or Mada (Coming Soon)',
        'secure_msg': 'All transactions are secure and encrypted',
        'copyright': 'Copyright © 2024 NAVITO',
        'close': 'Close',

        // Auth
        'welcome': 'Welcome to NAVITO',
        'marquee_msg': 'Free shipping on orders over 200 SAR • 100% Original Products • Limited time exclusive offers',
        'hero_title': 'Latest Beauty Trends',
        'login_subtitle': 'Login to continue',
        'password': 'Password',
        'remember_me': 'Remember me',
        'forgot_password': 'Forgot password?',
        'no_account': 'Don\'t have an account?',
        'create_account': 'Create Account',
        'have_account': 'Already have an account?',
        'register_title': 'Create New Account',
        'register_subtitle': 'Join us today',
        'confirm_password': 'Confirm Password',

        // Messages
        'added_to_cart': 'Added to cart',
        'order_success': 'Order received successfully!',
        'order_number': 'Order Number',

        // Common
        'quantity': 'Quantity',
        'price': 'Price',
        'category': 'Category',
        'product': 'Product',
        'image': 'Image',
        'description': 'Description',

        // Footer
        'footer_about': 'Learn More',
        'about_us': 'About Us',
        'contact_us': 'Contact Us',
        'sitemap': 'Sitemap',
        'buyer_services': 'Buyer Services',
        'search_products_footer': 'Search Products',
        'search_suppliers': 'Search Suppliers',
        'purchase_requests': 'Purchase Requests',
        'supplier_services': 'Supplier Services',
        'display_products': 'Display Products',
        'premium_membership': 'Premium Membership',
        'platform_description': 'Your premier destination for a unique and distinguished shopping experience in the world of beauty.',
        'copyright': 'Copyright © 2024 NAVITO. All rights reserved.',

        // Missing Keys for Dashboard & Sales
        'premium_insight': 'Professional Insight',
        'premium_tip': 'Pro Tip',
        'tip_text': 'Use sales analytics to identify the best times to launch promotional offers.',
        'premium_tip_text': 'True growth starts with data analysis. Make sure to review your customers\' preferences regularly to evolve your inventory.',
        'view_all': 'View All',
        'order_date': 'Order Date',
        'order_status': 'Order Status',
        'order_total': 'Order Total',
        'actions': 'Actions',
        'jan': 'Jan', 'feb': 'Feb', 'mar': 'Mar', 'apr': 'Apr', 'may': 'May', 'jun': 'Jun',
        'jul': 'Jul', 'aug': 'Aug', 'sep': 'Sep', 'oct': 'Oct', 'nov': 'Nov', 'dec': 'Dec',
        'all_orders': 'All Orders',
        'awaiting_processing': 'Awaiting Processing',
        'in_progress': 'In Progress',
        'delivered': 'Delivered',
        'sales_management': 'Sales & Orders Management',
        'total_orders': 'Total Orders',
        'pending': 'Pending',
        'processing': 'Processing',
        'completed': 'Completed',
        'mon': 'Mon', 'tue': 'Tue', 'wed': 'Wed', 'thu': 'Thu', 'fri': 'Fri', 'sat': 'Sat', 'sun': 'Sun',

        // Services & Footer (New)
        'fast_delivery': 'Fast Delivery',
        'fast_delivery_desc': 'Delivery to all regions in record time',
        'secure_payment_title': 'Secure Payment',
        'secure_payment_desc': 'Multiple and completely secure payment options',
        'return_policy': 'Return Policy',
        'return_policy_desc': 'Ability to return within 14 days',
        'support_24': '24/7 Support',
        'support_24_desc': 'A support team available to serve you always',
        'quick_links': 'Quick Links',
        'customer_service': 'Customer Service',
        'contact_info': 'Contact Info',
        'faq': 'FAQ',
        'shipping_policy': 'Shipping Policy',
        'footer_address': '📍 Casablanca, Morocco',
        'footer_email': '📧 info@navito.ma',
        'footer_phone': '📞 +212 522 00 00 00',
        'language_selection': 'Language',
        'theme_selection': 'Theme',

        // Order Details Modal & Admin Actions
        'order_details': '📋 Order Details',
        'account_info': '👤 Account Information',
        'details': 'Details',
        'customer_info': 'Customer Information',
        'customer_name_label': 'Name',
        'customer_email_label': 'Email',
        'customer_phone_label': 'Phone',
        'postal_code_label': 'Postal Code',
        'address_label': 'Address',
        'ordered_products': 'Products',
        'not_available': 'N/A',
        'save_product': 'Save Product',
        'update_product': 'Update Product',
        'edit_product_title': 'Edit Product',
        'add_product_title': 'Add New Product',
        'saving': 'Saving...',
        'confirm_delete': 'Are you sure you want to delete?',
        'delete_failed': 'Delete failed',
        'product_not_found': 'Product not found',
        'load_failed': 'Load failed',
        'save_error': 'An error occurred while saving',
        'no_products_available': 'No products available',
        'no_low_stock': 'Great! No low-stock products right now',
        'generate_sample': '✨ Generate Sample Products',
        'sample_created': '✅ Sample products created',
        'show_all': '🔄 Show All',
        'image_too_large': 'Image is too large. Maximum 500KB',
        'dark_mode_activated': 'Dark mode activated',
        'light_mode_activated': 'Light mode activated',
        'order_status_updated': 'Order status updated',
        'no_orders_to_export': 'No orders to export',
        'orders_exported': 'Orders exported successfully',
        'export_order_number': 'Order Number',
        'export_customer_name': 'Customer Name',
        'export_email': 'Email',
        'export_phone': 'Phone',
        'export_postal': 'Postal Code',
        'export_total': 'Total Amount',
        'export_status': 'Status',
        'export_date': 'Date',
        'export_address': 'Address',
        'free_shipping': 'Free',
        'product_saved': 'Product saved successfully',
        'product_deleted': 'Product deleted',
        'save_failed_prefix': 'Save failed: ',
        'no_products_to_show': 'No products to display',
        'please_login': 'Please login first to continue',
        'quick_buy_notice': 'Quick Buy (Single Item) - Not saved in cart',
        'empty_cart_msg': 'Your cart is empty. Browse products',
        'order_success_msg': 'Order placed successfully! Order number: ',
        'go_shopping': 'Browse Products',
        'shop_now': 'Shop Now',
        'discover_products': 'Discover Products',
        'discover_offers': 'Discover Offers',
        'offers_title': 'Navito Offers',
        'category_offers': 'Offers',
        'social_proof_watching': '24 people are watching this now',
        'social_proof_purchased': 'This product was purchased 120 times today',
        'offer_ends_in': 'Offer ends in:',
        'why_choose_us_title': 'Why Choose Navito?',
        'original_products': 'Original Products',
        'original_products_desc': '100% genuine guaranteed products',
        'track_order_btn': 'Track Order',
        'reviews_title': 'What Our Customers Say',
        'discount_popup_title': 'Get 10% OFF Just For You!',
        'discount_popup_desc': 'Join our newsletter today and receive exclusive offers and discounts.',
        'subscribe_btn': 'Get My Discount',
        'no_thanks': 'No thanks, I just want to shop',
        'bundle_1': '1 Piece',
        'bundle_2': '2 Pieces - Extra Discount',
        'bundle_3': '3 Pieces - Best Value',
        'limited_offer': 'Limited Time Offer 🔥',
        'free_delivery_today': 'Free shipping on all orders today only 🚚',
        'faq': 'FAQ',
        'about_us': 'About Us',
        'contact_us': 'Contact Us',
        'currency_sa': 'SAR',
        'currency_ma': 'MAD',
        'currency': 'MAD',
        'hero_title': 'Latest Beauty Trends',
        'hero_subtitle': 'Discover our exclusive collection of skincare and beauty products carefully selected for you.',
        'free_delivery_today': 'Free shipping to all Morocco for today only! 🚚',
        'shipping_calculating': 'Calculating shipping...',
        'shipping_sa': 'Fast Shipping to KSA',
        'shipping_ma': 'Delivery across Morocco',
        'total': 'Total',
        'details': 'Details',
        'empty_cart_msg': 'Your cart is empty',
        'quick_buy_notice': 'Quick Checkout',
        'quantity': 'Quantity',
        'order_success_msg': 'Order placed successfully! Order ID: ',
        'enter_order_id': 'Enter your order ID from email/SMS',
        'close': 'Close',
        'continue_shopping': 'Continue Shopping'
    }


};

let currentLang = localStorage.getItem('navito_language') || 'ar';
let currentCountry = localStorage.getItem('navito_country') || 'MA';
window.currentLang = currentLang;
window.currentCountry = currentCountry;

// Initial currency setup
translations.ar.currency = currentCountry === 'SA' ? 'ر.س' : 'MAD';
translations.en.currency = currentCountry === 'SA' ? 'SAR' : 'MAD';



// Toggle Country function
function toggleCountry() {
    currentCountry = currentCountry === 'SA' ? 'MA' : 'SA';
    localStorage.setItem('navito_country', currentCountry);
    window.currentCountry = currentCountry;
    
    // Update currency strings dynamically
    const saCurrency = currentLang === 'ar' ? 'ر.س' : 'SAR';
    const maCurrency = 'MAD';
    
    translations.ar.currency = currentCountry === 'SA' ? 'ر.س' : 'MAD';
    translations.en.currency = currentCountry === 'SA' ? 'SAR' : 'MAD';

    applyTranslations();
    
    // Update country labels if they exist
    const countryLabels = document.querySelectorAll('#country-text, #drawer-country-text');
    countryLabels.forEach(el => {
         el.textContent = translations[currentLang][`country_${currentCountry.toLowerCase()}`];
    });
    
    // Refresh all prices
    if (typeof renderProducts === 'function') renderProducts();
    if (typeof renderStoreProducts === 'function') {
         const p = window.allStoreProducts || [];
         if (p.length > 0) renderStoreProducts(p);
    }
    if (typeof renderCart === 'function') renderCart();
}
window.toggleCountry = toggleCountry;

// Translation function
function t(key) {
    try {
        const lang = window.currentLang || localStorage.getItem('navito_language') || 'ar';
        if (!translations[lang]) return key;
        return translations[lang][key] || key;
    } catch (e) {
        return key;
    }
}


// Apply translations to all elements with data-i18n attribute
function applyTranslations() {
    const lang = localStorage.getItem('navito_language') || 'ar';
    const elements = document.querySelectorAll('[data-i18n]');

    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (!key || !translations[lang]) return;
        const translation = translations[lang][key] || key;


        // Update text content or placeholder
        if (el.tagName === 'INPUT' && (el.type === 'text' || el.type === 'search' || el.type === 'tel' || el.type === 'email')) {
            el.placeholder = translation;
        } else if (el.tagName === 'TEXTAREA') {
            el.placeholder = translation;
        } else if (el.tagName === 'SELECT') {
             // Handle dropdown options if needed
        } else {
            el.textContent = translation;
        }
        
        // Specific handling for Admin category selection
        if (el.tagName === 'OPTION') {
            el.textContent = translation;
        }
    });

    // Correct Directional Logic
    const direction = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = direction;
    document.documentElement.lang = lang;
    document.body.dir = direction;

    // Update body fonts based on language
    const isEnglish = lang === 'en';
    if (isEnglish) {
        document.body.style.fontFamily = 'var(--font-english)';
    } else {
        document.body.style.fontFamily = 'var(--font-arabic)';
    }

    // Force font family update for admin body if needed
    if (document.body.classList.contains('admin-body')) {
        document.body.style.fontFamily = lang === 'ar' ? 'var(--font-arabic)' : 'var(--font-english)';
    }

    // Synchronize Country Labels
    const countryLabels = document.querySelectorAll('#country-text, #drawer-country-text');
    const currentCountry = localStorage.getItem('navito_country') || 'MA';
    countryLabels.forEach(el => {
         el.textContent = translations[lang][`country_${currentCountry.toLowerCase()}`];
    });

    // Mark as ready to show content (used by head script to prevent flash)
    document.documentElement.classList.add('i18n-ready');
}


// Toggle language function
let isTogglingLang = false;
function toggleLanguage() {
    // Guard against rapid double clicks/ghost clicks
    if (isTogglingLang) return;
    isTogglingLang = true;
    setTimeout(() => isTogglingLang = false, 400);

    const oldLang = localStorage.getItem('navito_language') || 'ar';
    const newLang = oldLang === 'ar' ? 'en' : 'ar';

    currentLang = newLang;
    localStorage.setItem('navito_language', newLang);
    window.currentLang = newLang;

    // Update language button text
    const langText = document.getElementById('lang-text');
    if (langText) {
        langText.textContent = t('language');
    }

    // Apply translations and directions
    applyTranslations();

    // Update theme text if exists
    updateThemeText();

    // Re-render dynamic content
    if (typeof renderProducts === 'function') {
        renderProducts();
    }
    
    // Refresh social proof
    if (typeof initSocialProof === 'function') {
        initSocialProof();
    }

    if (typeof renderStoreProducts === 'function') {
        const products = window.allStoreProducts || [];
        if (products.length > 0) {
            renderStoreProducts(products);
        }
    } else if (typeof renderProducts === 'function') {
        // Fallback for any legacy calls
        const products = window.allStoreProducts || [];
        if (products.length > 0) {
            renderProducts(products);
        }
    }

    // Re-render admin products grid (for products.html)
    if (typeof refreshProductsGrid === 'function') {
        refreshProductsGrid();
    }
    if (typeof renderCart === 'function') {
        renderCart();
    }
    if (typeof renderCheckoutPage === 'function') {
        renderCheckoutPage();
    }

    // Re-render orders if on sales/dashboard page
    if (typeof fetchOrders === 'function') {
        fetchOrders();
    }

    // Re-render chart if on dashboard
    if (typeof initDashboard === 'function' && document.getElementById('salesChart')) {
        initDashboard();
    }

    showToast(t(currentLang === 'en' ? 'switched_to_en' : 'switched_to_ar'), 'success');

    // Update Auth UI to refresh logout text
    if (typeof updateAuthUI === 'function') {
        updateAuthUI();
    }

    if (typeof updateDrawerUI === 'function') {
        updateDrawerUI();
    }
}

// Update theme text based on current state
function updateThemeText() {
    const isLight = document.documentElement.classList.contains('light-mode');
    const text = document.getElementById('theme-text');
    if (text) {
        text.textContent = isLight ? t('light_mode') : t('dark_mode');
    }
}

// Export functions
window.t = t;
window.toggleLanguage = toggleLanguage;
window.applyTranslations = applyTranslations;
window.currentLang = currentLang;

// Apply translations on page load
document.addEventListener('DOMContentLoaded', () => {
    window.currentLang = currentLang; // Make sure it's accessible
    applyTranslations();

    // Update language button
    const langText = document.getElementById('lang-text');
    if (langText) {
        langText.textContent = t('language');
    }

    updateThemeText();
});
