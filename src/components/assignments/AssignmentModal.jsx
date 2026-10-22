import React, { useState } from 'react';
import { CheckCircle2, Upload, FileCode, ArrowRight } from 'lucide-react';
import Modal from '../common/Modal';
import { sound } from '../../utils/sound';
import './AssignmentModal.css';

export default function AssignmentModal({ isOpen, onClose, assignment, onSubmit }) {
  const [submissionText, setSubmissionText] = useState('');
  const [fileName, setFileName] = useState('');
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);

  if (!assignment) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!submissionText.trim() && !fileName) {
      alert('Please enter your submission text/code or attach a file.');
      return;
    }

    sound.playFanfare();
    setIsSubmittedSuccess(true);

    if (onSubmit) {
      onSubmit(assignment.id, submissionText, fileName);
    }

    setTimeout(() => {
      setIsSubmittedSuccess(false);
      onClose();
    }, 2200);
  };

  const handleSimulateFile = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={assignment.title}
      subtitle={`${assignment.courseName} • Due: ${assignment.dueDate} • ${assignment.marks} Marks`}
      maxWidth="680px"
    >
      {isSubmittedSuccess ? (
        <div className="asg-modal-success">
          <div className="asg-modal-success-orb">
            <CheckCircle2 size={40} />
          </div>

          <h3 className="asg-modal-success-title">
            Assignment Submitted!
          </h3>

          <p className="asg-modal-success-desc">
            Your coursework has been cryptographically uploaded and timestamped. Your instructor will grade and provide feedback shortly.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {/* Assignment Description */}
          <div style={{ marginBottom: '20px' }}>
            <h4 className="asg-section-title">
              Assignment Brief
            </h4>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              {assignment.description}
            </p>
          </div>

          {/* Instructions List */}
          {assignment.instructions && (
            <div className="asg-instructions-box">
              <h4 style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: '10px', color: 'var(--text-primary)' }}>
                Submission Instructions & Requirements
              </h4>
              <ul style={{ paddingLeft: '20px', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.7' }}>
                {assignment.instructions.map((inst, idx) => (
                  <li key={idx}>{inst}</li>
                ))}
              </ul>
            </div>
          )}

          {/* If already submitted / graded */}
          {assignment.status === 'Graded' && (
            <div className="asg-graded-banner">
              <div>
                <span style={{ fontSize: '0.82rem', color: 'var(--emerald-accent)', fontWeight: 700 }}>
                  GRADED BY INSTRUCTOR
                </span>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', marginTop: '4px' }}>
                  {assignment.feedback || 'Excellent work! Demonstrated clear conceptual mastery.'}
                </p>
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--emerald-accent)' }}>
                {assignment.grade} / {assignment.marks}
              </div>
            </div>
          )}

          {/* Solution Editor / Input Area */}
          <div style={{ marginBottom: '20px' }}>
            <label className="form-label" style={{ color: 'var(--text-primary)' }}>
              Your Solution (Source Code / Explanation / Repository URL)
            </label>
            <textarea
              rows={6}
              value={submissionText}
              onChange={(e) => setSubmissionText(e.target.value)}
              placeholder="Paste your source code, GitHub repository link, or written analysis here..."
              disabled={assignment.status === 'Graded'}
              className="asg-editor-textarea"
            />
          </div>

          {/* File Attachment Simulator */}
          <div style={{ marginBottom: '28px' }}>
            <label className="form-label" style={{ color: 'var(--text-primary)' }}>
              Attach Project Files or ZIP Archive
            </label>
            <label className="asg-file-drop" style={{ display: 'block' }}>
              <input
                type="file"
                onChange={handleSimulateFile}
                disabled={assignment.status === 'Graded'}
                style={{ display: 'none' }}
              />
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <Upload size={24} color="var(--electric-violet)" />
                <span style={{ fontSize: '0.88rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                  {fileName ? `Attached: ${fileName}` : 'Click to browse files or drag and drop here'}
                </span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Supports .zip, .js, .py, .pdf, .docx (Max size 50MB)
                </span>
              </div>
            </label>
          </div>

          {/* Modal Actions */}
          <div className="asg-actions">
            <button
              type="button"
              onClick={onClose}
              className="glass-btn"
              style={{ padding: '9px 18px', fontSize: '0.9rem' }}
            >
              Cancel
            </button>

            {assignment.status !== 'Graded' && (
              <button
                type="submit"
                className="gradient-border-btn"
                style={{ padding: '9px 24px', fontSize: '0.9rem' }}
              >
                <span>Submit Assignment</span>
                <ArrowRight size={16} />
              </button>
            )}
          </div>
        </form>
      )}
    </Modal>
  );
}
