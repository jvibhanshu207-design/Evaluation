import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Send,
  X,
  Minimize2,
  Maximize2,
  Bot,
  User,
  HelpCircle,
  BookOpen,
  FileText,
  Lightbulb,
  Compass,
  Copy,
  Check,
  RefreshCw,
  PlusCircle,
  ExternalLink,
  Flame,
  Award
} from 'lucide-react';
import { sound } from '../../utils/sound';
import { useCourses } from '../../context/CourseContext';
import { STORAGE_KEYS, getStoredData, setStoredData } from '../../utils/storage';
import './AIAssistant.css';

export default function AIAssistant({ activeLessonTitle = null, activeCourseTitle = null }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [savedNoteSuccess, setSavedNoteSuccess] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const { courses } = useCourses();

  // Initial welcome message
  const [messages, setMessages] = useState([
    {
      id: 'msg-welcome',
      sender: 'ai',
      time: 'Just now',
      text: `Hello! I'm **LearnSphere AI**, your personal cognitive tutor. 🧠✨\n\nI can explain complex concepts, summarize lessons, generate interactive quizzes, formulate study notes, or guide your personalized learning roadmap. What would you like to explore?`,
      chips: [
        'Explain Polymorphism in Java',
        'Summarize this lesson',
        'Generate a 3-question quiz',
        'Create study notes',
        'What should I study next?'
      ]
    }
  ]);

  // Keyboard shortcut Ctrl + J to toggle AI
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'j') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Scroll to bottom on new message
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen, isMinimized]);

  const handleOpen = () => {
    sound.playClick();
    setIsOpen(true);
    setIsMinimized(false);
    setTimeout(() => inputRef.current?.focus(), 200);
  };

  const handleClose = () => {
    sound.playClick();
    setIsOpen(false);
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    sound.playClick();
    setTimeout(() => setCopiedId(null), 2000);
  };

  const saveToUserNotes = (noteContent, title) => {
    try {
      const existingNotes = getStoredData(STORAGE_KEYS.NOTES, []);
      const newNote = {
        id: `ai-note-${Date.now()}`,
        title: title || 'AI Generated Note',
        courseId: 'java-programming',
        courseTitle: activeCourseTitle || 'General Studies',
        category: 'AI Summary',
        content: noteContent,
        tags: ['AI Generated', 'Study Notes'],
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
      };
      setStoredData(STORAGE_KEYS.NOTES, [newNote, ...existingNotes]);
      setSavedNoteSuccess(true);
      sound.playSuccess();
      setTimeout(() => setSavedNoteSuccess(false), 3000);
    } catch {
      // ignore
    }
  };

  const getAIResponse = (query) => {
    const q = query.toLowerCase();

    if (q.includes('quiz') || q.includes('test me') || q.includes('questions')) {
      return {
        text: `### 🎯 Interactive AI Quick Quiz: Core CS & Java\n\nTest your knowledge with these 3 targeted questions:`,
        quiz: [
          {
            question: '1. In Java, which keyword prevents a class from being inherited?',
            options: ['abstract', 'static', 'final', 'sealed'],
            correct: 2,
            explanation: 'The `final` keyword applied to a class declaration prevents any subclass from extending it.'
          },
          {
            question: '2. What is the average time complexity of searching in a balanced Binary Search Tree (AVL / Red-Black)?',
            options: ['O(1)', 'O(log N)', 'O(N)', 'O(N log N)'],
            correct: 1,
            explanation: 'Because height is bounded to log(N), search operations discard half the subtree at each node.'
          },
          {
            question: '3. What happens in React when a state update passes an identical primitive value?',
            options: [
              'Component re-renders anyway',
              'React bails out without re-rendering',
              'Throws an UnhandledPromiseRejection',
              'Resets all hooks in the component'
            ],
            correct: 1,
            explanation: 'React uses `Object.is` comparison. If previous and next values are identical, re-render is bailed out.'
          }
        ],
        chips: ['Explain question 2 in detail', 'Generate harder quiz', 'Create study notes on BST']
      };
    }

    if (q.includes('summarize') || q.includes('summary')) {
      const topic = activeLessonTitle || 'Modern Component Architectures & OOP';
      return {
        text: `### 📋 Executive Lesson Summary: ${topic}\n\n**Key Takeaways:**\n- **Core Abstraction:** Isolates implementation complexity behind well-defined, contract-driven interfaces.\n- **Encapsulation & State:** Guarantees data invariants are maintained by controlling mutations via accessors/mutators or immutable state setters.\n- **Performance Principle:** Memory allocation in the nursery heap is cheap; avoid premature allocations inside hot loops.\n\n> 💡 **Exam Tip:** Remember that runtime polymorphism is resolved via the dynamic method dispatch table (vtable), introducing negligible overhead while granting maximum extensibility.`,
        canSaveNote: true,
        noteTitle: `Summary: ${topic}`,
        chips: ['Generate a quiz on this', 'Explain polymorphic vtables', 'Recommend next lesson']
      };
    }

    if (q.includes('note') || q.includes('notes')) {
      return {
        text: `### 📝 Structured Study Notes: Java Collections & Memory\n\n#### 1. List Hierarchy\n- **ArrayList:** Backed by dynamically resizing array. Fast random access $O(1)$, slow intermediate insertion $O(N)$.\n- **LinkedList:** Doubly-linked list nodes. Memory overhead per node pointer; efficient $O(1)$ deque operations.\n\n#### 2. Map Hierarchy\n- **HashMap:** Hash table with bucket chaining (transforms into Red-Black Tree when bucket size > 8).\n- **ConcurrentHashMap:** Segment-level lock-striping / CAS atomic operations for high-throughput concurrency.\n\n\`\`\`java\n// Best practice initialization\nMap<String, Integer> cache = new ConcurrentHashMap<>();\ncache.computeIfAbsent("token", k -> computeToken(k));\n\`\`\`\n\n*Saved to your Study Notes automatically if you click below!*`,
        canSaveNote: true,
        noteTitle: 'Java Collections & Memory Architecture',
        chips: ['Generate quiz on Maps', 'Explain Hash Collision resolution', 'What should I study next?']
      };
    }

    if (q.includes('hint') || q.includes('stuck') || q.includes('help with assignment')) {
      return {
        text: `### 💡 Socratic Hint\n\nWhen troubleshooting this assignment or algorithm challenge:\n\n1. **Inspect Boundary Conditions:** Does your code handle $N=0$, negative integers, or null references gracefully?\n2. **Break into Invariants:** Before writing the loop, write down what *must remain true* after each iteration.\n3. **Space vs. Time Tradeoff:** If your nested loops are $O(N^2)$, can an auxiliary HashSet or two-pointer technique reduce it to $O(N)$?\n\n*Need a more specific hint? Type the exact problem statement or variable name!*`,
        chips: ['Show code template', 'Explain Two-Pointer approach', 'Summarize lesson']
      };
    }

    if (q.includes('next') || q.includes('recommend') || q.includes('what to study')) {
      return {
        text: `### 🎯 Personalized Learning Recommendation\n\nBased on your current progress (**84% Course Progress**, **7-day streak 🔥**, **Average Quiz Score 88%**):\n\n1. **Priority Next Step:** Complete Module 2 in **Java Programming Masterclass** (*Method Overriding & Polymorphism*).\n2. **Weak Area Reinforcement:** Your accuracy in **Concurrency & Threads** is currently 54%. We recommend a 15-minute drill on Thread synchronization.\n3. **Stretch Goal:** Attempt the **Data Structures in Java** assignment on Binary Search Trees to earn the *Algorithm Master* badge!`,
        chips: ['Start Concurrency Drill', 'Explain Concurrency basics', 'Generate Concurrency quiz']
      };
    }

    // Default: Explain topic
    return {
      text: `### 🔍 Deep Dive: ${query}\n\n**Conceptual Definition:**\n${query} is a fundamental architectural pattern used in modern software engineering to decouple interface specifications from concrete behaviors.\n\n**Mental Model & Analogy:**\nThink of an electrical power outlet: any appliance conforming to the plug dimensions works regardless of whether the generator uses solar, hydroelectric, or wind power.\n\n**Code Example:**\n\`\`\`java\n// Flexible polymorphic design\npublic interface PaymentGateway {\n    void processPayment(double amount);\n}\n\npublic class StripeGateway implements PaymentGateway {\n    public void processPayment(double amount) {\n        System.out.println("Processing $" + amount + " securely via Stripe API");\n    }\n}\n\`\`\`\n\n**Key Advantages:**\n- Promotes the Open-Closed Principle (open for extension, closed for modification).\n- Makes automated unit testing straightforward with mock implementations.`,
      chips: ['Generate a quiz on this topic', 'Create study notes', 'Explain with another example']
    };
  };

  const handleSendMessage = (textToSend = null) => {
    const text = (textToSend || inputMessage).trim();
    if (!text) return;

    sound.playClick();
    const userMsgId = `usr-${Date.now()}`;
    const newMessages = [
      ...messages,
      {
        id: userMsgId,
        sender: 'user',
        time: 'Just now',
        text
      }
    ];

    setMessages(newMessages);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI thinking and streaming response
    setTimeout(() => {
      const responseData = getAIResponse(text);
      sound.playMessage();
      setIsTyping(false);
      setMessages([
        ...newMessages,
        {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          time: 'Just now',
          text: responseData.text,
          quiz: responseData.quiz || null,
          canSaveNote: responseData.canSaveNote || false,
          noteTitle: responseData.noteTitle || null,
          chips: responseData.chips || []
        }
      ]);
    }, 650);
  };

  const [quizAnswers, setQuizAnswers] = useState({});
  const handleSelectQuizOption = (msgId, qIndex, optionIndex) => {
    sound.playClick();
    setQuizAnswers((prev) => ({
      ...prev,
      [`${msgId}-${qIndex}`]: optionIndex
    }));
  };

  return (
    <>
      {/* Floating Launcher FAB Button */}
      {!isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 9000,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: '8px'
          }}
        >
          {/* Teaser Tooltip Bubble */}
          <div
            onClick={handleOpen}
            className="animate-float"
            style={{
              padding: '8px 14px',
              borderRadius: '9999px',
              background: 'linear-gradient(135deg, rgba(20, 27, 54, 0.95), rgba(11, 15, 34, 0.95))',
              border: '1px solid rgba(167, 139, 250, 0.4)',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5), 0 0 20px rgba(139, 92, 246, 0.3)',
              color: '#F8FAFC',
              fontSize: '0.82rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              userSelect: 'none'
            }}
          >
            <Sparkles size={14} color="#22D3EE" />
            <span>Ask LearnSphere AI</span>
            <span
              style={{
                fontSize: '0.68rem',
                padding: '2px 6px',
                borderRadius: '4px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: 'var(--text-muted)'
              }}
            >
              Ctrl J
            </span>
          </div>

          {/* Main Glowing Orb Button */}
          <button
            onClick={handleOpen}
            id="floating-ai-button"
            className="ai-fab-button"
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 50%, #22D3EE 100%)',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 0 35px rgba(139, 92, 246, 0.6), 0 10px 25px rgba(0, 0, 0, 0.5)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              position: 'relative'
            }}
            title="Open LearnSphere AI Assistant (Ctrl + J)"
            aria-label="Open AI Assistant"
          >
            <Bot size={28} />
            <span
              style={{
                position: 'absolute',
                top: '0px',
                right: '0px',
                width: '14px',
                height: '14px',
                borderRadius: '50%',
                backgroundColor: '#10B981',
                border: '2px solid #080B18',
                boxShadow: '0 0 8px #10B981'
              }}
            />
          </button>
        </div>
      )}

      {/* Slide-out / Modal Floating AI Workspace */}
      {isOpen && (
        <div
          className={`ai-modal-window ${isMinimized ? 'ai-minimized' : ''}`}
          style={{
            position: 'fixed',
            bottom: isMinimized ? '20px' : '24px',
            right: '24px',
            width: isMinimized ? '320px' : '440px',
            maxWidth: 'calc(100vw - 36px)',
            height: isMinimized ? '56px' : '620px',
            maxHeight: 'calc(100vh - 48px)',
            borderRadius: 'var(--radius-xl)',
            backgroundColor: 'rgba(12, 17, 36, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(167, 139, 250, 0.35)',
            boxShadow: '0 24px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(139, 92, 246, 0.25)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          {/* Header Bar */}
          <div
            style={{
              padding: '14px 18px',
              borderBottom: '1px solid var(--border-subtle)',
              background: 'linear-gradient(90deg, rgba(139, 92, 246, 0.15) 0%, rgba(34, 211, 238, 0.08) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexShrink: 0
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #8B5CF6, #22D3EE)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  boxShadow: '0 0 12px rgba(139, 92, 246, 0.5)'
                }}
              >
                <Bot size={18} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontWeight: 800, fontSize: '0.94rem', color: '#F8FAFC' }}>
                    LearnSphere AI
                  </span>
                  <span
                    style={{
                      fontSize: '0.66rem',
                      fontWeight: 700,
                      padding: '2px 6px',
                      borderRadius: '9999px',
                      backgroundColor: 'rgba(52, 211, 153, 0.15)',
                      color: 'var(--emerald-accent)',
                      border: '1px solid rgba(52, 211, 153, 0.3)'
                    }}
                  >
                    ONLINE
                  </span>
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  Intelligent EdTech Assistant
                </div>
              </div>
            </div>

            {/* Window Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  padding: '4px',
                  borderRadius: '6px'
                }}
                title={isMinimized ? 'Expand' : 'Minimize'}
              >
                {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
              </button>

              <button
                onClick={handleClose}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  padding: '4px',
                  borderRadius: '6px'
                }}
                title="Close"
              >
                <X size={17} />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Preset Action Strip */}
              <div
                style={{
                  padding: '8px 12px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  borderBottom: '1px solid var(--border-subtle)',
                  display: 'flex',
                  gap: '6px',
                  overflowX: 'auto',
                  flexShrink: 0
                }}
              >
                <button
                  onClick={() => handleSendMessage('Explain topic: Polymorphism & Dynamic Dispatch')}
                  className="ai-chip-btn"
                  title="Explain a complex concept"
                >
                  <BookOpen size={12} />
                  <span>Explain Topic</span>
                </button>

                <button
                  onClick={() => handleSendMessage('Summarize this lesson')}
                  className="ai-chip-btn"
                  title="Summarize current video lesson"
                >
                  <FileText size={12} />
                  <span>Summarize</span>
                </button>

                <button
                  onClick={() => handleSendMessage('Generate an interactive quiz')}
                  className="ai-chip-btn"
                  title="Generate a 3-question MCQ quiz"
                >
                  <HelpCircle size={12} />
                  <span>Generate Quiz</span>
                </button>

                <button
                  onClick={() => handleSendMessage('Generate structured study notes')}
                  className="ai-chip-btn"
                  title="Generate notes and save to Notes tab"
                >
                  <PlusCircle size={12} />
                  <span>Create Notes</span>
                </button>

                <button
                  onClick={() => handleSendMessage('Give me a hint for this assignment')}
                  className="ai-chip-btn"
                  title="Get Socratic hint"
                >
                  <Lightbulb size={12} />
                  <span>Give Hints</span>
                </button>

                <button
                  onClick={() => handleSendMessage('What should I study next?')}
                  className="ai-chip-btn"
                  title="Personalized next lesson"
                >
                  <Compass size={12} />
                  <span>Recommend Next</span>
                </button>
              </div>

              {/* Chat Message Scroll Area */}
              <div
                style={{
                  flex: 1,
                  overflowY: 'auto',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px'
                }}
              >
                {messages.map((m) => {
                  const isUser = m.sender === 'user';
                  return (
                    <div
                      key={m.id}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: isUser ? 'flex-end' : 'flex-start',
                        maxWidth: '100%'
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '8px',
                          maxWidth: isUser ? '85%' : '94%',
                          flexDirection: isUser ? 'row-reverse' : 'row'
                        }}
                      >
                        {/* Avatar */}
                        <div
                          style={{
                            width: '26px',
                            height: '26px',
                            borderRadius: '50%',
                            backgroundColor: isUser ? 'var(--primary-purple)' : 'rgba(34, 211, 238, 0.2)',
                            color: isUser ? '#FFFFFF' : 'var(--cyan-accent)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.72rem',
                            flexShrink: 0,
                            marginTop: '2px'
                          }}
                        >
                          {isUser ? <User size={14} /> : <Bot size={14} />}
                        </div>

                        {/* Speech Bubble */}
                        <div
                          style={{
                            padding: '12px 14px',
                            borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                            backgroundColor: isUser ? 'rgba(139, 92, 246, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                            border: `1px solid ${isUser ? 'rgba(167, 139, 250, 0.4)' : 'rgba(255, 255, 255, 0.08)'}`,
                            color: 'var(--text-primary)',
                            fontSize: '0.86rem',
                            lineHeight: '1.55',
                            wordBreak: 'break-word'
                          }}
                        >
                          {/* Markdown formatted text output */}
                          <div style={{ whiteSpace: 'pre-line' }}>{m.text}</div>

                          {/* Interactive Quiz Renderer */}
                          {m.quiz && (
                            <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                              {m.quiz.map((q, qIdx) => {
                                const selectedOpt = quizAnswers[`${m.id}-${qIdx}`];
                                const hasAnswered = selectedOpt !== undefined;
                                return (
                                  <div
                                    key={qIdx}
                                    style={{
                                      padding: '12px',
                                      borderRadius: '10px',
                                      backgroundColor: 'rgba(0, 0, 0, 0.3)',
                                      border: '1px solid rgba(255, 255, 255, 0.06)'
                                    }}
                                  >
                                    <div style={{ fontWeight: 700, fontSize: '0.84rem', marginBottom: '8px' }}>
                                      {q.question}
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                      {q.options.map((opt, optIdx) => {
                                        const isSelected = selectedOpt === optIdx;
                                        const isCorrect = optIdx === q.correct;
                                        let btnBg = 'rgba(255, 255, 255, 0.04)';
                                        let btnBorder = 'rgba(255, 255, 255, 0.1)';

                                        if (hasAnswered) {
                                          if (isCorrect) {
                                            btnBg = 'rgba(52, 211, 153, 0.25)';
                                            btnBorder = 'var(--emerald-accent)';
                                          } else if (isSelected) {
                                            btnBg = 'rgba(239, 68, 68, 0.25)';
                                            btnBorder = '#EF4444';
                                          }
                                        }

                                        return (
                                          <button
                                            key={optIdx}
                                            onClick={() => handleSelectQuizOption(m.id, qIdx, optIdx)}
                                            style={{
                                              padding: '8px 10px',
                                              borderRadius: '6px',
                                              backgroundColor: btnBg,
                                              border: `1px solid ${btnBorder}`,
                                              color: '#FFFFFF',
                                              fontSize: '0.8rem',
                                              textAlign: 'left',
                                              cursor: hasAnswered ? 'default' : 'pointer',
                                              transition: 'all 0.15s ease'
                                            }}
                                          >
                                            {String.fromCharCode(65 + optIdx)}. {opt}
                                          </button>
                                        );
                                      })}
                                    </div>

                                    {hasAnswered && (
                                      <div
                                        style={{
                                          marginTop: '8px',
                                          fontSize: '0.76rem',
                                          color: selectedOpt === q.correct ? 'var(--emerald-accent)' : '#F87171',
                                          lineHeight: '1.4'
                                        }}
                                      >
                                        <strong>{selectedOpt === q.correct ? '✓ Correct!' : '✗ Not quite.'}</strong>{' '}
                                        {q.explanation}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}

                          {/* Note Saving Action Button */}
                          {m.canSaveNote && (
                            <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
                              <button
                                onClick={() => saveToUserNotes(m.text, m.noteTitle)}
                                className="gradient-border-btn"
                                style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                              >
                                <PlusCircle size={14} />
                                <span>{savedNoteSuccess ? '✓ Saved to Notes Tab!' : 'Save to My Notes'}</span>
                              </button>
                            </div>
                          )}

                          {/* Quick copy bubble button */}
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'flex-end',
                              marginTop: '8px',
                              opacity: 0.7
                            }}
                          >
                            <button
                              onClick={() => copyToClipboard(m.text, m.id)}
                              style={{
                                background: 'transparent',
                                border: 'none',
                                color: 'var(--text-muted)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                fontSize: '0.72rem'
                              }}
                              title="Copy answer"
                            >
                              {copiedId === m.id ? <Check size={12} color="#10B981" /> : <Copy size={12} />}
                              <span>{copiedId === m.id ? 'Copied' : 'Copy'}</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Follow-up suggestion chips */}
                      {m.chips && m.chips.length > 0 && (
                        <div
                          style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '6px',
                            marginTop: '8px',
                            marginLeft: '34px'
                          }}
                        >
                          {m.chips.map((chip, i) => (
                            <button
                              key={i}
                              onClick={() => handleSendMessage(chip)}
                              style={{
                                padding: '4px 10px',
                                borderRadius: '9999px',
                                backgroundColor: 'rgba(139, 92, 246, 0.12)',
                                border: '1px solid rgba(167, 139, 250, 0.25)',
                                color: 'var(--cyan-accent)',
                                fontSize: '0.74rem',
                                cursor: 'pointer',
                                transition: 'all 0.15s ease'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = 'rgba(139, 92, 246, 0.25)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'rgba(139, 92, 246, 0.12)';
                              }}
                            >
                              {chip} →
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Typing Indicator */}
                {isTyping && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '34px' }}>
                    <div
                      style={{
                        padding: '8px 14px',
                        borderRadius: '14px',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid var(--border-subtle)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}
                    >
                      <span className="typing-dot" style={{ animationDelay: '0s' }} />
                      <span className="typing-dot" style={{ animationDelay: '0.2s' }} />
                      <span className="typing-dot" style={{ animationDelay: '0.4s' }} />
                    </div>
                    <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                      Synthesizing intelligent insight...
                    </span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input Box */}
              <div
                style={{
                  padding: '12px 16px',
                  borderTop: '1px solid var(--border-subtle)',
                  background: 'rgba(8, 11, 24, 0.85)',
                  flexShrink: 0
                }}
              >
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    padding: '4px 6px 4px 14px'
                  }}
                >
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Ask about anything, request a quiz, notes..."
                    style={{
                      flex: 1,
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-primary)',
                      fontSize: '0.88rem',
                      outline: 'none'
                    }}
                  />
                  <button
                    type="submit"
                    disabled={!inputMessage.trim()}
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      background: inputMessage.trim()
                        ? 'linear-gradient(135deg, #8B5CF6, #22D3EE)'
                        : 'rgba(255, 255, 255, 0.08)',
                      border: 'none',
                      color: inputMessage.trim() ? '#FFFFFF' : 'var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: inputMessage.trim() ? 'pointer' : 'default',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <Send size={16} />
                  </button>
                </form>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: '8px',
                    fontSize: '0.7rem',
                    color: 'var(--text-muted)'
                  }}
                >
                  <span>Powered by LearnSphere Cognitive Core</span>
                  <span>Press Enter ↵ to send</span>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
