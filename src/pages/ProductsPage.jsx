import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Heart, ShoppingCart, Search, Star, Truck, Shield, CheckCircle } from 'lucide-react';
import { getProductsByCategory } from '../utils/storage';
import { addToCart, addToWishlist, removeFromWishlist, isInWishlist } from '../utils/cart';
import VintageOrnament from '../components/VintageOrnament';
import { motion } from 'framer-motion';

const ProductsPage = () => {
  const { category } = useParams();
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    const categoryType = category === 'fragrances' ? 'fragrance' : 'cosmetic';
    const allProducts = getProductsByCategory(categoryType);
    
    // Check if we should show only bestsellers
    const bestsellersFilter = searchParams.get('filter') === 'bestsellers';
    setShowBestsellersOnly(bestsellersFilter);
    
    if (bestsellersFilter) {
      // Filter to show only featured/bestseller products
      const bestsellers = allProducts.filter(product => product.featured);
      setProducts(bestsellers);
    } else {
      setProducts(allProducts);
    }
  }, [category, searchParams]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [wishlistItems, setWishlistItems] = useState(() => {
    const categoryType = category === 'fragrances' ? 'fragrance' : 'cosmetic';
    const fetchedProducts = getProductsByCategory(categoryType);
    
    // Load wishlist status for all products
    const wishlistSet = new Set();
    fetchedProducts.forEach(product => {
      if (isInWishlist(product.id)) {
        wishlistSet.add(product.id);
      }
    });
    return wishlistSet;
  });

  const handleAddToCart = (product, variation = null) => {
    const productToAdd = variation ? { ...product, selectedVariation: variation, price: variation.price } : product;
    addToCart(productToAdd);
    // Cart count will update automatically in navigation
  };

  const handleToggleWishlist = (product) => {
    if (wishlistItems.has(product.id)) {
      // Remove from wishlist
      removeFromWishlist(product.id);
      setWishlistItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(product.id);
        return newSet;
      });
    } else {
      // Add to wishlist
      addToWishlist(product);
      setWishlistItems(new Set([...wishlistItems, product.id]));
    }
  };

  useEffect(() => {
    const categoryType = category === 'fragrances' ? 'fragrance' : 'cosmetic';
    const allProducts = getProductsByCategory(categoryType);
    setProducts(allProducts);
    
    // Apply initial filtering
    applyFilter(allProducts, activeFilter);
  }, [category, activeFilter]);

  const applyFilter = (productsToFilter, filter) => {
    let filtered = [...productsToFilter];
    
    if (filter === 'bestsellers') {
      filtered = productsToFilter.filter(product => product.featured);
    } else if (filter !== 'all') {
      // For fragrance-specific filters
      if (category === 'fragrances') {
        if (filter === 'woody') {
          filtered = productsToFilter.filter(product => 
            product.notes && product.notes.some(note => note.toLowerCase().includes('wood'))
          );
        } else if (filter === 'floral') {
          filtered = productsToFilter.filter(product => 
            product.notes && product.notes.some(note => note.toLowerCase().includes('floral') || note.toLowerCase().includes('rose'))
          );
        } else if (filter === 'citrus') {
          filtered = productsToFilter.filter(product => 
            product.notes && product.notes.some(note => note.toLowerCase().includes('citrus') || note.toLowerCase().includes('orange'))
          );
        } else if (filter === 'fresh') {
          filtered = productsToFilter.filter(product => 
            product.notes && product.notes.some(note => note.toLowerCase().includes('fresh') || note.toLowerCase().includes('green'))
          );
        }
      }
    }
    
    setFilteredProducts(filtered);
  };

  const handleFilterClick = (filterId) => {
    setActiveFilter(filterId);
    applyFilter(products, filterId);
  };

  const pageTitle = category === 'fragrances' 
    ? 'Luxury Fragrances' 
    : 'Premium Cosmetics';
    
  const categoryFilters = category === 'fragrances' 
    ? [
        { id: 'all', label: 'All Products', icon: '🌸' },
        { id: 'woody', label: 'Woody', icon: '🪵' },
        { id: 'floral', label: 'Floral', icon: '🌹' },
        { id: 'citrus', label: 'Citrus', icon: '🍊' },
        { id: 'fresh', label: 'Fresh', icon: '🌿' },
        { id: 'bestsellers', label: 'Best Sellers', icon: '⭐' }
      ]
    : [
        { id: 'all', label: 'All Products', icon: '💄' },
        { id: 'bestsellers', label: 'Best Sellers', icon: '⭐' },
        { id: 'lipsticks', label: 'Lipsticks', icon: '💋' },
        { id: 'foundations', label: 'Foundations', icon: '🎨' },
        { id: 'eyeshadows', label: 'Eyeshadows', icon: '👁️' },
        { id: 'skincare', label: 'Skincare', icon: '✨' }
      ];

  const featuredProducts = [
    { name: 'Rose Garden', price: 2800, image: 'rose' },
    { name: 'Vanilla Dreams', price: 3200, image: 'vanilla' },
    { name: 'Ocean Breeze', price: 2600, image: 'ocean' },
    { name: 'Midnight Musk', price: 3500, image: 'musk' }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  // Add marquee animation styles
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes marquee {
        0% {
          transform: translateX(0%);
        }
        100% {
          transform: translateX(-50%);
        }
      }
      
      .animate-marquee {
        animation: marquee 20s linear infinite;
      }
    `;
    document.head.appendChild(style);
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Top Announcement Bar */}
      <div className="bg-dark-red-600 text-cream-50 text-center py-2 px-4 text-sm font-medium">
        <p>✨ Free Shipping above ₹599.00 ✨</p>
      </div>

      {/* Hero Section - Split Layout Image Left, Text Right */}
      <section className="relative bg-gradient-to-br from-dark-red-700 to-dark-red-900 overflow-hidden">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-0 items-center min-h-[600px] lg:min-h-[700px]">
            {/* Left Side - Large Product Image (40%) */}
            <div className="lg:col-span-2 relative order-2 lg:order-1">
              <div className="relative h-[400px] lg:h-[700px] overflow-hidden">
                <img
                  src={category === 'cosmetics' 
                    ? "https://images.unsplash.com/photo-1596462502278-27d54b5f11a0?w=800&h=700&fit=crop&auto=format&q=80"
                    : "https://images.unsplash.com/photo-1541643600914-78b084f3f0c9?w=800&h=700&fit=crop&auto=format&q=80"
                  }
                  alt={pageTitle}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Right Side - Text Content (60%) */}
            <div className="lg:col-span-3 relative z-10 py-12 lg:py-0 px-6 lg:px-0 lg:pl-12 order-1 lg:order-2">
              <div className="text-center lg:text-left">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                  {category === 'cosmetics' 
                    ? "WORLD'S BEST COSMETICS"
                    : "WORLD'S BEST FRAGRANCES"
                  }
                </h1>
                <p className="text-xl md:text-2xl text-cream-100 mb-8 font-light">
                  {category === 'cosmetics' 
                    ? "Handmade | Luxury | Cruelty-Free"
                    : "Handmade | Premium | Long-Lasting"
                  }
                </p>
                
                {/* White CTA Button - Centrally placed */}
                <div className="text-center lg:text-left">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center space-x-2 px-8 py-4 bg-white text-dark-red-700 font-semibold rounded-lg hover:bg-cream-50 transition-all duration-300 shadow-xl"
                  >
                    <ShoppingCart size={20} />
                    <span>Shop Now</span>
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee Strip with Featured Products */}
      <section className="bg-cream-100 py-4 border-b border-cream-200 overflow-hidden">
        <div className="container-custom">
          <div className="flex animate-marquee whitespace-nowrap">
            {[...featuredProducts, ...featuredProducts].map((product, index) => (
              <div key={index} className="flex items-center space-x-4 mx-8 flex-shrink-0">
                <img
                  src={`https://images.unsplash.com/photo-${1600000000000 + index * 1000}?w=60&h=60&fit=crop&auto=format`}
                  alt={product.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <span className="text-dark-red-700 font-medium">{product.name}</span>
                <button className="px-3 py-1 bg-dark-red-600 text-white text-sm rounded-full hover:bg-dark-red-700 transition-colors">
                  Shop Now
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="bg-gradient-to-r from-cream-600 to-cream-500 text-dark-red-800 py-8">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="text-2xl font-luxury-serif font-bold mb-2">24-Hour Long-Lasting Formula</h3>
              <p className="text-dark-red-600 font-medium">No Parabens | No Sulfates | 100% Cruelty-Free</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <Shield className="w-8 h-8 mx-auto mb-1 text-dark-red-600" />
                <span className="text-xs font-medium">Dermatologist Tested</span>
              </div>
              <div className="text-center">
                <CheckCircle className="w-8 h-8 mx-auto mb-1 text-dark-red-600" />
                <span className="text-xs font-medium">100% Vegan</span>
              </div>
              <div className="text-center">
                <Truck className="w-8 h-8 mx-auto mb-1 text-dark-red-600" />
                <span className="text-xs font-medium">Free Shipping</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Title Section and Shop by Preference */}
      <section className="section-padding bg-white border-b border-cream-200">
        <div className="container-custom">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-dark-red-900 mb-2">
              {pageTitle}
            </h2>
            <p className="text-dark-red-600 text-lg">Shop by Preference</p>
          </div>
          
          {/* Circular Filters */}
          <div className="flex flex-wrap gap-6 justify-center mb-8">
            {categoryFilters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => handleFilterClick(filter.id)}
                className={`w-20 h-20 rounded-full flex flex-col items-center justify-center transition-all duration-300 ${
                  activeFilter === filter.id
                    ? 'bg-dark-red-600 text-white shadow-lg scale-110'
                    : 'bg-cream-100 text-dark-red-700 hover:bg-dark-red-100 hover:scale-105'
                }`}
              >
                <span className="text-2xl mb-1">{filter.icon}</span>
                <span className="text-xs font-medium text-center">{filter.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Filters & Search */}
      <section className="section-padding bg-white border-b border-cream-200">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-red-400" size={20} />
              <input
                type="text"
                placeholder="Search luxury cosmetics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-cream-200 rounded-lg focus:border-dark-red-600 focus:outline-none transition-colors bg-cream-50 font-sans"
              />
            </div>

            {/* Sort */}
            <div className="flex items-center space-x-4">
              <label className="text-dark-red-700 font-medium font-sans">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border-2 border-cream-200 rounded-lg focus:border-dark-red-600 focus:outline-none transition-colors bg-cream-50 font-sans"
              >
                <option value="featured">Featured</option>
                <option value="name">Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          <div className="mt-4 text-dark-red-600">
            {showBestsellersOnly && (
              <span className="inline-block px-3 py-1 bg-dark-red-100 text-dark-red-800 rounded-full text-sm font-medium mr-2">
                Bestsellers Only
              </span>
            )}
            Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="section-padding bg-cream-50">
        <div className="container-custom">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-dark-red-600 font-sans">No products found in this category.</p>
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            >
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  variants={itemVariants}
                  whileHover={{ y: -4 }}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group cursor-pointer"
                  onClick={() => {
                    const categoryRoute = category === 'fragrances' ? 'fragrance' : 'cosmetic';
                    const productSlug = product.name.toLowerCase().replace(/\s+/g, '-');
                    window.location.href = `/product/${categoryRoute}/${productSlug}`;
                  }}
                >
                  {/* Product Image */}
                  <div className="relative h-48 bg-gray-50">
                    <img
                      src={product.images?.[0] || product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    {/* BESTSELLER Badge */}
                    {product.featured && (
                      <div className="absolute top-2 left-2 bg-dark-red-600 text-white px-2 py-1 text-xs font-bold rounded">
                        BESTSELLER
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-4 space-y-2">
                    <h3 className="font-semibold text-dark-red-800 text-sm line-clamp-2">
                      {product.name}
                    </h3>

                    {/* Price */}
                    <div className="text-lg font-bold text-dark-red-700">
                      ₹{(product.price || 0).toLocaleString('en-IN')}
                    </div>

                    {/* Add to Cart Button */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAddToCart(product)}
                      className="w-full px-3 py-2 bg-dark-red-600 text-white text-sm font-medium rounded-lg hover:bg-dark-red-700 transition-colors"
                    >
                      Add to Cart
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* View All Products Link */}
      <div className="text-center py-6">
        <button className="text-dark-red-600 hover:text-dark-red-800 font-medium underline">
          View All Products
        </button>
      </div>

      {/* Promotional Banner (Nutrition Focus) */}
      <section className="bg-gradient-to-r from-cream-600 to-cream-500 text-dark-red-800 py-12">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-dark-red-900 mb-4">
                Natural {category === 'cosmetics' ? 'Ingredients' : 'Fragrances'} = Premium Quality!
              </h2>
              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-dark-red-700" />
                  <span className="text-dark-red-600">No harmful chemicals</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-dark-red-700" />
                  <span className="text-dark-red-600">No artificial fragrances</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-dark-red-700" />
                  <span className="text-dark-red-600">Gluten-free</span>
                </div>
              </div>
              <button className="px-6 py-3 bg-dark-red-700 text-white font-semibold rounded-lg hover:bg-dark-red-800 transition-colors">
                Learn More
              </button>
            </div>
            <div className="text-center">
              <div className="w-64 h-64 bg-cream-300 rounded-2xl flex items-center justify-center mx-auto">
                <div className="text-center">
                  <div className="text-6xl mb-2">🌿</div>
                  <p className="text-dark-red-700 font-semibold">Premium Quality</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WhatsApp Chat Icon */}
      <div className="fixed bottom-6 left-6 z-50">
        <button className="w-14 h-14 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-colors flex items-center justify-center">
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.149-.67.149-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.297-.347.446-.521.151-.172.074-.347.024-.521-.149-.174-.149-.739-.76-1.008-1.039-.269-.279-.538-.223-.674-.149-.136.074-.538.521-.674.644-.136.124-.273.149-.471.074-.197-.074-.832-.306-1.587-.976-.585-.6-1.008-1.311-1.125-1.508-.117-.197-.012-.304.086-.452.094-.133.211-.297.33-.471.12-.174.253-.347.376-.521.124-.174.249-.347.376-.521.124-.174.074-.347.024-.521-.149-.174-.149-.739-.76-1.008-1.039-.269-.279-.538-.223-.674-.149-.136.074-.538.521-.674.644-.136.124-.273.149-.471.074-.197-.074-.832-.306-1.587-.976-.585-.6-1.008-1.311-1.125-1.508-.117-.197-.012-.304.086-.452.094-.133.211-.297.33-.471.12-.174.253-.347.376-.521z"/>
          </svg>
        </button>
      </div>

      {/* Sticky Reward Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-dark-red-700 text-white py-3 px-4 z-40">
        <div className="container-custom flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-yellow-300">🎁</span>
            <span className="font-semibold">Revieree Rewards – Upto 100% Off</span>
          </div>
          <button className="bg-white text-dark-red-700 px-4 py-1 rounded-md text-sm font-medium hover:bg-cream-100 transition-colors">
            Claim Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;