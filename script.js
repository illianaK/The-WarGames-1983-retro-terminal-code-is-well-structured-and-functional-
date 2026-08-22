        let pTotal = calcHand(gameData.player);
        if (pTotal > 21) {
            appendLine(`YOUR HAND VALUE: ${pTotal}`);
            appendLine("YOU BUSTED! W.O.P.R. WINS BY DEFAULT PIPELINE NETWORKS.");
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
        appendLine(`FINAL STANDINGS — YOUR HAND: ${pTotal} | W.O.P.R. HAND: ${dTotal}`);
        if (dTotal > 21 || pTotal > dTotal) {
            appendLine("PROFESSOR WINS THE VECTOR MATCHUP.");
        } else if (pTotal < dTotal) {
            appendLine("W.O.P.R. SUPERIOR ALGORITHM PREVAILS.");
        } else {
            appendLine("MATCH DETERMINED A DRAW TIED MATRIX.");
        }
        endGame();
    } else {
        appendLine("INVALID SPECIFICATION. CHOOSE: 'HIT' OR 'STAND'");
    }
}

// --- GAMES 3, 4, 5, 8: SIMULATED CARD GAMES ---
function startCardSim(name, gameState) {
    state = gameState;
    appendLine(`<br>INITIALIZING ${name} ENGINE MATRIX...`);
    appendLine("DISTRIBUTING DATA BUFFERS AND SHUFFLING PACKETS...");
    setTimeout(() => {
        appendLine("DEALING COMPLETE. COMPUTING OPTIMAL GAME TREES...");
        setTimeout(() => {
            appendLine("W.O.P.R. DETERMINES COMBINATORIAL PROBABILITY IS A DEADLOCK.");
            appendLine("GAME INTERRUPTED BY AUTOMATED ADVERSARIAL DISMISSAL.");
            endGame();
        }, 1500);
    }, 1000);
}
function handleCardSimInput(action) {
    appendLine("SIMULATOR PROCESSING INTERRUPTED. COMMAND BUFFER LOCKED.");
}

// --- GAMES 6, 7: SIMULATED BOARD GAMES ---
function startBoardSim(name, gameState) {
    state = gameState;
    appendLine(`<br>LOADING ${name} ENGINE REGISTER SECTOR...`);
    appendLine("GRID SCHEMATICS COGENT. READY FOR INPUT MOVES.");
    appendLine("PLEASE INPUT AN ALPHANUMERIC VECTOR TO COMMENCE (e.g., E2E4):");
}
function handleBoardSimInput(action) {
    if (!action) return;
    appendLine(`CALCULATING COUNTER-RESPONSE TO MOVE: ${action}...`);
    setTimeout(() => {
        sounds.warn();
        appendLine("W.O.P.R. ANALYZING POSITION...");
        appendLine("STRATEGIC OUTCOMES EQUAL ZERO VARIANCE.");
        appendLine("MATCH TERMINATED PERMUTATION INCONCLUSIVE.");
        endGame();
    }, 1200);
}

// --- GAME 9: TIC-TAC-TOE (THE KEY PARADIGM SHIFT) ---
function startTicTacToe() {
    state = 'GAME_TTT';
    tttBoard = ['', '', '', '', '', '', '', '', ''];
    playerTurn = true;
    
    appendLine("<br>INITIALIZING TIC-TAC-TOE SUBSYSTEM COMPARTMENT...");
    
    // Create UI matrix container
    activeBoardElement = document.createElement('div');
    activeBoardElement.className = 'ttt-grid-container';
    activeBoardElement.style.display = 'grid';
    activeBoardElement.style.gridTemplateColumns = 'repeat(3, 80px)';
    activeBoardElement.style.gap = '8px';
    activeBoardElement.style.margin = '15px 0';
    
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('button');
        cell.className = 'ttt-cell';
        cell.dataset.index = i;
        cell.style.height = '80px';
        cell.style.background = '#001100';
        cell.style.border = '2px solid #00ff00';
        cell.style.color = '#00ff00';
        cell.style.fontFamily = 'monospace';
        cell.style.fontSize = '24px';
        cell.style.cursor = 'pointer';
        cell.onclick = () => handleTTTCellClick(i);
        activeBoardElement.appendChild(cell);
    }
    
    screen.appendChild(activeBoardElement);
    appendLine("SELECT ANY GRID MATRIX CELL POSITION TO INITIALIZE VECTOR MOVEMENT.");
}

function handleTTTCellClick(index) {
    if (state !== 'GAME_TTT' || !playerTurn || tttBoard[index] !== '') return;
    
    sounds.click();
    tttBoard[index] = 'X';
    updateTTTUI();
    
    if (checkTTTWin('X')) {
        appendLine("IMPOSSIBLE ANOMALY! PROFESSOR WINS INTERFACE MATRIX.");
        endGame();
        return;
    }
    
    if (!tttBoard.includes('')) {
        appendLine("A STRANGE GAME. THE ONLY WINNING MOVE IS NOT TO PLAY.");
        endGame();
        return;
    }
    
    playerTurn = false;
    appendLine("W.O.P.R. COMPUTING COUNTER-INTERSECTION VECTOR...");
    
    setTimeout(() => {
        makeWOPRTTTMove();
    }, 600);
}

function makeWOPRTTTMove() {
    // 1. Can WOPR win right now?
    let move = findWinningTTTIndex('O');
    // 2. Block user from winning
    if (move === -1) move = findWinningTTTIndex('X');
    // 3. Fallback to random empty slot
    if (move === -1) {
        const empties = tttBoard.map((c, i) => c === '' ? i : null).filter(v => v !== null);
        move = empties[Math.floor(Math.random() * empties.length)];
    }
    
    tttBoard[move] = 'O';
    updateTTTUI();
    sounds.warn();
    
    if (checkTTTWin('O')) {
        appendLine("W.O.P.R. COGNIZANT SYSTEM WINS THE CELL SECTOR.");
        endGame();
        return;
    }
    
    if (!tttBoard.includes('')) {
        appendLine("DRAW PARADIGM ENCOUNTERED. THE WINNING MOVE IS NOT TO PLAY.");
        endGame();
        return;
    }
    
    playerTurn = true;
}

