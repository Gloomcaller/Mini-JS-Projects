let is24HourFormat = false;

function updateClock() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0");

    if (!is24HourFormat) {
        const meridiem = hours >= 12 ? "PM" : "AM";
        hours = hours % 12 || 12;
        document.getElementById("clock").textContent = `${hours.toString().padStart(2, "0")}:${minutes}:${seconds} ${meridiem}`;
    } else {
        document.getElementById("clock").textContent = `${hours.toString().padStart(2, "0")}:${minutes}:${seconds}`;
    }
}

document.getElementById("format-24").addEventListener("click", () => {
    is24HourFormat = true;
});

document.getElementById("format-12").addEventListener("click", () => {
    is24HourFormat = false;
});

updateClock();
setInterval(updateClock, 1000);