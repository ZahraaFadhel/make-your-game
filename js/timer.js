
let timerDisplay = document.getElementById('timer');

let startTime;
let updatedTime;
let difference;

export let running = false;

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

export function clearTimer() {
  clearInterval(timerId);
  timerId = null;
}

// function stopTimer() {
//   clearInterval(timerId);
//   running = false;
//   startImg.src = "/img/continue.svg"; 
// }

function getShowTime() {
  updatedTime = new Date().getTime();
  difference = updatedTime - startTime;

  let minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  let seconds = Math.floor((difference % (1000 * 60)) / 1000);

  minutes = (minutes < 10) ? "0" + minutes : minutes;
  seconds = (seconds < 10) ? "0" + seconds : seconds;

  timerDisplay.textContent = minutes + ":" + seconds;
}

export function isRunning() {
  return !!timerId;
}