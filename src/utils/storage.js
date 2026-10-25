import { DEMO_COURSES } from '../data/demoCourses';
import { DEMO_ASSIGNMENTS } from '../data/demoAssignments';
import { DEMO_QUIZZES } from '../data/demoQuizzes';
import { DEMO_NOTES } from '../data/demoNotes';
import { DEMO_ANNOUNCEMENTS } from '../data/demoAnnouncements';
import { DEMO_ACHIEVEMENTS } from '../data/demoAchievements';
import { DEMO_PLANNER_TASKS } from '../data/demoPlanner';

export const STORAGE_KEYS = {
  USER: 'learnsphere_user',
  COURSES: 'learnsphere_courses',
  ENROLLED: 'learnsphere_enrolled',
  PROGRESS: 'learnsphere_progress',
  ASSIGNMENTS: 'learnsphere_assignments',
  QUIZZES: 'learnsphere_quizzes',
  NOTES: 'learnsphere_notes',
  ANNOUNCEMENTS: 'learnsphere_announcements',
  NOTIFICATIONS: 'learnsphere_notifications',
  THEME: 'learnsphere_theme',
  ACHIEVEMENTS: 'learnsphere_achievements',
  PLANNER: 'learnsphere_planner',
  BOOKMARKS: 'learnsphere_bookmarks',
  WATCH_LATER: 'learnsphere_watch_later',
  INTRO_SEEN: 'learnsphere_intro_seen'
};

export const DEFAULT_USER = {
  id: 'usr-vibhanshu',
  name: 'Vibhanshu Jain',
  email: 'vibhanshu@learnsphere.edu',
  role: 'Student / Scholar',
  studentId: 'STU-2026-8849',
  branch: 'Computer Science & Engineering',
  semester: '6th Semester',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  bio: 'Passionate full-stack developer, algorithmic problem solver, and AI enthusiast aiming to build impactful educational tech.',
  gpa: '4.8',
  enrolledCourses: ['java-programming', 'react-development'],
  streak: 7,
  totalLearningHours: 28.5
};

export function getStoredData(key, fallback) {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.error(`Error reading ${key} from localStorage:`, e);
    return fallback;
  }
}

export function setStoredData(key, value) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error writing ${key} to localStorage:`, e);
  }
}

// Reset all demo data to fresh initial state
export function resetDemoData() {
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(DEFAULT_USER));
  localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(DEMO_COURSES) || []);
  localStorage.setItem(STORAGE_KEYS.ENROLLED, JSON.stringify(['java-programming', 'react-development']));
  localStorage.setItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify(DEMO_ASSIGNMENTS));
  localStorage.setItem(STORAGE_KEYS.QUIZZES, JSON.stringify(DEMO_QUIZZES));
  localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(DEMO_NOTES));
  localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(DEMO_ANNOUNCEMENTS));
  localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(DEMO_ACHIEVEMENTS));
  localStorage.setItem(STORAGE_KEYS.PLANNER, JSON.stringify(DEMO_PLANNER_TASKS));
  localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(['react-l7', 'java-l10']));
  localStorage.setItem(STORAGE_KEYS.WATCH_LATER, JSON.stringify(['dsa-l6', 'db-l4']));
}
