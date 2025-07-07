// src/context/AuthContext.jsx
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("user"))
  );
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const resetTimer = () => {
    localStorage.removeItem("quizStartTime");
    setTimeLeft(0);
  };

  // Timer state (5 minutes = 300 seconds)
  const [timeLeft, setTimeLeft] = useState(() => {
    const storedStartTime = localStorage.getItem("quizStartTime");
    if (storedStartTime) {
      const elapsed = Math.floor((Date.now() - Number(storedStartTime)) / 1000);
      return Math.max(50 - elapsed, 0);
    }
    return 50;
  });

  useEffect(() => {
    if (user && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          const updated = prev - 1;
          if (updated <= 0) {
            clearInterval(timer);
            localStorage.removeItem("quizStartTime");
            return 0;
          }
          return updated;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [user, timeLeft]);

  // Set quiz start time only once
  const startQuizTimer = () => {
    if (!localStorage.getItem("quizStartTime")) {
      localStorage.setItem("quizStartTime", Date.now());
      setTimeLeft(50);
    }
  };

  const login = (userData, token) => {
    setUser(userData);
    setToken(token);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.clear();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        timeLeft,
        startQuizTimer,
        resetTimer,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
