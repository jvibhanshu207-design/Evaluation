import React from 'react';
import { Link } from 'react-router-dom';
import './Logo.css';

export default function Logo({
  size = 'md',
  showText = true,
  to = '/dashboard',
  className = ''
}) {
  const pixelSizes = {
    sm: 32,
    md: 42,
    lg: 58
  };

  const px = pixelSizes[size] || pixelSizes.md;

  const logoIcon = (
    <div className={`learnsphere-logo-icon ${size}`}>
      <svg
        viewBox="0 0 100 100"
        width={px}
        height={px}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: 'visible' }}
      >
        <defs>
          <linearGradient id="lsOrbGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="50%" stopColor="#A78BFA" />
            <stop offset="100%" stopColor="#22D3EE" />
          </linearGradient>
          <filter id="lsGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer Glow Ring */}
        <circle
          cx="50"
          cy="50"
          r="44"
          fill="none"
          stroke="rgba(139, 92, 246, 0.35)"
          strokeWidth="2"
        />

        {/* Outer Vibrant Orbital Ring */}
        <circle
          cx="50"
          cy="50"
          r="38"
          fill="none"
          stroke="url(#lsOrbGrad)"
          strokeWidth="3.5"
          filter="url(#lsGlow)"
        />

        {/* Core Sphere */}
        <circle
          cx="50"
          cy="50"
          r="19"
          fill="url(#lsOrbGrad)"
          filter="url(#lsGlow)"
        />

        {/* Tilted Orbital Ring */}
        <ellipse
          cx="50"
          cy="50"
          rx="38"
          ry="14"
          fill="none"
          stroke="#22D3EE"
          strokeWidth="2.5"
          transform="rotate(-28 50 50)"
          filter="url(#lsGlow)"
        />

        {/* Satellite Particle */}
        <circle
          cx="78"
          cy="35"
          r="4.5"
          fill="#F472B6"
          filter="url(#lsGlow)"
        />
      </svg>
    </div>
  );

  const content = (
    <div
      className={`learnsphere-logo-link ${className}`}
      style={{ display: 'inline-flex', alignItems: 'center' }}
    >
      {logoIcon}
      {showText && (
        <span className={`learnsphere-logo-text ${size}`}>
          Learn<span className="learnsphere-logo-gradient">Sphere</span>
        </span>
      )}
    </div>
  );

  if (to) {
    return (
      <Link to={to} className={`learnsphere-logo-link ${className}`} title="LearnSphere Home">
        {logoIcon}
        {showText && (
          <span className={`learnsphere-logo-text ${size}`}>
            Learn<span className="learnsphere-logo-gradient">Sphere</span>
          </span>
        )}
      </Link>
    );
  }

  return content;
}
