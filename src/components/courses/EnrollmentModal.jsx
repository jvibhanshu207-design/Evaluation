import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import Modal from '../common/Modal';
import './EnrollmentModal.css';

export default function EnrollmentModal({ isOpen, onClose, course }) {
  const navigate = useNavigate();

  if (!course) return null;

  const handleStartLearning = () => {
    onClose();
    navigate(`/learn/${course.id}`);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="480px">
      <div className="enroll-modal-body">
        {/* Animated Celebration Icon */}
        <div className="enroll-celebration-orb">
          <Sparkles size={40} />
        </div>

        <span className="enroll-tag">
          ✨ Welcome to LearnSphere!
        </span>

        <h2 className="enroll-heading">
          You are now enrolled in:
        </h2>

        <div className="enroll-course-box">
          <h3 className="enroll-course-title gradient-text">
            {course.title}
          </h3>
        </div>

        <p className="enroll-desc">
          Your learning journey begins now. Complete modules, follow high-definition YouTube video lessons, track your progress, and earn an official verifiable certificate!
        </p>

        <button
          onClick={handleStartLearning}
          className="gradient-border-btn enroll-btn"
        >
          <span>Start Learning</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </Modal>
  );
}
