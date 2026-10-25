import React, { useState, useRef, useEffect } from 'react';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import './LanguageSelector.css';

export default function LanguageSelector({ compact = false }) {
  const { language, setLanguage, languages, currentLanguageConfig } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (code) => {
    setLanguage(code);
    setIsOpen(false);
  };

  return (
    <div className="language-selector-wrapper" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`language-trigger-btn ${isOpen ? 'active' : ''} ${compact ? 'compact' : ''}`}
        title={`Change Language (Current: ${currentLanguageConfig.name})`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <Globe size={16} className="language-globe-icon" />
        <span className="language-flag">{currentLanguageConfig.flag}</span>
        {!compact && <span className="language-name">{currentLanguageConfig.code.toUpperCase()}</span>}
        <ChevronDown size={13} className={`language-chevron ${isOpen ? 'open' : ''}`} />
      </button>

      {isOpen && (
        <div className="glass-panel language-dropdown animate-modal-pop" role="listbox">
          <div className="language-dropdown-header">
            <span>Select Language</span>
          </div>

          <div className="language-options-list">
            {languages.map((lang) => {
              const isSelected = language === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleSelect(lang.code)}
                  className={`language-option-item ${isSelected ? 'selected' : ''}`}
                  role="option"
                  aria-selected={isSelected}
                >
                  <div className="language-option-left">
                    <span className="language-option-flag">{lang.flag}</span>
                    <div className="language-option-text">
                      <span className="language-option-name">{lang.name}</span>
                      <span className="language-option-native">{lang.nativeName}</span>
                    </div>
                  </div>

                  {isSelected && <Check size={16} className="language-check-icon" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
