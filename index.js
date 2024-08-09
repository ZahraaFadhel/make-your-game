const scoreDisplay = document.getElementById('score')
const width = 28
let score = 0
const grid = document.getElementById('grid')
squares = [] // array of divs (20*20 squares)
let pacmanCurrentIndex = 490
let totalDots = 0
// 28 * 28
const layout = [
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
  1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1,
  1, 3, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 3, 1,
  1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1,
  1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
  1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1,
  1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1,
  1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
  1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 1, 1, 0, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1, 1, 0, 1, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 1, 1, 0, 1, 1, 4, 1, 1, 4, 4, 4, 4, 1, 1, 4, 1, 1, 0, 1, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 1, 1, 0, 1, 1, 4, 1, 4, 4, 4, 4, 4, 4, 1, 4, 1, 1, 0, 1, 1, 1, 1, 1, 1,
  4, 4, 4, 4, 4, 4, 0, 0, 0, 4, 1, 4, 4, 2, 2, 4, 4, 1, 4, 0, 0, 0, 4, 4, 4, 4, 4, 4,
  1, 1, 1, 1, 1, 1, 0, 1, 1, 4, 1, 4, 4, 2, 2, 4, 4, 1, 4, 1, 1, 0, 1, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 1, 1, 0, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 0, 1, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 1, 1, 0, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 0, 1, 1, 1, 1, 1, 1,
  1, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 1,
  1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1,
  1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1,
  1, 3, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 3, 1,
  1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1,
  1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1,
  1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1,
  1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1,
  1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1,
  1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1
]

// 0 - dot
// 1 - wall
// 2 - ghost
// 3 - power
// 4 - empty

createBoard()

// the starting position
squares[pacmanCurrentIndex].classList.add('pacman')
pacmanImg = document.createElement('img')
pacmanImg.src = "/img/pacman.svg"
squares[pacmanCurrentIndex].appendChild(pacmanImg)
const ghostImg = document.createElement('img');
ghostImg.src = "/img/ghost2.svg";

document.addEventListener('keydown', movePacman)

function eatDot(){
  if (squares[pacmanCurrentIndex].classList.contains('dot')){
    squares[pacmanCurrentIndex].classList.remove('dot')
    score++
    scoreDisplay.innerHTML = score
  }
}

function eatPower(){
  if (squares[pacmanCurrentIndex].classList.contains('power')){
    const cherryImg = squares[pacmanCurrentIndex].querySelector('img');
    squares[pacmanCurrentIndex].removeChild(cherryImg)
    score+=10
    scoreDisplay.innerHTML = score
    ghosts.forEach(ghost => ghost.isScared = true)
    setTimeout(unScaredGhosts, 10000)
  }
}

function movePacman(e){
  // squares[pacmanCurrentIndex].classList.remove('pacman')

  switch(e.key){
    case 'ArrowLeft' :
      if (!squares[pacmanCurrentIndex-1].classList.contains('wall')){
        pacmanCurrentIndex -= 1
      } else if (pacmanCurrentIndex%width == 0){
        pacmanCurrentIndex += (width-1)
      }
      break
    
    case 'ArrowRight' :
      if (!squares[pacmanCurrentIndex+1].classList.contains('wall')){
        pacmanCurrentIndex += 1
      } else if ((pacmanCurrentIndex+1)%width == 0){
        pacmanCurrentIndex -= (width-1)
      }
      break  

    case 'ArrowUp' :
      if (!squares[pacmanCurrentIndex-width].classList.contains('wall')){
        pacmanCurrentIndex -= width
      }
      break 
        
    case 'ArrowDown' :
      if (!squares[pacmanCurrentIndex+width].classList.contains('wall')){
        pacmanCurrentIndex += width
      }
      break 

  }

  eatDot()
  eatPower()
  checkGameOver()
  checkForWin()
  squares[pacmanCurrentIndex].classList.add('pacman')
  squares[pacmanCurrentIndex].appendChild(pacmanImg)
}

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
      let cherryImg = document.createElement('img')
      cherryImg.src = "/img/cherry.svg"
      squares[i].appendChild(cherryImg)
    } else if (layout[i] == 4) {
      squares[i].classList.add('empty')
    }
  }
}


// GOSTS

class Ghost {
  constructor(className, startIndex, speed){
    this.className = className
    this.startIndex = startIndex
    this.speed = speed
    this.currentIndex = startIndex
    this.isScared = false
    this.timerId = null
  }
}

ghosts = [
  new Ghost ('blue', 348, 250),
  new Ghost ('pink', 376, 400),
  new Ghost ('green', 351, 300),
  new Ghost ('beige', 379, 500),
]

ghosts.forEach(ghost => {
  squares[ghost.currentIndex].classList.add(ghost.className)
  squares[ghost.currentIndex].classList.add("ghost")
});

// move ghosts randomly
ghosts.forEach(ghost => moveGhost(ghost));

function moveGhost(ghost){
  const directions = [-1, 1, width, -width]
  let direction = directions[Math.floor(Math.random()*directions.length)] // always give a number < 4

  ghost.timerId = setInterval(function() {
    if (!squares[ghost.currentIndex+direction].classList.contains('ghost') && !squares[ghost.currentIndex+direction].classList.contains('wall')){
      squares[ghost.currentIndex].classList.remove('ghost', ghost.className, 'scared-ghost')
      const ghostImage = squares[ghost.currentIndex].querySelector('img');
      if (ghostImage) {
        squares[ghost.currentIndex].removeChild(ghostImage);
      }

      ghost.currentIndex += direction
      squares[ghost.currentIndex].classList.add('ghost', ghost.className)
      
      let ghostImg = document.createElement('img')
      ghostImg.src = "/img/ghost2.svg"
      squares[ghost.currentIndex].appendChild(ghostImg)
      } else {
        direction = directions[Math.floor(Math.random()*directions.length)]
      }

      if (ghost.isScared){
         squares[ghost.currentIndex].classList.add('scared-ghost')
      }

      // pacman eats scared ghost 
      if (ghost.isScared && squares[ghost.currentIndex].classList.contains('pacman')){
        score += 100
        scoreDisplay.innerHTML = score

        squares[ghost.currentIndex].classList.remove('ghost', ghost.className, 'scared-ghost')
        const ghostImage = squares[ghost.currentIndex].querySelector('img');
        if (ghostImage) {
          squares[ghost.currentIndex].removeChild(ghostImage);
        }
        ghost.currentIndex = ghost.startIndex
        // add ghost again
        squares[i].classList.add('ghost')
        let ghostImg = document.createElement('img')
        ghostImg.src = "/img/ghost2.svg"
        squares[i].appendChild(ghostImg)
      }
      checkGameOver()
  }, ghost.speed)
}

function unScaredGhosts(){
  ghosts.forEach(ghost => ghost.isScared = false)
}

function checkGameOver(){
  if (squares[pacmanCurrentIndex].classList.contains('ghost') &&
  !squares[pacmanCurrentIndex].classList.contains('scared-ghost')){
    ghosts.forEach(ghost => clearInterval(ghost.timerId))
    document.removeEventListener('keyup', movePacman)

    setTimeout( function(){ alert('Game Over')}, 300)
  }
}

function checkForWin(){
  if (score >= totalDots){
    ghosts.forEach(ghost => clearInterval(ghost.timerId))
    document.removeEventListener('keyup', movePacman)

    setTimeout( function(){ alert('You have WON')}, 500)

  }
}
