require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const { supabaseUrl } = require('./supabase');
const orderQueue = require('./orderQueue');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({
  origin: '*', // Allow frontend development and deployment origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(morgan('dev'));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Health Check & Supabase Status
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'Flipkart Big Billion Days API',
    supabaseUrl: supabaseUrl,
    timestamp: new Date().toISOString(),
    queueStats: orderQueue.getStats()
  });
});

// Welcome root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Flipkart Big Billion Days API is running 🚀',
    endpoints: {
      auth: '/api/auth (login, register, me)',
      products: '/api/products (list, filter, add, update, delete)',
      orders: '/api/orders (queue checkout, order history, admin management)',
      health: '/api/health'
    }
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({ success: false, message: 'Internal Server Error', error: err.message });
});

app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 Flipkart Backend running on http://localhost:${PORT}`);
  console.log(`📦 Supabase connected to: ${supabaseUrl}`);
  console.log(`⚡ Big Billion Day Order Queue System is ACTIVE`);
  console.log(`======================================================\n`);
});
