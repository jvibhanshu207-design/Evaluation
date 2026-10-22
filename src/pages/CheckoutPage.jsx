import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  User,
  Mail,
  ArrowRight,
  ArrowLeft,
  Lock,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  BookOpen,
  ShoppingBag
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function CheckoutPage() {
  const { cartItems, originalSubtotal, savings, total, createPendingOrder } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Student form state prefilled with demo user info if present
  const [formData, setFormData] = useState({
    name: user?.name || 'Vibhanshu Jain',
    email: user?.email || 'vibhanshu@learnsphere.edu',
    studentId: user?.studentId || 'STU-2026-8849',
    agreeTerms: true
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validate form
  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      newErrors.name = 'Please provide your full student name (min 2 characters).';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please provide a valid email address for certificate delivery.';
    }

    if (!formData.agreeTerms) {
      newErrors.terms = 'Please accept the demo student guidelines to proceed.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    const order = createPendingOrder({
      name: formData.name,
      email: formData.email
    });

    if (order) {
      navigate('/payment');
    } else {
      setIsSubmitting(false);
    }
  };

  const handleUseDemoDetails = () => {
    setFormData({
      name: 'Vibhanshu Jain',
      email: 'vibhanshu@learnsphere.edu',
      studentId: 'STU-2026-8849',
      agreeTerms: true
    });
    setErrors({});
  };

  // If cart is empty, display gentle redirect
  if (cartItems.length === 0) {
    return (
      <div
        className="glass-panel"
        style={{
          padding: '60px 24px',
          textAlign: 'center',
          maxWidth: '600px',
          margin: '40px auto'
        }}
      >
        <ShoppingBag size={48} color="var(--cyan-accent)" style={{ marginBottom: '16px' }} />
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', marginBottom: '12px' }}>
          No Items in Checkout
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
          Your shopping cart is currently empty. Please select a course before continuing to checkout.
        </p>
        <Link to="/courses" className="gradient-border-btn" style={{ padding: '12px 24px' }}>
          <BookOpen size={16} />
          <span>Browse Course Marketplace</span>
        </Link>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Checkout Breadcrumb / Header */}
      <div
        className="glass-panel"
        style={{
          padding: '24px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <Lock size={16} color="var(--electric-violet)" />
            <span
              style={{
                fontSize: '0.8rem',
                fontWeight: 700,
                color: 'var(--electric-violet)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em'
              }}
            >
              Step 1 of 2 • Student Verification
            </span>
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '2rem',
              fontWeight: 800,
              color: 'var(--text-primary)',
              margin: 0
            }}
          >
            Academic <span className="gradient-text">Checkout</span>
          </h1>
        </div>

        <Link to="/cart" className="glass-btn" style={{ padding: '8px 16px', fontSize: '0.86rem' }}>
          <ArrowLeft size={15} />
          <span>Return to Cart</span>
        </Link>
      </div>

      {/* Checkout 2-Column Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.6fr) minmax(320px, 1fr)',
          gap: '28px',
          alignItems: 'start'
        }}
      >
        {/* Left Column: Student Details Form & Item Breakdown */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Student Info Card */}
          <div className="glass-panel" style={{ padding: '28px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
                marginBottom: '20px',
                borderBottom: '1px solid var(--border-subtle)',
                paddingBottom: '14px'
              }}
            >
              <h2
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  color: 'var(--text-primary)',
                  margin: 0
                }}
              >
                1. Student Profile & Credentials
              </h2>

              <button
                type="button"
                onClick={handleUseDemoDetails}
                style={{
                  padding: '5px 12px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'rgba(34, 211, 238, 0.1)',
                  border: '1px solid rgba(34, 211, 238, 0.3)',
                  color: 'var(--cyan-accent)',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Sparkles size={13} />
                <span>Fill Demo Profile</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Full Name */}
              <div>
                <label
                  htmlFor="checkout-name"
                  style={{
                    display: 'block',
                    fontSize: '0.86rem',
                    fontWeight: 600,
                    color: 'var(--text-secondary)',
                    marginBottom: '8px'
                  }}
                >
                  Student Full Name <span style={{ color: 'var(--rose-accent)' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <User
                    size={17}
                    style={{
                      position: 'absolute',
                      left: '14px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--text-muted)'
                    }}
                  />
                  <input
                    id="checkout-name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter student legal name (appears on certificate)"
                    style={{
                      width: '100%',
                      padding: '12px 14px 12px 42px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'rgba(255, 255, 255, 0.04)',
                      border: `1px solid ${errors.name ? 'var(--rose-accent)' : 'var(--card-border)'}`,
                      color: 'var(--text-primary)',
                      fontSize: '0.94rem'
                    }}
                  />
                </div>
                {errors.name && (
                  <div style={{ color: 'var(--rose-accent)', fontSize: '0.8rem', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <AlertCircle size={14} />
                    <span>{errors.name}</span>
                  </div>
                )}
              </div>

              {/* Email Address */}
              <div>
                <label
                  htmlFor="checkout-email"
                  style={{
                    display: 'block',
                    fontSize: '0.86rem',
                    fontWeight: 600,
                    color: 'var(--text-secondary)',
                    marginBottom: '8px'
                  }}
                >
                  Student Email Address <span style={{ color: 'var(--rose-accent)' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail
                    size={17}
                    style={{
                      position: 'absolute',
                      left: '14px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--text-muted)'
                    }}
                  />
                  <input
                    id="checkout-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="student@university.edu"
                    style={{
                      width: '100%',
                      padding: '12px 14px 12px 42px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'rgba(255, 255, 255, 0.04)',
                      border: `1px solid ${errors.email ? 'var(--rose-accent)' : 'var(--card-border)'}`,
                      color: 'var(--text-primary)',
                      fontSize: '0.94rem'
                    }}
                  />
                </div>
                {errors.email && (
                  <div style={{ color: 'var(--rose-accent)', fontSize: '0.8rem', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <AlertCircle size={14} />
                    <span>{errors.email}</span>
                  </div>
                )}
              </div>

              {/* Demo Mode Notice */}
              <div
                style={{
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'rgba(139, 92, 246, 0.08)',
                  border: '1px solid rgba(167, 139, 250, 0.25)',
                  fontSize: '0.84rem',
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px'
                }}
              >
                <Sparkles size={17} color="var(--electric-violet)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>
                  <strong>Frontend Demo Simulation:</strong> This information is stored locally in your browser to personalize your demo completion certificates and learning records.
                </span>
              </div>

              {/* Terms Checkbox */}
              <div>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '0.86rem',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={formData.agreeTerms}
                    onChange={(e) => handleInputChange('agreeTerms', e.target.checked)}
                    style={{ width: '16px', height: '16px', accentColor: 'var(--primary-purple)' }}
                  />
                  <span>I agree to the LearnSphere student terms and demo simulation guidelines.</span>
                </label>
                {errors.terms && (
                  <div style={{ color: 'var(--rose-accent)', fontSize: '0.8rem', marginTop: '6px' }}>
                    {errors.terms}
                  </div>
                )}
              </div>
            </form>
          </div>

          {/* Selected Courses Review Card */}
          <div className="glass-panel" style={{ padding: '28px' }}>
            <h2
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.25rem',
                fontWeight: 800,
                color: 'var(--text-primary)',
                marginBottom: '16px'
              }}
            >
              2. Selected Curriculum ({cartItems.length} {cartItems.length === 1 ? 'Course' : 'Courses'})
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    style={{
                      width: '74px',
                      height: '50px',
                      borderRadius: 'var(--radius-sm)',
                      objectFit: 'cover'
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--electric-violet)', textTransform: 'uppercase' }}>
                      {item.category}
                    </div>
                    <div style={{ fontSize: '0.94rem', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.title}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                      Instructor: {item.instructor?.name}
                    </div>
                  </div>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    ${Number(item.price || 49.99).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & Continue Button */}
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
              fontSize: '1.25rem',
              fontWeight: 800,
              color: 'var(--text-primary)',
              borderBottom: '1px solid var(--border-subtle)',
              paddingBottom: '14px',
              margin: 0
            }}
          >
            Order Breakdown
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.92rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>Catalog Subtotal</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>${originalSubtotal.toFixed(2)}</span>
            </div>

            {savings > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--emerald-accent)' }}>
                <span>Scholarship & Bundle Discount</span>
                <span style={{ fontWeight: 700 }}>-${savings.toFixed(2)}</span>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>Platform Service Fee</span>
              <span style={{ color: 'var(--emerald-accent)', fontWeight: 600 }}>$0.00 (Waived)</span>
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
                  Total Payable
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                  Due at simulated QR payment
                </div>
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.9rem',
                  fontWeight: 900,
                  color: 'var(--cyan-accent)'
                }}
              >
                ${total.toFixed(2)}
              </div>
            </div>
          </div>

          {/* Continue to Payment Button */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="gradient-border-btn"
            style={{
              width: '100%',
              justifyContent: 'center',
              padding: '14px 20px',
              fontSize: '1.02rem',
              fontWeight: 700
            }}
          >
            <span>Continue to Payment</span>
            <ArrowRight size={18} />
          </button>

          {/* Back link */}
          <Link
            to="/cart"
            className="glass-btn"
            style={{ width: '100%', justifyContent: 'center', padding: '10px', fontSize: '0.86rem' }}
          >
            <ArrowLeft size={15} />
            <span>Modify Cart Items</span>
          </Link>

          {/* Guarantee Badges */}
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
              <ShieldCheck size={15} color="var(--emerald-accent)" />
              <span>Full course credentials & lifetime license</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={15} color="var(--cyan-accent)" />
              <span>Zero real charges (100% Demo Simulation)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
