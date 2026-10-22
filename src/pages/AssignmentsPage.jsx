import React, { useState, useEffect } from 'react';
import { FileCheck2, Clock, Award, ArrowRight, Search } from 'lucide-react';
import { DEMO_ASSIGNMENTS } from '../data/demoAssignments';
import { STORAGE_KEYS, getStoredData, setStoredData } from '../utils/storage';
import AssignmentModal from '../components/assignments/AssignmentModal';
import EmptyState from '../components/common/EmptyState';
import './AssignmentsPage.css';

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState(() =>
    getStoredData(STORAGE_KEYS.ASSIGNMENTS, DEMO_ASSIGNMENTS)
  );
  const [activeTab, setActiveTab] = useState('All'); // 'All' | 'Pending' | 'Submitted' | 'Graded'
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setStoredData(STORAGE_KEYS.ASSIGNMENTS, assignments);
  }, [assignments]);

  const handleAssignmentSubmit = (asgId, text, fileName) => {
    setAssignments((prev) =>
      prev.map((a) =>
        a.id === asgId
          ? {
              ...a,
              status: 'Submitted',
              submittedAt: new Date().toISOString(),
              submissionText: text,
              fileName: fileName || 'assignment_submission.zip'
            }
          : a
      )
    );
  };

  const filteredAssignments = assignments.filter((a) => {
    const matchesTab = activeTab === 'All' || a.status === activeTab;
    const matchesSearch =
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.courseName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Pending':
        return 'pill-badge badge-danger';
      case 'Submitted':
        return 'pill-badge badge-cyan';
      case 'Graded':
        return 'pill-badge badge-positive';
      default:
        return 'pill-badge badge-neutral';
    }
  };

  return (
    <div className="assignments-container">
      {/* Header Banner */}
      <div className="glass-panel page-banner">
        <div className="page-tag">
          <FileCheck2 size={20} color="var(--pink-accent)" />
          <span style={{ color: 'var(--pink-accent)' }}>Academic Coursework Portal</span>
        </div>

        <h1 className="page-title">
          Assignments & Submissions
        </h1>

        <p className="page-subtitle">
          Manage your coding homework, algorithmic tasks, and engineering projects with automated timestamps and instructor feedback.
        </p>

        {/* Tabs & Search */}
        <div className="assignments-controls-bar">
          {/* Tabs */}
          <div className="assignments-tabs-wrap">
            {['All', 'Pending', 'Submitted', 'Graded'].map((tab) => {
              const isSelected = activeTab === tab;
              const count = tab === 'All' ? assignments.length : assignments.filter((a) => a.status === tab).length;

              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`assignments-tab-btn ${isSelected ? 'active' : ''}`}
                >
                  {tab} ({count})
                </button>
              );
            })}
          </div>

          {/* Search */}
          <div className="assignments-search-wrap">
            <Search size={15} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Search assignments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="assignments-search-input"
            />
          </div>
        </div>
      </div>

      {/* Assignments Cards List */}
      {filteredAssignments.length === 0 ? (
        <EmptyState
          title="No assignments found"
          description={`There are currently no assignments matching the "${activeTab}" filter.`}
          actionText="View All Assignments"
          onAction={() => {
            setActiveTab('All');
            setSearchQuery('');
          }}
        />
      ) : (
        <div className="assignments-grid">
          {filteredAssignments.map((asg) => {
            return (
              <div
                key={asg.id}
                className="glass-panel glass-panel-hover assignment-card"
              >
                <div>
                  {/* Top Row: Course & Status */}
                  <div className="assignment-card-header">
                    <span className="assignment-course-name">
                      {asg.courseName}
                    </span>

                    <span className={getStatusBadgeClass(asg.status)}>
                      {asg.status}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="assignment-card-title">
                    {asg.title}
                  </h3>

                  <p className="assignment-card-desc">
                    {asg.description}
                  </p>
                </div>

                {/* Metadata & Actions */}
                <div>
                  <div className="assignment-card-meta">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Clock size={14} color="var(--rose-accent)" />
                      <span>Due: <strong style={{ color: 'var(--text-primary)' }}>{asg.dueDate}</strong></span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Award size={14} color="#FBBF24" />
                      <span>{asg.status === 'Graded' ? `Score: ${asg.grade}/${asg.marks}` : `${asg.marks} Marks`}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="assignment-card-actions">
                    <button
                      onClick={() => setSelectedAssignment(asg)}
                      className="glass-btn"
                      style={{ flex: 1, justifyContent: 'center', padding: '9px', fontSize: '0.86rem' }}
                    >
                      <span>View Brief</span>
                    </button>

                    <button
                      onClick={() => setSelectedAssignment(asg)}
                      className="gradient-border-btn"
                      style={{
                        flex: 1,
                        justifyContent: 'center',
                        padding: '9px',
                        fontSize: '0.86rem',
                        backgroundColor: asg.status === 'Submitted' ? 'rgba(34, 211, 238, 0.2)' : undefined
                      }}
                    >
                      <span>{asg.status === 'Pending' ? 'Submit Now' : 'Submission'}</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Assignment Modal */}
      {selectedAssignment && (
        <AssignmentModal
          isOpen={!!selectedAssignment}
          onClose={() => setSelectedAssignment(null)}
          assignment={selectedAssignment}
          onSubmit={handleAssignmentSubmit}
        />
      )}
    </div>
  );
}
