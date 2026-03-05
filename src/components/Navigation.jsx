import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  ShoppingBag,
  Heart,
  ChevronDown,
  User,
  LogOut,
  Search,
} from "lucide-react";
import logoRed from "../assets/images/logo-no-bg-for-red-bg.png";
import logoWhite from "../assets/images/revieree-logo-no-bg.png";
import { getCartItemCount } from "../utils/cart";
import { getCurrentUser, signOut } from "../utils/auth";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isDarkSection, setIsDarkSection] = useState(false);
  const [productsDropdown, setProductsDropdown] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (productsDropdown && !event.target.closest(".products-dropdown")) {
        setProductsDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [productsDropdown]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // Detect if we're in a dark section (red/wine backgrounds)
      const sections = document.querySelectorAll("section");
      let inDarkSection = false;

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const navPosition = 50;

        if (rect.top <= navPosition && rect.bottom >= navPosition) {
          const bgClasses = section.className;
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
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Update cart count and user
  useEffect(() => {
    const updateData = () => {
      setCartCount(getCartItemCount());
      setCurrentUser(getCurrentUser());
    };

    updateData();

    const handleStorageChange = () => updateData();
    const handleUserLoggedIn = () => updateData();

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("cartUpdated", handleStorageChange);
    window.addEventListener("userLoggedIn", handleUserLoggedIn);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("cartUpdated", handleStorageChange);
      window.removeEventListener("userLoggedIn", handleUserLoggedIn);
    };
  }, []);

  const handleSignOut = () => {
    signOut();
    setCurrentUser(null);
    navigate("/");
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
      {/* Mobile/Tablet Top Bar - show on screens smaller than lg (1024px) */}
      <div
        className="lg:hidden fixed top-0 left-0 right-0 bg-gradient-to-r from-rose-950 to-red-900 z-50 px-4 py-3 flex items-center justify-between"
        style={{ height: "56px" }}
      >
        {/* Hamburger Menu */}
        <button
          onClick={() => {
            setIsOpen(!isOpen);
            setMobileProductsOpen(false);
          }}
          className="text-white p-2 -ml-2"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Logo - Mobile */}
        <Link to="/" className="h-10">
          <img src={logoWhite} alt="Revieree" className="h-full w-auto" />
        </Link>

        {/* Right Icons - Mobile */}
        <div className="flex items-center space-x-5 pr-2">
          <Link to="/cart" className="text-white relative">
            <ShoppingBag size={24} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile Menu - Full screen overlay */}
      <div
        className={`lg:hidden fixed inset-0 bg-white z-40 ${
          isOpen ? "block" : "hidden"
        }`}
        style={{ top: "56px" }}
      >
        <div className="py-6 px-4 overflow-y-auto h-full">
          <div className="space-y-2 mb-6">
            {navLinks.map((link) => (
              <div key={link.name}>
                {link.hasDropdown ? (
                  <div className="border-b border-gray-100 pb-2">
                    <button
                      onClick={() => setMobileProductsOpen(!mobileProductsOpen)}
                      className={`w-full flex items-center justify-between py-4 px-4 text-red-800 font-semibold text-lg ${
                        location.pathname.startsWith("/products")
                          ? "text-red-900"
                          : ""
                      }`}
                    >
                      <span>{link.name}</span>
                      <ChevronDown
                        size={18}
                        className={`transform transition-transform duration-200 ${
                          mobileProductsOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {mobileProductsOpen && (
                      <div className="ml-4 space-y-1">
                        {productsDropdownItems.map((item) => (
                          <Link
                            key={item.path}
                            to={item.path}
                            className={`block py-3 px-4 text-red-700 font-medium text-base ${
                              location.pathname === item.path
                                ? "text-red-900 bg-red-50"
                                : ""
                            }`}
                            onClick={() => {
                              setIsOpen(false);
                              setMobileProductsOpen(false);
                            }}
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
                    className={`block py-4 px-4 text-red-800 hover:text-red-900 font-semibold text-lg ${
                      location.pathname === link.path ? "bg-red-50" : ""
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </Link>
                )}
              </div>
            ))}
          </div>

          <div className="pt-6 border-t border-gray-200 mt-4">
            <div className="flex justify-around py-6">
              <Link
                to="/cart"
                className="flex flex-col items-center text-gray-700"
                onClick={() => setIsOpen(false)}
              >
                <ShoppingBag size={28} />
                <span className="text-sm mt-2 font-medium">Cart</span>
              </Link>
              <Link
                to="/wishlist"
                className="flex flex-col items-center text-gray-700"
                onClick={() => setIsOpen(false)}
              >
                <Heart size={28} />
                <span className="text-sm mt-2 font-medium">Wishlist</span>
              </Link>
              {currentUser ? (
                <Link
                  to="/profile"
                  className="flex flex-col items-center text-gray-700"
                  onClick={() => setIsOpen(false)}
                >
                  <User size={28} />
                  <span className="text-sm mt-2 font-medium">Profile</span>
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="flex flex-col items-center text-gray-700"
                  onClick={() => setIsOpen(false)}
                >
                  <User size={28} />
                  <span className="text-sm mt-2 font-medium">Login</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Spacer for mobile/tablet top bar */}
      <div className="lg:hidden h-14"></div>

      {/* Desktop Floating Navbar - Only show on lg (1024px+) screens */}
      <nav
        className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 hidden lg:block ${
          isDarkSection
            ? "bg-white border border-red-200 px-8 py-2 rounded-full shadow-lg"
            : "bg-gradient-to-r from-rose-950 to-red-900 px-8 py-2 rounded-full shadow-lg"
        }`}
      >
        <div className="flex items-center justify-between w-full min-w-[850px]">
          {/* Left Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            {leftNavLinks.map((link) => (
              <div key={link.name} className="relative z-50">
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
                          productsDropdown ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {productsDropdown && (
                      <div className="absolute top-full left-0 mt-1 w-52 rounded-lg shadow-xl border overflow-hidden z-[9999] bg-white border-gray-200">
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
                      (link.path !== "/" &&
                        location.pathname.startsWith(link.path))
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
          <div className="hidden lg:flex items-center space-x-6">
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
                    {cartCount > 99 ? "99+" : cartCount}
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
              <div className="relative whitespace-nowrap z-50">
                <button
                  onClick={() => setUserDropdown(!userDropdown)}
                  className="flex items-center text-sm font-medium text-white transition-colors px-3 py-1.5 rounded-full bg-burgundy-700 hover:bg-burgundy-800"
                >
                  <User size={16} className="mr-2" />
                  Hi, {currentUser.name?.split(" ")[0] || "User"}
                </button>
                {userDropdown && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-[9999]">
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
        </div>
      </nav>
    </>
  );
};

export default Navigation;
