const computerChoiceDisplay = document.getElementById('computer-choice');
const userChoiceDisplay = document.getElementById('user-choice');
const resultDisplay = document.getElementById('result');
const possibleChoices = document.querySelectorAll('button');
const winsDisplay = document.getElementById('wins');
const drawsDisplay = document.getElementById('draws');
const lossesDisplay = document.getElementById('losses');

let userChoice;
let computerChoice;
let wins = 0;
let draws = 0;
let losses = 0;

possibleChoices.forEach(possibleChoice => possibleChoice.addEventListener('click', (e) => {
    userChoice = e.target.id;
    userChoiceDisplay.innerHTML = userChoice;
    generateComputerChoice();
    getResult();
}));

function generateComputerChoice() {
    const randomNumber = Math.floor(Math.random() * 3) + 1;

    if (randomNumber === 1) {
        computerChoice = 'rock';
    }
    if (randomNumber === 2) {
        computerChoice = 'scissors';
    }
    if (randomNumber === 3) {
        computerChoice = 'paper';
    }

    computerChoiceDisplay.innerHTML = computerChoice;
}

function getResult() {
    if (computerChoice === userChoice) {
        resultDisplay.innerHTML = "It's a draw!";
        draws++;
        drawsDisplay.textContent = draws;
    } else if (
        (computerChoice === 'rock' && userChoice === 'scissors') ||
        (computerChoice === 'scissors' && userChoice === 'paper') ||
        (computerChoice === 'paper' && userChoice === 'rock')
    ) {
        resultDisplay.innerHTML = "You lose!";
        losses++;
        lossesDisplay.textContent = losses;
    } else {
        resultDisplay.innerHTML = "You win!";
        wins++;
        winsDisplay.textContent = wins;
    }
}