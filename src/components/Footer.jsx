import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Instagram, Facebook } from "lucide-react";

const Footer = () => {
  return (
    <footer
      className="bg-gradient-to-r from-rose-950 to-red-950 text-white - how do i make it wine 
``` text-white"
    >
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-bold mb-4">Revieree</h3>
            <p className="text-gray-300 mb-4">
              Luxury fragrances and premium cosmetics that make every day
              extraordinary.
            </p>
            <div className="flex space-x-4">
              <a
                href="mailto:hello@revieree.co"
                className="text-gray-400 hover:text-white"
              >
                <Mail size={18} />
              </a>
              <a
                href="tel:+1234567890"
                className="text-gray-400 hover:text-white"
              >
                <Phone size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-300 hover:text-white">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/blogs" className="text-gray-300 hover:text-white">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/gifting" className="text-gray-300 hover:text-white">
                  Gifting
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-bold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/products/fragrances"
                  className="text-gray-300 hover:text-white"
                >
                  Fragrances
                </Link>
              </li>
              <li>
                <Link
                  to="/products/cosmetics"
                  className="text-gray-300 hover:text-white"
                >
                  Cosmetics
                </Link>
              </li>
              <li>
                <Link to="/gifting" className="text-gray-300 hover:text-white">
                  Gift Sets
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-bold mb-4">Stay Connected</h3>
            <p className="text-gray-300 mb-4">
              Get updates on new launches and exclusive offers.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://instagram.com/revieree"
                className="text-gray-400 hover:text-white"
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://facebook.com/revieree"
                className="text-gray-400 hover:text-white"
              >
                <Facebook size={18} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 text-center">
          <p className="text-white">
            © 2026 Revieree. All rights reserved. |
            <Link to="/privacy" className="hover:text-white">
              Privacy Policy
            </Link>{" "}
            |
            <Link to="/terms" className="hover:text-white">
              Terms
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
