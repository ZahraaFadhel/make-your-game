import { isRunning } from "./timer.js";
// ghosts.js
export const GHOST_MOVE_INTERVAL = 1000; // Move ghosts every 200 milliseconds

export class Ghost {
  constructor(className, startIndex, speed) {
    this.className = className;
    this.startIndex = startIndex;
    this.speed = speed;
    this.currentIndex = startIndex;
    this.isScared = false;
    this.timerId = null;
  }
}

export let ghosts = [
  new Ghost('red', 348, 250),
  new Ghost('pink', 376, 400),
  new Ghost('blue', 351, 300),
  new Ghost('orange', 379, 500)
];

// Move ghosts randomly
export function moveGhosts(squares, width, scoreDisplay, score, checkGameOver) {
  if(isRunning()){ // && !gamePaused
    ghosts.forEach(ghost => moveGhost(ghost, squares, width, scoreDisplay, score, checkGameOver));
  }
}

export function setGhosts(squares){
  ghosts.forEach(ghost => {
    squares[ghost.currentIndex].classList.add('ghost', ghost.className);
      
    // let ghostImg = document.createElement('img');
    // ghostImg.src = `/img/${ghost.className}.svg`;  
    // squares[ghost.currentIndex].appendChild(ghostImg);
  })
}

function moveGhost(ghost, squares, width, scoreDisplay, score, checkGameOver) {
  const directions = [-1, 1, width, -width];
  let direction = directions[Math.floor(Math.random() * directions.length)];
  let offSetX = 0, offSetY = 0;

  ghost.timerId = setInterval(function() {
    
    if (!squares[ghost.currentIndex + direction].classList.contains('ghost') &&
        !squares[ghost.currentIndex + direction].classList.contains('wall')) {

      squares[ghost.currentIndex].style.transform = `translate(20px, 0px)`
      // const ghostImage = squares[ghost.currentIndex].querySelector('img');
      // if (ghostImage) {
      //   squares[ghost.currentIndex].removeChild(ghostImage);
      // }

      // ghost.currentIndex += direction;
      // squares[ghost.currentIndex].classList.add('ghost', ghost.className);
      
      // let ghostImg = document.createElement('img');
      // ghostImg.src = `/img/${ghost.className}.svg`;  
      // squares[ghost.currentIndex].appendChild(ghostImg);
    } else {
      direction = directions[Math.floor(Math.random() * directions.length)];
    }

    if (ghost.isScared) {
      squares[ghost.currentIndex].classList.add('scared-ghost');
    }

    // Pac-Man eats scared ghost
    if (ghost.isScared && squares[ghost.currentIndex].classList.contains('pacman')) {
      score += 100;
      scoreDisplay.innerHTML = score;

      // squares[ghost.currentIndex].classList.remove('ghost', ghost.className, 'scared-ghost');
      // const ghostImage = squares[ghost.currentIndex].querySelector('img');
      // if (ghostImage) {
      //   squares[ghost.currentIndex].removeChild(ghostImage);
      // }

      ghost.currentIndex = ghost.startIndex;
      // squares[ghost.currentIndex].classList.add('ghost', ghost.className);
      // let ghostImg = document.createElement('img');
      // ghostImg.src = `/img/${ghost.className}.svg`;
      // squares[ghost.currentIndex].appendChild(ghostImg);
    }
    checkGameOver();
  }, ghost.speed);
}

function updateGhostPosition(ghost, x, y) {
  let ghostDiv = squares[ghost.currentIndex];
  // if (!ghostImg) {
  //   ghostImg = document.createElement('img');
  //   ghostImg.src = `/img/${ghost.className}.svg`;
  //   ghostImg.style.position = 'absolute';
  //   squares[ghost.currentIndex].appendChild(ghostImg);
  // }
  ghostDiv.style.transform = `translate(${x}px, ${y}px)`;
}

export function unScareGhosts() {
  ghosts.forEach(ghost => ghost.isScared = false);
}

// export function setGhosts(squares) {
//   ghosts.forEach(ghost => {
//     squares[ghost.currentIndex].classList.remove('ghost', ghost.className, 'scared-ghost');
//     const ghostImage = squares[ghost.currentIndex].querySelector('img');
//     if (ghostImage) {
//       squares[ghost.currentIndex].removeChild(ghostImage);
//     }

//     // Reset ghost's position
//     ghost.currentIndex = ghost.startIndex;
//     squares[ghost.currentIndex].classList.add('ghost', ghost.className);
//     let ghostImg = document.createElement('img');
//     ghostImg.src = `/img/${ghost.className}.svg`;
//     squares[ghost.currentIndex].appendChild(ghostImg);
//   });
// }