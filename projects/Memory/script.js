document.addEventListener('DOMContentLoaded', () => {
    const cardArray = [
        { name: 'fries', img: './media/fries.png' },
        { name: 'cheeseburger', img: './media/cheeseburger.png' },
        { name: 'ice-cream', img: './media/ice-cream.png' },
        { name: 'pizza', img: './media/pizza.png' },
        { name: 'milkshake', img: './media/milkshake.png' },
        { name: 'hotdog', img: './media/hotdog.png' }
    ];

    const gameCards = [...cardArray, ...cardArray];

    const grid = document.getElementById('grid');
    const resultDisplay = document.getElementById('result');
    const totalPairsDisplay = document.getElementById('total-pairs');
    const resetBtn = document.getElementById('reset-btn');
    const winMessage = document.getElementById('win-message');
    const playAgainBtn = document.getElementById('play-again-btn');
    const movesCount = document.getElementById('moves-count');

    let cardsChosen = [];
    let cardsChosenId = [];
    let cardsWon = [];
    let moves = 0;

    totalPairsDisplay.textContent = cardArray.length;

    function createBoard() {
        grid.innerHTML = '';
        gameCards.sort(() => 0.5 - Math.random());

        gameCards.forEach((card, index) => {
            const cardElement = document.createElement('img');
            cardElement.setAttribute('src', './media/blank.png');
            cardElement.setAttribute('data-id', index);
            cardElement.addEventListener('click', flipCard);
            grid.appendChild(cardElement);
        });
    }

    function flipCard() {
        if (cardsChosen.length === 2 || this.getAttribute('src') !== './media/blank.png') return;

        const cardId = this.getAttribute('data-id');
        cardsChosen.push(gameCards[cardId].name);
        cardsChosenId.push(cardId);
        this.setAttribute('src', gameCards[cardId].img);

        if (cardsChosen.length === 2) {
            moves++;
            setTimeout(checkForMatch, 500);
        }
    }

    function checkForMatch() {
        const cards = document.querySelectorAll('#grid img');
        const [firstId, secondId] = cardsChosenId;

        if (firstId === secondId) {
            cards[firstId].setAttribute('src', './media/blank.png');
            alert('You clicked the same card twice!');
        }
        else if (cardsChosen[0] === cardsChosen[1]) {
            cards[firstId].classList.add('matched');
            cards[secondId].classList.add('matched');
            cards[firstId].removeEventListener('click', flipCard);
            cards[secondId].removeEventListener('click', flipCard);
            cardsWon.push(cardsChosen);
        }
        else {
            cards[firstId].setAttribute('src', './media/blank.png');
            cards[secondId].setAttribute('src', './media/blank.png');
        }

        cardsChosen = [];
        cardsChosenId = [];
        resultDisplay.textContent = cardsWon.length;

        if (cardsWon.length === cardArray.length) {
            movesCount.textContent = moves;
            winMessage.classList.remove('hidden');
            grid.style.marginBottom = '20px';
        }
    }

    function resetGame() {
        cardsChosen = [];
        cardsChosenId = [];
        cardsWon = [];
        moves = 0;
        resultDisplay.textContent = '0';
        winMessage.classList.add('hidden');
        createBoard();
    }

    resetBtn.addEventListener('click', resetGame);
    playAgainBtn.addEventListener('click', resetGame);

    createBoard();
});