import React, { useState } from 'react';
import {
  User,
  Mail,
  GraduationCap,
  Calendar,
  Award,
  Flame,
  CheckCircle2,
  Edit2,
  Save,
  Clock,
  BookOpen,
  ShieldCheck,
  Printer
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCourses } from '../context/CourseContext';
import CertificateModal from '../components/certificate/CertificateModal';
import { sound } from '../utils/sound';
import { usePayment } from '../context/PaymentContext';
import { Receipt, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const { enrolledCourses } = useCourses();
  const { transactions } = usePayment();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || 'Vibhanshu Jain');
  const [email, setEmail] = useState(user?.email || 'vibhanshu@learnsphere.edu');
  const [branch, setBranch] = useState(user?.branch || 'Computer Science & Engineering');
  const [semester, setSemester] = useState(user?.semester || '6th Semester');
  const [bio, setBio] = useState(user?.bio || 'Passionate full-stack developer and computer science scholar.');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [selectedCertCourse, setSelectedCertCourse] = useState(null);

  const completedCourses = enrolledCourses.filter((c) => c.stats.isCompleted);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    sound.playClick();
    updateProfile({
      name,
      email,
      branch,
      semester,
      bio
    });
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      {/* Profile Header Card */}
      <div
        className="glass-panel"
        style={{
          padding: '36px',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '24px'
        }}
      >
        {/* Glow */}
        <div
          style={{
            position: 'absolute',
            top: '-60px',
            right: '10%',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.25) 0%, transparent 70%)',
            filter: 'blur(50px)',
            pointerEvents: 'none'
          }}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
          {/* Avatar with status ring */}
          <div style={{ position: 'relative' }}>
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'}
              alt={user?.name || 'Vibhanshu'}
              style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '3px solid var(--electric-violet)',
                boxShadow: '0 0 25px rgba(139, 92, 246, 0.5)'
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: '4px',
                right: '4px',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                backgroundColor: 'var(--emerald-accent)',
                border: '3px solid var(--bg-secondary)',
                boxShadow: '0 0 10px var(--emerald-accent)'
              }}
              title="Online Active Learner"
            />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: 800 }}>
                {user?.name || 'Vibhanshu Jain'}
              </h1>
              <span
                style={{
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  padding: '3px 10px',
                  borderRadius: '9999px',
                  backgroundColor: 'rgba(34, 211, 238, 0.15)',
                  border: '1px solid rgba(34, 211, 238, 0.35)',
                  color: 'var(--cyan-accent)'
                }}
              >
                {user?.studentId || 'STU-2026-8849'}
              </span>
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.96rem', marginBottom: '8px' }}>
              {user?.branch} • {user?.semester}
            </p>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem', maxWidth: '520px', lineHeight: '1.5' }}>
              {user?.bio}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className={isEditing ? 'glass-btn' : 'gradient-border-btn'}
          style={{ padding: '10px 22px' }}
        >
          <Edit2 size={16} />
          <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
        </button>
      </div>

      {savedSuccess && (
        <div
          style={{
            padding: '12px 20px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'rgba(52, 211, 153, 0.15)',
            border: '1px solid var(--emerald-accent)',
            color: 'var(--emerald-accent)',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <CheckCircle2 size={18} />
          <span>Profile changes successfully synchronized and saved to LocalStorage!</span>
        </div>
      )}

      {/* Profile Edit Form if isEditing */}
      {isEditing && (
        <div className="glass-panel" style={{ padding: '28px' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '20px' }}>
            Edit Student Details
          </h3>
          <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, marginBottom: '6px' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'rgba(0, 0, 0, 0.25)',
                    border: '1px solid var(--card-border)',
                    color: 'var(--text-primary)',
                    fontSize: '0.9rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, marginBottom: '6px' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'rgba(0, 0, 0, 0.25)',
                    border: '1px solid var(--card-border)',
                    color: 'var(--text-primary)',
                    fontSize: '0.9rem'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, marginBottom: '6px' }}>
                  Branch / Specialization
                </label>
                <input
                  type="text"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'rgba(0, 0, 0, 0.25)',
                    border: '1px solid var(--card-border)',
                    color: 'var(--text-primary)',
                    fontSize: '0.9rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, marginBottom: '6px' }}>
                  Current Semester
                </label>
                <input
                  type="text"
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'rgba(0, 0, 0, 0.25)',
                    border: '1px solid var(--card-border)',
                    color: 'var(--text-primary)',
                    fontSize: '0.9rem'
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, marginBottom: '6px' }}>
                Academic Bio & Goals
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'rgba(0, 0, 0, 0.25)',
                  border: '1px solid var(--card-border)',
                  color: 'var(--text-primary)',
                  fontSize: '0.9rem',
                  resize: 'vertical'
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="glass-btn"
                style={{ padding: '9px 18px' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="gradient-border-btn"
                style={{ padding: '9px 24px' }}
              >
                <Save size={16} />
                <span>Save Profile</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 4 Academic Summary Counters */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '18px'
        }}
      >
        <div className="glass-panel" style={{ padding: '22px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '6px' }}>
            Registered Courses
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {enrolledCourses.length} Courses
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--cyan-accent)', marginTop: '4px' }}>
            All Active & Synced
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '22px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '6px' }}>
            Learning Streak
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#FBBF24' }}>
            7 Days 🔥
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Top 10% Consistency
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '22px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '6px' }}>
            Cumulative GPA
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--emerald-accent)' }}>
            4.8 / 5.0
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--emerald-accent)', marginTop: '4px' }}>
            First Class with Distinction
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '22px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '6px' }}>
            Certificates Earned
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--electric-violet)' }}>
            {completedCourses.length > 0 ? `${completedCourses.length} Official` : 'In Progress'}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Verifiable Credentials
          </div>
        </div>
      </div>

      {/* Earned Certificates Showcase */}
      <div className="glass-panel" style={{ padding: '30px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Award size={20} color="#FBBF24" />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Earned Certificates</h3>
          </div>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            100% course completion required
          </span>
        </div>

        {completedCourses.length === 0 ? (
          <div
            style={{
              padding: '40px 20px',
              textAlign: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              borderRadius: 'var(--radius-md)',
              border: '1px dashed var(--card-border)'
            }}
          >
            <Award size={36} color="var(--text-muted)" style={{ margin: '0 auto 12px auto' }} />
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
              No Certificates Earned Yet
            </h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '460px', margin: '0 auto 18px auto' }}>
              Once you finish 100% of all lessons in any course (such as React 19 or Java), your official signed certificate of completion will unlock here immediately!
            </p>
            <button
              onClick={() => {
                // Quick demonstration unlock for React course
                const reactCourse = enrolledCourses.find((c) => c.id === 'react-development');
                if (reactCourse) {
                  setSelectedCertCourse(reactCourse);
                }
              }}
              className="glass-btn"
              style={{ fontSize: '0.84rem', padding: '8px 16px' }}
            >
              <span>Preview Official Certificate Template</span>
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
            {completedCourses.map((c) => (
              <div
                key={c.id}
                style={{
                  padding: '20px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'rgba(245, 158, 11, 0.08)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '14px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#FBBF24', fontSize: '0.8rem', fontWeight: 700, marginBottom: '6px' }}>
                    <ShieldCheck size={16} />
                    <span>VERIFIED CREDENTIAL</span>
                  </div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {c.title}
                  </h4>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    Instructor: {c.instructor.name}
                  </div>
                </div>

                <button
                  onClick={() => setSelectedCertCourse(c)}
                  className="gradient-border-btn"
                  style={{ padding: '8px 14px', fontSize: '0.84rem', justifyContent: 'center' }}
                >
                  <Award size={15} />
                  <span>View & Print Certificate</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Demonstration Transaction & Payment History */}
      <div className="glass-panel" style={{ padding: '30px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Receipt size={20} color="var(--cyan-accent)" />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Demo Payment & Enrollment History</h3>
          </div>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Simulated demonstration transactions ({(transactions || []).length})
          </span>
        </div>

        {(!transactions || transactions.length === 0) ? (
          <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            No transactions recorded yet. Enroll in paid courses through Checkout to see records here.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {transactions.map((txn) => {
              const isCompleted = txn.status === 'Completed';
              const isFailed = txn.status === 'Failed';
              return (
                <div
                  key={txn.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px 20px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--card-border)',
                    flexWrap: 'wrap',
                    gap: '12px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '50%',
                        backgroundColor: isCompleted
                          ? 'rgba(16, 185, 129, 0.15)'
                          : isFailed
                          ? 'rgba(239, 68, 68, 0.15)'
                          : 'rgba(255, 255, 255, 0.08)',
                        color: isCompleted
                          ? 'var(--emerald-accent)'
                          : isFailed
                          ? 'var(--rose-accent)'
                          : 'var(--text-secondary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      {isCompleted ? <CheckCircle2 size={20} /> : <Receipt size={20} />}
                    </div>

                    <div>
                      <div style={{ fontSize: '0.96rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {txn.courseTitle}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{ fontFamily: 'var(--font-mono, monospace)', color: 'var(--cyan-accent)' }}>
                          {txn.id}
                        </span>
                        <span>•</span>
                        <span>{txn.paymentMethodLabel || txn.paymentMethod}</span>
                        <span>•</span>
                        <span>{new Date(txn.timestamp).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                        ${typeof txn.amount === 'number' ? txn.amount.toFixed(2) : txn.amount} USD
                      </div>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '9999px',
                          backgroundColor: isCompleted
                            ? 'rgba(16, 185, 129, 0.15)'
                            : isFailed
                            ? 'rgba(239, 68, 68, 0.15)'
                            : 'rgba(255, 255, 255, 0.1)',
                          color: isCompleted
                            ? 'var(--emerald-accent)'
                            : isFailed
                            ? 'var(--rose-accent)'
                            : 'var(--text-muted)'
                        }}
                      >
                        {txn.status}
                      </span>
                    </div>

                    {isCompleted ? (
                      <Link
                        to={`/learn/${txn.courseId}`}
                        className="glass-btn"
                        style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                      >
                        <span>Open Course</span>
                        <ExternalLink size={13} />
                      </Link>
                    ) : (
                      <Link
                        to={`/checkout/${txn.courseId}`}
                        className="glass-btn"
                        style={{ padding: '6px 12px', fontSize: '0.8rem', color: 'var(--rose-accent)' }}
                      >
                        <span>Retry</span>
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Certificate Modal */}
      {selectedCertCourse && (
        <CertificateModal
          isOpen={!!selectedCertCourse}
          onClose={() => setSelectedCertCourse(null)}
          course={selectedCertCourse}
        />
      )}
    </div>
  );
}
