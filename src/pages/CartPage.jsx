import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ShoppingCart,
  Heart,
  Trash2,
  Plus,
  Minus,
  ChevronLeft,
  ChevronRight,
  Bell,
  X,
  Check,
  Package,
  ArrowLeft,
  User,
  Lock,
} from "lucide-react";
import {
  getCart,
  removeFromCart,
  updateCartQuantity,
  clearCart,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  addToCart,
} from "../utils/cart";
import { getProductsByCategory } from "../utils/storage";

const CartPage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [showWishlist, setShowWishlist] = useState(false);
  const [notificationEmail, setNotificationEmail] = useState("");
  const [showNotificationModal, setShowNotificationModal] = useState(null);
  const [stockStatus, setStockStatus] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    const authToken = localStorage.getItem('auth_token');
    setIsAuthenticated(!!authToken);
    
    const updateCartData = () => {
      const currentCart = getCart();
      setCart(currentCart);
      setWishlist(getWishlist());
      
      // Check stock status for all cart items
      const stockCheck = {};
      currentCart.forEach((item) => {
        const variation = item.selectedVariation;
        const stock = variation?.stock || item.totalStock || 10;
        stockCheck[item.id] = stock > 0;
      });
      setStockStatus(stockCheck);
    };

    // Initial load
    updateCartData();

    // Listen for cart changes
    const handleStorageChange = () => {
      updateCartData();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('cartUpdated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cartUpdated', handleStorageChange);
    };
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(productId);
    } else {
      updateCartQuantity(productId, newQuantity);
      setCart(getCart());
    }
  };

  const handleRemoveItem = (productId) => {
    removeFromCart(productId);
    setCart(getCart());
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      newSet.delete(productId);
      return newSet;
    });
  };

  const handleSelectItem = (productId) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedItems.size === cart.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(cart.map((item) => item.id)));
    }
  };

  const handleMoveToWishlist = (productId) => {
    const product = cart.find((item) => item.id === productId);
    if (product) {
      addToWishlist(product);
      removeFromCart(productId);
      setCart(getCart());
      setWishlist(getWishlist());
      setSelectedItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  const handleBuyNow = (productIds = null) => {
    const itemsToBuy = productIds
      ? cart.filter((item) => productIds.includes(item.id))
      : cart;
    
    if (itemsToBuy.length === 0) {
      alert("Please select items to buy");
      return;
    }
    
    // Navigate to checkout with selected items
    navigate("/checkout", { state: { items: itemsToBuy } });
  };

  const handleNotifyWhenBack = () => {
    if (notificationEmail && showNotificationModal) {
      // Here you would typically send this to your backend
      alert(`We'll notify you at ${notificationEmail} when this item is back in stock!`);
      setShowNotificationModal(null);
      setNotificationEmail("");
    }
  };

  const getSelectedTotal = () => {
    return cart
      .filter((item) => selectedItems.has(item.id))
      .reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getOldPrice = (item) => {
    const currentPrice = item.selectedVariation?.price || item.price;
    return Math.round(currentPrice * 1.3);
  };

  const hasPriceChanged = (item) => {
    const currentPrice = item.selectedVariation?.price || item.price;
    const oldPrice = getOldPrice(item);
    return oldPrice !== currentPrice;
  };

  if (cart.length === 0 && !showWishlist) {
    return (
      <div className="min-h-screen pt-0 pb-16">
        {/* Hero Section - Matching Fragrances Page Style */}
        <section className="relative h-screen min-h-[650px] overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src="/assets/images/adc8fc81eac678aba089250ca3074d47.jpg"
              alt="Shopping Cart"
              className="w-full h-full object-cover"
            />
            {/* Light Overlay for better text visibility */}
            <div className="absolute inset-0 bg-black/15"></div>
          </div>

          {/* Centered Content */}
          <div className="relative h-full flex items-center justify-center px-6">
            <div className="text-center">
              {/* Golden Title */}
              <h1
                className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
                style={{
                  color: "#FF8C00",
                  textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
                }}
              >
                SHOPPING CART
              </h1>

              {/* Subtitle */}
              <p
                className="text-xl md:text-2xl text-white mb-8 font-light"
                style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.8)" }}
              >
                0 items in your cart
              </p>

              {/* CTA Button */}
              <button 
                onClick={() => navigate("/products/fragrances")}
                className="inline-flex items-center space-x-2 px-8 py-4 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 shadow-xl"
              >
                <ShoppingCart size={20} />
                <span>Shop Now</span>
              </button>
            </div>
          </div>
        </section>

        {/* Empty Cart Content Section */}
        <div className="container-custom py-16">
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
            <div className="text-center">
              <ShoppingCart className="w-24 h-24 text-gray-300 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Your Cart is Empty
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Looks like you haven't added anything yet
              </p>
              
              {/* Login prompt for guest users */}
              {!isAuthenticated && (
                <div className="bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-200 rounded-xl p-6 mb-8 max-w-md mx-auto">
                  <div className="flex items-center justify-center mb-4">
                    <Lock className="w-8 h-8 text-red-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-red-900 mb-2">
                    Sign in to save your cart
                  </h3>
                  <p className="text-red-700 mb-4">
                    Your items will be saved for future visits and easier checkout
                  </p>
                  <button
                    onClick={() => navigate("/login")}
                    className="w-full px-6 py-3 bg-red-700 text-white rounded-lg hover:bg-red-800 transition-colors font-medium"
                  >
                    Sign In
                  </button>
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate("/products/fragrances")}
                  className="inline-flex items-center space-x-2 px-8 py-4 bg-red-800 text-white font-semibold rounded-lg hover:bg-red-900 transition-all duration-300 shadow-xl"
                >
                  <Package size={20} />
                  <span>Start Shopping</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

   return (
    <div className="min-h-screen pt-0 pb-16">
      {/* Hero Section - Matching Fragrances Page Style */}
      <section className="relative h-[80vh] min-h-[550px] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="/assets/images/adc8fc81eac678aba089250ca3074d47.jpg"
            alt="Shopping Cart"
            className="w-full h-full object-cover"
          />
          {/* Light Overlay for better text visibility */}
          <div className="absolute inset-0 bg-black/15"></div>
        </div>

        {/* Centered Content */}
        <div className="relative h-full flex items-center justify-center px-6">
          <div className="text-center">
            {/* Golden Title */}
            <h1
              className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
              style={{
                color: "#FF8C00",
                textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
              }}
            >
              SHOPPING CART
            </h1>

            {/* Subtitle */}
            <p
              className="text-xl md:text-2xl text-white mb-8 font-light"
              style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.8)" }}
            >
              {cart.length} {cart.length === 1 ? "item" : "items"} in your cart
            </p>

            {/* CTA Button */}
            <button 
              onClick={() => navigate("/products/fragrances")}
              className="inline-flex items-center space-x-2 px-8 py-4 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 shadow-xl"
            >
              <ShoppingCart size={20} />
              <span>Shop Now</span>
            </button>
          </div>
        </div>
      </section>

      <div className="container-custom pt-8">
        {/* Authentication Notice for Guest Users */}
        {!isAuthenticated && cart.length > 0 && (
          <div className="bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-200 rounded-xl p-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <Lock className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-red-900">Sign in to save your cart</h3>
                  <p className="text-red-700">Your items will be saved for future visits</p>
                </div>
              </div>
              <button
                onClick={() => navigate("/login")}
                className="px-6 py-3 bg-red-700 text-white rounded-lg hover:bg-red-800 transition-colors font-medium"
              >
                Sign In
              </button>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-end mb-8">
          <button
            onClick={() => navigate("/wishlist")}
            className="flex items-center space-x-2 px-6 py-3 bg-white text-red-800 border-2 border-red-800 rounded-lg hover:bg-red-50 transition-all duration-300"
          >
            <Heart size={18} />
            <span>View Wishlist ({wishlist.length})</span>
          </button>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Select All and Actions */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <input
                    type="checkbox"
                    checked={selectedItems.size === cart.length && cart.length > 0}
                    onChange={handleSelectAll}
                    className="w-5 h-5 text-red-800 border-red-800 rounded focus:ring-red-800"
                  />
                  <span className="font-semibold text-gray-900">
                    Select All ({selectedItems.size} selected)
                  </span>
                </div>
                
                <div className="flex items-center space-x-3">
                  {selectedItems.size > 0 && (
                    <button
                      onClick={() => handleBuyNow(Array.from(selectedItems))}
                      className="px-6 py-2 bg-red-800 text-white rounded-lg hover:bg-red-900 transition-colors font-medium"
                    >
                      Buy Selected ({selectedItems.size})
                    </button>
                  )}
                  
                  <button
                    onClick={() => handleBuyNow()}
                    className="px-6 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors font-medium"
                  >
                    Buy All
                  </button>
                </div>
              </div>
            </div>

            {/* Cart Items List */}
            {cart.map((item) => {
              const isInStock = stockStatus[item.id] !== false;
              const isSelected = selectedItems.has(item.id);
              
              return (
                <div
                  key={item.id}
                  className={`bg-white rounded-xl p-6 shadow-sm border-2 transition-all ${
                    !isInStock
                      ? "border-gray-200 opacity-75"
                      : "border-gray-100 hover:border-red-200"
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    {/* Checkbox */}
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleSelectItem(item.id)}
                      disabled={!isInStock}
                      className={`mt-1 w-5 h-5 rounded focus:ring-red-800 ${
                        isInStock
                          ? "text-red-800 border-red-800"
                          : "text-gray-400 border-gray-300 cursor-not-allowed"
                      }`}
                    />

                    {/* Product Image */}
                    <div 
                      className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer"
                      onClick={() => {
                        navigate(`/product/${item.category || 'fragrance'}/${item.name.toLowerCase().replace(/\s+/g, '-')}`);
                        window.scrollTo(0, 0);
                      }}
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 space-y-3">
                      <div>
                        <h3 
                          className="text-lg font-semibold text-gray-900 cursor-pointer hover:text-red-700 transition-colors"
                          onClick={() => {
                            navigate(`/product/${item.category || 'fragrance'}/${item.name.toLowerCase().replace(/\s+/g, '-')}`);
                            window.scrollTo(0, 0);
                          }}
                        >
                          {item.name}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                          <span>
                            {item.selectedVariation?.size || item.selectedVariation?.shade || "Standard"}
                          </span>
                          {item.selectedVariation?.color && (
                            <span>Color: {item.selectedVariation.color}</span>
                          )}
                        </div>
                      </div>

                      {/* Price */}
                      <div className="flex items-center space-x-3">
                        <span className="text-xl font-bold text-red-600">
                          {formatPrice(item.selectedVariation?.price || item.price)}
                        </span>
                        {hasPriceChanged(item) && (
                          <>
                            <span className="text-lg text-gray-500 line-through">
                              {formatPrice(getOldPrice(item))}
                            </span>
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                              Price Drop!
                            </span>
                          </>
                        )}
                      </div>

                      {/* Stock Status */}
                      {!isInStock && (
                        <div className="flex items-center space-x-3">
                          <span className="px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded">
                            Out of Stock
                          </span>
                          <button
                            onClick={() => setShowNotificationModal(item.id)}
                            className="flex items-center space-x-1 text-red-600 hover:text-red-800 text-sm font-medium"
                          >
                            <Bell size={14} />
                            <span>Notify me when back</span>
                          </button>
                        </div>
                      )}

                      {/* Quantity and Actions */}
                      {isInStock && (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center border-2 border-gray-200 rounded-lg">
                              <button
                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                className="p-2 hover:bg-gray-100 transition-colors"
                              >
                                <Minus size={16} />
                              </button>
                              <span className="px-4 py-2 font-medium w-16 text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                className="p-2 hover:bg-gray-100 transition-colors"
                              >
                                <Plus size={16} />
                              </button>
                            </div>
                            
                            <span className="text-sm text-gray-600">
                              Total: {formatPrice((item.selectedVariation?.price || item.price) * item.quantity)}
                            </span>
                          </div>

                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleMoveToWishlist(item.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Move to Wishlist"
                            >
                              <Heart size={18} />
                            </button>
                            <button
                              onClick={() => handleRemoveItem(item.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Remove from Cart"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 sticky top-4">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({selectedItems.size} items)</span>
                  <span className="font-medium">{formatPrice(getSelectedTotal())}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-medium">Free</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span className="font-medium">Calculated at checkout</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span className="text-red-600">{formatPrice(getSelectedTotal())}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleBuyNow(Array.from(selectedItems))}
                disabled={selectedItems.size === 0}
                className={`w-full py-3 rounded-lg font-semibold transition-all ${
                  selectedItems.size > 0
                    ? "bg-red-800 text-white hover:bg-red-900"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Proceed to Checkout ({selectedItems.size} items)
              </button>

              <button
                onClick={() => navigate("/products/fragrances")}
                className="w-full mt-3 py-3 border-2 border-red-800 text-red-800 rounded-lg font-semibold hover:bg-red-50 transition-all"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>

        {/* Wishlist Modal */}
        {showWishlist && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">My Wishlist</h2>
                  <button
                    onClick={() => setShowWishlist(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
              
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                {wishlist.length === 0 ? (
                  <div className="text-center py-12">
                    <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-xl text-gray-600">Your wishlist is empty</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {wishlist.map((item) => (
                      <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start space-x-4">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{item.name}</h3>
                            <p className="text-red-600 font-bold">{formatPrice(item.price)}</p>
                            <div className="flex items-center space-x-2 mt-3">
                              <button
                                onClick={() => {
                                  addToCart(item);
                                  removeFromWishlist(item.id);
                                  setWishlist(getWishlist());
                                  setCart(getCart());
                                }}
                                className="px-4 py-2 bg-red-800 text-white text-sm rounded-lg hover:bg-red-900 transition-colors"
                              >
                                Add to Cart
                              </button>
                              <button
                                onClick={() => {
                                  removeFromWishlist(item.id);
                                  setWishlist(getWishlist());
                                }}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Notification Modal */}
        {showNotificationModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">Notify When Back</h3>
                <button
                  onClick={() => setShowNotificationModal(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              <p className="text-gray-600 mb-4">
                Get notified when this item is back in stock:
              </p>
              
              <input
                type="email"
                placeholder="Enter your email"
                value={notificationEmail}
                onChange={(e) => setNotificationEmail(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-800 focus:outline-none mb-4"
              />
              
              <div className="flex space-x-3">
                <button
                  onClick={handleNotifyWhenBack}
                  disabled={!notificationEmail}
                  className="flex-1 py-3 bg-red-800 text-white rounded-lg hover:bg-red-900 transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Notify Me
                </button>
                <button
                  onClick={() => setShowNotificationModal(null)}
                  className="flex-1 py-3 border-2 border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;