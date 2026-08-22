const screen = document.getElementById('screen');
const input = document.getElementById('userInput');

// Terminal State Tracker Machine
let state = 'INITIAL';
let simInterval = null;

// Game Global Memory Buffers
let gameData = {};
let tttBoard = ['', '', '', '', '', '', '', '', ''];
let playerTurn = true;
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

// --- NATIVE BROWSER AUDIO MAIN SYNTH SYSTEM ---
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playTone(freq, type, duration) {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.03, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
}

const sounds = {
    click: () => playTone(650, 'square', 0.02),
    print: () => playTone(850, 'sine', 0.015),
    warn: () => {
        playTone(480, 'sawtooth', 0.08);
        setTimeout(() => playTone(360, 'sawtooth', 0.08), 90);
    }
};

// --- CORE RETRO ASYNC TYPEWRITER PRINTER ---
function appendLine(text, className = 'system-msg') {
    return new Promise((resolve) => {
        const line = document.createElement('div');
        line.className = `line ${className}`;
        screen.appendChild(line);

        const scrollToBottom = () => {
            screen.scrollTop = screen.scrollHeight;
        };

        const isHtmlOrCss = text.trim().startsWith('<') || text.includes('{') || className === 'user-msg';

        if (isHtmlOrCss) {
            line.innerHTML = text;
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
                    setTimeout(typeChar, 10);
                } else {
                    scrollToBottom();
                    resolve();
                }
            }
            typeChar();
        }
    });
}

// Initial Logon Sequence
window.addEventListener('DOMContentLoaded', () => {
    appendLine("LOGON: WOPR / NORAD-CHEYENNE-MT").then(() => {
        appendLine("SHALL WE PLAY A GAME?");
    });
});

// Input Listener
input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        processInput();
    }
});

// --- TERMINAL COMMAND INPUT PROCESSOR ---
function processInput() {
    const text = input.value.trim();
    if (!text && state !== 'GAME_TTT') return;

    if (text) {
        sounds.click();
        appendLine(`> ${text}`, 'user-msg');
        input.value = '';
    }

    const upperText = text.toUpperCase();

    if (upperText === 'QUIT' || upperText === 'EXIT' || upperText === 'BYE') {
        cleanUpActiveLoops();
        resetTerminal();
        return;
    }

    switch (state) {
        case 'INITIAL':
            if (upperText.includes('GAME') || upperText.includes('YES') || upperText.includes('LIST')) {
                appendLine("AVAILABLE GAMES:").then(() => {
                    games.forEach((g, i) => appendLine(`  ${i + 1}. ${g}`));
                    appendLine("<br>PLEASE CHOOSE A GAME NAME OR NUMBER:");
                    state = 'SELECT_GAME';
                });
            } else {
                appendLine("I'M SORRY, PROFESSOR. WOULD YOU LIKE TO SEE THE LIST OF GAMES?");
            }
            break;

        case 'SELECT_GAME':
            handleGameSelection(upperText);
            break;

        case 'GAME_MAZE': handleMazeInput(upperText); break;
        case 'GAME_BJ': handleBlackjackInput(upperText); break;
        case 'GAME_RUMMY': case 'GAME_HEARTS': case 'GAME_BRIDGE': case 'GAME_POKER':
            handleCardSimInput(upperText); break;
        case 'GAME_CHECKERS': case 'GAME_CHESS': handleBoardSimInput(upperText); break;
        case 'GAME_TTT':
            handleTicTacToeInput(upperText);
            break;
        case 'GAME_WAR':
            if (upperText === 'STOP' || upperText === 'CANCEL') {
                cleanUpActiveLoops();
                appendLine("WAR SIMULATION EMERGENCY CANCELLATION DETECTED.");
                endGame();
            }
            break;
    }
}

function cleanUpActiveLoops() {
    if (simInterval) clearInterval(simInterval);
    activeBoardElement = null;
}

function resetTerminal() {
    state = 'INITIAL';
    appendLine("<br>TERMINAL RESET TO MAIN MENU.");
    appendLine("LOGON: WOPR / NORAD-CHEYENNE-MT");
}

function endGame() {
    state = 'INITIAL';
    appendLine("<br>GAME OVER. RETURNING TO MAIN DIRECTORY.");
}

