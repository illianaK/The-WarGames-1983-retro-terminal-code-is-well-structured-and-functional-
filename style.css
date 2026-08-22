* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

body {
    background-color: #000000;
    color: #33ff33;
    font-family: 'Courier New', Courier, monospace;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    /* Uses dynamic viewport units to respect virtual mobile keyboard bounds */
    min-height: 100dvh; 
    padding: 10px;
    overflow: hidden;
}

/* Restores vintage layout proportions on desktop but adapts cleanly on small devices */
.terminal-container {
    position: relative;
    width: 100%;
    max-width: 800px;
    /* Acts as the baseline desktop profile but automatically scales down */
    height: 600px; 
    max-height: 85dvh; 
    background-color: #000000;
    border: 4px solid #005500;
    border-radius: 4px;
    box-shadow: 0 0 30px rgba(0, 255, 0, 0.2);
    display: flex;
    flex-direction: column;
    padding: 15px;
    overflow: hidden;
}

/* Forces text display logs to take up remaining height space dynamically */
#screen {
    flex: 1;
    display: flex;          /* FIXED: Establishes rigid flow parameters */
    flex-direction: column; /* FIXED: Keeps print messages uniformly aligned */
    overflow-y: auto;
    margin-bottom: 10px;
}

/* Retro phosphor configurations remain solid */
.line {
    flex-shrink: 0;         /* FIXED: Denies the layout wrapper permission to crush vertical height */
    margin-bottom: 8px;
    line-height: 1.4;
    font-size: 15px;
    font-weight: bold;
    letter-spacing: 1px;
    white-space: pre-wrap;
    text-shadow: 0 0 6px rgba(51, 255, 51, 0.8);
}

.user-msg {
    color: #88ff88;
    text-shadow: 0 0 6px rgba(136, 255, 136, 0.8);
}

.defcon-warning {
    color: #ff3333;
    text-shadow: 0 0 8px rgba(255, 51, 51, 0.9);
}

/* Input prompt is pulled up when screen area scales down */
.input-container {
    display: flex;
    align-items: center;
    border-top: 2px solid #004400;
    padding-top: 10px;
    flex-shrink: 0; /* Prevents command prompt line compression */
}

.prompt {
    font-weight: bold;
    margin-right: 10px;
    font-size: 16px;
    text-shadow: 0 0 6px rgba(51, 255, 51, 0.8);
}

#userInput {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    color: #33ff33;
    font-family: inherit;
    font-size: 16px;
    font-weight: bold;
    text-shadow: 0 0 6px rgba(51, 255, 51, 0.8);
    caret-color: #33ff33;
}

/* Interactive board bounds update */
.board-container {
    margin: 8px 0;
    background: #000000;
    padding: 6px;
    border: 2px solid #005500;
    display: inline-block;
    flex-shrink: 0;
}

.tic-tac-toe {
    display: grid;
    grid-template-columns: repeat(3, 45px);
    grid-gap: 5px;
}

.cell {
    width: 45px;
    height: 45px;
    border: 2px solid #005500;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    font-weight: bold;
    color: #33ff33;
    cursor: pointer;
}

/* Responsive constraints on arcade wrapper */
.galaga-canvas-wrapper {
    margin: 10px auto;
    border: 3px double #00ff00;
    background: #000000;
    max-width: 100%;
    max-height: 200px;
    flex-shrink: 0;
}

.galaga-canvas-wrapper canvas {
    display: block;
    max-width: 100%;
    height: auto;
    max-height: 100%;
}

/* Screen overlay filters */
.scanlines {
    pointer-events: none;
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.35) 50%);
    background-size: 100% 4px;
    z-index: 10;
}

.crt-glow {
    pointer-events: none;
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: radial-gradient(circle at center, transparent 50%, rgba(0, 10, 0, 0.4) 100%);
    z-index: 11;
}

#screen::-webkit-scrollbar { width: 6px; }
#screen::-webkit-scrollbar-track { background: #000; }
#screen::-webkit-scrollbar-thumb { background: #004400; }

@media (max-width: 600px) {
    .terminal-container {
        height: 92dvh; /* Maximizes remaining visible bounds inside small screen wrappers */
    }
    .line {
        font-size: 14px;
    }
}
