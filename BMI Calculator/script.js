const calcBtn = document.getElementById('calcBtn');
const newCalcBtn = document.getElementById('newCalcBtn');
const resultSection = document.getElementById('resultSection');
const greeting = document.getElementById('greeting');
const bmiResult = document.getElementById('bmiResult');
const bmiMessage = document.getElementById('bmiMessage');
const history = document.getElementById('history');
const historyList = document.getElementById('historyList');

let historyData = [];

function formatName(name) {
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}

function calculateBMI(weight, height) {
    let bmi = weight / ((height / 100) ** 2);
    return bmi.toFixed(1);
}

function getBMIMessage(bmi, age, activity) {
    let status;
    if (bmi < 18.5) status = "Underweight";
    else if (bmi < 25) status = "Normal weight";
    else if (bmi < 30) status = "Overweight";
    else status = "Obese";

    if (age < 18) {
        status += " (Note: BMI ranges differ for teens)";
    } else if (age > 65) {
        status += " (Be mindful: seniors may have different health standards)";
    }

    if (activity === "low" && status !== "Normal weight") {
        status += " - Consider more activity.";
    }
    if (activity === "high" && status === "Overweight") {
        status += " - Muscle mass may influence this.";
    }

    return status;
}

function addToHistory(user, bmi, status) {
    const entry = {
        date: new Date().toLocaleString(),
        user,
        bmi,
        status
    };
    historyData.push(entry);
    updateHistoryDisplay();
}

function updateHistoryDisplay() {
    historyList.innerHTML = "";
    for (let i = 0; i < historyData.length; i++) {
        const entry = historyData[i];
        const div = document.createElement('div');
        div.className = 'history-item';
        div.innerHTML = `<strong>${entry.date}</strong> - ${entry.user}: BMI ${entry.bmi} (${entry.status})`;
        historyList.appendChild(div);
    }
    history.classList.remove('hidden');
}

calcBtn.addEventListener('click', () => {
    const nameInput = document.getElementById('username').value.trim();
    const ageInput = parseInt(document.getElementById('age').value);
    const heightInput = parseFloat(document.getElementById('height').value);
    const weightInput = parseFloat(document.getElementById('weight').value);
    const activityInput = document.getElementById('activity').value;

    if (!nameInput || !ageInput || !heightInput || !weightInput || !activityInput) {
        alert("Please fill all fields");
        return;
    }

    const user = formatName(nameInput);
    const bmi = calculateBMI(weightInput, heightInput);
    const status = getBMIMessage(bmi, ageInput, activityInput);

    greeting.textContent = `Hello, ${user}. Here are your results:`;
    bmiResult.textContent = `Your BMI is ${bmi}`;
    bmiMessage.textContent = `Category: ${status}`;

    bmiMessage.className = (status.includes("Normal weight")) ? "result-good" : "result-bad";

    resultSection.classList.remove('hidden');

    addToHistory(user, bmi, status);
});

newCalcBtn.addEventListener('click', () => {
    document.getElementById('username').value = "";
    document.getElementById('age').value = "";
    document.getElementById('height').value = "";
    document.getElementById('weight').value = "";
    document.getElementById('activity').value = "";
    resultSection.classList.add('hidden');
});
