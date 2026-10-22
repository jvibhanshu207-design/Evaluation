import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, BookOpen, CheckSquare, HelpCircle, FileText, Bell, Award, Calendar, Compass, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCourses } from '../../context/CourseContext';
import { DEMO_ASSIGNMENTS } from '../../data/demoAssignments';
import { DEMO_QUIZZES } from '../../data/demoQuizzes';
import { DEMO_NOTES } from '../../data/demoNotes';
import './CommandPalette.css';

export default function CommandPalette({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { courses } = useCourses();

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Aggregate searchable items
  const allItems = [
    // Pages / Quick Actions
    { id: 'p-dash', type: 'page', title: 'Dashboard', subtitle: 'Overview & continue learning', icon: Compass, link: '/dashboard' },
    { id: 'p-smart', type: 'page', title: 'Smart Learning Hub', subtitle: 'Personalized path, 3D flashcards, weak topics & adaptive quiz', icon: BookOpen, link: '/smart-learning' },
    { id: 'p-focus', type: 'page', title: 'Focus Room (Pomodoro)', subtitle: 'Distraction-free study sanctuary & goals', icon: Calendar, link: '/focus-room' },
    { id: 'p-courses', type: 'page', title: 'Courses Marketplace', subtitle: 'Browse all subjects', icon: BookOpen, link: '/courses' },
    { id: 'p-cart', type: 'page', title: 'Shopping Cart', subtitle: 'View selected courses & subtotal', icon: ShoppingBag, link: '/cart' },
    { id: 'p-my-courses', type: 'page', title: 'My Courses (Purchased)', subtitle: 'Access purchased demo courses & lifetime licenses', icon: BookOpen, link: '/my-courses' },
    { id: 'p-checkout', type: 'page', title: 'Checkout & Payment', subtitle: 'Complete course enrollment order', icon: CheckSquare, link: '/checkout' },
    { id: 'p-my-learn', type: 'page', title: 'My Learning', subtitle: 'Enrolled courses and progress', icon: BookOpen, link: '/my-learning' },
    { id: 'p-asg', type: 'page', title: 'Assignments', subtitle: 'Submit homework & view grades', icon: CheckSquare, link: '/assignments' },
    { id: 'p-quiz', type: 'page', title: 'Quizzes', subtitle: 'Interactive knowledge tests', icon: HelpCircle, link: '/quizzes' },
    { id: 'p-notes', type: 'page', title: 'Study Notes', subtitle: 'Digital notebook & snippets', icon: FileText, link: '/notes' },
    { id: 'p-plan', type: 'page', title: 'Study Planner', subtitle: 'Schedule & calendar deadlines', icon: Calendar, link: '/planner' },
    { id: 'p-achieve', type: 'page', title: 'Achievements & Leaderboard', subtitle: 'Gamification badges, XP & ranking', icon: Award, link: '/achievements' },
    { id: 'p-ann', type: 'page', title: 'Announcements', subtitle: 'Academic notifications & notices', icon: Bell, link: '/announcements' },
    { id: 'p-faq', type: 'page', title: 'Frequently Asked Questions (FAQs)', subtitle: 'Knowledge base, courses, AI tutor, certs & support', icon: HelpCircle, link: '/#faqs' },

    // Courses
    ...courses.map(c => ({
      id: `c-${c.id}`,
      type: 'course',
      title: c.title,
      subtitle: `${c.category} • ${c.duration} • By ${c.instructor.name}`,
      icon: BookOpen,
      link: `/courses/${c.id}`
    })),

    // Assignments
    ...DEMO_ASSIGNMENTS.map(a => ({
      id: `a-${a.id}`,
      type: 'assignment',
      title: a.title,
      subtitle: `${a.courseName} • Due: ${a.dueDate}`,
      icon: CheckSquare,
      link: '/assignments'
    })),

    // Quizzes
    ...DEMO_QUIZZES.map(q => ({
      id: `q-${q.id}`,
      type: 'quiz',
      title: q.title,
      subtitle: `${q.courseName} • ${q.questionsCount} questions`,
      icon: HelpCircle,
      link: '/quizzes'
    })),

    // Notes
    ...DEMO_NOTES.map(n => ({
      id: `n-${n.id}`,
      type: 'note',
      title: n.title,
      subtitle: `Category: ${n.category} • Tags: ${n.tags.join(', ')}`,
      icon: FileText,
      link: '/notes'
    }))
  ];

  const filteredItems = query.trim() === ''
    ? allItems.slice(0, 8)
    : allItems.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 10);

  const handleSelect = (item) => {
    navigate(item.link);
    onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % (filteredItems.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredItems.length) % (filteredItems.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        handleSelect(filteredItems[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="cmd-palette-backdrop"
      onClick={onClose}
    >
      <div
        className="glass-panel animate-modal-pop cmd-palette-dialog"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="cmd-palette-search">
          <Search size={22} color="var(--primary-purple)" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search courses, assignments, quizzes, notes, or pages..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            className="cmd-palette-input"
          />
          <button
            onClick={onClose}
            className="cmd-palette-esc-btn"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="cmd-palette-list">
          {filteredItems.length === 0 ? (
            <div className="cmd-palette-empty">
              <p>No results matching "{query}"</p>
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`cmd-palette-item ${isSelected ? 'selected' : ''}`}
                >
                  <div className="cmd-palette-item-left">
                    <div className="cmd-palette-item-icon">
                      <Icon size={18} />
                    </div>

                    <div style={{ minWidth: 0 }}>
                      <div className="cmd-palette-item-title">
                        {item.title}
                      </div>
                      <div className="cmd-palette-item-sub">
                        {item.subtitle}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                    <span className="cmd-palette-tag">
                      {item.type}
                    </span>
                    {isSelected && <ArrowRight size={15} color="var(--cyan-accent)" />}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="cmd-palette-footer">
          <span>Use ↑ ↓ to navigate</span>
          <span>Press Enter to select</span>
        </div>
      </div>
    </div>
  );
}
