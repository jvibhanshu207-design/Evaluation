import React, { useState, useId } from 'react';
import { Link } from 'react-router-dom';
import {
  HelpCircle,
  Plus,
  Minus,
  Search,
  X,
  Sparkles,
  ArrowRight,
  Compass
} from 'lucide-react';
import { FAQS_DATA, FAQ_CATEGORIES } from '../../data/faqsData';
import './faq.css';

export default function FaqSection() {
  // Store an array or set of open FAQ IDs to allow individual toggle (clicking opens, clicking again collapses)
  const [openIds, setOpenIds] = useState(() => [FAQS_DATA[0].id]); // First question open by default for immediate preview
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const baseId = useId();

  // Toggle single accordion item
  const handleToggle = (id) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Expand / Collapse all
  const handleToggleAll = () => {
    if (openIds.length === filteredFaqs.length) {
      setOpenIds([]);
    } else {
      setOpenIds(filteredFaqs.map((f) => f.id));
    }
  };

  // Filter FAQs based on active category & search query
  const filteredFaqs = FAQS_DATA.filter((faq) => {
    const matchesCategory =
      activeCategory === 'All' || faq.category === activeCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
      faq.tag.toLowerCase().includes(searchQuery.toLowerCase().trim());
    return matchesCategory && matchesSearch;
  });

  const allExpanded =
    filteredFaqs.length > 0 && openIds.length === filteredFaqs.length;

  return (
    <section id="faqs" className="faq-section" aria-labelledby="faq-main-heading">
      {/* Header Container */}
      <div className="faq-header">
        <div className="faq-tag-pill">
          <HelpCircle size={15} />
          <span>Knowledge Base & Support</span>
        </div>

        <h2 id="faq-main-heading" className="faq-title">
          Frequently Asked <span className="gradient-text">Questions</span>
        </h2>

        <p className="faq-subtitle">
          Everything you need to know about navigating LearnSphere, interactive courses, study tools, and verified credentials.
        </p>
      </div>

      {/* Interactive Controls Toolbar */}
      <div className="faq-toolbar">
        {/* Search Bar */}
        <div className="faq-search-wrapper">
          <span className="faq-search-icon" aria-hidden="true">
            <Search size={18} />
          </span>
          <input
            type="text"
            className="faq-search-input"
            placeholder="Search questions by keyword, topic, or feature..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search frequently asked questions"
          />
          {searchQuery && (
            <button
              type="button"
              className="faq-search-clear"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search input"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Category Pills & Bulk Action */}
        <div className="faq-filter-bar">
          <div
            className="faq-category-pills"
            role="tablist"
            aria-label="Filter FAQs by category"
          >
            {FAQ_CATEGORIES.map((category) => {
              const isActive = activeCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`faq-category-pill ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </button>
              );
            })}
          </div>

          {filteredFaqs.length > 0 && (
            <button
              type="button"
              className="faq-toggle-all-btn"
              onClick={handleToggleAll}
              aria-label={allExpanded ? 'Collapse all FAQs' : 'Expand all FAQs'}
            >
              <span>{allExpanded ? 'Collapse All' : 'Expand All'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Accordion List */}
      {filteredFaqs.length > 0 ? (
        <div className="faq-accordion-list" role="region" aria-label="FAQ Accordion">
          {filteredFaqs.map((faq) => {
            const isOpen = openIds.includes(faq.id);
            const triggerId = `${baseId}-trigger-${faq.id}`;
            const panelId = `${baseId}-panel-${faq.id}`;

            return (
              <div
                key={faq.id}
                className={`faq-accordion-item ${isOpen ? 'faq-item-open' : ''}`}
              >
                {/* Accordion Trigger Button */}
                <h3>
                  <button
                    type="button"
                    id={triggerId}
                    className="faq-accordion-trigger"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => handleToggle(faq.id)}
                  >
                    <div className="faq-question-content">
                      <span className="faq-tag-badge">{faq.tag}</span>
                      <span className="faq-question-text">{faq.question}</span>
                    </div>

                    <div
                      className="faq-icon-pill"
                      aria-hidden="true"
                    >
                      {isOpen ? (
                        <Minus size={16} strokeWidth={2.5} />
                      ) : (
                        <Plus size={16} strokeWidth={2.5} />
                      )}
                    </div>
                  </button>
                </h3>

                {/* Collapsible Answer Region with CSS Grid */}
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={triggerId}
                  className="faq-accordion-collapse"
                  hidden={!isOpen && false /* using grid 0fr for smooth transition */}
                >
                  <div className="faq-accordion-inner">
                    <div className="faq-answer-body">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="faq-empty-state">
          <HelpCircle size={36} color="var(--text-muted)" style={{ marginBottom: '12px' }} />
          <h4 style={{ color: 'var(--text-primary)', marginBottom: '6px', fontSize: '1.1rem' }}>
            No Matching Questions Found
          </h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '16px' }}>
            We couldn't find any questions matching "{searchQuery}". Try searching for another topic or clear filters.
          </p>
          <button
            type="button"
            className="glass-btn"
            onClick={() => {
              setSearchQuery('');
              setActiveCategory('All');
            }}
          >
            <span>Reset Search & Filters</span>
          </button>
        </div>
      )}

      {/* Still Have Questions? Action Card */}
      <div className="faq-bottom-cta">
        <div className="faq-cta-left">
          <div className="faq-cta-icon-box">
            <Sparkles size={24} />
          </div>
          <div>
            <div className="faq-cta-title">Still have questions?</div>
            <div className="faq-cta-desc">
              Can't find the answer you need? Explore the student dashboard and course catalog to get started immediately.
            </div>
          </div>
        </div>

        <div className="faq-cta-actions">
          <Link to="/courses" className="glass-btn">
            <Compass size={17} />
            <span>Explore Courses</span>
          </Link>
          <Link to="/dashboard" className="gradient-border-btn">
            <span>Enter Platform</span>
            <ArrowRight size={17} />
          </Link>
        </div>
      </div>
    </section>
  );
}
