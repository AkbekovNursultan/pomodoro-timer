import React, { useState, useEffect } from 'react';
import './Timer.css';
import beepSound from './assets/beep.mp3';
const initialTime = 10;

const Timer = () => {

  const [seconds, setSeconds] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);
  const [intervalId, setIntervalId] = useState(null);

  const audioCue = new Audio(beepSound);

  const startTimer = () => {
    if (!isRunning) {
      if (seconds === 0) {
        setSeconds(initialTime);
      }

      const id = setInterval(() => {
        setSeconds((prev) => {
          if (prev <= 0) {
            clearInterval(id);
            setIsRunning(false);
            audioCue.play();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      setIntervalId(id);
      setIsRunning(true);
    }
  };

  const resetTimer = () => {
    clearInterval(intervalId);
    setSeconds(initialTime);
    setIsRunning(false);
  };

  const formatTime = (time) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };


  return (
    <div className="timer-container">
      <div className="timer-tomato">
        <p className="timer-text">{formatTime(seconds)}</p>
      </div>
      <div className="buttons-container">
        <button className="start-btn" onClick={startTimer} disabled={isRunning}>
          Start
        </button>
        <button className="reset-btn" onClick={resetTimer}>
          Reset
        </button>
      </div>
    </div>
  );
};

export default Timer;
