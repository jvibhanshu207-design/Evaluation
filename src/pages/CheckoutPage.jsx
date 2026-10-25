import React, { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  CreditCard,
  QrCode,
  Building2,
  Wallet,
  ShieldCheck,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Sparkles,
  Lock,
  Tag,
  RotateCcw,
  Receipt,
  FileCheck2,
  Trash2,
  ShoppingBag
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCourses } from '../context/CourseContext';
import { usePayment } from '../context/PaymentContext';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { sound } from '../utils/sound';
import './CheckoutPage.css';

const NET_BANKING_BANKS = [
  { id: 'hdfc', name: 'HDFC Bank', popular: true },
  { id: 'sbi', name: 'State Bank of India (SBI)', popular: true },
  { id: 'icici', name: 'ICICI Bank', popular: true },
  { id: 'axis', name: 'Axis Bank', popular: true },
  { id: 'pnb', name: 'Punjab National Bank', popular: false },
  { id: 'kotak', name: 'Kotak Mahindra Bank', popular: false }
];

const WALLETS = [
  { id: 'paytm', name: 'Paytm Wallet', icon: '💳' },
  { id: 'phonepe', name: 'PhonePe Wallet', icon: '📱' },
  { id: 'amazon', name: 'Amazon Pay Balance', icon: '📦' },
  { id: 'mobikwik', name: 'MobiKwik', icon: '⚡' }
];

