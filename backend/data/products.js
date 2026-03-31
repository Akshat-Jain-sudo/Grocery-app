const products = [
  // ═══════════════════════════════════════
  // 🍎 FRUITS
  // ═══════════════════════════════════════
  {
    id: 'fruit_001',
    name: 'Red Apple',
    description: 'Fresh, crisp Fuji apples — perfect for snacking, salads, or baking.',
    price: 3.99,
    originalPrice: 4.99,
    category: 'fruits',
    unit: 'per kg',
    emoji: '🍎',
    inStock: true,
    rating: 4.7,
    reviewCount: 234
  },
  {
    id: 'fruit_002',
    name: 'Banana',
    description: 'Naturally sweet ripe bananas, great source of potassium and energy.',
    price: 1.49,
    originalPrice: null,
    category: 'fruits',
    unit: 'per bunch',
    emoji: '🍌',
    inStock: true,
    rating: 4.5,
    reviewCount: 412
  },
  {
    id: 'fruit_003',
    name: 'Orange',
    description: 'Juicy navel oranges bursting with vitamin C and natural sweetness.',
    price: 4.29,
    originalPrice: 5.49,
    category: 'fruits',
    unit: 'per kg',
    emoji: '🍊',
    inStock: true,
    rating: 4.6,
    reviewCount: 189
  },
  {
    id: 'fruit_004',
    name: 'Strawberry',
    description: 'Hand-picked strawberries — vibrant, sweet, and perfect for desserts.',
    price: 5.99,
    originalPrice: null,
    category: 'fruits',
    unit: 'per box',
    emoji: '🍓',
    inStock: true,
    rating: 4.8,
    reviewCount: 312
  },
  {
    id: 'fruit_005',
    name: 'Mango',
    description: 'Premium Alphonso mangoes with rich tropical flavor.',
    price: 6.99,
    originalPrice: 8.99,
    category: 'fruits',
    unit: 'per kg',
    emoji: '🥭',
    inStock: true,
    rating: 4.9,
    reviewCount: 156
  },
  {
    id: 'fruit_006',
    name: 'Grapes',
    description: 'Seedless green grapes — crisp, refreshing, and naturally sweet.',
    price: 4.49,
    originalPrice: null,
    category: 'fruits',
    unit: 'per kg',
    emoji: '🍇',
    inStock: true,
    rating: 4.4,
    reviewCount: 201
  },
  {
    id: 'fruit_007',
    name: 'Watermelon',
    description: 'Sweet, refreshing watermelon — the ultimate summer treat.',
    price: 7.99,
    originalPrice: 9.99,
    category: 'fruits',
    unit: 'per piece',
    emoji: '🍉',
    inStock: true,
    rating: 4.6,
    reviewCount: 98
  },
  {
    id: 'fruit_008',
    name: 'Blueberry',
    description: 'Antioxidant-rich blueberries — perfect for smoothies and breakfast bowls.',
    price: 6.49,
    originalPrice: null,
    category: 'fruits',
    unit: 'per box',
    emoji: '🫐',
    inStock: true,
    rating: 4.7,
    reviewCount: 267
  },

  // ═══════════════════════════════════════
  // 🥬 VEGETABLES
  // ═══════════════════════════════════════
  {
    id: 'veg_001',
    name: 'Tomato',
    description: 'Vine-ripened tomatoes — juicy and full of flavor for any dish.',
    price: 2.99,
    originalPrice: null,
    category: 'vegetables',
    unit: 'per kg',
    emoji: '🍅',
    inStock: true,
    rating: 4.5,
    reviewCount: 345
  },
  {
    id: 'veg_002',
    name: 'Potato',
    description: 'Versatile russet potatoes — ideal for roasting, mashing, or frying.',
    price: 2.49,
    originalPrice: null,
    category: 'vegetables',
    unit: 'per kg',
    emoji: '🥔',
    inStock: true,
    rating: 4.3,
    reviewCount: 289
  },
  {
    id: 'veg_003',
    name: 'Onion',
    description: 'Fresh yellow onions — a kitchen essential for every recipe.',
    price: 1.99,
    originalPrice: null,
    category: 'vegetables',
    unit: 'per kg',
    emoji: '🧅',
    inStock: true,
    rating: 4.4,
    reviewCount: 198
  },
  {
    id: 'veg_004',
    name: 'Carrot',
    description: 'Crunchy orange carrots — packed with beta-carotene and natural sweetness.',
    price: 2.29,
    originalPrice: 2.99,
    category: 'vegetables',
    unit: 'per kg',
    emoji: '🥕',
    inStock: true,
    rating: 4.6,
    reviewCount: 267
  },
  {
    id: 'veg_005',
    name: 'Broccoli',
    description: 'Fresh broccoli crowns — nutrient-dense and delicious steamed or roasted.',
    price: 3.49,
    originalPrice: null,
    category: 'vegetables',
    unit: 'per head',
    emoji: '🥦',
    inStock: true,
    rating: 4.5,
    reviewCount: 178
  },
  {
    id: 'veg_006',
    name: 'Spinach',
    description: 'Baby spinach leaves — tender, healthy, and perfect for salads or smoothies.',
    price: 3.99,
    originalPrice: null,
    category: 'vegetables',
    unit: 'per bag',
    emoji: '🥬',
    inStock: true,
    rating: 4.7,
    reviewCount: 203
  },
  {
    id: 'veg_007',
    name: 'Bell Pepper',
    description: 'Colorful bell peppers — sweet, crunchy, and great for stir-fries.',
    price: 4.99,
    originalPrice: 5.99,
    category: 'vegetables',
    unit: 'per kg',
    emoji: '🫑',
    inStock: true,
    rating: 4.4,
    reviewCount: 145
  },
  {
    id: 'veg_008',
    name: 'Cucumber',
    description: 'Cool, crisp cucumbers — refreshing for salads and snacking.',
    price: 1.99,
    originalPrice: null,
    category: 'vegetables',
    unit: 'per piece',
    emoji: '🥒',
    inStock: false,
    rating: 4.3,
    reviewCount: 167
  },

  // ═══════════════════════════════════════
  // 🥛 DAIRY & EGGS
  // ═══════════════════════════════════════
  {
    id: 'dairy_001',
    name: 'Whole Milk',
    description: 'Farm-fresh whole milk — creamy, nutritious, and great for the whole family.',
    price: 4.49,
    originalPrice: null,
    category: 'dairy',
    unit: 'per gallon',
    emoji: '🥛',
    inStock: true,
    rating: 4.6,
    reviewCount: 456
  },
  {
    id: 'dairy_002',
    name: 'Cheddar Cheese',
    description: 'Aged sharp cheddar — rich flavor perfect for sandwiches and cooking.',
    price: 5.99,
    originalPrice: 7.49,
    category: 'dairy',
    unit: 'per block',
    emoji: '🧀',
    inStock: true,
    rating: 4.8,
    reviewCount: 334
  },
  {
    id: 'dairy_003',
    name: 'Greek Yogurt',
    description: 'Thick, creamy Greek yogurt — high in protein, low in sugar.',
    price: 3.99,
    originalPrice: null,
    category: 'dairy',
    unit: 'per tub',
    emoji: '🍶',
    inStock: true,
    rating: 4.7,
    reviewCount: 278
  },
  {
    id: 'dairy_004',
    name: 'Butter',
    description: 'Unsalted European-style butter — perfect for baking and cooking.',
    price: 4.99,
    originalPrice: null,
    category: 'dairy',
    unit: 'per pack',
    emoji: '🧈',
    inStock: true,
    rating: 4.5,
    reviewCount: 189
  },
  {
    id: 'dairy_005',
    name: 'Free-Range Eggs',
    description: 'Farm-fresh free-range eggs — rich yolks and superior taste.',
    price: 5.49,
    originalPrice: 6.99,
    category: 'dairy',
    unit: 'per dozen',
    emoji: '🥚',
    inStock: true,
    rating: 4.8,
    reviewCount: 512
  },

  // ═══════════════════════════════════════
  // 🍞 BAKERY
  // ═══════════════════════════════════════
  {
    id: 'bakery_001',
    name: 'Sourdough Bread',
    description: 'Artisan sourdough bread — crusty outside, soft and tangy inside.',
    price: 4.99,
    originalPrice: null,
    category: 'bakery',
    unit: 'per loaf',
    emoji: '🍞',
    inStock: true,
    rating: 4.9,
    reviewCount: 367
  },
  {
    id: 'bakery_002',
    name: 'Croissant',
    description: 'Flaky, buttery French croissants — freshly baked every morning.',
    price: 2.99,
    originalPrice: null,
    category: 'bakery',
    unit: 'per piece',
    emoji: '🥐',
    inStock: true,
    rating: 4.8,
    reviewCount: 423
  },
  {
    id: 'bakery_003',
    name: 'Chocolate Muffin',
    description: 'Double chocolate chip muffins — moist, decadent, and irresistible.',
    price: 3.49,
    originalPrice: 3.99,
    category: 'bakery',
    unit: 'per piece',
    emoji: '🧁',
    inStock: true,
    rating: 4.7,
    reviewCount: 234
  },
  {
    id: 'bakery_004',
    name: 'Bagel',
    description: 'New York-style bagels — chewy, dense, and perfect with cream cheese.',
    price: 1.99,
    originalPrice: null,
    category: 'bakery',
    unit: 'per piece',
    emoji: '🥯',
    inStock: true,
    rating: 4.5,
    reviewCount: 178
  },
  {
    id: 'bakery_005',
    name: 'Birthday Cake',
    description: 'Layered vanilla cake with buttercream frosting — celebration ready!',
    price: 24.99,
    originalPrice: 29.99,
    category: 'bakery',
    unit: 'per cake',
    emoji: '🎂',
    inStock: true,
    rating: 4.9,
    reviewCount: 89
  },

  // ═══════════════════════════════════════
  // ☕ BEVERAGES
  // ═══════════════════════════════════════
  {
    id: 'bev_001',
    name: 'Orange Juice',
    description: 'Freshly squeezed orange juice — no added sugar, pure refreshment.',
    price: 5.49,
    originalPrice: null,
    category: 'beverages',
    unit: 'per bottle',
    emoji: '🧃',
    inStock: true,
    rating: 4.6,
    reviewCount: 234
  },
  {
    id: 'bev_002',
    name: 'Ground Coffee',
    description: 'Premium Arabica ground coffee — bold, smooth, and aromatic.',
    price: 12.99,
    originalPrice: 14.99,
    category: 'beverages',
    unit: 'per bag',
    emoji: '☕',
    inStock: true,
    rating: 4.8,
    reviewCount: 567
  },
  {
    id: 'bev_003',
    name: 'Green Tea',
    description: 'Organic green tea bags — calming, antioxidant-rich, and naturally delicious.',
    price: 6.99,
    originalPrice: null,
    category: 'beverages',
    unit: 'per box',
    emoji: '🍵',
    inStock: true,
    rating: 4.5,
    reviewCount: 312
  },
  {
    id: 'bev_004',
    name: 'Sparkling Water',
    description: 'Naturally carbonated mineral water — zero calories, maximum sparkle.',
    price: 3.99,
    originalPrice: null,
    category: 'beverages',
    unit: 'per 6-pack',
    emoji: '💧',
    inStock: true,
    rating: 4.3,
    reviewCount: 198
  },
  {
    id: 'bev_005',
    name: 'Coconut Water',
    description: 'Pure coconut water — natural hydration with electrolytes.',
    price: 4.49,
    originalPrice: 5.49,
    category: 'beverages',
    unit: 'per bottle',
    emoji: '🥥',
    inStock: true,
    rating: 4.6,
    reviewCount: 145
  },

  // ═══════════════════════════════════════
  // 🍪 SNACKS
  // ═══════════════════════════════════════
  {
    id: 'snack_001',
    name: 'Potato Chips',
    description: 'Crispy kettle-cooked chips — lightly salted with a satisfying crunch.',
    price: 3.99,
    originalPrice: null,
    category: 'snacks',
    unit: 'per bag',
    emoji: '🥔',
    inStock: true,
    rating: 4.4,
    reviewCount: 423
  },
  {
    id: 'snack_002',
    name: 'Chocolate Cookies',
    description: 'Gourmet chocolate chip cookies — chewy center, crispy edges.',
    price: 4.49,
    originalPrice: null,
    category: 'snacks',
    unit: 'per pack',
    emoji: '🍪',
    inStock: true,
    rating: 4.7,
    reviewCount: 356
  },
  {
    id: 'snack_003',
    name: 'Mixed Nuts',
    description: 'Premium roasted mixed nuts — almonds, cashews, walnuts, and pecans.',
    price: 8.99,
    originalPrice: 10.99,
    category: 'snacks',
    unit: 'per jar',
    emoji: '🥜',
    inStock: true,
    rating: 4.8,
    reviewCount: 267
  },
  {
    id: 'snack_004',
    name: 'Dark Chocolate',
    description: '72% cacao dark chocolate — smooth, rich, and guilt-free indulgence.',
    price: 5.99,
    originalPrice: null,
    category: 'snacks',
    unit: 'per bar',
    emoji: '🍫',
    inStock: true,
    rating: 4.9,
    reviewCount: 445
  },
  {
    id: 'snack_005',
    name: 'Granola Bar',
    description: 'Crunchy oat & honey granola bars — the perfect on-the-go snack.',
    price: 4.99,
    originalPrice: 5.99,
    category: 'snacks',
    unit: 'per box',
    emoji: '🌾',
    inStock: true,
    rating: 4.5,
    reviewCount: 198
  },
  {
    id: 'snack_006',
    name: 'Trail Mix',
    description: 'Adventure trail mix — nuts, dried fruits, and chocolate chips.',
    price: 6.49,
    originalPrice: null,
    category: 'snacks',
    unit: 'per bag',
    emoji: '🥜',
    inStock: true,
    rating: 4.6,
    reviewCount: 134
  }
];

const categories = [
  { id: 'fruits', name: 'Fruits', emoji: '🍎', color: '#00b894', description: 'Fresh seasonal fruits' },
  { id: 'vegetables', name: 'Vegetables', emoji: '🥬', color: '#00cec9', description: 'Farm-fresh vegetables' },
  { id: 'dairy', name: 'Dairy & Eggs', emoji: '🥛', color: '#6c5ce7', description: 'Milk, cheese, eggs & more' },
  { id: 'bakery', name: 'Bakery', emoji: '🍞', color: '#e17055', description: 'Freshly baked goods' },
  { id: 'beverages', name: 'Beverages', emoji: '☕', color: '#a29bfe', description: 'Drinks & refreshments' },
  { id: 'snacks', name: 'Snacks', emoji: '🍪', color: '#fd79a8', description: 'Chips, cookies & treats' }
];

// In-memory cart
let cart = {
  items: [],
  updatedAt: new Date().toISOString()
};

// In-memory orders
let orders = [];

module.exports = {
  products,
  categories,
  cart,
  orders,
  resetCart: () => {
    cart.items = [];
    cart.updatedAt = new Date().toISOString();
  }
};
