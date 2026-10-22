import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Brain,
  Sparkles,
  Target,
  Layers,
  ArrowRight,
  RotateCw,
  CheckCircle2,
  AlertTriangle,
  Zap,
  BookOpen,
  Award,
  ChevronRight,
  TrendingUp,
  HelpCircle,
  Play
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../utils/sound';

export default function SmartLearningPage() {
  const [activeTab, setActiveTab] = useState('flashcards'); // 'path' | 'weakTopics' | 'flashcards' | 'adaptiveQuiz'

  // ================= 1. FLASHCARDS & SPACED REPETITION DATA =================
  const FLASHCARD_DECKS = [
    {
      id: 'java-oop',
      title: 'Java Architecture & OOP',
      cards: [
        {
          id: 1,
          question: 'What is the dynamic dispatch mechanism in Java and how does the JVM implement it?',
          answer: 'Dynamic method dispatch is runtime polymorphism. The JVM maintains a Virtual Method Table (vtable) per loaded class. When an overridden method is invoked on a superclass reference, the JVM dereferences the object\'s actual class vtable to execute the right implementation in O(1) time.',
          topic: 'Object-Oriented Architecture',
          difficulty: 'Medium'
        },
        {
          id: 2,
          question: 'Explain the difference between HashMap bucket collision resolution before and after Java 8.',
          answer: 'Before Java 8, collisions were resolved strictly using a singly linked list (worst-case O(N) lookup). Since Java 8, once the bucket threshold TREEIFY_THRESHOLD (8 entries) is breached and table capacity ≥ 64, the linked list transforms into a balanced Red-Black Tree, improving lookup to O(log N).',
          topic: 'Collections Framework',
          difficulty: 'Hard'
        },
        {
          id: 3,
          question: 'Why does ConcurrentHashMap not allow null keys or values, unlike standard HashMap?',
          answer: 'To prevent ambiguous concurrency races! In concurrent multithreaded environments, if map.get(key) returned null, you could not distinguish whether the key was mapped to null or not present at all, and containsKey(key) could change before the check finishes.',
          topic: 'Concurrency & Memory',
          difficulty: 'Hard'
        },
        {
          id: 4,
          question: 'What is the contract between equals() and hashCode() in Java?',
          answer: 'If two objects are equal according to equals(Object), calling hashCode() on each must produce the exact same integer value. The reverse is not required: unequal objects may produce hash collisions.',
          topic: 'Core Fundamentals',
          difficulty: 'Easy'
        }
      ]
    },
    {
      id: 'dsa-core',
      title: 'Data Structures & Algorithms',
      cards: [
        {
          id: 5,
          question: 'When should you use Dijkstra vs. Bellman-Ford algorithm for shortest paths?',
          answer: 'Use Dijkstra when all edge weights are strictly non-negative (runs in O((V + E) log V) with a Min-Heap). Use Bellman-Ford when edge weights can be negative, or when detecting negative-weight cycles (runs in O(V * E)).',
          topic: 'Graph Algorithms',
          difficulty: 'Medium'
        },
        {
          id: 6,
          question: 'What invariant defines a Max-Heap binary tree?',
          answer: 'In a Max-Heap, for every node i other than root, A[Parent(i)] ≥ A[i]. The largest element is always at the root node (index 0). It is a complete binary tree.',
          topic: 'Heaps & Priority Queues',
          difficulty: 'Easy'
        }
      ]
    }
  ];

  const [selectedDeckId, setSelectedDeckId] = useState('java-oop');
  const activeDeck = FLASHCARD_DECKS.find((d) => d.id === selectedDeckId) || FLASHCARD_DECKS[0];
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [cardsMastered, setCardsMastered] = useState(4);
  const [reviewHistory, setReviewHistory] = useState({});

  const currentCard = activeDeck.cards[currentCardIndex] || activeDeck.cards[0];

  const handleFlipCard = () => {
    sound.playClick();
    setIsFlipped(!isFlipped);
  };

  const handleNextCard = () => {
    setIsFlipped(false);
    setCurrentCardIndex((prev) => (prev + 1) % activeDeck.cards.length);
  };

  const handleRateCard = (rating) => {
    sound.playSuccess();
    setReviewHistory((prev) => ({
      ...prev,
      [currentCard.id]: rating
    }));
    if (rating === 'easy') {
      setCardsMastered((prev) => prev + 1);
    }
    handleNextCard();
  };

  // ================= 2. WEAK-TOPIC DETECTION ENGINE =================
  const WEAK_TOPICS = [
    {
      id: 'wt-1',
      subject: 'Java Programming',
      topic: 'Multithreading & Concurrency Locks',
      accuracy: 54,
      questionsAttempted: 18,
      status: 'Needs Immediate Attention',
      color: '#EF4444',
      recommendedLesson: 'Java Concurrency & Thread Pools'
    },
    {
      id: 'wt-2',
      subject: 'Data Structures & Algorithms',
      topic: 'Binary Search Tree Rotations (AVL)',
      accuracy: 62,
      questionsAttempted: 14,
      status: 'Moderate Vulnerability',
      color: '#F59E0B',
      recommendedLesson: 'Tree Balancing & Rotations'
    },
    {
      id: 'wt-3',
      subject: 'Modern Web Development',
      topic: 'CSS Flexbox & Complex Grid Nesting',
      accuracy: 68,
      questionsAttempted: 22,
      status: 'Review Recommended',
      color: '#F59E0B',
      recommendedLesson: 'CSS Grid & Responsive Layouts'
    }
  ];

  // ================= 3. PERSONALIZED LEARNING PATH NODES =================
  const LEARNING_PATH = [
    {
      id: 'path-1',
      title: 'Phase 1: Foundational Logic & Syntax',
      status: 'Completed',
      progress: 100,
      xp: 450,
      badge: 'Syntax Scholar',
      skills: ['Control Structures', 'Primitive Memory', 'Methods']
    },
    {
      id: 'path-2',
      title: 'Phase 2: Object-Oriented System Architecture',
      status: 'Active',
      progress: 75,
      xp: 800,
      badge: 'Architect in Training',
      skills: ['Inheritance', 'Polymorphism', 'Interfaces', 'Encapsulation']
    },
    {
      id: 'path-3',
      title: 'Phase 3: High-Performance Data Structures',
      status: 'Upcoming',
      progress: 0,
      xp: 1200,
      badge: 'Algorithm Master',
      skills: ['Binary Heaps', 'Graph DFS/BFS', 'Dynamic Programming']
    },
    {
      id: 'path-4',
      title: 'Phase 4: Concurrency & Cloud Scale',
      status: 'Locked',
      progress: 0,
      xp: 1500,
      badge: 'Cloud Sorcerer',
      skills: ['CAS Locks', 'Microservices', 'Distributed Caching']
    }
  ];

  // ================= 4. ADAPTIVE QUIZ ENGINE =================
  const [quizState, setQuizState] = useState({
    active: false,
    level: 2, // 1 (Easy), 2 (Medium), 3 (Hard)
    qIndex: 0,
    score: 0,
    answered: false,
    selected: null,
    history: []
  });

  const ADAPTIVE_QUESTIONS = [
    {
      id: 'aq-1',
      level: 2,
      question: 'Which garbage collector in modern OpenJDK aims for sub-millisecond pause times regardless of heap size?',
      options: ['Serial GC', 'Parallel GC', 'ZGC (Z Garbage Collector)', 'Mark-Sweep GC'],
      correct: 2,
      explanation: 'ZGC performs concurrent reference processing and colored pointers to guarantee pause times under 1ms even with multi-terabyte heaps.'
    },
    {
      id: 'aq-2',
      level: 3,
      question: 'What is the ABA problem in multithreaded lock-free Compare-And-Swap (CAS) data structures?',
      options: [
        'A thread reads value A, it is modified to B, then back to A, causing CAS to succeed erroneously',
        'Deadlock caused by circular dependency between threads A and B',
        'Heap fragmentation when allocating arrays of size A and B',
        'Stack overflow caused by mutual recursive functions'
      ],
      correct: 0,
      explanation: 'The ABA problem occurs when a memory location is read as A, changed to B by another thread, and changed back to A. A naive CAS assumes no change occurred.'
    },
    {
      id: 'aq-3',
      level: 1,
      question: 'Which of the following is an immutable class in Java by design?',
      options: ['StringBuilder', 'String', 'ArrayList', 'StringBuffer'],
      correct: 1,
      explanation: 'Java String objects are immutable; any modification creates a new String instance.'
    }
  ];

  const handleStartAdaptiveQuiz = () => {
    sound.playClick();
    setQuizState({
      active: true,
      level: 2,
      qIndex: 0,
      score: 0,
      answered: false,
      selected: null,
      history: []
    });
  };

  const handleSelectQuizOption = (optIndex) => {
    if (quizState.answered) return;
    const currentQ = ADAPTIVE_QUESTIONS[quizState.qIndex];
    const isCorrect = optIndex === currentQ.correct;

    if (isCorrect) {
      sound.playSuccess();
    } else {
      sound.playClick();
    }

    setQuizState((prev) => ({
      ...prev,
      answered: true,
      selected: optIndex,
      score: isCorrect ? prev.score + (prev.level * 100) : prev.score
    }));
  };

  const handleNextQuizQuestion = () => {
    sound.playClick();
    const nextIdx = quizState.qIndex + 1;
    if (nextIdx < ADAPTIVE_QUESTIONS.length) {
      setQuizState((prev) => ({
        ...prev,
        qIndex: nextIdx,
        answered: false,
        selected: null,
        level: prev.selected === ADAPTIVE_QUESTIONS[prev.qIndex].correct ? Math.min(3, prev.level + 1) : Math.max(1, prev.level - 1)
      }));
    } else {
      // Completed
      confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
      setQuizState((prev) => ({
        ...prev,
        active: false,
        completed: true
      }));
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Top Banner */}
      <div
        className="glass-panel"
        style={{
          padding: '32px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-60px',
            right: '10%',
            width: '320px',
            height: '320px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(34, 211, 238, 0.15) 0%, transparent 70%)',
            filter: 'blur(50px)',
            pointerEvents: 'none'
          }}
        />

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <Sparkles size={18} color="var(--cyan-accent)" />
            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--cyan-accent)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Adaptive Intelligence Engine
            </span>
          </div>

          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: 800 }}>
            Smart Learning Hub
          </h1>

          <p style={{ color: 'var(--text-secondary)', maxWidth: '640px', fontSize: '0.96rem' }}>
            Personalized learning trajectories, automated weak-topic detection, 3D spaced-repetition flashcards, and adaptive dynamic assessments.
          </p>
        </div>

        {/* Tab Switcher Pills */}
        <div
          style={{
            display: 'flex',
            gap: '6px',
            padding: '6px',
            borderRadius: '9999px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--border-subtle)',
            flexWrap: 'wrap'
          }}
        >
          <button
            onClick={() => { sound.playClick(); setActiveTab('flashcards'); }}
            style={{
              padding: '8px 16px',
              borderRadius: '9999px',
              border: 'none',
              backgroundColor: activeTab === 'flashcards' ? 'var(--primary-purple)' : 'transparent',
              color: activeTab === 'flashcards' ? '#FFFFFF' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.84rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Layers size={14} />
            <span>3D Flashcards</span>
          </button>

          <button
            onClick={() => { sound.playClick(); setActiveTab('weakTopics'); }}
            style={{
              padding: '8px 16px',
              borderRadius: '9999px',
              border: 'none',
              backgroundColor: activeTab === 'weakTopics' ? 'var(--primary-purple)' : 'transparent',
              color: activeTab === 'weakTopics' ? '#FFFFFF' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.84rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <AlertTriangle size={14} />
            <span>Weak Topics</span>
          </button>

          <button
            onClick={() => { sound.playClick(); setActiveTab('path'); }}
            style={{
              padding: '8px 16px',
              borderRadius: '9999px',
              border: 'none',
              backgroundColor: activeTab === 'path' ? 'var(--primary-purple)' : 'transparent',
              color: activeTab === 'path' ? '#FFFFFF' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.84rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Target size={14} />
            <span>Learning Path</span>
          </button>

          <button
            onClick={() => { sound.playClick(); setActiveTab('adaptiveQuiz'); }}
            style={{
              padding: '8px 16px',
              borderRadius: '9999px',
              border: 'none',
              backgroundColor: activeTab === 'adaptiveQuiz' ? 'var(--primary-purple)' : 'transparent',
              color: activeTab === 'adaptiveQuiz' ? '#FFFFFF' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.84rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Zap size={14} />
            <span>Adaptive Quiz</span>
          </button>
        </div>
      </div>

      {/* ================= TAB 1: 3D FLASHCARDS & SPACED REPETITION ================= */}
      {activeTab === 'flashcards' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Deck Selector Strip & Stats */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              {FLASHCARD_DECKS.map((d) => (
                <button
                  key={d.id}
                  onClick={() => {
                    sound.playClick();
                    setSelectedDeckId(d.id);
                    setCurrentCardIndex(0);
                    setIsFlipped(false);
                  }}
                  className="glass-btn"
                  style={{
                    padding: '8px 16px',
                    fontSize: '0.84rem',
                    borderColor: selectedDeckId === d.id ? 'var(--cyan-accent)' : undefined,
                    color: selectedDeckId === d.id ? 'var(--cyan-accent)' : undefined
                  }}
                >
                  <BookOpen size={14} />
                  <span>{d.title}</span>
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
              <span>Card <strong>{currentCardIndex + 1}</strong> of <strong>{activeDeck.cards.length}</strong></span>
              <span style={{ color: 'var(--emerald-accent)', fontWeight: 700 }}>
                ✓ {cardsMastered} Mastered
              </span>
            </div>
          </div>

          {/* 3D Interactive Flip Card */}
          <div
            style={{
              perspective: '1200px',
              width: '100%',
              maxWidth: '720px',
              height: '380px',
              margin: '0 auto',
              cursor: 'pointer'
            }}
            onClick={handleFlipCard}
          >
            <div
              style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                transformStyle: 'preserve-3d',
                transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
              }}
            >
              {/* FRONT SIDE (Question) */}
              <div
                className="glass-panel"
                style={{
                  position: 'absolute',
                  inset: 0,
                  backfaceVisibility: 'hidden',
                  padding: '36px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderRadius: 'var(--radius-xl)',
                  border: '1px solid rgba(167, 139, 250, 0.35)',
                  background: 'linear-gradient(135deg, rgba(20, 27, 54, 0.95), rgba(12, 16, 36, 0.95))',
                  boxShadow: '0 20px 45px rgba(0, 0, 0, 0.6), 0 0 30px rgba(139, 92, 246, 0.15)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span
                    style={{
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      padding: '4px 10px',
                      borderRadius: '9999px',
                      backgroundColor: 'rgba(139, 92, 246, 0.15)',
                      color: 'var(--cyan-accent)',
                      border: '1px solid rgba(167, 139, 250, 0.3)'
                    }}
                  >
                    {currentCard.topic}
                  </span>
                  <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                    Difficulty: <strong style={{ color: '#FBBF24' }}>{currentCard.difficulty}</strong>
                  </span>
                </div>

                <div style={{ textAlign: 'center', padding: '0 20px' }}>
                  <h3
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '1.45rem',
                      fontWeight: 800,
                      lineHeight: '1.4',
                      color: '#FFFFFF'
                    }}
                  >
                    {currentCard.question}
                  </h3>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                  <RotateCw size={14} />
                  <span>Click anywhere to flip and see explanation</span>
                </div>
              </div>

              {/* BACK SIDE (Answer & Spaced Repetition) */}
              <div
                className="glass-panel"
                style={{
                  position: 'absolute',
                  inset: 0,
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                  padding: '36px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderRadius: 'var(--radius-xl)',
                  border: '1px solid rgba(52, 211, 153, 0.4)',
                  background: 'linear-gradient(135deg, rgba(16, 32, 54, 0.95), rgba(8, 20, 36, 0.95))',
                  boxShadow: '0 20px 45px rgba(0, 0, 0, 0.6), 0 0 30px rgba(52, 211, 153, 0.2)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--emerald-accent)', textTransform: 'uppercase' }}>
                    ✓ Detailed Architecture Insight
                  </span>
                  <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                    Spaced Repetition Review
                  </span>
                </div>

                <div style={{ padding: '0 10px', overflowY: 'auto', maxHeight: '180px' }}>
                  <p style={{ fontSize: '0.98rem', lineHeight: '1.6', color: '#F8FAFC' }}>
                    {currentCard.answer}
                  </p>
                </div>

                {/* Spaced repetition rating buttons */}
                <div
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px'
                  }}
                >
                  <button
                    onClick={() => handleRateCard('hard')}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(239, 68, 68, 0.15)',
                      border: '1px solid #EF4444',
                      color: '#F87171',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                    title="Review again today"
                  >
                    🔴 Hard (Today)
                  </button>

                  <button
                    onClick={() => handleRateCard('good')}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(245, 158, 11, 0.15)',
                      border: '1px solid #F59E0B',
                      color: '#FBBF24',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                    title="Review in 3 days"
                  >
                    🟡 Good (3 Days)
                  </button>

                  <button
                    onClick={() => handleRateCard('easy')}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(52, 211, 153, 0.15)',
                      border: '1px solid var(--emerald-accent)',
                      color: 'var(--emerald-accent)',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                    title="Review in 7 days"
                  >
                    🟢 Easy (7 Days)
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: WEAK-TOPIC DETECTION ENGINE ================= */}
      {activeTab === 'weakTopics' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '8px' }}>
              Cognitive Diagnostic Vulnerabilities
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '20px' }}>
              The LearnSphere diagnostic engine analyzed your recent 32 quiz questions and identified 3 key knowledge gaps. Remedying these topics will elevate your overall mastery past 90%.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {WEAK_TOPICS.map((t) => (
                <div
                  key={t.id}
                  style={{
                    padding: '20px',
                    borderRadius: 'var(--radius-lg)',
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '16px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div
                      style={{
                        width: '54px',
                        height: '54px',
                        borderRadius: '14px',
                        backgroundColor: `${t.color}20`,
                        border: `1px solid ${t.color}`,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: t.color,
                        fontWeight: 900
                      }}
                    >
                      <span style={{ fontSize: '1.15rem' }}>{t.accuracy}%</span>
                      <span style={{ fontSize: '0.62rem' }}>SCORE</span>
                    </div>

                    <div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                        {t.subject}
                      </div>
                      <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                        {t.topic}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: t.color, marginTop: '2px' }}>
                        ● {t.status} ({t.questionsAttempted} quiz attempts)
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <Link
                      to="/courses/java-programming"
                      className="gradient-border-btn"
                      style={{ padding: '8px 16px', fontSize: '0.84rem' }}
                    >
                      <Play size={14} />
                      <span>Review Lesson</span>
                    </Link>

                    <button
                      onClick={() => {
                        sound.playClick();
                        setActiveTab('adaptiveQuiz');
                      }}
                      className="glass-btn"
                      style={{ padding: '8px 16px', fontSize: '0.84rem' }}
                    >
                      <Zap size={14} />
                      <span>Targeted Drill</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 3: PERSONALIZED LEARNING PATH ================= */}
      {activeTab === 'path' && (
        <div className="glass-panel" style={{ padding: '32px' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '6px' }}>
            Personalized Curriculum Roadmap
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '32px' }}>
            Dynamically sequenced according to your learning speed and prerequisite mastery.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative' }}>
            {LEARNING_PATH.map((node, i) => {
              const isDone = node.status === 'Completed';
              const isActive = node.status === 'Active';
              return (
                <div
                  key={node.id}
                  style={{
                    padding: '24px',
                    borderRadius: 'var(--radius-lg)',
                    backgroundColor: isActive ? 'rgba(139, 92, 246, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                    border: `1px solid ${isActive ? 'rgba(167, 139, 250, 0.4)' : 'var(--card-border)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '16px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div
                      style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '50%',
                        backgroundColor: isDone ? 'rgba(52, 211, 153, 0.2)' : isActive ? 'var(--primary-purple)' : 'rgba(255, 255, 255, 0.05)',
                        color: isDone ? 'var(--emerald-accent)' : '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '1rem',
                        boxShadow: isActive ? '0 0 20px rgba(139, 92, 246, 0.5)' : 'none'
                      }}
                    >
                      {isDone ? '✓' : i + 1}
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                          {node.title}
                        </span>
                        <span
                          style={{
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: '9999px',
                            backgroundColor: isDone ? 'rgba(52, 211, 153, 0.15)' : isActive ? 'rgba(34, 211, 238, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                            color: isDone ? 'var(--emerald-accent)' : isActive ? 'var(--cyan-accent)' : 'var(--text-muted)'
                          }}
                        >
                          {node.status}
                        </span>
                      </div>

                      <div style={{ display: 'flex', gap: '6px', marginTop: '6px', flexWrap: 'wrap' }}>
                        {node.skills.map((s, si) => (
                          <span
                            key={si}
                            style={{
                              fontSize: '0.74rem',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              backgroundColor: 'rgba(255, 255, 255, 0.04)',
                              color: 'var(--text-secondary)'
                            }}
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#FBBF24' }}>
                        +{node.xp} XP
                      </div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                        Badge: {node.badge}
                      </div>
                    </div>

                    {isActive && (
                      <Link
                        to="/courses/java-programming"
                        className="gradient-border-btn"
                        style={{ padding: '8px 18px', fontSize: '0.84rem' }}
                      >
                        <span>Continue Stage →</span>
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= TAB 4: ADAPTIVE QUIZ ENGINE ================= */}
      {activeTab === 'adaptiveQuiz' && (
        <div className="glass-panel" style={{ padding: '32px' }}>
          {!quizState.active ? (
            <div style={{ textAlign: 'center', padding: '30px 20px', maxWidth: '580px', margin: '0 auto' }}>
              <div
                style={{
                  width: '70px',
                  height: '70px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #8B5CF6, #22D3EE)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px auto',
                  boxShadow: '0 0 35px rgba(139, 92, 246, 0.5)'
                }}
              >
                <Zap size={36} color="white" />
              </div>

              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '10px' }}>
                Adaptive Knowledge Assessment
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem', lineHeight: '1.6', marginBottom: '24px' }}>
                Our algorithm adapts question difficulty in real time based on your consecutive correct answers. High precision guarantees maximum XP and streak boosts!
              </p>

              <button
                onClick={handleStartAdaptiveQuiz}
                className="gradient-border-btn"
                style={{ padding: '12px 36px', fontSize: '1rem', margin: '0 auto' }}
              >
                <Play size={18} />
                <span>Launch Adaptive Diagnostic</span>
              </button>
            </div>
          ) : (
            <div style={{ maxWidth: '680px', margin: '0 auto' }}>
              {/* Quiz Header & Adaptive Level */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
                    Question <strong>{quizState.qIndex + 1}</strong> of {ADAPTIVE_QUESTIONS.length}
                  </span>
                  <span
                    style={{
                      fontSize: '0.74rem',
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: '9999px',
                      backgroundColor:
                        quizState.level === 3
                          ? 'rgba(239, 68, 68, 0.15)'
                          : quizState.level === 2
                          ? 'rgba(245, 158, 11, 0.15)'
                          : 'rgba(52, 211, 153, 0.15)',
                      color:
                        quizState.level === 3
                          ? '#EF4444'
                          : quizState.level === 2
                          ? '#F59E0B'
                          : 'var(--emerald-accent)'
                    }}
                  >
                    Level {quizState.level}: {quizState.level === 3 ? 'Advanced' : quizState.level === 2 ? 'Intermediate' : 'Foundational'}
                  </span>
                </div>

                <div style={{ fontWeight: 800, color: '#FBBF24', fontSize: '1rem' }}>
                  Score: {quizState.score} XP
                </div>
              </div>

              {/* Question Text */}
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, lineHeight: '1.5', marginBottom: '20px' }}>
                {ADAPTIVE_QUESTIONS[quizState.qIndex].question}
              </h3>

              {/* Options */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                {ADAPTIVE_QUESTIONS[quizState.qIndex].options.map((opt, i) => {
                  const isSelected = quizState.selected === i;
                  const isCorrect = i === ADAPTIVE_QUESTIONS[quizState.qIndex].correct;
                  let bg = 'rgba(255, 255, 255, 0.04)';
                  let border = 'var(--card-border)';

                  if (quizState.answered) {
                    if (isCorrect) {
                      bg = 'rgba(52, 211, 153, 0.2)';
                      border = 'var(--emerald-accent)';
                    } else if (isSelected) {
                      bg = 'rgba(239, 68, 68, 0.2)';
                      border = '#EF4444';
                    }
                  }

                  return (
                    <button
                      key={i}
                      onClick={() => handleSelectQuizOption(i)}
                      style={{
                        padding: '14px 18px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: bg,
                        border: `1px solid ${border}`,
                        color: '#FFFFFF',
                        fontSize: '0.92rem',
                        textAlign: 'left',
                        cursor: quizState.answered ? 'default' : 'pointer',
                        transition: 'all 0.15s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <span>{String.fromCharCode(65 + i)}. {opt}</span>
                      {quizState.answered && isCorrect && <CheckCircle2 size={18} color="var(--emerald-accent)" />}
                    </button>
                  );
                })}
              </div>

              {/* Explanation & Next Button */}
              {quizState.answered && (
                <div style={{ padding: '16px', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-subtle)', marginBottom: '20px' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.86rem', color: quizState.selected === ADAPTIVE_QUESTIONS[quizState.qIndex].correct ? 'var(--emerald-accent)' : '#F87171', marginBottom: '4px' }}>
                    {quizState.selected === ADAPTIVE_QUESTIONS[quizState.qIndex].correct ? '✓ Correct Answer!' : '✗ Incorrect Concept'}
                  </div>
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                    {ADAPTIVE_QUESTIONS[quizState.qIndex].explanation}
                  </p>
                </div>
              )}

              {quizState.answered && (
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    onClick={handleNextQuizQuestion}
                    className="gradient-border-btn"
                    style={{ padding: '10px 24px', fontSize: '0.92rem' }}
                  >
                    <span>{quizState.qIndex + 1 < ADAPTIVE_QUESTIONS.length ? 'Next Adaptive Question →' : 'Complete Assessment'}</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
