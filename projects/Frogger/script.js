const timeLeftDisplay = document.querySelector('#time-left');
const resultDisplay = document.querySelector('#result');
const squares = document.querySelectorAll('.grid div');
const logsLeft = document.querySelectorAll('.log-left');
const logsRight = document.querySelectorAll('.log-right');
const carsLeft = document.querySelectorAll('.car-left');
const carsRight = document.querySelectorAll('.car-right');
const trucksLeft = document.querySelectorAll('.truck-left');
const trucksRight = document.querySelectorAll('.truck-right');
const frogImg = document.getElementById('frog-img');


let currentIndex = 103;
const width = 9;
let timeTimer;
let logTimer;
let carTimer;
let truckTimer;
let outcomeTimerId;
let currentTime = 20;

// Frog movement
function moveFrog(e) {
    switch (e.key) {
        case 'ArrowLeft':
            if (currentIndex % width !== 0) currentIndex -= 1;
            break;
        case 'ArrowRight':
            if (currentIndex % width < width - 1) currentIndex += 1;
            break;
        case 'ArrowUp':
            if (currentIndex - width >= 0) currentIndex -= width;
            break;
        case 'ArrowDown':
            if (currentIndex + width < squares.length) currentIndex += width;
            break;
    }
    squares[currentIndex].appendChild(frogImg);
}

// D‑Pad buttons
const btnUp = document.getElementById('btn-up');
const btnDown = document.getElementById('btn-down');
const btnLeft = document.getElementById('btn-left');
const btnRight = document.getElementById('btn-right');

if (btnUp) btnUp.addEventListener('click', () => moveFrog({ key: 'ArrowUp' }));
if (btnDown) btnDown.addEventListener('click', () => moveFrog({ key: 'ArrowDown' }));
if (btnLeft) btnLeft.addEventListener('click', () => moveFrog({ key: 'ArrowLeft' }));
if (btnRight) btnRight.addEventListener('click', () => moveFrog({ key: 'ArrowRight' }));

// Movement helpers
function cycleClass(element, classes) {
    const currentClass = classes.find(c => element.classList.contains(c));
    const currentIdx = classes.indexOf(currentClass);
    const nextIdx = (currentIdx + 1) % classes.length;
    element.classList.remove(currentClass);
    element.classList.add(classes[nextIdx]);
}

function moveLogs() {
    logsLeft.forEach(log => cycleClass(log, ['l1', 'l2', 'l3', 'l4', 'l5']));
    logsRight.forEach(log => cycleClass(log, ['l5', 'l4', 'l3', 'l2', 'l1']));
}

function moveCars() {
    carsLeft.forEach(car => cycleClass(car, ['c1', 'c2', 'c3', 'c4', 'c5']));
    carsRight.forEach(car => cycleClass(car, ['c5', 'c4', 'c3', 'c2', 'c1']));
}

function moveTrucks() {
    trucksLeft.forEach(truck => cycleClass(truck, ['t1', 't2', 't3', 't4', 't5']));
    trucksRight.forEach(truck => cycleClass(truck, ['t5', 't4', 't3', 't2', 't1']));
}

function decrementTime() {
    currentTime--;
    timeLeftDisplay.textContent = currentTime;
}

// Outcome checking
function checkOutComes() {
    lose();
    win();
}

function lose() {
    if (
        // Dangerous car classes (c4, c5)
        squares[currentIndex].classList.contains('c4') ||
        squares[currentIndex].classList.contains('c5') ||
        // Dangerous truck classes (t4, t5)
        squares[currentIndex].classList.contains('t4') ||
        squares[currentIndex].classList.contains('t5') ||
        // Water (l4, l5)
        squares[currentIndex].classList.contains('l4') ||
        squares[currentIndex].classList.contains('l5') ||
        currentTime <= 0
    ) {
        resultDisplay.textContent = 'You lose!';
        stopGame();
    }
}

function win() {
    if (squares[currentIndex].classList.contains('ending-block')) {
        resultDisplay.textContent = 'You Win!';
        stopGame();
    }
}

// Stop & reset
function stopGame() {
    clearInterval(timeTimer);
    clearInterval(logTimer);
    clearInterval(carTimer);
    clearInterval(truckTimer);
    clearInterval(outcomeTimerId);
    timeTimer = null;
    logTimer = null;
    carTimer = null;
    truckTimer = null;
    outcomeTimerId = null;
    document.removeEventListener('keyup', moveFrog);
}

function resetGame() {
    stopGame();
    currentIndex = 103;
    squares[currentIndex].appendChild(frogImg);
    currentTime = 20;
    timeLeftDisplay.textContent = currentTime;
    resultDisplay.textContent = '';
}

// Start button
document.getElementById('start-button').addEventListener('click', () => {
    resetGame();

    // Time counter: 1 second interval
    timeTimer = setInterval(decrementTime, 1000);

    // Logs: 1 second 
    logTimer = setInterval(moveLogs, 1000);

    // Cars: 1.25×
    carTimer = setInterval(moveCars, 800);

    // Trucks: 1.5×
    truckTimer = setInterval(moveTrucks, 667);

    // Check every 50 ms
    outcomeTimerId = setInterval(checkOutComes, 50);

    document.addEventListener('keyup', moveFrog);
});

// Pause button
document.getElementById('pause-button').addEventListener('click', resetGame);