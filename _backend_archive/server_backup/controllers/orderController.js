const { Order } = require('../db-adapter');

// @desc    Create new order
// @route   POST /api/orders
exports.addOrderItems = async (req, res) => {
    const { orderItems, shippingAddress, paymentMethod, totalAmount } = req.body;

    if (orderItems && orderItems.length === 0) {
        res.status(400).json({ message: 'No order items' });
        return;
    } else {
        const order = new Order({
            user: req.user._id,
            items: orderItems,
            shippingAddress,
            paymentMethod,
            totalAmount,
            orderId: 'NAV-' + Math.random().toString(36).substr(2, 9).toUpperCase()
        });

        const createdOrder = await order.save();
        res.status(201).json(createdOrder);
    }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
exports.getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'fullname email');
        if (order) {
            res.json(order);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all orders (Admin only)
// @route   GET /api/orders
exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).populate('user', 'id fullname');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
