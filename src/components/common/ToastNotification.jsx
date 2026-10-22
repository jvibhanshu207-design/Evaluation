import React from 'react';
import { CheckCircle2, AlertCircle, ShoppingBag, Info, X } from 'lucide-react';
import './ToastNotification.css';

export default function ToastNotification({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div
      role="region"
      aria-label="Notifications"
      className="toast-container"
    >
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success' || !toast.type;
        const isError = toast.type === 'error';
        const isCart = toast.type === 'cart';

        const accentColor = isError
          ? 'var(--rose-accent, #FB7185)'
          : isCart
          ? 'var(--cyan-accent, #22D3EE)'
          : 'var(--emerald-accent, #34D399)';

        const borderColor = isError
          ? 'rgba(251, 113, 133, 0.4)'
          : isCart
          ? 'rgba(34, 211, 238, 0.4)'
          : 'rgba(52, 211, 153, 0.4)';

        const bgGlow = isError
          ? 'rgba(251, 113, 133, 0.12)'
          : isCart
          ? 'rgba(34, 211, 238, 0.12)'
          : 'rgba(52, 211, 153, 0.12)';

        return (
          <div
            key={toast.id}
            className="glass-panel toast-item"
            style={{
              border: `1px solid ${borderColor}`,
              boxShadow: `0 12px 30px rgba(0, 0, 0, 0.45), 0 0 20px ${bgGlow}`
            }}
          >
            {/* Left Accent Bar */}
            <div
              className="toast-accent-bar"
              style={{ backgroundColor: accentColor }}
            />

            {/* Icon */}
            <div
              className="toast-icon-wrapper"
              style={{ color: accentColor }}
            >
              {isError ? (
                <AlertCircle size={20} />
              ) : isCart ? (
                <ShoppingBag size={20} />
              ) : isSuccess ? (
                <CheckCircle2 size={20} />
              ) : (
                <Info size={20} />
              )}
            </div>

            {/* Content */}
            <div className="toast-content">
              {toast.title && (
                <div className="toast-title">
                  {toast.title}
                </div>
              )}
              <div className="toast-message">
                {toast.message}
              </div>
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              className="toast-dismiss-btn"
              aria-label="Dismiss notification"
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
