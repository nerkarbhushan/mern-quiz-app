// src/context/TimerContext.jsx
import { createContext, useState, useEffect } from "react";

export const TimerContext = createContext();

export const TimerProvider = ({ children }) => {
  const [timeLeft, setTimeLeft] = useState(null); // null = not started
  const [isRunning, setIsRunning] = useState(false);

  // Start the timer (5 minutes = 300 seconds)
  const startTimer = () => {
    setTimeLeft(150);
    setIsRunning(true);
  };

  // Stop and reset
  const resetTimer = () => {
    setTimeLeft(null);
    setIsRunning(false);
  };

  useEffect(() => {
    let interval;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  return (
    <TimerContext.Provider value={{ timeLeft, startTimer, resetTimer }}>
      {children}
    </TimerContext.Provider>
  );
};
