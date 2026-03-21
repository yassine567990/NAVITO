const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
            name: String,
            price: Number,
            quantity: { type: Number, required: true },
            image: String
        }
    ],
    totalAmount: { type: Number, required: true },
    shippingAddress: {
        fullname: String,
        address: String,
        city: String,
        postal: String,
        phone: String
    },
    paymentMethod: { type: String, default: 'Cash on Delivery' },
    paymentStatus: { type: String, enum: ['Pending', 'Completed', 'Failed'], default: 'Pending' },
    status: { type: String, enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'], default: 'Pending' },
    orderId: { type: String, unique: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
