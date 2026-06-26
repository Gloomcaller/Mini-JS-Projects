document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const formSection = document.getElementById('formSection');
    const resultSection = document.getElementById('resultSection');
    const greeting = document.getElementById('greeting');
    const metricsContainer = document.getElementById('metrics');
    const historyList = document.getElementById('historyList');
    const calcBtn = document.getElementById('calcBtn');
    const newCalcBtn = document.getElementById('newCalcBtn');

    // State
    let historyData = [];

    // Activity multipliers
    const activityMultipliers = {
        sedentary: 1.2,
        light: 1.375,
        moderate: 1.55,
        active: 1.725,
        very_active: 1.9
    };

    // Goal calorie adjustments
    const goalAdjustments = {
        lose: -500,
        maintain: 0,
        gain: 500
    };

    // Load history from localStorage
    function loadHistory() {
        const stored = localStorage.getItem('wellnessHistory');
        if (stored) historyData = JSON.parse(stored);
    }

    function saveHistory() {
        localStorage.setItem('wellnessHistory', JSON.stringify(historyData));
    }

    // Render history list
    function updateHistoryUI() {
        historyList.innerHTML = '';
        if (historyData.length === 0) {
            historyList.innerHTML = '<p style="opacity:0.6; text-align:center;">No calculations yet.</p>';
            return;
        }

        historyData.forEach((entry, index) => {
            const div = document.createElement('div');
            div.className = 'history-item';
            div.innerHTML = `
                <div>
                    <strong>${entry.date}</strong> — ${entry.name}
                    <br>BMI ${entry.bmi} | BMR ${entry.bmr} | Goal ${entry.recommended} kcal
                </div>
                <button class="delete-btn" data-index="${index}">✕</button>
            `;
            historyList.appendChild(div);
        });

        // Delete individual entries
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(e.target.dataset.index);
                historyData.splice(idx, 1);
                saveHistory();
                updateHistoryUI();
            });
        });
    }

    // Calculations
    function calcBMI(weight, height) {
        return (weight / ((height / 100) ** 2)).toFixed(1);
    }

    function getBMICategory(bmi) {
        if (bmi < 18.5) return 'Underweight';
        if (bmi < 25) return 'Normal';
        if (bmi < 30) return 'Overweight';
        return 'Obese';
    }

    function calcBMR(weight, height, age, gender) {
        // Mifflin-St Jeor
        const base = 10 * weight + 6.25 * height - 5 * age;
        return gender === 'male' ? base + 5 : base - 161;
    }

    function calcTDEE(bmr, activity) {
        return Math.round(bmr * (activityMultipliers[activity] || 1.2));
    }

    function calcIdealWeightRange(height, gender) {
        // Devine formula
        const inches = height / 2.54;
        const ideal = gender === 'male' ? (50 + 2.3 * (inches - 60)) : (45.5 + 2.3 * (inches - 60));
        return `${(ideal - 5).toFixed(1)} - ${(ideal + 5).toFixed(1)}`;
    }

    function calcWaistHipRatio(waist, hip) {
        if (!waist || !hip) return null;
        return (waist / hip).toFixed(2);
    }

    function getBodyFatCategory(bodyfat, gender) {
        if (!bodyfat) return null;
        if (gender === 'male') {
            if (bodyfat < 6) return 'Essential fat';
            if (bodyfat < 14) return 'Athletic';
            if (bodyfat < 18) return 'Fitness';
            if (bodyfat < 25) return 'Average';
            return 'Obese';
        } else {
            if (bodyfat < 14) return 'Essential fat';
            if (bodyfat < 21) return 'Athletic';
            if (bodyfat < 25) return 'Fitness';
            if (bodyfat < 32) return 'Average';
            return 'Obese';
        }
    }

    function calcProtein(weight, goal) {
        // grams per kg: lose 2.0, maintain 1.6, gain 1.8
        const factor = { lose: 2.0, maintain: 1.6, gain: 1.8 }[goal] || 1.6;
        return Math.round(weight * factor);
    }

    // Build the dashboard from results
    function displayResults(data) {
        greeting.textContent = `Hello, ${data.name}. Here's your wellness snapshot:`;
        metricsContainer.innerHTML = '';

        // Helper to create a metric card
        function addCard(colorClass, label, value, unit = '') {
            const card = document.createElement('div');
            card.className = `metric-card ${colorClass}`;
            card.innerHTML = `
                <div class="label">${label}</div>
                <div class="value">${value}</div>
                ${unit ? `<div class="unit">${unit}</div>` : ''}
            `;
            metricsContainer.appendChild(card);
        }

        // Add cards with themed colors
        addCard('blue', 'BMI', data.bmi);
        addCard('yellow', 'Category', data.bmiCategory);
        addCard('orange', 'BMR', data.bmr, 'kcal/day');
        addCard('green', 'TDEE', data.tdee, 'kcal/day');
        addCard('blue', 'Ideal weight', data.idealWeight, 'kg');
        if (data.waistHipRatio) {
            addCard('yellow', 'Waist‑Hip Ratio', data.waistHipRatio);
        }
        if (data.bodyFatCategory) {
            addCard('orange', 'Body Fat', `${data.bodyFat}%`, data.bodyFatCategory);
        }
        addCard('green', 'Recommended', data.recommendedCal, 'kcal/day');
        addCard('blue', 'Protein', data.protein, 'grams/day');
    }

    // Perform calculation
    calcBtn.addEventListener('click', () => {
        const name = document.getElementById('username').value.trim();
        const age = parseInt(document.getElementById('age').value);
        const gender = document.getElementById('gender').value;
        const height = parseFloat(document.getElementById('height').value);
        const weight = parseFloat(document.getElementById('weight').value);
        const bodyfat = parseFloat(document.getElementById('bodyfat').value) || null;
        const waist = parseFloat(document.getElementById('waist').value) || null;
        const hip = parseFloat(document.getElementById('hip').value) || null;
        const diet = document.getElementById('diet').value;
        const activity = document.getElementById('activity').value;
        const goal = document.getElementById('goal').value;

        if (!name || !age || !gender || !height || !weight || !activity || !goal) {
            alert('Please fill all required fields (name, age, gender, height, weight, activity, goal).');
            return;
        }

        const bmi = calcBMI(weight, height);
        const bmiCategory = getBMICategory(bmi);
        const bmr = Math.round(calcBMR(weight, height, age, gender));
        const tdee = calcTDEE(bmr, activity);
        const idealWeight = calcIdealWeightRange(height, gender);
        const waistHipRatio = calcWaistHipRatio(waist, hip);
        const bodyFatCategory = bodyfat ? getBodyFatCategory(bodyfat, gender) : null;
        const recommendedCal = tdee + (goalAdjustments[goal] || 0);
        const protein = calcProtein(weight, goal);

        // Save to history
        const entry = {
            date: new Date().toLocaleString(),
            name,
            bmi,
            bmiCategory,
            bmr,
            tdee,
            recommended: recommendedCal
        };
        historyData.unshift(entry);
        if (historyData.length > 7) historyData.pop();
        saveHistory();

        // Display results
        displayResults({
            name,
            bmi,
            bmiCategory,
            bmr,
            tdee,
            idealWeight,
            waistHipRatio,
            bodyFat: bodyfat,
            bodyFatCategory,
            recommendedCal,
            protein,
            goal
        });

        formSection.classList.add('hidden');
        resultSection.classList.remove('hidden');
        updateHistoryUI();

        // Save user info for convenience
        saveUserInfo();
    });

    // New calculation
    newCalcBtn.addEventListener('click', () => {
        formSection.classList.remove('hidden');
        resultSection.classList.add('hidden');
    });

    // LocalStorage
    function saveUserInfo() {
        const fields = ['username', 'age', 'gender', 'height', 'weight', 'bodyfat', 'waist', 'hip', 'diet', 'activity', 'goal'];
        fields.forEach(id => {
            const el = document.getElementById(id);
            if (el) localStorage.setItem(`wellness_${id}`, el.value);
        });
    }

    function loadUserInfo() {
        const fields = ['username', 'age', 'gender', 'height', 'weight', 'bodyfat', 'waist', 'hip', 'diet', 'activity', 'goal'];
        fields.forEach(id => {
            const el = document.getElementById(id);
            const saved = localStorage.getItem(`wellness_${id}`);
            if (saved && el) el.value = saved;
        });
    }

    // Init
    loadHistory();
    loadUserInfo();
    updateHistoryUI();
});