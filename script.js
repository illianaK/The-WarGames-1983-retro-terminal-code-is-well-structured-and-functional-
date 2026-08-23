// --- Audio Engine ---
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playBeep(freq = 800, type = 'square', duration = 0.05) {
  if (audioCtx.state === 'suspended') audioCtx.resume();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + duration);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + duration);
}

// --- Terminal State & Elements ---
let authenticated = false;
let currentGame = null;
const output = document.getElementById('output');
const userInput = document.getElementById('userInput');
const galagaCanvas = document.getElementById('galagaCanvas');
const ctx = galagaCanvas.getContext('2d');

function print(text, delay = 0) {
  if (delay === 0) {
    output.innerText += text + '\n';
    output.scrollTop = output.scrollHeight;
  } else {
    let i = 0;
    const interval = setInterval(() => {
      output.innerText += text[i];
      playBeep(1200, 'sine', 0.01);
      output.scrollTop = output.scrollHeight;
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        output.innerText += '\n';
      }
    }, delay);
  }
}

// Boot sequence
setTimeout(() => print("LOGON:"), 500);

userInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const input = userInput.value.trim();
    print(`> ${input}`);
    userInput.value = '';
    playBeep(600, 'square', 0.08);

    if (!authenticated) {
      if (input.toLowerCase() === 'joshua') {
        authenticated = true;
        print("\nIDENTIFICATION CONFIRMED.\nAUTHENTICATION SUCCESSFUL.\n");
        setTimeout(() => {
          print("GREETINGS PROFESSOR FALKEN.\n", 40);
          setTimeout(() => {
            print("SHALL WE PLAY A GAME?\n\nType 'LIST' to view available games.", 30);
          }, 1500);
        }, 500);
      } else {
        print("IDENTIFICATION NOT RECOGNIZED. ACCESS DENIED.");
      }
    } else if (currentGame) {
      handleGameInput(input);
    } else {
      handleCommand(input);
    }
  }
});

function handleCommand(cmd) {
  const upperCmd = cmd.toUpperCase();
  if (upperCmd === 'LIST' || upperCmd === 'GAMES') {
    print(`
AVAILABLE GAMES:
 1. FALKEN'S MAZE
 2. TIC-TAC-TOE
 3. BLACK JACK
 4. CHESS
 5. GUERRILLA ENGAGEMENT
 6. DESERT WARFARE
 7. THEATERWIDE TACTICAL AIR STRIKE
 8. IMPERATOR
 9. GLOBAL THERMONUCLEAR WAR
10. NUMBER GUESS

Type the game name or number to initiate.
`);
  } else if (upperCmd === 'GALAGA') {
    startGalaga();
  } else if (upperCmd === '10' || upperCmd === 'NUMBER GUESS') {
    startNumberGuess();
  } else if (upperCmd === '9' || upperCmd === 'GLOBAL THERMONUCLEAR WAR') {
    print("\nA STRANGE GAME.\nTHE ONLY WINNING MOVE IS NOT TO PLAY.\n\nHOW ABOUT A NICE GAME OF CHESS?\n");
  } else if (['1','2','3','4','5','6','7','8'].includes(upperCmd)) {
    print(`\n[SYSTEM RESTRICTION] Simulation data for module ${upperCmd} corrupted. Try Option 10 or 'GALAGA'.\n`);
  } else {
    print("UNKNOWN COMMAND. TYPE 'LIST' FOR AVAILABLE PROGRAM SIMULATIONS.");
  }
}

// --- Native Game Module: Number Guess ---
let targetNum = 0;
function startNumberGuess() {
  currentGame = 'NUMBER';
  targetNum = Math.floor(Math.random() * 100) + 1;
  print("\n--- NUMBER GUESSING SIMULATION ---");
  print("I have generated a target integer between 1 and 100.");
  print("Enter your target estimate (or 'QUIT' to exit):");
}

function handleGameInput(input) {
  if (input.toUpperCase() === 'QUIT') {
    currentGame = null;
    print("SIMULATION TERMINATED.\n");
    return;
  }
  if (currentGame === 'NUMBER') {
    const val = parseInt(input, 10);
    if (isNaN(val)) {
      print("INVALID INPUT. ENTER NUMERIC VALUE:");
    } else if (val < targetNum) {
      print("ELEVATION LOW. INCREASE ESTIMATE:");
    } else if (val > targetNum) {
      print("ELEVATION HIGH. DECREASE ESTIMATE:");
    } else {
      print(`TARGET ACQUIRED. IDENTICAL VALUES (${targetNum}). YOU WIN!\n`);
      currentGame = null;
    }
  }
}

