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
            name: "Finspan Scoreboard",
            path: "Finspan Scoreboard/index.html",
            icon: "assets/icons/finspan-scoreboard.png",
            description: "Convinient and simple scoreboard for Finspan.",
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

    const projectGrid = document.getElementById('project-grid');
    const searchInput = document.getElementById('search-input');
    const projectCountSpan = document.getElementById('project-count');
    const previewImg = document.getElementById('project-preview-img');
    const descriptionEl = document.getElementById('project-description');

    let currentProjects = [...projects];

    function updateProjectCount() {
        const count = currentProjects.length;
        projectCountSpan.textContent = `${count} project${count !== 1 ? 's' : ''}`;
    }

    function filterProjects(searchTerm) {
        const term = searchTerm.toLowerCase().trim();
        if (!term) {
            currentProjects = [...projects];
        } else {
            currentProjects = projects.filter(project =>
                project.name.toLowerCase().includes(term) ||
                project.description.toLowerCase().includes(term)
            );
        }
        renderProjects();
        updateProjectCount();
    }

    function renderProjects() {
        projectGrid.innerHTML = '';

        currentProjects.forEach((project, index) => {
            const card = document.createElement('div');
            card.className = 'project-card';
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'button');
            card.setAttribute('aria-label', `Open ${project.name}`);
            card.innerHTML = `
                <div class="project-icon">
                    <img src="${project.icon}" alt="${project.name} icon" class="custom-icon">
                </div>
                <h3>${project.name}</h3>
            `;

            card.addEventListener('click', () => {
                window.location.href = project.path;
            });

            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    window.location.href = project.path;
                }
            });

            card.addEventListener('mouseenter', () => {
                // Fade out
                previewImg.style.opacity = '0';
                descriptionEl.style.opacity = '0';

                setTimeout(() => {
                    previewImg.src = project.image;
                    previewImg.alt = `${project.name} Preview`;
                    descriptionEl.innerHTML = `<h3 style="margin-top: 0; color: var(--primary-color);">${project.name}</h3><p>${project.description}</p>`;

                    // Fade back in
                    previewImg.style.opacity = '1';
                    descriptionEl.style.opacity = '1';
                }, 200);
            });

            card.addEventListener('mouseleave', () => {
                // Fade out
                previewImg.style.opacity = '0';
                descriptionEl.style.opacity = '0';

                setTimeout(() => {
                    previewImg.src = "assets/preview/temp.png";
                    previewImg.alt = "Project preview";
                    descriptionEl.innerHTML = `<p>Welcome to my interactive playground of <strong>mini JavaScript projects</strong>. This growing
            <strong>collection</strong> features small, fun, and practical <strong>web applications</strong>
            built with plain HTML, CSS, and vanilla JS. Each <strong>project</strong> is self-contained,
            open-source on <strong>GitHub</strong>, and runs directly in your browser.
            <strong>Select</strong> any project to <strong>see</strong> previews and
            <strong>details</strong>. These <strong>JavaScript projects</strong> are perfect for learning,
            practice, or entertainment — no frameworks, installations, or sign-ups required.</p>`;

                    // Fade back in
                    previewImg.style.opacity = '1';
                    descriptionEl.style.opacity = '1';
                }, 200);
            });

            // Add animation delay for staggered effect
            card.style.animationDelay = `${index * 0.03}s`;

            projectGrid.appendChild(card);
        });

        // Reset preview if no projects are shown
        if (currentProjects.length === 0) {
            previewImg.src = "assets/preview/temp.png";
            descriptionEl.innerHTML = `<p>No projects found matching your search. Try a different keyword!</p>`;
        }
    }

    // Debounced search for better performance
    let debounceTimeout;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
            filterProjects(e.target.value);
        }, 300);
    });

    // Initial render
    renderProjects();
    updateProjectCount();

    // Set default preview
    previewImg.src = "assets/preview/temp.png";

    // Keyboard shortcut: Ctrl/Cmd + K to focus search
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            searchInput.focus();
        }
    });
});