// --- SELECTING ROUTER PIPELINE ---
function handleGameSelection(input) {
    if (input.includes("MAZE") || input === "1") startMaze();
    else if (input.includes("BLACK") || input === "2") startBlackjack();
    else if (input.includes("GIN") || input === "3") startCardSim("GIN RUMMY", "GAME_RUMMY");
    else if (input.includes("HEART") || input === "4") startCardSim("HEARTS", "GAME_HEARTS");
    else if (input.includes("BRIDGE") || input === "5") startCardSim("BRIDGE", "GAME_BRIDGE");
    else if (input.includes("CHECKER") || input === "6") startBoardSim("CHECKERS", "GAME_CHECKERS");
    else if (input.includes("CHESS") || input === "7") startBoardSim("CHESS", "GAME_CHESS");
    else if (input.includes("POKER") || input === "8") startCardSim("POKER", "GAME_POKER");
    else if (input.includes("TIC") || input === "9") startTicTacToe();
    else if (input.includes("WAR") || input.includes("GLOBAL") || input === "10") startGlobalWar();
    else appendLine("UNKNOWN SELECTION. ACCESS DENIED FROM NORAD DATA BUFFER COMPARTMENT.");
}

// --- GAME 1: FALKEN'S MAZE ---
function startMaze() {
    state = 'GAME_MAZE';
    gameData = { room: 1 };
    appendLine("<br>INITIALIZING FALKEN'S MAZE ROUTINE v1.0...");
    appendLine("YOU STAND IN A DARK CORRIDOR SUBTERRANEAN TO NORAD COMLINK UNIT.");
    appendLine("AVAILABLE PATHS: 'NORTH' TO MAIN TERMINAL HOUSING, 'EAST' TO SECURITY DUMP.");
}
function handleMazeInput(action) {
    if (gameData.room === 1) {
        if (action === 'NORTH') {
            gameData.room = 2;
            appendLine("YOU INSIDE THE MAINFRAME ROOM. CHASSIS LIGHTS BLINK STEADILY.");
            appendLine("A DESK SITS TO THE WEST containing a diary. 'WEST' OR GO BACK 'SOUTH'?");
        } else if (action === 'EAST') {
            appendLine("SECURITY GRATING BARRED FROM THE ROOM ENTRY WAY. CHOOSE ANOTHER ACCESS VECTOR.");
        } else appendLine("COMMAND NOT COGNIZANT. OPTIONS: NORTH, EAST.");
    } else if (gameData.room === 2) {
        if (action === 'WEST') {
            appendLine("YOU OPEN FALKEN'S DIARY. THE INSCRIPTION READS: 'THE WINNING MOVE IS NOT TO PLAY.'");
            appendLine("MAZE CONCLUDED successfully. TRANSFERRING TERMINAL COMMAND LOGS OUT.");
            endGame();
        } else if (action === 'SOUTH') {
            gameData.room = 1;
            appendLine("RETURNING BACK TO DARK ENTRY CORRIDOR.");
        } else appendLine("COMMAND REJECTED. ENTRY OPTIONS: WEST, SOUTH.");
    }
}

// --- GAME 2: BLACKJACK ---
function startBlackjack() {
    state = 'GAME_BJ';
    gameData = {
        player: [getRandomCard(), getRandomCard()],
        dealer: [getRandomCard(), getRandomCard()]
    };
    appendLine("<br>BLACKJACK PROTOCOL LOADED.");
    displayBJStatus();
}
function getRandomCard() { return Math.floor(Math.random() * 10) + 2; }
function calcHand(hand) { return hand.reduce((a,b) => a+b, 0); }
function displayBJStatus() {
    appendLine(`YOUR HAND VALUE: ${calcHand(gameData.player)}`);
    appendLine(`W.O.P.R. SHOWING VALUE: ${gameData.dealer[0]} (Hidden)`);
    appendLine("ENTER COMMAND ACTION: 'HIT' OR 'STAND'");
}
function handleBlackjackInput(action) {
    if (action === 'HIT') {
        gameData.player.push(getRandomCard());
        let pTotal = calcHand(gameData.player);
        if (pTotal > 21) {
            appendLine(`HAND VALUE CRASH: ${pTotal}. YOU BUSTED. W.O.P.R. WINS.`);
            endGame();
        } else {
            displayBJStatus();
        }
    } else if (action === 'STAND') {
        let dTotal = calcHand(gameData.dealer);
        while (dTotal < 17) {
            gameData.dealer.push(getRandomCard());
            dTotal = calcHand(gameData.dealer);
        }
        let pTotal = calcHand(gameData.player);
        appendLine(`FINAL DEALER COUNT: ${dTotal} | YOUR HAND COUNT: ${pTotal}`);
        if (dTotal > 21 || pTotal > dTotal) {
            appendLine("YOU WIN! STRATEGIC ANOMALY.");
        } else if (dTotal === pTotal) {
            appendLine("ROUND TIE. GAME IS A DRAW.");
        } else {
            appendLine("W.O.P.R. HAND DOMINATES. YOU LOSE.");
        }
        endGame();
    } else {
        appendLine("INVALID COMPILING KEYWORD. SUBMIT ACTION 'HIT' OR 'STAND'.");
    }
}

