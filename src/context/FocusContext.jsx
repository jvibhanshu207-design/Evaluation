import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback
} from 'react';
import confetti from 'canvas-confetti';
import { sound } from '../utils/sound';
import { getStoredData, setStoredData } from '../utils/storage';

export const FOCUS_MODES = {
  pomodoro: { id: 'pomodoro', label: 'Pomodoro', duration: 25 * 60, xpReward: 50 },
  shortBreak: { id: 'shortBreak', label: 'Short Break', duration: 5 * 60, xpReward: 0 },
  longBreak: { id: 'longBreak', label: 'Long Break', duration: 15 * 60, xpReward: 0 },
  deepWork: { id: 'deepWork', label: 'Deep Focus', duration: 50 * 60, xpReward: 100 }
};

const STORAGE_KEY_FOCUS_STATE = 'learnsphere_focus_state';
const STORAGE_KEY_FOCUS_GOALS = 'learnsphere_focus_goals';
const STORAGE_KEY_FOCUS_SESSIONS = 'learnsphere_focus_sessions';
const STORAGE_KEY_FOCUS_MINUTES = 'learnsphere_focus_minutes';

const FocusContext = createContext(null);

export function FocusProvider({ children, onSessionComplete }) {
  // Load saved state or default
  const [activeMode, setActiveMode] = useState(() => {
    const saved = getStoredData(STORAGE_KEY_FOCUS_STATE, null);
    return saved?.activeMode && FOCUS_MODES[saved.activeMode] ? saved.activeMode : 'pomodoro';
  });

  const [isRunning, setIsRunning] = useState(() => {
    const saved = getStoredData(STORAGE_KEY_FOCUS_STATE, null);
    return !!saved?.isRunning;
  });

  const [timeLeft, setTimeLeft] = useState(() => {
    const saved = getStoredData(STORAGE_KEY_FOCUS_STATE, null);
    if (!saved) return FOCUS_MODES.pomodoro.duration;

    // If was running, calculate elapsed time using targetEndTime
    if (saved.isRunning && saved.targetEndTime) {
      const remainingMs = saved.targetEndTime - Date.now();
      const remainingSec = Math.max(0, Math.round(remainingMs / 1000));
      return remainingSec;
    }
    return typeof saved.timeLeft === 'number' ? saved.timeLeft : FOCUS_MODES[saved.activeMode || 'pomodoro'].duration;
  });

  const [targetEndTime, setTargetEndTime] = useState(() => {
    const saved = getStoredData(STORAGE_KEY_FOCUS_STATE, null);
    return saved?.targetEndTime || null;
  });

  const [completedSessions, setCompletedSessions] = useState(() => {
    const val = getStoredData(STORAGE_KEY_FOCUS_SESSIONS, 3);
    return typeof val === 'number' ? val : parseInt(val || '3', 10) || 3;
  });

  const [minutesFocused, setMinutesFocused] = useState(() => {
    const val = getStoredData(STORAGE_KEY_FOCUS_MINUTES, 75);
    return typeof val === 'number' ? val : parseInt(val || '75', 10) || 75;
  });

  // Goals
  const [goals, setGoals] = useState(() => {
    return getStoredData(STORAGE_KEY_FOCUS_GOALS, [
      { id: 1, text: 'Review Binary Search Tree implementations', completed: true },
      { id: 2, text: 'Watch Lesson 5 in Java Masterclass', completed: false },
      { id: 3, text: 'Solve 2 practice questions in Quiz center', completed: false }
    ]);
  });

  const isHandlingCompletion = useRef(false);

  // Sync goals to storage
  useEffect(() => {
    setStoredData(STORAGE_KEY_FOCUS_GOALS, goals);
  }, [goals]);

  // Handle Session Completion
  const completeSession = useCallback(() => {
    if (isHandlingCompletion.current) return;
    isHandlingCompletion.current = true;

    setIsRunning(false);
    setTargetEndTime(null);

    sound.playTimerBell();

    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // Safe fallback
    }

    const modeConfig = FOCUS_MODES[activeMode] || FOCUS_MODES.pomodoro;
    const sessionMins = Math.round(modeConfig.duration / 60);

    const newSessions = completedSessions + 1;
    const newMins = minutesFocused + sessionMins;
    setCompletedSessions(newSessions);
    setMinutesFocused(newMins);
    setStoredData(STORAGE_KEY_FOCUS_SESSIONS, newSessions);
    setStoredData(STORAGE_KEY_FOCUS_MINUTES, newMins);

    // Award XP
    if (modeConfig.xpReward > 0) {
      const currentXP = parseInt(localStorage.getItem('learnsphere_user_xp') || '4850', 10);
      const newXP = currentXP + modeConfig.xpReward;
      localStorage.setItem('learnsphere_user_xp', newXP.toString());
    }

    // Browser desktop notification if permitted
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification('🎉 Focus Session Complete!', {
          body: `Awesome focus! Completed ${modeConfig.label} session (+${modeConfig.xpReward} XP). Time for a well-earned break.`,
          icon: '/favicon.svg'
        });
      } catch {
        // Ignore notification errors
      }
    }

    if (typeof onSessionComplete === 'function') {
      onSessionComplete({
        mode: activeMode,
        label: modeConfig.label,
        xpReward: modeConfig.xpReward,
        durationMinutes: sessionMins
      });
    }

    // Auto transition to break or work
    const nextMode = (activeMode === 'pomodoro' || activeMode === 'deepWork') ? 'shortBreak' : 'pomodoro';
    const nextDuration = FOCUS_MODES[nextMode].duration;
    setActiveMode(nextMode);
    setTimeLeft(nextDuration);

    setTimeout(() => {
      isHandlingCompletion.current = false;
    }, 1000);
  }, [activeMode, completedSessions, minutesFocused, onSessionComplete]);

  // Main Timer Interval with Timestamp Precision
  useEffect(() => {
    let interval = null;

    if (isRunning && targetEndTime) {
      const checkTimer = () => {
        const remainingMs = targetEndTime - Date.now();
        const remainingSec = Math.max(0, Math.round(remainingMs / 1000));
        setTimeLeft(remainingSec);

        if (remainingSec <= 0) {
          completeSession();
        }
      };

      // Run immediate check
      checkTimer();
      interval = setInterval(checkTimer, 500);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, targetEndTime, completeSession]);

  // Handle visibility change (tab minimizing/backgrounding) to immediately resync
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isRunning && targetEndTime) {
        const remainingMs = targetEndTime - Date.now();
        const remainingSec = Math.max(0, Math.round(remainingMs / 1000));
        setTimeLeft(remainingSec);
        if (remainingSec <= 0) {
          completeSession();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleVisibilityChange);
    };
  }, [isRunning, targetEndTime, completeSession]);

  // Persist State to LocalStorage
  useEffect(() => {
    setStoredData(STORAGE_KEY_FOCUS_STATE, {
      activeMode,
      isRunning,
      timeLeft,
      targetEndTime,
      duration: FOCUS_MODES[activeMode]?.duration || FOCUS_MODES.pomodoro.duration
    });
  }, [activeMode, isRunning, timeLeft, targetEndTime]);

  // Control Actions
  const startTimer = useCallback(() => {
    sound.playClick();
    const durationToRun = timeLeft > 0 ? timeLeft : FOCUS_MODES[activeMode].duration;
    const newTarget = Date.now() + durationToRun * 1000;
    setTargetEndTime(newTarget);
    setIsRunning(true);
  }, [timeLeft, activeMode]);

  const pauseTimer = useCallback(() => {
    sound.playClick();
    if (targetEndTime) {
      const remainingMs = targetEndTime - Date.now();
      const remainingSec = Math.max(0, Math.round(remainingMs / 1000));
      setTimeLeft(remainingSec);
    }
    setTargetEndTime(null);
    setIsRunning(false);
  }, [targetEndTime]);

  const toggleTimer = useCallback(() => {
    if (isRunning) {
      pauseTimer();
    } else {
      startTimer();
    }
  }, [isRunning, pauseTimer, startTimer]);

  const resetTimer = useCallback(() => {
    sound.playClick();
    setIsRunning(false);
    setTargetEndTime(null);
    setTimeLeft(FOCUS_MODES[activeMode].duration);
  }, [activeMode]);

  const skipTimer = useCallback(() => {
    sound.playClick();
    completeSession();
  }, [completeSession]);

  const changeMode = useCallback((newMode) => {
    if (!FOCUS_MODES[newMode]) return;
    sound.playClick();
    setIsRunning(false);
    setTargetEndTime(null);
    setActiveMode(newMode);
    setTimeLeft(FOCUS_MODES[newMode].duration);
  }, []);

  // Goal operations
  const addGoal = useCallback((text) => {
    if (!text?.trim()) return;
    sound.playClick();
    setGoals(prev => [
      ...prev,
      { id: Date.now(), text: text.trim(), completed: false }
    ]);
  }, []);

  const toggleGoal = useCallback((id) => {
    sound.playClick();
    setGoals(prev => prev.map(g => (g.id === id ? { ...g, completed: !g.completed } : g)));
  }, []);

  const deleteGoal = useCallback((id) => {
    sound.playClick();
    setGoals(prev => prev.filter(g => g.id !== id));
  }, []);

  // Computed values
  const totalDuration = FOCUS_MODES[activeMode]?.duration || FOCUS_MODES.pomodoro.duration;
  const progressPct = Math.min(100, Math.max(0, ((totalDuration - timeLeft) / totalDuration) * 100));
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <FocusContext.Provider
      value={{
        activeMode,
        modes: FOCUS_MODES,
        MODES: FOCUS_MODES,
        timeLeft,
        totalDuration,
        progressPct,
        formattedTime,
        isRunning,
        completedSessions,
        minutesFocused,

        // Actions
        startTimer,
        pauseTimer,
        toggleTimer,
        resetTimer,
        skipTimer,
        changeMode,
        setMode: changeMode,

        // Goals
        goals,
        addGoal,
        toggleGoal,
        deleteGoal
      }}
    >
      {children}
    </FocusContext.Provider>
  );
}

export function useFocus() {
  const context = useContext(FocusContext);
  if (!context) {
    throw new Error('useFocus must be used within a FocusProvider');
  }
  return context;
}
