document.addEventListener('DOMContentLoaded', () => {
    // Tarot deck
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

    // DOM elements
    const intro = document.getElementById('intro');
    const readingSection = document.getElementById('readingSection');
    const greeting = document.getElementById('greeting');
    const spread = document.getElementById('spread');
    const interpretation = document.getElementById('interpretation');
    const readingText = document.getElementById('readingText');
    const newReadingBtn = document.getElementById('newReadingBtn');
    const historyList = document.getElementById('historyList');
    const clearHistoryBtn = document.getElementById('clearHistoryBtn');

    // State
    let userName = '';
    let selectedSpread = 3;
    let readingHistory = [];
    let clickedCards = [];

    // Load history from localStorage
    function loadHistory() {
        const stored = localStorage.getItem('tarotHistory');
        if (stored) readingHistory = JSON.parse(stored);
    }

    // Save history to localStorage
    function saveHistory() {
        localStorage.setItem('tarotHistory', JSON.stringify(readingHistory));
    }

    // Load user info from localStorage
    function loadUserInfo() {
        const storedName = localStorage.getItem('tarotUserName');
        const storedBirthday = localStorage.getItem('tarotUserBirthday');
        if (storedName) document.getElementById('username').value = storedName;
        if (storedBirthday) document.getElementById('birthday').value = storedBirthday;
    }

    // Save user info to localStorage
    function saveUserInfo() {
        localStorage.setItem('tarotUserName', userName);
        localStorage.setItem('tarotUserBirthday', document.getElementById('birthday').value);
    }

    // Render history list
    function updateHistoryUI() {
        historyList.innerHTML = '';
        if (readingHistory.length === 0) {
            historyList.innerHTML = '<p style="opacity:0.6; text-align:center;">No past readings yet.</p>';
            clearHistoryBtn.classList.add('hidden');
            return;
        }
        clearHistoryBtn.classList.remove('hidden');

        readingHistory.forEach((entry, index) => {
            const div = document.createElement('div');
            div.className = 'history-item';
            div.innerHTML = `
                <div>
                    <strong>${entry.date}</strong> — ${entry.spread} cards
                    <br>Cards: ${entry.cards.join(', ')}
                </div>
                <button class="delete-btn" data-index="${index}">✕</button>
            `;
            historyList.appendChild(div);
        });

        // Delete individual entries
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(e.target.dataset.index);
                readingHistory.splice(idx, 1);
                saveHistory();
                updateHistoryUI();
            });
        });
    }

    // Draw random cards from deck
    function drawCards(num) {
        const deckCopy = [...tarotDeck];
        const drawn = [];
        for (let i = 0; i < num; i++) {
            const rand = Math.floor(Math.random() * deckCopy.length);
            drawn.push(deckCopy.splice(rand, 1)[0]);
        }
        return drawn;
    }

    // Create a card DOM element
    function createCardElement(card, position) {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'card';

        const img = document.createElement('img');
        img.src = card.img;
        img.alt = card.name;
        img.onerror = () => {
            img.style.display = 'none';
            const fb = document.createElement('div');
            fb.style.cssText = 'width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#5c00a3;color:#fff;font-weight:bold;padding:5px;text-align:center;';
            fb.textContent = card.name;
            cardDiv.appendChild(fb);
        };

        const meaningOverlay = document.createElement('div');
        meaningOverlay.className = 'meaning';
        meaningOverlay.textContent = card.meaning;

        cardDiv.appendChild(img);
        cardDiv.appendChild(meaningOverlay);

        // Click to reveal interpretation
        cardDiv.addEventListener('click', () => {
            if (clickedCards.includes(position)) return;
            clickedCards.push(position);
            const posLabels = selectedSpread === 3 ? ['Love', 'Career', 'Future'] : ['Past', 'Present', 'Future', 'Advice', 'Outcome'];
            readingText.innerHTML += `<p><strong>${posLabels[position]}:</strong> ${card.name} — ${card.meaning}</p>`;
        });

        return cardDiv;
    }

    // Overall spread analysis
    function analyzeSpread(cards) {
        const good = cards.filter(c => c.type === 'good').length;
        const bad = cards.filter(c => c.type === 'bad').length;
        if (good > bad) return "Overall, this reading suggests positive outcomes ahead.";
        if (bad > good) return "This reading indicates some challenges ahead. Be prepared.";
        return "This reading shows a balance of influences. Your choices will determine outcomes.";
    }

    // Display the spread on screen
    function displaySpread(cards) {
        spread.innerHTML = '';
        const posLabels = selectedSpread === 3 ? ['Love', 'Career', 'Future'] : ['Past', 'Present', 'Future', 'Advice', 'Outcome'];

        cards.forEach((card, idx) => {
            const slot = document.createElement('div');
            slot.className = 'slot';
            const label = document.createElement('span');
            label.textContent = posLabels[idx];
            slot.appendChild(label);
            slot.appendChild(createCardElement(card, idx));
            spread.appendChild(slot);
        });

        spread.classList.remove('hidden');
        readingText.innerHTML = `<p><em>${analyzeSpread(cards)}</em></p>`;
        interpretation.classList.remove('hidden');
        newReadingBtn.classList.remove('hidden');
    }

    // Perform a full reading
    function performReading() {
        clickedCards = [];
        const cards = drawCards(selectedSpread);
        displaySpread(cards);

        const entry = {
            date: new Date().toLocaleString(),
            spread: selectedSpread,
            cards: cards.map(c => c.name)
        };
        readingHistory.unshift(entry);
        saveHistory();
        updateHistoryUI();
    }

    // Start button
    document.getElementById('startBtn').addEventListener('click', () => {
        userName = document.getElementById('username').value.trim();
        if (!userName) {
            alert('Please enter your name.');
            return;
        }
        saveUserInfo();
        greeting.textContent = `Welcome, ${userName}. Your fate awaits...`;
        intro.classList.add('hidden');
        readingSection.classList.remove('hidden');
        performReading();
    });

    // Spread type buttons
    document.querySelectorAll('.spread-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            selectedSpread = parseInt(e.target.dataset.cards);
            document.querySelectorAll('.spread-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
        });
    });

    // New reading button
    newReadingBtn.addEventListener('click', () => {
        spread.classList.add('hidden');
        interpretation.classList.add('hidden');
        readingText.innerHTML = '';
        performReading();
    });

    // Clear all history
    clearHistoryBtn.addEventListener('click', () => {
        if (confirm('Delete all reading history?')) {
            readingHistory = [];
            saveHistory();
            updateHistoryUI();
        }
    });

    // Init
    loadHistory();
    loadUserInfo();
    updateHistoryUI();
});