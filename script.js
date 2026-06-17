document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('year').textContent = new Date().getFullYear();

    let projects = [];

    const projectGrid = document.getElementById('project-grid');
    const searchInput = document.getElementById('search-input');
    const projectCountSpan = document.getElementById('project-count');
    const previewImg = document.getElementById('project-preview-img');
    const descriptionEl = document.getElementById('project-description');

    let currentProjects = [];

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
                previewImg.style.opacity = '0';
                descriptionEl.style.opacity = '0';
                const imagesContainer = document.getElementById('preview-images-container');
                imagesContainer.style.opacity = '0';

                setTimeout(() => {
                    // Hide single image, show multi-image container
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

                    previewImg.style.opacity = '1';
                    descriptionEl.style.opacity = '1';
                    imagesContainer.style.opacity = '1';
                }, 200);
            });

            card.addEventListener('mouseleave', () => {
                previewImg.style.opacity = '0';
                descriptionEl.style.opacity = '0';
                const imagesContainer = document.getElementById('preview-images-container');
                imagesContainer.style.opacity = '0';

                setTimeout(() => {
                    imagesContainer.style.display = 'none';
                    imagesContainer.innerHTML = '';
                    previewImg.style.display = 'block';
                    previewImg.src = "assets/preview/temp.png";
                    previewImg.alt = "Project preview";
                    descriptionEl.innerHTML = `<p>Welcome to my interactive playground of <strong>mini JavaScript projects</strong>. This growing
            <strong>collection</strong> features small, fun, and practical <strong>web applications</strong>
            built with plain HTML, CSS, and vanilla JS. Each <strong>project</strong> is self-contained,
            open-source on <strong>GitHub</strong>, and runs directly in your browser.
            <strong>Select</strong> any project to <strong>see</strong> previews and
            <strong>details</strong>. These <strong>JavaScript projects</strong> are perfect for learning,
            practice, or entertainment — no frameworks, installations, or sign-ups required.</p>`;

                    previewImg.style.opacity = '1';
                    descriptionEl.style.opacity = '1';
                }, 200);
            });

            card.style.animationDelay = `${index * 0.03}s`;

            projectGrid.appendChild(card);
        });

        if (currentProjects.length === 0) {
            previewImg.src = "assets/preview/temp.png";
            descriptionEl.innerHTML = `<p>No projects found matching your search. Try a different keyword!</p>`;
        }
    }

    // Debounced search
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

    // Fetch projects from JSON, then initialize
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
            previewImg.src = "assets/preview/temp.png";
        })
        .catch(error => {
            console.error('Error loading projects:', error);
            projectGrid.innerHTML = '<p style="color: red;">Failed to load projects. Please try again later.</p>';
        });
});