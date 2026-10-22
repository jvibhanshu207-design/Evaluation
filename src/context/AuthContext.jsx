import React, { createContext, useContext, useState, useEffect } from 'react';
import { STORAGE_KEYS, DEFAULT_USER, getStoredData, setStoredData } from '../utils/storage';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStoredData(STORAGE_KEYS.USER, DEFAULT_USER));
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!getStoredData(STORAGE_KEYS.USER, DEFAULT_USER));

  useEffect(() => {
    if (user) {
      setStoredData(STORAGE_KEYS.USER, user);
      setIsAuthenticated(true);
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
      setIsAuthenticated(false);
    }
  }, [user]);

  const login = (email, password) => {
    // For demo purposes, allow demo user or create session
    const loggedUser = {
      ...DEFAULT_USER,
      email: email || DEFAULT_USER.email
    };
    setUser(loggedUser);
    return { success: true };
  };

  const loginAsDemo = () => {
    setUser(DEFAULT_USER);
    return { success: true };
  };

  const signup = ({ name, email, branch, semester }) => {
    const newUser = {
      ...DEFAULT_USER,
      id: `usr-${Date.now()}`,
      name: name || 'Student Scholar',
      email: email || 'student@learnsphere.edu',
      branch: branch || 'Computer Science & Engineering',
      semester: semester || '1st Semester',
      enrolledCourses: ['react-development', 'java-programming']
    };
    setUser(newUser);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = (updatedFields) => {
    setUser(prev => {
      const updated = { ...prev, ...updatedFields };
      setStoredData(STORAGE_KEYS.USER, updated);
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        loginAsDemo,
        signup,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
