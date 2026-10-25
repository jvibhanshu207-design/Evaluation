import React, { useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShoppingBag,
  X,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Tag,
  AlertCircle
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';
import './CartDrawer.css';

export default function CartDrawer() {
  const {
    isCartOpen,
    closeCart,
    cartItems,
    cartCount,
    cartTotal,
    cartOriginalTotal,
    cartSavings,
    removeFromCart,
    clearCart,
    cartToast
  } = useCart();

  const { t } = useLanguage();
  const navigate = useNavigate();
  const drawerRef = useRef(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isCartOpen) {
        closeCart();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCartOpen, closeCart]);

  // Prevent background scroll when drawer is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCartOpen]);

  if (!isCartOpen) {
    return cartToast ? (
      <div className="cart-floating-toast" role="status" aria-live="polite">
        <Sparkles size={16} color="var(--cyan-accent)" />
        <span>{cartToast.message}</span>
      </div>
    ) : null;
  }

  const taxAmount = Math.round(cartTotal * 0.18 * 100) / 100;
  const grandTotal = Math.round((cartTotal + taxAmount) * 100) / 100;

  const handleCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  const handleNavigateToCourse = (courseId) => {
    closeCart();
    navigate(`/courses/${courseId}`);
  };

  return (
    <>
      {/* Toast popup */}
      {cartToast && (
        <div className="cart-floating-toast" role="status" aria-live="polite">
          <Sparkles size={16} color="var(--cyan-accent)" />
          <span>{cartToast.message}</span>
        </div>
      )}

      {/* Backdrop */}
      <div
        className="cart-drawer-backdrop"
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        ref={drawerRef}
        className="cart-drawer-panel glass-panel"
        role="dialog"
        aria-modal="true"
        aria-label={t('shoppingCart', 'Shopping Cart')}
      >
        {/* Header */}
        <div className="cart-drawer-header">
          <div className="cart-drawer-title-wrap">
            <div className="cart-header-icon-box">
              <ShoppingBag size={20} color="var(--cyan-accent)" />
            </div>
            <div>
              <h2 className="cart-drawer-title">
                {t('shoppingCart', 'Shopping Cart')}
              </h2>
              <span className="cart-drawer-subtitle">
                {cartCount} {cartCount === 1 ? 'course' : 'courses'} selected
              </span>
            </div>
          </div>

          <button
            onClick={closeCart}
            className="cart-drawer-close-btn"
            aria-label="Close cart"
          >
            <X size={18} />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="cart-drawer-body">
          {cartItems.length === 0 ? (
            <div className="cart-empty-state">
              <div className="cart-empty-icon-wrap">
                <ShoppingBag size={44} color="var(--primary-purple)" />
              </div>
              <h3 className="cart-empty-title">{t('cartEmpty', 'Your cart is empty')}</h3>
              <p className="cart-empty-desc">
                Explore our catalog of industry-ready tech courses and start accelerating your developer career.
              </p>
              <button
                onClick={() => {
                  closeCart();
                  navigate('/courses');
                }}
                className="gradient-border-btn"
                style={{ padding: '10px 24px', fontSize: '0.92rem' }}
              >
                <span>{t('exploreCourses', 'Explore Courses')}</span>
                <ArrowRight size={16} />
              </button>
            </div>
          ) : (
            <div className="cart-items-list">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item-card glass-panel">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="cart-item-thumb"
                    onClick={() => handleNavigateToCourse(item.id)}
                  />

                  <div className="cart-item-info">
                    <span className="cart-item-category">{item.category}</span>
                    <h4
                      className="cart-item-title"
                      onClick={() => handleNavigateToCourse(item.id)}
                      title={item.title}
                    >
                      {item.title}
                    </h4>
                    <span className="cart-item-instructor">By {item.instructor}</span>

                    <div className="cart-item-price-row">
                      <div className="cart-item-prices">
                        <span className="cart-item-current-price">
                          ${Number(item.price).toFixed(2)}
                        </span>
                        {item.originalPrice && item.originalPrice > item.price && (
                          <span className="cart-item-original-price">
                            ${Number(item.originalPrice).toFixed(2)}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="cart-item-remove-btn"
                        title="Remove from cart"
                        aria-label={`Remove ${item.title} from cart`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        {cartItems.length > 0 && (
          <div className="cart-drawer-footer">
            {/* Price breakdown */}
            <div className="cart-price-breakdown">
              <div className="cart-breakdown-row">
                <span>Subtotal ({cartCount} {cartCount === 1 ? 'item' : 'items'})</span>
                <span className="cart-price-val">${cartTotal.toFixed(2)}</span>
              </div>

              {cartSavings > 0 && (
                <div className="cart-breakdown-row savings">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Tag size={13} color="var(--emerald-accent)" />
                    Total Savings
                  </span>
                  <span className="cart-savings-val">-${cartSavings.toFixed(2)}</span>
                </div>
              )}

              <div className="cart-breakdown-row">
                <span>Estimated Tax (18% GST)</span>
                <span className="cart-price-val">${taxAmount.toFixed(2)}</span>
              </div>

              <div className="cart-breakdown-divider" />

              <div className="cart-breakdown-row total">
                <span>{t('totalPayable', 'Total Payable')}</span>
                <span className="cart-grand-total">${grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="cart-drawer-actions">
              <button
                onClick={handleCheckout}
                className="gradient-border-btn cart-checkout-btn"
              >
                <span>{t('proceedToCheckout', 'Proceed to Checkout')}</span>
                <ArrowRight size={16} />
              </button>

              <div className="cart-secondary-actions">
                <button
                  onClick={closeCart}
                  className="cart-continue-btn"
                >
                  Continue Shopping
                </button>
                <button
                  onClick={clearCart}
                  className="cart-clear-btn"
                  title="Remove all courses from cart"
                >
                  Clear Cart
                </button>
              </div>

              <div className="cart-secure-badge">
                <ShieldCheck size={14} color="var(--emerald-accent)" />
                <span>256-Bit SSL Encrypted &amp; Instant Course Enrollment</span>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
