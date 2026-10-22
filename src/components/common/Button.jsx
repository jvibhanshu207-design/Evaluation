import React from 'react';
import './Button.css';

export default function Button({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'ghost' | 'danger'
  size = 'md', // 'sm' | 'md' | 'lg'
  icon: Icon,
  iconPosition = 'left',
  onClick,
  disabled = false,
  className = '',
  style = {},
  type = 'button',
  ...props
}) {
  const getVariantClass = () => {
    switch (variant) {
      case 'primary':
        return 'gradient-border-btn';
      case 'danger':
        return 'btn-danger';
      case 'secondary':
      case 'ghost':
      default:
        return 'glass-btn';
    }
  };

  const getSizeClass = () => {
    switch (size) {
      case 'sm':
        return 'btn-sm';
      case 'lg':
        return 'btn-lg';
      case 'md':
      default:
        return 'btn-md';
    }
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${getVariantClass()} ${getSizeClass()} ${disabled ? 'btn-disabled' : ''} ${className}`}
      style={style}
      {...props}
    >
      {Icon && iconPosition === 'left' && <Icon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 17} />}
      <span>{children}</span>
      {Icon && iconPosition === 'right' && <Icon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 17} />}
    </button>
  );
}
