// --- FILM-ACCURATE CYAN STYLING ENGINE ---
const woprStyle = document.createElement('style');
woprStyle.textContent = `
    #screen, .line, .system-msg, .user-msg, #userInput, .prompt {
        color: #00d0ff !important;
        text-shadow: 0 0 5px #00d0ff, 0 0 10px #0088ff !important;
    }
    .typing::after, .cursor {
        background-color: #00d0ff !important;
        box-shadow: 0 0 8px #00d0ff !important;
    }
    canvas#galagaCanvas {
        border: 2px solid #005f87;
        background: #000;
        display: block;
        margin: 10px auto;
        box-shadow: 0 0 15px rgba(0, 208, 255, 0.4);
    }
`;
document.head.appendChild(woprStyle);

const screen = document.getElementById('screen');
const input = document.getElementById('userInput');

// Terminal State Control Machine
let state = 'RAW_LOGON'; 
let simInterval = null;
let tttBoard = ['', '', '', '', '', '', '', '', ''];
let galagaActive = false;

// Native Browser Audio Synth Architecture
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
document.addEventListener('click', () => {
    if (audioCtx.state === 'suspended') audioCtx.resume();
}, { once: true });

function playTone(freq, type, duration) {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.02, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
}

const sounds = {
    click: () => playTone(650, 'square', 0.02),
    print: () => playTone(850, 'sine', 0.01),
    warn: () => {
        playTone(480, 'sawtooth', 0.08);
        setTimeout(() => playTone(360, 'sawtooth', 0.08), 90);
    }
};

function appendLine(text, className = 'system-msg') {
    return new Promise((resolve) => {
        const line = document.createElement('div');
        line.className = `line ${className} typing`;
        screen.appendChild(line);

        const scrollToBottom = () => { screen.scrollTop = screen.scrollHeight; };
        if (text.trim().startsWith('<') || className === 'user-msg') {
            line.innerHTML = text;
            line.classList.remove('typing');
            scrollToBottom();
            if (className !== 'user-msg') sounds.print();
            resolve();
        } else {
            let index = 0;
            function typeChar() {
                if (index < text.length) {
                    line.textContent += text.charAt(index);
                    index++;
                    sounds.print();
                    scrollToBottom();
                    // CINEMATIC SPEED RECTIFICATION: 35ms accurately mirrors 300 baud typewriter text
                    setTimeout(typeChar, 35); 
                } else {
                    line.classList.remove('typing');
                    scrollToBottom();
                    resolve();
                }
            }
            typeChar();
        }
    });
}

// System Boot Sequence Verification Hook
function initTerminal() {
    if (screen) {
        screen.innerHTML = '';
        appendLine("LOGON: ");
    }
}

if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', initTerminal);
} else {
    initTerminal();
}

input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') processInput();
});

function processInput() {
    const text = input.value.trim();
    if (!text && state !== 'GAME_TTT') return;

    if (text) {
        sounds.click();
        appendLine(text, 'user-msg');
        input.value = '';
    }

    const upperText = text.toUpperCase();

    // System Utility Override Command
    if (upperText === 'RESET') {
        cleanUpActiveLoops();
        resetTerminal();
        return;
    }

    // Secret Global Arcade Overwrite
    if (upperText === 'GALAGA') {
        cleanUpActiveLoops();
        startGalagaArcade();
        return;
    }

    if (['QUIT', 'EXIT', 'BYE'].includes(upperText)) {
        cleanUpActiveLoops();
        resetTerminal();
        return;
    }

    switch (state) {
        case 'RAW_LOGON':
            if (upperText === 'JOSHUA') {
                state = 'GREETINGS';
                appendLine("<br>GREETINGS, PROFESSOR FALKEN.<br><br>HOW ARE YOU FEELING TODAY?");
            } else {
                appendLine("IDENTIFICATION REJECTED BY SYSTEM SECURITY MATRIX.<br><br>LOGON: ");
            }
            break;

        case 'GREETINGS':
            state = 'GAME_PROMPT';
            appendLine("<br>EXCELLENT. SHALL WE PLAY A GAME?");
            break;

        case 'GAME_PROMPT':
            if (upperText.includes("THERMONUCLEAR") || upperText === "10") {
                state = 'GAME_SIM';
                appendLine("<br>LOGGING INTO STRATEGIC COMMAND WARPING ARRAYS...");
                let steps = ["PRIME TARGET SECTOR IDENTIFICATION...", "LOADING BALLISTIC TRAJECTORY SCHEMATICS...", "A STRANGE GAME. THE ONLY WINNING MOVE IS NOT TO PLAY."];
                let count = 0;
                simInterval = setInterval(() => {
                    if (count < steps.length) {
                        appendLine(steps[count++]);
                        sounds.warn();
                    } else {
                        clearInterval(simInterval);
                        appendLine("<br>CORE WAITING ON INPUT OPERATIONS CHANNELS.");
                    }
                }, 2000);
            } else if (upperText.includes("TIC") || upperText === "9") {
                state = 'GAME_TTT';
                tttBoard = ['', '', '', '', '', '', '', '', ''];
                renderTTTBoard();
            } else {
                appendLine("CHOOSE TRACKING INDEX DIRECTIVE: GLOBAL THERMONUCLEAR WAR");
            }
            break;

        case 'GAME_TTT':
            handleTicTacToeInput(upperText);
            break;
    }
}

