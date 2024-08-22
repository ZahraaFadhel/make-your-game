import {squares, layout, width, scoreDisplay, moveInterval} from './setup.js';
import {startTimer, isRunning, PauseTimer, resetTimer,getCurrentTimerTime } from './timer.js';
import {setGhosts, ghosts, moveGhosts, unScareGhosts } from './ghosts.js';
import {showScoreboard} from './scoreboard.js';

let totalDots = 0;
let lastMoveTime = 0;
let score = 0;
let directionX = 0;
let directionY = 0;
let animationFrameId;
let pacmanCurrentIndex = 490
let lives =3
let gamePaused = false;
let currentTimerTime = 0;
let eatenDots=0;
let pacmanImg;
let playerData = {};


const grid = document.getElementById('grid');
const restartButton = document.querySelector('.restart');

createBoard()
SetPacman()
setGhosts(squares)

// MENU 
const startBtn = document.querySelector('.continue');
const startImg = startBtn.querySelector('img');

startImg.src = "/img/continue.svg"; // Set initial image

startBtn.addEventListener('click', () => {
  if (gamePaused) { // Resume the game
    gamePaused = false;
    startTimer(currentTimerTime); 

   moveGhosts(squares, width, scoreDisplay, score, checkGameOver);
    
    startImg.src = "/img/pause.svg";
  } else if (isRunning()) { // Pause the game
    gamePaused = true;
    PauseTimer(); // Pause the timer
    ghosts.forEach(ghost => clearInterval(ghost.timerId)); // Pause ghost movement
    startImg.src = "/img/continue.svg";
  } else {
    // Start the game for the first time
    startTimer();
    moveGhosts(squares, width, scoreDisplay, score, checkGameOver);

    startImg.src = "/img/pause.svg";
  }
});

document.addEventListener('keydown', (e) => {
  directionX=0, directionY=0;

  switch(e.key) {
      case 'ArrowLeft':
          directionX = -1;
          pacmanImg.style.transform = "scaleX(-1)"
          break;
      case 'ArrowRight':
          directionX = 1;
          pacmanImg.style.transform = "scaleX(1)"
          break;
      case 'ArrowUp':
          directionY = -width;
          pacmanImg.style.transform = "rotate(-90deg)"
          break;
      case 'ArrowDown':
          directionY = width;
          pacmanImg.style.transform = "rotate(90deg)"
          break;
  }
  if((directionX !== 0 && directionY===0) || (directionX === 0 && directionY !==0)){
    if (!animationFrameId) {
      movePacman();
    }
  }
});

document.addEventListener('keyup', (e) => {
  
  switch(e.key) {
      case 'ArrowLeft':
      case 'ArrowRight':
          directionX = 0;
          break;
      case 'ArrowUp':
      case 'ArrowDown':
          directionY = 0;
          break;
  }

  // If no direction is active, stop the animation
  if (directionX === 0 && directionY === 0) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
  }
});

// Start the movement with requestAnimationFrame
requestAnimationFrame(movePacman);
restartButton.addEventListener('click', restart);

function createBoard(){
  for (let i=0; i<layout.length; i++){
    let square = document.createElement('div')
    square.classList.add("square")
    square.id = `square-${i}`
    grid.appendChild(square)

    squares.push(square)
    if (layout[i] == 0) {
      squares[i].classList.add('dot')
      totalDots++
    } else if (layout[i] == 1) {
      squares[i].classList.add('wall')
    } else if (layout[i] == 2) {
      squares[i].classList.add('ghost')

      // let ghostImg = document.createElement('img')
      // ghostImg.src = "/img/red.svg"
      // ghostImg.classList.add('ghost-img');
      // squares[i].appendChild(ghostImg)
    } else if (layout[i] == 3) {
      const powerElement = document.createElement('div')
      powerElement.classList.add('power')
      squares[i].appendChild(powerElement)

      // squares[i].classList.add('power')
    } else if (layout[i] == 4) {
      squares[i].classList.add('empty')
    }
  }
}


function SetPacman(index=490){
  const pacmanDiv = document.createElement('div');
  pacmanDiv.classList.add("pacman")
  pacmanImg = document.createElement('img')
  pacmanImg.src = "/img/pacman.svg"
  pacmanImg.style.transform = "scaleX(1)"
  squares[index].appendChild(pacmanDiv)
  pacmanDiv.append(pacmanImg)
  pacmanCurrentIndex = index
}


function movePacman(timestamp) {
  if (isRunning()){
    checkForWin();
    checkGameOver();
    eatDot();
    eatPower();
    if (!lastMoveTime) {
      lastMoveTime = timestamp;
    }
  
    const timeSinceLastMove = timestamp - lastMoveTime;
  
    if (timeSinceLastMove >= moveInterval) {
      let newIndex = pacmanCurrentIndex + directionY + directionX;
      if (pacmanCurrentIndex % width === width - 1 && directionX === 1) {
        newIndex = pacmanCurrentIndex - width + 1; // Move Pac-Man to the left side
      }

      if (pacmanCurrentIndex % width === 0 && directionX === -1) {
        newIndex = pacmanCurrentIndex + width - 1; // Move Pac-Man to the right side
      }
      
      if (!squares[newIndex].classList.contains('wall')) {
        let pacmanDiv = squares[pacmanCurrentIndex].querySelector(".pacman")

        if(pacmanDiv){
          squares[pacmanCurrentIndex].removeChild(pacmanDiv)
        }
        pacmanCurrentIndex = newIndex;
        squares[pacmanCurrentIndex].appendChild(pacmanDiv)
        
        // squares[pacmanCurrentIndex].classList.remove('pacman');
        // pacmanCurrentIndex = newIndex;
        // squares[pacmanCurrentIndex].classList.add('pacman');
        // squares[pacmanCurrentIndex].appendChild(pacmanImg)
      }
  
      // Update last move time
      lastMoveTime = timestamp;
    }
  
    // Continue the animation if there's movement
    if (directionX !== 0 || directionY !== 0) {
        animationFrameId = requestAnimationFrame(movePacman);
    }
    
  }
}

