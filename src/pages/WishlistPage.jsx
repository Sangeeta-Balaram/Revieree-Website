import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Heart,
  Trash2,
  ShoppingCart,
  Package,
  ArrowLeft,
  Lock,
} from "lucide-react";
import {
  getWishlist,
  removeFromWishlist,
  addToWishlist,
  addToCart,
} from "../utils/cart";

const WishlistPage = () => {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const authToken = localStorage.getItem('auth_token');
    setIsAuthenticated(!!authToken);
    const updateWishlistData = () => {
      setWishlist(getWishlist());
    };

    updateWishlistData();

    const handleStorageChange = () => {
      updateWishlistData();
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

  const handleRemoveItem = (productId) => {
    removeFromWishlist(productId);
    setWishlist(getWishlist());
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    removeFromWishlist(product.id);
    setWishlist(getWishlist());
  };

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen pt-0 pb-16">
        {/* Hero Section - Matching Fragrances Page Style */}
        <section className="relative h-[80vh] min-h-[550px] overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src="/src/assets/images/adc8fc81eac678aba089250ca3074d47.jpg"
              alt="Wishlist"
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
                WISHLIST
              </h1>

              {/* Subtitle */}
              <p
                className="text-xl md:text-2xl text-white mb-8 font-light"
                style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.8)" }}
              >
                0 items in your wishlist
              </p>

              {/* CTA Button */}
              <button 
                onClick={() => navigate("/products/fragrances")}
                className="inline-flex items-center space-x-2 px-8 py-4 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 shadow-xl"
              >
                <Heart size={20} />
                <span>Start Shopping</span>
              </button>
            </div>
          </div>
        </section>

        {/* Empty Wishlist Content Section */}
        <div className="container-custom py-16">
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
            <div className="text-center">
              <Heart className="w-24 h-24 text-gray-300 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Your Wishlist is Empty
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Save items you love to your wishlist
              </p>
              
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
            src="/src/assets/images/adc8fc81eac678aba089250ca3074d47.jpg"
            alt="Wishlist"
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
              WISHLIST
            </h1>

            {/* Subtitle */}
            <p
              className="text-xl md:text-2xl text-white mb-8 font-light"
              style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.8)" }}
            >
              {wishlist.length} {wishlist.length === 1 ? "item" : "items"} in your wishlist
            </p>

            {/* CTA Button */}
            <button 
              onClick={() => navigate("/products/fragrances")}
              className="inline-flex items-center space-x-2 px-8 py-4 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 shadow-xl"
            >
              <Heart size={20} />
              <span>Shop More</span>
            </button>
          </div>
        </div>
      </section>

      <div className="container-custom pt-8">
        {/* Authentication Notice for Guest Users */}
        {!isAuthenticated && wishlist.length > 0 && (
          <div className="bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-200 rounded-xl p-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <Lock className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-red-900">Sign in to save your wishlist</h3>
                  <p className="text-red-700">Your wishlist will be saved for future visits</p>
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
            onClick={() => navigate("/cart")}
            className="flex items-center space-x-2 px-6 py-3 bg-white text-red-800 border-2 border-red-800 rounded-lg hover:bg-red-50 transition-all duration-300"
          >
            <ShoppingCart size={18} />
            <span>View Cart</span>
          </button>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Wishlist Items */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-900">
                  {wishlist.length} {wishlist.length === 1 ? "item" : "items"} saved
                </span>
              </div>
            </div>

            {/* Wishlist Items List */}
            {wishlist.map((item) => {
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-xl p-6 shadow-sm border-2 border-gray-100 hover:border-red-200 transition-all"
                >
                  <div className="flex items-start space-x-4">
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
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => handleAddToCart(item)}
                            className="px-4 py-2 bg-red-800 text-white rounded-lg hover:bg-red-900 transition-colors font-medium flex items-center space-x-2"
                          >
                            <ShoppingCart size={16} />
                            <span>Add to Cart</span>
                          </button>
                          
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Remove from Wishlist"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 sticky top-4">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Wishlist Summary</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Total Items</span>
                  <span className="font-medium">{wishlist.length}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Estimated Total</span>
                  <span className="font-medium text-red-600">
                    {formatPrice(wishlist.reduce((total, item) => total + (item.selectedVariation?.price || item.price), 0))}
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  wishlist.forEach(item => handleAddToCart(item));
                }}
                disabled={wishlist.length === 0}
                className={`w-full py-3 rounded-lg font-semibold transition-all ${
                  wishlist.length > 0
                    ? "bg-red-800 text-white hover:bg-red-900"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Add All to Cart
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
      </div>
    </div>
  );
};

export default WishlistPage;
