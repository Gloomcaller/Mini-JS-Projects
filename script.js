document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('year').textContent = new Date().getFullYear();

    const projects = [
        {
            name: "Breakout",
            path: "Breakout/index.html",
            icon: "assets/icons/breakout.png",
            description: "A classic Breakout game where you control a paddle to bounce a ball and break bricks.",
            image: "assets/preview/temp.png"
        },
        {
            name: "Calculator",
            path: "Calculator/index.html",
            icon: "assets/icons/calculator.png",
            description: "A functional calculator that can perform basic arithmetic operations.",
            image: "assets/preview/temp.png"
        },
        {
            name: "Clock",
            path: "Clock/index.html",
            icon: "assets/icons/clock.png",
            description: "A digital and analog clock showing current time with smooth animations.",
            image: "assets/preview/temp.png"
        },
        {
            name: "Connect Four",
            path: "Connect Four/index.html",
            icon: "assets/icons/connect-four.png",
            description: "The classic Connect Four game where you try to line up four discs vertically, horizontally, or diagonally.",
            image: "assets/preview/temp.png"
        },
        {
            name: "Dice Duel",
            path: "Dice Duel/index.html",
            icon: "assets/icons/dice-duel.png",
            description: "Test your luck against your friend in a duel.",
            image: "assets/preview/temp.png"
        },
        {
            name: "Dice Roller",
            path: "Dice Roller/index.html",
            icon: "assets/icons/dice.png",
            description: "Roll virtual dice with animation and see random results, perfect for board games.",
            image: "assets/preview/temp.png"
        },
        {
            name: "Frogger",
            path: "Frogger/index.html",
            icon: "assets/icons/frogger.png",
            description: "A Frogger-style game where you guide a frog across a busy road and river.",
            image: "assets/preview/temp.png"
        },
        {
            name: "Memory",
            path: "Memory/index.html",
            icon: "assets/icons/memory.png",
            description: "A memory card game where you find matching pairs of cards.",
            image: "assets/preview/temp.png"
        },
        {
            name: "Rock Paper Scissors",
            path: "Rock Paper Scissors/index.html",
            icon: "assets/icons/rock-paper-scissors.png",
            description: "Play the classic Rock, Paper, Scissors game against a friend.",
            image: "assets/preview/temp.png"
        },
        {
            name: "Space Invaders",
            path: "Space Invaders/index.html",
            icon: "assets/icons/space-invaders.png",
            description: "A Space Invaders clone where you shoot moving aliens.",
            image: "assets/preview/temp.png"
        },
        {
            name: "Stopwatch",
            path: "Stopwatch/index.html",
            icon: "assets/icons/stopwatch.png",
            description: "A stopwatch with start, stop, and lap time functionality.",
            image: "assets/preview/temp.png"
        },
        {
            name: "Tarot Reader",
            path: "Tarot Reader/index.html",
            icon: "assets/icons/tarot.png",
            description: "Virtual Tarot Reading, do you wish to know your fate?",
            image: "assets/preview/temp.png"
        },
        {
            name: "Tic Tac Toe",
            path: "Tic Tac Toe/index.html",
            icon: "assets/icons/tic-tac-toe.png",
            description: "The classic Tic Tac Toe game where you play against a friend.",
            image: "assets/preview/temp.png"
        },
        {
            name: "Time Calculator",
            path: "Time Calculator/index.html",
            icon: "assets/icons/time-calculator.png",
            description: "A tool to add or subtract time from a given date and time.",
            image: "assets/preview/temp.png"
        },
        {
            name: "Truth or Dare",
            path: "Truth or Dare/index.html",
            icon: "assets/icons/truth-or-dare.png",
            description: "A digital version of the classic party game Truth or Dare.",
            image: "assets/preview/temp.png"
        },
        {
            name: "Wellness Calculator",
            path: "Wellness Calculator/index.html",
            icon: "assets/icons/wellness.png",
            description: "Simple and effective Wellness Calculator at your convenience.",
            image: "assets/preview/temp.png"
        },
        {
            name: "Whack a Mole",
            path: "Whack a Mole/index.html",
            icon: "assets/icons/whack-a-mole.png",
            description: "Test your reflexes by whacking moles as they pop up from holes.",
            image: "assets/preview/temp.png"
        }
    ];

    const projectGrid = document.querySelector('.project-grid');
    const previewImg = document.getElementById('project-preview-img');
    const descriptionEl = document.getElementById('project-description');

    projects.forEach(project => {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.innerHTML = `
        <div class="project-icon">
            <img src="${project.icon}" alt="${project.name} icon" class="custom-icon">
        </div>
        <h3>${project.name}</h3>`;

        card.addEventListener('click', () => {
            window.location.href = project.path;
        });

        card.addEventListener('mouseenter', () => {
            previewImg.src = project.image;
            previewImg.alt = `${project.name} Preview`;
            descriptionEl.innerHTML = `<h3>${project.name}</h3><p>${project.description}</p>`;
        });

        projectGrid.appendChild(card);
    });

    previewImg.src = "assets/preview/temp.png";
});