function eatDot(){
  if (squares[pacmanCurrentIndex].classList.contains('dot')){
    squares[pacmanCurrentIndex].classList.remove('dot')
    score++
    eatenDots++
    scoreDisplay.innerHTML = score
  }
}

function eatPower(){
  if (squares[pacmanCurrentIndex].firstChild.classList.contains('power')){
    // powerSound.play()
    let powerDiv = squares[pacmanCurrentIndex].querySelector("div")
    squares[pacmanCurrentIndex].removeChild(powerDiv)
    score+=10
    scoreDisplay.innerHTML = score
    ghosts.forEach(ghost => 
      ghost.isScared = true
    )
    setTimeout(unScareGhosts, 10000)
  }
}

function checkGameOver(){
  const currentSquare = squares[pacmanCurrentIndex];
  if (currentSquare.classList.contains('ghost')) {
    if (currentSquare.classList.contains('scared-ghost')) {
      // Pac-Man has eaten the scared ghost
      score += 100;
      // ghostSound.play();

      scoreDisplay.innerHTML = score;

      // Reset the ghost to its starting position
      ghosts.forEach(ghost => {
        if (ghost.currentIndex === pacmanCurrentIndex) {
          squares[ghost.currentIndex].classList.remove('ghost', ghost.className, 'scared-ghost');
          const ghostImage = squares[ghost.currentIndex].querySelector('.ghost-img');
          if (ghostImage) {
            squares[ghost.currentIndex].removeChild(ghostImage);
          }
          ghost.currentIndex = ghost.startIndex;
        }
      });
    } else {
      lives--;
      updateLivesDisplay();
      // gameOverSound.play();
      if (lives <= 0) {
        ghosts.forEach(ghost => clearInterval(ghost.timerId));
        document.removeEventListener('keyup', movePacman);
        // gameOverSound.play();
        alert('Game Over. You lost!');
        restart();
        return;
      }
    }
  }
}

function updateLivesDisplay() { 
  // delete the pacman in current 
  const currentPacmanDiv = squares[pacmanCurrentIndex].querySelector(".pacman");
  if (currentPacmanDiv) {
    squares[pacmanCurrentIndex].removeChild(currentPacmanDiv);
  }

  const validIndices = layout
    .map((value, index) => (value === 0 || value === 4 ? index : -1))
    .filter(index => index !== -1);

  let randomIndex = validIndices[Math.floor(Math.random() * validIndices.length)];
 
   SetPacman(randomIndex)
   eatDot();
   pacmanCurrentIndex = randomIndex
   unScareGhosts()
  //  movePacman();

  for (let i = 1; i <= 3; i++) {
    const lifeDiv = document.getElementById(`life${i}`);
    if (i <= lives) {
      lifeDiv.style.backgroundColor = 'red'; // heart image red
    } else {
      lifeDiv.style.backgroundColor = 'grey'; // heart image red
    }
  }
}

function checkForWin() {
  if (score >= 10 && eatenDots === 10) {
      ghosts.forEach(ghost => clearInterval(ghost.timerId));
      document.removeEventListener('keyup', movePacman);
     // alert('You have WON');
      const playerName = prompt("Enter your name:"); // Prompt the player for their name
console.log(currentTimerTime)
console.log( " lastMoveTime",lastMoveTime)

      playerData = {
          name: playerName,
          score:score,
          time: getCurrentTimerTime() 
      };
      localStorage.setItem('playerData', JSON.stringify(playerData)); // Store player data in localStorage
      restart();
      showScoreboard(1);
  }
}


function restart() {
  lives = 3;
  updateLivesDisplay();
  score = 0;
  scoreDisplay.textContent = score;

  directionX = 0;
  directionY = 0;
  lastMoveTime = 0;
  eatenDots = 0;
  totalDots = 0; 

  cancelAnimationFrame(animationFrameId);
  animationFrameId = null;
  // Clear the board and recreate it
  squares.forEach(square => {
      square.classList.remove('pacman', 'dot', 'wall', 'ghost', 'power', 'empty', 'scared-ghost');
      while (square.firstChild) {
        square.removeChild(square.firstChild);
      }
  });

  ghosts.forEach (ghost => clearInterval(ghost.timerId))
  gamePaused = true;
  resetTimer()
  startImg.src = "/img/continue.svg";

  createBoard();
  pacmanCurrentIndex = 490;
  SetPacman()
  unScareGhosts()
  setGhosts(squares)
}

