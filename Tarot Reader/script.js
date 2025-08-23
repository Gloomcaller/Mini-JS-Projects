const tarotDeck = [
    { name: "The Fool", meaning: "New beginnings, spontaneity", type: "good", img: "fool.jpg" },
    { name: "The Magician", meaning: "Power, resourcefulness", type: "good", img: "magician.jpg" },
    { name: "The High Priestess", meaning: "Intuition, mystery", type: "neutral", img: "high_priestess.jpg" },
    { name: "The Empress", meaning: "Nature, nurture, abundance", type: "good", img: "empress.jpg" },
    { name: "The Emperor", meaning: "Authority, structure", type: "neutral", img: "emperor.jpg" },
    { name: "The Lovers", meaning: "Love, harmony", type: "good", img: "lovers.jpg" },
    { name: "The Chariot", meaning: "Control, determination", type: "neutral", img: "chariot.jpg" },
    { name: "Strength", meaning: "Courage, influence", type: "good", img: "strength.jpg" },
    { name: "The Hermit", meaning: "Reflection, solitude", type: "neutral", img: "hermit.jpg" },
    { name: "Death", meaning: "Endings, transformation", type: "bad", img: "death.jpg" },
    { name: "The Tower", meaning: "Chaos, upheaval", type: "bad", img: "tower.jpg" },
    { name: "The Star", meaning: "Hope, inspiration", type: "good", img: "star.jpg" },
    { name: "The Moon", meaning: "Illusion, fear", type: "bad", img: "moon.jpg" },
    { name: "The Sun", meaning: "Joy, success", type: "good", img: "sun.jpg" },
    { name: "Judgement", meaning: "Reflection, reckoning", type: "neutral", img: "judgement.jpg" },
    { name: "The World", meaning: "Completion, achievement", type: "good", img: "world.jpg" }
];

const nameForm = document.getElementById("nameForm");
const readingSection = document.getElementById("readingSection");
const greeting = document.getElementById("greeting");
const drawBtn = document.getElementById("drawBtn");
const slots = document.querySelectorAll(".card-slot");

function drawCards(num) {
    let deckCopy = [...tarotDeck];
    let drawn = [];
    for (let i = 0; i < num; i++) {
        let index = Math.floor(Math.random() * deckCopy.length);
        drawn.push(deckCopy.splice(index, 1)[0]);
    }
    return drawn;
}

function createCard(card) {
    let cardEl = document.createElement("div");
    cardEl.classList.add("card", card.type);

    let imgEl = document.createElement("img");
    imgEl.src = "images/" + card.img;
    imgEl.alt = card.name;

    let meaningEl = document.createElement("div");
    meaningEl.classList.add("meaning");
    meaningEl.textContent = card.meaning;

    cardEl.appendChild(imgEl);
    cardEl.appendChild(meaningEl);

    return cardEl;
}

nameForm.addEventListener("submit", function (e) {
    e.preventDefault();
    let userName = document.getElementById("username").value.trim();
    greeting.textContent = `Welcome, ${userName}. Your fate awaits...`;
    nameForm.classList.add("hidden");
    readingSection.classList.remove("hidden");
});

drawBtn.addEventListener("click", function () {
    slots.forEach(slot => slot.innerHTML = "");
    let drawnCards = drawCards(3);

    drawnCards.forEach((card, index) => {
        let cardEl = createCard(card);
        slots[index].appendChild(cardEl);
    });

    greeting.textContent = "A look in to the future...";
});
