import React from 'react';

export default function ProgressBar({
  progress = 0,
  height = 8,
  showLabel = false,
  colorGradient = 'linear-gradient(90deg, #8B5CF6, #22D3EE)',
  rounded = true
}) {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div style={{ width: '100%' }}>
      {showLabel && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '6px',
            fontSize: '0.85rem',
            color: 'var(--text-secondary)',
            fontWeight: 600
          }}
        >
          <span>Progress</span>
          <span style={{ color: 'var(--text-primary)' }}>{clampedProgress}%</span>
        </div>
      )}
      <div
        style={{
          width: '100%',
          height: `${height}px`,
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
          borderRadius: rounded ? '9999px' : '4px',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        <div
          style={{
            width: `${clampedProgress}%`,
            height: '100%',
            background: colorGradient,
            borderRadius: rounded ? '9999px' : '4px',
            transition: 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
            boxShadow: clampedProgress > 0 ? '0 0 12px rgba(139, 92, 246, 0.5)' : 'none'
          }}
        />
      </div>
    </div>
  );
}
