// ═══════════════════════════════════════════════════════════
// FreshCart — State Store (Cart + Toast)
// ═══════════════════════════════════════════════════════════

const Store = {
  cart: null,
  listeners: [],

  // ─── Subscribe & Notify ────────────────────────────────
  subscribe(fn) {
    this.listeners.push(fn);
    return () => { this.listeners = this.listeners.filter(l => l !== fn); };
  },

  notify() {
    this.listeners.forEach(fn => fn(this.cart));
  },

  // ─── Cart Operations ──────────────────────────────────
  async loadCart() {
    const res = await API.getCart();
    if (res.success) {
      this.cart = res.data;
      this.notify();
    }
    return this.cart;
  },

  async addToCart(productId) {
    const res = await API.addToCart(productId, 1);
    if (res.success) {
      this.cart = res.data;
      this.notify();
      Toast.show(res.message, 'success');
    } else {
      Toast.show(res.error || 'Failed to add item', 'error');
    }
    return res;
  },

  async updateQuantity(productId, quantity) {
    const res = await API.updateCartItem(productId, quantity);
    if (res.success) {
      this.cart = res.data;
      this.notify();
    }
    return res;
  },

  async removeItem(productId) {
    const res = await API.removeFromCart(productId);
    if (res.success) {
      this.cart = res.data;
      this.notify();
      Toast.show(res.message, 'info');
    }
    return res;
  },

  async clearCart() {
    const res = await API.clearCart();
    if (res.success) {
      this.cart = res.data;
      this.notify();
    }
    return res;
  },

  getItemCount() {
    return this.cart ? this.cart.itemCount : 0;
  }
};

// ─── Toast System ────────────────────────────────────────
const Toast = {
  container: null,

  init() {
    this.container = document.getElementById('toast-container');
  },

  show(message, type = 'info', duration = 3000) {
    if (!this.container) this.init();

    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    
    const icons = { success: '✅', error: '❌', info: 'ℹ️' };
    toast.innerHTML = `<span>${icons[type] || 'ℹ️'}</span><span>${message}</span>`;

    this.container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('toast-exit');
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }
};
