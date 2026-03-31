// ═══════════════════════════════════════════════════════════
// FreshCart — API Client
// ═══════════════════════════════════════════════════════════

const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
// Change the URL below when your backend is deployed on Render
const API_BASE = isLocal 
  ? 'http://localhost:3000/api' 
  : 'https://your-backend-service-name.onrender.com/api';

const API = {
  // ─── Products ──────────────────────────────────────────
  async getProducts(params = {}) {
    const query = new URLSearchParams();
    if (params.category && params.category !== 'all') query.set('category', params.category);
    if (params.search) query.set('search', params.search);
    if (params.sort) query.set('sort', params.sort);
    const qs = query.toString();
    const res = await fetch(`${API_BASE}/products${qs ? '?' + qs : ''}`);
    return res.json();
  },

  async getProduct(id) {
    const res = await fetch(`${API_BASE}/products/${id}`);
    return res.json();
  },

  async getCategories() {
    const res = await fetch(`${API_BASE}/categories`);
    return res.json();
  },

  // ─── Cart ──────────────────────────────────────────────
  async getCart() {
    const res = await fetch(`${API_BASE}/cart`);
    return res.json();
  },

  async addToCart(productId, quantity = 1) {
    const res = await fetch(`${API_BASE}/cart`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, quantity })
    });
    return res.json();
  },

  async updateCartItem(productId, quantity) {
    const res = await fetch(`${API_BASE}/cart/${productId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity })
    });
    return res.json();
  },

  async removeFromCart(productId) {
    const res = await fetch(`${API_BASE}/cart/${productId}`, {
      method: 'DELETE'
    });
    return res.json();
  },

  async clearCart() {
    const res = await fetch(`${API_BASE}/cart`, {
      method: 'DELETE'
    });
    return res.json();
  },

  // ─── Orders ────────────────────────────────────────────
  async placeOrder(orderData) {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    return res.json();
  },

  async getOrders() {
    const res = await fetch(`${API_BASE}/orders`);
    return res.json();
  },

  async getOrder(id) {
    const res = await fetch(`${API_BASE}/orders/${id}`);
    return res.json();
  }
};
