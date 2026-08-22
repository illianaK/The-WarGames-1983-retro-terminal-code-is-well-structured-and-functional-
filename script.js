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

// --- RETRO SOUND GENERATOR (Web Audio API) ---
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playTone(freq, type, duration) {
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = type;
    osc.frequency.value = freq;
    
    gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
}

const sounds = {
    keystroke: () => playTone(600, 'square', 0.03),
    systemPrint: () => playTone(800, 'sine', 0.02),
    alert: () => {
        playTone(400, 'sawtooth', 0.1);
        setTimeout(() => playTone(300, 'sawtooth', 0.1), 120);
    }
};

// --- RETRO TYPEWRITER PRINTER ---
function appendLine(text, className = 'system-msg') {
    return new Promise((resolve) => {
        const line = document.createElement('div');
        line.className = `line ${className}`;
        screen.appendChild(line);
        
        let isHTML = text.includes('<') && text.includes('>');
        
        if (isHTML || className === 'user-msg') {
            line.innerHTML = text;
            screen.scrollTop = screen.scrollHeight;
            if (className !== 'user-msg') sounds.systemPrint();
            resolve();
        } else {
            let index = 0;
            const typingSpeed = 35;
            
            function typeChar() {
                if (index < text.length) {
                    line.textContent += text.charAt(index);
                    index++;
                    sounds.systemPrint();
                    screen.scrollTop = screen.scrollHeight;
                    setTimeout(typeChar, typingSpeed);
                } else {
                    resolve();
                }
            }
            typeChar();
        }
    });
}

function processInput() {
    const text = input.value.trim();
    if (!text && state !== 'PLAYING_TTT') return;

    if (text) {
        sounds.keystroke();
        appendLine(`> ${text}`, 'user-msg');
        input.value = '';
    }

    const upperText = text.toUpperCase();

    switch (state) {
        case 'INITIAL':
            if (upperText.includes('GAME') || upperText.includes('YES') || upperText.includes('LIST')) {
                appendLine("AVAILABLE GAMES:").then(() => {
                    games.forEach((g, i) => appendLine(`  ${i + 1}. ${g}`));
                    appendLine("<br>PLEASE CHOOSE A GAME:");
                    state = 'SELECT_GAME';
                });
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
                appendLine("THAT GAME IS CURRENTLY UNAVAILABLE DUE TO SYSTEM CONSTRAINTS.").then(() => {
                    appendLine("PLEASE SELECT EITHER 'TIC-TAC-TOE' OR 'GLOBAL THERMONUCLEAR WAR'.");
                });
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
    sounds.alert();
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
            sounds.alert();
            appendLine(`STRIKE DETECTED: ${source} -> ${target} | CASUALTIES: ${casual.toLocaleString()}`, 'defcon-warning');
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
    }, 1500);
}

function startTicTacToe() {
    state = 'PLAYING_TTT';
    tttBoard = ['', '', '', '', '', '', '', '', ''];
    playerTurn = true;

    appendLine("<br>INITIALIZING TIC-TAC-TOE...").then(() => {
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
    });
}

function handleCellClick(e) {
    if (!playerTurn || state !== 'PLAYING_TTT') return;

    const index = e.target.dataset.index;
    if (tttBoard[index] !== '') return;

    sounds.keystroke();
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
        sounds.keystroke();

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
    }, 800);
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
    const winPatterns = [, [3,4,5], [6,7,8],
, [1,4,7], [2,5,8],
, [2,4,6]
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

// Original button code elements setup
const button = document.getElementById('action-btn');
const statusText = document.getElementById('status-text');
const card = document.querySelector('.card');

if (button) {
    button.addEventListener('click', () => {
        statusText.textContent = "Awesome! Everything is working.";
        card.classList.add('success');
        button.textContent = "Connected";
    });
}
