document.addEventListener('DOMContentLoaded', () => {
    const burgerMenu = document.getElementById('burger-menu');
    const navMenu = document.getElementById('nav-menu');
    const appContent = document.getElementById('app-content');
    const navLinks = document.querySelectorAll('.nav-link');

    // --- Burger Menu Toggle ---
    burgerMenu.addEventListener('click', () => {
        burgerMenu.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // --- Navigation ---
    const routes = {
        '#home': renderHomePage,
        '#supported': renderSupportedPage,
        '#credits': renderCreditsPage
    };

    function navigate() {
        const hash = window.location.hash || '#home';
        const renderFunction = routes[hash] || renderHomePage;
        appContent.innerHTML = ''; // Clear previous content
        renderFunction();
    }

    // Close nav menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                burgerMenu.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    });

    window.addEventListener('hashchange', navigate);
    navigate(); // Initial page load

    // --- Data Loading ---
    function getWebsiteData() {
        const data = localStorage.getItem('nexusDevelopedData');
        return data ? JSON.parse(data) : {
            script: 'loadstring(game:HttpGet("https://example.com/script.lua"))()',
            supportedGames: [],
            credits: []
        };
    }

    // --- Page Rendering Functions ---
    function renderHomePage() {
        const data = getWebsiteData();
        const homePageHTML = `
            <div id="home-page" class="page">
                <div class="page-center">
                    <h2 class="page-title">Main Script</h2>
                </div>
                <div class="script-container">
                    <h2>Script</h2>
                    <pre><code>${data.script || 'No script set by admin.'}</code></pre>
                </div>
            </div>
        `;
        appContent.innerHTML = homePageHTML;
    }

    function renderSupportedPage() {
        const data = getWebsiteData();
        let cardsHTML = '';

        if (data.supportedGames && data.supportedGames.length > 0) {
            data.supportedGames.forEach(game => {
                cardsHTML += `
                    <div class="card">
                        <img src="${game.image || 'https://via.placeholder.com/300x180?text=No+Image'}" alt="${game.name}" class="card-image">
                        <div class="card-content">
                            <h3 class="card-title">${game.name || 'No Name'}</h3>
                            <p class="card-subtitle">${game.redirection ? 'Redirects to Game' : ''}</p>
                            <div class="card-status ${game.status === 'working' ? 'status-working' : 'status-not-working'}">
                                ${game.status === 'working' ? 'Working' : 'Not Working'}
                            </div>
                            <a href="${game.redirection || '#'}" target="_blank" class="card-button">Go to Game</a>
                        </div>
                    </div>
                `;
            });
        } else {
            cardsHTML = '<p>No supported games have been added yet.</p>';
        }

        const supportedPageHTML = `
            <div id="supported-page" class="page">
                <div class="page-center">
                    <h2 class="page-title">Supported Games</h2>
                </div>
                <div class="card-grid">
                    ${cardsHTML}
                </div>
            </div>
        `;
        appContent.innerHTML = supportedPageHTML;
    }

    function renderCreditsPage() {
        const data = getWebsiteData();
        let cardsHTML = '';

        if (data.credits && data.credits.length > 0) {
            data.credits.forEach(person => {
                cardsHTML += `
                    <div class="card">
                        <img src="${person.image || 'https://via.placeholder.com/300x180?text=No+Image'}" alt="${person.name}" class="card-image">
                        <div class="card-content">
                            <h3 class="card-title">${person.name || 'No Name'}</h3>
                            <p class="card-subtitle">${person.role || 'No Role'}</p>
                        </div>
                    </div>
                `;
            });
        } else {
            cardsHTML = '<p>No credits have been added yet.</p>';
        }

        const creditsPageHTML = `
            <div id="credits-page" class="page">
                <div class="page-center">
                    <h2 class="page-title">Credits</h2>
                </div>
                <div class="card-grid">
                    ${cardsHTML}
                </div>
            </div>
        `;
        appContent.innerHTML = creditsPageHTML;
    }
});
