const screen = document.getElementById('screen');
const input = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');

let state = 'INITIAL';
let tttBoard = ['', '', '', '', '', '', '', '', ''];
let playerTurn = true;
let simInterval = null;
let activeBoardElement = null;

const games = [
    "FALKEN'S MAZE",
    "BLACK JACK",
    "GIN RUMMY",
    "HEARTS",
    "BRIDGE",
    "CHECKERS",
    "CHESS",
    "POKER",
    "TIC-TAC-TOE",
    "GLOBAL THERMONUCLEAR WAR"
];

function appendLine(text, className = 'system-msg') {
    const line = document.createElement('div');
    line.className = `line ${className}`;
    line.innerHTML = text;
    screen.appendChild(line);
    requestAnimationFrame(() => {
        screen.scrollTop = screen.scrollHeight;
    });
}

function processInput() {
    const text = input.value.trim();
    if (!text && state !== 'PLAYING_TTT') return;

    if (text) {
        appendLine(`&gt; ${text}`, 'user-msg');
        input.value = '';
    }

    const upperText = text.toUpperCase();

    switch (state) {
        case 'INITIAL':
            if (upperText.includes('GAME') || upperText.includes('YES') || upperText.includes('LIST')) {
                appendLine("AVAILABLE GAMES:");
                games.forEach((g, i) => appendLine(`  ${i + 1}. ${g}`));
                appendLine("<br>PLEASE CHOOSE A GAME:");
                state = 'SELECT_GAME';
            } else {
                appendLine("I'M SORRY, PROFESSOR. WOULD YOU LIKE TO SEE THE LIST OF GAMES?");
            }
            break;

        case 'SELECT_GAME':
            if (upperText.includes('GLOBAL') || upperText.includes('THERMONUCLEAR') || upperText === '10') {
                startGlobalWar();
            } else if (upperText.includes('TIC') || upperText.includes('TAC') || upperText === '9') {
                startTicTacToe();
            } else {
                appendLine("THAT GAME IS CURRENTLY UNAVAILABLE DUE TO SYSTEM CONSTRAINTS.");
                appendLine("PLEASE SELECT EITHER 'TIC-TAC-TOE' OR 'GLOBAL THERMONUCLEAR WAR'.");
            }
            break;

        case 'PLAYING_TTT':
            if (upperText === 'QUIT' || upperText === 'EXIT') {
                resetTerminal();
            }
            break;

        case 'SIMULATING_WAR':
            if (upperText === 'STOP' || upperText === 'QUIT' || upperText === 'TIC-TAC-TOE') {
                clearInterval(simInterval);
                appendLine("SIMULATION ABORTED.");
                startTicTacToe();
            }
            break;
    }
}

function startGlobalWar() {
    state = 'SIMULATING_WAR';
    appendLine("<br><span class='defcon-warning'>--- INITIATING GLOBAL THERMONUCLEAR WAR SIMULATION ---</span>");
    appendLine("PRIMARY TARGET: UNITED STATES / USSR");
    appendLine("CALCULATING OPTIMAL TRAJECTORIES...");

    let targetCities = ["WASHINGTON D.C.", "MOSCOW", "NORAD / CHEYENNE MT.", "LENINGRAD", "LOS ANGELES", "KIEV", "CHICAGO", "MINSK"];
    let count = 0;

    simInterval = setInterval(() => {
        if (count < 10) {
            let source = count % 2 === 0 ? "US ICBM" : "SOVIET SLBM";
            let target = targetCities[Math.floor(Math.random() * targetCities.length)];
            let casual = (Math.floor(Math.random() * 80) + 10) * 100000;
            appendLine(`STRIKE DETECTED: ${source} -&gt; ${target} | CASUALTIES: ${casual.toLocaleString()}`, 'defcon-warning');
            count++;
        } else {
            clearInterval(simInterval);
            appendLine("<br>ANALYZING STRATEGIC RESULTS...");
            setTimeout(() => {
                appendLine("<span class='defcon-warning'>WINNER: NONE</span>");
                appendLine("<br>A STRANGE GAME.");
                appendLine("THE ONLY WINNING MOVE IS NOT TO PLAY.");
                appendLine("<br>HOW ABOUT A NICE GAME OF CHESS OR TIC-TAC-TOE?");
                state = 'SELECT_GAME';
            }, 2000);
        }
    }, 800);
}

