import { Link } from "react-router-dom";
import { Phone, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-rose-950 to-red-950 text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-bold mb-4">Revieree</h3>
            <p className="text-gray-300 mb-6 text-sm leading-relaxed">
              Luxury fragrances and premium cosmetics that make every day
              extraordinary.
            </p>
            <ul className="space-y-3">
              <li>
                <a
                  href="tel:+919284499305"
                  className="flex items-center gap-2 text-gray-300 hover:text-white text-sm transition-colors"
                >
                  <Phone size={15} className="flex-shrink-0" />
                  +91 92844 99305
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-gray-300 hover:text-white text-sm transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-gray-300 hover:text-white text-sm transition-colors"
                >
                  Our Story
                </Link>
              </li>
              <li>
                <Link
                  to="/blogs"
                  className="text-gray-300 hover:text-white text-sm transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  to="/cart"
                  className="text-gray-300 hover:text-white text-sm transition-colors"
                >
                  Cart
                </Link>
              </li>
              <li>
                <Link
                  to="/wishlist"
                  className="text-gray-300 hover:text-white text-sm transition-colors"
                >
                  Wishlist
                </Link>
              </li>
            </ul>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-lg font-bold mb-4">Shop</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/products/fragrances"
                  className="text-gray-300 hover:text-white text-sm transition-colors"
                >
                  Fragrances
                </Link>
              </li>
              <li>
                <Link
                  to="/products/cosmetics"
                  className="text-gray-300 hover:text-white text-sm transition-colors"
                >
                  Cosmetics
                </Link>
              </li>
              <li>
                <Link
                  to="/scent-quiz"
                  className="text-gray-300 hover:text-white text-sm transition-colors"
                >
                  Take the Scent Quiz
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-lg font-bold mb-4">Stay Connected</h3>
            <p className="text-gray-300 mb-5 text-sm leading-relaxed">
              Follow us for new launches, behind-the-scenes and exclusive
              offers.
            </p>
            <a
              href="https://www.instagram.com/therevieree.co/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors text-sm"
            >
              <Instagram size={18} />
              <span>@therevieree.co</span>
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-amber-900/40 flex flex-col items-center gap-2 sm:flex-row sm:justify-between text-xs text-amber-400 text-center">
          <p className="leading-relaxed">
            © 2026 Revieree. All rights reserved. &nbsp;|&nbsp;
            <Link
              to="/privacy"
              className="hover:text-amber-200 transition-colors"
            >
              Privacy Policy
            </Link>
            &nbsp;|&nbsp;
            <Link
              to="/terms"
              className="hover:text-amber-200 transition-colors"
            >
              Terms
            </Link>
          </p>
          <p className="whitespace-nowrap">
            Built with love by{" "}
            <span className="text-amber-300 font-medium">
              The Revieree Studios
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
