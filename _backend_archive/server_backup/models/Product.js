const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    nameEn: { type: String },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    images: [{ type: String }],
    description: { type: String },
    descriptionEn: { type: String },
    features: [{ type: String }],
    featuresEn: [{ type: String }],
    stock: { type: Number, default: 0 },
    rating: { type: Number, default: 4.5 },
    reviews: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);
