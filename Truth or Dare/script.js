let truths = [];
let dares = [];
let usedTruths = [];
let usedDares = [];

const mode = window.location.pathname.includes('classic.html') ? 'classic' : 'couples';

window.onload = () => loadData(mode);

function loadData(mode) {
    fetch(`data/${mode}.json`)
        .then(response => response.json())
        .then(data => {
            truths = data.truths;
            dares = data.dares;
            usedTruths = [];
            usedDares = [];
        })
        .catch(error => console.error('Error loading JSON:', error));
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

function getTruth() {
    const prompt = getRandomPrompt(truths, usedTruths);
    if (prompt) {
        document.getElementById("prompt-box").textContent = prompt;
    } else {
        document.getElementById("prompt-box").textContent = "You have done all the truths for this mode! Good job, I hope you had fun :D";
    }
}

function getDare() {
    const prompt = getRandomPrompt(dares, usedDares);
    if (prompt) {
        document.getElementById("prompt-box").textContent = prompt;
    } else {
        document.getElementById("prompt-box").textContent = "You have done all the dares for this mode! Good job, I hope you had fun :D";
    }
}

function resetUsedPrompts() {
    usedTruths = [];
    usedDares = [];
}