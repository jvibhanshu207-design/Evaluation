import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Trash2,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Tag,
  CheckCircle2,
  Clock,
  BookOpen
} from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartPage() {
  const { cartItems, removeFromCart, clearCart, originalSubtotal, savings, total } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Page Header */}
      <div
        className="glass-panel"
        style={{
          padding: '28px 32px',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <ShoppingBag size={18} color="var(--cyan-accent)" />
            <span
              style={{
                fontSize: '0.82rem',
                fontWeight: 700,
                color: 'var(--cyan-accent)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em'
              }}
            >
              Order Workspace
            </span>
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '2.2rem',
              fontWeight: 800,
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
              margin: 0
            }}
          >
            Shopping <span className="gradient-text">Cart</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem', marginTop: '4px' }}>
            {cartItems.length} {cartItems.length === 1 ? 'course' : 'courses'} selected for lifetime academic access
          </p>
        </div>

        {cartItems.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              type="button"
              onClick={clearCart}
              className="glass-btn"
              style={{
                padding: '8px 16px',
                fontSize: '0.84rem',
                color: 'var(--text-muted)'
              }}
            >
              <Trash2 size={15} />
              <span>Clear Cart</span>
            </button>
            <Link to="/courses" className="glass-btn" style={{ padding: '8px 18px', fontSize: '0.84rem' }}>
              <ArrowLeft size={15} />
              <span>Continue Shopping</span>
            </Link>
          </div>
        )}
      </div>

      {/* Main Cart Content */}
      {cartItems.length === 0 ? (
        /* Empty State */
        <div
          className="glass-panel"
          style={{
            padding: '70px 24px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            maxWidth: '680px',
            margin: '0 auto',
            width: '100%'
          }}
        >
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: 'rgba(139, 92, 246, 0.12)',
              border: '1px solid rgba(167, 139, 250, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--electric-violet)',
              marginBottom: '20px',
              boxShadow: '0 0 30px rgba(139, 92, 246, 0.2)'
            }}
          >
            <ShoppingBag size={38} />
          </div>

          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.8rem',
              fontWeight: 800,
              color: 'var(--text-primary)',
              marginBottom: '10px'
            }}
          >
            Your Shopping Cart is Empty
          </h2>

          <p
            style={{
              color: 'var(--text-secondary)',
              fontSize: '0.98rem',
              lineHeight: '1.6',
              maxWidth: '460px',
              marginBottom: '28px'
            }}
          >
            Explore our curated catalog of masterclasses, interactive coding curricula, and credentialed educational paths to begin learning.
          </p>

          <Link
            to="/courses"
            className="gradient-border-btn"
            style={{ padding: '13px 28px', fontSize: '0.98rem' }}
          >
            <BookOpen size={18} />
            <span>Browse Courses Catalog</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      ) : (
        /* Cart Grid Layout: Items Left, Summary Right */
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.8fr) minmax(320px, 1fr)',
            gap: '28px',
            alignItems: 'start'
          }}
          className="cart-grid-container"
        >
          {/* Cart Items List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {cartItems.map((item) => {
              const itemPrice = Number(item.price || 49.99);
              const itemOriginal = Number(item.originalPrice || 89.99);
              const itemDiscount = Math.max(0, Math.round(((itemOriginal - itemPrice) / itemOriginal) * 100));

              return (
                <div
                  key={item.id}
                  className="glass-panel"
                  style={{
                    padding: '18px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '18px',
                    flexWrap: 'wrap'
                  }}
                >
                  {/* Thumbnail */}
                  <Link
                    to={`/courses/${item.id}`}
                    style={{
                      width: '120px',
                      height: '76px',
                      borderRadius: 'var(--radius-md)',
                      overflow: 'hidden',
                      flexShrink: 0,
                      position: 'relative'
                    }}
                  >
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </Link>

                  {/* Course Details */}
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <div
                      style={{
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        color: 'var(--electric-violet)',
                        letterSpacing: '0.06em',
                        marginBottom: '4px'
                      }}
                    >
                      {item.category} • Digital Course
                    </div>

                    <Link to={`/courses/${item.id}`}>
                      <h3
                        style={{
                          fontSize: '1.05rem',
                          fontWeight: 700,
                          color: 'var(--text-primary)',
                          lineHeight: '1.35',
                          marginBottom: '6px'
                        }}
                      >
                        {item.title}
                      </h3>
                    </Link>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        fontSize: '0.8rem',
                        color: 'var(--text-secondary)'
                      }}
                    >
                      <span>By {item.instructor?.name}</span>
                      <span>•</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={13} />
                        {item.duration}
                      </span>
                    </div>
                  </div>

                  {/* Price & Remove */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-end',
                      gap: '8px',
                      marginLeft: 'auto'
                    }}
                  >
                    <div style={{ textAlign: 'right' }}>
                      <div
                        style={{
                          fontFamily: 'var(--font-heading)',
                          fontSize: '1.35rem',
                          fontWeight: 800,
                          color: 'var(--text-primary)'
                        }}
                      >
                        ${itemPrice.toFixed(2)}
                      </div>
                      {itemOriginal > itemPrice && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end' }}>
                          <span
                            style={{
                              fontSize: '0.82rem',
                              color: 'var(--text-muted)',
                              textDecoration: 'line-through'
                            }}
                          >
                            ${itemOriginal.toFixed(2)}
                          </span>
                          {itemDiscount > 0 && (
                            <span
                              style={{
                                fontSize: '0.68rem',
                                fontWeight: 700,
                                color: 'var(--emerald-accent)',
                                backgroundColor: 'rgba(52, 211, 153, 0.12)',
                                padding: '1px 6px',
                                borderRadius: '9999px'
                              }}
                            >
                              -{itemDiscount}%
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        fontSize: '0.82rem',
                        color: 'var(--rose-accent, #FB7185)',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '4px 6px',
                        borderRadius: '4px',
                        transition: 'background-color 0.2s ease'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(251, 113, 133, 0.12)')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                      aria-label={`Remove ${item.title} from cart`}
                    >
                      <Trash2 size={14} />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Reassurance Banner */}
            <div
              className="glass-panel"
              style={{
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                backgroundColor: 'rgba(34, 211, 238, 0.05)',
                border: '1px solid rgba(34, 211, 238, 0.2)'
              }}
            >
              <ShieldCheck size={22} color="var(--cyan-accent)" style={{ flexShrink: 0 }} />
              <div style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: '1.45' }}>
                <strong style={{ color: 'var(--text-primary)' }}>Digital Lifetime Access Guarantee:</strong> All courses include immediate classroom access, downloadable study resources, and verifiable completion credentials upon finish.
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary Card */}
          <div
            className="glass-panel"
            style={{
              padding: '28px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              position: 'sticky',
              top: '90px'
            }}
          >
            <h2
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.3rem',
                fontWeight: 800,
                color: 'var(--text-primary)',
                borderBottom: '1px solid var(--border-subtle)',
                paddingBottom: '14px',
                margin: 0
              }}
            >
              Order Summary
            </h2>

            {/* Calculations List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.92rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Courses Subtotal ({cartItems.length} items)</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>${originalSubtotal.toFixed(2)}</span>
              </div>

              {savings > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--emerald-accent)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Tag size={14} />
                    Scholarship & Bundle Discount
                  </span>
                  <span style={{ fontWeight: 700 }}>-${savings.toFixed(2)}</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Digital Delivery & Tax</span>
                <span style={{ color: 'var(--emerald-accent)', fontWeight: 600 }}>FREE ($0.00)</span>
              </div>

              <div
                style={{
                  borderTop: '1px dashed var(--card-border)',
                  paddingTop: '16px',
                  marginTop: '4px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline'
                }}
              >
                <div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    Total Amount
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                    Demo checkout transaction
                  </div>
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.85rem',
                    fontWeight: 900,
                    color: 'var(--cyan-accent)'
                  }}
                >
                  ${total.toFixed(2)}
                </div>
              </div>
            </div>

            {/* Checkout Action Button */}
            <button
              type="button"
              onClick={handleCheckout}
              className="gradient-border-btn"
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: '14px 20px',
                fontSize: '1.02rem',
                fontWeight: 700
              }}
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={18} />
            </button>

            {/* Continue Shopping button */}
            <Link
              to="/courses"
              className="glass-btn"
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: '11px',
                fontSize: '0.88rem'
              }}
            >
              <ArrowLeft size={16} />
              <span>Continue Shopping</span>
            </Link>

            {/* Perks list */}
            <div
              style={{
                borderTop: '1px solid var(--border-subtle)',
                paddingTop: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                fontSize: '0.8rem',
                color: 'var(--text-muted)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={15} color="var(--emerald-accent)" />
                <span>Instant demo QR code simulation</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={15} color="var(--emerald-accent)" />
                <span>Verifiable Certificate of Completion</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={15} color="var(--emerald-accent)" />
                <span>24/7 Cognitive AI Tutor assistance included</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
