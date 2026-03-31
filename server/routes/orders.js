const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { products, cart, orders, resetCart } = require('../data/products');
const { AppError } = require('../middleware/errorHandler');

// POST /api/orders — place an order
router.post('/', (req, res, next) => {
  const { customerName, customerEmail, address, phone } = req.body;

  // Validation
  if (!customerName || !customerEmail || !address || !phone) {
    return next(new AppError('All customer details are required (name, email, address, phone)', 400));
  }

  if (cart.items.length === 0) {
    return next(new AppError('Cart is empty — add items before placing an order', 400));
  }

  // Build order items with product snapshots
  const orderItems = cart.items.map(item => {
    const product = products.find(p => p.id === item.productId);
    return {
      productId: item.productId,
      name: product.name,
      emoji: product.emoji,
      price: product.price,
      unit: product.unit,
      quantity: item.quantity,
      lineTotal: Math.round(product.price * item.quantity * 100) / 100
    };
  });

  const subtotal = orderItems.reduce((sum, item) => sum + item.lineTotal, 0);
  const deliveryFee = subtotal >= 25 ? 0 : 4.99;
  const total = Math.round((subtotal + deliveryFee) * 100) / 100;

  const order = {
    id: `ORD-${uuidv4().slice(0, 8).toUpperCase()}`,
    items: orderItems,
    subtotal: Math.round(subtotal * 100) / 100,
    deliveryFee,
    total,
    status: 'confirmed',
    customerName,
    customerEmail,
    address,
    phone,
    createdAt: new Date().toISOString(),
    estimatedDelivery: new Date(Date.now() + 45 * 60000).toISOString() // 45 min
  };

  orders.push(order);
  resetCart();

  res.status(201).json({
    success: true,
    message: 'Order placed successfully!',
    data: order
  });
});

// GET /api/orders — list all orders
router.get('/', (req, res) => {
  const sorted = [...orders].sort((a, b) =>
    new Date(b.createdAt) - new Date(a.createdAt)
  );

  res.json({
    success: true,
    count: sorted.length,
    data: sorted
  });
});

// GET /api/orders/:id — get order details
router.get('/:id', (req, res, next) => {
  const order = orders.find(o => o.id === req.params.id);
  if (!order) {
    return next(new AppError('Order not found', 404));
  }
  res.json({ success: true, data: order });
});

module.exports = router;
