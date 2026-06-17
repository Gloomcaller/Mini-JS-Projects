const tarotDeck = [
    { name: "The Fool", meaning: "New beginnings, spontaneity", type: "good", img: "./media/00-TheFool.png" },
    { name: "The Magician", meaning: "Power, resourcefulness", type: "good", img: "./media/01-TheMagician.png" },
    { name: "The High Priestess", meaning: "Intuition, mystery", type: "neutral", img: "./media/02-TheHighPriestess.png" },
    { name: "The Empress", meaning: "Nature, nurture, abundance", type: "good", img: "./media/03-TheEmpress.png" },
    { name: "The Emperor", meaning: "Authority, structure", type: "neutral", img: "./media/04-TheEmperor.png" },
    { name: "The Hierophant", meaning: "Tradition, conformity", type: "neutral", img: "./media/05-TheHierophant.png" },
    { name: "The Lovers", meaning: "Love, harmony", type: "good", img: "./media/06-TheLovers.png" },
    { name: "The Chariot", meaning: "Control, determination", type: "neutral", img: "./media/07-TheChariot.png" },
    { name: "Strength", meaning: "Courage, influence", type: "good", img: "./media/08-Strength.png" },
    { name: "The Hermit", meaning: "Reflection, solitude", type: "neutral", img: "./media/09-TheHermit.png" },
    { name: "Wheel of Fortune", meaning: "Change, cycles", type: "neutral", img: "./media/10-WheelOfFortune.png" },
    { name: "Justice", meaning: "Fairness, truth", type: "good", img: "./media/11-Justice.png" },
    { name: "The Hanged Man", meaning: "Surrender, new perspective", type: "neutral", img: "./media/12-TheHangedMan.png" },
    { name: "Death", meaning: "Endings, transformation", type: "bad", img: "./media/13-Death.png" },
    { name: "Temperance", meaning: "Balance, moderation", type: "good", img: "./media/14-Temperance.png" },
    { name: "The Devil", meaning: "Bondage, materialism", type: "bad", img: "./media/15-TheDevil.png" },
    { name: "The Tower", meaning: "Chaos, upheaval", type: "bad", img: "./media/16-TheTower.png" },
    { name: "The Star", meaning: "Hope, inspiration", type: "good", img: "./media/17-TheStar.png" },
    { name: "The Moon", meaning: "Illusion, fear", type: "bad", img: "./media/18-TheMoon.png" },
    { name: "The Sun", meaning: "Joy, success", type: "good", img: "./media/19-TheSun.png" },
    { name: "Judgement", meaning: "Reflection, reckoning", type: "neutral", img: "./media/20-Judgement.png" },
    { name: "The World", meaning: "Completion, achievement", type: "good", img: "./media/21-TheWorld.png" }
];

const intro = document.getElementById('intro');
const readingSection = document.getElementById('readingSection');
const greeting = document.getElementById('greeting');
const spread = document.getElementById('spread');
const interpretation = document.getElementById('interpretation');
const readingText = document.getElementById('readingText');
const newReadingBtn = document.getElementById('newReadingBtn');
const historySection = document.getElementById('history');
const historyList = document.getElementById('historyList');

let userName = '';
let selectedSpread = 3;
let readingHistory = [];
let clickedCards = [];

function formatName(name) {
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}

function drawCards(num) {
    let drawnCards = [];
    let deckCopy = JSON.parse(JSON.stringify(tarotDeck));

    for (let i = 0; i < num; i++) {
        const randomIndex = Math.floor(Math.random() * deckCopy.length);
        drawnCards.push(deckCopy[randomIndex]);
        deckCopy.splice(randomIndex, 1);
    }

    return drawnCards;
}

function createCardElement(card, position) {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'card';
    cardDiv.dataset.cardIndex = position;

    const imgEl = document.createElement('img');
    imgEl.src = card.img;
    imgEl.alt = card.name;
    imgEl.onerror = function () {
        this.style.display = 'none';
        const fallback = document.createElement('div');
        fallback.style.width = '100%';
        fallback.style.height = '100%';
        fallback.style.display = 'flex';
        fallback.style.justifyContent = 'center';
        fallback.style.alignItems = 'center';
        fallback.style.background = '#5c00a3';
        fallback.style.color = 'white';
        fallback.style.fontWeight = 'bold';
        fallback.style.padding = '5px';
        fallback.style.textAlign = 'center';
        fallback.textContent = card.name;
        cardDiv.appendChild(fallback);
    };

    const meaningEl = document.createElement('div');
    meaningEl.classList.add('meaning');
    meaningEl.textContent = card.meaning;

    cardDiv.appendChild(imgEl);
    cardDiv.appendChild(meaningEl);

    cardDiv.addEventListener('click', () => {
        showCardInterpretation(card, position);
    });

    return cardDiv;
}

