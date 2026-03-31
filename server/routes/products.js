const express = require('express');
const router = express.Router();
const { products, categories } = require('../data/products');
const { AppError } = require('../middleware/errorHandler');

// GET /api/products — list all products, with optional filters
router.get('/', (req, res) => {
  const { category, search, sort } = req.query;
  let filtered = [...products];

  // Filter by category
  if (category && category !== 'all') {
    filtered = filtered.filter(p => p.category === category);
  }

  // Search by name or description
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    );
  }

  // Sort
  if (sort === 'price_asc') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sort === 'price_desc') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sort === 'rating') {
    filtered.sort((a, b) => b.rating - a.rating);
  } else if (sort === 'name') {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  }

  res.json({
    success: true,
    count: filtered.length,
    data: filtered
  });
});

// GET /api/products/:id — get a single product
router.get('/:id', (req, res, next) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) {
    return next(new AppError('Product not found', 404));
  }
  res.json({ success: true, data: product });
});

// GET /api/categories — list all categories with product counts
router.get('/meta/categories', (req, res) => {
  const enriched = categories.map(cat => ({
    ...cat,
    productCount: products.filter(p => p.category === cat.id).length
  }));
  res.json({ success: true, data: enriched });
});

module.exports = router;
