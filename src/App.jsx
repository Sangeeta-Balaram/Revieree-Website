import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";

// Website Pages (NO ADMIN)
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const ProductsPage = lazy(() => import("./pages/ProductsPage"));
const FragrancesPage = lazy(() => import("./pages/FragrancesPage"));
const CosmeticsPage = lazy(() => import("./pages/CosmeticsPage"));
const Blogs = lazy(() => import("./pages/Blogs"));
const BlogDetail = lazy(() => import("./pages/BlogDetail"));
const Profile = lazy(() => import("./pages/Profile"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const Gifting = lazy(() => import("./pages/Gifting"));
const ScentQuiz = lazy(() => import("./pages/ScentQuiz"));
const ProductDetailPage = lazy(() => import("./pages/ProductDetailPage"));
const CartPage = lazy(() => import("./pages/CartPage"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const WishlistPage = lazy(() => import("./pages/WishlistPage"));

// Components
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  const GOOGLE_CLIENT_ID =
    "801330207291-e60d3b7s4jj3934pqabrbv0rqd3bqt3s.apps.googleusercontent.com";

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <ScrollToTop />
      <div className="min-h-screen bg-white overflow-x-hidden">
        <Navigation />
        <main className="overflow-x-hidden">
          <Suspense
            fallback={
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl">Loading...</div>
              </div>
            }
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/products/fragrances" element={<FragrancesPage />} />
              <Route path="/products/cosmetics" element={<CosmeticsPage />} />
              <Route path="/products/:category" element={<ProductsPage />} />
              <Route path="/blogs" element={<Blogs />} />
              <Route path="/blog/:id" element={<BlogDetail />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/gifting" element={<Gifting />} />
              <Route path="/scent-quiz" element={<ScentQuiz />} />
              <Route
                path="/product/:category/:productId"
                element={<ProductDetailPage />}
              />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/wishlist" element={<WishlistPage />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </GoogleOAuthProvider>
  );
}

export default App;
