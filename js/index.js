import { ghosts, unScareGhosts, moveGhosts, setGhosts, GHOST_MOVE_INTERVAL } from './ghosts.js';
import {squares, layout, width, scoreDisplay, moveInterval} from './setup.js';
import {startTimer, startBtn, isRunning } from './timer.js';

let totalDots = 0;
let lastMoveTime = 0;
let score = 0
let directionX = 0;
let directionY = 0;
let animationFrameId;
let pacmanCurrentIndex = 490
let lives =3

let pacmanImg = document.createElement('img')
pacmanImg.src = "/img/pacman.svg"

const grid = document.getElementById('grid');
const restartButton = document.querySelector('.restart');

// MENU 
startBtn.addEventListener('click', startTimer);

createBoard()
SetPacman()

if (isRunning){
  moveGhosts(squares, width, scoreDisplay, score, checkGameOver);
}

document.addEventListener('keydown', (e) => {
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
  if (!animationFrameId) {
    movePacman();
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
    square.id = i
    grid.appendChild(square)

    squares.push(square)
    if (layout[i] == 0) {
      squares[i].classList.add('dot')
      totalDots++
    } else if (layout[i] == 1) {
      squares[i].classList.add('wall')
    } else if (layout[i] == 2) {
      squares[i].classList.add('ghost')
      totalDots += 100
      // let ghostImg = document.createElement('img')
      // ghostImg.src = "/img/ghost2.svg"
      // squares[i].appendChild(ghostImg)
    } else if (layout[i] == 3) {
      squares[i].classList.add('power')
      totalDots += 10
      // let cherryImg = document.createElement('img')
      // cherryImg.src = "/img/cherry.svg"
      // squares[i].appendChild(cherryImg)
    } else if (layout[i] == 4) {
      squares[i].classList.add('empty')
    }
  }
}

function SetPacman(){
  squares[pacmanCurrentIndex].classList.add('pacman')
  squares[pacmanCurrentIndex].appendChild(pacmanImg)
}


function movePacman(timestamp) {
  if (!lastMoveTime) {
    lastMoveTime = timestamp;
  }

  const timeSinceLastMove = timestamp - lastMoveTime;

  if (timeSinceLastMove >= moveInterval) {
    let newIndex = pacmanCurrentIndex + directionY + directionX;

    if (!squares[newIndex].classList.contains('wall')) {
        squares[pacmanCurrentIndex].classList.remove('pacman');
        
        pacmanCurrentIndex = newIndex;
        squares[pacmanCurrentIndex].classList.add('pacman');
        squares[pacmanCurrentIndex].appendChild(pacmanImg)
    }

    // Update last move time
    lastMoveTime = timestamp;
  }

  // Continue the animation if there's movement
  if (directionX !== 0 || directionY !== 0) {
      animationFrameId = requestAnimationFrame(movePacman);
  }
  eatDot()
  eatPower()
  checkGameOver()
  checkForWin()
}


function eatDot(){
  if (squares[pacmanCurrentIndex].classList.contains('dot')){
    squares[pacmanCurrentIndex].classList.remove('dot')
    score++
    scoreDisplay.innerHTML = score
  }
}

function eatPower(){
  if (squares[pacmanCurrentIndex].classList.contains('power')){
    // squares[pacmanCurrentIndex].querySelector('.power img').remove();
    squares[pacmanCurrentIndex].classList.remove('power')
    score+=10
    scoreDisplay.innerHTML = score
    ghosts.forEach(ghost => ghost.isScared = true)
    setTimeout(unScareGhosts, 10000)
  }
}

function checkGameOver(){
  const currentSquare = squares[pacmanCurrentIndex];
  if (currentSquare.classList.contains('ghost')) {
    if (currentSquare.classList.contains('scared-ghost')) {
      // Pac-Man has eaten the scared ghost
      score += 100;
      scoreDisplay.innerHTML = score;

      // Reset the ghost to its starting position
      ghosts.forEach(ghost => {
        if (ghost.currentIndex === pacmanCurrentIndex) {
          squares[ghost.currentIndex].classList.remove('ghost', ghost.className, 'scared-ghost');
          const ghostImage = squares[ghost.currentIndex].querySelector('img');
          if (ghostImage) {
            squares[ghost.currentIndex].removeChild(ghostImage);
          }
          ghost.currentIndex = ghost.startIndex;
          squares[ghost.currentIndex].classList.add('ghost', ghost.className);
          let ghostImg = document.createElement('img');
          ghostImg.src = `/img/${ghost.className}.svg`;
          ghostImg.style.width = "20px"; // Ensure all ghost images are the same width
          squares[ghost.currentIndex].appendChild(ghostImg);
        }
      });
    } else {
      lives --;
      updateLivesDisplay();

      if (lives <= 0) {
        ghosts.forEach(ghost => clearInterval(ghost.timerId));
        document.removeEventListener('keyup', movePacman);
        alert('Game Over. You lost!');
        restart();
        return;
      }
    }
  }
}

function updateLivesDisplay() {
  
  pacmanCurrentIndex = 490;
   SetPacman()
   setGhosts(squares)
   unScareGhosts()
   movePacman();

  for (let i = 1; i <= 3; i++) {
    const lifeDiv = document.getElementById(`life${i}`);
    if (i <= lives) {
      lifeDiv.style.display = 'block'; // Show the Pac-Man SVG image for the life
    } else {
      lifeDiv.style.display = 'none'; // Hide the Pac-Man SVG image for the lost life
    }
  }
}

function checkForWin(){
  if (score >= totalDots){
    ghosts.forEach(ghost => clearInterval(ghost.timerId))
    document.removeEventListener('keyup', movePacman)

    setTimeout( function(){ alert('You have WON')}, 500)
  }
}

function restart() {
  score = 0;
  scoreDisplay.textContent = score;

  directionX = 0;
  directionY = 0;
  lastMoveTime = 0;
  cancelAnimationFrame(animationFrameId);
  animationFrameId = null;

  // Clear the board and recreate it
  squares.forEach(square => {
      square.classList.remove('pacman', 'dot', 'wall', 'ghost', 'power', 'empty', 'scared-ghost');
      while (square.firstChild) {
        square.removeChild(square.firstChild);
      }
  });

  totalDots = 0; 
  createBoard();
  pacmanCurrentIndex = 490;
  SetPacman()
  setGhosts(squares)
  unScareGhosts()
  movePacman();
}