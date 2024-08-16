
let timerDisplay = document.getElementById('timer');

let startTime;
let updatedTime;
let difference;

let timerId = null;
let timerStart = 0; // When the timer started
let currentTimerTime = 0; // Total elapsed time

export function startTimer() {
  const startTime = Date.now() - currentTimerTime;
  timerStart = startTime;

  timerId = setInterval(() => {
    const timeElapsed = Date.now() - timerStart;
    currentTimerTime = timeElapsed;

    let seconds = Math.floor((timeElapsed / 1000) % 60);
    let minutes = Math.floor((timeElapsed / (1000 * 60)) % 60);

    let formattedSeconds = seconds < 10 ? '0' + seconds : seconds;
    let formattedMinutes = minutes < 10 ? '0' + minutes : minutes;

    timerDisplay.innerText = `${formattedMinutes}:${formattedSeconds}`;
  }, 1000);
}

export function PauseTimer() {
  clearInterval(timerId);
  timerId = null;
}

export function isRunning() {
  return !!timerId;
}

export function resetTimer() {
  // Clear the current timer interval if it exists
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }

  // Reset the timer variables
  currentTimerTime = 0;
  timerStart = 0;

  // Update the display to show 00:00
  timerDisplay.innerText = '00:00';
}