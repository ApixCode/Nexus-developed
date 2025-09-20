document.addEventListener('DOMContentLoaded', () => {
    const burgerMenu = document.getElementById('burger-menu');
    const navLinks = document.getElementById('nav-links');
    const allPages = document.querySelectorAll('.page');
    const allNavLinks = document.querySelectorAll('.nav-link');

    // --- Burger Menu Toggle ---
    burgerMenu.addEventListener('click', () => {
        burgerMenu.classList.toggle('toggle');
        navLinks.classList.toggle('active');
    });

    // --- Navigation Logic ---
    function navigateTo(hash) {
        // Hide all pages
        allPages.forEach(page => page.classList.remove('active'));
        // Show the target page
        const targetPage = document.querySelector(hash);
        if (targetPage) {
            targetPage.classList.add('active');
        }

        // Update active state on nav links
        allNavLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === hash) {
                link.classList.add('active');
            }
        });

        // Close mobile menu after navigation
        if (burgerMenu.classList.contains('toggle')) {
            burgerMenu.classList.remove('toggle');
            navLinks.classList.remove('active');
        }
    }

    // Handle clicks on nav links
    allNavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetHash = link.getAttribute('href');
            window.location.hash = targetHash;
        });
    });
    
    // Listen for hash changes to navigate
    window.addEventListener('hashchange', () => {
        const hash = window.location.hash || '#home';
        navigateTo(hash);
    });
    
    // Initial page load
    const initialHash = window.location.hash || '#home';
    navigateTo(initialHash);


    // --- Data Loading and Rendering ---
    function getWebsiteData() {
        const data = localStorage.getItem('nexusDevelopedData');
        return data ? JSON.parse(data) : {
            script: 'loadstring(game:HttpGet("https://example.com/script.lua"))()',
            enableHighlighting: true,
            supportedGames: [],
            credits: []
        };
    }

    function renderAllContent() {
        const data = getWebsiteData();
        renderHomePage(data);
        renderSupportedPage(data);
        renderCreditsPage(data);
    }

    // --- Render Functions ---
    function renderHomePage(data) {
        const container = document.getElementById('script-container-content');
        if (!container) return;

        const preClass = data.enableHighlighting ? 'class="language-lua"' : '';
        const codeClass = data.enableHighlighting ? 'class="language-lua"' : '';

        container.innerHTML = `
            <button class="btn btn-copy" id="copy-btn">Copy</button>
            <pre ${preClass}><code id="script-content" ${codeClass}>${data.script || ''}</code></pre>
        `;

        if (data.enableHighlighting && window.Prism) {
            Prism.highlightAll();
        }

        // Add copy functionality
        const copyBtn = document.getElementById('copy-btn');
        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(data.script).then(() => {
                copyBtn.textContent = 'Copied!';
                copyBtn.classList.add('copied');
                setTimeout(() => {
                    copyBtn.textContent = 'Copy';
                    copyBtn.classList.remove('copied');
                }, 2000);
            });
        });
    }

    function renderSupportedPage(data) {
        const grid = document.getElementById('supported-games-grid');
        if (!grid) return;
        grid.innerHTML = '';
        if (data.supportedGames && data.supportedGames.length > 0) {
            data.supportedGames.forEach(game => {
                const statusClass = game.status === 'working' ? 'status-working' : 'status-not-working';
                const statusText = game.status === 'working' ? 'Working' : 'Not Working';
                grid.innerHTML += `
                    <div class="game-card">
                        <img src="${game.image || 'https://via.placeholder.com/300x180?text=No+Image'}" alt="${game.name}" class="game-card-img">
                        <div class="game-card-content">
                            <h3>${game.name || 'No Name'}</h3>
                            <div class="game-card-status ${statusClass}">${statusText}</div>
                            <a href="${game.redirection || '#'}" target="_blank" class="btn">Go to Game</a>
                        </div>
                    </div>`;
            });
        } else {
            grid.innerHTML = '<p>No supported games have been added yet.</p>';
        }
    }

    function renderCreditsPage(data) {
        const grid = document.getElementById('credits-grid');
        if (!grid) return;
        grid.innerHTML = '';
        if (data.credits && data.credits.length > 0) {
            data.credits.forEach(person => {
                grid.innerHTML += `
                    <div class="credit-card">
                        <img src="${person.image || 'https://via.placeholder.com/120?text=Avatar'}" alt="${person.name}">
                        <h3>${person.name || 'No Name'}</h3>
                        <p>${person.role || 'No Role'}</p>
                    </div>`;
            });
        } else {
            grid.innerHTML = '<p>No credits have been added yet.</p>';
        }
    }

    // Load all content on start
    renderAllContent();
});
