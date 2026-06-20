document.addEventListener('DOMContentLoaded', () => {
    const squares = document.querySelectorAll('.grid div');
    const result = document.querySelector('#result');
    const displayCurrentPlayer = document.querySelector('#current-player');
    const resetButton = document.getElementById('reset-button');

    const p1WinsDisplay = document.getElementById('p1-wins');
    const p2WinsDisplay = document.getElementById('p2-wins');

    let currentPlayer = 1;
    let gameActive = true;
    let p1Wins = 0;
    let p2Wins = 0;

    // Set initial turn display
    displayCurrentPlayer.textContent = 'Player 1';

    // Check all 4 directions from every cell
    function checkWin() {
        for (let i = 0; i < squares.length; i++) {
            if (!squares[i].classList.contains('taken')) continue;

            const player = squares[i].classList.contains('player-one') ? 'player-one' : 'player-two';

            // Check right
            if (i % 7 <= 3) {
                if ([0, 1, 2, 3].every(offset => squares[i + offset].classList.contains(player))) {
                    return player;
                }
            }
            // Check down
            if (Math.floor(i / 7) <= 2) {
                if ([0, 7, 14, 21].every(offset => squares[i + offset].classList.contains(player))) {
                    return player;
                }
            }
            // Check diagonal down-right
            if (i % 7 <= 3 && Math.floor(i / 7) <= 2) {
                if ([0, 8, 16, 24].every(offset => squares[i + offset].classList.contains(player))) {
                    return player;
                }
            }
            // Check diagonal down-left
            if (i % 7 >= 3 && Math.floor(i / 7) <= 2) {
                if ([0, 6, 12, 18].every(offset => squares[i + offset].classList.contains(player))) {
                    return player;
                }
            }
        }
        return null;
    }

    function checkBoard() {
        const winner = checkWin();
        if (winner === 'player-one') {
            result.textContent = 'Player One Wins!';
            result.style.color = '#f1c40f';
            p1Wins++;
            p1WinsDisplay.textContent = p1Wins;
            gameActive = false;
        } else if (winner === 'player-two') {
            result.textContent = 'Player Two Wins!';
            result.style.color = '#f1c40f';
            p2Wins++;
            p2WinsDisplay.textContent = p2Wins;
            gameActive = false;
        }
    }

    function handleClick(col) {
        if (!gameActive) return;

        // Find the lowest empty cell in this column
        let targetIndex = -1;
        for (let row = 5; row >= 0; row--) {
            const index = col + row * 7;
            if (!squares[index].classList.contains('taken')) {
                targetIndex = index;
                break;
            }
        }

        // Column full
        if (targetIndex === -1) {
            result.textContent = 'Column full!';
            result.style.color = '#e74c3c';
            setTimeout(() => {
                result.textContent = '';
                result.style.color = '#f1c40f';
            }, 800);
            return;
        }

        // Drop animation
        const playerClass = currentPlayer === 1 ? 'player-one' : 'player-two';
        let dropIndex = col;

        function stepDown() {
            if (dropIndex < targetIndex) {
                squares[dropIndex].classList.add(playerClass);
                setTimeout(() => {
                    squares[dropIndex].classList.remove(playerClass);
                    dropIndex += 7;
                    stepDown();
                }, 50);
            } else {
                squares[targetIndex].classList.add('taken', playerClass);
                currentPlayer = currentPlayer === 1 ? 2 : 1;
                displayCurrentPlayer.textContent = `Player ${currentPlayer}`;
                checkBoard();
            }
        }

        stepDown();
    }

    // Click handler — pass column index
    squares.forEach((square, i) => {
        square.addEventListener('click', () => handleClick(i % 7));
    });

    // Reset
    resetButton.addEventListener('click', () => {
        squares.forEach(square => square.className = '');
        currentPlayer = 1;
        displayCurrentPlayer.textContent = 'Player 1';
        result.textContent = '';
        result.style.color = '#f1c40f';
        gameActive = true;
    });
});