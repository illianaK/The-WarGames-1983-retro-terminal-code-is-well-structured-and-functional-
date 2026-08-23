const screen = document.getElementById('screen');
const input = document.getElementById('userInput');

// Terminal State Tracker Machine
let state = 'INITIAL';
let simInterval = null;
let galagaLoop = null;

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
    pew: () => playTone(880, 'sawtooth', 0.07),
    enemyPew: () => playTone(440, 'sine', 0.06),
    boom: () => playTone(140, 'sawtooth', 0.25),
    hurt: () => {
        playTone(200, 'triangle', 0.15);
        setTimeout(() => playTone(150, 'triangle', 0.15), 100);
    },
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

        if ((text.includes('<') && text.includes('>')) || className === 'user-msg') {
            line.innerHTML = text;
            screen.scrollTop = screen.scrollHeight;
            if (className !== 'user-msg') sounds.print();
            resolve();
        } else {
            let index = 0;
            function typeChar() {
                if (index < text.length) {
                    line.textContent += text.charAt(index);
                    index++;
                    sounds.print();
                    screen.scrollTop = screen.scrollHeight;
                    setTimeout(typeChar, 10);
                } else {
                    resolve();
                }
            }
            typeChar();
        }
    });
}

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

    // Global escape commands
    if (upperText === 'QUIT' || upperText === 'EXIT' || upperText === 'BYE') {
        cleanUpActiveLoops();
        resetTerminal();
        return;
    }

    // Secret Easter Egg Trigger
    if (upperText === 'GALAGA') {
        cleanUpActiveLoops();
        startGalagaSecretEgg();
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
        case 'GAME_RUMMY': handleGinRummyInput(upperText); break;
        case 'GAME_HEARTS': handleHeartsInput(upperText); break;
        case 'GAME_BRIDGE': handleBridgeInput(upperText); break;
        case 'GAME_POKER': handlePokerInput(upperText); break;
        case 'GAME_CHECKERS': handleCheckersInput(upperText); break;
        case 'GAME_CHESS': handleChessInput(upperText); break;
        case 'GAME_TTT': break; // Handled directly inside cell event listeners
        case 'GAME_WAR':
            if (upperText === 'STOP') {
                clearInterval(simInterval);
                appendLine("WAR SIMULATION EMERGENCY CANCELLATION DETECTED.");
                resetTerminal();
            }
            break;
    }
}

function cleanUpActiveLoops() {
    if (simInterval) clearInterval(simInterval);
    if (galagaLoop) cancelAnimationFrame(galagaLoop);
    window.onkeydown = null;
    window.onkeyup = null;
}

// --- SELECTING ROUTER PIPELINE ---
function handleGameSelection(input) {
    if (input.includes("MAZE") || input === "1") startMaze();
    else if (input.includes("BLACK") || input === "2") startBlackjack();
    else if (input.includes("GIN") || input === "3") startGinRummy();
    else if (input.includes("HEART") || input === "4") startHearts();
    else if (input.includes("BRIDGE") || input === "5") startBridge();
    else if (input.includes("CHECKER") || input === "6") startCheckers();
    else if (input.includes("CHESS") || input === "7") startChess();
    else if (input.includes("POKER") || input === "8") startPoker();
    else if (input.includes("TIC") || input === "9") startTicTacToe();
    else if (input.includes("WAR") || input.includes("GLOBAL") || input === "10") startGlobalWar();
    else appendLine("UNKNOWN SELECTION. ACCESS DENIED FROM NORAD DATA BUFFER COMPARTMENT.");
}

// --- HELPER FOR DECK GENERATION ---
function generateRandomHand(cardCount) {
    const suits = ['♠', '♥', '♦', '♣'];
    const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    let hand = [];
    for (let i = 0; i < cardCount; i++) {
        let suit = suits[Math.floor(Math.random() * suits.length)];
        let rank = ranks[Math.floor(Math.random() * ranks.length)];
        hand.push({ rank, suit, string: `${rank}${suit}` });
    }
    return hand;
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
            appendLine("A DESK SITS TO THE WEST CONTAINING A DIARY. 'WEST' OR GO BACK 'SOUTH'?");
        } else if (action === 'EAST') {
            appendLine("SECURITY GRATING BARRED FROM THE ROOM ENTRY WAY. CHOOSE ANOTHER ACCESS VECTOR.");
        } else appendLine("COMMAND NOT COGNIZANT. OPTIONS: NORTH, EAST.");
    } else if (gameData.room === 2) {
        if (action === 'WEST') {
            appendLine("YOU OPEN FALKEN'S DIARY. THE INSCRIPTION READS: 'THE WINNING MOVE IS NOT TO PLAY.'");
            appendLine("MAZE CONCLUDED SUCCESSFULLY. TRANSFERRING TERMINAL COMMAND LOGS OUT.");
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
            appendLine(`YOUR HAND VALUE: ${pTotal} - YOU BUSTED! W.O.P.R. WINS.`);
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
        appendLine(`YOUR FINAL VALUE: ${pTotal}`);
        appendLine(`W.O.P.R. FINAL VALUE: ${dTotal}`);
        if (dTotal > 21 || pTotal > dTotal) {
            appendLine("YOU WIN! LOGGING SUCCESS STRAT TO COMLINK.");
        } else if (dTotal > pTotal) {
            appendLine("W.O.P.R. WINS. LOGIC ENGINE OPTIMIZED.");
        } else {
            appendLine("STALEMATE STANDOFF. TIED GAME STACK MATCH.");
        }
        endGame();
    } else {
        appendLine("INVALID COMMAND. INPUT 'HIT' OR 'STAND'");
    }
}

// --- GAME 3: GIN RUMMY ---
function startGinRummy() {
    state = 'GAME_RUMMY';
    gameData.hand = generateRandomHand(10);
    appendLine("<br>LOADING GIN RUMMY CORE SYSTEM...");
