document.addEventListener('DOMContentLoaded', () => {
    // --- Account Management Setup ---
    const ROLES = { KAZUMA: 'Kazuma', OWNER: 'Owner', CO_OWNER: 'Co-Owner', DEV: 'Dev' };
    function initializeUsers() {
        if (!localStorage.getItem('nexusDevelopedUsers')) {
            const defaultUsers = [{ username: 'Kazuma', password: 'Kazuma', role: ROLES.KAZUMA }];
            localStorage.setItem('nexusDevelopedUsers', JSON.stringify(defaultUsers));
        }
    }
    initializeUsers();

    // --- DOM Elements ---
    const loginSection = document.getElementById('login-section');
    const dashboardSection = document.getElementById('dashboard-section');
    const loginButton = document.getElementById('login-button');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const passwordToggle = document.getElementById('password-toggle-icon');
    const userManagementSection = document.getElementById('user-management-section');
    const contentManagementSection = document.getElementById('content-management-section');
    const toast = document.getElementById('toast-notification');
    const scriptInput = document.getElementById('main-script');
    const highlightingCheckbox = document.getElementById('enable-highlighting');
    const gamesListContainer = document.getElementById('supported-games-list');
    const creditsListContainer = document.getElementById('credits-list');
    
    let loggedInUser = null;
    let websiteData = {};

    // --- Toast Notification Logic ---
    let toastTimeout;
    function showToast(message, type = 'success') {
        clearTimeout(toastTimeout);
        toast.textContent = message;
        toast.className = 'toast show';
        toast.classList.add(type);
        toastTimeout = setTimeout(() => { toast.classList.remove('show'); }, 3000);
    }

    // --- Login & Visibility Control ---
    function showDashboard() {
        loginSection.style.display = 'none';
        dashboardSection.style.display = 'block';
        renderUserManagement();
        renderContentManagement();
        loadContentDataIntoForms();
    }

    function showLogin() {
        loginSection.style.display = 'block';
        dashboardSection.style.display = 'none';
    }
    
    // --- ALL FUNCTION DEFINITIONS (COMPLETE AND UNABRIDGED) ---

    function renderUserManagement() {
        const role = loggedInUser.role;
        const canManageUsers = [ROLES.KAZUMA, ROLES.OWNER, ROLES.CO_OWNER].includes(role);
        userManagementSection.style.display = canManageUsers ? 'block' : 'none';
        if (!canManageUsers) return;

        const userList = document.getElementById('user-list');
        const roleSelect = document.getElementById('new-user-role');
        const users = JSON.parse(localStorage.getItem('nexusDevelopedUsers'));
        userList.innerHTML = '<h4>Existing Users</h4>';
        users.forEach(user => {
            let deleteBtn = '';
            if (role === ROLES.KAZUMA && loggedInUser.username !== user.username) { deleteBtn = `<button class="btn btn-delete btn-sm" data-username="${user.username}">Delete</button>`; }
            else if ([ROLES.OWNER, ROLES.CO_OWNER].includes(role) && user.role === ROLES.DEV) { deleteBtn = `<button class="btn btn-delete btn-sm" data-username="${user.username}">Delete</button>`; }
            userList.innerHTML += `<div class="user-list-item"><span>${user.username} (<em>${user.role}</em>)</span> ${deleteBtn}</div>`;
        });

        roleSelect.innerHTML = '';
        if (role === ROLES.KAZUMA) { [ROLES.OWNER, ROLES.CO_OWNER, ROLES.DEV].forEach(r => roleSelect.innerHTML += `<option value="${r}">${r}</option>`); }
        else if ([ROLES.OWNER, ROLES.CO_OWNER].includes(role)) { roleSelect.innerHTML = `<option value="${ROLES.DEV}">${ROLES.DEV}</option>`; }
    }

    function renderContentManagement() {
        const role = loggedInUser.role;
        const canManageContent = [ROLES.KAZUMA, ROLES.OWNER, ROLES.CO_OWNER, ROLES.DEV].includes(role);
        contentManagementSection.style.display = canManageContent ? 'block' : 'none';
    }

    function loadContentDataIntoForms() {
        const storedData = localStorage.getItem('nexusDevelopedData');
        const parsedData = storedData ? JSON.parse(storedData) : { script: '', enableHighlighting: true, supportedGames: [], credits: [] };
        Object.assign(websiteData, parsedData);
        if (!websiteData.supportedGames) websiteData.supportedGames = [];
        if (!websiteData.credits) websiteData.credits = [];
        scriptInput.value = websiteData.script || '';
        highlightingCheckbox.checked = websiteData.enableHighlighting !== false;
        renderGamesForm();
        renderCreditsForm();
    }

    function renderGamesForm() {
        gamesListContainer.innerHTML = '';
        websiteData.supportedGames.forEach((game, index) => {
            const gameCard = document.createElement('div');
            gameCard.className = 'item-card';
            gameCard.innerHTML = `<h4>Game #${index + 1}</h4><div class="form-group"><label>Name</label><input type="text" class="game-name" value="${game.name || ''}"></div><div class="form-group"><label>Image URL</label><input type="text" class="game-image" value="${game.image || ''}"></div><div class="form-group"><label>Game Redirection URL</label><input type="text" class="game-redirection" value="${game.redirection || ''}"></div><div class="form-group"><label>Status</label><select class="game-status"><option value="working" ${game.status === 'working' ? 'selected' : ''}>Working</option><option value="not-working" ${game.status === 'not-working' ? 'selected' : ''}>Not Working</option></select></div><button class="btn btn-delete remove-item-btn" data-type="game" data-index="${index}">Remove Game</button>`;
            gamesListContainer.appendChild(gameCard);
        });
    }

    function renderCreditsForm() {
        creditsListContainer.innerHTML = '';
        websiteData.credits.forEach((credit, index) => {
            const creditCard = document.createElement('div');
            creditCard.className = 'item-card';
            creditCard.innerHTML = `<h4>Credit #${index + 1}</h4><div class="form-group"><label>Name</label><input type="text" class="credit-name" value="${credit.name || ''}"></div><div class="form-group"><label>Image URL</label><input type="text" class="credit-image" value="${credit.image || ''}"></div><div class="form-group"><label>Role</label><input type="text" class="credit-role" value="${credit.role || ''}"></div><button class="btn btn-delete remove-item-btn" data-type="credit" data-index="${index}">Remove Credit</button>`;
            creditsListContainer.appendChild(creditCard);
        });
    }

    // --- INITIALIZATION AND EVENT LISTENERS ---

    // Initial check: Are we already logged in?
    try {
        const storedUser = sessionStorage.getItem('loggedInUser');
        if (storedUser) {
            loggedInUser = JSON.parse(storedUser);
            showDashboard();
        } else {
            showLogin();
        }
    } catch (error) {
        console.error("Failed to parse session storage user:", error);
        sessionStorage.removeItem('loggedInUser');
        showLogin();
    }
    
    // Attach Password Toggle Event Listener
    passwordToggle.addEventListener('click', () => {
        const isPassword = passwordInput.type === 'password';
        passwordInput.type = isPassword ? 'text' : 'password';
        passwordToggle.textContent = isPassword ? '🙈' : '👁️';
    });

    // Attach Login Button Event Listener
    loginButton.addEventListener('click', () => {
        showToast('Logging in...', 'info');
        setTimeout(() => {
            const users = JSON.parse(localStorage.getItem('nexusDevelopedUsers'));
            const user = users.find(u => u.username.toLowerCase() === usernameInput.value.toLowerCase() && u.password === passwordInput.value);
            if (user) {
                loggedInUser = user;
                sessionStorage.setItem('loggedInUser', JSON.stringify(user));
                showDashboard();
            } else {
                showToast('Incorrect username or password.', 'error');
            }
        }, 500);
    });

    // Attach User Management Event Listeners
    document.getElementById('add-user-btn').addEventListener('click', () => {
        const newUsername = document.getElementById('new-username').value, newPassword = document.getElementById('new-password').value, newRole = document.getElementById('new-user-role').value;
        const userError = document.getElementById('user-error-msg');
        if (!newUsername || !newPassword || !newRole) { userError.textContent = 'All fields are required.'; userError.style.display = 'block'; return; }
        let users = JSON.parse(localStorage.getItem('nexusDevelopedUsers'));
        if (users.some(u => u.username.toLowerCase() === newUsername.toLowerCase())) { userError.textContent = 'Username already exists.'; userError.style.display = 'block'; return; }
        users.push({ username: newUsername, password: newPassword, role: newRole });
        localStorage.setItem('nexusDevelopedUsers', JSON.stringify(users));
        document.getElementById('new-username').value = ''; document.getElementById('new-password').value = '';
        userError.style.display = 'none'; renderUserManagement();
    });
    document.getElementById('user-list').addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-delete')) {
            const usernameToDelete = e.target.dataset.username;
            if (confirm(`Are you sure you want to delete user: ${usernameToDelete}?`)) {
                let users = JSON.parse(localStorage.getItem('nexusDevelopedUsers'));
                users = users.filter(u => u.username !== usernameToDelete);
                localStorage.setItem('nexusDevelopedUsers', JSON.stringify(users));
                renderUserManagement();
            }
        }
    });

    // Attach Content Management Event Listeners
    document.getElementById('add-game-btn').addEventListener('click', () => { websiteData.supportedGames.push({ name: '', image: '', redirection: '', status: 'working' }); renderGamesForm(); });
    document.getElementById('add-credit-btn').addEventListener('click', () => { websiteData.credits.push({ name: '', image: '', role: '' }); renderCreditsForm(); });
    dashboardSection.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-item-btn')) {
            const type = e.target.dataset.type, index = e.target.dataset.index;
            if (type === 'game') { websiteData.supportedGames.splice(index, 1); renderGamesForm(); }
            else if (type === 'credit') { websiteData.credits.splice(index, 1); renderCreditsForm(); }
        }
    });
    document.getElementById('save-all-btn').addEventListener('click', () => {
        websiteData.script = scriptInput.value;
        websiteData.enableHighlighting = highlightingCheckbox.checked;
        websiteData.supportedGames = Array.from(document.querySelectorAll('#supported-games-list .item-card')).map(card => ({ name: card.querySelector('.game-name').value, image: card.querySelector('.game-image').value, redirection: card.querySelector('.game-redirection').value, status: card.querySelector('.game-status').value }));
        websiteData.credits = Array.from(document.querySelectorAll('#credits-list .item-card')).map(card => ({ name: card.querySelector('.credit-name').value, image: card.querySelector('.credit-image').value, role: card.querySelector('.credit-role').value }));
        localStorage.setItem('nexusDevelopedData', JSON.stringify(websiteData));
        showToast('Content saved successfully!', 'success');
    });
});
