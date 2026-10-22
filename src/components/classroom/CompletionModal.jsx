import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { Trophy, Award } from 'lucide-react';
import Modal from '../common/Modal';
import { useAuth } from '../../context/AuthContext';
import { sound } from '../../utils/sound';
import './CompletionModal.css';

export default function CompletionModal({ isOpen, onClose, course, stats, onOpenCertificate }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      sound.playFanfare();

      // Trigger Confetti Cannon
      const count = 200;
      const defaults = {
        origin: { y: 0.7 }
      };

      function fire(particleRatio, opts) {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio)
        });
      }

      fire(0.25, {
        spread: 26,
        startVelocity: 55
      });
      fire(0.2, {
        spread: 60
      });
      fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8
      });
      fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2
      });
      fire(0.1, {
        spread: 120,
        startVelocity: 45
      });
    }
  }, [isOpen]);

  if (!course) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="580px">
      <div className="completion-modal-body">
        {/* Animated Trophy Banner */}
        <div className="completion-trophy-orb">
          <Trophy size={48} color="#FFFFFF" />
        </div>

        <span className="completion-tag">
          🎉 Course Completed!
        </span>

        <h2 className="completion-title">
          Congratulations, {user?.name || 'Vibhanshu'}!
        </h2>

        <p className="completion-subtext">
          You have successfully mastered every module in{' '}
          <strong style={{ color: 'var(--text-primary)' }}>{course.title}</strong>
        </p>

        {/* 4 Stat Badges */}
        <div className="completion-stats-grid">
          <div className="completion-stat-card emerald">
            <div className="completion-stat-val" style={{ color: 'var(--emerald-accent)' }}>
              100%
            </div>
            <div className="completion-stat-label">Completed</div>
          </div>

          <div className="completion-stat-card cyan">
            <div className="completion-stat-val" style={{ color: 'var(--cyan-accent)' }}>
              {stats?.totalLessons || 10} / {stats?.totalLessons || 10}
            </div>
            <div className="completion-stat-label">Lessons Done</div>
          </div>

          <div className="completion-stat-card purple">
            <div className="completion-stat-val" style={{ color: 'var(--electric-violet)' }}>
              {course.duration || '18.5h'}
            </div>
            <div className="completion-stat-label">Watch Time</div>
          </div>

          <div className="completion-stat-card amber">
            <div className="completion-stat-val" style={{ color: '#FBBF24' }}>
              94%
            </div>
            <div className="completion-stat-label">Quiz Score</div>
          </div>
        </div>

        {/* Certificate Unlocked Banner */}
        <div className="completion-cert-banner">
          <div className="completion-cert-left">
            <div className="completion-cert-icon">
              <Award size={26} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.98rem', color: 'var(--text-primary)' }}>
                Official Certificate Unlocked 🎓
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Verifiable digital credential with tamper-proof security hash.
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="completion-actions">
          <button
            onClick={() => {
              onClose();
              if (onOpenCertificate) onOpenCertificate();
            }}
            className="gradient-border-btn"
            style={{ flex: 1, justifyContent: 'center', padding: '12px', fontSize: '0.96rem' }}
          >
            <Award size={18} />
            <span>View Certificate</span>
          </button>

          <button
            onClick={onClose}
            className="glass-btn"
            style={{ padding: '12px 20px', fontSize: '0.96rem' }}
          >
            <span>Back to Course</span>
          </button>
        </div>
      </div>
    </Modal>
  );
}
