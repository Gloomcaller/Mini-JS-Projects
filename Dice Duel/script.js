const playerForm = document.getElementById("playerForm");
const gameArea = document.getElementById("gameArea");
const turnInfo = document.getElementById("turnInfo");
const rollBtn = document.getElementById("rollBtn");
const resetBtn = document.getElementById("resetBtn");
const result = document.getElementById("result");
const historyDiv = document.getElementById("history");
const dice1Img = document.getElementById("dice1");
const dice2Img = document.getElementById("dice2");
const p1ScoreEl = document.getElementById("p1Score");
const p2ScoreEl = document.getElementById("p2Score");

let players = [];
let round = 1;
let history = [];
let scores = [0, 0];

function rollDice() {
    return Math.floor(Math.random() * 6) + 1;
}

function playRound(p1, p2) {
    let rolls = [rollDice(), rollDice()];

    dice1Img.src = `./media/dice${rolls[0]}.png`;
    dice2Img.src = `./media/dice${rolls[1]}.png`;

    let message = `${p1} rolled ${rolls[0]} | ${p2} rolled ${rolls[1]}`;

    if (rolls[0] > rolls[1]) {
        message += ` → ${p1} wins!`;
        result.className = "win";
        scores[0]++;
    } else if (rolls[1] > rolls[0]) {
        message += ` → ${p2} wins!`;
        result.className = "lose";
        scores[1]++;
    } else {
        message += " → It's a draw!";
        result.className = "";
    }

    updateScores();
    return message;
}

function updateScores() {
    p1ScoreEl.textContent = scores[0];
    p2ScoreEl.textContent = scores[1];
}

function resetGame() {
    scores = [0, 0];
    history = [];
    round = 1;
    updateScores();
    historyDiv.innerHTML = "";
    result.textContent = "";
    turnInfo.textContent = `Round ${round}`;
    dice1Img.src = "media/dice1.png";
    dice2Img.src = "media/dice1.png";
}

playerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    players[0] = document.getElementById("player1").value.trim() || "Player 1";
    players[1] = document.getElementById("player2").value.trim() || "Player 2";
    playerForm.classList.add("hidden");
    gameArea.classList.remove("hidden");
    turnInfo.textContent = `Round ${round}`;
});

rollBtn.addEventListener("click", () => {
    const roundResult = playRound(players[0], players[1]);
    result.textContent = roundResult;

    history.push(roundResult);
    updateHistory();

    round++;
    turnInfo.textContent = `Round ${round}`;
});

resetBtn.addEventListener("click", resetGame);

function updateHistory() {
    historyDiv.innerHTML = "";
    history.slice(-5).forEach((entry, index) => {
        const div = document.createElement("div");
        div.className = "history-item";
        div.textContent = `#${round - (5 - index)} ${entry}`;
        historyDiv.appendChild(div);
    });
}
