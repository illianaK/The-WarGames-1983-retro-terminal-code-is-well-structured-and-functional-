// --- AUTO-INJECT CRT CYAN STYLING INTO DOM ---
const woprStyle = document.createElement('style');
woprStyle.textContent = `
    #screen, .line, .system-msg, .user-msg, #userInput {
        color: #00d0ff !important;
        text-shadow: 0 0 5px #00d0ff, 0 0 10px #0088ff !important;
    }
    .typing::after, .cursor {
        background-color: #00d0ff !important;
        box-shadow: 0 0 8px #00d0ff !important;
    }
`;
document.head.appendChild(woprStyle);

// Targeted fix: Explicitly binding to the correct HTML ID element
const screen = document.getElementById('screen');
const input = document.getElementById('userInput');

// Terminal State Tracker Machine
let state = 'INITIAL';
let simInterval = null;

// Game Global Memory Buffers
let gameData = {};
let tttBoard = ['', '', '', '', '', '', '', '', ''];

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

document.addEventListener('click', () => {
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}, { once: true });

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
        line.className = `line ${className} typing`;
        screen.appendChild(line);

        const scrollToBottom = () => {
            screen.scrollTop = screen.scrollHeight;
        };

        const isHtmlOrCss = text.trim().startsWith('<') || className === 'user-msg';

        if (isHtmlOrCss) {
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
                    setTimeout(typeChar, 10);
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

// Initial Logon Sequence Trigger
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

    if (['QUIT', 'EXIT', 'BYE'].includes(upperText)) {
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

        case 'GAME_MAZE': 
            handleMazeInput(upperText); 
            break;
            
        case 'GAME_SIM':
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
}

function resetTerminal() {
    state = 'INITIAL';
    screen.innerHTML = '';
    appendLine("LOGON: WOPR / NORAD-CHEYENNE-MT").then(() => {
        appendLine("SHALL WE PLAY A GAME?");
    });
}

function endGame() {
    state = 'INITIAL';
    appendLine("<br>GAME OVER. RETURNING TO MAIN DIRECTORY.");
}

function handleGameSelection(inputVal) {
    if (inputVal.includes("MAZE") || inputVal === "1") {
        state = 'GAME_MAZE';
        gameData = { room: 1 };
        appendLine("<br>INITIALIZING FALKEN'S MAZE ROUTINE v1.0...");
        appendLine("YOU STAND IN A DARK CORRIDOR SUBTERRANEAN TO NORAD COMLINK UNIT.");
        appendLine("AVAILABLE PATHS: 'NORTH' TO MAIN TERMINAL HOUSING, 'EAST' TO SECURITY DUMP.");
    } else if (inputVal.includes("WAR") || inputVal.includes("THERMONUCLEAR") || inputVal === "10") {
        state = 'GAME_SIM';
        appendLine("<br>LOGGING INTO STRATEGIC COMMAND DEFENSE SYSTEM...");
        let steps = ["PRIME TARGET: SEATTLE", "PRIME TARGET: MOSCOW", "LAUNCH CODES TRACKING...", "SIMULATING TRAJECTORIES..."];
        let counter = 0;
        simInterval = setInterval(() => {
            if (counter < steps.length) {
                appendLine(steps[counter++]);
                sounds.warn();
            } else {
                appendLine("<br>A STRANGE GAME. THE ONLY WINNING MOVE IS NOT TO PLAY.");
                cleanUpActiveLoops();
                endGame();
            }
        }, 1500);
    } else {
        state = 'GAME_SIM';
        appendLine(`<br>RUNNING SIMULATION MODULE SYSTEM MATRIX...`);
        simInterval = setInterval(() => {
            appendLine("PROCESSING TRAFFIC INTERRUPT VECTOR...");
        }, 2000);
    }
}

// Fixed and completed Maze loop syntax
function handleMazeInput(action) {
    if (gameData.room === 1) {
        if (action === 'NORTH') {
            gameData.room = 2;
            appendLine("YOU ARE INSIDE THE MAINFRAME ROOM. CHASSIS LIGHTS BLINK STEADILY.");
            appendLine("A DESK SITS TO THE WEST CONTAINING A DIARY. TYPE 'WEST' OR GO BACK 'SOUTH'?");
        } else if (action === 'EAST') {
            sounds.warn();
            appendLine("SECURITY COMPARTMENT ACCESS REJECTED. ALARM ACTIVATED.");
            endGame();
        } else {
            appendLine("INVALID PATH VECTOR.");
        }
    } else if (gameData.room === 2) {
        if (action === 'WEST') {
            appendLine("YOU OPEN THE DIARY. IT READS: 'THE ONLY WINNING MOVE IS NOT TO PLAY.'");
            appendLine("SYSTEM SOLVED. YOU WIN!");
            endGame();
        } else if (action === 'SOUTH') {
            gameData.room = 1;
            appendLine("RETURNING TO STARTING CORRIDOR. PATHS: 'NORTH' OR 'EAST'.");
        } else {
            appendLine("UNKNOWN INPUT DIRECTION.");
        }
    }
}
