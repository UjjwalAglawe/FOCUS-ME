import React, { useState, useEffect } from 'react';

const Timer = () => {
  const [minutes, setMinutes] = useState('');
  const [seconds, setSeconds] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [initialTime, setInitialTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  // On mount: check if a timer is already running and resume it
  useEffect(() => {
    chrome.storage.local.get("focusEndTime", ({ focusEndTime }) => {
      if (focusEndTime) {
        const remaining = Math.floor((focusEndTime - Date.now()) / 1000);
        if (remaining > 0) {
          setTimeLeft(remaining);
          setIsRunning(true);
        } else {
          chrome.storage.local.remove("focusEndTime");
          setTimeLeft(0);
          setIsRunning(false);
        }
      }
    });
  }, []);

  // Tick timer every second if running
  useEffect(() => {
    let interval = null;

    if (isRunning) {
      interval = setInterval(() => {
        chrome.storage.local.get("focusEndTime", ({ focusEndTime }) => {
          if (focusEndTime) {
            const remaining = Math.floor((focusEndTime - Date.now()) / 1000);
            if (remaining > 0) {
              setTimeLeft(remaining);
            } else {
              setTimeLeft(0);
              setIsRunning(false);
              chrome.storage.local.remove("focusEndTime");
            }
          }
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning]);

  const handleStart = () => {
    const min = parseInt(minutes, 10) || 0;
    const sec = parseInt(seconds, 10) || 0;
    const totalSeconds = min * 60 + sec;

    if (totalSeconds > 0) {
      const endTime = Date.now() + totalSeconds * 1000;

      chrome.storage.local.set({ focusEndTime: endTime }, () => {
        console.log("Focus timer started until", new Date(endTime));
      });

      setInitialTime(totalSeconds);
      setTimeLeft(totalSeconds);
      setIsRunning(true);
    }
  };

  const handleStop = () => {
    setIsRunning(false);
    chrome.storage.local.remove("focusEndTime", () => {
      chrome.storage.local.get("focusEndTime", (data) => {
        console.log("After stop, focusEndTime =", data.focusEndTime); // Should be undefined
      });

      // Close all tabs that show focus.html
      chrome.tabs.query({}, (tabs) => {
        tabs.forEach((tab) => {
          if (tab.url && tab.url.includes("focus.html")) {
            chrome.tabs.remove(tab.id);
          }
        });
      });
    });
  };


  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(0);
    setMinutes('');
    setSeconds('');
    chrome.storage.local.remove("focusEndTime", () => {
      chrome.storage.local.get("focusEndTime", (data) => {
        console.log("After reset, focusEndTime =", data.focusEndTime); // Should be undefined
      });

      // Close all tabs that show focus.html
      chrome.tabs.query({}, (tabs) => {
        tabs.forEach((tab) => {
          if (tab.url && tab.url.includes("focus.html")) {
            chrome.tabs.remove(tab.id);
          }
        });
      });
    });
  };



  const formatTime = (totalSeconds) => {
    const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="text-center p-6 text-white">
      <h2 className="text-2xl font-semibold mb-4">⏳ Focus Timer</h2>

      <div className="flex justify-center gap-4 mb-4">
        <input
          type="number"
          placeholder="Minutes"
          value={minutes}
          onChange={(e) => setMinutes(e.target.value)}
          disabled={isRunning}
          className="w-24 p-2 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="number"
          placeholder="Seconds"
          value={seconds}
          onChange={(e) => setSeconds(e.target.value)}
          disabled={isRunning}
          className="w-24 p-2 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={handleStart}
          disabled={isRunning}
          className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 disabled:opacity-50"
        >
          Start
        </button>
        <button
          onClick={handleStop}
          disabled={!isRunning}
          className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 disabled:opacity-50"
        >
          Stop
        </button>
        <button
          onClick={handleReset}
          className="px-4 py-2 rounded bg-yellow-500 hover:bg-yellow-600"
        >
          Reset
        </button>
      </div>

      <div className="text-4xl font-mono">{formatTime(timeLeft)}</div>
    </div>
  );

};

export default Timer;
