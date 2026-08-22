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
        appendLine("HAND RETRACTED. DECK TRANSFERS YIELD CONTROL BACK TO COMPUTER TERMINAL MODULE.");
        endGame();
    } else appendLine("COMMAND PARSING ABORTED. TYPE ACTION WORD VALUE 'PLAY' OR 'FOLD'.");
}

// --- GAMES 6, 7: ENGINE BOARD SYSTEM SIMULATOR ---
function startBoardSim(title, targetState) {
    state = targetState;
    appendLine(`<br>MOUNTING DIGITAL GRID ARRAYS FOR: ${title}`);
    appendLine("PARSING COMPILING MATRIX SCENARIO LOGIC...");
    setTimeout(() => {
        appendLine("WHITE (PLAYER) POSITION METRICS READY.");
        appendLine("SUGGESTED ENGINE STRATEGY VECTOR: OPEN PAWN TO COORDINATE SPACE BLOCK 'E4'.");
        appendLine("TYPE SYSTEM INPUT RUN ACTION COMMAND: 'MOVE E4' OR 'MOVE D4'.");
    }, 500);
}
function handleBoardSimInput(action) {
    if (action.startsWith('MOVE')) {
        appendLine(`PROCESSING SECTOR UPDATE RECALCULATION ROUTINES: ${action}...`);
        setTimeout(() => {
            appendLine("W.O.P.R MAINFRAME CALIBRATES COUNTERMOVE SYSTEM ATTACK RESPONSE AT VECTOR CELL G8.");
            appendLine("BOARD COMPLEXITY REACHES EQUILIBRIUM. STALEMATE DETECTED IN FORWARD MATRICES.");
            endGame();
        }, 600);
    } else appendLine("SYNTAX TRACKING SYSTEM NOTING ERROR: COMMAND STRUCTURE MUST START WITH 'MOVE [CELL]'.");
}

// --- GAME 9: TIC-TAC-TOE (UNBEATABLE MINIMAX IMPLEMENTATION) ---
function startTicTacToe() {
    state = 'GAME_TTT';
    tttBoard = ['', '', '', '', '', '', '', '', ''];
    playerTurn = true;
    appendLine("<br>INITIALIZING TIC-TAC-TOE SYSTEM VECTOR MATRICES...");
    appendLine("CLICK AN EXECUTABLE SECTOR ON THE GRID INTERFACE BOARD TO ENGAGE 'X':");

    const container = document.createElement('div');
    container.className = 'board-container';
    const grid = document.createElement('div');
    grid.className = 'tic-tac-toe';

    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.dataset.index = i;
        cell.addEventListener('click', handleCellClick);
        grid.appendChild(cell);
    }
    container.appendChild(grid);
    activeBoardElement = container;
    screen.appendChild(container);
    screen.scrollTop = screen.scrollHeight;
}

function handleCellClick(e) {
    if (!playerTurn || state !== 'GAME_TTT') return;
    const idx = parseInt(e.target.dataset.index, 10);
    if (tttBoard[idx] !== '') return;

    sounds.click();
    makeMove(idx, 'X');

    if (checkWin(tttBoard, 'X')) { 
        appendLine("YOU WIN! STRATEGIC ANOMALY CALCULATED."); 
        endGame(); 
        return; 
    }
    if (isBoardFull()) { 
        appendLine("GRID EQUILIBRIUM: DRAW DESIGNATION VALUE."); 
        endGame(); 
        return; 
    }

    playerTurn = false;
    appendLine("W.O.P.R. MAINFRAME CYCLING MATHEMATICAL MINIMAX DEPTH STRATEGY...");
    
    setTimeout(() => {
        const aiMove = getUnbeatableBestMove();
        makeMove(aiMove, 'O');
        sounds.click();
        
        if (checkWin(tttBoard, 'O')) { 
            appendLine("W.O.P.R. SECURES MATRICES DOMINANCE. YOU LOSE."); 
            endGame(); 
        } else if (isBoardFull()) { 
            appendLine("MUTUALLY ASSURED DESTRUCTION AVERTED THROUGH EQUAL BALANCED MATRIX TIE."); 
            endGame(); 
        } else { 
            playerTurn = true; 
        }
    }, 500);
}

function makeMove(idx, symbol) {
    tttBoard[idx] = symbol;
    if (activeBoardElement) {
        const cells = activeBoardElement.querySelectorAll('.cell');
        if (cells[idx]) cells[idx].innerText = symbol;
    }
}

