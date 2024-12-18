import React, { useState, useEffect } from 'react';
import './Timer.css';
import beepSound from './assets/beep.mp3';

const Timer = () => {
  const initialTime = 10;
  const [seconds, setSeconds] = useState(initialTime);
  const [editableTime, setEditableTime] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const audioCue = new Audio(beepSound);

  const startTimer = () => {
    if (!isRunning) {
      if (seconds === 0) {
        setSeconds(editableTime);
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
    setSeconds(editableTime);
    setIsRunning(false);
  };

  const handleEditStart = () => {
    if (!isRunning) {
      setIsEditing(true);
    }
  };

  const handleEditChange = (e) => {
    const newTime = Math.max(1, e.target.value);
    setEditableTime(newTime);
  };

  const handleEditBlur = () => {
    setIsEditing(false);
    setSeconds(editableTime);
  };

  const handleEditKeyDown = (e) => {
    if (e.key === 'Enter') {
      setIsEditing(false);
      setSeconds(editableTime);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  return (
    <div className="timer-container">
      <div
        className="timer-tomato"
        onClick={handleEditStart}
      >
        {isEditing ? (
          <input
            type="number"
            value={editableTime}
            onChange={handleEditChange}
            onBlur={handleEditBlur}
            onKeyDown={handleEditKeyDown}
            autoFocus
            min="1"
          />
        ) : (
          <p className="timer-text">{formatTime(seconds)}</p>
        )}
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
