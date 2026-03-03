import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Heart, ShoppingCart, Search } from "lucide-react";
import { getProductsByCategory } from "../utils/storage";
import { addToCart, addToWishlist, removeFromWishlist, isInWishlist } from "../utils/cart";
import VintageOrnament from "../components/VintageOrnament";
import heroBgImg from "../assets/images/adc8fc81eac678aba089250ca3074d47.jpg";

// Product Card Component
const ProductCard = ({
  product,
  handleToggleWishlist,
  wishlistItems,
  handleAddToCart,
  handleImageClick,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedShade, setSelectedShade] = useState(
    product.variations?.[0]?.shade || "Default"
  );
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const allMedia = [
    ...(product.images || [product.image]),
    ...(product.video ? ["video"] : []),
  ];

  const selectedVariation = product.variations?.find(
    (v) => v.shade === selectedShade
  );
  const pricePerUnit = selectedVariation?.price || product.price || 0;
  const totalPrice = pricePerUnit * quantity;

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Product Image with Badge */}
      <div className="relative h-64 overflow-hidden">
        <div
          className="w-full h-full cursor-pointer"
          onClick={() => handleImageClick(product, currentImageIndex)}
        >
          {allMedia[currentImageIndex] === "video" ? (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-2">📹</div>
                <div className="text-sm text-gray-600">Product Video</div>
              </div>
            </div>
          ) : (
            <img
              src={allMedia[currentImageIndex]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Image Navigation */}
        {allMedia.length > 1 && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
            {allMedia.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex(index);
                }}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentImageIndex ? "bg-white" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        )}

        {/* Corner Ribbon Badge */}
        <div className="absolute top-0 left-0 z-10 w-full h-full overflow-hidden">
          <div className="absolute top-8 left-[-60px] transform -rotate-45 origin-center flex justify-center items-center">
            <div
              className="bg-pink-600 text-white text-[9px] font-bold py-1 px-2 shadow-lg text-center w-40 flex justify-center items-center tracking-tight"
              style={{ paddingLeft: "75px", paddingRight: "45px" }}
            >
              {product.featured ? "BESTSELLER" : "LUXURY"}
            </div>
          </div>
        </div>

        {/* Wishlist Heart */}
        <button
          onClick={() => handleToggleWishlist(product)}
          className={`absolute top-4 right-4 p-2 rounded-full transition-all z-10 ${
            wishlistItems.has(product.id)
              ? "bg-pink-500 text-white shadow-lg"
              : "bg-white text-gray-400 hover:bg-pink-50 hover:text-pink-500 shadow-md"
          }`}
        >
          <Heart
            size={16}
            fill={wishlistItems.has(product.id) ? "currentColor" : "none"}
          />
        </button>
      </div>

      {/* Product Info */}
      <div className="p-4 space-y-3">
        <h3
          className="font-semibold text-lg text-gray-900 line-clamp-1 cursor-pointer hover:text-pink-600 transition-colors"
          onClick={() => {
            window.location.href = `/product/cosmetic/${product.name.toLowerCase().replace(/\s+/g, '-')}`;
          }}
        >
          {product.name}
        </h3>

        <div className="text-xl font-bold text-gray-900">
          ₹{totalPrice.toLocaleString("en-IN")}
        </div>

        {/* Shade Label and Dropdown */}
        <div className="space-y-1">
          <label className="text-xs text-gray-600 font-medium">Shade</label>
          <select
            value={selectedShade}
            onChange={(e) => setSelectedShade(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-pink-500 transition-colors"
          >
            {product.variations?.map((variation) => (
              <option key={variation.id} value={variation.shade}>
                {variation.shade}
              </option>
            )) || <option>Default</option>}
          </select>
        </div>

        {/* Quantity and Add to Cart */}
        <div className="flex gap-2">
          {/* Quantity Selector */}
          <div className="flex-1 border border-gray-300 rounded-lg overflow-hidden">
            <div className="flex items-center h-10">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="flex-1 px-3 py-2 text-gray-600 hover:bg-gray-100 transition-colors text-sm font-medium"
              >
                -
              </button>
              <span className="px-3 py-2 text-sm font-medium border-x border-gray-300">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="flex-1 px-3 py-2 text-gray-600 hover:bg-gray-100 transition-colors text-sm font-medium"
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Cart Button - Pink */}
          <button
            onClick={() => {
              const variation = product.variations?.find(
                (v) => v.shade === selectedShade
              );
              handleAddToCart(product, variation, quantity);
            }}
            className="flex-1 bg-pink-600 text-white py-2 px-4 rounded-lg hover:bg-pink-700 transition-colors text-sm font-medium"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

const CosmeticsPage = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [showBestsellersOnly, setShowBestsellersOnly] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [wishlistItems, setWishlistItems] = useState(() => {
    const fetchedProducts = getProductsByCategory("cosmetic");

    const wishlistSet = new Set();
    fetchedProducts.forEach((product) => {
      if (isInWishlist(product.id)) {
        wishlistSet.add(product.id);
      }
    });
    return wishlistSet;
  });

  // Image popup state
  const [showImagePopup, setShowImagePopup] = useState(false);
  const [popupProduct, setPopupProduct] = useState(null);
  const [popupImageIndex, setPopupImageIndex] = useState(0);

  useEffect(() => {
    const allProducts = getProductsByCategory("cosmetic");

    const bestsellersFilter = searchParams.get("filter") === "bestsellers";
    setShowBestsellersOnly(bestsellersFilter);

    if (bestsellersFilter) {
      const bestsellers = allProducts.filter((product) => product.featured);
      setProducts(bestsellers);
    } else {
      setProducts(allProducts);
    }
  }, [searchParams]);

  const handleAddToCart = (product, variation = null, quantity = 1) => {
    for (let i = 0; i < quantity; i++) {
      const productToAdd = variation
        ? { ...product, selectedVariation: variation, price: variation.price }
        : product;
      addToCart(productToAdd);
    }
    // Cart count will update automatically in navigation
  };

  const handleToggleWishlist = (product) => {
    if (wishlistItems.has(product.id)) {
      removeFromWishlist(product.id);
      setWishlistItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(product.id);
        return newSet;
      });
    } else {
      addToWishlist(product);
      setWishlistItems((prev) => new Set([...prev, product.id]));
    }
  };

  const handleImageClick = (product, imageIndex) => {
    setPopupProduct(product);
    setPopupImageIndex(imageIndex);
    setShowImagePopup(true);
  };

  const closeImagePopup = () => {
    setShowImagePopup(false);
    setPopupProduct(null);
    setPopupImageIndex(0);
  };

  const navigateImage = (direction) => {
    if (!popupProduct) return;

    const allMedia = [
      ...(popupProduct.images || [popupProduct.image]),
      ...(popupProduct.video ? ["video"] : []),
    ];

    if (direction === "next") {
      setPopupImageIndex((prev) => (prev + 1) % allMedia.length);
    } else {
      setPopupImageIndex(
        (prev) => (prev - 1 + allMedia.length) % allMedia.length
      );
    }
  };

  const filteredProducts = products
    .filter((product) => {
      if (selectedCategory === "all") return true;
      if (selectedCategory === "bestsellers") return product.featured;
      return product.subcategory === selectedCategory;
    })
    .filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return 0;
    });

  return (
    <div className="min-h-screen pt-0 pb-16">
      {/* Hero Section - Full Background Image with Golden Title */}
      <section className="relative h-screen min-h-[600px] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={heroBgImg}
            alt="Luxury Cosmetics"
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
              COSMETICS
            </h1>

            {/* Subtitle */}
            <p
              className="text-xl md:text-2xl text-white mb-8 font-light"
              style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.8)" }}
            >
              Premium | Long-Lasting | Vibrant
            </p>
          </div>
        </div>
      </section>

      {/* Collection Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          {/* Heading and Subheading */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Cosmetic Collection
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our exquisite range of premium cosmetics crafted for
              every style and occasion
            </p>
          </div>

          {/* Filter Circles */}
          <div className="flex flex-wrap justify-center gap-6 mb-12">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`group relative w-24 h-24 rounded-full text-xs font-medium transition-all duration-300 border-2 hover:scale-110 hover:shadow-lg hover:border-opacity-100 flex items-center justify-center ${
                selectedCategory === "all"
                  ? "text-red-800 border-pink-300 shadow-xl scale-110 border-opacity-100 ring-2 ring-pink-400/50"
                  : "text-red-800 border-pink-200 border-opacity-50 hover:border-pink-300 hover:ring-2 hover:ring-pink-400/30"
              }`}
              style={{
                backgroundColor: "#F4E1E5",
                boxShadow:
                  selectedCategory === "all"
                    ? "0 0 20px rgba(251, 182, 193, 0.6)"
                    : "none",
              }}
            >
              All
            </button>

            <button
              onClick={() => setSelectedCategory("bestsellers")}
              className={`group relative w-24 h-24 rounded-full text-xs font-medium transition-all duration-300 border-2 hover:scale-110 hover:shadow-lg hover:border-opacity-100 flex items-center justify-center ${
                selectedCategory === "bestsellers"
                  ? "text-red-800 border-pink-300 shadow-xl scale-110 border-opacity-100 ring-2 ring-pink-400/50"
                  : "text-red-800 border-pink-200 border-opacity-50 hover:border-pink-300 hover:ring-2 hover:ring-pink-400/30"
              }`}
              style={{
                backgroundColor: "#F1D7DE",
                boxShadow:
                  selectedCategory === "bestsellers"
                    ? "0 0 20px rgba(251, 182, 193, 0.6)"
                    : "none",
              }}
            >
              Bestsellers
            </button>

            <button
              onClick={() => setSelectedCategory("luxury")}
              className={`group relative w-24 h-24 rounded-full text-xs font-medium transition-all duration-300 border-2 hover:scale-110 hover:shadow-lg hover:border-opacity-100 flex items-center justify-center ${
                selectedCategory === "luxury"
                  ? "text-red-800 border-pink-300 shadow-xl scale-110 border-opacity-100 ring-2 ring-pink-400/50"
                  : "text-red-800 border-pink-200 border-opacity-50 hover:border-pink-300 hover:ring-2 hover:ring-pink-400/30"
              }`}
              style={{
                backgroundColor: "#EFC9D9",
                boxShadow:
                  selectedCategory === "luxury"
                    ? "0 0 20px rgba(251, 182, 193, 0.6)"
                    : "none",
              }}
            >
              Luxury
            </button>

            <button
              onClick={() => setSelectedCategory("kajal")}
              className={`group relative w-24 h-24 rounded-full text-xs font-medium transition-all duration-300 border-2 hover:scale-110 hover:shadow-lg hover:border-opacity-100 flex items-center justify-center ${
                selectedCategory === "kajal"
                  ? "text-red-800 border-pink-300 shadow-xl scale-110 border-opacity-100 ring-2 ring-pink-400/50"
                  : "text-red-800 border-pink-200 border-opacity-50 hover:border-pink-300 hover:ring-2 hover:ring-pink-400/30"
              }`}
              style={{
                backgroundColor: "#ECBDD2",
                boxShadow:
                  selectedCategory === "kajal"
                    ? "0 0 20px rgba(251, 182, 193, 0.6)"
                    : "none",
              }}
            >
              Kajal
            </button>

            <button
              onClick={() => setSelectedCategory("lipstick")}
              className={`group relative w-24 h-24 rounded-full text-xs font-medium transition-all duration-300 border-2 hover:scale-110 hover:shadow-lg hover:border-opacity-100 flex items-center justify-center ${
                selectedCategory === "lipstick"
                  ? "text-red-800 border-pink-300 shadow-xl scale-110 border-opacity-100 ring-2 ring-pink-400/50"
                  : "text-red-800 border-pink-200 border-opacity-50 hover:border-pink-300 hover:ring-2 hover:ring-pink-400/30"
              }`}
              style={{
                backgroundColor: "#E9ADC9",
                boxShadow:
                  selectedCategory === "lipstick"
                    ? "0 0 20px rgba(251, 182, 193, 0.6)"
                    : "none",
              }}
            >
              Lipsticks
            </button>
          </div>
        </div>
      </section>

      {/* Collection Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-gray-600">No cosmetics found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  handleToggleWishlist={handleToggleWishlist}
                  wishlistItems={wishlistItems}
                  handleAddToCart={handleAddToCart}
                  handleImageClick={handleImageClick}
                />
              ))}
            </div>
          )}
        </div>
      </section>
      
      {/* Image Popup */}
      {showImagePopup && popupProduct && (
        <div
          className="fixed inset-0 bg-black z-[9999] flex items-center justify-center p-4"
          onClick={closeImagePopup}
        >
          <div
            className="relative max-w-6xl max-h-[90vh] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeImagePopup}
              className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Navigation Buttons */}
            <button
              onClick={() => navigateImage("prev")}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <button
              onClick={() => navigateImage("next")}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

            {/* Main Content */}
            <div className="flex items-center justify-center">
              {(() => {
                const allMedia = [
                  ...(popupProduct.images || [popupProduct.image]),
                  ...(popupProduct.video ? ["video"] : []),
                ];

                if (allMedia[popupImageIndex] === "video") {
                  return (
                    <div className="bg-gray-200 rounded-lg p-12">
                      <div className="text-center">
                        <div className="text-8xl mb-4">📹</div>
                        <div className="text-2xl text-gray-600">
                          Product Video
                        </div>
                        <p className="text-gray-500 mt-2">
                          Video playback coming soon!
                        </p>
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <img
                      src={allMedia[popupImageIndex]}
                      alt={popupProduct.name}
                      className="max-w-full max-h-[85vh] w-auto h-auto object-contain rounded-lg shadow-2xl"
                    />
                  );
                }
              })()}
            </div>

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/90 px-4 py-2 rounded-full">
              <span className="text-sm font-medium text-gray-800">
                {(() => {
                  const allMedia = [
                    ...(popupProduct.images || [popupProduct.image]),
                    ...(popupProduct.video ? ["video"] : []),
                  ];
                  return `${popupImageIndex + 1} / ${allMedia.length}`;
                })()}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CosmeticsPage;
