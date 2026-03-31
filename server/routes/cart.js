const express = require('express');
const router = express.Router();
const { products, cart } = require('../data/products');
const { AppError } = require('../middleware/errorHandler');

// Helper: populate cart items with product details
function getPopulatedCart() {
  const populatedItems = cart.items.map(item => {
    const product = products.find(p => p.id === item.productId);
    return {
      ...item,
      product: product || null
    };
  }).filter(item => item.product !== null);

  const subtotal = populatedItems.reduce((sum, item) => {
    return sum + (item.product.price * item.quantity);
  }, 0);

  const deliveryFee = subtotal > 0 ? (subtotal >= 25 ? 0 : 4.99) : 0;

  return {
    items: populatedItems,
    itemCount: populatedItems.reduce((sum, item) => sum + item.quantity, 0),
    subtotal: Math.round(subtotal * 100) / 100,
    deliveryFee,
    total: Math.round((subtotal + deliveryFee) * 100) / 100,
    freeDeliveryThreshold: 25,
    updatedAt: cart.updatedAt
  };
}

// GET /api/cart — get cart contents
router.get('/', (req, res) => {
  res.json({ success: true, data: getPopulatedCart() });
});

// POST /api/cart — add item to cart
router.post('/', (req, res, next) => {
  const { productId, quantity = 1 } = req.body;

  if (!productId) {
    return next(new AppError('Product ID is required', 400));
  }

  const product = products.find(p => p.id === productId);
  if (!product) {
    return next(new AppError('Product not found', 404));
  }

  if (!product.inStock) {
    return next(new AppError('Product is out of stock', 400));
  }

  const existingItem = cart.items.find(item => item.productId === productId);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({ productId, quantity });
  }

  cart.updatedAt = new Date().toISOString();

  res.status(201).json({
    success: true,
    message: `${product.name} added to cart`,
    data: getPopulatedCart()
  });
});

// PUT /api/cart/:productId — update quantity
router.put('/:productId', (req, res, next) => {
  const { quantity } = req.body;
  const { productId } = req.params;

  if (quantity === undefined || quantity < 0) {
    return next(new AppError('Valid quantity is required', 400));
  }

  const itemIndex = cart.items.findIndex(item => item.productId === productId);

  if (itemIndex === -1) {
    return next(new AppError('Item not found in cart', 404));
  }

  if (quantity === 0) {
    cart.items.splice(itemIndex, 1);
  } else {
    cart.items[itemIndex].quantity = quantity;
  }

  cart.updatedAt = new Date().toISOString();

  res.json({
    success: true,
    message: 'Cart updated',
    data: getPopulatedCart()
  });
});

// DELETE /api/cart/:productId — remove item
router.delete('/:productId', (req, res, next) => {
  const { productId } = req.params;
  const itemIndex = cart.items.findIndex(item => item.productId === productId);

  if (itemIndex === -1) {
    return next(new AppError('Item not found in cart', 404));
  }

  const product = products.find(p => p.id === productId);
  cart.items.splice(itemIndex, 1);
  cart.updatedAt = new Date().toISOString();

  res.json({
    success: true,
    message: `${product?.name || 'Item'} removed from cart`,
    data: getPopulatedCart()
  });
});

// DELETE /api/cart — clear entire cart
router.delete('/', (req, res) => {
  cart.items = [];
  cart.updatedAt = new Date().toISOString();

  res.json({
    success: true,
    message: 'Cart cleared',
    data: getPopulatedCart()
  });
});

module.exports = router;
