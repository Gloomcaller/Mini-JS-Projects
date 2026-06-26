document.addEventListener('DOMContentLoaded', () => {
    const homeScreen = document.getElementById('home-screen');
    const gameScreen = document.getElementById('game-screen');
    const gameTitle = document.getElementById('game-title');
    const promptBox = document.getElementById('prompt-box');
    const truthBtn = document.getElementById('truth-btn');
    const dareBtn = document.getElementById('dare-btn');
    const resetBtn = document.getElementById('reset-btn');
    const backBtn = document.getElementById('back-btn');
    const classicModeBtn = document.getElementById('classic-mode-btn');
    const couplesModeBtn = document.getElementById('couples-mode-btn');

    let truths = [];
    let dares = [];
    let usedTruths = [];
    let usedDares = [];
    let currentMode = 'classic';

    function loadMode(mode) {
        currentMode = mode;
        fetch(`data/${mode}.json`)
            .then(response => response.json())
            .then(data => {
                truths = data.truths;
                dares = data.dares;
                usedTruths = [];
                usedDares = [];
                gameTitle.textContent = mode === 'classic' ? 'Classic Mode' : 'Couples Mode';
                promptBox.textContent = 'Choose Truth or Dare!';
                homeScreen.classList.add('hidden');
                gameScreen.classList.remove('hidden');
            })
            .catch(error => {
                console.error('Error loading JSON:', error);
                promptBox.textContent = 'Failed to load questions. Please try again.';
            });
    }

    function getRandomPrompt(prompts, usedPrompts) {
        if (usedPrompts.length >= prompts.length) {
            return null;
        }
        let randomPrompt;
        do {
            randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
        } while (usedPrompts.includes(randomPrompt));
        usedPrompts.push(randomPrompt);
        return randomPrompt;
    }

    function showTruth() {
        const prompt = getRandomPrompt(truths, usedTruths);
        promptBox.textContent = prompt || 'You have done all the truths! 🎉';
    }

    function showDare() {
        const prompt = getRandomPrompt(dares, usedDares);
        promptBox.textContent = prompt || 'You have done all the dares! 🎉';
    }

    function resetPrompts() {
        usedTruths = [];
        usedDares = [];
        promptBox.textContent = 'Prompts reset! Choose Truth or Dare.';
    }

    function goHome() {
        homeScreen.classList.remove('hidden');
        gameScreen.classList.add('hidden');
    }

    classicModeBtn.addEventListener('click', () => loadMode('classic'));
    couplesModeBtn.addEventListener('click', () => loadMode('couples'));
    truthBtn.addEventListener('click', showTruth);
    dareBtn.addEventListener('click', showDare);
    resetBtn.addEventListener('click', resetPrompts);
    backBtn.addEventListener('click', goHome);
});