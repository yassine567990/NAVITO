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
const publicPath = path.join(__dirname, '../public');
app.use(express.static(publicPath));
console.log(`ℹ️ Serving static files from: ${publicPath}`);

// Database Connection
// Database Connection (Optional in Hybrid Mode)
if (process.env.MONGODB_URI && process.env.MONGODB_URI !== 'mongodb://localhost:27017/navito_db') {
    mongoose.connect(process.env.MONGODB_URI)
        .then(() => console.log('✅ Connected to MongoDB (Cloud)'))
        .catch(err => {
            console.error('❌ MongoDB Connection Error:', err.message);
            console.log('ℹ️ Using Local NeDB (Fallback enabled)');
        });
} else {
    console.log('ℹ️ Running in Local Hybrid mode (NeDB enabled)');
}

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));

// Basic Route - Serve index.html as the entry point
app.get('/', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
});

// JSON fallback for API testing (accessible via /api)
app.get('/api', (req, res) => {
    res.json({ message: 'Welcome to NAVITO API v1.0' });
});

// Catch-all route to serve index.html for any SPA-like subpaths (optional but good practice)
app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
        res.sendFile(path.join(publicPath, 'index.html'));
    } else {
        res.status(404).json({ message: 'API route not found' });
    }
});

// Run Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
