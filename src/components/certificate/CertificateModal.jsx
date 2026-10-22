import React, { useRef } from 'react';
import { Printer, Award, ShieldCheck, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Modal from '../common/Modal';
import './CertificateModal.css';

export default function CertificateModal({ isOpen, onClose, course }) {
  const { user } = useAuth();
  const certificateRef = useRef(null);

  if (!course) return null;

  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const certId = `LS-${course.id.substring(0, 4).toUpperCase()}-2026-${Math.floor(1000 + Math.random() * 9000)}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="820px">
      <div>
        {/* Certificate Container Styled for Screen & Print */}
        <div
          ref={certificateRef}
          className="certificate-document"
        >
          {/* Ornate Inner Border */}
          <div className="cert-inner-border" />

          {/* Gold Decorative Corner Badges */}
          <div className="cert-corner-star top-left">✦</div>
          <div className="cert-corner-star top-right">✦</div>
          <div className="cert-corner-star bottom-left">✦</div>
          <div className="cert-corner-star bottom-right">✦</div>

          {/* Header & Logo */}
          <div className="cert-header">
            <div className="cert-logo-box">
              <div className="cert-logo-icon">
                <Sparkles size={18} color="white" />
              </div>
              <span className="cert-logo-text">
                LEARNSPHERE
              </span>
            </div>

            <span className="cert-tagline">
              Academic Excellence & Master Credential
            </span>
          </div>

          <p className="cert-presents">This certifies that</p>

          <h1 className="cert-student-name">
            {user?.name || 'Vibhanshu Jain'}
          </h1>

          <p className="cert-fulfillment-text">
            has fulfilled all comprehensive course requirements, coding projects, and comprehensive evaluations to graduate with distinction in
          </p>

          <h2 className="cert-course-title">
            {course.title}
          </h2>

          {/* Signatures & Seal */}
          <div className="cert-signatures">
            <div className="cert-sig-block">
              <div className="cert-sig-line" />
              <div className="cert-sig-name">{course.instructor.name}</div>
              <div className="cert-sig-role">Lead Instructor & Mentor</div>
            </div>

            {/* Embossed Gold Seal */}
            <div className="cert-seal">
              <Award size={36} />
            </div>

            <div className="cert-sig-block">
              <div className="cert-sig-line" />
              <div className="cert-sig-name">Dr. Sarah Vance</div>
              <div className="cert-sig-role">Dean of Academic Affairs</div>
            </div>
          </div>

          {/* Verification Details Footer */}
          <div className="cert-meta-footer">
            <span>Certificate ID: <strong style={{ color: '#E2E8F0' }}>{certId}</strong></span>
            <span>Completion Date: <strong style={{ color: '#E2E8F0' }}>{currentDate}</strong></span>
            <span>Course Completion: <strong style={{ color: '#34D399' }}>100% Verified</strong></span>
            <span>Security Hash: <strong style={{ color: '#E2E8F0' }}>SHA256-{course.id.substring(0, 6)}</strong></span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="cert-modal-actions">
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '0.84rem' }}>
            <ShieldCheck size={16} color="var(--emerald-accent)" />
            <span>Cryptographically sealed & ready for printing / portfolio attachment</span>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={handlePrint}
              className="gradient-border-btn"
              style={{ padding: '9px 18px', fontSize: '0.9rem' }}
            >
              <Printer size={16} />
              <span>Print / Download Certificate</span>
            </button>

            <button
              onClick={onClose}
              className="glass-btn"
              style={{ padding: '9px 18px', fontSize: '0.9rem' }}
            >
              <span>Close</span>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
