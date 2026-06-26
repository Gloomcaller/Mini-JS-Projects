document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('game-board');
    const scoreDisplay = document.getElementById('score');
    const startBtn = document.getElementById('start-btn');
    const resetBtn = document.getElementById('reset-btn');
    const gameMessage = document.getElementById('game-message');
    const messageText = document.getElementById('message-text');

    // Base dimensions
    const BASE_WIDTH = 560;
    const BASE_HEIGHT = 300;
    const BASE_PADDLE_WIDTH = 100;
    const BASE_PADDLE_HEIGHT = 15;
    const BASE_BALL_SIZE = 20;
    const BASE_BLOCK_WIDTH = 100;
    const BASE_BLOCK_HEIGHT = 20;

    // Scale factor
    let scale = 1;
    let worldToPixel = (v) => v * scale;

    // Game state
    let paddleX = 230;
    let ballX = 270;
    let ballY = 40;
    let xDir = 2;
    let yDir = 2;
    let timerId = null;
    let score = 0;
    let gameRunning = false;
    let blocks = [];

    function createBlocks() {
        blocks = [];
        const colors = ['#2196F3', '#673AB7', '#009688', '#FFC107', '#E91E63'];
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 5; col++) {
                blocks.push({
                    x: 10 + col * 110,
                    y: BASE_HEIGHT - 30 - row * 30,
                    width: BASE_BLOCK_WIDTH,
                    height: BASE_BLOCK_HEIGHT,
                    color: colors[row],
                    element: null
                });
            }
        }
    }

    function render() {
        board.innerHTML = '';

        // Blocks
        blocks.forEach(block => {
            const el = document.createElement('div');
            el.className = 'block';
            el.style.left = worldToPixel(block.x) + 'px';
            el.style.bottom = worldToPixel(block.y) + 'px';
            el.style.width = worldToPixel(block.width) + 'px';
            el.style.height = worldToPixel(block.height) + 'px';
            el.style.backgroundColor = block.color;
            board.appendChild(el);
            block.element = el;
        });

        // Paddle
        const paddle = document.createElement('div');
        paddle.className = 'user';
        paddle.id = 'paddle';
        paddle.style.left = worldToPixel(paddleX) + 'px';
        paddle.style.bottom = worldToPixel(10) + 'px';
        paddle.style.width = worldToPixel(BASE_PADDLE_WIDTH) + 'px';
        paddle.style.height = worldToPixel(BASE_PADDLE_HEIGHT) + 'px';
        board.appendChild(paddle);

        // Ball
        const ball = document.createElement('div');
        ball.className = 'ball';
        ball.id = 'ball';
        ball.style.left = worldToPixel(ballX) + 'px';
        ball.style.bottom = worldToPixel(ballY) + 'px';
        ball.style.width = worldToPixel(BASE_BALL_SIZE) + 'px';
        ball.style.height = worldToPixel(BASE_BALL_SIZE) + 'px';
        board.appendChild(ball);
    }

    function updatePaddle() {
        const paddle = document.getElementById('paddle');
        if (paddle) {
            paddle.style.left = worldToPixel(paddleX) + 'px';
        }
    }

    function updateBall() {
        const ball = document.getElementById('ball');
        if (ball) {
            ball.style.left = worldToPixel(ballX) + 'px';
            ball.style.bottom = worldToPixel(ballY) + 'px';
        }
    }

    function movePaddle(dir) {
        if (!gameRunning) return;
        const step = 25;
        if (dir === 'left') {
            paddleX = Math.max(0, paddleX - step);
        } else {
            paddleX = Math.min(BASE_WIDTH - BASE_PADDLE_WIDTH, paddleX + step);
        }
        updatePaddle();
    }

    function startGame() {
        if (gameRunning) return;
        gameRunning = true;
        score = 0;
        scoreDisplay.textContent = '0';
        paddleX = 230;
        ballX = 270;
        ballY = 40;
        xDir = 2;
        yDir = 2;

        gameMessage.classList.add('hidden');
        createBlocks();
        render();

        if (timerId) clearInterval(timerId);
        timerId = setInterval(moveBall, 20);
    }

    function moveBall() {
        if (!gameRunning) return;
        ballX += xDir;
        ballY += yDir;
        updateBall();
        checkCollisions();
    }

    function checkCollisions() {
        const ballSize = BASE_BALL_SIZE;
        const paddleWidth = BASE_PADDLE_WIDTH;
        const paddleHeight = BASE_PADDLE_HEIGHT;
        const paddleY = 10; // world bottom

        // Walls left/right
        if (ballX <= 0) {
            ballX = 0;
            xDir = Math.abs(xDir);
        } else if (ballX >= BASE_WIDTH - ballSize) {
            ballX = BASE_WIDTH - ballSize;
            xDir = -Math.abs(xDir);
        }

        // Ceiling
        if (ballY >= BASE_HEIGHT - ballSize) {
            ballY = BASE_HEIGHT - ballSize;
            yDir = -Math.abs(yDir);
        }

        // Floor == game over
        if (ballY <= 0) {
            endGame('Game Over!');
            return;
        }

        // Paddle
        if (
            ballY <= paddleY + paddleHeight &&
            ballY + ballSize >= paddleY &&
            ballX + ballSize > paddleX &&
            ballX < paddleX + paddleWidth
        ) {
            // Bounce up, angle based on hit position
            const hit = (ballX + ballSize / 2 - paddleX) / paddleWidth;
            xDir = hit < 0.3 ? -3 : hit > 0.7 ? 3 : (xDir > 0 ? 2 : -2);
            yDir = Math.abs(yDir);
            ballY = paddleY + paddleHeight;
        }

        // Blocks
        for (let i = blocks.length - 1; i >= 0; i--) {
            const b = blocks[i];
            if (
                ballX + ballSize > b.x &&
                ballX < b.x + b.width &&
                ballY + ballSize > b.y &&
                ballY < b.y + b.height
            ) {
                yDir = -yDir;
                if (b.element) b.element.remove();
                blocks.splice(i, 1);
                score++;
                scoreDisplay.textContent = score;

                if (blocks.length === 0) {
                    endGame('You Win!');
                }
                return;
            }
        }
    }

    function endGame(msg) {
        gameRunning = false;
        clearInterval(timerId);
        messageText.textContent = msg + ' — Score: ' + score;
        gameMessage.classList.remove('hidden');
    }

    function resetBoard() {
        gameRunning = false;
        clearInterval(timerId);
        score = 0;
        scoreDisplay.textContent = '0';
        paddleX = 230;
        ballX = 270;
        ballY = 40;
        gameMessage.classList.add('hidden');
        createBlocks();
        render();
    }

    // Scaling
    function resizeBoard() {
        const container = document.querySelector('.game-area');
        if (!container) return;

        // Available width = container width minus side buttons
        const sideBtns = document.querySelectorAll('.d-pad-btn');
        let btnWidth = 0;
        sideBtns.forEach(b => {
            if (b.offsetParent !== null) btnWidth += b.offsetWidth + 6;
        });
        const maxW = container.clientWidth - btnWidth - 12;
        const maxH = window.innerHeight * 0.55;

        // Maintain aspect ratio
        const aspect = BASE_WIDTH / BASE_HEIGHT;
        let boardW = Math.min(maxW, BASE_WIDTH);
        let boardH = boardW / aspect;
        if (boardH > maxH) {
            boardH = maxH;
            boardW = boardH * aspect;
        }

        board.style.width = boardW + 'px';
        board.style.height = boardH + 'px';
        scale = boardW / BASE_WIDTH;

        // Re-render if game is visible
        if (blocks.length > 0) {
            render();
        }
    }

    window.addEventListener('resize', resizeBoard);

    // Keyboard
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') movePaddle('left');
        if (e.key === 'ArrowRight') movePaddle('right');
    });

    // Desktop side buttons
    document.getElementById('btn-left').addEventListener('click', () => movePaddle('left'));
    document.getElementById('btn-right').addEventListener('click', () => movePaddle('right'));

    // Mobile buttons
    document.getElementById('btn-left-mob').addEventListener('click', () => movePaddle('left'));
    document.getElementById('btn-right-mob').addEventListener('click', () => movePaddle('right'));

    startBtn.addEventListener('click', startGame);
    resetBtn.addEventListener('click', resetBoard);

    // Initial setup
    createBlocks();
    resizeBoard();
    render();
});