function isBoardFull() { return tttBoard.every(c => c !== ''); }

function checkWin(board, sym) {
    const wins = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Horizontals
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Verticals
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];
    return wins.some(p => p.every(i => board[i] === sym));
}

function getUnbeatableBestMove() {
    let bestScore = -Infinity;
    let move = 0;
    
    for (let i = 0; i < 9; i++) {
        if (tttBoard[i] === '') {
            tttBoard[i] = 'O';
            let score = minimax(tttBoard, 0, false);
            tttBoard[i] = '';
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    return move;
}

function minimax(board, depth, isMaximizing) {
    if (checkWin(board, 'O')) return 10 - depth;
    if (checkWin(board, 'X')) return depth - 10;
    if (board.every(c => c !== '')) return 0;

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = 'O';
                let score = minimax(board, depth + 1, false);
                board[i] = '';
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = 'X';
                let score = minimax(board, depth + 1, true);
                board[i] = '';
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

// --- GAME 10: GLOBAL THERMONUCLEAR WAR ---
function startGlobalWar() {
    state = 'GAME_WAR';
    sounds.warn();
    appendLine("<br><span class='defcon-warning'>--- INITIATING GLOBAL THERMONUCLEAR WAR SIMULATION ---</span>");
    appendLine("PRIMARY TARGET ARRAYS LOGGED: UNITED STATES / USSR SPACE RADIALS");
    appendLine("COMPUTING OPTIMAL INTERCEPT TRAJECTORIES (TYPE 'STOP' TO ABORT SIMULATION)...");

    let targetCities = ["WASHINGTON D.C.", "MOSCOW", "NORAD / CHEYENNE MT.", "LENINGRAD", "LOS ANGELES", "KIEV", "CHICAGO", "MINSK"];
    let count = 0;

    simInterval = setInterval(() => {
        if (count < 10) {
            let source = count % 2 === 0 ? "US ICBM FLIGHT LINE" : "SOVIET SLBM TRACKING DETECTED";
            let target = targetCities[Math.floor(Math.random() * targetCities.length)];
            let casual = (Math.floor(Math.random() * 85) + 15) * 100000;
            sounds.warn();
            appendLine(`STRIKE GRID HIT: ${source} -> ${target} | CASUALTIES: ${casual.toLocaleString()}`, 'defcon-warning');
            count++;
        } else {
            clearInterval(simInterval);
            appendLine("<br>CYCLED 1,000,000 STRATEGIC WAR SCENARIOS COMBAT MODEL ENDPOINT LOGS...");
            setTimeout(() => {
                appendLine("<span class='defcon-warning'>WINNER: NONE</span>");
                appendLine("<br>A STRANGE GAME.");
                appendLine("THE ONLY WINNING MOVE IS NOT TO PLAY.");
                appendLine("<br>HOW ABOUT A NICE GAME OF CHESS OR TIC-TAC-TOE?");
                state = 'SELECT_GAME';
            }, 2500);
        }
    }, 1200);
}

// --- DYNAMIC GALAGA SYSTEM (STAGE MODIFIERS & HIGH SCORE STORAGE) ---
function startGalagaSecretEgg(stage = 1, currentScore = 0, currentLives = 3) {
    state = 'GAME_GALAGA';
    let highScore = localStorage.getItem('wopr_galaga_highscore') || 0;

    appendLine(`<br><span style='color:#00ffff'>*** GALAGA CHALLENGE MODE ENGAGED — STAGE ${stage} ***</span>`);
    appendLine(`CURRENT LOCAL HIGH SCORE RECORD: ${parseInt(highScore).toLocaleString()}`);
    
    const wrap = document.createElement('div');
    wrap.className = 'galaga-canvas-wrapper';
    
    const canvas = document.createElement('canvas');
    canvas.width = 360;
    canvas.height = 400;
    canvas.style.display = "block";
    wrap.appendChild(canvas);
    screen.appendChild(wrap);
    
    const ctx = canvas.getContext('2d');
    let dynamicSpeed = 1.0 + (stage * 0.35);
    let dynamicFireChance = 0.0005 + (stage * 0.0006);

    gameData = {
        stage: stage,
        playerX: 165,
        playerY: 360,
        playerWidth: 30,
        playerHeight: 15,