function showCardInterpretation(card, position) {
    if (clickedCards.includes(position)) {
        return;
    }

    clickedCards.push(position);

    const positions = selectedSpread === 3 ?
        ['Love', 'Career', 'Future'] :
        ['Past', 'Present', 'Future', 'Advice', 'Outcome'];
    readingText.innerHTML += `<p><strong>${positions[position]}:</strong> ${card.name} - ${card.meaning}</p>`;
}

function analyzeSpread(cards) {
    const goodCount = cards.filter(card => card.type === 'good').length;
    const badCount = cards.filter(card => card.type === 'bad').length;

    if (goodCount > badCount) {
        return "Overall, this reading suggests positive outcomes ahead.";
    } else if (badCount > goodCount) {
        return "This reading indicates some challenges ahead. Be prepared.";
    } else {
        return "This reading shows a balance of influences. Your choices will determine outcomes.";
    }
}

function displaySpread(cards) {
    spread.innerHTML = '';

    const positions = selectedSpread === 3 ?
        ['Love', 'Career', 'Future'] :
        ['Past', 'Present', 'Future', 'Advice', 'Outcome'];

    cards.forEach((card, index) => {
        const slotDiv = document.createElement('div');
        slotDiv.className = 'slot';

        const title = document.createElement('h2');
        title.textContent = positions[index];

        const cardSlot = document.createElement('div');
        cardSlot.className = 'card-slot';
        cardSlot.appendChild(createCardElement(card, index));

        slotDiv.appendChild(title);
        slotDiv.appendChild(cardSlot);
        spread.appendChild(slotDiv);
    });

    spread.classList.remove('hidden');

    const overallAnalysis = analyzeSpread(cards);
    readingText.innerHTML = `<p>${overallAnalysis}</p>`;
    interpretation.classList.remove('hidden');

    addToHistory(cards);

    newReadingBtn.classList.remove('hidden');
}

function addToHistory(cards) {
    const cardNames = cards.map(card => card.name);
    const historyEntry = {
        date: new Date().toLocaleString(),
        cards: cardNames,
        spreadType: selectedSpread
    };

    readingHistory.push(historyEntry);
    updateHistoryDisplay();
}

function updateHistoryDisplay() {
    historyList.innerHTML = '';

    for (let i = 0; i < readingHistory.length; i++) {
        const entry = readingHistory[i];
        const entryDiv = document.createElement('div');
        entryDiv.className = 'history-item';

        entryDiv.innerHTML = `
            <p><strong>${entry.date}</strong> - ${entry.spreadType}-card spread</p>
            <p>Cards: ${entry.cards.join(', ')}</p>
        `;

        historyList.appendChild(entryDiv);
    }

    historySection.classList.remove('hidden');
}

function performReading() {
    clickedCards = [];
    const cards = drawCards(selectedSpread);
    displaySpread(cards);
}

document.getElementById('startBtn').addEventListener('click', () => {
    userName = document.getElementById('username').value.trim();

    if (userName === '') {
        alert('Please enter your name');
        return;
    }

    const formattedName = formatName(userName);
    greeting.textContent = `Welcome, ${formattedName}. Your fate awaits...`;

    intro.classList.add('hidden');
    readingSection.classList.remove('hidden');

    performReading();
});

document.querySelectorAll('.spread-type').forEach(button => {
    button.addEventListener('click', (e) => {
        selectedSpread = parseInt(e.target.dataset.cards);
        document.querySelectorAll('.spread-type').forEach(btn => {
            btn.classList.toggle('active', btn === e.target);
        });
    });
});

newReadingBtn.addEventListener('click', () => {
    spread.classList.add('hidden');
    interpretation.classList.add('hidden');
    readingText.innerHTML = '';

    performReading();
});