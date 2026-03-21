const { Product } = require('./db-adapter');

const products = [
    {
        name: "أحمر شفاه مات فاخر",
        nameEn: "Luxury Matte Lipstick",
        category: "مكياج",
        price: 29.99,
        image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400",
        description: "أحمر شفاه مات طويل الأمد بتركيبة غنية ومرطبة",
        descriptionEn: "Long-lasting matte lipstick with a rich, moisturizing formula",
        stock: 50,
        isActive: true,
        rating: 4.5
    },
    {
        name: "سيروم فيتامين سي",
        nameEn: "Vitamin C Serum",
        category: "عناية بالبشرة",
        price: 45.00,
        image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400",
        description: "سيروم مضاد للأكسدة يعمل على تفتيح البشرة وتوحيد لونها",
        descriptionEn: "Antioxidant serum that brightens skin and evens out tone",
        stock: 30,
        isActive: true,
        rating: 4.8
    },
    {
        name: "عطر عود الملكي",
        nameEn: "Royal Oud Perfume",
        category: "عطور",
        price: 120.00,
        image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400",
        description: "عطر فاخر برائحة العود الأصيل مع لمسات زهرية",
        descriptionEn: "Luxury fragrance with authentic oud scent and floral touches",
        stock: 15,
        isActive: true,
        rating: 4.9
    }
];

const importData = async () => {
    try {
        console.log('⏳ جاري إضافة البيانات إلى NeDB المحلية...');
        // حذف البيانات القديمة
        await Product.collection.remove({}, { multi: true });
        // إضافة البيانات الجديدة
        await Product.collection.insert(products);
        console.log('✅ تم إضافة المنتجات بنجاح إلى قاعدة البيانات المحلية!');
        process.exit();
    } catch (error) {
        console.error('❌ خطأ أثناء إضافة البيانات:', error);
        process.exit(1);
    }
};

importData();
