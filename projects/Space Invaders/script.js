document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const gridEl = document.getElementById('grid');
    const scoreEl = document.getElementById('score');
    const gameMsg = document.getElementById('game-message');
    const msgText = document.getElementById('message-text');

    // Constants
    const WIDTH = 15;
    const TOTAL = WIDTH * WIDTH;
    const BASE = 600;
    const FLOOR_ROW = 7;

    // Game state
    let squares = [];
    let shooterIdx = 202;
    let invaders = [];
    let score = 0;
    let gameActive = false;
    let invaderDir = 1;
    let moveTimer = null, autoFireTimer = null, enemyFireTimer = null;
    let lasers = [];

    // Set or clear a cell's image and class
    function setCell(i, img, cls) {
        squares[i].style.backgroundImage = img ? `url('media/${img}.png')` : '';
        squares[i].classList.remove('invader', 'shooter', 'laser', 'boom');
        if (cls) squares[i].classList.add(cls);
    }

    // Explosion effect, auto-clears
    function boom(i) {
        setCell(i, 'boom', 'boom');
        setTimeout(() => setCell(i, null), 300);
    }

    // Create empty board
    function createBoard() {
        gridEl.innerHTML = '';
        for (let i = 0; i < TOTAL; i++) {
            const div = document.createElement('div');
            div.dataset.index = i;
            gridEl.appendChild(div);
        }
        squares = Array.from(gridEl.children);
    }

    // Clear and redraw everything
    function redraw() {
        squares.forEach((_, i) => setCell(i, null));
        invaders.forEach(i => setCell(i, 'invader', 'invader'));
        setCell(shooterIdx, 'shooter', 'shooter');
    }

    // Initialize / reset game
    function initGame() {
        clearIntervals();
        shooterIdx = 202;
        score = 0;
        gameActive = false;
        invaderDir = 1;
        lasers = [];

        // 3 rows of 10 invaders
        invaders = [];
        for (let r = 0; r < 3; r++) {
            for (let c = 0; c < 10; c++) {
                invaders.push(r * WIDTH + c);
            }
        }

        scoreEl.textContent = '0';
        gameMsg.classList.add('hidden');
        redraw();
        resizeGrid();
    }

    // Start the game
    function startGame() {
        clearIntervals();
        initGame();
        gameActive = true;
        moveTimer = setInterval(moveInvaders, 850);
        autoFireTimer = setInterval(playerFire, 500);
        enemyFireTimer = setInterval(enemyFire, 1200);
    }

    // Stop all timers and lasers
    function clearIntervals() {
        [moveTimer, autoFireTimer, enemyFireTimer].forEach(t => clearInterval(t));
        moveTimer = autoFireTimer = enemyFireTimer = null;
        lasers.forEach(l => { clearInterval(l.timer); setCell(l.idx, null); });
        lasers = [];
    }

    // End the game with a message
    function endGame(msg) {
        gameActive = false;
        clearIntervals();
        msgText.textContent = `${msg} — Score: ${score}`;
        gameMsg.classList.remove('hidden');
    }

    // Move the shooter left or right
    function moveShooter(dir) {
        if (!gameActive) return;
        setCell(shooterIdx, null);
        if (dir === 'left' && shooterIdx % WIDTH !== 0) shooterIdx--;
        else if (dir === 'right' && shooterIdx % WIDTH < WIDTH - 1) shooterIdx++;
        setCell(shooterIdx, 'shooter', 'shooter');
    }

    // Move all invaders
    function moveInvaders() {
        if (!gameActive || invaders.length === 0) return;

        const cols = invaders.map(i => i % WIDTH);
        const leftCol = Math.min(...cols);
        const rightCol = Math.max(...cols);
        const bottomRow = Math.max(...invaders.map(i => Math.floor(i / WIDTH)));
        const hitWall = (rightCol === WIDTH - 1 && invaderDir === 1) || (leftCol === 0 && invaderDir === -1);

        invaders.forEach(i => setCell(i, null));

        if (hitWall) {
            const drop = bottomRow >= FLOOR_ROW ? 0 : WIDTH;
            const shift = drop ? (rightCol === WIDTH - 1 ? -1 : 1) : invaderDir * -1;
            for (let i = 0; i < invaders.length; i++) invaders[i] += drop + shift;
            invaderDir *= -1;
        } else {
            for (let i = 0; i < invaders.length; i++) invaders[i] += invaderDir;
        }

        invaders.forEach(i => setCell(i, 'invader', 'invader'));

        const shooterRow = Math.floor(shooterIdx / WIDTH);
        if (invaders.some(i => Math.floor(i / WIDTH) >= shooterRow)) return endGame('GAME OVER');
        if (invaders.length === 0) endGame('YOU WIN');
    }

    // Create a laser beam
    function makeLaser(fromIdx, step) {
        let idx = fromIdx;
        if (idx < 0 || idx >= TOTAL) return;
        setCell(idx, 'laser', 'laser');
        const timer = setInterval(() => {
            setCell(idx, null);
            idx += step;
            if (idx < 0 || idx >= TOTAL) {
                clearInterval(timer);
                lasers = lasers.filter(l => l.timer !== timer);
                return;
            }

            // Player laser hits invader
            if (step === -WIDTH && squares[idx].classList.contains('invader')) {
                boom(idx);
                const pos = invaders.indexOf(idx);
                if (pos !== -1) {
                    invaders.splice(pos, 1);
                    score++;
                    scoreEl.textContent = score;
                }
                clearInterval(timer);
                lasers = lasers.filter(l => l.timer !== timer);
                if (invaders.length === 0) endGame('YOU WIN');
                return;
            }

            // Enemy laser hits shooter
            if (step === WIDTH && idx === shooterIdx && gameActive) {
                boom(idx);
                endGame('GAME OVER');
                clearInterval(timer);
                lasers = lasers.filter(l => l.timer !== timer);
                return;
            }

            setCell(idx, 'laser', 'laser');
        }, 80);
        lasers.push({ idx, step, timer });
    }

    // Player auto-fire
    function playerFire() {
        if (!gameActive || lasers.some(l => l.step === -WIDTH)) return;
        makeLaser(shooterIdx - WIDTH, -WIDTH);
    }

    // Random enemy fire
    function enemyFire() {
        if (!gameActive || invaders.length === 0) return;
        makeLaser(invaders[Math.floor(Math.random() * invaders.length)] + WIDTH, WIDTH);
    }

    // Keyboard controls
    document.addEventListener('keydown', e => {
        if (e.key === 'ArrowLeft') moveShooter('left');
        if (e.key === 'ArrowRight') moveShooter('right');
    });

    // Button controls
    document.getElementById('btn-left').addEventListener('click', () => moveShooter('left'));
    document.getElementById('btn-right').addEventListener('click', () => moveShooter('right'));
    document.getElementById('btn-left-mob').addEventListener('click', () => moveShooter('left'));
    document.getElementById('btn-right-mob').addEventListener('click', () => moveShooter('right'));
    document.getElementById('start-btn').addEventListener('click', startGame);
    document.getElementById('reset-btn').addEventListener('click', () => { clearIntervals(); initGame(); });

    // Responsive grid scaling
    function resizeGrid() {
        const container = document.querySelector('.game-area');
        if (!container) return;
        const btns = document.querySelectorAll('.side-btn');
        let btnW = 0;
        btns.forEach(b => { if (b.offsetParent !== null) btnW += b.offsetWidth + 10; });
        const size = Math.min(container.clientWidth - btnW - 20, window.innerHeight * 0.65, BASE);
        gridEl.style.width = size + 'px';
        gridEl.style.height = size + 'px';
    }
    window.addEventListener('resize', resizeGrid);

    // Go
    createBoard();
    initGame();
});