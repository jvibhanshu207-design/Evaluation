import React, {
  createContext,
  useContext,
  useState,
  useEffect
} from 'react';

import { DEMO_COURSES } from '../data/demoCourses';
import {
  STORAGE_KEYS,
  getStoredData,
  setStoredData
} from '../utils/storage';

import { sound } from '../utils/sound';

const CourseContext = createContext();

export function CourseProvider({ children }) {

  // Courses with price preservation
  const [courses, setCourses] = useState(() => {
    const raw = getStoredData(STORAGE_KEYS.COURSES, DEMO_COURSES);
    const demoMap = new Map(DEMO_COURSES.map(c => [c.id, c]));
    return raw.map(c => {
      const demo = demoMap.get(c.id) || {};
      return {
        ...c,
        price: c.price ?? demo.price ?? 49.99,
        originalPrice: c.originalPrice ?? demo.originalPrice ?? 89.99
      };
    });
  });

  // Enrolled courses
  const [enrolledCourseIds, setEnrolledCourseIds] = useState(() =>
    getStoredData(STORAGE_KEYS.ENROLLED, [
      'java-programming',
      'react-development'
    ])
  );

  // Bookmarks
  const [bookmarks, setBookmarks] = useState(() =>
    getStoredData(STORAGE_KEYS.BOOKMARKS, [
      'react-l7',
      'java-l10'
    ])
  );

  // Watch later
  const [watchLater, setWatchLater] = useState(() =>
    getStoredData(STORAGE_KEYS.WATCH_LATER, [
      'dsa-l6',
      'db-l4'
    ])
  );

  // Sync courses with LocalStorage
  useEffect(() => {
    setStoredData(STORAGE_KEYS.COURSES, courses);
  }, [courses]);

  // Sync enrolled courses
  useEffect(() => {
    setStoredData(STORAGE_KEYS.ENROLLED, enrolledCourseIds);
  }, [enrolledCourseIds]);

  // Sync bookmarks
  useEffect(() => {
    setStoredData(STORAGE_KEYS.BOOKMARKS, bookmarks);
  }, [bookmarks]);

  // Sync watch later
  useEffect(() => {
    setStoredData(STORAGE_KEYS.WATCH_LATER, watchLater);
  }, [watchLater]);

  // Check whether user is enrolled
  const isEnrolled = (courseId) => {
    return enrolledCourseIds.includes(courseId);
  };

  // Enroll in a course
  const enrollCourse = (courseId) => {
    if (!enrolledCourseIds.includes(courseId)) {
      setEnrolledCourseIds(prev => [
        ...prev,
        courseId
      ]);
      sound.playFanfare();
      return true;
    }
    return false;
  };

  // Toggle bookmark on a lesson
  const toggleBookmark = (lessonId) => {
    setBookmarks(prev => {
      const exists = prev.includes(lessonId);
      sound.playClick();
      return exists
        ? prev.filter(id => id !== lessonId)
        : [...prev, lessonId];
    });
  };

  // Check whether lesson is bookmarked
  const isBookmarked = (lessonId) => {
    return bookmarks.includes(lessonId);
  };

  // Toggle Watch Later
  const toggleWatchLater = (lessonId) => {
    setWatchLater(prev => {
      const exists = prev.includes(lessonId);
      sound.playClick();
      return exists
        ? prev.filter(id => id !== lessonId)
        : [...prev, lessonId];
    });
  };

  // Check whether lesson is in Watch Later
  const isWatchLater = (lessonId) => {
    return watchLater.includes(lessonId);
  };

  // Mark lesson complete or incomplete
  const markLessonComplete = (
    courseId,
    lessonId,
    completed = true
  ) => {
    let newlyFinishedCourse = false;

    setCourses(prevCourses => {
      return prevCourses.map(course => {
        if (course.id !== courseId) {
          return course;
        }

        const modules = Array.isArray(course.modules)
          ? course.modules
          : [];

        const updatedModules = modules.map(module => {
          const lessons = Array.isArray(module?.lessons)
            ? module.lessons
            : [];

          return {
            ...module,
            lessons: lessons.map(lesson => {
              if (lesson.id === lessonId) {
                return {
                  ...lesson,
                  completed
                };
              }
              return lesson;
            })
          };
        });

        // Calculate course completion
        const allLessons = updatedModules.flatMap(
          module => module.lessons || []
        );

        const total = allLessons.length;
        const doneCount = allLessons.filter(
          lesson => lesson.completed
        ).length;

        newlyFinishedCourse =
          total > 0 && doneCount === total;

        return {
          ...course,
          modules: updatedModules
        };
      });
    });

    if (completed) {
      sound.playClick();
    }

    return {
      newlyFinishedCourse
    };
  };

  // Get course statistics
  const getCourseStats = (courseId) => {
    const course = courses.find(
      c => c.id === courseId
    );

    if (!course) {
      return {
        totalLessons: 0,
        completedLessons: 0,
        progress: 0,
        isCompleted: false
      };
    }

    let totalLessons = 0;
    let completedLessons = 0;

    const modules = Array.isArray(course.modules)
      ? course.modules
      : [];

    modules.forEach(module => {
      const lessons = Array.isArray(module?.lessons)
        ? module.lessons
        : [];

      lessons.forEach(lesson => {
        totalLessons++;
        if (lesson?.completed) {
          completedLessons++;
        }
      });
    });

    const progress = totalLessons > 0
      ? Math.round(
          (completedLessons / totalLessons) * 100
        )
      : 0;

    return {
      totalLessons,
      completedLessons,
      progress,
      isCompleted:
        totalLessons > 0 &&
        completedLessons === totalLessons
    };
  };

  // Get next lesson
  const getNextLesson = (
    courseId,
    currentLessonId
  ) => {
    const course = courses.find(
      c => c.id === courseId
    );

    if (!course) {
      return null;
    }

    const modules = Array.isArray(course.modules)
      ? course.modules
      : [];

    const allLessons = modules.flatMap(module =>
      Array.isArray(module?.lessons)
        ? module.lessons
        : []
    );

    const currentIndex = allLessons.findIndex(
      lesson => lesson.id === currentLessonId
    );

    if (
      currentIndex >= 0 &&
      currentIndex < allLessons.length - 1
    ) {
      return allLessons[currentIndex + 1];
    }

    return null;
  };

  // Get previous lesson
  const getPrevLesson = (
    courseId,
    currentLessonId
  ) => {
    const course = courses.find(
      c => c.id === courseId
    );

    if (!course) {
      return null;
    }

    const modules = Array.isArray(course.modules)
      ? course.modules
      : [];

    const allLessons = modules.flatMap(module =>
      Array.isArray(module?.lessons)
        ? module.lessons
        : []
    );

    const currentIndex = allLessons.findIndex(
      lesson => lesson.id === currentLessonId
    );

    if (currentIndex > 0) {
      return allLessons[currentIndex - 1];
    }

    return null;
  };

  // Get enrolled courses with statistics
  const enrolledCourses = courses
    .filter(course =>
      enrolledCourseIds.includes(course.id)
    )
    .map(course => ({
      ...course,
      stats: getCourseStats(course.id)
    }));

  // Provide context to the application
  return (
    <CourseContext.Provider
      value={{
        courses,
        enrolledCourseIds,
        enrolledCourses,

        isEnrolled,
        enrollCourse,
        markLessonComplete,
        getCourseStats,
        getNextLesson,
        getPrevLesson,

        bookmarks,
        toggleBookmark,
        isBookmarked,

        watchLater,
        toggleWatchLater,
        isWatchLater
      }}
    >
      {children}
    </CourseContext.Provider>
  );
}

// Custom hook
export function useCourses() {
  const context = useContext(CourseContext);

  if (!context) {
    throw new Error(
      'useCourses must be used within a CourseProvider'
    );
  }

  return context;
}
