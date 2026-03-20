// Sample Products Script - 20 Luxury Beauty Products
const sampleProducts = [
    {
        id: "beauty1",
        name: "أحمر شفاه مات فاخر",
        nameEn: "Luxury Matte Lipstick",
        category: "مكياج",
        price: 29.99,
        image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800",
        images: [
            "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800",
            "https://images.unsplash.com/photo-1591360236630-fdd8b52a51b0?w=800",
            "https://images.unsplash.com/photo-1625006341243-0ac1f3ad62bc?w=800"
        ],
        description: "تركيبة مخملية تدوم طويلاً بألوان زاهية ومرطبة للشفاه.",
        descriptionEn: "Long-lasting velvety formula with vibrant colors and moisturizing effects.",
        features: ["منتج أصلي 100%", "يدوم لمدة 12 ساعة", "مرطب للشفاه", "توصيل سريع"],
        featuresEn: ["100% Original", "12h Long Lasting", "Moisturizing", "Fast Delivery"],
        stock: 50,
        rating: 4.8,
        reviews: 125
    },
    {
        id: "beauty2",
        name: "سيروم فيتامين سي المطور",
        nameEn: "Advanced Vitamin C Serum",
        category: "عناية بالبشرة",
        price: 45.00,
        image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800",
        images: [
            "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800",
            "https://images.unsplash.com/photo-1570194065650-d99fb4b8ccb0?w=800"
        ],
        description: "يمنح البشرة إشراقاً فورياً ويقلل من ظهور البقع الداكنة.",
        descriptionEn: "Gives the skin immediate radiance and reduces the appearance of dark spots.",
        features: ["بشرة مشرقة", "ضمان استرجاع 14 يوم", "طبيعي 100%"],
        featuresEn: ["Radiant Skin", "14-day Money Back", "100% Natural"],
        stock: 30,
        rating: 4.9,
        reviews: 89
    },
    {
        id: "beauty3",
        name: "عطر الياسمين الملكي",
        nameEn: "Royal Jasmine Perfume",
        category: "عطور",
        price: 89.00,
        image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800",
        description: "رائحة زهرية ساحرة تدوم طوال اليوم في زجاجة فاخرة.",
        descriptionEn: "A charming floral scent that lasts all day in a luxury bottle.",
        stock: 15,
        rating: 5.0,
        reviews: 210
    },
    {
        id: "beauty4",
        name: "باليت ظلال العيون الذهبية",
        nameEn: "Golden Eyeshadow Palette",
        category: "مكياج",
        price: 49.99,
        image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800",
        description: "18 لوناً من الدرجات الدافئة واللامعة لمظهر عيون مذهل.",
        stock: 60,
        rating: 4.7
    },
    {
        id: "beauty5",
        name: "كريم الترطيب العميق",
        nameEn: "Deep Hydration Cream",
        category: "عناية بالبشرة",
        price: 35.00,
        image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800",
        description: "غني بحمض الهيالورونيك والجلسرين لترطيب يدوم 24 ساعة.",
        stock: 40,
        rating: 4.8
    },
    {
        id: "beauty6",
        name: "ماسكارا الدراما السوداء",
        nameEn: "Black Drama Mascara",
        category: "مكياج",
        price: 24.00,
        image: "https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?w=800",
        description: "تمنح الرموش كثافة وطولاً درامياً دون تكتل.",
        stock: 75,
        rating: 4.6
    },
    {
        id: "beauty7",
        name: "شامبو الكيراتين المعالج",
        nameEn: "Keratin Repair Shampoo",
        category: "العناية بالشعر",
        price: 28.00,
        image: "https://images.unsplash.com/photo-1571875257727-256c39da42af?w=800",
        description: "يعيد بناء خصلات الشعر التالفة ويمنحها لمعاناً طبيعياً.",
        stock: 45,
        rating: 4.9
    },
    {
        id: "beauty8",
        name: "طقم فرش الاحترافي",
        nameEn: "Professional Brush Set",
        category: "أدوات المكياج",
        price: 65.00,
        image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800",
        description: "مجموعة من 12 فرشاة ناعمة لتطبيق المكياج بدقة احترافية.",
        stock: 30,
        rating: 5.0
    },
    {
        id: "beauty9",
        name: "كريم أساس التغطية الكاملة",
        nameEn: "Full Coverage Foundation",
        category: "مكياج",
        price: 39.00,
        image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800",
        description: "يخفي العيوب بشكل مثالي مع ملمس خفيف على البشرة.",
        stock: 55,
        rating: 4.5
    },
    {
        id: "beauty10",
        name: "زيت الأرغان للشعر",
        nameEn: "Argan Hair Oil",
        category: "العناية بالشعر",
        price: 22.00,
        image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800",
        description: "زيت نقي ١٠٠٪ لتغذية الشعر وحمايته من التقصف.",
        stock: 80,
        rating: 4.8
    },
    {
        id: "beauty11",
        name: "غسول الوجه اللطيف",
        nameEn: "Gentle Face Wash",
        category: "عناية بالبشرة",
        price: 18.00,
        image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800",
        description: "ينظف البشرة بعمق ويزيل الشوائب والمكياج بلطف.",
        stock: 68,
        rating: 4.2
    },
    {
        id: "beauty12",
        name: "مجموعة طلاء الأظافر الترند",
        nameEn: "Trendy Nail Polish Set",
        category: "أدوات المكياج",
        price: 32.00,
        image: "https://images.unsplash.com/photo-1610992015732-2449b76344bc?w=800",
        description: "١٠ ألوان عصرية سريعة الجفاف وثابتة.",
        stock: 82,
        rating: 4.1
    },
    {
        id: "beauty13",
        name: "هايلايتر باودر حريري",
        nameEn: "Silk Powder Highlighter",
        category: "مكياج",
        price: 26.00,
        image: "https://images.unsplash.com/photo-1599733594230-6b823276abcc?w=800",
        description: "يمنح البشرة توهجاً طبيعياً مكثفاً.",
        stock: 40,
        rating: 4.6
    },
    {
        id: "beauty14",
        name: "تونر ماء الورد الطبيعي",
        nameEn: "Natural Rose Water Toner",
        category: "عناية بالبشرة",
        price: 15.00,
        image: "https://images.unsplash.com/photo-1590156221170-eceef5ede05b?w=800",
        description: "لترطيب وتهدئة البشرة وتصغير المسام.",
        stock: 100,
        rating: 4.8
    },
    {
        id: "beauty15",
        name: "سيروم الريتنول الليلي",
        nameEn: "Night Retinol Serum",
        category: "عناية بالبشرة",
        price: 55.00,
        image: "https://images.unsplash.com/photo-1620917670397-dc7bc43e815e?w=800",
        description: "يحسن ملمس البشرة ويقلل الخطوط الدقيقة.",
        stock: 25,
        rating: 4.9
    },
    {
        id: "beauty16",
        name: "بخاخ تثبيت المكياج HD",
        nameEn: "HD Setting Spray",
        category: "مكياج",
        price: 21.00,
        image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800",
        description: "يضمن ثبات المكياج لساعات طويلة دون تلطخ.",
        stock: 50,
        rating: 4.5
    },
    {
        id: "beauty17",
        name: "بلسم اللحية الفاخر",
        nameEn: "Premium Beard Balm",
        category: "العناية بالشعر",
        price: 19.00,
        image: "https://images.unsplash.com/photo-1590439471364-192aa70c0b53?w=800",
        description: "يرطب ويصفف اللحية بعمق برائحة رجولية.",
        stock: 35,
        rating: 4.7
    },
    {
        id: "beauty18",
        name: "كريم اليدين المكثف",
        nameEn: "Intense Hand Cream",
        category: "عناية بالبشرة",
        price: 12.00,
        image: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=800",
        description: "يحمي الأيدي الجافة والمتشققة ويمتص بسرعة.",
        stock: 120,
        rating: 4.4
    },
    {
        id: "beauty19",
        name: "زيت الجسم اللامع",
        nameEn: "Shimmering Body Oil",
        category: "عناية بالبشرة",
        price: 38.00,
        image: "https://images.unsplash.com/photo-1552046122-03184de85e08?w=800",
        description: "يمنح البشرة بريقاً جذاباً وملمساً ناعماً كالحرير.",
        stock: 55,
        rating: 4.3
    },
    {
        id: "beauty20",
        name: "ملمع شفاه مرطب",
        nameEn: "Hydrating Lip Gloss",
        category: "مكياج",
        price: 16.00,
        image: "https://images.unsplash.com/photo-1596130111440-804368296518?w=800",
        description: "يمنح الشفاه مظهراً ممتلئاً وجذاباً مع لمعة فائقة.",
        stock: 80,
        rating: 4.6
    }
];

// Only add sample products if the store has less than the full sample set
const existingProducts = JSON.parse(localStorage.getItem('admin_products_prod_v1') || '[]');
if (existingProducts.length < 20) {
    // Merge or overwrite to ensure we have all 20
    localStorage.setItem('admin_products_prod_v1', JSON.stringify(sampleProducts));
    console.log('✅ تم تحديث وإضافة المنتجات الفاخرة الـ 20 بنجاح!');
} else {
    console.log('ℹ️ Products already exist in LocalStorage.');
}
