// ═══════════════════════════════════════════════════════════
// FreshCart — Main Application (Router + Pages + Components)
// ═══════════════════════════════════════════════════════════

(function () {
  'use strict';

  const $app = document.getElementById('app');
  const $badge = document.getElementById('cart-badge');
  const $menuBtn = document.getElementById('mobile-menu-btn');
  const $nav = document.getElementById('main-nav');

  let currentPage = '';
  let categoriesCache = null;

  // ═══════════════════════════════════════════════════════
  // HELPERS
  // ═══════════════════════════════════════════════════════

  function renderStars(rating) {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5 ? 1 : 0;
    const empty = 5 - full - half;
    return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);
  }

  function formatPrice(price) {
    return '$' + price.toFixed(2);
  }

  function getDiscountPercent(original, current) {
    if (!original || original <= current) return 0;
    return Math.round(((original - current) / original) * 100);
  }

  function debounce(fn, ms) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), ms);
    };
  }

  // ═══════════════════════════════════════════════════════
  // CART BADGE
  // ═══════════════════════════════════════════════════════

  function updateBadge() {
    const count = Store.getItemCount();
    if (count > 0) {
      $badge.textContent = count;
      $badge.style.display = 'flex';
    } else {
      $badge.style.display = 'none';
    }
  }

  Store.subscribe(updateBadge);

  // ═══════════════════════════════════════════════════════
  // MOBILE MENU
  // ═══════════════════════════════════════════════════════

  $menuBtn.addEventListener('click', () => {
    $menuBtn.classList.toggle('active');
    $nav.classList.toggle('open');
  });

  // Close menu on nav link click
  $nav.addEventListener('click', (e) => {
    if (e.target.classList.contains('nav-link')) {
      $menuBtn.classList.remove('active');
      $nav.classList.remove('open');
    }
  });

  // ═══════════════════════════════════════════════════════
  // ROUTER
  // ═══════════════════════════════════════════════════════

  function getRoute() {
    const hash = window.location.hash || '#/';
    const [path, queryString] = hash.slice(1).split('?');
    const params = new URLSearchParams(queryString || '');
    return { path: path || '/', params };
  }

  function setActiveNav(page) {
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.toggle('active', link.dataset.page === page);
    });
  }

  async function router() {
    const { path, params } = getRoute();
    let page = 'home';

    if (path === '/' || path === '/home') {
      page = 'home';
      await renderHomePage();
    } else if (path === '/products') {
      page = 'products';
      await renderProductsPage(params);
    } else if (path === '/cart') {
      page = 'cart';
      await renderCartPage();
    } else if (path === '/checkout') {
      page = 'checkout';
      await renderCheckoutPage();
    } else if (path.startsWith('/order/')) {
      page = 'cart';
      const orderId = path.split('/order/')[1];
      await renderOrderConfirmation(orderId);
    } else {
      page = 'home';
      await renderHomePage();
    }

    currentPage = page;
    setActiveNav(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  window.addEventListener('hashchange', router);

  // ═══════════════════════════════════════════════════════
  // COMPONENT: Product Card
  // ═══════════════════════════════════════════════════════

  function ProductCard(product) {
    const discount = getDiscountPercent(product.originalPrice, product.price);
    const badgeHTML = !product.inStock
      ? '<span class="product-card__badge product-card__badge--out">Out of Stock</span>'
      : discount > 0
      ? `<span class="product-card__badge product-card__badge--sale">${discount}% OFF</span>`
      : '';

    return `
      <div class="product-card" data-product-id="${product.id}">
        <div class="product-card__image">
          ${badgeHTML}
          <span class="product-card__emoji">${product.emoji}</span>
        </div>
        <div class="product-card__body">
          <span class="product-card__category">${product.category}</span>
          <h3 class="product-card__name">${product.name}</h3>
          <p class="product-card__description">${product.description}</p>
          <div class="product-card__rating">
            <span class="product-card__stars">${renderStars(product.rating)}</span>
            <span class="product-card__review-count">(${product.reviewCount})</span>
          </div>
          <div class="product-card__footer">
            <div class="product-card__price">
              <span class="product-card__price-current">${formatPrice(product.price)}</span>
              ${product.originalPrice ? `<span class="product-card__price-original">${formatPrice(product.originalPrice)}</span>` : ''}
              <span class="product-card__unit">${product.unit}</span>
            </div>
            <button 
              class="product-card__add-btn" 
              data-add-to-cart="${product.id}"
              ${!product.inStock ? 'disabled' : ''}
              title="${product.inStock ? 'Add to Cart' : 'Out of Stock'}"
            >+</button>
          </div>
        </div>
      </div>
    `;
  }

  // ═══════════════════════════════════════════════════════
  // PAGE: Home
  // ═══════════════════════════════════════════════════════

  async function renderHomePage() {
    // Load categories if not cached
    if (!categoriesCache) {
      const catRes = await API.getCategories();
      if (catRes.success) categoriesCache = catRes.data;
    }

    // Load popular products (top rated)
    const prodRes = await API.getProducts({ sort: 'rating' });
    const popular = prodRes.success ? prodRes.data.slice(0, 8) : [];

    $app.innerHTML = `
      <div class="page-enter">
        <!-- Hero Section -->
        <section class="hero">
          <div class="container">
            <div class="hero__content">
              <div class="hero__badge">🌿 Farm Fresh • Free delivery over $25</div>
              <h1 class="hero__title">
                Fresh Groceries,<br>
                <span class="highlight">Delivered Fast</span>
              </h1>
              <p class="hero__description">
                Browse premium fruits, vegetables, dairy, bakery, and more — all handpicked 
                for quality and delivered to your door within 45 minutes.
              </p>
              <div class="hero__actions">
                <a href="#/products" class="btn btn-primary btn-lg" id="hero-shop-btn">
                  🛒 Shop Now
                </a>
                <a href="#/products?category=fruits" class="btn btn-secondary btn-lg" id="hero-explore-btn">
                  Explore Categories →
                </a>
              </div>
              <div class="hero__stats">
                <div class="hero__stat">
                  <div class="hero__stat-value">38+</div>
                  <div class="hero__stat-label">Products</div>
                </div>
                <div class="hero__stat">
                  <div class="hero__stat-value">6</div>
                  <div class="hero__stat-label">Categories</div>
                </div>
                <div class="hero__stat">
                  <div class="hero__stat-value">45min</div>
                  <div class="hero__stat-label">Delivery</div>
                </div>
              </div>
            </div>
          </div>
          <div class="hero__emojis">
            <span class="hero__emoji-float">🍎</span>
            <span class="hero__emoji-float">🥦</span>
            <span class="hero__emoji-float">🥛</span>
            <span class="hero__emoji-float">🍞</span>
            <span class="hero__emoji-float">☕</span>
            <span class="hero__emoji-float">🍪</span>
            <span class="hero__emoji-float">🍓</span>
            <span class="hero__emoji-float">🧀</span>
            <span class="hero__emoji-float">🥕</span>
          </div>
        </section>

        <!-- Categories -->
        <section class="section">
          <div class="container">
            <div class="section__header">
              <h2 class="section__title">Shop by Category</h2>
              <p class="section__subtitle">Find exactly what you need from our curated collection</p>
            </div>
            <div class="categories-grid" id="categories-grid">
              ${(categoriesCache || []).map(cat => `
                <a href="#/products?category=${cat.id}" class="category-card" style="--cat-color: ${cat.color}">
                  <span class="category-card__emoji">${cat.emoji}</span>
                  <div class="category-card__name">${cat.name}</div>
                  <div class="category-card__count">${cat.productCount} items</div>
                </a>
              `).join('')}
            </div>
          </div>
        </section>

        <!-- Popular Products -->
        <section class="section" style="background: var(--bg-primary);">
          <div class="container">
            <div class="section__header">
              <h2 class="section__title">Popular Products</h2>
              <p class="section__subtitle">Top-rated items loved by our customers</p>
            </div>
            <div class="products-grid" id="popular-products">
              ${popular.map(ProductCard).join('')}
            </div>
            <div style="text-align: center; margin-top: var(--space-2xl);">
              <a href="#/products" class="btn btn-secondary btn-lg" id="view-all-btn">View All Products →</a>
            </div>
          </div>
        </section>

        <!-- Features -->
        <section class="section">
          <div class="container">
            <div class="section__header">
              <h2 class="section__title">Why Choose FreshCart?</h2>
              <p class="section__subtitle">We're committed to quality, speed, and convenience</p>
            </div>
            <div class="features-grid">
              <div class="feature-card">
                <span class="feature-card__icon">🚀</span>
                <h3 class="feature-card__title">Fast Delivery</h3>
                <p class="feature-card__text">Get your groceries delivered in under 45 minutes, right to your doorstep.</p>
              </div>
              <div class="feature-card">
                <span class="feature-card__icon">🌿</span>
                <h3 class="feature-card__title">Farm Fresh</h3>
                <p class="feature-card__text">Direct from local farms to your table — always fresh, always quality.</p>
              </div>
              <div class="feature-card">
                <span class="feature-card__icon">💰</span>
                <h3 class="feature-card__title">Best Prices</h3>
                <p class="feature-card__text">Competitive pricing with regular deals and free delivery over $25.</p>
              </div>
              <div class="feature-card">
                <span class="feature-card__icon">🔒</span>
                <h3 class="feature-card__title">Secure Checkout</h3>
                <p class="feature-card__text">Your data is safe. Hassle-free ordering with easy returns.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    `;

    bindAddToCartButtons();
  }

  // ═══════════════════════════════════════════════════════
  // PAGE: Products
  // ═══════════════════════════════════════════════════════

  async function renderProductsPage(params) {
    const activeCategory = params.get('category') || 'all';

    // Load categories
    if (!categoriesCache) {
      const catRes = await API.getCategories();
      if (catRes.success) categoriesCache = catRes.data;
    }

    // Load products
    const prodRes = await API.getProducts({
      category: activeCategory !== 'all' ? activeCategory : undefined
    });
    const products = prodRes.success ? prodRes.data : [];

    $app.innerHTML = `
      <div class="page-enter">
        <section class="section" style="padding-top: var(--space-2xl);">
          <div class="container">
            <div class="section__header" style="text-align: left; margin-bottom: var(--space-xl);">
              <h1 class="section__title" style="font-size: 2rem;">
                ${activeCategory !== 'all' 
                  ? (categoriesCache?.find(c => c.id === activeCategory)?.name || 'Products')
                  : 'All Products'}
              </h1>
              <p class="section__subtitle" style="margin: 0; font-size: 0.95rem;">
                ${products.length} items available
              </p>
            </div>

            <!-- Filters -->
            <div class="filters-bar" id="filters-bar">
              <div class="search-wrapper">
                <input 
                  type="text" 
                  class="search-input" 
                  id="search-input" 
                  placeholder="Search products..."
                  autocomplete="off"
                >
              </div>
              <div class="filter-pills" id="filter-pills">
                <button class="filter-pill ${activeCategory === 'all' ? 'active' : ''}" data-category="all">All</button>
                ${(categoriesCache || []).map(cat => `
                  <button class="filter-pill ${activeCategory === cat.id ? 'active' : ''}" data-category="${cat.id}">
                    ${cat.emoji} ${cat.name}
                  </button>
                `).join('')}
              </div>
              <select class="sort-select" id="sort-select">
                <option value="">Sort by</option>
                <option value="rating">⭐ Top Rated</option>
                <option value="price_asc">💰 Price: Low → High</option>
                <option value="price_desc">💰 Price: High → Low</option>
                <option value="name">🔤 Name A-Z</option>
              </select>
            </div>

            <!-- Product Grid -->
            <div class="products-grid" id="products-grid">
              ${products.length > 0 
                ? products.map(ProductCard).join('')
                : `<div class="no-results">
                     <div class="no-results__icon">🔍</div>
                     <p class="no-results__text">No products found in this category.</p>
                   </div>`}
            </div>
          </div>
        </section>
      </div>
    `;

    bindAddToCartButtons();
    bindProductFilters();
  }

  function bindProductFilters() {
    // Category pills
    const pillContainer = document.getElementById('filter-pills');
    if (pillContainer) {
      pillContainer.addEventListener('click', (e) => {
        const pill = e.target.closest('.filter-pill');
        if (!pill) return;
        const category = pill.dataset.category;
        window.location.hash = category === 'all' ? '#/products' : `#/products?category=${category}`;
      });
    }

    // Search
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      const doSearch = debounce(async (value) => {
        const { params } = getRoute();
        const category = params.get('category') || 'all';
        const sort = document.getElementById('sort-select')?.value || '';

        const res = await API.getProducts({
          category: category !== 'all' ? category : undefined,
          search: value || undefined,
          sort: sort || undefined
        });

        const grid = document.getElementById('products-grid');
        if (grid && res.success) {
          if (res.data.length > 0) {
            grid.innerHTML = res.data.map(ProductCard).join('');
          } else {
            grid.innerHTML = `
              <div class="no-results">
                <div class="no-results__icon">🔍</div>
                <p class="no-results__text">No products match "${value}"</p>
              </div>`;
          }
          bindAddToCartButtons();
        }
      }, 300);

      searchInput.addEventListener('input', (e) => doSearch(e.target.value));
    }

    // Sort
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
      sortSelect.addEventListener('change', async (e) => {
        const { params } = getRoute();
        const category = params.get('category') || 'all';
        const search = document.getElementById('search-input')?.value || '';

        const res = await API.getProducts({
          category: category !== 'all' ? category : undefined,
          search: search || undefined,
          sort: e.target.value || undefined
        });

        const grid = document.getElementById('products-grid');
        if (grid && res.success) {
          grid.innerHTML = res.data.length > 0
            ? res.data.map(ProductCard).join('')
            : `<div class="no-results"><div class="no-results__icon">🔍</div><p class="no-results__text">No results found.</p></div>`;
          bindAddToCartButtons();
        }
      });
    }
  }

  // ═══════════════════════════════════════════════════════
  // PAGE: Cart
  // ═══════════════════════════════════════════════════════

  async function renderCartPage() {
    await Store.loadCart();
    const cart = Store.cart;

    if (!cart || cart.items.length === 0) {
      $app.innerHTML = `
        <div class="page-enter">
          <section class="section">
            <div class="container">
              <div class="empty-state">
                <div class="empty-state__icon">🛒</div>
                <h2 class="empty-state__title">Your cart is empty</h2>
                <p class="empty-state__text">Looks like you haven't added any items yet. Start shopping!</p>
                <a href="#/products" class="btn btn-primary btn-lg" id="empty-cart-shop-btn">Browse Products</a>
              </div>
            </div>
          </section>
        </div>
      `;
      return;
    }

    const freeDeliveryProgress = Math.min((cart.subtotal / cart.freeDeliveryThreshold) * 100, 100);
    const amountToFreeDelivery = Math.max(cart.freeDeliveryThreshold - cart.subtotal, 0).toFixed(2);

    $app.innerHTML = `
      <div class="page-enter">
        <section class="section" style="padding-top: var(--space-2xl);">
          <div class="container">
            <h1 class="section__title" style="text-align: left; font-size: 2rem; margin-bottom: var(--space-2xl);">
              Your Cart <span style="font-size: 1rem; color: var(--text-secondary); font-weight: 400;">(${cart.itemCount} items)</span>
            </h1>

            <div class="cart-layout">
              <!-- Cart Items -->
              <div class="cart-items" id="cart-items">
                ${cart.items.map(item => `
                  <div class="cart-item" data-product-id="${item.productId}">
                    <div class="cart-item__emoji">${item.product.emoji}</div>
                    <div class="cart-item__info">
                      <div class="cart-item__name">${item.product.name}</div>
                      <div class="cart-item__unit">${item.product.unit}</div>
                      <div class="cart-item__price">${formatPrice(item.product.price * item.quantity)}</div>
                    </div>
                    <div class="cart-item__controls">
                      <div class="quantity-control">
                        <button class="quantity-control__btn" data-quantity-change="${item.productId}" data-delta="-1">−</button>
                        <span class="quantity-control__value">${item.quantity}</span>
                        <button class="quantity-control__btn" data-quantity-change="${item.productId}" data-delta="1">+</button>
                      </div>
                      <button class="cart-item__remove" data-remove-item="${item.productId}" title="Remove item">🗑️</button>
                    </div>
                  </div>
                `).join('')}
              </div>

              <!-- Cart Summary -->
              <div class="cart-summary" id="cart-summary">
                <h3 class="cart-summary__title">Order Summary</h3>
                
                <div class="delivery-progress">
                  <div class="delivery-progress__bar">
                    <div class="delivery-progress__fill" style="width: ${freeDeliveryProgress}%"></div>
                  </div>
                  <div class="delivery-progress__text">
                    ${freeDeliveryProgress >= 100 
                      ? '✅ You qualify for free delivery!' 
                      : `Add $${amountToFreeDelivery} more for free delivery`}
                  </div>
                </div>

                <div class="cart-summary__row text-muted">
                  <span>Subtotal</span>
                  <span>${formatPrice(cart.subtotal)}</span>
                </div>
                <div class="cart-summary__row text-muted">
                  <span>Delivery</span>
                  <span>${cart.deliveryFee === 0 ? '<span style="color: var(--success);">FREE</span>' : formatPrice(cart.deliveryFee)}</span>
                </div>
                <div class="cart-summary__row cart-summary__row--total">
                  <span>Total</span>
                  <span style="color: var(--success);">${formatPrice(cart.total)}</span>
                </div>

                ${cart.deliveryFee === 0 ? `
                  <div class="cart-summary__delivery-note">🎉 Free delivery applied!</div>
                ` : ''}

                <div class="cart-summary__actions">
                  <a href="#/checkout" class="btn btn-primary btn-lg" id="checkout-btn">
                    Proceed to Checkout →
                  </a>
                  <button class="btn btn-danger btn-sm" id="clear-cart-btn">
                    🗑️ Clear Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    `;

    bindCartActions();
  }

  function bindCartActions() {
    // Quantity changes
    document.querySelectorAll('[data-quantity-change]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const productId = btn.dataset.quantityChange;
        const delta = parseInt(btn.dataset.delta);
        const item = Store.cart.items.find(i => i.productId === productId);
        if (!item) return;

        const newQty = item.quantity + delta;
        if (newQty <= 0) {
          await Store.removeItem(productId);
        } else {
          await Store.updateQuantity(productId, newQty);
        }
        await renderCartPage();
      });
    });

    // Remove buttons
    document.querySelectorAll('[data-remove-item]').forEach(btn => {
      btn.addEventListener('click', async () => {
        await Store.removeItem(btn.dataset.removeItem);
        await renderCartPage();
      });
    });

    // Clear cart
    const clearBtn = document.getElementById('clear-cart-btn');
    if (clearBtn) {
      clearBtn.addEventListener('click', async () => {
        await Store.clearCart();
        Toast.show('Cart cleared', 'info');
        await renderCartPage();
      });
    }
  }

  // ═══════════════════════════════════════════════════════
  // PAGE: Checkout
  // ═══════════════════════════════════════════════════════

  async function renderCheckoutPage() {
    await Store.loadCart();
    const cart = Store.cart;

    if (!cart || cart.items.length === 0) {
      window.location.hash = '#/cart';
      return;
    }

    $app.innerHTML = `
      <div class="page-enter">
        <section class="section" style="padding-top: var(--space-2xl);">
          <div class="container">
            <h1 class="section__title" style="text-align: left; font-size: 2rem; margin-bottom: var(--space-2xl);">
              Checkout
            </h1>

            <div class="checkout-layout">
              <!-- Checkout Form -->
              <form class="checkout-form" id="checkout-form">
                <h3 class="checkout-form__title">📦 Delivery Details</h3>

                <div class="form-row">
                  <div class="form-group">
                    <label for="customer-name">Full Name</label>
                    <input type="text" id="customer-name" placeholder="John Doe" required>
                  </div>
                  <div class="form-group">
                    <label for="customer-email">Email</label>
                    <input type="email" id="customer-email" placeholder="john@example.com" required>
                  </div>
                </div>

                <div class="form-group">
                  <label for="customer-phone">Phone Number</label>
                  <input type="tel" id="customer-phone" placeholder="+1 (555) 000-0000" required>
                </div>

                <div class="form-group">
                  <label for="customer-address">Delivery Address</label>
                  <textarea id="customer-address" placeholder="123 Main St, Apt 4B, City, State 12345" required></textarea>
                </div>

                <button type="submit" class="btn btn-primary btn-lg" style="width: 100%; margin-top: var(--space-md);" id="place-order-btn">
                  🛒 Place Order — ${formatPrice(cart.total)}
                </button>
              </form>

              <!-- Order Summary Sidebar -->
              <div class="cart-summary">
                <h3 class="cart-summary__title">Order Summary</h3>
                
                ${cart.items.map(item => `
                  <div style="display: flex; justify-content: space-between; align-items: center; padding: var(--space-sm) 0; border-bottom: 1px solid var(--border);">
                    <div style="display: flex; align-items: center; gap: var(--space-sm);">
                      <span style="font-size: 1.3rem;">${item.product.emoji}</span>
                      <div>
                        <div style="font-size: 0.9rem; font-weight: 600;">${item.product.name}</div>
                        <div style="font-size: 0.8rem; color: var(--text-muted);">× ${item.quantity}</div>
                      </div>
                    </div>
                    <span style="font-weight: 600;">${formatPrice(item.product.price * item.quantity)}</span>
                  </div>
                `).join('')}

                <div class="cart-summary__row text-muted" style="margin-top: var(--space-lg);">
                  <span>Subtotal</span>
                  <span>${formatPrice(cart.subtotal)}</span>
                </div>
                <div class="cart-summary__row text-muted">
                  <span>Delivery</span>
                  <span>${cart.deliveryFee === 0 ? '<span style="color: var(--success);">FREE</span>' : formatPrice(cart.deliveryFee)}</span>
                </div>
                <div class="cart-summary__row cart-summary__row--total">
                  <span>Total</span>
                  <span style="color: var(--success);">${formatPrice(cart.total)}</span>
                </div>
                
                <div style="margin-top: var(--space-md);">
                  <a href="#/cart" class="btn btn-secondary btn-sm" style="width: 100%;" id="back-to-cart-btn">← Back to Cart</a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    `;

    // Form submission
    const form = document.getElementById('checkout-form');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const orderBtn = document.getElementById('place-order-btn');
      orderBtn.disabled = true;
      orderBtn.textContent = '⏳ Placing Order...';

      const orderData = {
        customerName: document.getElementById('customer-name').value.trim(),
        customerEmail: document.getElementById('customer-email').value.trim(),
        phone: document.getElementById('customer-phone').value.trim(),
        address: document.getElementById('customer-address').value.trim()
      };

      try {
        const res = await API.placeOrder(orderData);
        if (res.success) {
          Store.cart = { items: [], itemCount: 0, subtotal: 0, deliveryFee: 0, total: 0 };
          updateBadge();
          Toast.show('🎉 Order placed successfully!', 'success');
          window.location.hash = `#/order/${res.data.id}`;
        } else {
          Toast.show(res.error || 'Failed to place order', 'error');
          orderBtn.disabled = false;
          orderBtn.textContent = `🛒 Place Order — ${formatPrice(cart.total)}`;
        }
      } catch (err) {
        Toast.show('Something went wrong. Please try again.', 'error');
        orderBtn.disabled = false;
        orderBtn.textContent = `🛒 Place Order — ${formatPrice(cart.total)}`;
      }
    });
  }

  // ═══════════════════════════════════════════════════════
  // PAGE: Order Confirmation
  // ═══════════════════════════════════════════════════════

  async function renderOrderConfirmation(orderId) {
    const res = await API.getOrder(orderId);

    if (!res.success) {
      $app.innerHTML = `
        <div class="page-enter">
          <section class="section">
            <div class="container">
              <div class="empty-state">
                <div class="empty-state__icon">❓</div>
                <h2 class="empty-state__title">Order not found</h2>
                <p class="empty-state__text">We couldn't find an order with ID: ${orderId}</p>
                <a href="#/" class="btn btn-primary" id="order-not-found-home-btn">Go Home</a>
              </div>
            </div>
          </section>
        </div>`;
      return;
    }

    const order = res.data;
    const orderDate = new Date(order.createdAt);
    const deliveryDate = new Date(order.estimatedDelivery);

    $app.innerHTML = `
      <div class="page-enter">
        <section class="section">
          <div class="container">
            <div class="order-success">
              <div class="order-success__icon">✓</div>
              <h1 class="order-success__title">Order Confirmed! 🎉</h1>
              <p class="order-success__message">
                Thank you, ${order.customerName}! Your order has been placed and will be delivered soon.
              </p>

              <!-- Order Details -->
              <div class="order-success__details">
                <div class="order-success__detail-row">
                  <span class="order-success__detail-label">Order ID</span>
                  <span class="order-success__detail-value">${order.id}</span>
                </div>
                <div class="order-success__detail-row">
                  <span class="order-success__detail-label">Status</span>
                  <span class="order-success__detail-value" style="color: var(--success); text-transform: capitalize;">
                    ● ${order.status}
                  </span>
                </div>
                <div class="order-success__detail-row">
                  <span class="order-success__detail-label">Order Time</span>
                  <span class="order-success__detail-value">${orderDate.toLocaleString()}</span>
                </div>
                <div class="order-success__detail-row">
                  <span class="order-success__detail-label">Est. Delivery</span>
                  <span class="order-success__detail-value">${deliveryDate.toLocaleTimeString()}</span>
                </div>
                <div class="order-success__detail-row">
                  <span class="order-success__detail-label">Delivery Address</span>
                  <span class="order-success__detail-value">${order.address}</span>
                </div>
              </div>

              <!-- Order Items -->
              <div class="order-success__items">
                <div class="order-success__items-title">🛍️ Items Ordered (${order.items.length})</div>
                ${order.items.map(item => `
                  <div class="order-success__item">
                    <div class="order-success__item-left">
                      <span class="order-success__item-emoji">${item.emoji}</span>
                      <div>
                        <div style="font-weight: 600;">${item.name}</div>
                        <div style="font-size: 0.8rem; color: var(--text-muted);">× ${item.quantity} · ${item.unit}</div>
                      </div>
                    </div>
                    <span style="font-weight: 700;">${formatPrice(item.lineTotal)}</span>
                  </div>
                `).join('')}
              </div>

              <!-- Order Total -->
              <div class="order-success__details">
                <div class="order-success__detail-row">
                  <span class="order-success__detail-label">Subtotal</span>
                  <span class="order-success__detail-value">${formatPrice(order.subtotal)}</span>
                </div>
                <div class="order-success__detail-row">
                  <span class="order-success__detail-label">Delivery</span>
                  <span class="order-success__detail-value">${order.deliveryFee === 0 ? '<span style="color: var(--success);">FREE</span>' : formatPrice(order.deliveryFee)}</span>
                </div>
                <div class="order-success__detail-row">
                  <span class="order-success__detail-label" style="font-weight: 700;">Total Paid</span>
                  <span class="order-success__detail-value" style="font-size: 1.2rem; color: var(--success);">${formatPrice(order.total)}</span>
                </div>
              </div>

              <div style="display: flex; gap: var(--space-md); justify-content: center; flex-wrap: wrap;">
                <a href="#/" class="btn btn-primary btn-lg" id="order-continue-btn">Continue Shopping</a>
                <a href="#/products" class="btn btn-secondary btn-lg" id="order-browse-btn">Browse More</a>
              </div>
            </div>
          </div>
        </section>
      </div>
    `;
  }

  // ═══════════════════════════════════════════════════════
  // GLOBAL: Add to Cart Buttons
  // ═══════════════════════════════════════════════════════

  function bindAddToCartButtons() {
    document.querySelectorAll('[data-add-to-cart]').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const productId = btn.dataset.addToCart;
        btn.disabled = true;
        const originalText = btn.textContent;
        btn.textContent = '✓';
        btn.style.background = 'var(--success)';

        await Store.addToCart(productId);

        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.background = '';
          btn.disabled = false;
        }, 800);
      });
    });
  }

  // ═══════════════════════════════════════════════════════
  // INIT
  // ═══════════════════════════════════════════════════════

  async function init() {
    Toast.init();
    await Store.loadCart();
    await router();
  }

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
