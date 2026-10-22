import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import './CartIcon.css';

export default function CartIcon() {
  const { cartCount } = useCart();

  return (
    <Link
      to="/cart"
      className={`cart-icon-btn ${cartCount > 0 ? 'has-items' : ''}`}
      title={cartCount > 0 ? `Shopping Cart (${cartCount} ${cartCount === 1 ? 'course' : 'courses'})` : 'Shopping Cart (Empty)'}
      aria-label={`Shopping cart containing ${cartCount} items`}
    >
      <ShoppingBag size={18} />

      {/* Dynamic Count Badge */}
      {cartCount > 0 && (
        <span className="cart-count-badge">
          {cartCount}
        </span>
      )}
    </Link>
  );
}
