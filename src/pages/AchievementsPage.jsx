import React, { useState } from 'react';
import {
  Award,
  Trophy,
  Flame,
  Target,
  BookOpen,
  Zap,
  Star,
  FileEdit,
  Rocket,
  Lock,
  CheckCircle2,
  Sparkles,
  Users,
  Crown,
  Medal,
  ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DEMO_ACHIEVEMENTS } from '../data/demoAchievements';
import { STORAGE_KEYS, getStoredData, setStoredData } from '../utils/storage';
import ProgressBar from '../components/common/ProgressBar';
import { sound } from '../utils/sound';

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState(() =>
    getStoredData(STORAGE_KEYS.ACHIEVEMENTS, DEMO_ACHIEVEMENTS)
  );
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'unlocked' | 'locked'
  const [activeTab, setActiveTab] = useState('badges'); // 'badges' | 'leaderboard'
  const [totalXP, setTotalXP] = useState(() => {
    return parseInt(localStorage.getItem('learnsphere_user_xp') || '4850', 10);
  });
  const [claimedMap, setClaimedMap] = useState(() => {
    return JSON.parse(localStorage.getItem('learnsphere_claimed_badges') || '{}');
  });

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  const handleClaimReward = (achId, xpReward = 150) => {
    sound.playFanfare();
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 }
    });

    const newTotal = totalXP + xpReward;
    const newClaimed = { ...claimedMap, [achId]: true };

    setTotalXP(newTotal);
    setClaimedMap(newClaimed);

    localStorage.setItem('learnsphere_user_xp', newTotal.toString());
    localStorage.setItem('learnsphere_claimed_badges', JSON.stringify(newClaimed));
  };

  const getIcon = (iconName) => {
    switch (iconName) {
      case 'Trophy':
        return <Trophy size={28} />;
      case 'Flame':
        return <Flame size={28} />;
      case 'Target':
        return <Target size={28} />;
      case 'BookOpen':
        return <BookOpen size={28} />;
      case 'Zap':
        return <Zap size={28} />;
      case 'Star':
        return <Star size={28} />;
      case 'FileEdit':
        return <FileEdit size={28} />;
      case 'Rocket':
      default:
        return <Rocket size={28} />;
    }
  };

  // Global Cohort Leaderboard Data
  const LEADERBOARD_STUDENTS = [
    { rank: 1, name: 'Elena Rostova', title: 'Deep Learning Fellow', xp: 8420, streak: 34, badges: 14, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80' },
    { rank: 2, name: 'Marcus Chen', title: 'Systems Architect', xp: 7650, streak: 28, badges: 12, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80' },
    { rank: 3, name: 'Aaliyah Patel', title: 'DSA Grandmaster', xp: 6890, streak: 21, badges: 11, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80' },
    { rank: 4, name: 'Vibhanshu (You)', title: 'Algorithm Alchemist', xp: totalXP, streak: 14, badges: unlockedCount, isCurrentUser: true, avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80' },
    { rank: 5, name: 'Lucas Dubois', title: 'Frontend Engineer', xp: 4620, streak: 12, badges: 8, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80' },
    { rank: 6, name: 'Sophia Miller', title: 'Cloud Specialist', xp: 4180, streak: 9, badges: 7, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&auto=format&fit=crop&q=80' },
    { rank: 7, name: 'Jin-Woo Park', title: 'Fullstack Explorer', xp: 3940, streak: 8, badges: 6, avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80' }
  ];

  const filteredAchievements = achievements.filter((a) => {
    if (activeFilter === 'unlocked') return a.unlocked;
    if (activeFilter === 'locked') return !a.unlocked;
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      {/* Header Banner */}
      <div
        className="glass-panel"
        style={{
          padding: '32px',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px'
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-50px',
            right: '15%',
            width: '280px',
            height: '280px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(251, 191, 36, 0.2) 0%, transparent 70%)',
            filter: 'blur(50px)',
            pointerEvents: 'none'
          }}
        />

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <Award size={20} color="#FBBF24" />
            <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#FBBF24', textTransform: 'uppercase' }}>
              Academic Gamification & Honors
            </span>
          </div>

          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.3rem', fontWeight: 800 }}>
            Achievements & Leaderboard
          </h1>

          <p style={{ color: 'var(--text-secondary)', maxWidth: '640px', fontSize: '0.96rem' }}>
            Earn XP, unlock holographic badges by conquering courses, and rank on the global cohort leaderboard.
          </p>
        </div>

        {/* Level & XP Capsule */}
        <div
          style={{
            padding: '18px 24px',
            borderRadius: 'var(--radius-lg)',
            backgroundColor: 'rgba(251, 191, 36, 0.12)',
            border: '1px solid rgba(251, 191, 36, 0.35)',
            display: 'flex',
            alignItems: 'center',
            gap: '18px'
          }}
        >
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #F59E0B, #FBBF24)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(245, 158, 11, 0.5)'
            }}
          >
            <Crown size={28} color="#FFFFFF" />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.78rem', color: '#FBBF24', fontWeight: 800, textTransform: 'uppercase' }}>
                LEVEL 8 • ALGORITHM ALCHEMIST
              </span>
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#FFFFFF', lineHeight: 1.1 }}>
              {totalXP.toLocaleString()} <span style={{ fontSize: '0.9rem', color: '#FBBF24' }}>XP</span>
            </div>
            <div style={{ width: '140px', marginTop: '6px' }}>
              <ProgressBar
                progress={((totalXP % 1000) / 1000) * 100}
                height={5}
                colorGradient="linear-gradient(90deg, #F59E0B, #FBBF24)"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Switcher: Badges vs Leaderboard */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div
          style={{
            display: 'flex',
            gap: '6px',
            padding: '4px',
            borderRadius: '9999px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--border-subtle)'
          }}
        >
          <button
            onClick={() => { sound.playClick(); setActiveTab('badges'); }}
            style={{
              padding: '8px 20px',
              borderRadius: '9999px',
              border: 'none',
              backgroundColor: activeTab === 'badges' ? 'var(--primary-purple)' : 'transparent',
              color: activeTab === 'badges' ? '#FFFFFF' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.86rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Award size={15} />
            <span>Badges & Milestones ({unlockedCount}/{achievements.length})</span>
          </button>

          <button
            onClick={() => { sound.playClick(); setActiveTab('leaderboard'); }}
            style={{
              padding: '8px 20px',
              borderRadius: '9999px',
              border: 'none',
              backgroundColor: activeTab === 'leaderboard' ? 'var(--primary-purple)' : 'transparent',
              color: activeTab === 'leaderboard' ? '#FFFFFF' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.86rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Users size={15} />
            <span>Cohort Leaderboard 🏆</span>
          </button>
        </div>

        {activeTab === 'badges' && (
          <div style={{ display: 'flex', gap: '8px' }}>
            {['all', 'unlocked', 'locked'].map((f) => (
              <button
                key={f}
                onClick={() => { sound.playClick(); setActiveFilter(f); }}
                className="glass-btn"
                style={{
                  padding: '6px 14px',
                  fontSize: '0.8rem',
                  borderColor: activeFilter === f ? 'var(--cyan-accent)' : undefined,
                  color: activeFilter === f ? 'var(--cyan-accent)' : undefined,
                  textTransform: 'capitalize'
                }}
              >
                {f}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ================= TAB 1: BADGES GRID ================= */}
      {activeTab === 'badges' && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '20px'
          }}
        >
          {filteredAchievements.map((ach) => {
            const isUnlocked = ach.unlocked;
            const isClaimed = claimedMap[ach.id];

            return (
              <div
                key={ach.id}
                className="glass-panel"
                style={{
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative',
                  overflow: 'hidden',
                  backgroundColor: isUnlocked ? 'var(--bg-glass)' : 'rgba(16, 21, 42, 0.4)',
                  border: isUnlocked
                    ? '1px solid rgba(251, 191, 36, 0.35)'
                    : '1px solid var(--border-subtle)',
                  boxShadow: isUnlocked ? '0 10px 30px rgba(251, 191, 36, 0.1)' : 'none',
                  opacity: isUnlocked ? 1 : 0.7
                }}
              >
                <div>
                  {/* Top Row: Icon & Status */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '16px'
                    }}
                  >
                    <div
                      style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '16px',
                        background: isUnlocked
                          ? 'linear-gradient(135deg, rgba(251, 191, 36, 0.25), rgba(244, 114, 182, 0.25))'
                          : 'rgba(255, 255, 255, 0.05)',
                        border: `1.5px solid ${isUnlocked ? '#FBBF24' : 'var(--card-border)'}`,
                        color: isUnlocked ? '#FBBF24' : 'var(--text-muted)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: isUnlocked ? '0 0 20px rgba(251, 191, 36, 0.3)' : 'none'
                      }}
                    >
                      {getIcon(ach.icon)}
                    </div>

                    <span
                      style={{
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        padding: '3px 10px',
                        borderRadius: '9999px',
                        backgroundColor: isUnlocked
                          ? 'rgba(52, 211, 153, 0.15)'
                          : 'rgba(255, 255, 255, 0.06)',
                        color: isUnlocked ? 'var(--emerald-accent)' : 'var(--text-muted)',
                        border: `1px solid ${isUnlocked ? 'rgba(52, 211, 153, 0.3)' : 'var(--card-border)'}`,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      {isUnlocked ? (
                        <>
                          <CheckCircle2 size={12} />
                          <span>Unlocked</span>
                        </>
                      ) : (
                        <>
                          <Lock size={12} />
                          <span>Locked</span>
                        </>
                      )}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3
                    style={{
                      fontSize: '1.2rem',
                      fontWeight: 700,
                      marginBottom: '6px',
                      color: isUnlocked ? 'var(--text-primary)' : 'var(--text-secondary)'
                    }}
                  >
                    {ach.title}
                  </h3>

                  <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '16px' }}>
                    {ach.description}
                  </p>
                </div>

                {/* Progress or Unlocked Date + Claim Button */}
                <div style={{ paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
                  {isUnlocked ? (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        Awarded on <strong style={{ color: '#FBBF24' }}>{ach.unlockedDate || 'October 2026'}</strong>
                      </div>

                      {!isClaimed ? (
                        <button
                          onClick={() => handleClaimReward(ach.id, 150)}
                          className="gradient-border-btn"
                          style={{ padding: '5px 12px', fontSize: '0.76rem' }}
                        >
                          <Sparkles size={12} />
                          <span>Claim +150 XP</span>
                        </button>
                      ) : (
                        <span style={{ fontSize: '0.74rem', color: 'var(--emerald-accent)', fontWeight: 700 }}>
                          ✓ Claimed
                        </span>
                      )}
                    </div>
                  ) : (
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                        <span>Progress</span>
                        <span>{ach.progressText || `${ach.progress}/${ach.maxProgress}`}</span>
                      </div>
                      <ProgressBar
                        progress={(ach.progress / (ach.maxProgress || 1)) * 100}
                        height={5}
                        colorGradient="linear-gradient(90deg, #8B5CF6, #FBBF24)"
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ================= TAB 2: COHORT LEADERBOARD ================= */}
      {activeTab === 'leaderboard' && (
        <div className="glass-panel" style={{ padding: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800 }}>
                Autumn 2026 Global Cohort Leaderboard
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                Ranks update dynamically based on lesson completions, assignment scores, and active daily streaks.
              </p>
            </div>

            <div
              style={{
                padding: '6px 14px',
                borderRadius: '9999px',
                backgroundColor: 'rgba(34, 211, 238, 0.12)',
                border: '1px solid rgba(34, 211, 238, 0.3)',
                color: 'var(--cyan-accent)',
                fontSize: '0.82rem',
                fontWeight: 700
              }}
            >
              Your Rank: #4 (Top 5%)
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {LEADERBOARD_STUDENTS.map((s) => {
              const isFirst = s.rank === 1;
              const isSecond = s.rank === 2;
              const isThird = s.rank === 3;
              const isCurrent = s.isCurrentUser;

              return (
                <div
                  key={s.rank}
                  style={{
                    padding: '16px 20px',
                    borderRadius: 'var(--radius-lg)',
                    backgroundColor: isCurrent
                      ? 'rgba(139, 92, 246, 0.18)'
                      : 'rgba(255, 255, 255, 0.03)',
                    border: `1px solid ${isCurrent ? 'rgba(167, 139, 250, 0.45)' : 'var(--border-subtle)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '14px',
                    boxShadow: isCurrent ? '0 0 25px rgba(139, 92, 246, 0.25)' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    {/* Rank Medal */}
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        backgroundColor: isFirst
                          ? 'rgba(251, 191, 36, 0.2)'
                          : isSecond
                          ? 'rgba(226, 232, 240, 0.2)'
                          : isThird
                          ? 'rgba(217, 119, 6, 0.2)'
                          : 'rgba(255, 255, 255, 0.05)',
                        border: `1px solid ${
                          isFirst
                            ? '#FBBF24'
                            : isSecond
                            ? '#E2E8F0'
                            : isThird
                            ? '#D97706'
                            : 'var(--card-border)'
                        }`,
                        color: isFirst
                          ? '#FBBF24'
                          : isSecond
                          ? '#E2E8F0'
                          : isThird
                          ? '#D97706'
                          : 'var(--text-muted)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 900,
                        fontSize: '0.9rem'
                      }}
                    >
                      {isFirst ? '🥇' : isSecond ? '🥈' : isThird ? '🥉' : `#${s.rank}`}
                    </div>

                    {/* Student Info */}
                    <img
                      src={s.avatar}
                      alt={s.name}
                      style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover', border: '1px solid rgba(255, 255, 255, 0.2)' }}
                    />

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 800, fontSize: '0.98rem', color: isCurrent ? 'var(--cyan-accent)' : '#FFFFFF' }}>
                          {s.name}
                        </span>
                        {isCurrent && (
                          <span style={{ fontSize: '0.68rem', padding: '1px 6px', borderRadius: '4px', backgroundColor: 'var(--primary-purple)', color: 'white', fontWeight: 800 }}>
                            YOU
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                        {s.title}
                      </div>
                    </div>
                  </div>

                  {/* Stats on Right */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#FBBF24', fontSize: '0.84rem', fontWeight: 700 }}>
                      <Flame size={16} fill="#FBBF24" />
                      <span>{s.streak} Days</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--cyan-accent)', fontSize: '0.84rem', fontWeight: 700 }}>
                      <Award size={16} />
                      <span>{s.badges} Badges</span>
                    </div>

                    <div style={{ textAlign: 'right', minWidth: '90px' }}>
                      <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#FFFFFF' }}>
                        {s.xp.toLocaleString()} <span style={{ fontSize: '0.75rem', color: '#FBBF24' }}>XP</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
