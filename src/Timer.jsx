import React, { useState, useRef } from 'react';
import './Timer.css';
import finishSound from './assets/victory.mp3';
import breakEndSound from './assets/beep.mp3';

const Timer = () => {
  const initialTime = { hours: 0, minutes: 0, seconds: 1 };
  const initialBreakTime = { hours: 0, minutes: 0, seconds: 3 };

  const [editableTime, setEditableTime] = useState(initialTime);
  const [editableBreakTime, setEditableBreakTime] = useState(initialBreakTime);
  const [currentTime, setCurrentTime] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreakTime, setIsBreakTime] = useState(false);
  const intervalIdRef = useRef(null);

  const finishAudio = new Audio(finishSound);
  const breakEndAudio = new Audio(breakEndSound);


  const startSession = (time, onComplete) => {
    if (isRunning) return;

    setCurrentTime(time);
    setIsRunning(true);

    intervalIdRef.current = setInterval(() => {
      setCurrentTime((prevTime) => {
        let { hours, minutes, seconds } = prevTime;

        if (seconds === 0) {
          if (minutes === 0) {
            if (hours === 0) {
              clearInterval(intervalIdRef.current);
              setIsRunning(false);
              onComplete();
              return { ...prevTime };
            } else {
              hours -= 1;
              minutes = 59;
            }
          } else {
            minutes -= 1;
          }
          seconds = 59;
        } else {
          seconds -= 1;
        }

        return { hours, minutes, seconds };
      });
    }, 1000);
  };

  const startWork = () => {
    startSession(editableTime, () => {
      finishAudio.play();
      startBreak();
    });
    saveSessionData();
  };

  const startBreak = () => {
    setIsBreakTime(true);
    startSession(editableBreakTime, () => {
      breakEndAudio.play();
      setIsBreakTime(false);
    });
  };

  const resetTimer = () => {
    clearInterval(intervalIdRef.current);
    setIsRunning(false);
    setIsBreakTime(false);
    setCurrentTime(editableTime);
  };

  const handleTimeChange = (unit, value) => {
    setEditableTime((prevTime) => ({
      ...prevTime,
      [unit]: value,
    }));
  };

  const handleBreakTimeChange = (unit, value) => {
    setEditableBreakTime((prevTime) => ({
      ...prevTime,
      [unit]: value,
    }));
  };

  const formatTime = (h, m, s) => {
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const saveSessionData = async () => {
    const workTimeFormatted = formatTime(editableTime.hours, editableTime.minutes, editableTime.seconds);
    const breakTimeFormatted = formatTime(editableBreakTime.hours, editableBreakTime.minutes, editableBreakTime.seconds);

    console.log('Sending workTime:', workTimeFormatted);
    console.log('Sending breakTime:', breakTimeFormatted);

    try {
      const response = await fetch('http://localhost:5172/api/save-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          work_time: workTimeFormatted,
          break_time: breakTimeFormatted,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Failed to save session:', errorData.message);
        return;
      }

      const data = await response.json();
      console.log('Session saved:', data.record);
    } catch (error) {
      console.error('Error sending session data to server:', error);
    }
  };
  return (
    <div className="timer-container">
  {isBreakTime && (
    <div className="break-notice">
      <h2>Break Time</h2>
    </div>
  )}

  <div className={`timer-tomato ${isBreakTime ? 'break' : ''}`}>
    <p className="timer-text">{formatTime(currentTime.hours, currentTime.minutes, currentTime.seconds)}</p>
  </div>

  <div className="buttons-container">
    <button
      className="start-btn"
      onClick={startWork}
      disabled={isRunning || isBreakTime}
    >
      Start Work Time
    </button>
    <button className="reset-btn" onClick={resetTimer}>
      Reset
    </button>
  </div>

  <div className="time-input-container">
    <label htmlFor="hours-select">Work Time (Hours):</label>
    <select
      id="hours-select"
      value={editableTime.hours}
      onChange={(e) => handleTimeChange('hours', parseInt(e.target.value))}
      disabled={isRunning}
    >
      {[...Array(24).keys()].map((h) => (
        <option key={h} value={h}>
          {String(h).padStart(2, '0')}
        </option>
      ))}
    </select>

    <label htmlFor="minutes-select">Work Time (Minutes):</label>
    <select
      id="minutes-select"
      value={editableTime.minutes}
      onChange={(e) => handleTimeChange('minutes', parseInt(e.target.value))}
      disabled={isRunning}
    >
      {[...Array(60).keys()].map((m) => (
        <option key={m} value={m}>
          {String(m).padStart(2, '0')}
        </option>
      ))}
    </select>

    <label htmlFor="seconds-select">Work Time (Seconds):</label>
    <select
      id="seconds-select"
      value={editableTime.seconds}
      onChange={(e) => handleTimeChange('seconds', parseInt(e.target.value))}
      disabled={isRunning}
    >
      {[...Array(60).keys()].map((s) => (
        <option key={s} value={s}>
          {String(s).padStart(2, '0')}
        </option>
      ))}
    </select>
  </div>

  <div className="time-input-container">
    <label htmlFor="break-hours-select">Break Time (Hours):</label>
    <select
      id="break-hours-select"
      value={editableBreakTime.hours}
      onChange={(e) => handleBreakTimeChange('hours', parseInt(e.target.value))}
      disabled={isRunning}
    >
      {[...Array(24).keys()].map((h) => (
        <option key={h} value={h}>
          {String(h).padStart(2, '0')}
        </option>
      ))}
    </select>

    <label htmlFor="break-minutes-select">Break Time (Minutes):</label>
    <select
      id="break-minutes-select"
      value={editableBreakTime.minutes}
      onChange={(e) => handleBreakTimeChange('minutes', parseInt(e.target.value))}
      disabled={isRunning}
    >
      {[...Array(60).keys()].map((m) => (
        <option key={m} value={m}>
          {String(m).padStart(2, '0')}
        </option>
      ))}
    </select>

    <label htmlFor="break-seconds-select">Break Time (Seconds):</label>
    <select
      id="break-seconds-select"
      value={editableBreakTime.seconds}
      onChange={(e) => handleBreakTimeChange('seconds', parseInt(e.target.value))}
      disabled={isRunning}
    >
      {[...Array(60).keys()].map((s) => (
        <option key={s} value={s}>
          {String(s).padStart(2, '0')}
        </option>
      ))}
    </select>
  </div>
</div>

  );
};

export default Timer;
