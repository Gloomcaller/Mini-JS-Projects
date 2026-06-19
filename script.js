document.addEventListener('DOMContentLoaded', function () {
    // Set copyright year
    document.getElementById('year').textContent = new Date().getFullYear();

    let projects = [];
    let selectedCard = null; // Track currently selected card

    // DOM elements
    const projectGrid = document.getElementById('project-grid');
    const searchInput = document.getElementById('search-input');
    const projectCountSpan = document.getElementById('project-count');
    const previewImg = document.getElementById('project-preview-img');
    const descriptionEl = document.getElementById('project-description');
    const imagesContainer = document.getElementById('preview-images-container');
    const popup = document.getElementById('preview-popup');
    const popupImg = document.getElementById('popup-img');

    // Click preview image to open popup
    imagesContainer.addEventListener('click', (e) => {
        if (e.target.tagName === 'IMG') {
            popupImg.src = e.target.src;
            popup.classList.add('active');
        }
    });

    // Click overlay or press Escape to close
    popup.addEventListener('click', () => {
        popup.classList.remove('active');
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && popup.classList.contains('active')) {
            popup.classList.remove('active');
        }
    });


    // Show default temp images on load
    previewImg.style.display = 'none';
    imagesContainer.innerHTML = '';
    ['assets/preview/temp1.png', 'assets/preview/temp2.png'].forEach(src => {
        const img = document.createElement('img');
        img.src = src;
        img.alt = 'Project preview';
        imagesContainer.appendChild(img);
    });
    imagesContainer.style.display = 'flex';

    let currentProjects = [];

    // Update the live project count badge
    function updateProjectCount() {
        const count = currentProjects.length;
        projectCountSpan.textContent = `${count} project${count !== 1 ? 's' : ''}`;
    }

    // Filter projects by search term
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
        selectedCard = null;
        renderProjects();
        updateProjectCount();
    }

    // Show project in sidebar
    function showProject(project) {
        previewImg.style.display = 'none';
        imagesContainer.innerHTML = '';
        imagesContainer.style.display = 'flex';

        project.images.forEach(src => {
            const img = document.createElement('img');
            img.src = src;
            img.alt = `${project.name} Preview`;
            imagesContainer.appendChild(img);
        });

        descriptionEl.innerHTML = `<h3 style="margin-top: 0; color: var(--primary-color);">${project.name}</h3><p>${project.description}</p>`;
    }

    // Show default temps in sidebar
    function showDefault() {
        previewImg.style.display = 'none';
        imagesContainer.innerHTML = '';
        ['assets/preview/temp1.png', 'assets/preview/temp2.png'].forEach(src => {
            const img = document.createElement('img');
            img.src = src;
            img.alt = 'Project preview';
            imagesContainer.appendChild(img);
        });
        imagesContainer.style.display = 'flex';
        descriptionEl.innerHTML = `<p>Welcome to my interactive playground of <strong>mini web projects</strong>. This growing
            <strong>collection</strong> features small, fun, and practical <strong>web applications</strong>
            built with plain HTML, CSS, and vanilla JS. Each <strong>project</strong> is self-contained,
            open-source on <strong>GitHub</strong>, and runs directly in your browser.
            <strong>Select</strong> any project to <strong>see</strong> previews and
            <strong>details</strong>. These <strong>web projects</strong> are perfect for learning,
            practice, or entertainment — no frameworks, installations, or sign-ups required.</p>`;
    }

    // Render project cards into the grid
    function renderProjects() {
        projectGrid.innerHTML = '';

        currentProjects.forEach((project, index) => {
            const card = document.createElement('div');
            card.className = 'project-card';
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'button');
            card.setAttribute('aria-label', `Select ${project.name}`);
            card.innerHTML = `
                <div class="project-icon">
                    <img src="${project.icon}" alt="${project.name} icon" class="custom-icon">
                </div>
                <h3>${project.name}</h3>
            `;

            // Click: first selects, second opens
            card.addEventListener('click', () => {
                if (selectedCard === card) {
                    // Second click — open project
                    window.location.href = project.path;
                } else {
                    // First click — select this card
                    if (selectedCard) {
                        selectedCard.classList.remove('selected');
                    }
                    card.classList.add('selected');
                    selectedCard = card;
                    showProject(project);
                }
            });

            // Keyboard: Enter/Space to select, second press to open
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    if (selectedCard === card) {
                        window.location.href = project.path;
                    } else {
                        if (selectedCard) {
                            selectedCard.classList.remove('selected');
                        }
                        card.classList.add('selected');
                        selectedCard = card;
                        showProject(project);
                    }
                }
            });

            // Staggered animation
            card.style.animationDelay = `${index * 0.03}s`;

            projectGrid.appendChild(card);
        });

        // Empty state
        if (currentProjects.length === 0) {
            showDefault();
            descriptionEl.innerHTML = `<p>No projects found matching your search. Try a different keyword!</p>`;
        }
    }

    // Debounced search input
    let debounceTimeout;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
            filterProjects(e.target.value);
        }, 300);
    });

    // Keyboard shortcut: Ctrl/Cmd + K to focus search
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            searchInput.focus();
        }
    });

    // Load project data from JSON
    fetch('projects.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load projects.json (status: ${response.status})`);
            }
            return response.json();
        })
        .then(data => {
            projects = data;
            currentProjects = [...projects];
            renderProjects();
            updateProjectCount();
            previewImg.src = "assets/preview/temp1.png";
        })
        .catch(error => {
            console.error('Error loading projects:', error);
            projectGrid.innerHTML = '<p style="color: red;">Failed to load projects. Please try again later.</p>';
        });
});