// --- Easter Egg Game Engine: Galaga ---
let galagaActive = false;
let player, bullets, enemies, enemyBullets, galagaLoopId;
const keys = {};

function startGalaga() {
  print("\n*** UNLOCKING CLASSIFIED RETRO SIMULATION: GALAGA ***");
  print("Controls: ARROW KEYS to move, SPACEBAR to fire. Press 'Q' to abort.\n");
  galagaCanvas.style.display = 'block';
  galagaActive = true;
  
  player = { x: galagaCanvas.width / 2 - 12, y: galagaCanvas.height - 30, w: 24, h: 20, speed: 4 };
  bullets = [];
  enemies = [];
  enemyBullets = [];

  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 8; c++) {
      enemies.push({
        x: 60 + c * 40,
        y: 40 + r * 30,
        w: 20,
        h: 18,
        alive: true,
        type: r === 0 ? 'boss' : 'bug'
      });
    }
  }

  window.addEventListener('keydown', handleGalagaKeys);
  galagaLoop();
}

function handleGalagaKeys(e) {
  if (!galagaActive) return;
  if (e.code === 'KeyQ') endGalaga();
  keys[e.code] = e.type === 'keydown';
}

window.addEventListener('keyup', (e) => { 
  if (galagaActive) keys[e.code] = false; 
});

function endGalaga() {
  galagaActive = false;
  cancelAnimationFrame(galagaLoopId);
  galagaCanvas.style.display = 'none';
  window.removeEventListener('keydown', handleGalagaKeys);
  print("GALAGA SIMULATION TERMINATED.\n");
}

let lastFire = 0;
function galagaLoop() {
  if (!galagaActive) return;

  ctx.fillStyle = '#000500';
  ctx.fillRect(0, 0, galagaCanvas.width, galagaCanvas.height);

  if (keys['ArrowLeft'] && player.x > 0) player.x -= player.speed;
  if (keys['ArrowRight'] && player.x < galagaCanvas.width - player.w) player.x += player.speed;
  if (keys['Space'] && Date.now() - lastFire > 200) {
    bullets.push({ x: player.x + player.w / 2 - 2, y: player.y, w: 4, h: 10 });
    playBeep(900, 'sawtooth', 0.03);
    lastFire = Date.now();
  }

  ctx.fillStyle = '#00ff66';
  ctx.fillRect(player.x, player.y, player.w, player.h);

  ctx.fillStyle = '#ffff00';
  bullets.forEach((b, i) => {
    b.y -= 7;
    ctx.fillRect(b.x, b.y, b.w, b.h);
    if (b.y < 0) bullets.splice(i, 1);
  });

  let activeEnemies = 0;
  enemies.forEach((e) => {
    if (!e.alive) return;
    activeEnemies++;

    ctx.fillStyle = e.type === 'boss' ? '#ff0055' : '#00ffff';
    ctx.fillRect(e.x, e.y, e.w, e.h);

    bullets.forEach((b, bi) => {
      if (b.x < e.x + e.w && b.x + b.w > e.x && b.y < e.y + e.h && b.y + b.h > e.y) {
        e.alive = false;
        bullets.splice(bi, 1);
        playBeep(300, 'square', 0.1);
      }
    });

    if (Math.random() < 0.001) {
      enemyBullets.push({ x: e.x + e.w / 2, y: e.y + e.h, w: 4, h: 8 });
    }
  });

  ctx.fillStyle = '#ff0000';
  enemyBullets.forEach((eb, ebi) => {
    eb.y += 4;
    ctx.fillRect(eb.x, eb.y, eb.w, eb.h);
    
    if (eb.x < player.x + player.w && eb.x + eb.w > player.x && eb.y < player.y + player.h && eb.y + eb.h > player.y) {
      playBeep(150, 'sawtooth', 0.4);
      endGalaga();
      print("CRITICAL DAMAGE SUSTAINED. GAME OVER.");
    }

    if (eb.y > galagaCanvas.height) enemyBullets.splice(ebi, 1);
  });

  if (activeEnemies === 0) {
    endGalaga();
    print("ALL TARGETS DESTROYED. GALAGA SIMULATION VICTORIOUS.");
    return;
  }

  galagaLoopId = requestAnimationFrame(galagaLoop);
}