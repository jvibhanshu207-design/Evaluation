import React, { useState, useEffect } from 'react';
import { Timer, CheckCircle, XCircle, ArrowRight, ArrowLeft, RotateCcw, Award, Check } from 'lucide-react';
import Modal from '../common/Modal';
import ProgressBar from '../common/ProgressBar';
import { sound } from '../../utils/sound';
import './QuizModal.css';

export default function QuizModal({ isOpen, onClose, quiz, onQuizFinished }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [isFinished, setIsFinished] = useState(false);
  const [showReview, setShowReview] = useState(false);

  // Initialize or reset quiz on open
  useEffect(() => {
    if (isOpen && quiz) {
      setCurrentIdx(0);
      setSelectedAnswers({});
      setTimeLeft((quiz.durationMinutes || 10) * 60);
      setIsFinished(false);
      setShowReview(false);
    }
  }, [isOpen, quiz]);

  // Live Timer Countdown
  useEffect(() => {
    if (!isOpen || isFinished || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, isFinished, timeLeft]);

  if (!quiz) return null;

  const questions = quiz.questions || [];
  const currentQuestion = questions[currentIdx];

  const handleSelectOption = (optionIndex) => {
    sound.playClick();
    setSelectedAnswers(prev => ({
      ...prev,
      [currentIdx]: optionIndex
    }));
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(prev => prev - 1);
    }
  };

  const handleSubmitQuiz = () => {
    setIsFinished(true);
    sound.playFanfare();

    // Calculate score
    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswer) {
        correctCount++;
      }
    });

    const scorePct = Math.round((correctCount / questions.length) * 100);

    if (onQuizFinished) {
      onQuizFinished(quiz.id, scorePct, correctCount, questions.length);
    }
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Compute results
  let correctCount = 0;
  if (isFinished) {
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswer) {
        correctCount++;
      }
    });
  }

  const scorePct = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;
  const incorrectCount = questions.length - correctCount;

  // SVG Gauge calculations
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeOffset = circumference - (scorePct / 100) * circumference;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={quiz.title}
      subtitle={!isFinished ? `Question ${currentIdx + 1} of ${questions.length}` : 'Quiz Evaluation Summary'}
      maxWidth="680px"
    >
      {!isFinished ? (
        <div>
          {/* Top Bar: Progress & Timer */}
          <div className="quiz-top-bar">
            <div className="quiz-progress-wrap">
              <ProgressBar
                progress={((currentIdx + 1) / questions.length) * 100}
                height={6}
                colorGradient="linear-gradient(90deg, #8B5CF6, #22D3EE)"
              />
            </div>

            <div className={`quiz-timer-pill ${timeLeft < 120 ? 'urgent' : ''}`}>
              <Timer size={14} />
              <span>{formatTimer(timeLeft)}</span>
            </div>
          </div>

          {/* Question Text */}
          <div className="quiz-question-box">
            <span className="quiz-question-tag">
              Question {currentIdx + 1}
            </span>
            <h3 className="quiz-question-text">
              {currentQuestion?.question}
            </h3>
          </div>

          {/* Multiple Choice Options */}
          <div className="quiz-options-list">
            {currentQuestion?.options.map((option, optIdx) => {
              const isSelected = selectedAnswers[currentIdx] === optIdx;
              return (
                <div
                  key={optIdx}
                  onClick={() => handleSelectOption(optIdx)}
                  className={`quiz-option-card ${isSelected ? 'selected' : ''}`}
                >
                  <div className="quiz-option-radio">
                    {isSelected && <Check size={14} color="#080B18" strokeWidth={3} />}
                  </div>

                  <span className="quiz-option-label">
                    {option}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Navigation Controls */}
          <div className="quiz-nav-footer">
            <button
              onClick={handlePrev}
              disabled={currentIdx === 0}
              className="glass-btn"
              style={{
                opacity: currentIdx === 0 ? 0.4 : 1,
                cursor: currentIdx === 0 ? 'not-allowed' : 'pointer',
                padding: '9px 18px',
                fontSize: '0.88rem'
              }}
            >
              <ArrowLeft size={16} />
              <span>Previous</span>
            </button>

            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              {selectedAnswers[currentIdx] !== undefined ? 'Answered' : 'Not yet selected'}
            </span>

            {currentIdx < questions.length - 1 ? (
              <button
                onClick={handleNext}
                className="gradient-border-btn"
                style={{ padding: '9px 20px', fontSize: '0.88rem' }}
              >
                <span>Next</span>
                <ArrowRight size={16} />
              </button>
            ) : (
              <button
                onClick={handleSubmitQuiz}
                className="gradient-border-btn"
                style={{
                  padding: '9px 24px',
                  fontSize: '0.88rem',
                  background: 'linear-gradient(135deg, #10B981, #06B6D4)'
                }}
              >
                <span>Submit Quiz</span>
                <Check size={16} />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Results View */
        <div className="quiz-results-container">
          {/* Animated Circular Score Gauge */}
          <div className="quiz-gauge-wrap">
            <svg width="130" height="130" viewBox="0 0 130 130">
              <circle
                cx="65"
                cy="65"
                r={radius}
                fill="none"
                stroke="rgba(255, 255, 255, 0.08)"
                strokeWidth="10"
              />
              <circle
                cx="65"
                cy="65"
                r={radius}
                fill="none"
                stroke={scorePct >= quiz.passingScore ? '#34D399' : '#FBBF24'}
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeOffset}
                strokeLinecap="round"
                transform="rotate(-90 65 65)"
                style={{
                  transition: 'stroke-dashoffset 1.4s cubic-bezier(0.16, 1, 0.3, 1)',
                  filter: `drop-shadow(0 0 10px ${
                    scorePct >= quiz.passingScore ? 'rgba(52, 211, 153, 0.6)' : 'rgba(251, 191, 36, 0.6)'
                  })`
                }}
              />
            </svg>
            <div className="quiz-gauge-center">
              <span className="quiz-gauge-val">
                {scorePct}%
              </span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Accuracy</span>
            </div>
          </div>

          {/* Stats Grid: Score, Correct, Incorrect */}
          <div className="quiz-results-grid">
            <div className="quiz-result-card">
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {correctCount} / {questions.length}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Final Score</div>
            </div>

            <div className="quiz-result-card correct">
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--emerald-accent)' }}>
                {correctCount}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Correct Answers</div>
            </div>

            <div className="quiz-result-card incorrect">
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--rose-accent)' }}>
                {incorrectCount}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Incorrect</div>
            </div>
          </div>

          {/* Question Breakdown Accordion Toggle */}
          <div style={{ marginBottom: '24px' }}>
            <button
              onClick={() => setShowReview(!showReview)}
              style={{
                fontSize: '0.86rem',
                color: 'var(--cyan-accent)',
                fontWeight: 600,
                textDecoration: 'underline',
                cursor: 'pointer'
              }}
            >
              {showReview ? 'Hide Question Breakdown' : 'Review Questions & Explanations'}
            </button>

            {showReview && (
              <div className="quiz-review-list">
                {questions.map((q, qIndex) => {
                  const userAns = selectedAnswers[qIndex];
                  const isCorrect = userAns === q.correctAnswer;
                  return (
                    <div
                      key={q.id}
                      className={`quiz-review-item ${isCorrect ? 'correct' : 'incorrect'}`}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                        {isCorrect ? (
                          <CheckCircle size={16} color="var(--emerald-accent)" />
                        ) : (
                          <XCircle size={16} color="var(--rose-accent)" />
                        )}
                        <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                          {qIndex + 1}. {q.question}
                        </span>
                      </div>

                      <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                        Your answer:{' '}
                        <strong style={{ color: isCorrect ? 'var(--emerald-accent)' : 'var(--rose-accent)' }}>
                          {userAns !== undefined ? q.options[userAns] : 'Not answered'}
                        </strong>
                      </div>

                      {!isCorrect && (
                        <div style={{ fontSize: '0.82rem', color: 'var(--emerald-accent)', marginBottom: '6px' }}>
                          Correct answer: <strong>{q.options[q.correctAnswer]}</strong>
                        </div>
                      )}

                      <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                        {q.explanation}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
            <button
              onClick={() => {
                setCurrentIdx(0);
                setSelectedAnswers({});
                setTimeLeft((quiz.durationMinutes || 10) * 60);
                setIsFinished(false);
                setShowReview(false);
              }}
              className="glass-btn"
              style={{ padding: '10px 20px' }}
            >
              <RotateCcw size={16} />
              <span>Retake Quiz</span>
            </button>

            <button
              onClick={onClose}
              className="gradient-border-btn"
              style={{ padding: '10px 24px' }}
            >
              <span>Back to Quizzes</span>
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}
