document.addEventListener('DOMContentLoaded', () => {
    const squares = document.querySelectorAll('.square');
    const timeLeft = document.querySelector('#time-left');
    const scoreDisplay = document.querySelector('#score');
    const finalScoreDisplay = document.querySelector('#final-score');
    const gameOverDisplay = document.querySelector('#game-over');
    const restartBtn = document.querySelector('#restart-btn');

    let result = 0;
    let hitPosition;
    let currentTime = 60;
    let moleTimer = null;
    let countDownTimer = null;

    function initGame() {
        result = 0;
        currentTime = 60;
        scoreDisplay.textContent = result;
        timeLeft.textContent = currentTime;
        gameOverDisplay.classList.add('hidden');

        clearInterval(moleTimer);
        clearInterval(countDownTimer);

        moveMole();
        countDownTimer = setInterval(countDown, 1000);
    }

    function randomSquare() {
        squares.forEach(square => {
            square.classList.remove('mole');
        });

        let randomSquare = squares[Math.floor(Math.random() * squares.length)];
        randomSquare.classList.add('mole');
        hitPosition = randomSquare.id;
    }

    squares.forEach(square => {
        square.addEventListener('mousedown', () => {
            if (square.id == hitPosition) {
                result++;
                scoreDisplay.textContent = result;
                hitPosition = null;
                square.classList.remove('mole');
            }
        });
    });

    function moveMole() {
        moleTimer = setInterval(randomSquare, 700);
    }

    function countDown() {
        currentTime--;
        timeLeft.textContent = currentTime;

        if (currentTime <= 0) {
            clearInterval(countDownTimer);
            clearInterval(moleTimer);
            endGame();
        }
    }

    function endGame() {
        finalScoreDisplay.textContent = result;
        gameOverDisplay.classList.remove('hidden');
        squares.forEach(square => square.classList.remove('mole'));
    }

    restartBtn.addEventListener('click', initGame);

    initGame();
});