export default function CheckoutPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { courses, isEnrolled } = useCourses();
  const { processPayment, recordCancellation, isProcessing } = usePayment();
  const { cartItems, removeFromCart, clearCart } = useCart();
  const { t } = useLanguage();

  const isCartCheckout = !courseId;

  const singleCourse = useMemo(() => {
    if (!courseId) return null;
    return courses.find((c) => c.id === courseId) || null;
  }, [courses, courseId]);

  // Active items being checked out
  const activeItems = useMemo(() => {
    if (isCartCheckout) {
      return cartItems;
    }
    return singleCourse ? [singleCourse] : [];
  }, [isCartCheckout, cartItems, singleCourse]);

  const alreadyEnrolledSingle = singleCourse ? isEnrolled(singleCourse.id) : false;

  // Checkout form states
  const [selectedMethod, setSelectedMethod] = useState('UPI'); // UPI | Card | NetBanking | Wallet

  // Form inputs
  const [upiId, setUpiId] = useState('vibhanshu@okaxis');
  const [cardNumber, setCardNumber] = useState('4532 8920 1029 4242');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('321');
  const [cardHolder, setCardHolder] = useState('Vibhanshu Jain');
  const [selectedBank, setSelectedBank] = useState('hdfc');
  const [selectedWallet, setSelectedWallet] = useState('paytm');

  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0); // in dollars
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  // Simulation outcome toggle ('success' | 'failure')
  const [simulateOutcome, setSimulateOutcome] = useState('success');

  // Transaction result state: null | { success: boolean, receipt: Object, error?: string }
  const [transactionResult, setTransactionResult] = useState(null);

  // Pricing calculations
  const originalPrice = useMemo(() => {
    return activeItems.reduce((acc, c) => acc + (Number(c.originalPrice || c.price) || 49.99), 0);
  }, [activeItems]);

  const coursePrice = useMemo(() => {
    return activeItems.reduce((acc, c) => acc + (Number(c.price) || 49.99), 0);
  }, [activeItems]);

  const platformDiscount = Math.max(0, originalPrice - coursePrice);
  const subtotal = Math.max(0, coursePrice - appliedDiscount);
  const taxAmount = Math.round(subtotal * 0.18 * 100) / 100; // 18% GST / Tax
  const finalPayable = Math.max(0, Math.round((subtotal + taxAmount) * 100) / 100);

  // Apply Coupon
  const handleApplyCoupon = (e) => {
    e.preventDefault();
    sound.playClick();
    const clean = couponCode.trim().toUpperCase();
    if (clean === 'LEARN20' || clean === 'STUDENT20') {
      const discountVal = 10.0;
      setAppliedDiscount(discountVal);
      setCouponSuccess('Coupon applied: $10.00 Student Discount unlocked!');
      setCouponError('');
    } else if (clean === 'FREESHIP' || clean === 'HALF') {
      const discountVal = Math.round(coursePrice * 0.5 * 100) / 100;
      setAppliedDiscount(discountVal);
      setCouponSuccess('Super Scholar 50% discount applied!');
      setCouponError('');
    } else {
      setCouponError('Invalid coupon. Try "LEARN20" for $10 off!');
      setCouponSuccess('');
    }
  };

  // Quick fill test card
  const handleQuickFillCard = (type) => {
    sound.playClick();
    if (type === 'pass') {
      setCardNumber('4532 8920 1029 4242');
      setCardExpiry('12/28');
      setCardCvv('789');
      setCardHolder('Vibhanshu Jain (Verified Demo)');
      setSimulateOutcome('success');
    } else {
      setCardNumber('4000 0000 0000 0002');
      setCardExpiry('01/25');
      setCardCvv('000');
      setCardHolder('Declined Cardholder');
      setSimulateOutcome('failure');
    }
  };

  // Submit payment
  const handlePayNow = async () => {
    if (activeItems.length === 0) return;

    let methodLabel = 'UPI / VPA';
    if (selectedMethod === 'UPI') {
      if (!upiId.trim() || !upiId.includes('@')) {
        alert('Please enter a valid demo UPI ID (e.g. user@bank)');
        return;
      }
      methodLabel = `UPI (${upiId.trim()})`;
    } else if (selectedMethod === 'Card') {
      if (cardNumber.replace(/\s/g, '').length < 12) {
        alert('Please enter a 16-digit demo card number');
        return;
      }
      methodLabel = `Card (ending in •••• ${cardNumber.slice(-4)})`;
    } else if (selectedMethod === 'NetBanking') {
      const bankObj = NET_BANKING_BANKS.find((b) => b.id === selectedBank);
      methodLabel = `Net Banking (${bankObj?.name || 'Selected Bank'})`;
    } else if (selectedMethod === 'Wallet') {
      const walletObj = WALLETS.find((w) => w.id === selectedWallet);
      methodLabel = `Digital Wallet (${walletObj?.name || 'Selected Wallet'})`;
    }

    const res = await processPayment({
      course: singleCourse,
      items: activeItems,
      method: selectedMethod,
      methodLabel,
      finalAmount: finalPayable,
      simulateOutcome
    });

    setTransactionResult(res);

    if (res.success) {
      if (isCartCheckout) {
        clearCart();
      }
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.55 }
        });
      } catch {
        // Safe fallback
      }
    }
  };

  // Handle Cancel
  const handleCancel = () => {
    sound.playClick();
    if (window.confirm('Are you sure you want to cancel this checkout session?')) {
      if (singleCourse) {
        recordCancellation({
          course: singleCourse,
          method: selectedMethod,
          finalAmount: finalPayable
        });
        navigate(`/courses/${courseId}`);
      } else {
        navigate('/courses');
      }
    }
  };

  // If cart checkout and cart is empty (and not viewing receipt)
  if (isCartCheckout && activeItems.length === 0 && !transactionResult) {
    return (
      <div className="checkout-container" style={{ textAlign: 'center', padding: '60px 20px' }}>
        <div className="glass-panel" style={{ maxWidth: '500px', margin: '0 auto', padding: '40px' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(139, 92, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
            <ShoppingBag size={32} color="var(--primary-purple)" />
          </div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>Your Shopping Cart is Empty</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
            Please add courses to your cart before proceeding to checkout.
          </p>
          <Link to="/courses" className="gradient-border-btn" style={{ display: 'inline-flex', padding: '10px 24px' }}>
            <ArrowLeft size={16} />
            <span>Browse All Courses</span>
          </Link>
        </div>
      </div>
    );
  }

  // If single course checkout and not found
  if (!isCartCheckout && !singleCourse) {
    return (
      <div className="checkout-container" style={{ textAlign: 'center', padding: '60px 20px' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>Course Not Found</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
          The requested course ID could not be loaded for checkout.
        </p>
        <Link to="/courses" className="gradient-border-btn" style={{ display: 'inline-flex', padding: '10px 20px' }}>
          <ArrowLeft size={16} />
          <span>Browse Available Courses</span>
        </Link>
      </div>
    );
  }

  // If already enrolled in single course, show message
  if (!isCartCheckout && alreadyEnrolledSingle && !transactionResult) {
    return (
      <div className="checkout-container">
        <div className="glass-panel" style={{ maxWidth: '600px', margin: '40px auto', padding: '36px', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', padding: '16px', borderRadius: '50%', backgroundColor: 'rgba(52, 211, 153, 0.15)', color: 'var(--emerald-accent)', marginBottom: '16px' }}>
            <CheckCircle2 size={40} />
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '8px' }}>
            You're Already Enrolled!
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '24px' }}>
            You already have full, lifetime access to <strong>{singleCourse.title}</strong>. No additional payment is required.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to={`/learn/${singleCourse.id}`} className="gradient-border-btn" style={{ padding: '11px 24px' }}>
              <span>Go to Classroom</span>
              <ArrowRight size={16} />
            </Link>
            <Link to="/my-learning" className="glass-btn" style={{ padding: '11px 20px' }}>
              <span>My Learning</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      {/* Header Bar */}
      <div className="checkout-top-header">
        <button type="button" onClick={handleCancel} className="glass-btn" style={{ padding: '8px 14px', fontSize: '0.84rem' }}>
          <ArrowLeft size={16} />
          <span>{isCartCheckout ? 'Back to Courses' : 'Back to Course'}</span>
        </button>

        <div className="checkout-title-wrap">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={18} color="var(--cyan-accent)" />
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--cyan-accent)', textTransform: 'uppercase' }}>
              Simulated Demonstration Checkout
            </span>
          </div>
          <h1 className="checkout-page-title">
            {isCartCheckout ? 'Cart Checkout & Course Enrollment' : t('checkoutTitle', 'Course Checkout & Enrollment')}
          </h1>
        </div>
      </div>

      {/* Demo Disclaimer Alert */}
      <div className="checkout-disclaimer-banner">
        <AlertCircle size={18} color="#FBBF24" style={{ flexShrink: 0 }} />
        <span>
          <strong>Demo Notice:</strong> This is an educational demonstration payment gateway. No real money or credit card information is required or processed. All transactions are simulated locally.
        </span>
      </div>

      {/* Transaction Result View (Success Receipt / Failure Screen) */}
      {transactionResult ? (
        <div className="glass-panel checkout-receipt-card animate-modal-pop">
          {transactionResult.success ? (
            <div>
              <div className="receipt-status-icon success">
                <CheckCircle2 size={48} />
              </div>

              <h2 className="receipt-title success">
                🎉 Enrollment Successful!
              </h2>
              <p className="receipt-subtitle">
                Your simulated payment was authorized and your enrollment is active.
              </p>

              <div className="receipt-table">
                <div className="receipt-row">
                  <span className="receipt-label">{t('transactionId', 'Transaction ID')}</span>
                  <span className="receipt-val font-mono">{transactionResult.receipt.id}</span>
                </div>
                <div className="receipt-row">
                  <span className="receipt-label">{t('courses', 'Course(s)')}</span>
                  <span className="receipt-val">{transactionResult.receipt.courseTitle}</span>
                </div>
                <div className="receipt-row">
                  <span className="receipt-label">{t('paymentMethod', 'Payment Method')}</span>
                  <span className="receipt-val">{transactionResult.receipt.paymentMethodLabel}</span>
                </div>
                <div className="receipt-row">
                  <span className="receipt-label">{t('timestamp', 'Date & Time')}</span>
                  <span className="receipt-val">{new Date(transactionResult.receipt.timestamp).toLocaleString()}</span>
                </div>
                <div className="receipt-row">
                  <span className="receipt-label">{t('amountPaid', 'Amount Paid')}</span>
                  <span className="receipt-val highlight">${transactionResult.receipt.amount.toFixed(2)} USD</span>
                </div>
                <div className="receipt-row">
                  <span className="receipt-label">{t('status', 'Status')}</span>
                  <span className="receipt-badge success">
                    ✓ {t('completed', 'Completed')}
                  </span>
                </div>
              </div>

              {/* Enrolled Courses Quick Launch */}
              {transactionResult.enrolledCourses && transactionResult.enrolledCourses.length > 0 && (
                <div style={{ marginTop: '20px', textAlign: 'left' }}>
                  <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>
                    Enrolled Courses Ready to Learn:
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {transactionResult.enrolledCourses.map((c) => (
                      <div key={c.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.04)', border: '1px solid var(--border-subtle)' }}>
                        <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{c.title}</span>
                        <Link to={`/learn/${c.id}`} className="gradient-border-btn" style={{ padding: '6px 14px', fontSize: '0.8rem' }}>
                          <span>Start Learning</span>
                          <ArrowRight size={13} />
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="receipt-actions" style={{ marginTop: '24px' }}>
                <Link to="/my-learning" className="gradient-border-btn" style={{ padding: '12px 28px', fontSize: '1rem' }}>
                  <FileCheck2 size={16} />
                  <span>Go to My Learning</span>
                  <ArrowRight size={17} />
                </Link>
                <Link to="/profile" className="glass-btn" style={{ padding: '12px 20px' }}>
                  <Receipt size={16} />
                  <span>View All Receipts</span>
                </Link>
              </div>
            </div>
          ) : (
            <div>
              <div className="receipt-status-icon failure">
                <XCircle size={48} />
              </div>

              <h2 className="receipt-title failure">
                Payment Declined
              </h2>
              <p className="receipt-subtitle">
                {transactionResult.error || 'The simulated bank gateway declined the transaction authorization.'}
              </p>

              <div className="receipt-table">
                <div className="receipt-row">
                  <span className="receipt-label">{t('transactionId', 'Attempt ID')}</span>
                  <span className="receipt-val font-mono">{transactionResult.receipt.id}</span>
                </div>
                <div className="receipt-row">
                  <span className="receipt-label">{t('paymentMethod', 'Method Attempted')}</span>
                  <span className="receipt-val">{transactionResult.receipt.paymentMethodLabel}</span>
                </div>
                <div className="receipt-row">
                  <span className="receipt-label">{t('status', 'Status')}</span>
                  <span className="receipt-badge failure">
                    ✗ {t('failed', 'Failed')}
                  </span>
                </div>
              </div>

              <div className="receipt-actions">
                <button
                  type="button"
                  onClick={() => {
                    setTransactionResult(null);
                    setSimulateOutcome('success'); // Switch to success so next attempt passes
                  }}
                  className="gradient-border-btn"
                  style={{ padding: '12px 28px' }}
                >
                  <RotateCcw size={16} />
                  <span>{t('retryPayment', 'Retry Payment')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTransactionResult(null)}
                  className="glass-btn"
                  style={{ padding: '12px 20px' }}
                >
                  <span>{t('chooseAnotherMethod', 'Choose Another Method')}</span>
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="glass-btn danger"
                  style={{ padding: '12px 20px' }}
                >
                  <span>{t('cancel', 'Cancel Checkout')}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Main Checkout 2-Column Interface */
        <div className="checkout-grid">
          {/* LEFT COLUMN: Payment Methods & Demo Forms */}
          <div className="checkout-main-col">
            {/* Demo Testing Mode Bar */}
            <div className="glass-panel checkout-test-controls">
              <div className="test-controls-left">
                <Sparkles size={16} color="var(--cyan-accent)" />
                <span className="test-controls-title">Demonstration Testing Controller:</span>
              </div>
              <div className="test-controls-buttons">
                <button
                  type="button"
                  onClick={() => setSimulateOutcome('success')}
                  className={`test-outcome-pill ${simulateOutcome === 'success' ? 'active-success' : ''}`}
                >
                  ✓ Simulate Success
                </button>
                <button
                  type="button"
                  onClick={() => setSimulateOutcome('failure')}
                  className={`test-outcome-pill ${simulateOutcome === 'failure' ? 'active-failure' : ''}`}
                >
                  ✗ Simulate Failure
                </button>
              </div>
            </div>

            {/* Payment Method Selector Tabs */}
            <div className="glass-panel checkout-methods-card">
              <h3 className="checkout-section-heading">
                {t('selectPaymentMethod', 'Select Payment Method')}
              </h3>

              <div className="methods-tabs-grid">
                <button
                  type="button"
                  onClick={() => setSelectedMethod('UPI')}
                  className={`method-tab-btn ${selectedMethod === 'UPI' ? 'active' : ''}`}
                >
                  <QrCode size={20} />
                  <span>UPI / QR</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMethod('Card')}
                  className={`method-tab-btn ${selectedMethod === 'Card' ? 'active' : ''}`}
                >
                  <CreditCard size={20} />
                  <span>Credit / Debit Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMethod('NetBanking')}
                  className={`method-tab-btn ${selectedMethod === 'NetBanking' ? 'active' : ''}`}
                >
                  <Building2 size={20} />
                  <span>Net Banking</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMethod('Wallet')}
                  className={`method-tab-btn ${selectedMethod === 'Wallet' ? 'active' : ''}`}
                >
                  <Wallet size={20} />
                  <span>Wallets</span>
                </button>
              </div>

              {/* METHOD 1: UPI Form */}
              {selectedMethod === 'UPI' && (
                <div className="method-details-pane animate-modal-pop">
                  <div className="upi-content-layout">
                    <div className="upi-qr-box">
                      <div className="upi-dummy-qr">
                        <QrCode size={110} color="#22D3EE" />
                        <span className="upi-qr-caption">Scan with GPay / PhonePe / Paytm</span>
                      </div>
                    </div>

                    <div className="upi-inputs-col">
                      <label className="checkout-form-label">Or enter Virtual Payment Address (VPA / UPI ID)</label>
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="username@bank"
                        className="checkout-text-input"
                      />
                      <div className="upi-quick-pills">
                        <button type="button" onClick={() => setUpiId('vibhanshu@okaxis')} className="quick-pill">@okaxis</button>
                        <button type="button" onClick={() => setUpiId('scholar@okhdfcbank')} className="quick-pill">@okhdfcbank</button>
                        <button type="button" onClick={() => setUpiId('student@paytm')} className="quick-pill">@paytm</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* METHOD 2: Card Form */}
              {selectedMethod === 'Card' && (
                <div className="method-details-pane animate-modal-pop">
                  <div className="card-quick-fill-bar">
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Quick Fill Test Cards:</span>
                    <button type="button" onClick={() => handleQuickFillCard('pass')} className="quick-card-btn pass">
                      Use Passing Test Card
                    </button>
                    <button type="button" onClick={() => handleQuickFillCard('fail')} className="quick-card-btn fail">
                      Use Declining Test Card
                    </button>
                  </div>

                  <div className="card-form-grid">
                    <div className="card-form-col-full">
                      <label className="checkout-form-label">Card Number (Demo)</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        maxLength={19}
                        className="checkout-text-input font-mono"
                      />
                    </div>

                    <div className="card-form-col-full">
                      <label className="checkout-form-label">Cardholder Name</label>
                      <input
                        type="text"
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value)}
                        className="checkout-text-input"
                      />
                    </div>

                    <div>
                      <label className="checkout-form-label">Expiry (MM/YY)</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        maxLength={5}
                        className="checkout-text-input font-mono"
                      />
                    </div>

                    <div>
                      <label className="checkout-form-label">CVV / CVC</label>
                      <input
                        type="password"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        maxLength={4}
                        className="checkout-text-input font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* METHOD 3: Net Banking */}
              {selectedMethod === 'NetBanking' && (
                <div className="method-details-pane animate-modal-pop">
                  <label className="checkout-form-label">Select Your Bank</label>
                  <div className="net-banking-grid">
                    {NET_BANKING_BANKS.map((bank) => (
                      <button
                        key={bank.id}
                        type="button"
                        onClick={() => setSelectedBank(bank.id)}
                        className={`bank-selector-card ${selectedBank === bank.id ? 'active' : ''}`}
                      >
                        <Building2 size={20} color={selectedBank === bank.id ? 'var(--cyan-accent)' : 'var(--text-muted)'} />
                        <span className="bank-name">{bank.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* METHOD 4: Wallets */}
              {selectedMethod === 'Wallet' && (
                <div className="method-details-pane animate-modal-pop">
                  <label className="checkout-form-label">Select Digital Wallet</label>
                  <div className="wallets-grid">
                    {WALLETS.map((w) => (
                      <button
                        key={w.id}
                        type="button"
                        onClick={() => setSelectedWallet(w.id)}
                        className={`wallet-selector-card ${selectedWallet === w.id ? 'active' : ''}`}
                      >
                        <span style={{ fontSize: '1.4rem' }}>{w.icon}</span>
                        <span className="wallet-name">{w.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Pay Now Button */}
              <div style={{ marginTop: '28px' }}>
                <button
                  type="button"
                  onClick={handlePayNow}
                  disabled={isProcessing}
                  className="gradient-border-btn pay-now-btn"
                >
                  {isProcessing ? (
                    <>
                      <div className="pay-spinner" />
                      <span>Processing Simulated Payment...</span>
                    </>
                  ) : (
                    <>
                      <Lock size={17} />
                      <span>Pay ${finalPayable.toFixed(2)} USD & Enroll</span>
                      <ArrowRight size={17} />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Order Summary & Coupon */}
          <div className="checkout-side-col">
            <div className="glass-panel order-summary-card">
              <h3 className="summary-card-title">{t('orderSummary', 'Order Summary')}</h3>

              {/* Items List / Preview */}
              {isCartCheckout ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                  {activeItems.map((item) => (
                    <div key={item.id} className="course-mini-preview" style={{ padding: '8px 10px', position: 'relative' }}>
                      <img src={item.thumbnail} alt={item.title} className="course-mini-thumb" style={{ width: '56px', height: '42px' }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h4 className="course-mini-title" style={{ fontSize: '0.86rem' }}>{item.title}</h4>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                          <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.86rem' }}>
                            ${Number(item.price).toFixed(2)}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.id)}
                            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '2px' }}
                            title="Remove item"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="course-mini-preview">
                  <img src={singleCourse.thumbnail} alt={singleCourse.title} className="course-mini-thumb" />
                  <div>
                    <h4 className="course-mini-title">{singleCourse.title}</h4>
                    <div className="course-mini-meta">
                      <span>{singleCourse.category}</span>
                      <span>•</span>
                      <span>{singleCourse.duration}</span>
                    </div>
                    <div className="course-mini-instructor">
                      By {singleCourse.instructor.name}
                    </div>
                  </div>
                </div>
              )}

              {/* Coupon Form */}
              <form onSubmit={handleApplyCoupon} className="coupon-form">
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Coupon code (e.g. LEARN20)"
                    className="checkout-text-input coupon-input"
                  />
                  <button type="submit" className="glass-btn coupon-btn">
                    <Tag size={15} />
                    <span>Apply</span>
                  </button>
                </div>
                {couponSuccess && <span className="coupon-msg success">{couponSuccess}</span>}
                {couponError && <span className="coupon-msg error">{couponError}</span>}
              </form>

              {/* Price Breakdown */}
              <div className="price-breakdown">
                <div className="price-row">
                  <span>{t('originalPrice', 'List Price')}</span>
                  <span>${originalPrice.toFixed(2)}</span>
                </div>

                {platformDiscount > 0 && (
                  <div className="price-row discount">
                    <span>Platform Academic Discount</span>
                    <span>-${platformDiscount.toFixed(2)}</span>
                  </div>
                )}

                {appliedDiscount > 0 && (
                  <div className="price-row discount">
                    <span>Scholar Coupon Discount</span>
                    <span>-${appliedDiscount.toFixed(2)}</span>
                  </div>
                )}

                <div className="price-row">
                  <span>{t('taxGst', 'Estimated Tax (18% GST)')}</span>
                  <span>${taxAmount.toFixed(2)}</span>
                </div>

                <div className="price-divider" />

                <div className="price-row total">
                  <span>{t('totalPayable', 'Total Amount')}</span>
                  <span className="total-number">${finalPayable.toFixed(2)} USD</span>
                </div>
              </div>

              {/* Assurance Features */}
              <div className="checkout-assurances">
                <div className="assurance-item">
                  <CheckCircle2 size={15} color="var(--emerald-accent)" />
                  <span>Full lifetime course and assignment access</span>
                </div>
                <div className="assurance-item">
                  <CheckCircle2 size={15} color="var(--emerald-accent)" />
                  <span>Verifiable Certificate upon 100% completion</span>
                </div>
                <div className="assurance-item">
                  <CheckCircle2 size={15} color="var(--emerald-accent)" />
                  <span>Instant student profile enrollment sync</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
