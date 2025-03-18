const truths = ["Lorem ipsum truth 1", "Lorem ipsum truth 2", "Lorem ipsum truth 3"];
const dares = ["Lorem ipsum dare 1", "Lorem ipsum dare 2", "Lorem ipsum dare 3"];

function getTruth() {
    const randomTruth = truths[Math.floor(Math.random() * truths.length)];
    document.getElementById("prompt-box").textContent = randomTruth;
}

function getDare() {
    const randomDare = dares[Math.floor(Math.random() * dares.length)];
    document.getElementById("prompt-box").textContent = randomDare;
}