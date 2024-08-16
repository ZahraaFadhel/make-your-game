import { isRunning } from "./timer.js";
export const GHOST_MOVE_INTERVAL = 1000;

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
  new Ghost('red', 377, 250),
  new Ghost('pink', 378, 400),
  new Ghost('cyan', 405, 300),
  new Ghost('orange', 406, 500)
];

// Move ghosts randomly
export function moveGhosts(squares, width, scoreDisplay, score, checkGameOver) {
  if(isRunning()){
    ghosts.forEach(ghost => moveGhost(ghost, squares, width, scoreDisplay, score, checkGameOver));
  }
}

function moveGhost(ghost, squares, width, scoreDisplay, score, checkGameOver) {
  const directions = [-1, 1, width, -width];
  let direction = directions[Math.floor(Math.random() * directions.length)];

  // Clear any existing interval for the ghost
  if (ghost.timerId) {
    clearInterval(ghost.timerId);
    ghost.timerId = null;
  }

  ghost.timerId = setInterval(function() {
    // First, check if the ghost and Pac-Man are in the same square
    if (ghost.isScared && squares[ghost.currentIndex].querySelector(".pacman") != null) {
      // Pac-Man eats the scared ghost
      score += 100;
      scoreDisplay.innerHTML = score;

      // Remove ghost from the square and reset its position
      const ghostImage = squares[ghost.currentIndex].querySelector('.ghost-img');
      if (ghostImage) {
        squares[ghost.currentIndex].removeChild(ghostImage);
      }
      squares[ghost.currentIndex].classList.remove('ghost', ghost.className, 'scared-ghost');

      // Reset ghost to its starting position
      ghost.currentIndex = ghost.startIndex;
      squares[ghost.currentIndex].classList.add('ghost', ghost.className);

      // Add the ghost back to the grid with its initial image
      const ghostDiv = document.createElement("div");
      ghostDiv.classList.add("ghost-div");
      let ghostImg = document.createElement('img');
      ghostImg.classList.add("ghost-img");
      ghostImg.src = `/img/${ghost.className}.svg`;
      ghostDiv.appendChild(ghostImg);
      squares[ghost.currentIndex].appendChild(ghostDiv);

      return; // Skip the movement logic for this interval
    }

    // Now, proceed with ghost movement logic
    if (squares[ghost.currentIndex + direction].querySelector(".ghost-img") == null &&
        !squares[ghost.currentIndex + direction].classList.contains('wall')) {

      squares[ghost.currentIndex].classList.remove('ghost', ghost.className, 'scared-ghost');
      const ghostImage = squares[ghost.currentIndex].querySelector('.ghost-img');
      if (ghostImage) {
        squares[ghost.currentIndex].removeChild(ghostImage);
      }

      ghost.currentIndex += direction;
      squares[ghost.currentIndex].classList.add('ghost', ghost.className);
      let ghostImg = document.createElement('img');
      ghostImg.classList.add("ghost-img");
      ghostImg.src = ghost.isScared ? `/img/scared-ghost.svg` : `/img/${ghost.className}.svg`;
      ghostImg.style.width = "20px";
      ghostImg.style.height = "20px";
      
      squares[ghost.currentIndex].appendChild(ghostImg);
    } else {
      direction = directions[Math.floor(Math.random() * directions.length)];
    }

    if (ghost.isScared) {
      squares[ghost.currentIndex].classList.add('scared-ghost');
    }

    checkGameOver();
  }, ghost.speed);
}


export function setGhosts(squares){

  ghosts.forEach(ghost => {
    if (ghost.className == 'red') {
      ghost.currentIndex = 377;
    } else if (ghost.className == 'pink') {
      ghost.currentIndex = 378;
    } else if (ghost.className == 'cyan') {
      ghost.currentIndex = 405;
    } else if (ghost.className == 'orange') {
      ghost.currentIndex = 406;
    }
    
    squares[ghost.currentIndex].classList.add('ghost');
      
    
    let ghostImg = document.createElement('img');
    ghostImg.classList.add("ghost-img");
    ghostImg.src = ghost.isScared ? `/img/scared-ghost.svg` : `/img/${ghost.className}.svg`;
    squares[ghost.currentIndex].appendChild(ghostImg);
    
  })
}

export function unScareGhosts() {
  ghosts.forEach(ghost => ghost.isScared = false);
}


// function getTransform(direction, width) {
//   switch (direction) {
//     case -1:
//       return `translate(-20px, 0px)`;
//     case 1:
//       return `translate(20px, 0px)`; 
//     case width:
//       return `translate(0px, ${width}px)`;
//     case -width:
//       return `translate(0px, -${width}px)`;
//   }
// }