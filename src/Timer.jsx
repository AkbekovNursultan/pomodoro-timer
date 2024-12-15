import React, { useState, useEffect } from 'react';
import './Timer.css';

const Timer = () => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="timer-container">
      <div className="timer-tomato">
        <p className="timer-text">{seconds}</p>
      </div>
    </div>
  );
};

export default Timer;
