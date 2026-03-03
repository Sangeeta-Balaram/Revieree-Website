import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ShoppingBag, Heart, ChevronDown, User, LogOut } from "lucide-react";
import logoRed from "../assets/images/logo no bg for red bg.png";
import logoWhite from "../assets/images/revieree logo no bg.png";
import { getCartItemCount } from "../utils/cart";
import { getCurrentUser, signOut } from "../utils/auth";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isDarkSection, setIsDarkSection] = useState(false);
  const [productsDropdown, setProductsDropdown] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (productsDropdown && !event.target.closest('.products-dropdown')) {
        setProductsDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [productsDropdown]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // Detect if we're in a dark section (red/wine backgrounds)
      const sections = document.querySelectorAll("section");
      let inDarkSection = false;

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const navPosition = 50; // Approximate navbar position from top

        // Check if navbar overlaps with this section
        if (rect.top <= navPosition && rect.bottom >= navPosition) {
          const bgClasses = section.className;
          // Check for dark backgrounds (red-800, red-900, red-950, purple, rose-900, etc.)
          if (
            bgClasses.includes("from-red-8") ||
            bgClasses.includes("to-red-8") ||
            bgClasses.includes("from-red-9") ||
            bgClasses.includes("to-red-9") ||
            bgClasses.includes("from-rose-9") ||
            bgClasses.includes("to-rose-9") ||
            bgClasses.includes("from-purple-9") ||
            bgClasses.includes("to-purple-9") ||
            bgClasses.includes("from-rose-6") ||
            bgClasses.includes("to-pink-7")
          ) {
            inDarkSection = true;
          }
        }
      });

      setIsDarkSection(inDarkSection);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Update cart count and user
  useEffect(() => {
    const updateData = () => {
      setCartCount(getCartItemCount());
      setCurrentUser(getCurrentUser());
    };

    updateData();

    const handleStorageChange = () => {
      updateData();
    };

    const handleUserLoggedIn = () => {
      updateData();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('cartUpdated', handleStorageChange);
    window.addEventListener('userLoggedIn', handleUserLoggedIn);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cartUpdated', handleStorageChange);
      window.removeEventListener('userLoggedIn', handleUserLoggedIn);
    };
  }, []);

  const handleSignOut = () => {
    signOut();
    setCurrentUser(null);
    navigate('/');
  };

  const leftNavLinks = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products", hasDropdown: true },
    { name: "Our Story", path: "/about" },
    { name: "Blog", path: "/blogs" },
  ];

  const productsDropdownItems = [
    { name: "Fragrances", path: "/products/fragrances" },
    { name: "Cosmetics", path: "/products/cosmetics" },
  ];

  const navLinks = [...leftNavLinks, { name: "Contact", path: "/contact" }];

  return (
    <>


      <nav
        className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ${
          isDarkSection
            ? "bg-white border border-red-200 px-8 py-2 rounded-full shadow-lg"
            : "bg-gradient-to-r from-rose-950 to-red-900 px-8 py-2 rounded-full shadow-lg"
        }`}
      >
        <div className="flex items-center justify-between w-full min-w-[850px]">
          {/* Left Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {leftNavLinks.map((link) => (
              <div key={link.name} className="relative">
                {link.hasDropdown ? (
                  <div className="relative products-dropdown">
                    <button
                      onClick={() => setProductsDropdown(!productsDropdown)}
                      className={`text-sm transition-colors font-medium flex items-center space-x-1 py-2 px-1 ${
                        isDarkSection
                          ? "text-red-800 hover:text-red-900"
                          : "text-white hover:text-red-100"
                      } ${
                        location.pathname.startsWith("/products")
                          ? "font-bold"
                          : ""
                      }`}
                    >
                      <span>{link.name}</span>
                      <ChevronDown 
                        size={14} 
                        className={`transform transition-transform duration-200 ${
                          productsDropdown ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {productsDropdown && (
                      <div className="absolute top-full left-0 mt-1 w-52 rounded-lg shadow-xl border overflow-hidden z-50 bg-white border-gray-200">
                        {productsDropdownItems.map((item) => (
                          <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setProductsDropdown(false)}
                            className={`block px-4 py-3 text-sm font-medium transition-colors ${
                              location.pathname === item.path
                                ? "bg-red-50 text-red-900"
                                : "text-gray-700 hover:bg-red-50 hover:text-red-900"
                            }`}
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to={link.path}
                    className={`text-sm transition-colors font-medium px-3 py-1 rounded-full ${
                      (link.path === "/" && location.pathname === "/") ||
                      (link.path !== "/" && location.pathname.startsWith(link.path))
                        ? isDarkSection
                          ? "bg-red-800 text-white"
                          : "bg-white text-red-800"
                        : isDarkSection
                          ? "text-red-800 hover:text-red-900"
                          : "text-white hover:text-red-100"
                    }`}
                  >
                    {link.name}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Logo - Center */}
          <Link
            to="/"
            className="relative transform hover:scale-110 transition-transform duration-200"
          >
            <img
              src={isDarkSection ? logoWhite : logoRed}
              alt="Revieree"
              className="h-12 w-auto object-contain drop-shadow-lg"
            />
          </Link>

          {/* Right Side - Desktop Only */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="relative">
              <Link
                to="/cart"
                className={`transition-colors ${
                  isDarkSection
                    ? "text-red-800 hover:text-red-900"
                    : "text-white hover:text-red-100"
                }`}
              >
                <ShoppingBag size={18} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </Link>
            </div>
            <Link
              to="/wishlist"
              className={`transition-colors ${
                isDarkSection
                  ? "text-red-800 hover:text-red-900"
                  : "text-white hover:text-red-100"
              }`}
            >
              <Heart size={18} />
            </Link>
            {currentUser ? (
              <div className="relative whitespace-nowrap">
                <button
                  onClick={() => setUserDropdown(!userDropdown)}
                  className="flex items-center text-sm font-medium text-white transition-colors px-3 py-1.5 rounded-full bg-burgundy-700 hover:bg-burgundy-800"
                >
                  <User size={16} className="mr-2" />
                  Hi, {currentUser.name?.split(' ')[0] || 'User'}
                </button>
                {userDropdown && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50">
                    <Link
                      to="/profile"
                      onClick={() => setUserDropdown(false)}
                      className="block px-4 py-3 text-sm text-gray-700 hover:bg-red-50 hover:text-red-900"
                    >
                      My Profile
                    </Link>
                    <Link
                      to="/profile"
                      onClick={() => {
                        setUserDropdown(false);
                        document.querySelector('[data-tab="orders"]')?.click();
                      }}
                      className="block px-4 py-3 text-sm text-gray-700 hover:bg-red-50 hover:text-red-900"
                    >
                      Track Order
                    </Link>
                    <button
                      onClick={() => {
                        setUserDropdown(false);
                        handleSignOut();
                      }}
                      className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-red-50 hover:text-red-900 flex items-center space-x-2"
                    >
                      <LogOut size={14} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className={`text-sm font-medium transition-colors ${
                  isDarkSection
                    ? "text-red-800 hover:text-red-900"
                    : "text-white hover:text-red-100"
                }`}
              >
                Sign in
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`md:hidden p-1 transition-colors ${
              isDarkSection ? "text-red-800" : "text-white"
            }`}
          >
            {isOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden fixed top-20 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white border border-gray-200 rounded-xl shadow-lg z-40">
            <div className="py-4 space-y-3">
              {navLinks.map((link) => (
                <div key={link.name}>
                  {link.hasDropdown ? (
                    <div>
                      <div className={`block py-2 px-6 text-red-800 font-medium ${
                        location.pathname.startsWith("/products") ? "text-red-900" : ""
                      }`}>
                        {link.name}
                      </div>
                      <div className="ml-4 space-y-2">
                        {productsDropdownItems.map((item) => (
                          <Link
                            key={item.path}
                            to={item.path}
                            className={`block py-2 px-6 text-red-700 hover:text-red-900 font-medium text-sm ${
                              location.pathname === item.path ? "text-red-900" : ""
                            }`}
                            onClick={() => setIsOpen(false)}
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Link
                      to={link.path}
                      className={`block py-2 px-6 text-red-800 hover:text-red-900 font-medium ${
                        location.pathname === link.path ? "text-red-900" : ""
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      {link.name}
                    </Link>
                  )}
                </div>
              ))}
              <div className="pt-4 border-t border-gray-200 px-6 space-y-3">
                {currentUser ? (
                  <>
                    <div className="flex items-center space-x-3 py-2">
                      {currentUser.picture ? (
                        <img 
                          src={currentUser.picture} 
                          alt={currentUser.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                          <User size={20} className="text-red-800" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-gray-900">Hi, {currentUser.name}</p>
                        <p className="text-sm text-gray-500">{currentUser.email}</p>
                      </div>
                    </div>
                    <Link
                      to="/profile"
                      className="block text-red-800 hover:text-red-900 font-medium"
                      onClick={() => setIsOpen(false)}
                    >
                      My Profile
                    </Link>
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        handleSignOut();
                      }}
                      className="block text-red-800 hover:text-red-900 font-medium"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="block text-red-800 hover:text-red-900 font-medium"
                      onClick={() => setIsOpen(false)}
                    >
                      Sign in
                    </Link>
                    <Link
                      to="/signup"
                      className="block py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-center"
                      onClick={() => setIsOpen(false)}
                    >
                      Get started
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navigation;