document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const adminDashboard = document.getElementById('admin-dashboard');
    const loginButton = document.getElementById('login-button');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const errorMsg = document.getElementById('error-msg');
    
    // Hardcoded owner accounts
    const ownerAccounts = [
        { user: 'Kazuma', pass: 'Kazuma' },
        { user: 'Owner', pass: 'Owner' }
    ];

    // Check if user is already logged in for this session
    if (sessionStorage.getItem('isAdminLoggedIn') === 'true') {
        showDashboard();
    }
    
    // --- Login Logic ---
    loginButton.addEventListener('click', () => {
        const username = usernameInput.value;
        const password = passwordInput.value;

        const isValid = ownerAccounts.some(acc => acc.user === username && acc.pass === password);

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
        supportedGames: [],
        credits: []
    };

    const scriptInput = document.getElementById('main-script');
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
        
        // Populate Script
        scriptInput.value = websiteData.script || '';

        // Populate Supported Games
        renderGamesForm();
        
        // Populate Credits
        renderCreditsForm();
    }

    function renderGamesForm() {
        gamesListContainer.innerHTML = '';
        websiteData.supportedGames.forEach((game, index) => {
            const gameCard = document.createElement('div');
            gameCard.className = 'item-card';
            gameCard.innerHTML = `
                <h4>Game #${index + 1}</h4>
                <div class="form-group">
                    <label>Name</label>
                    <input type="text" class="game-name" value="${game.name || ''}" data-index="${index}">
                </div>
                <div class="form-group">
                    <label>Image URL</label>
                    <input type="text" class="game-image" value="${game.image || ''}" data-index="${index}">
                </div>
                <div class="form-group">
                    <label>Game Redirection URL</label>
                    <input type="text" class="game-redirection" value="${game.redirection || ''}" data-index="${index}">
                </div>
                <div class="form-group">
                    <label>Status</label>
                    <select class="game-status" data-index="${index}">
                        <option value="working" ${game.status === 'working' ? 'selected' : ''}>Working</option>
                        <option value="not-working" ${game.status === 'not-working' ? 'selected' : ''}>Not Working</option>
                    </select>
                </div>
                 <button class="remove-game-button" data-index="${index}">Remove Game</button>
            `;
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
                <div class="form-group">
                    <label>Name</label>
                    <input type="text" class="credit-name" value="${credit.name || ''}" data-index="${index}">
                </div>
                <div class="form-group">
                    <label>Image URL</label>
                    <input type="text" class="credit-image" value="${credit.image || ''}" data-index="${index}">
                </div>
                <div class="form-group">
                    <label>Role</label>
                    <input type="text" class="credit-role" value="${credit.role || ''}" data-index="${index}">
                </div>
                <button class="remove-credit-button" data-index="${index}">Remove Credit</button>
            `;
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
    
    // Event delegation for remove buttons
    document.body.addEventListener('click', (e) => {
        if(e.target.classList.contains('remove-game-button')) {
            const index = parseInt(e.target.dataset.index, 10);
            websiteData.supportedGames.splice(index, 1);
            renderGamesForm();
        }
        if(e.target.classList.contains('remove-credit-button')) {
            const index = parseInt(e.target.dataset.index, 10);
            websiteData.credits.splice(index, 1);
            renderCreditsForm();
        }
    });

    saveAllButton.addEventListener('click', () => {
        // Save Script
        websiteData.script = scriptInput.value;

        // Save Supported Games
        document.querySelectorAll('.game-name').forEach(input => {
            websiteData.supportedGames[input.dataset.index].name = input.value;
        });
        document.querySelectorAll('.game-image').forEach(input => {
            websiteData.supportedGames[input.dataset.index].image = input.value;
        });
        document.querySelectorAll('.game-redirection').forEach(input => {
            websiteData.supportedGames[input.dataset.index].redirection = input.value;
        });
        document.querySelectorAll('.game-status').forEach(select => {
            websiteData.supportedGames[select.dataset.index].status = select.value;
        });

        // Save Credits
        document.querySelectorAll('.credit-name').forEach(input => {
            websiteData.credits[input.dataset.index].name = input.value;
        });
        document.querySelectorAll('.credit-image').forEach(input => {
            websiteData.credits[input.dataset.index].image = input.value;
        });
        document.querySelectorAll('.credit-role').forEach(input => {
            websiteData.credits[input.dataset.index].role = input.value;
        });

        // Save to Local Storage
        localStorage.setItem('nexusDevelopedData', JSON.stringify(websiteData));
        alert('All changes have been saved successfully!');
    });
});
