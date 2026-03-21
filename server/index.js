const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const path = require('path');

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// Static Files (Frontend)
app.use(express.static(path.join(__dirname, '../public')));

// Database Connection
// Database Connection (Optional in Hybrid Mode)
if (process.env.MONGODB_URI && process.env.MONGODB_URI !== 'mongodb://localhost:27017/navito_db') {
    mongoose.connect(process.env.MONGODB_URI)
        .then(() => console.log('✅ Connected to MongoDB (Cloud)'))
        .catch(err => console.log('ℹ️ Using Local NeDB (MongoDB connection failed)'));
} else {
    console.log('ℹ️ Running in Local Hybrid mode (NeDB enabled)');
}

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));

// Basic Route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to NAVITO API v1.0' });
});

// Run Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
