let timerDisplay = document.getElementById('timer');

let startTime;
let updatedTime;
let difference;
let interval;
export let running = false;

export const startBtn = document.querySelector('.continue');
const startImg = startBtn.querySelector('img');

startImg.src = "/img/continue.svg"; // Set initial image

export function startTimer() {
  if (!running) {
    startTime = new Date().getTime(); // Return time in milliseconds
    interval = setInterval(getShowTime, 1); // Calls getShowTime every 1 millisecond
    running = true;
    startImg.src = "/img/pause.svg";
  } else {
    clearInterval(interval);
    running = false;
    startImg.src = "/img/continue.svg"; 
  }
}

function stopTimer() {
  clearInterval(interval);
  running = false;
  startImg.src = "/img/continue.svg"; 
}

function resetTimer() {
  clearInterval(interval);
  timerDisplay.textContent = "00:00";
  running = false;
  startImg.src = "/img/continue.svg";
}

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
  return running;
}