import React, { useState, useRef } from 'react';
import './Timer.css';
import finishSound from './assets/victory.mp3';
import breakEndSound from './assets/beep.mp3';

const Timer = function() {
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

  function startSession(time, onComplete) {
    if (isRunning) return;

    setCurrentTime(time);
    setIsRunning(true);

    intervalIdRef.current = setInterval(function() {
      setCurrentTime(function(prevTime) {
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
  }

  function startWork() {
    startSession(editableTime, onWorkComplete);
    saveSessionData();
  }

  function onWorkComplete() {
    finishAudio.play();
    startBreak();
  }

  function startBreak() {
    setIsBreakTime(true);
    startSession(editableBreakTime, onBreakComplete);
  }

  function onBreakComplete() {
    breakEndAudio.play();
    setIsBreakTime(false);
  }

  function resetTimer() {
    clearInterval(intervalIdRef.current);
    setIsRunning(false);
    setIsBreakTime(false);
    setCurrentTime(editableTime);
  }

  function handleTimeChange(unit, value) {
    console.log(unit);
    setEditableTime(function(prevTime) {
      return {
        ...prevTime,
        [unit]: value,
      };
    });
  }

  function handleBrTimeChange(unit, value) {
    console.log(unit);
    setEditableBreakTime(function(prevTime) {
      return {
        ...prevTime,
        [unit]: value,
      };
    });
  }

  function handleWorkTimeChange(event) {
    const { value, id } = event.target;
    console.log(event.target);
    const unit = id.split('-')[0];
    handleTimeChange(unit, parseInt(value));
  }

  function handleBreakTimeChange(event) {
    const { value, id } = event.target;
    const unit = id.split('-')[1];
    handleBrTimeChange(unit, parseInt(value));
  }

  function formatTime(h, m, s) {
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  async function saveSessionData() {
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
          break_time: breakTimeFormatted
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
  }

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
          onChange={handleWorkTimeChange}
          disabled={isRunning}
        >
          {[...Array(24).keys()].map(function(h) {
            return (
              <option key={h} value={h}>
                {String(h).padStart(2, '0')}
              </option>
            );
          })}
        </select>

        <label htmlFor="minutes-select">Work Time (Minutes):</label>
        <select
          id="minutes-select"
          value={editableTime.minutes}
          onChange={handleWorkTimeChange}
          disabled={isRunning}
        >
          {[...Array(60).keys()].map(function(m) {
            return (
              <option key={m} value={m}>
                {String(m).padStart(2, '0')}
              </option>
            );
          })}
        </select>

        <label htmlFor="seconds-select">Work Time (Seconds):</label>
        <select
          id="seconds-select"
          value={editableTime.seconds}
          onChange={handleWorkTimeChange}
          disabled={isRunning}
        >
          {[...Array(60).keys()].map(function(s) {
            return (
              <option key={s} value={s}>
                {String(s).padStart(2, '0')}
              </option>
            );
          })}
        </select>
      </div>

      <div className="time-input-container">
        <label htmlFor="break-hours-select">Break Time (Hours):</label>
        <select
          id="break-hours-select"
          value={editableBreakTime.hours}
          onChange={handleBreakTimeChange}
          disabled={isRunning}
        >
          {[...Array(24).keys()].map(function(h) {
            return (
              <option key={h} value={h}>
                {String(h).padStart(2, '0')}
              </option>
            );
          })}
        </select>

        <label htmlFor="break-minutes-select">Break Time (Minutes):</label>
        <select
          id="break-minutes-select"
          value={editableBreakTime.minutes}
          onChange={handleBreakTimeChange}
          disabled={isRunning}
        >
          {[...Array(60).keys()].map(function(m) {
            return (
              <option key={m} value={m}>
                {String(m).padStart(2, '0')}
              </option>
            );
          })}
        </select>

        <label htmlFor="break-seconds-select">Break Time (Seconds):</label>
        <select
          id="break-seconds-select"
          value={editableBreakTime.seconds}
          onChange={handleBreakTimeChange}
          disabled={isRunning}
        >
          {[...Array(60).keys()].map(function(s) {
            return (
              <option key={s} value={s}>
                {String(s).padStart(2, '0')}
              </option>
            );
          })}
        </select>
      </div>
    </div>
  );
};

export default Timer;
