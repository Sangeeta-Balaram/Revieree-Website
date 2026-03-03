// Cart Management System using localStorage

const CART_STORAGE_KEY = 'revieree_cart';
const WISHLIST_STORAGE_KEY = 'revieree_wishlist';
const GUEST_CART_KEY = 'revieree_guest_cart';
const GUEST_WISHLIST_KEY = 'revieree_guest_wishlist';
const AUTH_TOKEN_KEY = 'auth_token';

// ======================
// CART FUNCTIONS
// ======================

export const getCart = () => {
  // Check if user is authenticated and migrate guest data if needed
  checkAndMigrateGuestData();
  
  const isAuthenticated = localStorage.getItem(AUTH_TOKEN_KEY);
  const storageKey = isAuthenticated ? CART_STORAGE_KEY : GUEST_CART_KEY;
  
  const stored = localStorage.getItem(storageKey);
  return stored ? JSON.parse(stored) : [];
};

export const addToCart = (product) => {
  const cart = getCart();
  const existingItem = cart.find(item => item.id === product.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  const isAuthenticated = localStorage.getItem(AUTH_TOKEN_KEY);
  const storageKey = isAuthenticated ? CART_STORAGE_KEY : GUEST_CART_KEY;
  
  localStorage.setItem(storageKey, JSON.stringify(cart));
  
  // Emit event to update cart count in navigation
  window.dispatchEvent(new Event('cartUpdated'));
  
  return cart;
};

export const removeFromCart = (productId) => {
  const cart = getCart();
  const filtered = cart.filter(item => item.id !== productId);
  
  const isAuthenticated = localStorage.getItem(AUTH_TOKEN_KEY);
  const storageKey = isAuthenticated ? CART_STORAGE_KEY : GUEST_CART_KEY;
  
  localStorage.setItem(storageKey, JSON.stringify(filtered));
  
  // Emit event to update cart count in navigation
  window.dispatchEvent(new Event('cartUpdated'));
  
  return filtered;
};

export const updateCartQuantity = (productId, quantity) => {
  const cart = getCart();
  const item = cart.find(item => item.id === productId);

  if (item) {
    if (quantity <= 0) {
      return removeFromCart(productId);
    }
    item.quantity = quantity;
    
    const isAuthenticated = localStorage.getItem(AUTH_TOKEN_KEY);
    const storageKey = isAuthenticated ? CART_STORAGE_KEY : GUEST_CART_KEY;
    
    localStorage.setItem(storageKey, JSON.stringify(cart));
    
    // Emit event to update cart count in navigation
    window.dispatchEvent(new Event('cartUpdated'));
  }

  return cart;
};

export const clearCart = () => {
  const isAuthenticated = localStorage.getItem(AUTH_TOKEN_KEY);
  const storageKey = isAuthenticated ? CART_STORAGE_KEY : GUEST_CART_KEY;
  
  localStorage.setItem(storageKey, JSON.stringify([]));
  
  // Emit event to update cart count in navigation
  window.dispatchEvent(new Event('cartUpdated'));
  
  return [];
};

export const getCartTotal = () => {
  const cart = getCart();
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
};

export const getCartItemCount = () => {
  const cart = getCart();
  return cart.reduce((count, item) => count + item.quantity, 0);
};

// ======================
// WISHLIST FUNCTIONS
// ======================

export const getWishlist = () => {
  const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const addToWishlist = (product) => {
  const wishlist = getWishlist();
  const exists = wishlist.find(item => item.id === product.id);

  if (!exists) {
    wishlist.push(product);
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
  }

  return wishlist;
};

export const removeFromWishlist = (productId) => {
  const wishlist = getWishlist();
  const filtered = wishlist.filter(item => item.id !== productId);
  localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(filtered));
  return filtered;
};

export const isInWishlist = (productId) => {
  const wishlist = getWishlist();
  return wishlist.some(item => item.id === productId);
};

export const clearWishlist = () => {
  localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify([]));
  return [];
};

export const moveToCart = (productId) => {
  const wishlist = getWishlist();
  const product = wishlist.find(item => item.id === productId);

  if (product) {
    addToCart(product);
    removeFromWishlist(productId);
  }

  return { cart: getCart(), wishlist: getWishlist() };
};

// ======================
// AUTHENTICATION INTEGRATION
// ======================

export const migrateGuestToUserCart = () => {
  // Get guest cart data
  const guestCart = localStorage.getItem(GUEST_CART_KEY);
  const guestWishlist = localStorage.getItem(GUEST_WISHLIST_KEY);
  
  if (guestCart) {
    // Move guest cart to authenticated user cart
    localStorage.setItem(CART_STORAGE_KEY, guestCart);
    localStorage.removeItem(GUEST_CART_KEY);
  }
  
  if (guestWishlist) {
    // Move guest wishlist to authenticated user wishlist
    localStorage.setItem(WISHLIST_STORAGE_KEY, guestWishlist);
    localStorage.removeItem(GUEST_WISHLIST_KEY);
  }
  
  return {
    cart: guestCart ? JSON.parse(guestCart) : [],
    wishlist: guestWishlist ? JSON.parse(guestWishlist) : []
  };
};

// Auto-migration check function
export const checkAndMigrateGuestData = () => {
  const isAuthenticated = localStorage.getItem(AUTH_TOKEN_KEY);
  const hasGuestCart = localStorage.getItem(GUEST_CART_KEY);
  const hasGuestWishlist = localStorage.getItem(GUEST_WISHLIST_KEY);
  
  // If user is authenticated and has guest data, migrate it
  if (isAuthenticated && (hasGuestCart || hasGuestWishlist)) {
    migrateGuestToUserCart();
    return true;
  }
  
  return false;
};

export const clearGuestData = () => {
  localStorage.removeItem(GUEST_CART_KEY);
  localStorage.removeItem(GUEST_WISHLIST_KEY);
};