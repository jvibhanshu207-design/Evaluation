import React, { useState } from 'react';
import { Search, Compass } from 'lucide-react';
import { useCourses } from '../context/CourseContext';
import CourseCard from '../components/courses/CourseCard';
import EmptyState from '../components/common/EmptyState';
import './CoursesPage.css';

export default function CoursesPage() {
  const { courses } = useCourses();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Programming', 'Web Development', 'Database', 'AI/ML', 'Design'];

  const filteredCourses = courses.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.instructor.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'All' || c.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="courses-page-container">
      {/* Header Banner */}
      <div className="glass-panel page-banner">
        <div className="page-banner-glow" />

        <div className="page-tag">
          <Compass size={18} color="var(--cyan-accent)" />
          <span>Course Marketplace & Catalog</span>
        </div>

        <h1 className="page-title">
          Explore All Courses
        </h1>

        <p className="page-subtitle">
          Discover structured educational paths featuring integrated YouTube video curricula, coding assignments, timed quizzes, and verifiable certificates.
        </p>

        {/* Search Bar & Filter Pills */}
        <div className="courses-controls-bar">
          {/* Search Box */}
          <div className="search-bar-pill">
            <Search size={18} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Search by title, instructor, or topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Filter Pills */}
          <div className="courses-filters-wrap">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`filter-pill-btn ${isSelected ? 'active' : ''}`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      {filteredCourses.length === 0 ? (
        <EmptyState
          title="No courses match your filter"
          description={`We couldn't find any courses matching "${searchQuery}". Try selecting another category or resetting the search.`}
          actionText="Clear Filters"
          onAction={() => {
            setSearchQuery('');
            setSelectedCategory('All');
          }}
        />
      ) : (
        <div className="courses-grid">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}
