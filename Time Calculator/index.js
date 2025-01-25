let totalSeconds = 0;
let maxHours = 99;
const timeDisplay = document.getElementById("time-display");
const timeBreakdown = document.getElementById("time-breakdown");
const errorMessage = document.getElementById("error-message");

function updateDisplay() {
    const hours = Math.floor(totalSeconds / 3600).toString().padStart(2, "0");
    const minutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, "0");
    const seconds = (totalSeconds % 60).toString().padStart(2, "0");
    timeDisplay.textContent = `${hours}:${minutes}:${seconds}`;

    const totalMinutes = Math.floor(totalSeconds / 60);
    timeBreakdown.textContent = `${totalMinutes} minutes, ${totalSeconds} seconds`;
}

function modifyTime(add = true) {
    const hours = parseInt(document.getElementById("hours").value) || 0;
    const minutes = parseInt(document.getElementById("minutes").value) || 0;
    const seconds = parseInt(document.getElementById("seconds").value) || 0;

    if (hours < 0 || minutes < 0 || seconds < 0 || minutes > 59 || seconds > 59) {
        errorMessage.textContent = "Invalid input! Please check your values.";
        return;
    }

    const deltaSeconds = hours * 3600 + minutes * 60 + seconds;

    if (add) {
        if (totalSeconds + deltaSeconds > maxHours * 3600) {
            errorMessage.textContent = `Limit exceeded! Maximum is ${maxHours} hours.`;
            return;
        }
        totalSeconds += deltaSeconds;
    } else {
        if (totalSeconds - deltaSeconds < 0) {
            errorMessage.textContent = "Cannot subtract more time than the current total.";
            return;
        }
        totalSeconds -= deltaSeconds;
    }

    updateDisplay();
    errorMessage.textContent = "";
}

function resetTime() {
    totalSeconds = 0;
    updateDisplay();
    errorMessage.textContent = "";
}

function setMaxTime() {
    const max = parseInt(document.getElementById("max-time").value);
    if (max && max > 0) {
        maxHours = max;
        errorMessage.textContent = `Max time set to ${maxHours} hours.`;
    } else {
        errorMessage.textContent = "Invalid max time value!";
    }
}

document.getElementById("add-time").addEventListener("click", () => modifyTime(true));
document.getElementById("subtract-time").addEventListener("click", () => modifyTime(false));
document.getElementById("reset").addEventListener("click", resetTime);
document.getElementById("set-max").addEventListener("click", setMaxTime);

document.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        modifyTime(true);
    }
});

updateDisplay();
