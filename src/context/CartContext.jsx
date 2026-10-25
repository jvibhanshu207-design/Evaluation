import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { STORAGE_KEYS, getStoredData, setStoredData } from '../utils/storage';
import { useCourses } from './CourseContext';
import { sound } from '../utils/sound';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { isEnrolled } = useCourses();
  const [cartItems, setCartItems] = useState(() => {
    return getStoredData(STORAGE_KEYS.CART, []);
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartToast, setCartToast] = useState(null);

  // Sync with LocalStorage
  useEffect(() => {
    setStoredData(STORAGE_KEYS.CART, cartItems);
  }, [cartItems]);

  // Dismiss toast automatically after 3 seconds
  useEffect(() => {
    if (!cartToast) return;
    const timer = setTimeout(() => {
      setCartToast(null);
    }, 3200);
    return () => clearTimeout(timer);
  }, [cartToast]);

  const showToast = useCallback((message, type = 'success') => {
    setCartToast({ message, type });
  }, []);

  const openCart = useCallback(() => {
    setIsCartOpen(true);
    sound.playClick();
  }, []);

  const closeCart = useCallback(() => {
    setIsCartOpen(false);
  }, []);

  const toggleCart = useCallback(() => {
    setIsCartOpen(prev => !prev);
    sound.playClick();
  }, []);

  const isInCart = useCallback((courseId) => {
    if (!courseId) return false;
    return cartItems.some(item => String(item.id).toLowerCase() === String(courseId).toLowerCase());
  }, [cartItems]);

  const addToCart = useCallback((course) => {
    if (!course || !course.id) {
      return { success: false, message: 'Invalid course details' };
    }

    // Check if already enrolled
    if (isEnrolled(course.id)) {
      showToast('You are already enrolled in this course!', 'info');
      return { success: false, reason: 'enrolled', message: 'Already enrolled' };
    }

    // Check if free course
    if (course.isFree || course.price === 0) {
      showToast('This course is free! Click Enroll Free to start immediately.', 'info');
      return { success: false, reason: 'free', message: 'Free course' };
    }

    // Check if already in cart
    if (cartItems.some(item => item.id === course.id)) {
      showToast('This course is already in your shopping cart.', 'info');
      return { success: false, reason: 'already_in_cart', message: 'Already in cart' };
    }

    const price = Number(course.price ?? 49.99);
    const originalPrice = Number(course.originalPrice ?? (price > 0 ? price * 1.5 : 49.99));

    const itemToAdd = {
      id: course.id,
      title: course.title,
      thumbnail: course.thumbnail,
      category: course.category || 'General',
      instructor: course.instructor?.name || (typeof course.instructor === 'string' ? course.instructor : 'LearnSphere Mentor'),
      price,
      originalPrice,
      duration: course.duration || '6 hours',
      level: course.level || 'All Levels'
    };

    setCartItems(prev => [...prev, itemToAdd]);
    sound.playClick();
    showToast(`"${course.title}" added to your cart!`, 'success');
    return { success: true, message: 'Added to cart' };
  }, [isEnrolled, cartItems, showToast]);

  const removeFromCart = useCallback((courseId) => {
    sound.playClick();
    setCartItems(prev => prev.filter(item => item.id !== courseId));
    showToast('Item removed from cart.', 'info');
  }, [showToast]);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const cartCount = cartItems.length;

  const cartTotal = useMemo(() => {
    return Math.round(cartItems.reduce((acc, item) => acc + (Number(item.price) || 0), 0) * 100) / 100;
  }, [cartItems]);

  const cartOriginalTotal = useMemo(() => {
    return Math.round(cartItems.reduce((acc, item) => acc + (Number(item.originalPrice) || Number(item.price) || 0), 0) * 100) / 100;
  }, [cartItems]);

  const cartSavings = useMemo(() => {
    return Math.max(0, Math.round((cartOriginalTotal - cartTotal) * 100) / 100);
  }, [cartOriginalTotal, cartTotal]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartTotal,
        cartOriginalTotal,
        cartSavings,
        isCartOpen,
        openCart,
        closeCart,
        toggleCart,
        isInCart,
        addToCart,
        removeFromCart,
        clearCart,
        cartToast,
        showToast
      }}
    >
      {children}
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
