import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CourseProvider } from './context/CourseContext';
import { NotificationProvider } from './context/NotificationContext';
import { CartProvider } from './context/CartContext';

import MainLayout from './components/layout/MainLayout';
import CinematicIntro from './components/intro/CinematicIntro';

// Pages
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import CoursesPage from './pages/CoursesPage';
import CourseDetailPage from './pages/CourseDetailPage';
import ClassroomPage from './pages/ClassroomPage';
import MyLearningPage from './pages/MyLearningPage';
import AssignmentsPage from './pages/AssignmentsPage';
import QuizzesPage from './pages/QuizzesPage';
import NotesPage from './pages/NotesPage';
import AnnouncementsPage from './pages/AnnouncementsPage';
import ProgressPage from './pages/ProgressPage';
import PlannerPage from './pages/PlannerPage';
import AchievementsPage from './pages/AchievementsPage';
import SavedLessonsPage from './pages/SavedLessonsPage';
import ProfilePage from './pages/ProfilePage';
import SmartLearningPage from './pages/SmartLearningPage';
import FocusRoomPage from './pages/FocusRoomPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import NotFoundPage from './pages/NotFoundPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import PaymentPage from './pages/PaymentPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import MyCoursesPage from './pages/MyCoursesPage';


export default function App() {
  const [showIntro, setShowIntro] = useState(() => {
    if (typeof window !== 'undefined') {
      const seen = sessionStorage.getItem('learnsphere_intro_seen');
      return !seen; // Show intro on first visit
    }
    return true;
  });

  const handleCompleteIntro = () => {
    sessionStorage.setItem('learnsphere_intro_seen', 'true');
    setShowIntro(false);
  };

  const handleReplayIntro = () => {
    setShowIntro(true);
  };

  return (
    <ThemeProvider>
      <AuthProvider>
        <CourseProvider>
          <CartProvider>
            <NotificationProvider>
              {showIntro && <CinematicIntro onComplete={handleCompleteIntro} />}

            <BrowserRouter>
              <Routes>
                {/* Standalone Auth Pages */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />

                {/* Main App Layout */}
                <Route element={<MainLayout onReplayIntro={handleReplayIntro} />}>
                  <Route path="/" element={<LandingPage onReplayIntro={handleReplayIntro} />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/courses" element={<CoursesPage />} />
                  <Route path="/courses/:courseId" element={<CourseDetailPage />} />
                  <Route path="/learn/:courseId" element={<ClassroomPage />} />
                  <Route path="/learn/:courseId/lesson/:lessonId" element={<ClassroomPage />} />
                  <Route path="/my-learning" element={<MyLearningPage />} />
                  <Route path="/assignments" element={<AssignmentsPage />} />
                  <Route path="/quizzes" element={<QuizzesPage />} />
                  <Route path="/notes" element={<NotesPage />} />
                  <Route path="/announcements" element={<AnnouncementsPage />} />
                  <Route path="/progress" element={<ProgressPage />} />
                  <Route path="/smart-learning" element={<SmartLearningPage />} />
                  <Route path="/focus-room" element={<FocusRoomPage />} />
                  <Route path="/planner" element={<PlannerPage />} />
                  <Route path="/achievements" element={<AchievementsPage />} />
                  <Route path="/saved" element={<SavedLessonsPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/payment" element={<PaymentPage />} />
                  <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
                  <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />
                  <Route path="/my-courses" element={<MyCoursesPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </NotificationProvider>
        </CartProvider>
      </CourseProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
