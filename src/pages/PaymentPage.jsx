import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Copy,
  Check,
  Info,
  AlertTriangle
} from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function PaymentPage() {
  const { currentOrder, simulatePaymentSuccess, cancelCurrentOrder } = useCart();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // If no current order exists, redirect to cart
  if (!currentOrder) {
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
        <AlertTriangle size={48} color="#FBBF24" style={{ marginBottom: '16px' }} />
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', marginBottom: '12px' }}>
          No Active Order Found
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
          It looks like there is no active checkout session. Please review your cart or browse our course catalog.
        </p>
        <Link to="/cart" className="gradient-border-btn" style={{ padding: '12px 24px' }}>
          <span>Go to Shopping Cart</span>
        </Link>
      </div>
    );
  }

  const handleCopyOrderRef = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(currentOrder.orderId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSimulatePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const completed = simulatePaymentSuccess();
      if (completed) {
        navigate(`/order-confirmation/${completed.orderId}`);
      } else {
        setIsProcessing(false);
      }
    }, 600);
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel this order? Your cart items will be preserved.')) {
      cancelCurrentOrder();
      navigate('/cart');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Top Header */}
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
            <span
              style={{
                fontSize: '0.8rem',
                fontWeight: 700,
                color: 'var(--cyan-accent)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em'
              }}
            >
              Step 2 of 2 • Demo Payment Simulation
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
            QR Code <span className="gradient-text">Payment Demo</span>
          </h1>
        </div>

        <Link to="/checkout" className="glass-btn" style={{ padding: '8px 16px', fontSize: '0.86rem' }}>
          <ArrowLeft size={15} />
          <span>Back to Checkout</span>
        </Link>
      </div>

      {/* Demo Warning Banner */}
      <div
        className="glass-panel"
        style={{
          padding: '16px 24px',
          borderRadius: 'var(--radius-lg)',
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
          border: '1px solid rgba(245, 158, 11, 0.35)',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          flexWrap: 'wrap'
        }}
      >
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: 'rgba(245, 158, 11, 0.2)',
            color: '#FBBF24',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
        >
          <Info size={20} />
        </div>
        <div style={{ flex: 1, minWidth: '240px' }}>
          <div style={{ fontWeight: 800, color: '#FBBF24', fontSize: '0.92rem', marginBottom: '2px' }}>
            DEMO MODE — ZERO FINANCIAL TRANSACTIONS
          </div>
          <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: '1.45' }}>
            This QR code is a frontend demonstration placeholder. No real UPI, banking, or credit card networks are connected. Click "Simulate Successful Payment" to test the instant course acquisition experience.
          </div>
        </div>
        <div
          style={{
            padding: '4px 12px',
            borderRadius: '9999px',
            backgroundColor: 'rgba(245, 158, 11, 0.2)',
            border: '1px solid rgba(245, 158, 11, 0.4)',
            color: '#FBBF24',
            fontWeight: 800,
            fontSize: '0.78rem'
          }}
        >
          SIMULATOR ACTIVE
        </div>
      </div>

      {/* Main Payment Layout Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(320px, 1fr) minmax(320px, 1.2fr)',
          gap: '28px',
          alignItems: 'start'
        }}
        className="payment-grid-container"
      >
        {/* Left Column: QR Code & Scanner Area */}
        <div
          className="glass-panel"
          style={{
            padding: '36px 28px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: '20px'
          }}
        >
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Scan with any UPI / Payment Demo App
          </div>

          {/* QR Code Container with High-Tech Frame & Laser Beam Effect */}
          <div
            style={{
              position: 'relative',
              padding: '20px',
              borderRadius: '24px',
              backgroundColor: '#FFFFFF',
              boxShadow: '0 0 40px rgba(139, 92, 246, 0.35), 0 16px 32px rgba(0, 0, 0, 0.5)',
              display: 'inline-block'
            }}
          >
            {/* SVG Crisp Deterministic QR Code with Finder Patterns */}
            <svg
              viewBox="0 0 220 220"
              width="210"
              height="210"
              style={{ display: 'block' }}
              aria-label="Demo QR Code for Payment"
            >
              {/* White background */}
              <rect width="220" height="220" fill="#FFFFFF" rx="10" />

              {/* Corner 1: Top-Left Finder Pattern (7x7 modules) */}
              <rect x="15" y="15" width="56" height="56" fill="#0F172A" rx="8" />
              <rect x="23" y="23" width="40" height="40" fill="#FFFFFF" rx="4" />
              <rect x="31" y="31" width="24" height="24" fill="#0F172A" rx="3" />

              {/* Corner 2: Top-Right Finder Pattern */}
              <rect x="149" y="15" width="56" height="56" fill="#0F172A" rx="8" />
              <rect x="157" y="23" width="40" height="40" fill="#FFFFFF" rx="4" />
              <rect x="165" y="31" width="24" height="24" fill="#0F172A" rx="3" />

              {/* Corner 3: Bottom-Left Finder Pattern */}
              <rect x="15" y="149" width="56" height="56" fill="#0F172A" rx="8" />
              <rect x="23" y="157" width="40" height="40" fill="#FFFFFF" rx="4" />
              <rect x="31" y="165" width="24" height="24" fill="#0F172A" rx="3" />

              {/* Timing Patterns */}
              <g fill="#0F172A">
                {/* Horizontal timing line */}
                <rect x="80" y="39" width="8" height="8" rx="1" />
                <rect x="96" y="39" width="8" height="8" rx="1" />
                <rect x="112" y="39" width="8" height="8" rx="1" />
                <rect x="128" y="39" width="8" height="8" rx="1" />

                {/* Vertical timing line */}
                <rect x="39" y="80" width="8" height="8" rx="1" />
                <rect x="39" y="96" width="8" height="8" rx="1" />
                <rect x="39" y="112" width="8" height="8" rx="1" />
                <rect x="39" y="128" width="8" height="8" rx="1" />
              </g>

              {/* Matrix Data Modules Cluster */}
              <g fill="#1E293B">
                <rect x="80" y="15" width="8" height="8" rx="1" />
                <rect x="96" y="15" width="16" height="8" rx="1" />
                <rect x="120" y="23" width="8" height="8" rx="1" />
                <rect x="80" y="55" width="16" height="8" rx="1" />
                <rect x="104" y="55" width="8" height="8" rx="1" />
                <rect x="120" y="55" width="16" height="8" rx="1" />

                <rect x="15" y="80" width="8" height="8" rx="1" />
                <rect x="15" y="104" width="8" height="16" rx="1" />
                <rect x="15" y="128" width="8" height="8" rx="1" />
                <rect x="55" y="80" width="8" height="16" rx="1" />
                <rect x="55" y="112" width="8" height="8" rx="1" />

                <rect x="80" y="80" width="16" height="16" rx="2" />
                <rect x="104" y="80" width="8" height="8" rx="1" />
                <rect x="120" y="80" width="16" height="8" rx="1" />
                <rect x="144" y="80" width="8" height="16" rx="1" />
                <rect x="160" y="80" width="16" height="8" rx="1" />
                <rect x="184" y="80" width="8" height="8" rx="1" />
                <rect x="200" y="80" width="8" height="16" rx="1" />

                <rect x="80" y="104" width="8" height="8" rx="1" />
                <rect x="136" y="104" width="8" height="8" rx="1" />
                <rect x="152" y="96" width="16" height="16" rx="2" />
                <rect x="176" y="104" width="8" height="8" rx="1" />

                <rect x="80" y="120" width="8" height="16" rx="1" />
                <rect x="96" y="120" width="16" height="8" rx="1" />
                <rect x="120" y="120" width="8" height="8" rx="1" />
                <rect x="136" y="120" width="16" height="8" rx="1" />
                <rect x="160" y="120" width="8" height="16" rx="1" />
                <rect x="176" y="128" width="16" height="8" rx="1" />
                <rect x="200" y="120" width="8" height="8" rx="1" />

                <rect x="80" y="144" width="8" height="8" rx="1" />
                <rect x="96" y="152" width="8" height="16" rx="1" />
                <rect x="112" y="144" width="16" height="8" rx="1" />
                <rect x="136" y="144" width="8" height="8" rx="1" />
                <rect x="152" y="144" width="16" height="16" rx="2" />
                <rect x="176" y="144" width="8" height="8" rx="1" />
                <rect x="192" y="144" width="16" height="8" rx="1" />

                <rect x="80" y="168" width="8" height="16" rx="1" />
                <rect x="104" y="168" width="16" height="8" rx="1" />
                <rect x="128" y="168" width="8" height="16" rx="1" />
                <rect x="144" y="176" width="8" height="8" rx="1" />
                <rect x="160" y="168" width="16" height="8" rx="1" />
                <rect x="184" y="168" width="8" height="8" rx="1" />
                <rect x="200" y="168" width="8" height="16" rx="1" />

                <rect x="80" y="192" width="16" height="8" rx="1" />
                <rect x="104" y="192" width="8" height="8" rx="1" />
                <rect x="120" y="184" width="16" height="16" rx="2" />
                <rect x="144" y="192" width="8" height="8" rx="1" />
                <rect x="160" y="192" width="8" height="8" rx="1" />
                <rect x="176" y="184" width="8" height="16" rx="1" />
                <rect x="192" y="192" width="16" height="8" rx="1" />
              </g>

              {/* Center Logo Shield Pill */}
              <rect x="78" y="88" width="64" height="44" fill="#FFFFFF" rx="8" />
              <rect x="80" y="90" width="60" height="40" fill="#8B5CF6" rx="6" />
              <text
                x="110"
                y="114"
                fill="#FFFFFF"
                fontSize="12"
                fontWeight="900"
                fontFamily="system-ui, sans-serif"
                textAnchor="middle"
                letterSpacing="1"
              >
                DEMO
              </text>
            </svg>
          </div>

          {/* Amount Badge */}
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
              Total Payable (Demo Amount)
            </div>
            <div
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '2.4rem',
                fontWeight: 900,
                color: 'var(--cyan-accent)',
                letterSpacing: '-0.02em'
              }}
            >
              ${Number(currentOrder.total || 0).toFixed(2)}
            </div>
          </div>

          {/* Order Reference Pill with Copy Button */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '8px 16px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--card-border)'
            }}
          >
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Order Ref:</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', fontWeight: 700, color: 'var(--electric-violet)' }}>
              {currentOrder.orderId}
            </span>
            <button
              type="button"
              onClick={handleCopyOrderRef}
              style={{
                background: 'transparent',
                border: 'none',
                color: copied ? 'var(--emerald-accent)' : 'var(--text-secondary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                padding: '2px'
              }}
              title="Copy Order Reference"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
        </div>

        {/* Right Column: Instructions, Student Details, Simulate Button & Cancel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Instructions Box */}
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
              Payment Verification Steps
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.92rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <span
                  style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(139, 92, 246, 0.2)',
                    color: 'var(--electric-violet)',
                    fontWeight: 800,
                    fontSize: '0.82rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  1
                </span>
                <span style={{ color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  Verify that your order reference <strong style={{ color: 'var(--text-primary)' }}>{currentOrder.orderId}</strong> and total amount of <strong style={{ color: 'var(--cyan-accent)' }}>${Number(currentOrder.total).toFixed(2)}</strong> match your selected curriculum.
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <span
                  style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(139, 92, 246, 0.2)',
                    color: 'var(--electric-violet)',
                    fontWeight: 800,
                    fontSize: '0.82rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  2
                </span>
                <span style={{ color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  Student recipient: <strong style={{ color: 'var(--text-primary)' }}>{currentOrder.student?.name}</strong> (<span style={{ color: 'var(--cyan-accent)' }}>{currentOrder.student?.email}</span>).
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <span
                  style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(139, 92, 246, 0.2)',
                    color: 'var(--electric-violet)',
                    fontWeight: 800,
                    fontSize: '0.82rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  3
                </span>
                <span style={{ color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  Click <strong style={{ color: 'var(--emerald-accent)' }}>"Simulate Successful Payment"</strong> below to instantly complete the order, grant course access, and generate your confirmation receipt.
                </span>
              </div>
            </div>
          </div>

          {/* Action Card */}
          <div
            className="glass-panel"
            style={{
              padding: '28px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}
          >
            {/* Primary Simulate Success Button */}
            <button
              type="button"
              onClick={handleSimulatePayment}
              disabled={isProcessing}
              className="gradient-border-btn"
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: '16px 24px',
                fontSize: '1.08rem',
                fontWeight: 800,
                opacity: isProcessing ? 0.7 : 1
              }}
            >
              <CheckCircle2 size={20} />
              <span>{isProcessing ? 'Verifying Demo Payment...' : 'Simulate Successful Payment'}</span>
            </button>

            {/* Back to Checkout */}
            <Link
              to="/checkout"
              className="glass-btn"
              style={{ width: '100%', justifyContent: 'center', padding: '11px', fontSize: '0.9rem' }}
            >
              <ArrowLeft size={16} />
              <span>Back to Checkout</span>
            </Link>

            {/* Cancel Order Option */}
            <button
              type="button"
              onClick={handleCancel}
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: 'transparent',
                border: 'none',
                color: 'var(--rose-accent, #FB7185)',
                fontSize: '0.86rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <XCircle size={15} />
              <span>Cancel Order</span>
            </button>
          </div>

          {/* Summary of Courses Included */}
          <div className="glass-panel" style={{ padding: '20px 24px' }}>
            <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '10px' }}>
              Purchasing ({currentOrder.items?.length || 0} items):
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {currentOrder.items?.map((item) => (
                <li
                  key={item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.84rem',
                    color: 'var(--text-secondary)'
                  }}
                >
                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '75%' }}>
                    • {item.title}
                  </span>
                  <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                    ${Number(item.price || 49.99).toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
