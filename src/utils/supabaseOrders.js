// Supabase Orders Management
import { supabase } from '../lib/supabase';

// Order Status Constants
export const ORDER_STATUS = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  PROCESSING: 'Processing',
  SHIPPED: 'Shipped',
  OUT_FOR_DELIVERY: 'Out for Delivery',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
  RETURNED: 'Returned',
};

// Payment Status Constants
export const PAYMENT_STATUS = {
  PAID: 'Paid',
  UNPAID: 'Unpaid',
  FAILED: 'Failed',
  REFUNDED: 'Refunded',
  PARTIALLY_REFUNDED: 'Partially Refunded',
};

// Payment Methods
export const PAYMENT_METHODS = {
  COD: 'Cash on Delivery',
  ONLINE: 'Online Payment',
  UPI: 'UPI',
  CARD: 'Credit/Debit Card',
  RAZORPAY: 'Razorpay',
};

/**
 * Create a new order in Supabase
 */
export const createOrder = async (orderData) => {
  try {
    if (!supabase) {
      throw new Error('Supabase not configured');
    }

    // Calculate totals
    const subtotal = orderData.subtotal || orderData.totalAmount || 0;
    const discount = orderData.discount || 0;
    const tax = orderData.tax || Math.round(subtotal * 0.18); // 18% GST default
    const shippingCharge = orderData.shippingCharge || 0;
    const totalAmount = subtotal - discount + tax + shippingCharge;

    const newOrder = {
      order_number: `ORD-${Date.now().toString().slice(-8)}`,
      customer_name: orderData.customerName,
      customer_email: orderData.customerEmail,
      customer_phone: orderData.customerPhone || null,

      // Order Status
      status: orderData.status || ORDER_STATUS.PENDING,

      // Payment Information
      payment_status: orderData.paymentStatus || (orderData.paymentMethod === PAYMENT_METHODS.COD ? PAYMENT_STATUS.UNPAID : PAYMENT_STATUS.PAID),
      payment_method: orderData.paymentMethod || PAYMENT_METHODS.COD,
      transaction_id: orderData.transactionId || null,

      // Pricing Details
      subtotal,
      discount,
      discount_code: orderData.discountCode || null,
      tax,
      tax_rate: orderData.taxRate || 18,
      shipping_charge: shippingCharge,
      total_amount: totalAmount,

      // Items
      items: orderData.items || [],

      // Shipping Information
      shipping_address: orderData.shippingAddress || {},
      billing_address: orderData.billingAddress || orderData.shippingAddress || {},
      tracking_number: orderData.trackingNumber || null,
      shipping_partner: orderData.shippingPartner || '',
      estimated_delivery: orderData.estimatedDelivery || null,

      // Status History
      status_history: [{
        status: orderData.status || ORDER_STATUS.PENDING,
        timestamp: new Date().toISOString(),
        note: 'Order placed',
      }],
    };

    const { data, error } = await supabase
      .from('orders')
      .insert([newOrder])
      .select()
      .single();

    if (error) {
      console.error('Supabase order creation error:', error);
      throw error;
    }

    return { success: true, order: data };
  } catch (error) {
    console.error('Error creating order:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get all orders
 */
export const getOrders = async () => {
  try {
    if (!supabase) {
      throw new Error('Supabase not configured');
    }

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error getting orders:', error);
    return [];
  }
};

/**
 * Get order by ID
 */
export const getOrderById = async (orderId) => {
  try {
    if (!supabase) {
      throw new Error('Supabase not configured');
    }

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting order:', error);
    return null;
  }
};

/**
 * Get orders by customer email
 */
export const getOrdersByEmail = async (email) => {
  try {
    if (!supabase) {
      throw new Error('Supabase not configured');
    }

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('customer_email', email)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error getting orders by email:', error);
    return [];
  }
};

/**
 * Update order
 */
export const updateOrder = async (orderId, updates) => {
  try {
    if (!supabase) {
      throw new Error('Supabase not configured');
    }

    // Get current order to update status history
    const { data: currentOrder } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (!currentOrder) {
      throw new Error('Order not found');
    }

    const updatedData = { ...updates };

    // If status changed, add to history
    if (updates.status && updates.status !== currentOrder.status) {
      const statusHistory = currentOrder.status_history || [];
      statusHistory.push({
        status: updates.status,
        timestamp: new Date().toISOString(),
        note: updates.statusNote || `Status updated to ${updates.status}`,
      });
      updatedData.status_history = statusHistory;

      // If delivered, record actual delivery date
      if (updates.status === ORDER_STATUS.DELIVERED) {
        updatedData.actual_delivery = new Date().toISOString();
      }
    }

    const { data, error } = await supabase
      .from('orders')
      .update(updatedData)
      .eq('id', orderId)
      .select()
      .single();

    if (error) throw error;
    return { success: true, order: data };
  } catch (error) {
    console.error('Error updating order:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get order analytics
 */
export const getOrderAnalytics = async () => {
  try {
    const orders = await getOrders();

    const analytics = {
      total: orders.length,
      byStatus: {},
      totalRevenue: 0,
      deliveryRate: 0,
      returnRate: 0,
    };

    // Count by status
    Object.values(ORDER_STATUS).forEach((status) => {
      analytics.byStatus[status] = orders.filter((o) => o.status === status).length;
    });

    // Calculate revenue from delivered orders
    analytics.totalRevenue = orders
      .filter((o) => o.status === ORDER_STATUS.DELIVERED)
      .reduce((sum, o) => sum + (parseFloat(o.total_amount) || 0), 0);

    // Calculate delivery rate
    const deliveredOrders = orders.filter((o) => o.status === ORDER_STATUS.DELIVERED).length;
    const totalNonPending = orders.filter((o) => o.status !== ORDER_STATUS.PENDING).length;
    analytics.deliveryRate = totalNonPending > 0 ? Math.round((deliveredOrders / totalNonPending) * 100) : 0;

    // Calculate return rate
    const returnedOrders = orders.filter((o) => o.status === ORDER_STATUS.RETURNED).length;
    analytics.returnRate = orders.length > 0 ? Math.round((returnedOrders / orders.length) * 100) : 0;

    return analytics;
  } catch (error) {
    console.error('Error getting order analytics:', error);
    return {
      total: 0,
      byStatus: {},
      totalRevenue: 0,
      deliveryRate: 0,
      returnRate: 0,
    };
  }
};

/**
 * Check if Supabase is configured
 */
export const isSupabaseConfigured = () => {
  return supabase !== null;
};
