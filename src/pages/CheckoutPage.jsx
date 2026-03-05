import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ShoppingCart,
  ArrowLeft,
  CreditCard,
  Truck,
  Shield,
  Check,
  X,
  Plus,
  Minus,
  User,
  MapPin,
  Phone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Clock,
  Package,
} from "lucide-react";
import { updateCartQuantity, removeFromCart } from "../utils/cart";
import { createOrder, PAYMENT_METHODS, PAYMENT_STATUS } from "../utils/supabaseOrders";
import { getCurrentUser } from "../utils/auth";
import heroBgImg from "../assets/images/adc8fc81eac678aba089250ca3074d47.jpg";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [items, setItems] = useState(location.state?.items || []);
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isFetchingPincode, setIsFetchingPincode] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);
  
  const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
    "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
    "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Jammu & Kashmir",
    "Ladakh", "Puducherry", "Chandigarh", "Andaman & Nicobar Islands",
    "Dadra & Nagar Haveli", "Daman & Diu", "Lakshadweep"
  ];

  const fetchCityStateFromPincode = async (pincode) => {
    if (pincode.length !== 6 || !/^\d+$/.test(pincode)) {
      return;
    }
    
    setIsFetchingPincode(true);
    try {
      const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const data = await response.json();
      
      if (data && data[0] && data[0].Status === "Success" && data[0].PostOffice) {
        const postOffice = data[0].PostOffice[0];
        setShippingInfo(prev => ({
          ...prev,
          city: postOffice.District || "",
          state: postOffice.State || ""
        }));
      }
    } catch (error) {
      console.error("Error fetching pincode data:", error);
    } finally {
      setIsFetchingPincode(false);
    }
  };
  
  // Get logged in user
  const currentUser = getCurrentUser();
  
  // Get default values from user if logged in
  const getUserDefaults = () => {
    const user = getCurrentUser();
    if (user) {
      const nameParts = (user.name || '').split(' ');
      return {
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        email: user.email || '',
      };
    }
    return { firstName: '', lastName: '', email: '' };
  };
  
  const userDefaults = getUserDefaults();
  
  // Load from localStorage or use defaults
  const getStoredData = (key, defaultValue) => {
    try {
      const stored = localStorage.getItem(`checkout_${key}`);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch {
      return defaultValue;
    }
  };

  // Form states - load from localStorage, pre-fill with user data
  const [shippingInfo, setShippingInfo] = useState(() => 
    getStoredData('shipping', {
    firstName: userDefaults.firstName,
    lastName: userDefaults.lastName,
    email: userDefaults.email,
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
  }));
  
  const [billingInfo, setBillingInfo] = useState(() => 
    getStoredData('billing', {
    sameAsShipping: true,
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
  }));
  
  const [paymentInfo, setPaymentInfo] = useState(() => 
    getStoredData('payment', {
    method: "cod",
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
    upiId: "",
    savePayment: false,
  }));

  // Save to localStorage when form data changes
  useEffect(() => {
    localStorage.setItem('checkout_shipping', JSON.stringify(shippingInfo));
  }, [shippingInfo]);

  useEffect(() => {
    localStorage.setItem('checkout_billing', JSON.stringify(billingInfo));
  }, [billingInfo]);

  useEffect(() => {
    localStorage.setItem('checkout_payment', JSON.stringify(paymentInfo));
  }, [paymentInfo]);

  // Clear checkout data from localStorage after successful order
  const clearCheckoutData = () => {
    localStorage.removeItem('checkout_shipping');
    localStorage.removeItem('checkout_billing');
    localStorage.removeItem('checkout_payment');
  };

  // Razorpay configuration - Replace with your LIVE key when ready for production
  const RAZORPAY_KEY_ID = "rzp_test_SMmWQVteSJqyUm"; // TODO: Replace with rzp_live_XXXXX for production

  const initializeRazorpay = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(window.Razorpay);
      } else {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(window.Razorpay);
        document.body.appendChild(script);
      }
    });
  };

  const handleRazorpayPayment = async () => {
    try {
      const Razorpay = await initializeRazorpay();
      
      const options = {
        key: RAZORPAY_KEY_ID,
        amount: getTotal() * 100, // Razorpay expects amount in paise
        currency: "INR",
        name: "Revieree",
        description: "Order Payment",
        image: "https://revieree.shop/assets/images/logo.png",
        prefill: {
          name: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
          email: shippingInfo.email,
          contact: shippingInfo.phone,
        },
        theme: {
          color: "#B91C1C",
        },
        // Explicitly enable all payment methods
        method: {
          upi: true,
          card: true,
          netbanking: true,
          wallet: true,
        },
        config: {
          display: {
            hide: [
              { method: 'card', if: { issuer: 'visa' } } 
            ],
            Sequence: ['upi', 'card', 'netbanking', 'wallet'],
            preferences: {
              show_default_payment_methods: true
            }
          }
        },
        handler: (response) => {
          console.log("Payment success:", response);
          completeOrder(response.razorpay_payment_id);
        },
      };

      const razorpay = new Razorpay(options);
      razorpay.open();
      
      razorpay.on("payment.failed", (response) => {
        console.error("Payment failed:", response.error);
        alert("Payment failed. Please try again.");
        setIsProcessing(false);
      });
    } catch (error) {
      console.error("Razorpay error:", error);
      alert("Error initializing payment. Please try again.");
      setIsProcessing(false);
    }
  };

  const completeOrder = async (paymentId = null) => {
    try {
      // Prepare order data
      const orderData = {
        customerName: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
        customerEmail: shippingInfo.email,
        customerPhone: shippingInfo.phone,

        // Items - map to proper format
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.selectedVariation?.price || item.price,
          quantity: item.quantity,
          image: item.image,
          variation: item.selectedVariation?.size || item.selectedVariation?.shade || 'Standard'
        })),

        // Pricing
        subtotal: getSubtotal(),
        shippingCharge: getShipping(),
        totalAmount: getTotal(),
        tax: Math.round(getSubtotal() * 0.18), // 18% GST

        // Payment info
        paymentMethod: paymentInfo.method === 'cod' ? PAYMENT_METHODS.COD : PAYMENT_METHODS.RAZORPAY,
        paymentStatus: paymentInfo.method === 'cod' ? PAYMENT_STATUS.UNPAID : PAYMENT_STATUS.PAID,
        transactionId: paymentId,

        // Addresses
        shippingAddress: {
          firstName: shippingInfo.firstName,
          lastName: shippingInfo.lastName,
          street: shippingInfo.address,
          city: shippingInfo.city,
          state: shippingInfo.state,
          pincode: shippingInfo.pincode,
          country: shippingInfo.country,
          phone: shippingInfo.phone,
          email: shippingInfo.email
        },
        billingAddress: billingInfo.sameAsShipping ? {
          firstName: shippingInfo.firstName,
          lastName: shippingInfo.lastName,
          street: shippingInfo.address,
          city: shippingInfo.city,
          state: shippingInfo.state,
          pincode: shippingInfo.pincode,
          country: shippingInfo.country
        } : billingInfo,
      };

      // Create order in Supabase
      const result = await createOrder(orderData);

      if (result.success) {
        const orderNum = result.order.order_number;
        setOrderNumber(orderNum);

        // Clear cart after successful order
        items.forEach(item => removeFromCart(item.id));

        // Clear items state to update UI
        setItems([]);

        // Clear checkout form data
        localStorage.removeItem('checkout_shipping');
        localStorage.removeItem('checkout_billing');
        localStorage.removeItem('checkout_payment');

        setOrderComplete(true);
      } else {
        console.error('Error creating order:', result.error);
        // Show error to user without blocking
        setIsProcessing(false);
        // You could add a toast notification here instead of alert
      }
    } catch (error) {
      console.error('Error completing order:', error);
      setIsProcessing(false);
      // Log to console instead of showing alert
    }
  };
  
  const [accountInfo, setAccountInfo] = useState({
    createAccount: false,
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (items.length === 0) {
      navigate("/cart");
    }
  }, [items, navigate]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getSubtotal = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getShipping = () => {
    return getSubtotal() >= 500 ? 0 : 50;
  };

  const getTotal = () => {
    return getSubtotal() + getShipping();
  };

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(productId);
    } else {
      updateCartQuantity(productId, newQuantity);
      setItems(prevItems => 
        prevItems.map(item => 
          item.id === productId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const handleRemoveItem = (productId) => {
    removeFromCart(productId);
    setItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone.replace(/[\s\-\+]/g, ''));
  };

  const validatePincode = (pincode) => {
    return /^[0-9]{6}$/.test(pincode);
  };

  const validateStep = (step) => {
    const errors = [];
    
    switch (step) {
      case 1:
        if (!shippingInfo.firstName || !shippingInfo.lastName) {
          errors.push('Full name is required');
        }
        if (!shippingInfo.email || !validateEmail(shippingInfo.email)) {
          errors.push('Please enter a valid email address');
        }
        if (!shippingInfo.phone || !validatePhone(shippingInfo.phone)) {
          errors.push('Please enter a valid 10-digit phone number');
        }
        if (!shippingInfo.address) {
          errors.push('Please enter your shipping address');
        }
        if (!shippingInfo.city || !shippingInfo.state) {
          errors.push('Please select your city and state');
        }
        if (!shippingInfo.pincode || !validatePincode(shippingInfo.pincode)) {
          errors.push('Please enter a valid 6-digit PIN code');
        }
        
        setValidationErrors(errors);
        
        if (errors.length > 0) {
          return false;
        }
        return true;
      case 2:
        return true;
      default:
        return true;
    }
  };

  const handleNextStep = () => {
    setValidationErrors([]);
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    
    if (paymentInfo.method === "razorpay") {
      await handleRazorpayPayment();
      return;
    }
    
    // Simulate order processing for COD/Card/UPI
    setTimeout(() => {
      completeOrder();
    }, 3000);
  };

  const handleCreateAccount = () => {
    if (accountInfo.password !== accountInfo.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    // Handle account creation logic here
    console.log("Creating account with:", {
      email: shippingInfo.email,
      password: accountInfo.password,
      ...shippingInfo
    });
  };

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-xl"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Confirmed!</h1>
          <p className="text-lg text-gray-600 mb-2">Thank you for your purchase</p>
          <p className="text-xl font-semibold text-red-600 mb-6">Order #{orderNumber}</p>
          <p className="text-gray-600 mb-8">
            You will receive a confirmation email shortly with your order details.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => navigate("/")}
              className="w-full py-3 bg-red-800 text-white rounded-lg hover:bg-red-900 transition-colors font-semibold"
            >
              Continue Shopping
            </button>
            <button
              onClick={() => navigate("/profile")}
              className="w-full py-3 border-2 border-red-800 text-red-800 rounded-lg hover:bg-red-50 transition-colors font-semibold"
            >
              View Order History
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-0 pb-16">
      {/* Header (Sticky Navigation) */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="container-custom">
          <div className="flex items-center justify-between py-4">
            <button
              onClick={() => navigate("/cart")}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Back to Cart</span>
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
            <div className="w-20" />
          </div>
        </div>
      </div>

      <div className="container-custom py-8">
        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6"
          >
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-red-800">Please fix the following errors:</h3>
                <ul className="mt-2 space-y-1">
                  {validationErrors.map((error, idx) => (
                    <li key={idx} className="text-sm text-red-700">• {error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4 md:space-x-8">
            {[
              { step: 1, label: "Shipping", icon: MapPin },
              { step: 2, label: "Payment", icon: CreditCard },
              { step: 3, label: "Review", icon: Package },
              { step: 4, label: "Complete", icon: Check },
            ].map(({ step, label, icon: Icon }) => (
              <div key={step} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                    currentStep >= step
                      ? "bg-red-800 border-red-800 text-white"
                      : "bg-white border-gray-300 text-gray-500"
                  }`}
                >
                  <Icon size={20} />
                </div>
                <span
                  className={`ml-2 font-medium text-sm ${
                    currentStep >= step ? "text-gray-900" : "text-gray-500"
                  }`}
                >
                  {label}
                </span>
                {step < 4 && (
                  <div
                    className={`ml-4 md:ml-8 w-8 md:w-16 h-0.5 ${
                      currentStep > step ? "bg-red-800" : "bg-gray-300"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-6">Shipping Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div id="first-name-input">
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                    <input
                      type="text"
                      value={shippingInfo.firstName}
                      onChange={(e) => setShippingInfo({...shippingInfo, firstName: e.target.value})}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-red-800 focus:outline-none"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                    <input
                      type="text"
                      value={shippingInfo.lastName}
                      onChange={(e) => setShippingInfo({...shippingInfo, lastName: e.target.value})}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-red-800 focus:outline-none"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                  <input
                    type="email"
                    value={shippingInfo.email}
                    onChange={(e) => setShippingInfo({...shippingInfo, email: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-red-800 focus:outline-none"
                    placeholder="john@example.com"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    value={shippingInfo.phone}
                    onChange={(e) => setShippingInfo({...shippingInfo, phone: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-red-800 focus:outline-none"
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Street Address *</label>
                  <textarea
                    value={shippingInfo.address}
                    onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-red-800 focus:outline-none"
                    rows={3}
                    placeholder="123 Main St, Apt 4B"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                    <input
                      type="text"
                      value={shippingInfo.city}
                      onChange={(e) => setShippingInfo({...shippingInfo, city: e.target.value})}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-red-800 focus:outline-none"
                      placeholder="Mumbai"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                    <select
                      value={shippingInfo.state}
                      onChange={(e) => setShippingInfo({...shippingInfo, state: e.target.value})}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-red-800 focus:outline-none bg-white"
                    >
                      <option value="">Select State</option>
                      {indianStates.map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">PIN Code *</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={shippingInfo.pincode}
                        onChange={(e) => setShippingInfo({...shippingInfo, pincode: e.target.value})}
                        onBlur={(e) => fetchCityStateFromPincode(e.target.value)}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-red-800 focus:outline-none"
                        placeholder="400001"
                        maxLength={6}
                      />
                      {isFetchingPincode && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <div className="w-4 h-4 border-2 border-red-800 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                  <input
                    type="text"
                    value={shippingInfo.country}
                    onChange={(e) => setShippingInfo({...shippingInfo, country: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-red-800 focus:outline-none"
                    readOnly
                  />
                </div>

                <div className="flex items-center space-x-3 mb-6">
                  <input
                    type="checkbox"
                    checked={billingInfo.sameAsShipping}
                    onChange={(e) => setBillingInfo({...billingInfo, sameAsShipping: e.target.checked})}
                    className="w-5 h-5 text-red-800 border-red-800 rounded focus:ring-red-800"
                  />
                  <label className="text-sm font-medium text-gray-700">
                    Billing address same as shipping
                  </label>
                </div>

                <button
                  onClick={handleNextStep}
                  className="w-full py-3 bg-red-800 text-white rounded-lg hover:bg-red-900 transition-colors font-semibold"
                >
                  Continue to Payment
                </button>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-6">Payment Method</h2>
                
                <div className="space-y-3 mb-6">
                  {[
                    { value: "cod", label: "Cash on Delivery", description: "Pay when you receive your order" },
                    { value: "razorpay", label: "UPI / Card / Wallet Payment", description: "Pay securely via Razorpay" },
                  ].map((method) => (
                    <label
                      key={method.value}
                      className={`block p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        paymentInfo.method === method.value
                          ? "border-red-800 bg-red-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={method.value}
                        checked={paymentInfo.method === method.value}
                        onChange={(e) => setPaymentInfo({...paymentInfo, method: e.target.value})}
                        className="sr-only"
                      />
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-900">{method.label}</div>
                          <div className="text-sm text-gray-600">{method.description}</div>
                        </div>
                        {paymentInfo.method === method.value && (
                          <Check className="w-5 h-5 text-red-800" />
                        )}
                      </div>
                    </label>
                  ))}
                </div>

                {paymentInfo.method === "razorpay" && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800">
                      You will be redirected to Razorpay secure checkout to complete your payment via UPI, Cards, or Wallets.
                    </p>
                  </div>
                )}

                <div className="flex items-center space-x-3 mb-6">
                  <input
                    type="checkbox"
                    checked={paymentInfo.savePayment}
                    onChange={(e) => setPaymentInfo({...paymentInfo, savePayment: e.target.checked})}
                    className="w-5 h-5 text-red-800 border-red-800 rounded focus:ring-red-800"
                  />
                  <label className="text-sm font-medium text-gray-700">
                    Save payment information for future orders
                  </label>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={handlePrevStep}
                    className="flex-1 py-3 border-2 border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                  >
                    Back to Shipping
                  </button>
                  <button
                    onClick={handleNextStep}
                    className="flex-1 py-3 bg-red-800 text-white rounded-lg hover:bg-red-900 transition-colors font-semibold"
                  >
                    Review Order
                  </button>
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                {/* Order Items */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Order Items</h2>
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4 pb-4 border-b border-gray-100 last:border-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{item.name}</h3>
                          <p className="text-sm text-gray-600">
                            {item.selectedVariation?.size || item.selectedVariation?.shade || "Standard"} • Qty: {item.quantity}
                          </p>
                          <p className="font-semibold text-red-600">
                            {formatPrice((item.selectedVariation?.price || item.price) * item.quantity)}
                          </p>
                        </div>
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Shipping Address</h2>
                  <div className="space-y-2 text-gray-600">
                    <p className="font-medium text-gray-900">
                      {shippingInfo.firstName} {shippingInfo.lastName}
                    </p>
                    <p>{shippingInfo.address}</p>
                    <p>
                      {shippingInfo.city}, {shippingInfo.state} - {shippingInfo.pincode}
                    </p>
                    <p>{shippingInfo.country}</p>
                    <p>{shippingInfo.phone}</p>
                    <p>{shippingInfo.email}</p>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Method</h2>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                      {paymentInfo.method === "cod" && <Truck className="w-6 h-6 text-red-800" />}
                      {(paymentInfo.method === "upi" || paymentInfo.method === "razorpay" || paymentInfo.method === "card") && <CreditCard className="w-6 h-6 text-red-800" />}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {paymentInfo.method === "cod" && "Cash on Delivery"}
                        {paymentInfo.method === "razorpay" && "UPI / Card / Wallet Payment"}
                        {paymentInfo.method === "upi" && "UPI Payment"}
                        {paymentInfo.method === "card" && "Credit/Debit Card"}
                      </p>
                      {paymentInfo.method === "card" && (
                        <p className="text-sm text-gray-600">**** **** **** {paymentInfo.cardNumber?.slice(-4) || "1234"}</p>
                      )}
                      {paymentInfo.method === "upi" && (
                        <p className="text-sm text-gray-600">{paymentInfo.upiId || "yourname@upi"}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={handlePrevStep}
                    className="flex-1 py-3 border-2 border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                  >
                    Back to Payment
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                    className="flex-1 py-3 bg-red-800 text-white rounded-lg hover:bg-red-900 transition-colors font-semibold disabled:bg-gray-400"
                  >
                    {isProcessing ? (
                      <span className="flex items-center justify-center">
                        <Clock className="w-5 h-5 mr-2 animate-spin" />
                        Processing...
                      </span>
                    ) : (
                      "Place Order"
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({items.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                  <span className="font-medium">{formatPrice(getSubtotal())}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  {getShipping() === 0 ? (
                    <span className="font-medium text-green-600">Free</span>
                  ) : (
                    <span className="font-medium">{formatPrice(getShipping())}</span>
                  )}
                </div>
                {getShipping() > 0 && (
                  <div className="text-sm text-gray-500">
                    Add {formatPrice(500 - getSubtotal())} more for free shipping
                  </div>
                )}
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span className="text-red-600">{formatPrice(getTotal())}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500">* Inclusive of all taxes</p>
              </div>

              {/* Security Badges */}
              <div className="border-t pt-6">
                <div className="flex items-center justify-center space-x-6 text-gray-500">
                  <Shield className="w-6 h-6" />
                  <Lock className="w-6 h-6" />
                  <Package className="w-6 h-6" />
                </div>
                <p className="text-center text-sm text-gray-500 mt-3">
                  Secure checkout powered by industry-standard encryption
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;