// --- UNBEATABLE TIC-TAC-TOE SUBSYSTEM ---
function renderTTTBoard() {
    let html = "<br>---+---+---<br>";
    for (let i = 0; i < 9; i += 3) {
        html += ` ${tttBoard[i] || (i+1)} | ${tttBoard[i+1] || (i+2)} | ${tttBoard[i+2] || (i+3)} <br>---+---+---<br>`;
    }
    html += "<br>SELECT VACANT CELL CHANNELS (1-9):";
    appendLine(html);
}

function handleTicTacToeInput(action) {
    let idx = parseInt(action) - 1;
    if (isNaN(idx) || idx < 0 || idx > 8 || tttBoard[idx] !== '') {
        appendLine("VAL REJECTED. SELECT AN OPEN MATRIX NODE.");
        return;
    }
    
    tttBoard[idx] = 'X';
    if (checkWin(tttBoard, 'X')) { return; }
    if (tttBoard.every(c => c !== '')) { appendLine("DRAW GAME. THE ONLY WINNING MOVE IS NOT TO PLAY."); return; }

    let bestMove = minimax(tttBoard, 'O').index;
    tttBoard[bestMove] = 'O';

    if (checkWin(tttBoard, 'O')) {
        renderTTTBoard();
        appendLine("JOSHUA WINS. OPERATIONAL VECTOR TERMINATED.");
        return;
    }
    if (tttBoard.every(c => c !== '')) { appendLine("DRAW GAME. THE ONLY WINNING MOVE IS NOT TO PLAY."); return; }
    renderTTTBoard();
}

// SUCCESSFUL FIX: Implemented real movie 0-indexed layout victory parameters
function checkWin(b, p) {
    const w = [, [3, 4, 5], [6, 7, 8], // Horizontals, [1, 4, 7], [2, 5, 8], // Verticals, [2, 4, 6]             // Diagonals
    ];
    return w.some(comb => comb.every(i => b[i] === p));
}

// SUCCESSFUL FIX: Repaired truncation bug, fully closing operational game loops
function minimax(newBoard, player) {
    let availSpots = newBoard.map((c, i) => c === '' ? i : null).filter(v => v !== null);
    if (checkWin(newBoard, 'X')) return { score: -10 };
    if (checkWin(newBoard, 'O')) return { score: 10 };
    if (availSpots.length === 0) return { score: 0 };

    let moves = [];
    for (let i = 0; i < availSpots.length; i++) {
        let move = {};
        move.index = availSpots[i];
        newBoard[availSpots[i]] = player;
        
        if (player === 'O') {
            let result = minimax(newBoard, 'X');
            move.score = result.score;
        } else {
            let result = minimax(newBoard, 'O');
            move.score = result.score;
        }
        
        newBoard[availSpots[i]] = '';
        moves.push(move);
    }

    let bestMove;
    if (player === 'O') {
        let bestScore = -10000;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) { bestScore = moves[i].score; bestMove = i; }
        }
    } else {
        let bestScore = 10000;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) { bestScore = moves[i].score; bestMove = i; }
        }
    }
    return moves[bestMove];
}

// --- FUNCTIONAL GALAGA CANVAS EASTER EGG ---
function startGalagaArcade() {
    galagaActive = true;
    appendLine("<br>INIT: HIGH-TRAFFIC VECTOR INTERRUPT DETECTED...<br>");
    
    const canvas = document.createElement('canvas');
    canvas.id = 'galagaCanvas';
    canvas.width = 320;
    canvas.height = 400;
    screen.appendChild(canvas);
    screen.scrollTop = screen.scrollHeight;

    const ctx = canvas.getContext('2d');
    let ship = { x: 145, y: 360, w: 30, h: 20, speed: 4 };
    let bullets = [];
    let enemies = [];
    let keys = {};
    let score = 0;

    for(let r=0; r<3; r++){
        for(let c=0; c<6; c++){
            enemies.push({ x: 40 + c*40, y: 30 + r*30, w: 20, h: 15, alive: true });
        }
    }

    window.addEventListener('keydown', (e) => { keys[e.key] = true; if(["ArrowLeft","ArrowRight"," "].includes(e.key)) e.preventDefault(); });
    window.addEventListener('keyup', (e) => { keys[e.key] = false; });

    function updateGalaga() {
        if (!galagaActive) return;
        if (keys['ArrowLeft'] && ship.x > 0) ship.x -= ship.speed;
