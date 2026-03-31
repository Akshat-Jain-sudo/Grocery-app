const express = require('express');
const cors = require('cors');
const path = require('path');

const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Middleware ───────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ─── Static Files ─────────────────────────────────────────
app.use(express.static(path.join(__dirname, '..', 'public')));

// ─── API Routes ───────────────────────────────────────────
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

// Categories endpoint (reuses product route's /meta/categories)
app.get('/api/categories', (req, res) => {
  const { products, categories } = require('./data/products');
  const enriched = categories.map(cat => ({
    ...cat,
    productCount: products.filter(p => p.category === cat.id).length
  }));
  res.json({ success: true, data: enriched });
});

// ─── SPA Fallback ─────────────────────────────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// ─── Error Handler ────────────────────────────────────────
app.use(errorHandler);

// ─── Start Server ─────────────────────────────────────────
app.listen(PORT, () => {
  console.log('');
  console.log('  ╔════════════════════════════════════════╗');
  console.log('  ║                                        ║');
  console.log('  ║   🛒  FreshCart Grocery App             ║');
  console.log('  ║                                        ║');
  console.log(`  ║   → http://localhost:${PORT}              ║`);
  console.log('  ║                                        ║');
  console.log('  ╚════════════════════════════════════════╝');
  console.log('');
});
