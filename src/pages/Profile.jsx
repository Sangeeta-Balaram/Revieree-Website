import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, Mail, Lock, Calendar, Save, Eye, EyeOff, LogOut, 
  Package, MapPin, CreditCard, Shield, RotateCcw, Settings,
  ChevronRight, Plus, Edit, Trash2
} from 'lucide-react';
import { motion } from 'framer-motion';
import VintageOrnament from '../components/VintageOrnament';
import { getCurrentUser, updateProfile, changePassword, signOut, isAuthenticated, hasPasswordSet } from '../utils/auth';

const Profile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [user, setUser] = useState(() => getCurrentUser());
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [profileData, setProfileData] = useState(() => {
    const currentUser = getCurrentUser();
    return {
      name: currentUser?.name || '',
      email: currentUser?.email || '',
      phone: currentUser?.phone || '',
    };
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [addresses, setAddresses] = useState(() => {
    const currentUser = getCurrentUser();
    return currentUser?.addresses || [];
  });

  const [orders, setOrders] = useState(() => {
    return JSON.parse(localStorage.getItem('revieree_orders') || '[]');
  });

  const [hasPassword, setHasPassword] = useState(() => {
    const currentUser = getCurrentUser();
    return currentUser ? hasPasswordSet(currentUser.id) : false;
  });

  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
  const [selectedPaymentType, setSelectedPaymentType] = useState(null);

  const [savedPayments, setSavedPayments] = useState(() => {
    const currentUser = getCurrentUser();
    return currentUser?.paymentMethods || [];
  });

  const handleAddCard = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newCard = {
      id: Date.now(),
      type: 'card',
      last4: formData.get('cardNumber').slice(-4),
      holderName: formData.get('holderName'),
      expiry: formData.get('expiry'),
    };
    const updatedPayments = [...savedPayments, newCard];
    setSavedPayments(updatedPayments);
    updateProfile(user.id, { paymentMethods: updatedPayments });
    setSelectedPaymentType(null);
    setSuccessMessage('Card added successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleAddUPI = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newUPI = {
      id: Date.now(),
      type: 'upi',
      upiId: formData.get('upiId'),
    };
    const updatedPayments = [...savedPayments, newUPI];
    setSavedPayments(updatedPayments);
    updateProfile(user.id, { paymentMethods: updatedPayments });
    setSelectedPaymentType(null);
    setSuccessMessage('UPI added successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleAddNetBanking = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newBank = {
      id: Date.now(),
      type: 'netbanking',
      bankName: formData.get('bankName'),
    };
    const updatedPayments = [...savedPayments, newBank];
    setSavedPayments(updatedPayments);
    updateProfile(user.id, { paymentMethods: updatedPayments });
    setSelectedPaymentType(null);
    setSuccessMessage('Bank added successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleAddWallet = (wallet) => {
    const newWallet = {
      id: Date.now(),
      type: 'wallet',
      walletName: wallet,
    };
    const updatedPayments = [...savedPayments, newWallet];
    setSavedPayments(updatedPayments);
    updateProfile(user.id, { paymentMethods: updatedPayments });
    setSelectedPaymentType(null);
    setSuccessMessage(`${wallet} connected successfully!`);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleDeletePayment = (paymentId) => {
    const updatedPayments = savedPayments.filter(p => p.id !== paymentId);
    setSavedPayments(updatedPayments);
    updateProfile(user.id, { paymentMethods: updatedPayments });
    setSuccessMessage('Payment method removed');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Clear messages when switching tabs
  useEffect(() => {
    setSuccessMessage('');
    setErrorMessage('');
    setShowPasswordSection(false);
  }, [activeTab]);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
  }, [navigate]);

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    const result = updateProfile(user.id, profileData);

    if (result.success) {
      setUser({ ...user, ...profileData });
      setIsEditing(false);
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } else {
      setErrorMessage(result.error);
    }
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setErrorMessage('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setErrorMessage('New password must be at least 6 characters');
      return;
    }

    // For users who already have a password set, require current password
    const currentPassword = hasPassword ? passwordData.currentPassword : '';
    const result = changePassword(user.id, currentPassword, passwordData.newPassword);

    if (result.success) {
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordSection(false);
      setHasPassword(true);
      setSuccessMessage('Password changed successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } else {
      setErrorMessage(result.error);
    }
  };

  const handleLogout = () => {
    signOut();
    navigate('/');
  };

  const handleAddAddress = () => {
    const newAddress = {
      id: Date.now(),
      type: 'Home',
      fullName: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      phone: '',
    };
    setAddresses([...addresses, newAddress]);
  };

  const handleSaveAddress = (id, updatedAddress) => {
    const updatedAddresses = addresses.map(addr => 
      addr.id === id ? updatedAddress : addr
    );
    setAddresses(updatedAddresses);
    updateProfile(user.id, { addresses: updatedAddresses });
  };

  const handleDeleteAddress = (id) => {
    const updatedAddresses = addresses.filter(addr => addr.id !== id);
    setAddresses(updatedAddresses);
    updateProfile(user.id, { addresses: updatedAddresses });
  };

  if (!user) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  const tabs = [
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'orders', label: 'My Orders', icon: Package },
    { id: 'returns', label: 'Returns', icon: RotateCcw },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'security', label: 'Login & Security', icon: Shield },
    { id: 'payments', label: 'Payment Methods', icon: CreditCard },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gray-50">
      <div className="container-custom">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-72 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">My Account</h2>
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'bg-burgundy-700 text-white font-medium'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <tab.icon size={18} />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Success/Error Messages */}
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-50 text-green-700 p-4 rounded-lg mb-6"
              >
                {successMessage}
              </motion.div>
            )}

            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 text-red-700 p-4 rounded-lg mb-6"
              >
                {errorMessage}
              </motion.div>
            )}

            {/* My Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-gray-900">My Profile</h2>
                  {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-burgundy-700 text-white rounded-lg hover:bg-burgundy-800 transition-colors"
                  >
                    Edit Profile
                  </button>
                  )}
                </div>

                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        disabled={!isEditing}
                        className={`w-full px-4 py-3 border border-gray-300 rounded-lg ${
                          !isEditing ? 'bg-gray-50 cursor-not-allowed' : ''
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        disabled={!isEditing}
                        className={`w-full px-4 py-3 border border-gray-300 rounded-lg ${
                          !isEditing ? 'bg-gray-50 cursor-not-allowed' : ''
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        disabled={!isEditing}
                        placeholder="Enter phone number"
                        className={`w-full px-4 py-3 border border-gray-300 rounded-lg ${
                          !isEditing ? 'bg-gray-50 cursor-not-allowed' : ''
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Member Since</label>
                      <input
                        type="text"
                        value={user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'long', year: 'numeric'
                        }) : 'N/A'}
                        disabled
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                      />
                    </div>
                  </div>

                  {isEditing && (
                    <button
                      type="submit"
                      className="w-full bg-burgundy-700 text-white py-3 rounded-lg font-medium hover:bg-red-800 transition-colors"
                    >
                      Save Changes
                    </button>
                  )}
                </form>
              </div>
            )}

            {/* My Orders Tab */}
            {activeTab === 'orders' && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">My Orders</h2>
                {orders.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No orders yet</p>
                    <button
                      onClick={() => navigate('/products/fragrances')}
                      className="mt-4 px-6 py-3 bg-burgundy-700 text-white rounded-lg hover:bg-red-800"
                    >
                      Start Shopping
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <p className="font-medium text-gray-900">Order #{order.id}</p>
                            <p className="text-sm text-gray-500">{new Date(order.date).toLocaleDateString('en-IN')}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm ${
                            order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                            order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                        <div className="space-y-2">
                          {order.items?.map((item, idx) => (
                            <div key={idx} className="flex items-center space-x-4">
                              <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                              <div>
                                <p className="font-medium">{item.name}</p>
                                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 pt-4 border-t flex justify-between">
                          <span className="font-medium">Total: ₹{order.total?.toLocaleString('en-IN')}</span>
                          <button className="text-red-700 hover:underline">View Details</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Returns Tab */}
            {activeTab === 'returns' && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Returns & Refunds</h2>
                <div className="text-center py-12">
                  <RotateCcw className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No return requests</p>
                  <p className="text-sm text-gray-400">Your returns will appear here</p>
                </div>
              </div>
            )}

            {/* Addresses Tab */}
            {activeTab === 'addresses' && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold text-gray-900">My Addresses</h2>
                  <button
                    onClick={handleAddAddress}
                    className="flex items-center space-x-2 px-4 py-2 bg-burgundy-700 text-white rounded-lg hover:bg-red-800"
                  >
                    <Plus size={18} />
                    <span>Add Address</span>
                  </button>
                </div>
                
                {addresses.length === 0 ? (
                  <div className="text-center py-12">
                    <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No addresses saved</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {addresses.map((address) => (
                      <AddressCard 
                        key={address.id} 
                        address={address} 
                        onSave={(updated) => handleSaveAddress(address.id, updated)}
                        onDelete={() => handleDeleteAddress(address.id)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Login & Security Tab */}
            {activeTab === 'security' && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Login & Security</h2>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between py-4 border-b">
                    <div className="flex items-center space-x-4">
                      <Lock className="text-gray-400" />
                      <div>
                        <p className="font-medium">Password</p>
                        <p className="text-sm text-gray-500">
                          {!hasPassword 
                            ? 'Set a password to login with email' 
                            : 'Last changed: Never'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowPasswordSection(!showPasswordSection)}
                      className="text-burgundy-700 hover:underline"
                    >
                      {!hasPassword ? 'Set Password' : 'Change'}
                    </button>
                  </div>

                  {showPasswordSection && (
                    <form onSubmit={handlePasswordChange} className="space-y-4 p-4 bg-gray-50 rounded-lg">
                      {hasPassword && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                          <input
                            type={showCurrentPassword ? 'text' : 'password'}
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                            required
                          />
                        </div>
                      )}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                          required
                        />
                      </div>
                      <div className="flex space-x-4">
                        <button type="submit" className="px-6 py-2 bg-burgundy-700 text-white rounded-lg hover:bg-burgundy-800">
                          {hasPassword ? 'Update Password' : 'Set Password'}
                        </button>
                        <button 
                          type="button" 
                          onClick={() => setShowPasswordSection(false)}
                          className="px-6 py-2 border border-gray-300 rounded-lg"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}

                  <div className="flex items-center justify-between py-4 border-b">
                    <div className="flex items-center space-x-4">
                      <Shield className="text-gray-400" />
                      <div>
                        <p className="font-medium">Two-Factor Authentication</p>
                        <p className="text-sm text-gray-500">Add extra security to your account</p>
                      </div>
                    </div>
                    <span className="text-sm text-gray-400">Coming Soon</span>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Methods Tab */}
            {activeTab === 'payments' && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex inline-flex items-center justify-between w-full mb-6">
                  <h2 className="text-2xl font-semibold text-gray-900">Payment Methods</h2>
                </div>

                {/* Saved Payment Methods */}
                {savedPayments.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-sm font-medium text-gray-500 mb-4">SAVED PAYMENT METHODS</h3>
                    <div className="space-y-3">
                      {savedPayments.map((payment) => (
                        <div key={payment.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div className="flex items-center space-x-4">
                            {payment.type === 'card' && <CreditCard className="w-8 h-8 text-burgundy-700" />}
                            {payment.type === 'upi' && <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center"><span className="text-green-700 font-bold text-xs">UPI</span></div>}
                            {payment.type === 'netbanking' && <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center"><span className="text-blue-700 font-bold text-xs">NB</span></div>}
                            {payment.type === 'wallet' && <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center"><span className="text-purple-700 font-bold text-xs">₹</span></div>}
                            <div>
                              {payment.type === 'card' && <p className="font-medium">•••• {payment.last4}</p>}
                              {payment.type === 'upi' && <p className="font-medium">{payment.upiId}</p>}
                              {payment.type === 'netbanking' && <p className="font-medium">{payment.bankName}</p>}
                              {payment.type === 'wallet' && <p className="font-medium capitalize">{payment.walletName}</p>}
                            </div>
                          </div>
                          <button onClick={() => handleDeletePayment(payment.id)} className="text-gray-400 hover:text-red-600">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Payment Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* credit/Debit Card */}
                  <div 
                    onClick={() => setSelectedPaymentType('card')}
                    className="border border-gray-200 rounded-xl p-6 hover:border-burgundy-700 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center space-x-4">
                      <CreditCard className="w-10 h-10 text-burgundy-700" />
                      <div>
                        <h3 className="font-medium text-gray-900">Credit / Debit Card</h3>
                        <p className="text-sm text-gray-500">Add your card for faster checkout</p>
                      </div>
                    </div>
                  </div>

                  {/* UPI */}
                  <div 
                    onClick={() => setSelectedPaymentType('upi')}
                    className="border border-gray-200 rounded-xl p-6 hover:border-burgundy-700 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <span className="text-green-700 font-bold text-sm">UPI</span>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">UPI</h3>
                        <p className="text-sm text-gray-500">Pay using UPI ID or QR</p>
                      </div>
                    </div>
                  </div>

                  {/* Wallets */}
                  <div 
                    onClick={() => setSelectedPaymentType('wallet')}
                    className="border border-gray-200 rounded-xl p-6 hover:border-burgundy-700 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <span className="text-purple-700 font-bold text-sm">₹</span>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">Wallets</h3>
                        <p className="text-sm text-gray-500">Paytm, Amazon Pay, etc.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Add Payment Modal */}
                {selectedPaymentType && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-gray-900">
                          {selectedPaymentType === 'card' && 'Add Credit/Debit Card'}
                          {selectedPaymentType === 'upi' && 'Add UPI ID'}
                          {selectedPaymentType === 'netbanking' && 'Add Net Banking'}
                          {selectedPaymentType === 'wallet' && 'Connect Wallet'}
                        </h3>
                        <button onClick={() => setSelectedPaymentType(null)} className="text-gray-400 hover:text-gray-600">
                          ✕
                        </button>
                      </div>

                      {selectedPaymentType === 'card' && (
                        <form onSubmit={handleAddCard} className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                            <input name="cardNumber" type="text" placeholder="1234 5678 9012 3456" maxLength={19} className="w-full px-4 py-3 border border-gray-300 rounded-lg" required />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Card Holder Name</label>
                            <input name="holderName" type="text" placeholder="John Doe" className="w-full px-4 py-3 border border-gray-300 rounded-lg" required />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                              <input 
                                name="expiry" 
                                type="text" 
                                placeholder="MM/YY" 
                                maxLength={5} 
                                onInput={(e) => {
                                  let value = e.target.value.replace(/\D/g, '');
                                  if (value.length >= 2) {
                                    value = value.slice(0, 2) + '/' + value.slice(2, 4);
                                  }
                                  e.target.value = value;
                                }}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg" 
                                required 
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                              <input name="cvv" type="text" placeholder="123" maxLength={4} className="w-full px-4 py-3 border border-gray-300 rounded-lg" required />
                            </div>
                          </div>
                          <button type="submit" className="w-full py-3 bg-burgundy-700 text-white rounded-lg hover:bg-burgundy-800">
                            Add Card
                          </button>
                        </form>
                      )}

                      {selectedPaymentType === 'upi' && (
                        <form onSubmit={handleAddUPI} className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">UPI ID</label>
                            <input name="upiId" type="text" placeholder="yourname@upi" className="w-full px-4 py-3 border border-gray-300 rounded-lg" required />
                          </div>
                          <button type="submit" className="w-full py-3 bg-burgundy-700 text-white rounded-lg hover:bg-burgundy-800">
                            Add UPI
                          </button>
                        </form>
                      )}

                      {selectedPaymentType === 'netbanking' && (
                        <form onSubmit={handleAddNetBanking} className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Select Bank</label>
                            <select className="w-full px-4 py-3 border border-gray-300 rounded-lg" required>
                              <option value="">Select your bank</option>
                              <option value="sbi">State Bank of India</option>
                              <option value="hdfc">HDFC Bank</option>
                              <option value="icici">ICICI Bank</option>
                              <option value="axis">Axis Bank</option>
                              <option value="kotak">Kotak Mahindra</option>
                              <option value="other">Other Banks</option>
                            </select>
                          </div>
                          <button type="submit" className="w-full py-3 bg-burgundy-700 text-white rounded-lg hover:bg-burgundy-800">
                            Add Bank
                          </button>
                        </form>
                      )}

                      {selectedPaymentType === 'wallet' && (
                        <div className="space-y-4">
                          <p className="text-gray-600">Connect your wallet for quick payments</p>
                          <div className="space-y-2">
                            <button onClick={() => handleAddWallet('Paytm')} className="w-full py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
                              Connect Paytm
                            </button>
                            <button onClick={() => handleAddWallet('Amazon Pay')} className="w-full py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">
                              Connect Amazon Pay
                            </button>
                            <button onClick={() => handleAddWallet('PhonePe')} className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                              Connect PhonePe
                            </button>
                          </div>
                          <p className="text-xs text-gray-500 text-center">Wallet integration coming soon</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full mt-6 flex items-center justify-center space-x-2 bg-burgundy-700 text-white py-3 rounded-lg font-medium hover:bg-burgundy-800 transition-colors"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const AddressCard = ({ address, onSave, onDelete }) => {
  const [isEditing, setIsEditing] = useState(!address.fullName);
  const [data, setData] = useState(address);

  const handleSave = () => {
    onSave(data);
    setIsEditing(false);
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex justify-between items-start mb-2">
        <span className="px-2 py-1 bg-gray-100 text-xs rounded">{address.type || 'Home'}</span>
        <div className="flex space-x-2">
          <button onClick={() => setIsEditing(!isEditing)} className="text-gray-400 hover:text-gray-600">
            <Edit size={16} />
          </button>
          <button onClick={onDelete} className="text-gray-400 hover:text-red-600">
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      
      {isEditing ? (
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Full Name"
            value={data.fullName}
            onChange={(e) => setData({ ...data, fullName: e.target.value })}
            className="w-full px-3 py-2 border rounded"
          />
          <input
            type="text"
            placeholder="Address"
            value={data.address}
            onChange={(e) => setData({ ...data, address: e.target.value })}
            className="w-full px-3 py-2 border rounded"
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="City"
              value={data.city}
              onChange={(e) => setData({ ...data, city: e.target.value })}
              className="w-full px-3 py-2 border rounded"
            />
            <input
              type="text"
              placeholder="Pincode"
              value={data.pincode}
              onChange={(e) => setData({ ...data, pincode: e.target.value })}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <button onClick={handleSave} className="w-full py-2 bg-burgundy-700 text-white rounded">
            Save Address
          </button>
        </div>
      ) : (
        <div>
          <p className="font-medium">{address.fullName}</p>
          <p className="text-sm text-gray-500">{address.address}</p>
          <p className="text-sm text-gray-500">{address.city} - {address.pincode}</p>
        </div>
      )}
    </div>
  );
};

export default Profile;
