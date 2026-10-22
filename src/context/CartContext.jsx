import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { STORAGE_KEYS, getStoredData, setStoredData } from '../utils/storage';
import { useCourses } from './CourseContext';
import ToastNotification from '../components/common/ToastNotification';
import { sound } from '../utils/sound';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { enrollCourse } = useCourses();

  // 1. Cart Items state (persisted in localStorage)
  const [cartItems, setCartItems] = useState(() =>
    getStoredData(STORAGE_KEYS.CART, [])
  );

  // 2. Completed Demo Orders list (persisted in localStorage)
  const [demoOrders, setDemoOrders] = useState(() =>
    getStoredData(STORAGE_KEYS.ORDERS, [])
  );

  // 3. Current active checkout/payment order (persisted in localStorage)
  const [currentOrder, setCurrentOrder] = useState(() =>
    getStoredData(STORAGE_KEYS.CURRENT_ORDER, null)
  );

  // 4. Toast notifications queue
  const [toasts, setToasts] = useState([]);

  // Toast helper
  const showToast = useCallback((title, message, type = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    const newToast = { id, title, message, type };

    setToasts((prev) => [...prev, newToast]);

    // Auto-dismiss after 3.8 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Sync cart items with localStorage
  useEffect(() => {
    setStoredData(STORAGE_KEYS.CART, cartItems);
  }, [cartItems]);

  // Sync demo orders with localStorage
  useEffect(() => {
    setStoredData(STORAGE_KEYS.ORDERS, demoOrders);
  }, [demoOrders]);

  // Sync current pending order with localStorage
  useEffect(() => {
    if (currentOrder) {
      setStoredData(STORAGE_KEYS.CURRENT_ORDER, currentOrder);
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_ORDER);
    }
  }, [currentOrder]);

  // Check if course is already in cart
  const isInCart = useCallback(
    (courseId) => {
      return cartItems.some((item) => item.id === courseId);
    },
    [cartItems]
  );

  // Purchased course IDs extracted from all completed demo orders
  const purchasedCourseIds = useMemo(() => {
    const ids = new Set();
    demoOrders.forEach((order) => {
      if (order.status === 'Completed' && Array.isArray(order.items)) {
        order.items.forEach((item) => ids.add(item.id));
      }
    });
    return Array.from(ids);
  }, [demoOrders]);

  const isPurchased = useCallback(
    (courseId) => {
      return purchasedCourseIds.includes(courseId);
    },
    [purchasedCourseIds]
  );

  // Add course to cart (prevents duplicates)
  const addToCart = useCallback(
    (course) => {
      if (!course || !course.id) return false;

      // Check if already purchased
      if (purchasedCourseIds.includes(course.id)) {
        showToast(
          'Already Owned',
          `You have already purchased "${course.title}". Start learning in My Courses!`,
          'info'
        );
        return false;
      }

      // Check if already in cart
      if (cartItems.some((item) => item.id === course.id)) {
        showToast(
          'Already in Cart',
          `"${course.title}" is already in your shopping bag.`,
          'info'
        );
        return false;
      }

      const itemToAdd = {
        id: course.id,
        title: course.title,
        thumbnail: course.thumbnail,
        price: Number(course.price || 49.99),
        originalPrice: Number(course.originalPrice || 89.99),
        category: course.category || 'General',
        instructor: {
          name: course.instructor?.name || 'LearnSphere Faculty',
          avatar: course.instructor?.avatar || ''
        },
        duration: course.duration || 'Self-Paced',
        level: course.level || 'All Levels'
      };

      setCartItems((prev) => [...prev, itemToAdd]);
      showToast(
        'Added to Cart',
        `"${course.title}" was added to your shopping bag!`,
        'cart'
      );
      return true;
    },
    [cartItems, purchasedCourseIds, showToast]
  );

  // Remove course from cart
  const removeFromCart = useCallback(
    (courseId) => {
      const target = cartItems.find((item) => item.id === courseId);
      setCartItems((prev) => prev.filter((item) => item.id !== courseId));
      if (target) {
        showToast(
          'Removed from Cart',
          `"${target.title}" was removed from your cart.`,
          'info'
        );
      }
    },
    [cartItems, showToast]
  );

  // Clear cart entirely
  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  // Price calculations
  const subtotal = useMemo(() => {
    const sum = cartItems.reduce((acc, item) => acc + Number(item.price || 0), 0);
    return Math.round(sum * 100) / 100;
  }, [cartItems]);

  const originalSubtotal = useMemo(() => {
    const sum = cartItems.reduce(
      (acc, item) => acc + Number(item.originalPrice || item.price * 1.6 || 0),
      0
    );
    return Math.round(sum * 100) / 100;
  }, [cartItems]);

  const savings = useMemo(() => {
    const diff = originalSubtotal - subtotal;
    return diff > 0 ? Math.round(diff * 100) / 100 : 0;
  }, [originalSubtotal, subtotal]);

  const total = subtotal;

  // Create a pending checkout order
  const createPendingOrder = useCallback(
    (studentInfo) => {
      if (cartItems.length === 0) {
        showToast('Cart is Empty', 'Please add at least one course before checking out.', 'error');
        return null;
      }

      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const orderRef = `ORD-2026-${randomSuffix}`;

      const orderDraft = {
        orderId: orderRef,
        student: {
          name: studentInfo.name?.trim() || 'Demo Scholar',
          email: studentInfo.email?.trim() || 'student@learnsphere.edu'
        },
        items: [...cartItems],
        subtotal,
        originalSubtotal,
        savings,
        total,
        status: 'Pending Payment',
        paymentMethod: 'Demo QR Simulation',
        createdAt: new Date().toISOString()
      };

      setCurrentOrder(orderDraft);
      return orderDraft;
    },
    [cartItems, subtotal, originalSubtotal, savings, total, showToast]
  );

  // Simulate successful payment completion
  const simulatePaymentSuccess = useCallback(() => {
    if (!currentOrder) return null;

    const completedOrder = {
      ...currentOrder,
      status: 'Completed',
      paidAt: new Date().toISOString()
    };

    // 1. Add to completed demo orders
    setDemoOrders((prev) => [completedOrder, ...prev]);

    // 2. Automatically enroll student in the purchased courses
    if (Array.isArray(completedOrder.items)) {
      completedOrder.items.forEach((item) => {
        enrollCourse(item.id);
      });
    }

    // 3. Clear shopping cart
    setCartItems([]);

    // 4. Update current order status
    setCurrentOrder(completedOrder);

    // 5. Play fanfare sound if available
    try {
      sound.playFanfare();
    } catch {
      // Audio playback fallback
    }

    showToast(
      'Payment Simulated Successfully! 🎉',
      `Order ${completedOrder.orderId} verified in Demo Mode. Your courses are now unlocked!`,
      'success'
    );

    return completedOrder;
  }, [currentOrder, enrollCourse, showToast]);

  // Cancel order
  const cancelCurrentOrder = useCallback(() => {
    if (currentOrder) {
      setCurrentOrder(null);
      showToast(
        'Order Cancelled',
        'Your pending order has been cancelled. Your cart items remain saved.',
        'info'
      );
    }
  }, [currentOrder, showToast]);

  const value = {
    cartItems,
    cartCount: cartItems.length,
    addToCart,
    removeFromCart,
    clearCart,
    isInCart,
    subtotal,
    originalSubtotal,
    savings,
    total,
    currentOrder,
    demoOrders,
    purchasedCourseIds,
    isPurchased,
    createPendingOrder,
    simulatePaymentSuccess,
    cancelCurrentOrder,
    showToast
  };

  return (
    <CartContext.Provider value={value}>
      {children}
      <ToastNotification toasts={toasts} onDismiss={dismissToast} />
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
