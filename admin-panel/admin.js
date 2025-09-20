document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const adminDashboard = document.getElementById('admin-dashboard');
    const loginButton = document.getElementById('login-button');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const errorMsg = document.getElementById('error-msg');
    
    const ownerAccounts = [
        { user: 'Kazuma', pass: 'Kazuma' },
        { user: 'Owner', pass: 'Owner' }
    ];

    if (sessionStorage.getItem('isAdminLoggedIn') === 'true') {
        showDashboard();
    }
    
    // --- Login Logic ---
    loginButton.addEventListener('click', () => {
        const username = usernameInput.value;
        const password = passwordInput.value;

        // Made username check case-insensitive. Password is still case-sensitive.
        const isValid = ownerAccounts.some(acc => 
            acc.user.toLowerCase() === username.toLowerCase() && acc.pass === password
        );

        if (isValid) {
            sessionStorage.setItem('isAdminLoggedIn', 'true');
            showDashboard();
        } else {
            errorMsg.classList.remove('hidden');
        }
    });

    function showDashboard() {
        loginForm.classList.add('hidden');
        adminDashboard.classList.remove('hidden');
        loadDataIntoForms();
    }

    // --- Data Management ---
    let websiteData = {
        script: '',
        enableHighlighting: true, // Default value
        supportedGames: [],
        credits: []
    };

    const scriptInput = document.getElementById('main-script');
    const highlightingCheckbox = document.getElementById('enable-highlighting');
    const gamesListContainer = document.getElementById('supported-games-list');
    const creditsListContainer = document.getElementById('credits-list');
    const addGameButton = document.getElementById('add-game-button');
    const addCreditButton = document.getElementById('add-credit-button');
    const saveAllButton = document.getElementById('save-all-button');

    function loadDataIntoForms() {
        const storedData = localStorage.getItem('nexusDevelopedData');
        if (storedData) {
            websiteData = JSON.parse(storedData);
        }
        
        scriptInput.value = websiteData.script || '';
        // Load highlighting setting, default to true if not set
        highlightingCheckbox.checked = websiteData.enableHighlighting !== false;

        renderGamesForm();
        renderCreditsForm();
    }

    function renderGamesForm() {
        gamesListContainer.innerHTML = '';
        websiteData.supportedGames.forEach((game, index) => {
            const gameCard = document.createElement('div');
            gameCard.className = 'item-card';
            gameCard.innerHTML = `
                <h4>Game #${index + 1}</h4>
                <div class="form-group"><label>Name</label><input type="text" class="game-name" value="${game.name || ''}" data-index="${index}"></div>
                <div class="form-group"><label>Image URL</label><input type="text" class="game-image" value="${game.image || ''}" data-index="${index}"></div>
                <div class="form-group"><label>Game Redirection URL</label><input type="text" class="game-redirection" value="${game.redirection || ''}" data-index="${index}"></div>
                <div class="form-group"><label>Status</label><select class="game-status" data-index="${index}"><option value="working" ${game.status === 'working' ? 'selected' : ''}>Working</option><option value="not-working" ${game.status === 'not-working' ? 'selected' : ''}>Not Working</option></select></div>
                <button class="remove-game-button" data-index="${index}">Remove Game</button>`;
            gamesListContainer.appendChild(gameCard);
        });
    }
    
    function renderCreditsForm() {
        creditsListContainer.innerHTML = '';
        websiteData.credits.forEach((credit, index) => {
            const creditCard = document.createElement('div');
            creditCard.className = 'item-card';
            creditCard.innerHTML = `
                <h4>Credit #${index + 1}</h4>
                <div class="form-group"><label>Name</label><input type="text" class="credit-name" value="${credit.name || ''}" data-index="${index}"></div>
                <div class="form-group"><label>Image URL</label><input type="text" class="credit-image" value="${credit.image || ''}" data-index="${index}"></div>
                <div class="form-group"><label>Role</label><input type="text" class="credit-role" value="${credit.role || ''}" data-index="${index}"></div>
                <button class="remove-credit-button" data-index="${index}">Remove Credit</button>`;
            creditsListContainer.appendChild(creditCard);
        });
    }

    addGameButton.addEventListener('click', () => {
        websiteData.supportedGames.push({ name: '', image: '', redirection: '', status: 'working' });
        renderGamesForm();
    });

    addCreditButton.addEventListener('click', () => {
        websiteData.credits.push({ name: '', image: '', role: '' });
        renderCreditsForm();
    });
    
    document.body.addEventListener('click', (e) => {
        if(e.target.classList.contains('remove-game-button')) {
            websiteData.supportedGames.splice(e.target.dataset.index, 1);
            renderGamesForm();
        }
        if(e.target.classList.contains('remove-credit-button')) {
            websiteData.credits.splice(e.target.dataset.index, 1);
            renderCreditsForm();
        }
    });

    saveAllButton.addEventListener('click', () => {
        // Save Script and highlighting setting
        websiteData.script = scriptInput.value;
        websiteData.enableHighlighting = highlightingCheckbox.checked;

        // Save Supported Games
        websiteData.supportedGames = Array.from(document.querySelectorAll('#supported-games-list .item-card')).map((card, index) => ({
            name: card.querySelector('.game-name').value,
            image: card.querySelector('.game-image').value,
            redirection: card.querySelector('.game-redirection').value,
            status: card.querySelector('.game-status').value,
        }));
        
        // Save Credits
        websiteData.credits = Array.from(document.querySelectorAll('#credits-list .item-card')).map((card, index) => ({
            name: card.querySelector('.credit-name').value,
            image: card.querySelector('.credit-image').value,
            role: card.querySelector('.credit-role').value,
        }));

        localStorage.setItem('nexusDevelopedData', JSON.stringify(websiteData));
        alert('All changes have been saved successfully!');
    });
});
