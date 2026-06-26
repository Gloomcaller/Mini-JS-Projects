document.addEventListener('DOMContentLoaded', () => {
    const squares = document.querySelectorAll('.square');
    const timeLeft = document.querySelector('#time-left');
    const scoreDisplay = document.querySelector('#score');
    const startStopBtn = document.querySelector('#start-stop-btn');

    let result = 0;
    let hitPosition;
    let currentTime = 60;
    let moleTimer = null;
    let countDownTimer = null;
    let gameRunning = false;

    function startGame() {
        result = 0;
        currentTime = 60;
        scoreDisplay.textContent = result;
        timeLeft.textContent = currentTime;
        gameRunning = true;

        startStopBtn.textContent = 'Stop';
        startStopBtn.classList.add('stop');

        moveMole();
        countDownTimer = setInterval(countDown, 1000);
    }

    function stopGame() {
        clearInterval(moleTimer);
        clearInterval(countDownTimer);
        moleTimer = null;
        countDownTimer = null;
        gameRunning = false;

        squares.forEach(square => square.classList.remove('mole'));
        hitPosition = null;

        result = 0;
        currentTime = 60;
        scoreDisplay.textContent = '0';
        timeLeft.textContent = '60';

        startStopBtn.textContent = 'Start';
        startStopBtn.classList.remove('stop');
    }

    function randomSquare() {
        squares.forEach(square => square.classList.remove('mole'));
        let randomSquare = squares[Math.floor(Math.random() * squares.length)];
        randomSquare.classList.add('mole');
        hitPosition = randomSquare.id;
    }

    squares.forEach(square => {
        square.addEventListener('mousedown', () => {
            if (!gameRunning) return;
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
            gameRunning = false;
            startStopBtn.textContent = 'Start';
            startStopBtn.classList.remove('stop');
            squares.forEach(square => square.classList.remove('mole'));
        }
    }

    startStopBtn.addEventListener('click', () => {
        if (gameRunning) {
            stopGame();
        } else {
            startGame();
        }
    });
});