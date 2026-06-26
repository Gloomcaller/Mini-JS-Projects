document.addEventListener('DOMContentLoaded', () => {
    const numOfDiceInput = document.getElementById('numOfDice');
    const diceResult = document.getElementById('diceResult');
    const diceImages = document.getElementById('diceImages');
    const rollBtn = document.getElementById('roll-btn');
    const clearBtn = document.getElementById('clear-btn');

    numOfDiceInput.addEventListener('blur', () => {
        if (numOfDiceInput.value > 36) {
            numOfDiceInput.value = 36;
        }
        if (numOfDiceInput.value < 1) {
            numOfDiceInput.value = 1;
        }
    });

    function rollDice() {
        const numOfDice = Math.min(Math.max(numOfDiceInput.value || 1, 1), 36);
        numOfDiceInput.value = numOfDice;

        const values = [];
        const images = [];
        let sum = 0;

        for (let i = 0; i < numOfDice; i++) {
            const value = Math.floor(Math.random() * 6) + 1;
            values.push(value);
            sum += value;
            images.push(`<img src="media/dice-six-faces-${value}.png" alt="Dice ${value}">`);
        }

        diceResult.textContent = `Rolled: ${values.join(', ')}`;
        diceSum.textContent = `Sum: ${sum}`;
        diceImages.innerHTML = images.join('');
    }

    function clearDice() {
        diceResult.textContent = '';
        diceSum.textContent = '';
        diceImages.innerHTML = '';
        numOfDiceInput.value = 6;
    }

    rollBtn.addEventListener('click', rollDice);
    clearBtn.addEventListener('click', clearDice);
});