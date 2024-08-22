// Player data
const scores = [ 
    // { name: 'Player1', score: 100, time: 5 },
    // { name: 'Player2', score: 90, time: 6 },
    // { name: 'Player3', score: 80, time: 7 },
    // { name: 'Player4', score: 70, time: 8 },
    // { name: 'Player5', score: 60, time: 9 },
    // { name: 'Player6', score: 80, time: 7 },
    // { name: 'Player7', score: 70, time: 8 },
    // { name: 'Player8', score: 60, time: 9 }
]; 

const itemsPerPage = 3;
let currentPage = 1;

export function showScoreboard(pageNumber) {
    // Retrieve player data from localStorage if available
    const storedPlayerData = localStorage.getItem('playerData');
    if (storedPlayerData) {
        const playerData = JSON.parse(storedPlayerData);
        scores.push(playerData); // Add the player's data to the scores array
        localStorage.removeItem('playerData'); // Clear the player data from localStorage
    }
    const scoreList = document.getElementById('score-list');
    scoreList.innerHTML = '';

    // Create scoreboard title
    const titleRow = document.createElement('div');
    titleRow.classList.add('score-item', 'title-row');
    titleRow.innerHTML = `
        <span>Rank</span>
        <span>Name</span>
        <span>Score</span>
        <span>Time</span>
    `;
    scoreList.appendChild(titleRow);
    
    //start and end index for the current page
    const startIndex = (pageNumber - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, scores.length);

    // Display scoreboard
    for (let i = startIndex; i < endIndex; i++) {
        const entry = scores[i];
        const scoreItem = document.createElement('div');
        scoreItem.classList.add('score-item');
        scoreItem.innerHTML = `
            <span>${i + 1}</span>
            <span>${entry.name}</span>
            <span>${entry.score}</span>
            <span>${entry.time}</span>
        `;
        scoreList.appendChild(scoreItem);
    }

    //closing scoreboard
    document.getElementById('game-over-screen').style.display = 'block';
    document.getElementById('close-scoreboard').addEventListener('click', () => {
        document.getElementById('game-over-screen').style.display = 'none';
    });

    // Calculate the total number
    const totalPages = Math.ceil(scores.length / itemsPerPage);
    const pageInfo = document.getElementById('page-info');
    pageInfo.innerHTML = `
        <button id="prev-page"><-</button>
        Page ${pageNumber}/${totalPages}
        <button id="next-page">-></button>
    `;

    currentPage = pageNumber;
}

    //navigate through the scoreboard pages
    document.addEventListener('DOMContentLoaded', function() {
        const pageInfo = document.getElementById('page-info');

        if (pageInfo) {
            pageInfo.addEventListener('click', (event) => {
                if (event.target.id === 'prev-page' && currentPage > 1) {
                    showScoreboard(currentPage - 1);
                } else if (event.target.id === 'next-page' && currentPage < Math.ceil(scores.length / itemsPerPage)) {
                    showScoreboard(currentPage + 1);
                }
            });

            // showScoreboard(currentPage);
        }
    });