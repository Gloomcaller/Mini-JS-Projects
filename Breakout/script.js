document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('game-board');
    const scoreDisplay = document.getElementById('score');
    const startBtn = document.getElementById('start-btn');
    const resetBtn = document.getElementById('reset-btn');
    const gameMessage = document.getElementById('game-message');
    const messageText = document.getElementById('message-text');
    const playAgainBtn = document.getElementById('play-again-btn');

    const BLOCK_WIDTH = 100;
    const BLOCK_HEIGHT = 20;
    const BALL_DIAMETER = 20;
    const BOARD_WIDTH = 560;
    const BOARD_HEIGHT = 300;
    const USER_START = [230, 10];
    const BALL_START = [270, 40];

    let xDirection = -2;
    let yDirection = 2;
    let currentPosition = [...USER_START];
    let ballCurrentPosition = [...BALL_START];
    let timerId;
    let score = 0;
    let gameRunning = false;
    let blocks = [];

    class Block {
        constructor(xAxis, yAxis, color) {
            this.bottomLeft = [xAxis, yAxis];
            this.bottomRight = [xAxis + BLOCK_WIDTH, yAxis];
            this.topRight = [xAxis + BLOCK_WIDTH, yAxis + BLOCK_HEIGHT];
            this.topLeft = [xAxis, yAxis + BLOCK_HEIGHT];
            this.color = color;
            this.hits = 0;
        }
    }

    function initGame() {
        grid.innerHTML = '';

        score = 0;
        scoreDisplay.textContent = score;
        currentPosition = [...USER_START];
        ballCurrentPosition = [...BALL_START];
        xDirection = -2;
        yDirection = 2;

        blocks = [];
        const colors = ['#2196F3', '#673AB7', '#009688', '#FFC107', '#E91E63'];

        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 5; col++) {
                const x = 10 + col * (BLOCK_WIDTH + 10);
                const y = 270 - row * (BLOCK_HEIGHT + 10);
                const color = colors[row % colors.length];
                blocks.push(new Block(x, y, color));
            }
        }

        drawBlocks();
        drawUser();
        drawBall();
    }

    function drawBlocks() {
        blocks.forEach(block => {
            const blockElement = document.createElement('div');
            blockElement.classList.add('block');
            blockElement.style.left = block.bottomLeft[0] + 'px';
            blockElement.style.bottom = block.bottomLeft[1] + 'px';
            blockElement.style.backgroundColor = block.color;
            grid.appendChild(blockElement);
        });
    }

    function drawUser() {
        const user = document.createElement('div');
        user.classList.add('user');
        user.style.left = currentPosition[0] + 'px';
        user.style.bottom = currentPosition[1] + 'px';
        grid.appendChild(user);
    }

    function drawBall() {
        const ball = document.createElement('div');
        ball.classList.add('ball');
        ball.style.left = ballCurrentPosition[0] + 'px';
        ball.style.bottom = ballCurrentPosition[1] + 'px';
        grid.appendChild(ball);
    }

    function moveUser(e) {
        if (!gameRunning) return;

        switch (e.key) {
            case 'ArrowLeft':
                if (currentPosition[0] > 0) {
                    currentPosition[0] -= 20;
                }
                break;
            case 'ArrowRight':
                if (currentPosition[0] < (BOARD_WIDTH - BLOCK_WIDTH)) {
                    currentPosition[0] += 20;
                }
                break;
        }

        grid.querySelector('.user').style.left = currentPosition[0] + 'px';
    }

    function startGame() {
        if (gameRunning) return;

        gameRunning = true;
        initGame();
        gameMessage.classList.add('hidden');

        if (timerId) clearInterval(timerId);

        timerId = setInterval(moveBall, 20);
        document.addEventListener('keydown', moveUser);
    }

    function moveBall() {
        if (!gameRunning) return;

        ballCurrentPosition[0] += xDirection;
        ballCurrentPosition[1] += yDirection;

        const ball = grid.querySelector('.ball');
        if (ball) {
            ball.style.left = ballCurrentPosition[0] + 'px';
            ball.style.bottom = ballCurrentPosition[1] + 'px';
        }

        checkForCollisions();
    }

    function checkForCollisions() {
        for (let i = 0; i < blocks.length; i++) {
            const block = blocks[i];

            if (
                ballCurrentPosition[0] > block.bottomLeft[0] &&
                ballCurrentPosition[0] < block.bottomRight[0] &&
                (ballCurrentPosition[1] + BALL_DIAMETER) > block.bottomLeft[1] &&
                ballCurrentPosition[1] < block.topLeft[1]
            ) {
                block.hits++;
                if (block.hits >= 2) {
                    const allBlocks = Array.from(document.querySelectorAll('.block'));
                    allBlocks[i].remove();
                    blocks.splice(i, 1);
                }

                changeDirection();
                score++;
                scoreDisplay.textContent = score;

                if (blocks.length === 0) {
                    endGame('You Win!');
                }
                return;
            }
        }

        if (ballCurrentPosition[0] >= (BOARD_WIDTH - BALL_DIAMETER) || ballCurrentPosition[0] <= 0) {
            xDirection = -xDirection;
        }

        if (ballCurrentPosition[1] >= (BOARD_HEIGHT - BALL_DIAMETER)) {
            yDirection = -yDirection;
        }

        if (
            ballCurrentPosition[0] > currentPosition[0] &&
            ballCurrentPosition[0] < currentPosition[0] + BLOCK_WIDTH &&
            ballCurrentPosition[1] > currentPosition[1] &&
            ballCurrentPosition[1] < currentPosition[1] + BLOCK_HEIGHT
        ) {
            const hitPosition = (ballCurrentPosition[0] - currentPosition[0]) / BLOCK_WIDTH;
            xDirection = hitPosition < 0.3 ? -3 : hitPosition > 0.7 ? 3 : xDirection;
            yDirection = -yDirection;
        }

        if (ballCurrentPosition[1] <= 0) {
            endGame('Game Over!');
        }
    }

    function changeDirection() {
        if (Math.abs(xDirection) === 2) {
            xDirection = xDirection > 0 ? 3 : -3;
        } else {
            xDirection = xDirection > 0 ? 2 : -2;
        }

        yDirection = -yDirection;
    }

    function endGame(message) {
        gameRunning = false;
        clearInterval(timerId);
        document.removeEventListener('keydown', moveUser);

        messageText.textContent = message + ` Final Score: ${score}`;
        gameMessage.classList.remove('hidden');
    }

    startBtn.addEventListener('click', startGame);
    resetBtn.addEventListener('click', initGame);
    playAgainBtn.addEventListener('click', startGame);

    initGame();
});