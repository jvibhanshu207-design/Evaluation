import React from 'react';
import './StatCard.css';

export default function StatCard({
  title,
  value,
  subtext,
  icon: Icon,
  badge,
  badgeType = 'positive', // 'positive' | 'warning' | 'neutral'
  colorTheme = 'purple', // 'purple' | 'cyan' | 'pink' | 'emerald' | 'amber'
  isCircular = false,
  circularProgress = 72
}) {
  const themeColors = {
    purple: {
      accent: '#8B5CF6',
      glow: 'rgba(139, 92, 246, 0.25)',
      bg: 'rgba(139, 92, 246, 0.12)'
    },
    cyan: {
      accent: '#22D3EE',
      glow: 'rgba(34, 211, 238, 0.25)',
      bg: 'rgba(34, 211, 238, 0.12)'
    },
    pink: {
      accent: '#F472B6',
      glow: 'rgba(244, 114, 182, 0.25)',
      bg: 'rgba(244, 114, 182, 0.12)'
    },
    emerald: {
      accent: '#34D399',
      glow: 'rgba(52, 211, 153, 0.25)',
      bg: 'rgba(52, 211, 153, 0.12)'
    },
    amber: {
      accent: '#FBBF24',
      glow: 'rgba(251, 191, 36, 0.25)',
      bg: 'rgba(251, 191, 36, 0.12)'
    }
  };

  const currentTheme = themeColors[colorTheme] || themeColors.purple;

  // SVG Circular progress computation
  const circleRadius = 32;
  const circumference = 2 * Math.PI * circleRadius;
  const strokeOffset = circumference - (circularProgress / 100) * circumference;

  const getBadgeClass = () => {
    switch (badgeType) {
      case 'positive':
        return 'badge-positive';
      case 'warning':
        return 'badge-warning';
      case 'neutral':
      default:
        return 'badge-neutral';
    }
  };

  return (
    <div className="glass-panel glass-panel-hover stat-card">
      {/* Top ambient corner glow */}
      <div
        className="stat-card-glow"
        style={{
          background: currentTheme.glow
        }}
      />

      {/* Header */}
      <div className="stat-card-header">
        <span className="stat-card-title">
          {title}
        </span>

        {Icon && (
          <div
            className="stat-card-icon-box"
            style={{
              backgroundColor: currentTheme.bg,
              border: `1px solid ${currentTheme.accent}40`,
              color: currentTheme.accent
            }}
          >
            <Icon size={19} />
          </div>
        )}
      </div>

      {/* Body / Main Value */}
      <div className={`stat-card-body ${isCircular ? 'between' : 'start'}`}>
        <div>
          <div className="stat-card-value">
            {value}
          </div>
          {subtext && (
            <div className="stat-card-subtext">
              {subtext}
            </div>
          )}
        </div>

        {/* Circular Indicator if isCircular */}
        {isCircular && (
          <div className="stat-card-circular">
            <svg width="74" height="74" viewBox="0 0 74 74">
              <circle
                cx="37"
                cy="37"
                r={circleRadius}
                className="stat-card-circular-track"
              />
              <circle
                cx="37"
                cy="37"
                r={circleRadius}
                className="stat-card-circular-bar"
                stroke={currentTheme.accent}
                strokeDasharray={circumference}
                strokeDashoffset={strokeOffset}
                transform="rotate(-90 37 37)"
                style={{
                  filter: `drop-shadow(0 0 6px ${currentTheme.accent})`
                }}
              />
            </svg>
            <div className="stat-card-circular-text">
              {circularProgress}%
            </div>
          </div>
        )}
      </div>

      {/* Optional Badge */}
      {badge && (
        <div className="stat-card-badge-wrap">
          <span className={`pill-badge ${getBadgeClass()}`}>
            {badge}
          </span>
        </div>
      )}
    </div>
  );
}