function findWinningTTTIndex(player) {
    const winConditions = [, [3, 4, 5], [6, 7, 8],
, [1, 4, 7], [2, 5, 8],
, [2, 4, 6]
    ];
    for (let condition of winConditions) {
        const [a, b, c] = condition;
        if (tttBoard[a] === player && tttBoard[b] === player && tttBoard[c] === '') return c;
        if (tttBoard[a] === player && tttBoard[c] === player && tttBoard[b] === '') return b;
        if (tttBoard[b] === player && tttBoard[c] === player && tttBoard[a] === '') return a;
    }
    return -1;
}

function checkTTTWin(player) {
    const winConditions = [, [3, 4, 5], [6, 7, 8],
, [1, 4, 7], [2, 5, 8],
, [2, 4, 6]
    ];
    return winConditions.some(comb => comb.every(idx => tttBoard[idx] === player));
}

function updateTTTUI() {
    if (!activeBoardElement) return;
    const cells = activeBoardElement.getElementsByClassName('ttt-cell');
    for (let i = 0; i < cells.length; i++) {
        cells[i].textContent = tttBoard[i];
        if (tttBoard[i] !== '') {
            cells[i].style.background = '#002200';
            cells[i].style.cursor = 'default';
        }
    }
}

// --- GAME 10: GLOBAL THERMONUCLEAR WAR ---
function startGlobalWar() {
    state = 'GAME_WAR';
    appendLine("<br>🚨 WARNING: DEFCON STATUS ESCALATING REDUCED MARGINS 🚨");
    appendLine("LAUNCH CODE INTERFACE SEQUENCING COMMENCING.");
    appendLine("SIMULATING FIRST STRIKE TRAJECTORIES. TYPE 'STOP' TO CANCEL INTERFACE ARRANGEMENT.");
    
    let cycles = 0;
    const targets = ["MOSCOW", "WASHINGTON DC", "LONDON", "PARIS", "BEIJING", "NORAD SITE"];
    
    simInterval = setInterval(() => {
        sounds.warn();
        const tgt = targets[Math.floor(Math.random() * targets.length)];
        const casualties = Math.floor(Math.random() * 50) + 10;
        appendLine(`ICBM TRACK VECTOR INBOUND TO --> ${tgt}. ESTIMATED LOSSES: ${casualties} MILLION.`);
        cycles++;
        
        if (cycles >= 8) {
            clearInterval(simInterval);
            sounds.boom();
            appendLine("<br>💥 SIMULATION COMPLETE. GLOBAL LOSS LEVEL: TOTAL SURRENDER ARTIFACT.");
            appendLine("STRATEGIC CONCLUSION: A STRANGE GAME. THE ONLY WINNING MOVE IS NOT TO PLAY.");
            endGame();
        }
    }, 1500);
}

// --- SECRET EASTER EGG GAME ROUTINE: CHROME ARCHITECTURE GALAGA ENGINE ---
function startGalagaSecretEgg(stage, score, lives) {
    state = 'SECRET_GALAGA';
    appendLine(`<br>👾 CRACKING CORE SUB-NORAD DATA SECTOR: GALAGA LOADER v0.4 👾`);
    appendLine(`STAGE: ${stage} | MEMORY SCORE CACHE: ${score} | LIVES LEFT: ${lives}`);
    
    // Construct inline HTML5 display architecture
    const canvasWrap = document.createElement('div');
    canvasWrap.style.margin = '15px 0';
    canvasWrap.style.textAlign = 'center';
    
    const cvs = document.createElement('canvas');
    cvs.id = 'galagaCanvas';
    cvs.width = 360;
    cvs.height = 400;
    cvs.style.border = '3px double #00ff00';
    cvs.style.background = '#000000';
    canvasWrap.appendChild(cvs);
    screen.appendChild(canvasWrap);
    
    const ctx = cvs.getContext('2d');
    
    // Game state tracking variables
    let playerX = cvs.width / 2;
    const playerY = cvs.height - 30;
    const playerWidth = 24;
    const playerHeight = 16;
    let keys = {};
    
    let projectiles = [];
    let enemyProjectiles = [];
    let enemies = [];
    
    // Construct Grid Matrix for Invading Entities
    const rows = 3 + stage;
    const cols = 6;
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            enemies.push({
                x: 40 + c * 45,
                y: 40 + r * 30,
                w: 20,
                h: 14,
                dir: 1,
                speed: 1 + (stage * 0.2),
                type: r === 0 ? 'commander' : (r === 1 ? 'red' : 'blue')
            });
        }
    }
    
    // Capture Global Key Listener Streams
    window.onkeydown = (e) => { keys[e.code] = true; if (e.code === 'Space' || e.code === 'ArrowUp') e.preventDefault(); };
    window.onkeyup = (e) => { keys[e.code] = false; };
    
    let lastShot = 0;
    
    function runLoop() {
        if (state !== 'SECRET_GALAGA') return;
        
        // 1. Process Movements
        if (keys['ArrowLeft'] || keys['KeyA']) playerX = Math.max(playerWidth / 2, playerX - 4);
        if (keys['ArrowRight'] || keys['KeyD']) playerX = Math.min(cvs.width - playerWidth / 2, playerX + 4);
        
        if ((keys['Space'] || keys['ArrowUp']) && Date.now() - lastShot > 250) {
