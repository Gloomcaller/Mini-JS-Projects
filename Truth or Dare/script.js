const truths = ["Lorem ipsum truth 1", "Lorem ipsum truth 2", "Lorem ipsum truth 3"];
const dares = ["Lorem ipsum dare 1", "Lorem ipsum dare 2", "Lorem ipsum dare 3"];

function selectMode(mode) {
    document.getElementById("home").classList.add("hidden");
    document.getElementById("game").classList.remove("hidden");
    document.getElementById("mode-title").textContent = mode === "classic" ? "Classic Mode" : "Couples Mode";
    document.getElementById("prompt-box").textContent = "";
    document.getElementById("mode-title").style.fontSize = "1.5rem";
}

function getTruth() {
    const randomTruth = truths[Math.floor(Math.random() * truths.length)];
    document.getElementById("prompt-box").textContent = randomTruth;
}

function getDare() {
    const randomDare = dares[Math.floor(Math.random() * dares.length)];
    document.getElementById("prompt-box").textContent = randomDare;
}

function goHome() {
    document.getElementById("game").classList.add("hidden");
    document.getElementById("home").classList.remove("hidden");
    document.getElementById("mode-title").style.fontSize = "2rem";
}

document.getElementById("mode-title").addEventListener("click", goHome);