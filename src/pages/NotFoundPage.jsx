import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, LayoutDashboard, Sparkles } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div
      style={{
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '40px 20px',
        position: 'relative'
      }}
    >
      {/* Floating Astronaut / Student Portal Vector */}
      <div
        className="animate-float-slow"
        style={{
          width: '180px',
          height: '180px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(34, 211, 238, 0.2))',
          border: '2px solid rgba(167, 139, 250, 0.4)',
          boxShadow: '0 0 50px rgba(139, 92, 246, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '28px'
        }}
      >
        <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="40" stroke="#22D3EE" strokeWidth="2" strokeDasharray="4 4" />
          <circle cx="50" cy="42" r="16" fill="#8B5CF6" />
          <circle cx="50" cy="40" r="12" fill="#080B18" stroke="#22D3EE" strokeWidth="2" />
          <path d="M34 68 C34 56, 66 56, 66 68 Z" fill="#A78BFA" />
          <ellipse cx="50" cy="80" rx="30" ry="8" fill="rgba(34, 211, 238, 0.3)" />
        </svg>
      </div>

      <span
        style={{
          fontSize: '4.5rem',
          fontWeight: 900,
          fontFamily: 'var(--font-heading)',
          background: 'linear-gradient(135deg, #FFFFFF, #A78BFA, #22D3EE)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          lineHeight: 1,
          marginBottom: '12px'
        }}
      >
        404
      </span>

      <h1
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '1.9rem',
          fontWeight: 800,
          color: 'var(--text-primary)',
          maxWidth: '580px',
          marginBottom: '14px'
        }}
      >
        Oops! This page got lost somewhere in the learning universe.
      </h1>

      <p style={{ color: 'var(--text-secondary)', maxWidth: '480px', fontSize: '0.96rem', lineHeight: '1.6', marginBottom: '32px' }}>
        The coordinates you entered don't correspond to any active course, lecture, or document in our ecosystem.
      </p>

      <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link to="/" className="glass-btn" style={{ padding: '12px 24px' }}>
          <Compass size={18} />
          <span>Go Home</span>
        </Link>

        <Link to="/dashboard" className="gradient-border-btn" style={{ padding: '12px 26px' }}>
          <LayoutDashboard size={18} />
          <span>Go to Dashboard</span>
        </Link>
      </div>
    </div>
  );
}
