import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  CheckCircle2,
  Sparkles,
  BookOpen,
  ArrowRight,
  Home,
  ShieldCheck,
  Download,
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '../context/CartContext';

export default function OrderConfirmationPage() {
  const { orderId } = useParams();
  const { demoOrders, currentOrder } = useCart();

  // Find order from demoOrders or currentOrder
  const order =
    demoOrders.find((o) => o.orderId === orderId) ||
    currentOrder ||
    demoOrders[0];

  // Fire celebratory confetti on mount
  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 }
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 }
        });
      }, 300);
    } catch {
      // Confetti fallback
    }
  }, []);

  if (!order) {
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
        <CheckCircle2 size={48} color="var(--emerald-accent)" style={{ marginBottom: '16px' }} />
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', marginBottom: '12px' }}>
          No Order Found
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
          We could not locate this order reference in your browser's demo storage.
        </p>
        <Link to="/courses" className="gradient-border-btn" style={{ padding: '12px 24px' }}>
          <span>Explore Courses</span>
        </Link>
      </div>
    );
  }

  const orderDate = order.paidAt
    ? new Date(order.paidAt).toLocaleDateString([], {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : 'Oct 21, 2026 • Just now';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '860px', margin: '0 auto', width: '100%' }}>
      {/* Success Hero Card */}
      <div
        className="glass-panel"
        style={{
          padding: '44px 32px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        {/* Glowing Background Blob */}
        <div
          style={{
            position: 'absolute',
            top: '-60px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '260px',
            height: '260px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(52, 211, 153, 0.25) 0%, transparent 70%)',
            filter: 'blur(40px)',
            pointerEvents: 'none'
          }}
        />

        {/* Big Success Icon */}
        <div
          style={{
            width: '84px',
            height: '84px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(52, 211, 153, 0.25), rgba(34, 211, 238, 0.2))',
            border: '2px solid rgba(52, 211, 153, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--emerald-accent)',
            marginBottom: '20px',
            boxShadow: '0 0 40px rgba(52, 211, 153, 0.35)'
          }}
        >
          <CheckCircle2 size={46} strokeWidth={2.5} />
        </div>

        {/* Pill Tag */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 14px',
            borderRadius: '9999px',
            backgroundColor: 'rgba(52, 211, 153, 0.12)',
            border: '1px solid rgba(52, 211, 153, 0.3)',
            color: 'var(--emerald-accent)',
            fontSize: '0.82rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            marginBottom: '14px'
          }}
        >
          <Sparkles size={14} />
          <span>Payment Simulation Complete • Demo Order Verified</span>
        </div>

        <h1
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(1.9rem, 3.8vw, 2.6rem)',
            fontWeight: 900,
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em',
            marginBottom: '12px'
          }}
        >
          Order Confirmed, <span className="gradient-text">{order.student?.name || 'Scholar'}!</span>
        </h1>

        <p
          style={{
            color: 'var(--text-secondary)',
            fontSize: '1rem',
            lineHeight: '1.6',
            maxWidth: '560px',
            marginBottom: '28px'
          }}
        >
          Thank you for choosing LearnSphere. Your courses have been unlocked with immediate access, full video lessons, and verifiable completion credentials.
        </p>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: '14px' }}>
          <Link
            to="/my-courses"
            className="gradient-border-btn"
            style={{ padding: '13px 28px', fontSize: '1rem', fontWeight: 700 }}
          >
            <BookOpen size={18} />
            <span>View My Courses</span>
            <ArrowRight size={18} />
          </Link>

          <Link
            to="/"
            className="glass-btn"
            style={{ padding: '13px 24px', fontSize: '1rem' }}
          >
            <Home size={18} />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>

      {/* Itemized Order Receipt Card */}
      <div className="glass-panel" style={{ padding: '32px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            borderBottom: '1px solid var(--border-subtle)',
            paddingBottom: '20px',
            marginBottom: '24px'
          }}
        >
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Order Reference Number
            </div>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '1.4rem',
                fontWeight: 800,
                color: 'var(--electric-violet)',
                marginTop: '2px'
              }}
            >
              {order.orderId}
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Transaction Date</div>
            <div style={{ fontSize: '0.94rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>
              {orderDate}
            </div>
          </div>
        </div>

        {/* Customer & Status Details Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '18px',
            padding: '16px 20px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border-subtle)',
            marginBottom: '28px'
          }}
        >
          <div>
            <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Student Name
            </div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>
              {order.student?.name || 'Vibhanshu Jain'}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Email Address
            </div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--cyan-accent)', marginTop: '4px' }}>
              {order.student?.email || 'student@learnsphere.edu'}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Payment Status
            </div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.88rem',
                fontWeight: 800,
                color: 'var(--emerald-accent)',
                marginTop: '4px'
              }}
            >
              <CheckCircle2 size={16} />
              <span>Paid (Demo Simulation)</span>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Total Paid
            </div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-primary)', marginTop: '2px' }}>
              ${Number(order.total || 0).toFixed(2)}
            </div>
          </div>
        </div>

        {/* Purchased Course Items */}
        <h3
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.2rem',
            fontWeight: 800,
            color: 'var(--text-primary)',
            marginBottom: '16px'
          }}
        >
          Purchased Courses ({order.items?.length || 0})
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
          {order.items?.map((item) => (
            <div
              key={item.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 18px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-subtle)',
                gap: '16px',
                flexWrap: 'wrap'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: '220px', flex: 1 }}>
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  style={{ width: '64px', height: '42px', borderRadius: '6px', objectFit: 'cover' }}
                />
                <div>
                  <div style={{ fontSize: '0.94rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {item.title}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    {item.category} • Instructor: {item.instructor?.name}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span
                  style={{
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    padding: '3px 10px',
                    borderRadius: '9999px',
                    backgroundColor: 'rgba(52, 211, 153, 0.15)',
                    color: 'var(--emerald-accent)',
                    border: '1px solid rgba(52, 211, 153, 0.3)'
                  }}
                >
                  Active License
                </span>
                <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  ${Number(item.price || 49.99).toFixed(2)}
                </span>
                <Link
                  to={`/learn/${item.id}`}
                  className="gradient-border-btn"
                  style={{ padding: '6px 14px', fontSize: '0.8rem', gap: '4px' }}
                >
                  <span>Start Learning</span>
                  <ExternalLink size={13} />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Guarantee footer note */}
        <div
          style={{
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.82rem',
            color: 'var(--text-muted)',
            flexWrap: 'wrap',
            gap: '12px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={16} color="var(--emerald-accent)" />
            <span>Order records and course licenses are securely stored in your local storage.</span>
          </div>

          <button
            type="button"
            onClick={() => window.print()}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--cyan-accent)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontWeight: 600,
              fontSize: '0.82rem'
            }}
          >
            <Download size={14} />
            <span>Print Demo Receipt</span>
          </button>
        </div>
      </div>
    </div>
  );
}
