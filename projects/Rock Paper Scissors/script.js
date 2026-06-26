document.addEventListener('DOMContentLoaded', () => {
    const userChoiceImg = document.getElementById('user-choice-img');
    const userChoiceText = document.getElementById('user-choice-text');
    const computerChoiceImg = document.getElementById('computer-choice-img');
    const computerChoiceText = document.getElementById('computer-choice-text');
    const resultDisplay = document.getElementById('result');
    const winsDisplay = document.getElementById('wins');
    const drawsDisplay = document.getElementById('draws');
    const lossesDisplay = document.getElementById('losses');
    const choiceButtons = document.querySelectorAll('.choices button');
    const resetScoreBtn = document.getElementById('reset-score');

    let wins = 0;
    let draws = 0;
    let losses = 0;

    const choices = ['rock', 'paper', 'scissors'];

    choiceButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const userChoice = button.id;
            userChoiceImg.src = `media/${userChoice}.png`;
            userChoiceText.textContent = userChoice;

            // Thinking animation
            computerChoiceImg.classList.add('thinking');
            computerChoiceText.textContent = '...';
            resultDisplay.textContent = '';
            resultDisplay.style.color = '#fff';

            // Delay to simulate "thinking"
            setTimeout(() => {
                const computerChoice = choices[Math.floor(Math.random() * 3)];
                computerChoiceImg.src = `media/${computerChoice}.png`;
                computerChoiceImg.classList.remove('thinking');
                computerChoiceText.textContent = computerChoice;
                getResult(userChoice, computerChoice);
            }, 600);
        });
    });

    function getResult(user, computer) {
        if (user === computer) {
            resultDisplay.textContent = "It's a draw!";
            resultDisplay.style.color = '#f1c40f';
            draws++;
            drawsDisplay.textContent = draws;
        } else if (
            (computer === 'rock' && user === 'scissors') ||
            (computer === 'scissors' && user === 'paper') ||
            (computer === 'paper' && user === 'rock')
        ) {
            resultDisplay.textContent = 'You lose!';
            resultDisplay.style.color = '#e74c3c';
            losses++;
            lossesDisplay.textContent = losses;
        } else {
            resultDisplay.textContent = 'You win!';
            resultDisplay.style.color = '#2ecc71';
            wins++;
            winsDisplay.textContent = wins;
        }
    }

    resetScoreBtn.addEventListener('click', () => {
        wins = 0;
        draws = 0;
        losses = 0;
        winsDisplay.textContent = '0';
        drawsDisplay.textContent = '0';
        lossesDisplay.textContent = '0';
        userChoiceImg.src = `media/you.png`;
        userChoiceText.textContent = "";
        computerChoiceImg.src = `media/computer.png`;
        computerChoiceText.textContent = "";
    });
});