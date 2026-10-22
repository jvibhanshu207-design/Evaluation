import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Sparkles } from 'lucide-react';
import './EmptyState.css';

export default function EmptyState({
  icon: Icon = Compass,
  title = 'No items found',
  description = 'Your academic journey is just getting started. Explore our universe of interactive courses.',
  actionText = 'Explore Courses',
  actionLink = '/courses',
  onAction
}) {
  return (
    <div className="glass-panel empty-state-card">
      <div className="empty-state-icon-box">
        <Icon size={34} />
      </div>

      <h3 className="empty-state-title">
        {title}
      </h3>

      <p className="empty-state-desc">
        {description}
      </p>

      {actionLink ? (
        <Link to={actionLink} className="gradient-border-btn">
          <Sparkles size={16} />
          <span>{actionText}</span>
        </Link>
      ) : onAction ? (
        <button onClick={onAction} className="gradient-border-btn">
          <Sparkles size={16} />
          <span>{actionText}</span>
        </button>
      ) : null}
    </div>
  );
}
