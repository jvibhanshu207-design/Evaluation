export const DEMO_ANALYTICS = {
  overallProgress: 72,
  totalLearningHours: 28.5,
  activeCoursesCount: 6,
  completedCoursesCount: 0,
  completedAssignmentsCount: 12,
  pendingAssignmentsCount: 4,
  upcomingQuizzesCount: 2,
  streakDays: 7,
  weeklyActivity: [
    { day: "Mon", hours: 3.5, lessons: 3, date: "Sep 29" },
    { day: "Tue", hours: 4.2, lessons: 4, date: "Sep 30" },
    { day: "Wed", hours: 2.8, lessons: 2, date: "Oct 1" },
    { day: "Thu", hours: 5.1, lessons: 5, date: "Oct 2" },
    { day: "Fri", hours: 3.9, lessons: 3, date: "Oct 3" },
    { day: "Sat", hours: 4.5, lessons: 4, date: "Oct 4" },
    { day: "Sun", hours: 4.5, lessons: 3, date: "Oct 5" }
  ],
  courseProgressBreakdown: [
    { id: "react-development", name: "React 19 & Next-Gen Frontend", progress: 60, hours: 8.5 },
    { id: "java-programming", name: "Java Programming Masterclass", progress: 30, hours: 6.0 },
    { id: "data-structures", name: "Data Structures & Algorithms", progress: 22, hours: 4.5 },
    { id: "python-fundamentals", name: "Python 3 Fundamentals", progress: 25, hours: 3.5 },
    { id: "database-management", name: "Database Management & SQL", progress: 25, hours: 3.0 },
    { id: "web-development", name: "Web Development Bootcamp", progress: 25, hours: 3.0 }
  ],
  quizAccuracy: {
    average: 84,
    totalTaken: 5,
    categories: [
      { name: "React Hooks", score: 80 },
      { name: "Python Basics", score: 90 },
      { name: "SQL Queries", score: 85 },
      { name: "Java Basics", score: 75 },
      { name: "DSA Complexity", score: 90 }
    ]
  },
  motivationalQuotes: [
    { text: "Small progress every day leads to extraordinary results.", author: "Robin Sharma" },
    { text: "The expert in anything was once a beginner.", author: "Helen Hayes" },
    { text: "Knowledge has a beginning but no end.", author: "Geeta Iyengar" },
    { text: "Code is like humor. When you have to explain it, it’s bad.", author: "Cory House" },
    { text: "Continuous learning is the minimum requirement for success in any field.", author: "Brian Tracy" }
  ]
};
