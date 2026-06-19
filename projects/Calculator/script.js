const display = document.getElementById("display");
const pedroAudio = new Audio("media/pedro pedro.mp3");

let lastClickTime = 0;

function appendToDisplay(input) {
    const now = Date.now();
    if (now - lastClickTime < 100) return;
    lastClickTime = now;

    // Clear error state
    if (display.value === "Error") display.value = "";
    display.value += input;
}

function clearDisplay() {
    const now = Date.now();
    if (now - lastClickTime < 100) return;
    lastClickTime = now;

    display.value = "";
}

function calculate() {
    const value = display.value;

    // Pedro
    const operatorMatch = value.match(/(\+{5}|\-{5}|\*{5}|\/{5})/);
    if (operatorMatch) {
        const equalsButton = document.querySelector("#keys button:last-child");
        equalsButton.style.backgroundImage = "url('media/pedro.gif')";
        equalsButton.style.backgroundSize = "cover";
        equalsButton.textContent = "";

        pedroAudio.currentTime = 0;
        pedroAudio.play();

        display.value = "Pedro";

        setTimeout(() => {
            equalsButton.style.backgroundImage = "";
            equalsButton.textContent = "=";
        }, 3180);

        return;
    }

    // Normal calculation
    try {
        display.value = Function('"use strict";return (' + value + ')')();
    } catch (error) {
        display.value = "Error";
    }
}