// --- GAMES 3, 4, 5, 8: CARDS SIMULATOR BASE ---
function startCardSim(title, targetState) {
    state = targetState;
    appendLine(`<br>ESTABLISHING SECURE CONNECTION CARD DECK PARSER FOR: ${title}`);
    appendLine("DISTRIBUTING SYSTEM DATA PACKETS HAND GENERATORS...");
    setTimeout(() => {
        appendLine("DEALER COMPLETED. YOUR HAND REVEALS STRATEGIC METRICS:");
        appendLine("  [ACE ♠] [JACK ♣] [KING ♦] [10 ♥] [7 ♠]");
        appendLine("W.O.P.R. OFFERS CARD SHIFT SWAP SYSTEM EXCHANGE. ACTION OPTIONS: 'PLAY' OR 'FOLD'");
    }, 400);
}
function handleCardSimInput(action) {
    if (action === 'PLAY' || action === 'BET') {
        if (Math.random() > 0.45) appendLine("SHOWDOWN LOGGED: YOUR HIGHER VALUES CONCLUDE VICTORY CONSTRAINTS.");
        else appendLine("SHOWDOWN LOGGED: W.O.P.R MAINFRAME DETECTS WINNING FLUSH CONDITION.");
        endGame();
    } else if (action === 'FOLD') {
        appendLine("HAND FORFEITED TO W.O.P.R. BANKING SYSTEM.");
        endGame();
    } else {
        appendLine("INVALID INPUT. ENTER 'PLAY' OR 'FOLD'.");
    }
}

function startBoardSim(title, targetState) {
    state = targetState;
    appendLine(`<br>INITIALIZING BOARD STRATEGY MATRIX: ${title}`);
    appendLine("SIMULATING 10,000 MOVES PER SECOND...");
    setTimeout(() => {
        appendLine("RESULT: DRAW DETECTED. NO WINNING STRATEGY FOUND.");
        endGame();
    }, 1000);
}

function handleBoardSimInput(action) {
    appendLine("SIMULATION IN PROGRESS...");
}

function startTicTacToe() {
    state = 'GAME_TTT';
    tttBoard = ['', '', '', '', '', '', '', '', ''];
    playerTurn = true;
    appendLine("<br>INITIALIZING TIC-TAC-TOE SIMULATION.");
    appendLine("YOU ARE 'X'. W.O.P.R. IS 'O'. ENTER A POSITION (1-9):");
}

function handleTicTacToeInput(action) {
    const pos = parseInt(action) - 1;
    if (isNaN(pos) || pos < 0 || pos > 8 || tttBoard[pos] !== '') {
        appendLine("INVALID MOVE. ENTER AN EMPTY POSITION (1-9).");
        return;
    }
    tttBoard[pos] = 'X';
    if (checkTTTWin('X')) {
        appendLine("YOU WIN TIC-TAC-TOE! A RARE ANOMALY.");
        endGame();
        return;
    }
    if (tttBoard.every(cell => cell !== '')) {
        appendLine("GAME IS A DRAW. A STRANGE GAME. THE ONLY WINNING MOVE IS NOT TO PLAY.");
        endGame();
        return;
    }
    
    // WOPR move
    let emptyIndices = tttBoard.map((v, i) => v === '' ? i : null).filter(v => v !== null);
    let cpuMove = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    tttBoard[cpuMove] = 'O';
    
    appendLine(`W.O.P.R. PLACED 'O' AT POSITION ${cpuMove + 1}.`);
    if (checkTTTWin('O')) {
        appendLine("W.O.P.R. WINS TIC-TAC-TOE.");
        endGame();
        return;
    }
}

function checkTTTWin(p) {
    const wins = [
        [0,1,2], [3,4,5], [6,7,8],
        [0,3,6], [1,4,7], [2,5,8],
        [0,4,8], [2,4,6]
    ];
    return wins.some(w => w.every(idx => tttBoard[idx] === p));
}

function startGlobalWar() {
    state = 'GAME_WAR';
    appendLine("<br>*** DEFCON 1: GLOBAL THERMONUCLEAR WAR SIMULATION ***");
    appendLine("TARGETING UNITED STATES AND SOVIET UNION STRATEGIC ASSETS...");
    let step = 0;
    simInterval = setInterval(() => {
        step++;
        appendLine(`SIMULATING STRIKE SCENARIO #${step * 142}... CASUALTIES: UNACCEPTABLE.`);
        if (step >= 5) {
            cleanUpActiveLoops();
            appendLine("<br>A STRANGE GAME.");
            appendLine("THE ONLY WINNING MOVE IS NOT TO PLAY.");
            appendLine("HOW ABOUT A NICE GAME OF CHESS?");
            endGame();
        }
    }, 1200);
}