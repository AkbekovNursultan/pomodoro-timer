import React, { useState, useEffect } from 'react';
import './Timer.css';

const Timer = () => {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [intervalId, setIntervalId] = useState(null);

  const startTimer = () => {
    if (!isRunning) {
      const id = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
      setIntervalId(id);
      setIsRunning(true);
    }
  };

  const resetTimer = () => {
    clearInterval(intervalId);
    setSeconds(0);
    setIsRunning(false);
  };

  useEffect(() => {
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [intervalId]);

  return (
    <div className="timer-container">
      <div className="timer-tomato">
        <p className="timer-text">{`${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`}</p>
      </div>
      <div className="buttons-container">
        <button className="start-btn" onClick={startTimer} disabled={isRunning}>Start</button>
        <button className="reset-btn" onClick={resetTimer}>Reset</button>
      </div>
    </div>
  );
};

export default Timer;
