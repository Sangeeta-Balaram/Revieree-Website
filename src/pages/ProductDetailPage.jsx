import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import {
  Heart,
  ShoppingCart,
  ArrowLeft,
  Plus,
  Minus,
  Star,
  Truck,
  Shield,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { getProductsByCategory } from "../utils/storage";
import {
  addToCart,
  addToWishlist,
  removeFromWishlist,
  isInWishlist,
} from "../utils/cart";
import heroBgImg from "../assets/images/adc8fc81eac678aba089250ca3074d47.jpg";

const ProductDetailPage = () => {
  const { category, productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariation, setSelectedVariation] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isInWishlistState, setIsInWishlistState] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const reviewsRef = useRef(null);

  useEffect(() => {
    const loadProduct = () => {
      const categoryType =
        category === "fragrance" || category === "fragrances"
          ? "fragrance"
          : "cosmetic";
      const products = getProductsByCategory(categoryType);

      console.log("Debug info:", {
        category,
        categoryType,
        productId,
        availableProducts: products.map((p) => ({
          name: p.name,
          slug: p.name.toLowerCase().replace(/\s+/g, "-"),
        })),
      });

      const foundProduct = products.find(
        (p) => p.name.toLowerCase().replace(/\s+/g, "-") === productId
      );

      console.log("Found product:", foundProduct);

      if (foundProduct) {
        setProduct(foundProduct);
        setSelectedVariation(foundProduct.variations?.[0] || null);
        setIsInWishlistState(isInWishlist(foundProduct.id));
      }

      setLoading(false);
    };

    loadProduct();
  }, [category, productId]);

  const allMedia = product
    ? [
        product.image,
        // Add some dummy variations for testing - remove these when you have real multiple images
        ...(product.image
          ? [
              product.image,
              product.image,
              product.image,
              product.image,
              product.image,
              product.image,
              product.image,
              product.image,
            ]
          : []),
        ...(product.video ? ["video"] : []),
      ]
    : [];

  // Pagination for thumbnails
  const [thumbnailStartIndex, setThumbnailStartIndex] = useState(0);
  const thumbnailsPerPage = 4;
  const currentThumbnails = allMedia.slice(
    thumbnailStartIndex,
    thumbnailStartIndex + thumbnailsPerPage
  );
  const canGoNext = thumbnailStartIndex + thumbnailsPerPage < allMedia.length;
  const canGoPrev = thumbnailStartIndex > 0;

  const handleAddToCart = () => {
    if (!product) return;

    const productToAdd = selectedVariation
      ? { ...product, selectedVariation, price: selectedVariation.price }
      : product;

    for (let i = 0; i < quantity; i++) {
      addToCart(productToAdd);
    }
    // Cart count will update automatically in navigation
  };

  const handleToggleWishlist = () => {
    if (!product) return;

    if (isInWishlistState) {
      removeFromWishlist(product.id);
      setIsInWishlistState(false);
    } else {
      addToWishlist(product);
      setIsInWishlistState(true);
    }
  };

  const navigateImage = (direction) => {
    if (direction === "next") {
      setCurrentImageIndex((prev) => (prev + 1) % allMedia.length);
    } else {
      setCurrentImageIndex(
        (prev) => (prev - 1 + allMedia.length) % allMedia.length
      );
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading product...</div>
      </div>
    );
  }

  const categoryRoute =
    category === "fragrance" || category === "fragrances"
      ? "fragrances"
      : "cosmetics";
  const displayName =
    category === "fragrance" || category === "fragrances"
      ? "Fragrances"
      : "Cosmetics";

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Product Not Found
          </h2>
          <button
            onClick={() => navigate(`/products/${categoryRoute}`)}
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Back to {displayName}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-0 pb-16">
      {/* Hero Section - Background Image with Golden Shop Text */}
      <section className="relative h-[50vh] min-h-[300px] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={heroBgImg}
            alt="Shop Hero Background"
            className="w-full h-full object-cover"
          />
          {/* Light Overlay for better text visibility */}
          <div className="absolute inset-0 bg-black/15"></div>
        </div>

        {/* Centered Content */}
        <div className="relative h-full flex items-center justify-center px-6">
          <div className="text-center">
            {/* Golden Shop Text - Matching About Page Font Style */}
            <h1
              className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
              style={{
                color: "#FF8C00",
                textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
              }}
            >
              SHOP
            </h1>

            {/* Product Name Preview */}
            <p
              className="text-xl md:text-2xl text-white mb-8 font-light"
              style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.8)" }}
            >
              {product?.name || "Premium Collection"}
            </p>
          </div>
        </div>
      </section>

      <div className="container-custom pt-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <button
            onClick={() => navigate(`/products/${categoryRoute}`)}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={18} className="mr-2" />
            <span className="text-sm">Back to {displayName}</span>
          </button>
        </nav>

        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images - Left Side */}
          <div className="space-y-6">
            {/* Main Image */}
            <div className="relative">
              {/* Main Image Container */}
              <div className="relative h-[450px] bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100">
                {allMedia[currentImageIndex] === "video" ? (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl mb-4">📹</div>
                      <div className="text-xl text-gray-600">Product Video</div>
                    </div>
                  </div>
                ) : (
                  <img
                    src={allMedia[currentImageIndex]}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                )}

                {/* Navigation Buttons - Squared with 5% Rounding */}
                {allMedia.length > 1 && (
                  <>
                    <button
                      onClick={() => navigateImage("prev")}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/95 hover:bg-white text-gray-800 p-3 rounded-[5%] shadow-lg transition-all hover:scale-110"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={() => navigateImage("next")}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-red-800/95 hover:bg-red-800 text-white p-3 rounded-[5%] shadow-lg transition-all hover:scale-110"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}

                {/* Image Counter */}
                {allMedia.length > 1 && (
                  <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded-full text-sm font-medium">
                    {currentImageIndex + 1} / {allMedia.length}
                  </div>
                )}
              </div>
            </div>

            {/* Image Gallery: Big Main Image + 4 Square Thumbnails Below */}
            {allMedia.length > 1 && (
              <div className="space-y-3">
                {/* 4 Square Thumbnails Spread Across Full Width */}
                <div className="flex gap-3 justify-between">
                  {currentThumbnails.map((media, index) => {
                    const actualIndex = thumbnailStartIndex + index;
                    return (
                      <button
                        key={actualIndex}
                        onClick={() => setCurrentImageIndex(actualIndex)}
                        className={`relative w-24 h-24 rounded-lg overflow-hidden border-2 transition-all hover:scale-105 hover:shadow-md flex-1 ${
                          actualIndex === currentImageIndex
                            ? "border-blue-500 shadow-lg ring-2 ring-blue-200"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        {media === "video" ? (
                          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                            <div className="text-2xl">📹</div>
                          </div>
                        ) : (
                          <img
                            src={media}
                            alt={`${product.name} ${actualIndex + 1}`}
                            className="w-full h-full object-cover"
                          />
                        )}
                        {actualIndex === currentImageIndex && (
                          <div className="absolute inset-0 bg-blue-500/20 pointer-events-none"></div>
                        )}
                      </button>
                    );
                  })}

                  {/* Fill remaining slots if less than 4 images in current set */}
                  {currentThumbnails.length < 4 &&
                    [...Array(4 - currentThumbnails.length)].map((_, index) => (
                      <div
                        key={`empty-${index}`}
                        className="w-24 h-24 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 flex-1"
                      ></div>
                    ))}
                </div>

                {/* Navigation Arrows for Thumbnail Pages */}
                {allMedia.length > thumbnailsPerPage && (
                  <div className="flex justify-center items-center gap-4">
                    <button
                      onClick={() =>
                        setThumbnailStartIndex(
                          Math.max(0, thumbnailStartIndex - thumbnailsPerPage)
                        )
                      }
                      disabled={!canGoPrev}
                      className={`p-2 rounded-full transition-all ${
                        canGoPrev
                          ? "bg-gray-200 hover:bg-gray-300 text-gray-700 hover:scale-110"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <span className="text-sm text-gray-600">
                      {thumbnailStartIndex + 1}-
                      {Math.min(
                        thumbnailStartIndex + thumbnailsPerPage,
                        allMedia.length
                      )}{" "}
                      of {allMedia.length}
                    </span>
                    <button
                      onClick={() =>
                        setThumbnailStartIndex(
                          Math.min(
                            thumbnailStartIndex + thumbnailsPerPage,
                            Math.max(0, allMedia.length - thumbnailsPerPage)
                          )
                        )
                      }
                      disabled={!canGoNext}
                      className={`p-2 rounded-full transition-all ${
                        canGoNext
                          ? "bg-gray-200 hover:bg-gray-300 text-gray-700 hover:scale-110"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Product Info - Right Side - Container Matching Full Height */}
          <div className="h-[600px] flex flex-col justify-between">
            <div className="flex flex-col justify-between h-full space-y-3">
              {/* 1. Category */}
              <h3 className="text-gray-600 font-medium text-sm uppercase tracking-wide">
                {category === "fragrance" || category === "fragrances"
                  ? "Fragrance"
                  : "Cosmetics"}
              </h3>

              {/* 2. Product Name and Tag */}
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-3xl font-bold text-gray-900 leading-tight flex-1">
                  {product.name}
                </h2>
                {/* Premium Badge */}
                <div
                  className={`px-3 py-1 rounded-full font-bold text-xs text-white shadow-lg transform hover:scale-105 transition-all flex-shrink-0 ${
                    product.featured
                      ? "bg-gradient-to-r from-red-500 via-red-600 to-red-700"
                      : "bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700"
                  }`}
                >
                  {product.featured ? "BESTSELLER" : "LUXURY"}
                </div>
              </div>

              {/* 3. Rating and Reviews */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={
                        i < 4 ? "text-yellow-400 fill-current" : "text-gray-300"
                      }
                    />
                  ))}
                  <span className="ml-2 text-sm font-bold text-gray-900">
                    4.0
                  </span>
                </div>
                <span
                  className="text-sm text-black hover:text-gray-700 cursor-pointer underline font-medium"
                  onClick={() =>
                    reviewsRef.current?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  234 reviews
                </span>
              </div>

              {/* 4. Price */}
              <div className="flex items-center space-x-3">
                <span className="text-2xl font-bold text-red-600">
                  {formatPrice(selectedVariation?.price || product.price)}
                </span>
                <span className="text-lg text-gray-500 line-through">
                  {formatPrice(
                    Math.round(
                      (selectedVariation?.price || product.price) * 1.3
                    )
                  )}
                </span>
              </div>

              {/* 5. Product Description (2 lines) */}
              <div className="text-gray-700 leading-relaxed">
                <p>{product.description}</p>
              </div>

              {/* 6. Size/Volume Label */}
              <div className="text-sm font-medium text-gray-900">
                {category === "fragrance" || category === "fragrances"
                  ? "Size"
                  : "Volume"}
              </div>

              {/* 7. Variants - Rounded */}
              {product.variations && product.variations.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {product.variations.map((variation) => (
                    <button
                      key={variation.id}
                      onClick={() => setSelectedVariation(variation)}
                      className={`px-4 py-2 rounded-full border-2 transition-all font-medium hover:scale-105 transform text-sm ${
                        selectedVariation?.id === variation.id
                          ? "border-red-800 bg-red-800 text-white shadow-md"
                          : "border-gray-200 hover:border-gray-300 bg-white hover:shadow-sm"
                      }`}
                    >
                      {category === "fragrance" || category === "fragrances"
                        ? variation.size
                        : variation.shade}
                    </button>
                  ))}
                </div>
              )}

              {/* 8. Quantity and Action Buttons */}
              <div className="flex items-center space-x-3">
                <div className="flex items-center border-2 border-gray-200 rounded-lg bg-white shadow-sm">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-gray-100 transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="px-3 py-2 font-bold text-base w-16 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 hover:bg-gray-100 transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={
                    (selectedVariation?.stock || product.totalStock) <= 0
                  }
                  className={`h-12 px-4 rounded-full transition-all font-bold hover:scale-105 flex items-center justify-center space-x-2 shadow-lg ${
                    (selectedVariation?.stock || product.totalStock) > 0
                      ? "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  <ShoppingCart size={18} />
                  <span>Add to Cart</span>
                </button>

                <button
                  className={`h-12 px-6 rounded-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white transition-all font-bold hover:scale-105 shadow-lg ${
                    (selectedVariation?.stock || product.totalStock) <= 0
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  disabled={
                    (selectedVariation?.stock || product.totalStock) <= 0
                  }
                >
                  Buy Now
                </button>

                <button
                  onClick={handleToggleWishlist}
                  className={`h-12 w-12 rounded-full border-2 transition-all hover:scale-110 flex items-center justify-center ${
                    isInWishlistState
                      ? "border-red-500 bg-red-50 text-red-600 shadow-lg"
                      : "border-gray-200 hover:border-gray-300 bg-white hover:shadow-lg"
                  }`}
                >
                  <Heart
                    size={18}
                    fill={isInWishlistState ? "currentColor" : "none"}
                    className="mx-auto"
                  />
                </button>
              </div>

              {/* Thin Line After Action Buttons */}
              <div className="border-t border-gray-200"></div>

              {/* 9. Product Details - Quality, Longevity, Suitable For */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">
                  Product Details
                </h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-red-600 mb-1">
                      8+ Hours
                    </div>
                    <div className="text-xs text-gray-600">Longevity</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-red-600 mb-1">
                      Premium
                    </div>
                    <div className="text-xs text-gray-600">Quality</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-red-600 mb-1">
                      All Types
                    </div>
                    <div className="text-xs text-gray-600">Suitable For</div>
                  </div>
                </div>
              </div>

              {/* Thin Line After Product Details */}
              <div className="border-t border-gray-200"></div>
            </div>
          </div>
        </div>

        {/* Tabbed Content Section */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-16 mt-8">
          {/* Tab Headers */}
          <div className="border-b border-gray-200">
            <div className="flex justify-center space-x-8">
              <button
                onClick={() => setActiveTab("description")}
                className={`py-4 px-6 transition-all border-b-2 ${
                  activeTab === "description"
                    ? "border-red-600 text-red-600 font-bold"
                    : "border-transparent text-gray-500 hover:text-gray-700 font-medium"
                }`}
              >
                Description
              </button>
              <button
                onClick={() => setActiveTab("additional")}
                className={`py-4 px-6 transition-all border-b-2 ${
                  activeTab === "additional"
                    ? "border-red-600 text-red-600 font-bold"
                    : "border-transparent text-gray-500 hover:text-gray-700 font-medium"
                }`}
              >
                Additional Information
              </button>
              <button
                onClick={() => setActiveTab("review")}
                className={`py-4 px-6 transition-all border-b-2 ${
                  activeTab === "review"
                    ? "border-red-600 text-red-600 font-bold"
                    : "border-transparent text-gray-500 hover:text-gray-700 font-medium"
                }`}
              >
                Review
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {/* Description Tab - Product Details */}
            {activeTab === "description" && (
              <div className="space-y-8">
                {/* Product Description Paragraph */}
                <div className="bg-gradient-to-r from-red-50 to-rose-50 rounded-xl p-8 border border-red-100">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                    About {product.name}
                  </h3>
                  <p className="text-gray-700 text-lg leading-relaxed text-center">
                    {product.description} This exceptional creation embodies the
                    perfect balance of sophistication and allure, designed for
                    those who appreciate the finer things in life. Crafted with
                    premium ingredients and meticulous attention to detail, this
                    product delivers an unparalleled experience that lasts
                    throughout the day.
                  </p>
                  {/* Notes and Occasion from earlier design */}
                  <div className="mt-6 pt-6 border-t border-red-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="text-center">
                        <h4 className="font-semibold text-gray-900 mb-3">
                          Perfect For
                        </h4>
                        <p className="text-gray-700">
                          Daily wear, special occasions, evening events, gift
                          giving
                        </p>
                      </div>
                      <div className="text-center">
                        <h4 className="font-semibold text-gray-900 mb-3">
                          Scent Notes
                        </h4>
                        <div className="flex flex-wrap gap-2 justify-center">
                          {product.notes?.map((note, index) => (
                            <span
                              key={index}
                              className="px-3 py-2 bg-white rounded-full text-sm font-medium text-rose-700 border border-rose-200"
                            >
                              {note}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Product Details - Single Vertical Lines */}
                <div className="bg-white rounded-xl p-8 border border-gray-100 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">
                    Product Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <span className="text-gray-600 w-48 text-right">
                        SKU:
                      </span>
                      <span className="font-medium text-gray-900 ml-4">
                        REV-{product.id.toString().padStart(4, "0")}
                      </span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-gray-600 w-48 text-right">
                        Category:
                      </span>
                      <span className="font-medium text-gray-900 ml-4">
                        {category === "fragrance" || category === "fragrances"
                          ? "Fragrance"
                          : "Cosmetics"}
                      </span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-gray-600 w-48 text-right">
                        Type:
                      </span>
                      <span className="font-medium text-gray-900 ml-4">
                        {product.featured ? "Bestseller" : "Luxury"}
                      </span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-gray-600 w-48 text-right">
                        Texture:
                      </span>
                      <span className="font-medium text-gray-900 ml-4">
                        {product.texture}
                      </span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-gray-600 w-48 text-right">
                        Longevity:
                      </span>
                      <span className="font-medium text-gray-900 ml-4">
                        8+ Hours
                      </span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-gray-600 w-48 text-right">
                        Quality:
                      </span>
                      <span className="font-medium text-gray-900 ml-4">
                        Premium Grade
                      </span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-gray-600 w-48 text-right">
                        Intensity:
                      </span>
                      <span className="font-medium text-gray-900 ml-4">
                        Moderate
                      </span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-gray-600 w-48 text-right">
                        Season:
                      </span>
                      <span className="font-medium text-gray-900 ml-4">
                        All Year
                      </span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-gray-600 w-48 text-right">
                        Olfactory Family:
                      </span>
                      <span className="font-medium text-gray-900 ml-4">
                        {product.olfactoryFamily}
                      </span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-gray-600 w-48 text-right">
                        Key Notes:
                      </span>
                      <span className="font-medium text-gray-900 ml-4">
                        {product.notes?.join(", ")}
                      </span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-gray-600 w-48 text-right">
                        Suitable For:
                      </span>
                      <span className="font-medium text-gray-900 ml-4">
                        All Skin Types
                      </span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-gray-600 w-48 text-right">
                        Presentation:
                      </span>
                      <span className="font-medium text-gray-900 ml-4">
                        Elegant
                      </span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-gray-600 w-48 text-right">
                        Gift Ready:
                      </span>
                      <span className="font-medium text-gray-900 ml-4">
                        Perfect Choice
                      </span>
                    </div>

                    {/* Spacing before checkboxes */}
                    <div className="pt-4"></div>

                    {/* Quality checkboxes in dark red */}
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked
                        readOnly
                        className="w-4 h-4 text-red-800 bg-red-800 border-red-800 rounded focus:ring-red-800 accent-red-800"
                      />
                      <span className="text-gray-700 ml-3">
                        Dermatologically Tested
                      </span>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked
                        readOnly
                        className="w-4 h-4 text-red-800 bg-red-800 border-red-800 rounded focus:ring-red-800 accent-red-800"
                      />
                      <span className="text-gray-700 ml-3">
                        Cruelty-Free Formulation
                      </span>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked
                        readOnly
                        className="w-4 h-4 text-red-800 bg-red-800 border-red-800 rounded focus:ring-red-800 accent-red-800"
                      />
                      <span className="text-gray-700 ml-3">
                        Natural Essential Oils
                      </span>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked
                        readOnly
                        className="w-4 h-4 text-red-800 bg-red-800 border-red-800 rounded focus:ring-red-800 accent-red-800"
                      />
                      <span className="text-gray-700 ml-3">
                        Premium Grade Ingredients
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Additional Information Tab */}
            {activeTab === "additional" && (
              <div className="space-y-8">
                {(category === "fragrance" || category === "fragrances") ? (
                  /* FRAGRANCE CONTENT */
                  <>
                    {/* How to Wear This Scent - Ritual Style */}
                    <div className="bg-gradient-to-r from-red-50 to-wine-50 rounded-xl p-8 border border-red-100">
                      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                        <span className="w-3 h-3 bg-red-800 rounded-full mr-3"></span>
                        How to Wear It
                      </h3>
                      <p className="text-gray-700 text-lg leading-relaxed">
                        This fragrance is designed to be worn close to the skin, unfolding slowly as the day progresses. Apply it on clean, moisturised skin to allow the notes to bloom naturally. Focus on pulse points—behind the ears, along the neck, wrists, and the hollow of the collarbone—where body heat enhances projection and depth. A gentle spray is enough; this scent is meant to linger, not announce itself.
                      </p>
                    </div>

                    {/* Application Guide - Short Points */}
                    <div className="bg-white rounded-xl p-8 border border-gray-100 shadow-sm">
                      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                        <span className="w-3 h-3 bg-wine-700 rounded-full mr-3"></span>
                        Application Guide
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-red-700 rounded-full mr-3"></div>
                          <span className="text-gray-700">
                            Spray from <strong>15–20 cm away</strong> for even diffusion
                          </span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-red-700 rounded-full mr-3"></div>
                          <span className="text-gray-700">
                            Apply <strong>2–4 sprays</strong> depending on intensity preference
                          </span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-red-700 rounded-full mr-3"></div>
                          <span className="text-gray-700">
                            Avoid rubbing wrists together — let the scent settle naturally
                          </span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-red-700 rounded-full mr-3"></div>
                          <span className="text-gray-700">
                            For a softer trail, mist once into the air and walk through
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Styling the Scent - Fashion + Mood Pairing */}
                    <div className="bg-white rounded-xl p-8 border border-gray-100 shadow-sm">
                      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                        <span className="w-3 h-3 bg-burgundy-700 rounded-full mr-3"></span>
                        How to Style This Fragrance
                      </h3>
                      <p className="text-gray-700 text-lg leading-relaxed mb-6">
                        This scent pairs beautifully with understated elegance and intentional dressing. Think less trend-driven, more timeless.
                      </p>
                      <div className="space-y-4">
                        <div className="bg-red-50 rounded-lg p-4">
                          <h4 className="font-semibold text-red-900 mb-2">Daywear:</h4>
                          <p className="text-red-800">Linen shirts, soft cotton dresses, neutral tones</p>
                        </div>
                        <div className="bg-red-50 rounded-lg p-4">
                          <h4 className="font-semibold text-red-900 mb-2">Evening:</h4>
                          <p className="text-red-800">Silks, satins, structured blazers, darker hues</p>
                        </div>
                        <div className="bg-red-50 rounded-lg p-4">
                          <h4 className="font-semibold text-red-900 mb-2">Mood:</h4>
                          <p className="text-red-800">Confident, calm, quietly magnetic</p>
                        </div>
                        <div className="bg-red-50 rounded-lg p-4">
                          <h4 className="font-semibold text-red-900 mb-2">Energy:</h4>
                          <p className="text-red-800">Effortless sophistication, never overpowering</p>
                        </div>
                      </div>
                      <p className="text-gray-600 italic mt-4 text-sm">
                        Perfect for those who prefer their presence to be felt after they've left the room.
                      </p>
                    </div>

                    {/* Best Occasions - Occasion Mapping */}
                    <div className="bg-white rounded-xl p-8 border border-gray-100 shadow-sm">
                      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                        <span className="w-3 h-3 bg-wine-800 rounded-full mr-3"></span>
                        Best Occasions
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-red-800 rounded-full mr-3"></div>
                          <span className="text-gray-700">Intimate dinners & date nights</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-red-800 rounded-full mr-3"></div>
                          <span className="text-gray-700">Workdays with quiet confidence</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-red-800 rounded-full mr-3"></div>
                          <span className="text-gray-700">Art events, galleries, slow evenings</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-red-800 rounded-full mr-3"></div>
                          <span className="text-gray-700">Gifting for subtle luxury lovers</span>
                        </div>
                      </div>
                      <p className="text-gray-600 italic mt-4 text-sm">
                        This is not a loud fragrance. It is a remembered one.
                      </p>
                    </div>

                    {/* Make It Last Longer - Value-Adding */}
                    <div className="bg-white rounded-xl p-8 border border-gray-100 shadow-sm">
                      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                        <span className="w-3 h-3 bg-burgundy-800 rounded-full mr-3"></span>
                        Make It Last Longer
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-red-900 rounded-full mr-3"></div>
                          <span className="text-gray-700">Moisturise skin before application</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-red-900 rounded-full mr-3"></div>
                          <span className="text-gray-700">Apply on fabric sparingly (scarves, inner collar — patch test first)</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-red-900 rounded-full mr-3"></div>
                          <span className="text-gray-700">Store away from heat and direct sunlight</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-red-900 rounded-full mr-3"></div>
                          <span className="text-gray-700">Reapply lightly after 6–8 hours if needed</span>
                        </div>
                      </div>
                    </div>

                    {/* Layering Notes - Advanced Users */}
                    <div className="bg-white rounded-xl p-8 border border-gray-100 shadow-sm">
                      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                        <span className="w-3 h-3 bg-wine-900 rounded-full mr-3"></span>
                        Layering Notes
                      </h3>
                      <p className="text-gray-700 text-lg leading-relaxed mb-4">
                        For a more personalised experience, this fragrance can be layered with:
                      </p>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-burgundy-900 rounded-full mr-3"></div>
                          <span className="text-gray-700">A light vanilla or musk base for warmth</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-burgundy-900 rounded-full mr-3"></div>
                          <span className="text-gray-700">A citrus top note for daytime freshness</span>
                        </div>
                      </div>
                      <p className="text-gray-600 italic mt-4 text-sm">
                        Layering allows the scent to become uniquely yours.
                      </p>
                    </div>
                  </>
                ) : (
                  /* COSMETICS CONTENT */
                  <>
                    {/* How to Use - Core Ritual */}
                    <div className="bg-gradient-to-r from-red-50 to-wine-50 rounded-xl p-8 border border-red-100">
                      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                        <span className="w-3 h-3 bg-red-800 rounded-full mr-3"></span>
                        How to Use
                      </h3>
                      <p className="text-gray-700 text-lg leading-relaxed">
                        This product is designed to blend effortlessly into your routine. Start with clean, prepped skin to achieve the most natural and long-lasting finish. Use a small amount first, building gradually until you reach your desired intensity. The formula adapts beautifully to your skin, allowing control without heaviness.
                      </p>
                    </div>

                    {/* Application Tips - Technique-Focused */}
                    <div className="bg-white rounded-xl p-8 border border-gray-100 shadow-sm">
                      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                        <span className="w-3 h-3 bg-wine-700 rounded-full mr-3"></span>
                        Application Tips
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-red-700 rounded-full mr-3"></div>
                          <span className="text-gray-700">
                            Use <strong>fingertips for a natural, skin-like finish</strong>
                          </span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-red-700 rounded-full mr-3"></div>
                          <span className="text-gray-700">
                            Use a <strong>brush for precision and definition</strong>
                          </span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-red-700 rounded-full mr-3"></div>
                          <span className="text-gray-700">
                            Use a <strong>sponge for soft blending and diffusion</strong>
                          </span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-red-700 rounded-full mr-3"></div>
                          <span className="text-gray-700">
                            Always blend outward for seamless edges
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-600 italic mt-4 text-sm">
                        Less product, better blending — that's the secret.
                      </p>
                    </div>

                    {/* How to Style This Look - Look-Based */}
                    <div className="bg-white rounded-xl p-8 border border-gray-100 shadow-sm">
                      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                        <span className="w-3 h-3 bg-burgundy-700 rounded-full mr-3"></span>
                        How to Style This Look
                      </h3>
                      <p className="text-gray-700 text-lg leading-relaxed mb-6">
                        This cosmetic is made to move with your mood. Whether you prefer minimal elegance or a more defined statement, it adapts without overpowering your natural features.
                      </p>
                      <div className="space-y-4">
                        <div className="bg-red-50 rounded-lg p-4">
                          <h4 className="font-semibold text-red-900 mb-2">Minimal Look:</h4>
                          <p className="text-red-800">Fresh skin, soft lips, brushed brows</p>
                        </div>
                        <div className="bg-red-50 rounded-lg p-4">
                          <h4 className="font-semibold text-red-900 mb-2">Everyday Glam:</h4>
                          <p className="text-red-800">Defined eyes or lips, subtle highlight</p>
                        </div>
                        <div className="bg-red-50 rounded-lg p-4">
                          <h4 className="font-semibold text-red-900 mb-2">Evening Look:</h4>
                          <p className="text-red-800">Layered intensity with clean contours</p>
                        </div>
                      </div>
                      <p className="text-gray-600 italic mt-4 text-sm">
                        This product enhances — it never masks.
                      </p>
                    </div>

                    {/* Finish & Feel - Sensory */}
                    <div className="bg-white rounded-xl p-8 border border-gray-100 shadow-sm">
                      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                        <span className="w-3 h-3 bg-wine-800 rounded-full mr-3"></span>
                        Finish & Feel
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-red-800 rounded-full mr-3"></div>
                          <span className="text-gray-700">Lightweight and comfortable on skin</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-red-800 rounded-full mr-3"></div>
                          <span className="text-gray-700">Non-cakey, breathable texture</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-red-800 rounded-full mr-3"></div>
                          <span className="text-gray-700">Designed for all-day wear</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-red-800 rounded-full mr-3"></div>
                          <span className="text-gray-700">Feels natural even after hours</span>
                        </div>
                      </div>
                      <p className="text-gray-600 italic mt-4 text-sm">
                        Your skin, just more refined.
                      </p>
                    </div>

                    {/* Best For - Lifestyle Mapping */}
                    <div className="bg-white rounded-xl p-8 border border-gray-100 shadow-sm">
                      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                        <span className="w-3 h-3 bg-burgundy-800 rounded-full mr-3"></span>
                        Best For
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-red-900 rounded-full mr-3"></div>
                          <span className="text-gray-700">Daily wear</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-red-900 rounded-full mr-3"></div>
                          <span className="text-gray-700">Long workdays</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-red-900 rounded-full mr-3"></div>
                          <span className="text-gray-700">Events and occasions</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-red-900 rounded-full mr-3"></div>
                          <span className="text-gray-700">Travel-friendly routines</span>
                        </div>
                      </div>
                      <p className="text-gray-600 italic mt-4 text-sm">
                        Made for real life, not just mirrors.
                      </p>
                    </div>

                    {/* Pro Tips - Trust Builder */}
                    <div className="bg-white rounded-xl p-8 border border-gray-100 shadow-sm">
                      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                        <span className="w-3 h-3 bg-wine-900 rounded-full mr-3"></span>
                        Pro Tips
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-burgundy-900 rounded-full mr-3"></div>
                          <span className="text-gray-700">Set lightly with powder only where needed</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-burgundy-900 rounded-full mr-3"></div>
                          <span className="text-gray-700">Pair with a hydrating base for smoother application</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-burgundy-900 rounded-full mr-3"></div>
                          <span className="text-gray-700">Remove gently at the end of the day — your skin will thank you</span>
                        </div>
                      </div>
                    </div>

                    {/* Skin Compatibility - Reassurance */}
                    <div className="bg-gradient-to-r from-red-50 to-burgundy-50 rounded-xl p-8 border border-red-200">
                      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                        <span className="w-3 h-3 bg-red-900 rounded-full mr-3"></span>
                        Skin Compatibility
                      </h3>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <span className="text-2xl text-red-700">✓</span>
                          </div>
                          <p className="text-gray-700 font-medium">Suitable for all skin types</p>
                        </div>
                        <div className="text-center">
                          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <span className="text-2xl text-red-700">✓</span>
                          </div>
                          <p className="text-gray-700 font-medium">Gentle on everyday use</p>
                        </div>
                        <div className="text-center">
                          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <span className="text-2xl text-red-700">✓</span>
                          </div>
                          <p className="text-gray-700 font-medium">Designed for comfort, not irritation</p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Review Tab */}
            {activeTab === "review" && (
              <div ref={reviewsRef}>
                {/* Reviews Section */}
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
                    <div className="text-center">
                      <div className="text-5xl font-bold text-gray-900 mb-3">
                        4.0
                      </div>
                      <div className="flex items-center justify-center mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={24}
                            className={
                              i < 4
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }
                          />
                        ))}
                      </div>
                      <div className="text-gray-600 text-lg">234 ratings</div>
                    </div>

                    <div className="space-y-3">
                      {[5, 4, 3, 2, 1].map((stars) => (
                        <div
                          key={stars}
                          className="flex items-center space-x-3"
                        >
                          <span className="text-sm font-medium text-gray-700 w-12">
                            {stars} ★
                          </span>
                          <div className="flex-1 bg-gray-200 rounded-full h-3">
                            <div
                              className="bg-yellow-400 h-3 rounded-full"
                              style={{
                                width:
                                  stars === 5
                                    ? "60%"
                                    : stars === 4
                                    ? "25%"
                                    : stars === 3
                                    ? "10%"
                                    : "3%",
                              }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-700 w-12">
                            {stars === 5
                              ? "60%"
                              : stars === 4
                              ? "25%"
                              : stars === 3
                              ? "10%"
                              : "3%"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-8">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="border-b border-gray-200 pb-8 last:border-b-0"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="flex">
                              {[...Array(5)].map((_, starIndex) => (
                                <Star
                                  key={starIndex}
                                  size={16}
                                  className={
                                    starIndex < (i === 1 ? 5 : i === 2 ? 4 : 3)
                                      ? "text-yellow-400 fill-current"
                                      : "text-gray-300"
                                  }
                                />
                              ))}
                            </div>
                            <span className="font-semibold text-gray-900">
                              Customer {i}
                            </span>
                          </div>
                          <span className="text-sm text-gray-500">
                            2 months ago
                          </span>
                        </div>
                        <p className="text-gray-700 text-lg leading-relaxed">
                          {i === 1
                            ? "Absolutely love this product! The quality is amazing and it smells incredible. Definitely worth the price. Will definitely buy again!"
                            : i === 2
                            ? "Good product overall. Nice packaging and fast delivery. The scent is pleasant but not too strong. Great for daily use."
                            : "It's okay for the price. Does what it claims but I've tried better products in this range. Good value for money though."}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Product Recommendations Section */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-16">
          <div className="p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              You May Also Like
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Get similar products from the same category */}
              {(() => {
                const categoryType =
                  category === "fragrance" || category === "fragrances"
                    ? "fragrance"
                    : "cosmetic";
                const allProducts = getProductsByCategory(categoryType);
                const similarProducts = allProducts
                  .filter((p) => p.id !== product.id)
                  .slice(0, 4);

                return similarProducts.map((recProduct) => (
                  <div
                    key={recProduct.id}
                    className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
                    onClick={() => {
                      const productSlug = recProduct.name
                        .toLowerCase()
                        .replace(/\s+/g, "-");
                      navigate(
                        `/product/${categoryRoute}/${productSlug}`
                      );
                    }}
                  >
                    {/* Product Image */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={recProduct.image}
                        alt={recProduct.name}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                      
                      {/* Corner Badge */}
                      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                        <div className="absolute top-6 left-[-45px] transform -rotate-45 origin-center flex justify-center items-center">
                          <div
                            className="bg-red-800 text-white text-[8px] font-bold py-1 px-2 shadow-lg text-center w-32 flex justify-center items-center tracking-tight"
                            style={{ paddingLeft: "55px", paddingRight: "35px" }}
                          >
                            {recProduct.featured ? "BESTSELLER" : "LUXURY"}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="p-4 space-y-2">
                      <h4 className="font-semibold text-gray-900 line-clamp-1 text-sm">
                        {recProduct.name}
                      </h4>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-lg font-bold text-red-600">
                          {formatPrice(recProduct.price)}
                        </div>
                        
                        {/* Quick Add to Cart */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(recProduct);
                            alert(`${recProduct.name} added to cart!`);
                          }}
                          className="p-2 bg-red-800 text-white rounded-full hover:bg-red-900 transition-colors"
                        >
                          <ShoppingCart size={14} />
                        </button>
                      </div>

                      {/* Rating */}
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={12}
                            className={
                              i < 4 ? "text-yellow-400 fill-current" : "text-gray-300"
                            }
                          />
                        ))}
                        <span className="ml-1 text-xs text-gray-600">4.0</span>
                      </div>
                    </div>
                  </div>
                ));
              })()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
