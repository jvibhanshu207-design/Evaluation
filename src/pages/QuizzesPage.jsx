import React, { useState, useEffect } from 'react';
import { HelpCircle, Timer, ArrowRight, Star } from 'lucide-react';
import { DEMO_QUIZZES } from '../data/demoQuizzes';
import { STORAGE_KEYS, getStoredData, setStoredData } from '../utils/storage';
import QuizModal from '../components/quizzes/QuizModal';
import './QuizzesPage.css';

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState(() =>
    getStoredData(STORAGE_KEYS.QUIZZES, DEMO_QUIZZES)
  );
  const [activeQuiz, setActiveQuiz] = useState(null);

  useEffect(() => {
    setStoredData(STORAGE_KEYS.QUIZZES, quizzes);
  }, [quizzes]);

  const handleQuizFinished = (quizId, scorePct) => {
    setQuizzes((prev) =>
      prev.map((q) => {
        if (q.id === quizId) {
          const currentBest = q.bestScore || 0;
          return {
            ...q,
            completed: true,
            bestScore: Math.max(currentBest, scorePct),
            lastAttemptScore: scorePct
          };
        }
        return q;
      })
    );
  };

  return (
    <div className="quizzes-container">
      {/* Header Banner */}
      <div className="glass-panel page-banner">
        <div className="page-tag">
          <HelpCircle size={20} color="var(--cyan-accent)" />
          <span>Interactive Assessment Engine</span>
        </div>

        <h1 className="page-title">
          Quizzes & Knowledge Checks
        </h1>

        <p className="page-subtitle">
          Test your conceptual understanding across Java, React, Python, Data Structures, and SQL. Instant automatic scoring and accuracy breakdown.
        </p>
      </div>

      {/* Quizzes Grid */}
      <div className="quizzes-grid">
        {quizzes.map((quiz) => (
          <div
            key={quiz.id}
            className="glass-panel glass-panel-hover quiz-card"
          >
            <div>
              {/* Header Badges */}
              <div className="quiz-card-header">
                <span className="quiz-course-tag">
                  {quiz.courseName}
                </span>

                <span
                  className={quiz.difficulty === 'Hard' ? 'pill-badge badge-danger' : 'pill-badge badge-positive'}
                >
                  {quiz.difficulty}
                </span>
              </div>

              {/* Title */}
              <h3 className="quiz-card-title">
                {quiz.title}
              </h3>

              {/* Metadata */}
              <div className="quiz-card-meta">
                <div className="quiz-meta-item">
                  <HelpCircle size={14} />
                  <span>{quiz.questionsCount || quiz.questions?.length} Questions</span>
                </div>
                <div className="quiz-meta-item">
                  <Timer size={14} />
                  <span>{quiz.durationMinutes} Minutes</span>
                </div>
              </div>
            </div>

            {/* Bottom: Best Score & Launch Button */}
            <div>
              <div className="quiz-score-row">
                <span style={{ color: 'var(--text-muted)' }}>Best Score:</span>
                {quiz.bestScore !== null && quiz.bestScore !== undefined ? (
                  <span
                    className="quiz-score-value"
                    style={{
                      color: quiz.bestScore >= quiz.passingScore ? 'var(--emerald-accent)' : '#FBBF24'
                    }}
                  >
                    <Star size={14} fill="currentColor" />
                    <span>{quiz.bestScore}%</span>
                  </span>
                ) : (
                  <span style={{ color: 'var(--text-muted)' }}>Not attempted yet</span>
                )}
              </div>

              <button
                onClick={() => setActiveQuiz(quiz)}
                className="gradient-border-btn"
                style={{ width: '100%', justifyContent: 'center', padding: '10px', fontSize: '0.9rem' }}
              >
                <span>{quiz.completed ? 'Retake Quiz' : 'Start Assessment'}</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Quiz Runner Modal */}
      {activeQuiz && (
        <QuizModal
          isOpen={!!activeQuiz}
          onClose={() => setActiveQuiz(null)}
          quiz={activeQuiz}
          onQuizFinished={handleQuizFinished}
        />
      )}
    </div>
  );
}
