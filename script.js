// Append this logic directly inside startGalagaSecretEgg() right after window.galagaData initialization:

const gData = window.galagaData;
gData.bullets = [];
gData.alienBullets = [];
gData.aliens = [];
gData.keys = {};

// Generate an operational matrix grid of hostile alien ships
for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 6; col++) {
        gData.aliens.push({
            x: 40 + col * 50,
            y: 40 + row * 35,
            width: 24,
            height: 18,
            alive: true,
            points: (3 - row) * 100,
            direction: 1
        });
    }
}

// Bind arcade key intercept listeners
const trackKeys = (e) => {
    if (['ArrowLeft', 'ArrowRight', 'Space', ' '].includes(e.key)) e.preventDefault();
    gData.keys[e.key] = e.type === 'keydown';
    if (e.type === 'keydown' && (e.key === ' ' || e.key === 'Space')) firePlayerLaser();
};
window.addEventListener('keydown', trackKeys);
window.addEventListener('keyup', trackKeys);

function firePlayerLaser() {
    if (state !== 'GAME_GALAGA' || gData.bullets.length >= 3) return;
    gData.bullets.push({ x: gData.playerX + gData.playerWidth / 2 - 2, y: gData.playerY, speed: 6 });
    if (typeof sounds !== 'undefined' && sounds.click) sounds.click();
}

// Core Execution Frame Matrix Loop
function runGalagaFrame() {
    if (state !== 'GAME_GALAGA') {
        window.removeEventListener('keydown', trackKeys);
        window.removeEventListener('keyup', trackKeys);
        return;
    }

    // Clear buffer resolution bounds without resetting the sizing configurations
    ctx.fillStyle = '#020208';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw ambient star fields
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    for (let i = 0; i < 15; i++) {
        let sx = (Math.sin(i + Date.now() * 0.001) * 0.5 + 0.5) * canvas.width;
        let sy = ((i * 30 + Date.now() * 0.05) % canvas.height);
        ctx.fillRect(sx, sy, 2, 2);
    }

    // Interpret user movement controls
    if (gData.keys['ArrowLeft'] && gData.playerX > 0) gData.playerX -= 4;
    if (gData.keys['ArrowRight'] && gData.playerX < canvas.width - gData.playerWidth) gData.playerX += 4;

    // Render User Fighter Ship
    ctx.fillStyle = '#00ffcc';
    ctx.beginPath();
    ctx.moveTo(gData.playerX + gData.playerWidth / 2, gData.playerY);
    ctx.lineTo(gData.playerX + gData.playerWidth, gData.playerY + gData.playerHeight);
    ctx.lineTo(gData.playerX, gData.playerY + gData.playerHeight);
    ctx.closePath();
    ctx.fill();

    // Render + Track Player Lasers
    ctx.fillStyle = '#ffff00';
    for (let i = gData.bullets.length - 1; i >= 0; i--) {
        let b = gData.bullets[i];
        b.y -= b.speed;
        ctx.fillRect(b.x, b.y, 3, 9);
        if (b.y < 0) gData.bullets.splice(i, 1);
    }

    // Update and Draw Alien Squadrons
    let activeAliens = gData.aliens.filter(a => a.alive);
    if (activeAliens.length === 0) {
        clearInterval(gData.loopId);
        appendLine(`<span style='color:#00ff00'>STAGE ${gData.stage} CLEAR. INCREMENTING VECTOR MATRIX.</span>`);
        setTimeout(() => startGalagaSecretEgg(gData.stage + 1, gData.score, gData.lives), 1500);
        return;
    }

    activeAliens.forEach(a => {
        a.x += gData.speed * a.direction;
        if (a.x <= 10 || a.x >= canvas.width - a.width - 10) {
            gData.aliens.forEach(al => { al.direction *= -1; al.y += 4; });
        }

        // Hostile fire intercept processing
        if (Math.random() < gData.fireChance) {
            gData.alienBullets.push({ x: a.x + a.width / 2, y: a.y + a.height, speed: 3 + gData.stage });
        }

        // Draw alien signature frame
        ctx.fillStyle = a.points === 300 ? '#ff0055' : a.points === 200 ? '#ffaa00' : '#33ccff';
        ctx.fillRect(a.x, a.y, a.width, a.height);

        // Core Collision Metrics (Player Bullet -> Alien)
        gData.bullets.forEach((b, bIdx) => {
            if (b.x > a.x && b.x < a.x + a.width && b.y > a.y && b.y < a.y + a.height) {
                a.alive = false;
                gData.bullets.splice(bIdx, 1);
                gData.score += a.points;
            }
        });
    });

    // Render + Track Enemy Projectiles
    ctx.fillStyle = '#ff3300';
    for (let i = gData.alienBullets.length - 1; i >= 0; i--) {
        let ab = gData.alienBullets[i];
        ab.y += ab.speed;
        ctx.fillRect(ab.x, ab.y, 4, 10);

        // Collision Check (Enemy Bullet -> Player Ship)
        if (ab.x > gData.playerX && ab.x < gData.playerX + gData.playerWidth &&
            ab.y > gData.playerY && ab.y < gData.playerY + gData.playerHeight) {
            gData.alienBullets.splice(i, 1);
            gData.lives--;
            if (typeof sounds !== 'undefined' && sounds.warn) sounds.warn();
            appendLine(`CRITICAL DAMAGE LOGGED. FIGHTERS REMAINING: ${gData.lives}`);
            
            if (gData.lives <= 0) {
                clearInterval(gData.loopId);
                let record = localStorage.getItem('wopr_galaga_highscore') || 0;
                if (gData.score > record) {
                    localStorage.setItem('wopr_galaga_highscore', gData.score);
                    appendLine(`NEW MAINFRAME RECORD SET: ${gData.score.toLocaleString()}`);
                }
                appendLine("<span style='color:#ff0000'>GALAGA INTERFACE CRASH. GAME OVER.</span>");
                endGame();
                return;
            }
        } else if (ab.y > canvas.height) {
            gData.alienBullets.splice(i, 1);
        }
    }

    // Top Header Vector Score Metrics UI
    ctx.fillStyle = '#ffffff';
    ctx.font = '10px "Courier New", monospace';
    ctx.fillText(`SCORE: ${gData.score.toLocaleString()}`, 10, 15);
    ctx.fillText(`LIVES: ${'▲'.repeat(gData.lives)}`, canvas.width - 80, 15);
}

gData.loopId = setInterval(runGalagaFrame, 1000 / 60);