function startTicTacToe() {
    state = 'PLAYING_TTT';
    tttBoard = ['', '', '', '', '', '', '', '', ''];
    playerTurn = true;

    appendLine("<br>INITIALIZING TIC-TAC-TOE...");
    appendLine("CLICK A CELL ON THE BOARD TO PLACE 'X':");

    const boardDiv = document.createElement('div');
    boardDiv.className = 'board-container';

    const grid = document.createElement('div');
    grid.className = 'tic-tac-toe';

    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.dataset.index = i;
        cell.addEventListener('click', handleCellClick);
        grid.appendChild(cell);
    }

    boardDiv.appendChild(grid);
    activeBoardElement = boardDiv;
    screen.appendChild(boardDiv);
    screen.scrollTop = screen.scrollHeight;
}

function handleCellClick(e) {
    if (!playerTurn || state !== 'PLAYING_TTT') return;

    const index = e.target.dataset.index;
    if (tttBoard[index] !== '') return;

    makeMove(index, 'X');

    if (checkWin('X')) {
        appendLine("YOU WIN! UNLIKELY OUTCOME DETECTED.");
        endGame();
        return;
    }

    if (isBoardFull()) {
        appendLine("GAME IS A DRAW.");
        endGame();
        return;
    }

    playerTurn = false;
    appendLine("W.O.P.R. IS CALCULATING MOVE...");

    setTimeout(() => {
        const aiMove = getBestMove();
        makeMove(aiMove, 'O');

        if (checkWin('O')) {
            appendLine("W.O.P.R. WINS.");
            endGame();
        } else if (isBoardFull()) {
            appendLine("GAME IS A DRAW.");
            appendLine("RESULT: MUTUALLY ASSURED DESTRUCTION AVERTED.");
            endGame();
        } else {
            playerTurn = true;
        }
    }, 500);
}

function makeMove(index, symbol) {
    tttBoard[index] = symbol;
    if (activeBoardElement) {
        const cells = activeBoardElement.querySelectorAll('.cell');
        if (cells[index]) cells[index].innerText = symbol;
    }
}

function isBoardFull() {
    return tttBoard.every(cell => cell !== '');
}

function checkWin(symbol) {
    const winPatterns = [
        [0,1,2], [3,4,5], [6,7,8],
        [0,3,6], [1,4,7], [2,5,8],
        [0,4,8], [2,4,6]
    ];
    return winPatterns.some(pattern => {
        return pattern.every(index => tttBoard[index] === symbol);
    });
}

function getBestMove() {
    let available = tttBoard.map((val, idx) => val === '' ? idx : null).filter(val => val !== null);

    for (let idx of available) {
        tttBoard[idx] = 'O';
        if (checkWin('O')) { tttBoard[idx] = ''; return idx; }
        tttBoard[idx] = '';
    }

    for (let idx of available) {
        tttBoard[idx] = 'X';
        if (checkWin('X')) { tttBoard[idx] = ''; return idx; }
        tttBoard[idx] = '';
    }

    if (available.includes(4)) return 4;

    return available[Math.floor(Math.random() * available.length)];
}

function endGame() {
    state = 'INITIAL';
    appendLine("<br>SHALL WE PLAY ANOTHER GAME?");
}

function resetTerminal() {
    state = 'INITIAL';
    appendLine("SYSTEM RESET COMPLETE.");
    appendLine("SHALL WE PLAY A GAME?");
}

sendBtn.addEventListener('click', processInput);
input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') processInput();
});

// 1. Grab the elements from the HTML file
const button = document.getElementById('action-btn');
const statusText = document.getElementById('status-text');
const card = document.querySelector('.card');

// 2. Listen for a click event to make them interact
button.addEventListener('click', () => {
    // Change the text content dynamically
    statusText.textContent = "Awesome! Everything is working.";

    // Add the CSS class to change the style dynamically
    card.classList.add('success');
    button.textContent = "Connected";

    // Grab display metrics dynamically
    const screenHeight = window.screen.height;
    const screenWidth = window.screen.width;
});


// 1. Grab the elements from the HTML file
const button = document.getElementById('action-btn');
const statusText = document.getElementById('status-text');
const card = document.querySelector('.card');

// 2. Listen for a click event to make them interact
button.addEventListener('click', () => {
    // Change the text content dynamically
    statusText.textContent = "Awesome! Everything is working.";

    // Add the CSS class to change the style dynamically
    card.classList.add('success');
    button.textContent = "Connected";
 
  // Add the script js to change display dynamically
const screenHeight = window.screen.height;
const screenWidth = window.screen.width;
  
});