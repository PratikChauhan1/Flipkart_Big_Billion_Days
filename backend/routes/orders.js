const express = require('express');
const router = express.Router();
const dataStore = require('../dataStore');
const orderQueue = require('../orderQueue');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Connect orderQueue with dataStore processor
orderQueue.setDbHandler(dataStore);

// POST /api/orders (Enqueue order for processing - Big Billion Day style)
router.post('/', async (req, res) => {
  try {
    const { items, customer_name, customer_email, customer_phone, shipping_address, total_amount, payment_method, user_id } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty. Please add items.' });
    }

    if (!customer_name || !customer_email || !shipping_address) {
      return res.status(400).json({ success: false, message: 'Customer name, email and shipping address are required.' });
    }

    // Place in high-concurrency order queue
    const queueResponse = orderQueue.enqueue({
      items,
      customer_name,
      customer_email,
      customer_phone,
      shipping_address,
      total_amount,
      payment_method: payment_method || 'Cash on Delivery (Big Billion Pay)',
      user_id: user_id || null
    });

    return res.status(202).json({
      success: true,
      message: 'Order added to Big Billion Day processing queue!',
      data: queueResponse
    });
  } catch (err) {
    console.error('Order queue error:', err);
    res.status(500).json({ success: false, message: 'Failed to process order', error: err.message });
  }
});

// GET /api/orders/queue/:id (Check status of an enqueued order)
router.get('/queue/:id', (req, res) => {
  const status = orderQueue.getJobStatus(req.params.id);
  if (!status) {
    return res.status(404).json({ success: false, message: 'Queue item not found' });
  }
  res.json({ success: true, data: status });
});

// GET /api/orders/queue-stats (Queue performance & active queue monitor)
router.get('/queue-stats', (req, res) => {
  const stats = orderQueue.getStats();
  res.json({ success: true, stats });
});

// GET /api/orders/my-orders (User orders)
router.get('/my-orders', async (req, res) => {
  try {
    const { user_id, email } = req.query;
    if (!user_id && !email) {
      return res.status(400).json({ success: false, message: 'user_id or email is required' });
    }
    const orders = await dataStore.getOrdersByUser(user_id, email);
    res.json({ success: true, count: orders.length, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch user orders', error: err.message });
  }
});

// GET /api/orders/admin/all (Admin only: view all orders)
router.get('/admin/all', requireAdmin, async (req, res) => {
  try {
    const orders = await dataStore.getAllOrders();
    res.json({ success: true, count: orders.length, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch all orders', error: err.message });
  }
});

// PUT /api/orders/admin/:id/status (Admin only: update order status)
router.put('/admin/:id/status', requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['QUEUED', 'PROCESSING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, message: `Invalid status. Must be one of: ${allowed.join(', ')}` });
    }

    const updated = await dataStore.updateOrderStatus(req.params.id, status);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.json({ success: true, message: `Order status updated to ${status}`, order: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update order status', error: err.message });
  }
});

// POST /api/orders/simulate-burst (Simulate 5-10 concurrent user orders for testing the queue)
router.post('/simulate-burst', async (req, res) => {
  try {
    const count = Number(req.body.count) || 5;
    const sampleNames = ['Amit Kumar', 'Pooja Verma', 'Vikram Singh', 'Neha Patel', 'Arjun Mehta', 'Sneha Roy'];
    const products = await dataStore.getAllProducts();

    if (products.length === 0) {
      return res.status(400).json({ success: false, message: 'No products available for simulation' });
    }

    const results = [];
    for (let i = 0; i < count; i++) {
      const randomProd = products[Math.floor(Math.random() * products.length)];
      const name = sampleNames[i % sampleNames.length];
      const enqueued = orderQueue.enqueue({
        customer_name: `${name} (Bot #${i+1})`,
        customer_email: `bot${i+1}@rush.flipkart.com`,
        customer_phone: '9876543210',
        shipping_address: `${100 + i}, Tech Park, Bengaluru, Karnataka`,
        total_amount: randomProd.price,
        items: [{
          id: randomProd.id,
          productId: randomProd.id,
          title: randomProd.title,
          price: randomProd.price,
          quantity: 1,
          image_url: randomProd.image_url
        }]
      });
      results.push(enqueued);
    }

    res.json({
      success: true,
      message: `Enqueued ${count} concurrent Big Billion Day rush orders successfully! Watch the queue worker process them.`,
      queueStats: orderQueue.getStats(),
      orders: results
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Simulation error', error: err.message });
  }
});

module.exports = router;
