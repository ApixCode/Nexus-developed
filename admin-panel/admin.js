document.addEventListener('DOMContentLoaded', () => {
    // --- Account & Data Setup ---
    const ROLES = { KAZUMA: 'Kazuma', OWNER: 'Owner', CO_OWNER: 'Co-Owner', DEV: 'Dev' };
    function initializeUsers() {
        if (!localStorage.getItem('nexusDevelopedUsers')) {
            const defaultUsers = [{ username: 'Kazuma', password: 'Kazuma', role: ROLES.KAZUMA }];
            localStorage.setItem('nexusDevelopedUsers', JSON.stringify(defaultUsers));
        }
    }
    initializeUsers();

    // --- Global State ---
    const appRoot = document.getElementById('app-root');
    const toast = document.getElementById('toast-notification');
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

    // --- Core Application Logic ---
    function render() {
        const user = sessionStorage.getItem('loggedInUser');
        if (user) {
            loggedInUser = JSON.parse(user);
            renderDashboard();
        } else {
            loggedInUser = null;
            renderLogin();
        }
    }

    function login(username, password) {
        showToast('Logging in...', 'info');
        setTimeout(() => {
            const users = JSON.parse(localStorage.getItem('nexusDevelopedUsers'));
            const user = users.find(u => u.username.toLowerCase() === username.toLowerCase() && u.password === password);
            if (user) {
                sessionStorage.setItem('loggedInUser', JSON.stringify(user));
                render(); // Re-render the app
            } else {
                showToast('Incorrect username or password.', 'error');
            }
        }, 500);
    }

    function logout() {
        sessionStorage.removeItem('loggedInUser');
        showToast('Logged out successfully.', 'info');
        render(); // Re-render the app
    }

    // --- HTML Template Rendering ---
    function renderLogin() {
        appRoot.innerHTML = `
            <div class="admin-container">
                <div id="login-section">
                    <h1 class="brand-title" style="text-align: center; font-size: 2.5rem; margin-bottom: 2rem;">Admin Login</h1>
                    <div class="admin-form">
                        <div class="form-group"><label for="username">Username</label><input type="text" id="username"></div>
                        <div class="form-group"><label for="password">Password</label><input type="password" id="password"></div>
                        <button id="login-button" class="btn">Login</button>
                    </div>
                </div>
            </div>`;
        document.getElementById('login-button').addEventListener('click', () => {
            const user = document.getElementById('username').value;
            const pass = document.getElementById('password').value;
            login(user, pass);
        });
    }

    function renderDashboard() {
        loadContentData();
        const canManageUsers = [ROLES.KAZUMA, ROLES.OWNER, ROLES.CO_OWNER].includes(loggedInUser.role);
        const isKazuma = loggedInUser.role === ROLES.KAZUMA;

        appRoot.innerHTML = `
            <div class="admin-container">
                <div class="dashboard-header">
                    <h1 class="brand-title" style="font-size: 2.5rem; margin-bottom: 0;">Admin Dashboard</h1>
                    <button id="logout-btn" class="btn">Logout</button>
                </div>

                <!-- User Management -->
                <div id="user-management-section" class="admin-section" style="display: ${canManageUsers ? 'block' : 'none'}">
                    <h2>User Management</h2><div id="user-list"></div>
                    <div class="item-card" style="margin-top: 2rem;">
                        <h4>Add New User</h4>
                        <div class="form-group"><label>New Username</label><input type="text" id="new-username"></div>
                        <div class="form-group"><label>New Password</label><input type="password" id="new-password"></div>
                        <div class="form-group"><label>Role</label><select id="new-user-role"></select></div>
                        <button id="add-user-btn" class="btn">Add User</button>
                        <p id="user-error-msg" class="error-msg" style="display: none;"></p>
                    </div>
                </div>

                <!-- Data Sync (Kazuma Only) -->
                <div id="data-sync-section" class="admin-section" style="display: ${isKazuma ? 'block' : 'none'}">
                    <h2>Data Sync (Kazuma Only)</h2>
                    <p style="color: var(--text-muted-color); margin-bottom: 1rem;">Use this to sync all website content AND user accounts with other admins.</p>
                    <div class="form-group">
                        <label>Data String</label>
                        <textarea id="data-io-field" style="height: 100px;"></textarea>
                    </div>
                    <div class="io-buttons">
                        <button id="export-data-btn" class="btn">1. Export All Data</button>
                        <button id="import-data-btn" class="btn">2. Import All Data</button>
                    </div>
                </div>

                <!-- Content Management -->
                <div id="content-management-section">
                    <div class="admin-section">
                        <h2>Home Page Script</h2>
                        <div class="form-group"><label for="main-script">Script</label><textarea id="main-script"></textarea></div>
                        <div class="form-group" style="flex-direction: row; align-items: center; gap: 10px;">
                            <input type="checkbox" id="enable-highlighting" style="width: auto;"><label for="enable-highlighting">Enable Syntax Highlighting</label>
                        </div>
                    </div>
                    <div class="admin-section"><h2>Supported Games</h2><div id="supported-games-list"></div><button id="add-game-btn" class="btn">+ Add Game</button></div>
                    <div class="admin-section"><h2>Credits Page</h2><div id="credits-list"></div><button id="add-credit-btn" class="btn">+ Add Credit</button></div>
                    <button id="save-all-btn" class="btn">Save All Content Changes</button>
                </div>
            </div>`;

        // Populate and attach listeners
        if (canManageUsers) renderUserList();
        renderContentForms();
        attachDashboardListeners();
    }

    // --- Helper Functions for Dashboard ---
    function loadContentData() {
        const storedData = localStorage.getItem('nexusDevelopedData');
        websiteData = storedData ? JSON.parse(storedData) : { script: '', enableHighlighting: true, supportedGames: [], credits: [] };
        if (!websiteData.supportedGames) websiteData.supportedGames = [];
        if (!websiteData.credits) websiteData.credits = [];
    }
    
    function renderUserList() { /* ... full function below ... */ }
    function renderContentForms() { /* ... full function below ... */ }

    function attachDashboardListeners() {
        document.getElementById('logout-btn').addEventListener('click', logout);
        if (loggedInUser.role === ROLES.KAZUMA) {
            document.getElementById('export-data-btn').addEventListener('click', exportData);
            document.getElementById('import-data-btn').addEventListener('click', importData);
        }
        if ([ROLES.KAZUMA, ROLES.OWNER, ROLES.CO_OWNER].includes(loggedInUser.role)) {
            document.getElementById('add-user-btn').addEventListener('click', addUser);
            document.getElementById('user-list').addEventListener('click', handleUserListClicks);
        }
        document.getElementById('add-game-btn').addEventListener('click', addGame);
        document.getElementById('add-credit-btn').addEventListener('click', addCredit);
        document.getElementById('supported-games-list').addEventListener('click', handleContentListClicks);
        document.getElementById('credits-list').addEventListener('click', handleContentListClicks);
        document.getElementById('save-all-btn').addEventListener('click', saveAllContent);
    }
    
    // --- Event Handler Functions ---
    function addUser() { /* ... full function below ... */ }
    function handleUserListClicks(e) { /* ... full function below ... */ }
    function addGame() { websiteData.supportedGames.push({}); renderContentForms(); }
    function addCredit() { websiteData.credits.push({}); renderContentForms(); }
    function handleContentListClicks(e) { /* ... full function below ... */ }
    function saveAllContent() { /* ... full function below ... */ }
    function exportData() { /* ... full function below ... */ }
    function importData() { /* ... full function below ... */ }

    // --- INITIAL RENDER ---
    render();

    // --- Full Function Definitions ---
    function renderUserList() {
        const userList = document.getElementById('user-list');
        const roleSelect = document.getElementById('new-user-role');
        const users = JSON.parse(localStorage.getItem('nexusDevelopedUsers'));
        userList.innerHTML = '<h4>Existing Users</h4>';
        users.forEach(user => {
            let deleteBtn = '';
            if (loggedInUser.role === ROLES.KAZUMA && loggedInUser.username !== user.username) { deleteBtn = `<button class="btn btn-delete btn-sm" data-username="${user.username}">Delete</button>`; }
            else if ([ROLES.OWNER, ROLES.CO_OWNER].includes(loggedInUser.role) && user.role === ROLES.DEV) { deleteBtn = `<button class="btn btn-delete btn-sm" data-username="${user.username}">Delete</button>`; }
            userList.innerHTML += `<div class="user-list-item"><span>${user.username} (<em>${user.role}</em>)</span> ${deleteBtn}</div>`;
        });
        roleSelect.innerHTML = '';
        if (loggedInUser.role === ROLES.KAZUMA) { [ROLES.OWNER, ROLES.CO_OWNER, ROLES.DEV].forEach(r => roleSelect.innerHTML += `<option value="${r}">${r}</option>`); }
        else if ([ROLES.OWNER, ROLES.CO_OWNER].includes(loggedInUser.role)) { roleSelect.innerHTML = `<option value="${ROLES.DEV}">${ROLES.DEV}</option>`; }
    }
    function renderContentForms() {
        document.getElementById('main-script').value = websiteData.script || '';
        document.getElementById('enable-highlighting').checked = websiteData.enableHighlighting !== false;
        const gamesContainer = document.getElementById('supported-games-list');
        gamesContainer.innerHTML = '';
        websiteData.supportedGames.forEach((game, index) => {
            gamesContainer.innerHTML += `<div class="item-card"><h4>Game #${index + 1}</h4><div class="form-group"><label>Name</label><input type="text" class="game-name" value="${game.name || ''}"></div><div class="form-group"><label>Image URL</label><input type="text" class="game-image" value="${game.image || ''}"></div><div class="form-group"><label>Game Redirection URL</label><input type="text" class="game-redirection" value="${game.redirection || ''}"></div><div class="form-group"><label>Status</label><select class="game-status"><option value="working" ${game.status === 'working' ? 'selected' : ''}>Working</option><option value="not-working" ${game.status === 'not-working' ? 'selected' : ''}>Not Working</option></select></div><button class="btn btn-delete remove-item-btn" data-type="game" data-index="${index}">Remove</button></div>`;
        });
        const creditsContainer = document.getElementById('credits-list');
        creditsContainer.innerHTML = '';
        websiteData.credits.forEach((credit, index) => {
            creditsContainer.innerHTML += `<div class="item-card"><h4>Credit #${index + 1}</h4><div class="form-group"><label>Name</label><input type="text" class="credit-name" value="${credit.name || ''}"></div><div class="form-group"><label>Image URL</label><input type="text" class="credit-image" value="${credit.image || ''}"></div><div class="form-group"><label>Role</label><input type="text" class="credit-role" value="${credit.role || ''}"></div><button class="btn btn-delete remove-item-btn" data-type="credit" data-index="${index}">Remove</button></div>`;
        });
    }
    function addUser() {
        const newUsername = document.getElementById('new-username').value, newPassword = document.getElementById('new-password').value, newRole = document.getElementById('new-user-role').value;
        const userError = document.getElementById('user-error-msg');
        if (!newUsername || !newPassword || !newRole) { userError.textContent = 'All fields are required.'; userError.style.display = 'block'; return; }
        let users = JSON.parse(localStorage.getItem('nexusDevelopedUsers'));
        if (users.some(u => u.username.toLowerCase() === newUsername.toLowerCase())) { userError.textContent = 'Username already exists.'; userError.style.display = 'block'; return; }
        users.push({ username: newUsername, password: newPassword, role: newRole });
        localStorage.setItem('nexusDevelopedUsers', JSON.stringify(users));
        document.getElementById('new-username').value = ''; document.getElementById('new-password').value = '';
        userError.style.display = 'none'; renderUserList();
    }
    function handleUserListClicks(e) {
        if (e.target.classList.contains('btn-delete')) {
            const usernameToDelete = e.target.dataset.username;
            if (confirm(`Are you sure you want to delete user: ${usernameToDelete}?`)) {
                let users = JSON.parse(localStorage.getItem('nexusDevelopedUsers'));
                users = users.filter(u => u.username !== usernameToDelete);
                localStorage.setItem('nexusDevelopedUsers', JSON.stringify(users));
                renderUserList();
            }
        }
    }
    function handleContentListClicks(e) {
        if (e.target.classList.contains('remove-item-btn')) {
            const type = e.target.dataset.type, index = e.target.dataset.index;
            if (type === 'game') { websiteData.supportedGames.splice(index, 1); }
            else if (type === 'credit') { websiteData.credits.splice(index, 1); }
            renderContentForms();
        }
    }
    function saveAllContent() {
        websiteData.script = document.getElementById('main-script').value;
        websiteData.enableHighlighting = document.getElementById('enable-highlighting').checked;
        websiteData.supportedGames = Array.from(document.querySelectorAll('#supported-games-list .item-card')).map(card => ({ name: card.querySelector('.game-name').value, image: card.querySelector('.game-image').value, redirection: card.querySelector('.game-redirection').value, status: card.querySelector('.game-status').value }));
        websiteData.credits = Array.from(document.querySelectorAll('#credits-list .item-card')).map(card => ({ name: card.querySelector('.credit-name').value, image: card.querySelector('.credit-image').value, role: card.querySelector('.credit-role').value }));
        localStorage.setItem('nexusDevelopedData', JSON.stringify(websiteData));
        showToast('Content saved successfully!', 'success');
    }
    function exportData() {
        const allData = {
            contentData: JSON.parse(localStorage.getItem('nexusDevelopedData') || '{}'),
            userData: JSON.parse(localStorage.getItem('nexusDevelopedUsers') || '[]')
        };
        document.getElementById('data-io-field').value = JSON.stringify(allData, null, 2);
        showToast('Data copied to text box. You can now copy it.', 'info');
    }
    function importData() {
        const dataString = document.getElementById('data-io-field').value;
        if (!dataString) {
            showToast('Paste data into the text box before importing.', 'error');
            return;
        }
        if (confirm("WARNING: This will overwrite ALL current content and user accounts. Are you sure?")) {
            try {
                const importedData = JSON.parse(dataString);
                if (importedData.contentData && importedData.userData) {
                    localStorage.setItem('nexusDevelopedData', JSON.stringify(importedData.contentData));
                    localStorage.setItem('nexusDevelopedUsers', JSON.stringify(importedData.userData));
                    showToast('Data imported successfully! Page will now reload.', 'success');
                    setTimeout(() => window.location.reload(), 1500);
                } else {
                    showToast('Import failed: Invalid data format.', 'error');
                }
            } catch (error) {
                showToast('Import failed: Could not parse data.', 'error');
            }
        }
    }
});
