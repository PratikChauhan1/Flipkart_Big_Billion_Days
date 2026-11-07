const express = require('express');
const router = express.Router();
const dataStore = require('../dataStore');
const { requireAdmin } = require('../middleware/auth');

// GET /api/products (Public with optional filters)
router.get('/', async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, sort } = req.query;
    const products = await dataStore.getAllProducts({ category, search, minPrice, maxPrice, sort });
    res.json({ success: true, count: products.length, products });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch products', error: err.message });
  }
});

// GET /api/products/:id (Public)
router.get('/:id', async (req, res) => {
  try {
    const product = await dataStore.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch product', error: err.message });
  }
});

// POST /api/products (Admin Only: Add new product)
router.post('/', requireAdmin, async (req, res) => {
  try {
    const { title, price, category, stock, image_url, description, brand, original_price } = req.body;

    if (!title || price === undefined) {
      return res.status(400).json({ success: false, message: 'Title and Price are required.' });
    }

    const created = await dataStore.createProduct({
      title,
      price: Number(price),
      original_price: Number(original_price || price),
      category: category || 'Electronics',
      stock: Number(stock !== undefined ? stock : 10),
      image_url: image_url || 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=800&q=80',
      description: description || '',
      brand: brand || 'Flipkart Assured'
    });

    res.status(201).json({ success: true, message: 'Product added successfully!', product: created });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to create product', error: err.message });
  }
});

// PUT /api/products/:id (Admin Only: Update product/stock)
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const updated = await dataStore.updateProduct(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, message: 'Product updated successfully!', product: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update product', error: err.message });
  }
});

// DELETE /api/products/:id (Admin Only: Delete product)
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const success = await dataStore.deleteProduct(req.params.id);
    if (!success) {
      return res.status(404).json({ success: false, message: 'Product not found or could not be deleted' });
    }
    res.json({ success: true, message: 'Product removed successfully!' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete product', error: err.message });
  }
});

module.exports = router;
