// This script manages the entire admin panel functionality.

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const loginContainer = document.getElementById('login-container');
    const dashboardContainer = document.getElementById('dashboard-container');
    const loginForm = document.getElementById('login-form');
    const loginError = document.getElementById('login-error');
    const logoutBtn = document.getElementById('logout-btn');
    const saveAllBtn = document.getElementById('save-all-btn');
    
    const scriptInput = document.getElementById('script-input');
    const gamesListContainer = document.getElementById('games-list');
    const creditsListContainer = document.getElementById('credits-list');
    const adminsListContainer = document.getElementById('admins-list');
    const manageAdminsSection = document.getElementById('manage-admins-section');

    const modalBackdrop = document.getElementById('modal-backdrop');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');

    // --- State Management ---
    let siteData = {};
    let admins = [];
    let loggedInUser = null;

    // --- Data Initialization ---
    // Loads data from localStorage or sets defaults.
    function initializeData() {
        // Site Content Data
        const storedSiteData = localStorage.getItem('nexusSiteData');
        if (storedSiteData) {
            siteData = JSON.parse(storedSiteData);
        } else {
            // Default data for the admin panel if it's the first time running
            siteData = { 
                script: `loadstring(game:HttpGet("https://cdn.authguard.org/virtual-file/794429cf18d6472f9d1186fc4f7e0fb0"))()`, 
                games: [], 
                credits: [] 
            };
        }

        // Admin Accounts Data
        const storedAdmins = localStorage.getItem('nexusAdmins');
        if (storedAdmins) {
            admins = JSON.parse(storedAdmins);
        } else {
            // Default super-admin accounts
            admins = [
                { user: 'Kazuma', pass: 'Kazuma', isSuperAdmin: true },
                { user: 'Owner', pass: 'Owner', isSuperAdmin: true }
            ];
            localStorage.setItem('nexusAdmins', JSON.stringify(admins));
        }
    }

    // --- Authentication ---
    function checkLogin() {
        const user = sessionStorage.getItem('nexusLoggedInUser');
        if (user) {
            loggedInUser = JSON.parse(user);
            showDashboard();
        } else {
            showLogin();
        }
    }

    function handleLogin(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        const foundAdmin = admins.find(admin => admin.user === username && admin.pass === password);

        if (foundAdmin) {
            loggedInUser = foundAdmin;
            sessionStorage.setItem('nexusLoggedInUser', JSON.stringify(loggedInUser));
            showDashboard();
        } else {
            loginError.textContent = 'Invalid username or password.';
        }
    }

    function handleLogout() {
        loggedInUser = null;
        sessionStorage.removeItem('nexusLoggedInUser');
        showLogin();
    }

    function showLogin() {
        loginContainer.style.display = 'flex';
        dashboardContainer.style.display = 'none';
    }

    function showDashboard() {
        loginContainer.style.display = 'none';
        dashboardContainer.style.display = 'block';
        document.getElementById('admin-username').textContent = loggedInUser.user;

        if (loggedInUser.isSuperAdmin) {
            manageAdminsSection.style.display = 'block';
        } else {
            manageAdminsSection.style.display = 'none';
        }
        renderAll();
    }
    
    // --- Rendering Functions ---
    function renderAll() {
        scriptInput.value = siteData.script;
        renderList('games', siteData.games, gamesListContainer);
        renderList('credits', siteData.credits, creditsListContainer);
        if (loggedInUser.isSuperAdmin) {
            renderList('admins', admins, adminsListContainer);
        }
    }

    function renderList(type, items, container) {
        container.innerHTML = '';
        items.forEach((item, index) => {
            let infoHtml = '';
            if (type === 'games') {
                infoHtml = `<strong>${item.name}</strong><small>${item.url}</small>`;
            } else if (type === 'credits') {
                infoHtml = `<strong>${item.name}</strong><small>${item.role}</small>`;
            } else if (type === 'admins') {
                infoHtml = `<strong>${item.user}</strong><small>${item.isSuperAdmin ? 'Super Admin' : 'Admin'}</small>`;
            }

            const itemEl = document.createElement('div');
            itemEl.className = 'list-item';
            itemEl.innerHTML = `
                <div class="list-item-info">${infoHtml}</div>
                <div class="list-item-actions">
                    <button class="btn btn-edit">Edit</button>
                    <button class="btn btn-delete">Delete</button>
                </div>
            `;
            
            itemEl.querySelector('.btn-edit').addEventListener('click', () => openModal(type, item, index));
            itemEl.querySelector('.btn-delete').addEventListener('click', () => deleteItem(type, index));

            // Prevent super-admins from deleting themselves
            if (type === 'admins' && item.user === loggedInUser.user) {
                itemEl.querySelector('.btn-delete').disabled = true;
                itemEl.querySelector('.btn-delete').style.opacity = 0.5;
            }

            container.appendChild(itemEl);
        });
    }

    // --- Modal and Form Handling ---
    function openModal(type, item = null, index = -1) {
        const isNew = item === null;
        modalTitle.textContent = `${isNew ? 'Add' : 'Edit'} ${type.slice(0, -1)}`;
        
        let formHtml = '';
        if (type === 'games') {
            formHtml = `
                <div class="input-group"><label>Game Name</label><input id="modal-name" value="${item?.name || ''}"></div>
                <div class="input-group"><label>Game URL</label><input id="modal-url" value="${item?.url || ''}"></div>
                <div class="input-group"><label>Image URL</label><input id="modal-img" value="${item?.img || ''}"></div>
            `;
        } else if (type === 'credits') {
            formHtml = `
                <div class="input-group"><label>Name</label><input id="modal-name" value="${item?.name || ''}"></div>
                <div class="input-group"><label>Role</label><input id="modal-role" value="${item?.role || ''}"></div>
                <div class="input-group"><label>Image URL</label><input id="modal-img" value="${item?.img || ''}"></div>
            `;
        } else if (type === 'admins') {
            formHtml = `
                <div class="input-group"><label>Username</label><input id="modal-user" value="${item?.user || ''}"></div>
                <div class="input-group"><label>Password</label><input id="modal-pass" value="${item?.pass || ''}"></div>
                <div class="input-group" style="display:flex; align-items:center;">
                    <input type="checkbox" id="modal-super" ${item?.isSuperAdmin ? 'checked' : ''} style="width:auto; margin-right:10px;">
                    <label>Is Super Admin?</label>
                </div>
            `;
        }
        
        modalBody.innerHTML = `
            ${formHtml}
            <div id="modal-actions">
                <button id="modal-cancel-btn" class="btn btn-secondary">Cancel</button>
                <button id="modal-save-btn" class="btn">Save</button>
            </div>
        `;
        
        modalBackdrop.style.display = 'flex';
        
        document.getElementById('modal-cancel-btn').addEventListener('click', closeModal);
        document.getElementById('modal-save-btn').addEventListener('click', () => saveModal(type, index));
    }

    function closeModal() {
        modalBackdrop.style.display = 'none';
    }

    function saveModal(type, index) {
        let newItem;
        if (type === 'games') {
            newItem = {
                name: document.getElementById('modal-name').value,
                url: document.getElementById('modal-url').value,
                img: document.getElementById('modal-img').value
            };
            updateOrAddItem(siteData.games, newItem, index);
        } else if (type === 'credits') {
            newItem = {
                name: document.getElementById('modal-name').value,
                role: document.getElementById('modal-role').value,
                img: document.getElementById('modal-img').value
            };
            updateOrAddItem(siteData.credits, newItem, index);
        } else if (type === 'admins') {
            newItem = {
                user: document.getElementById('modal-user').value,
                pass: document.getElementById('modal-pass').value,
                isSuperAdmin: document.getElementById('modal-super').checked
            };
            updateOrAddItem(admins, newItem, index);
        }
        
        closeModal();
        renderAll();
    }

    function updateOrAddItem(array, item, index) {
        if (index > -1) {
            array[index] = item; // Update
        } else {
            array.push(item); // Add
        }
    }
    
    function deleteItem(type, index) {
        if (!confirm('Are you sure you want to delete this item?')) return;

        if (type === 'games') siteData.games.splice(index, 1);
        if (type === 'credits') siteData.credits.splice(index, 1);
        if (type === 'admins') admins.splice(index, 1);
        
        renderAll();
    }

    // --- Save All Data ---
    function saveAllChanges() {
        // Get the latest script content from the textarea
        siteData.script = scriptInput.value;
        
        // Save both data sets to localStorage
        localStorage.setItem('nexusSiteData', JSON.stringify(siteData));
        localStorage.setItem('nexusAdmins', JSON.stringify(admins));

        alert('All changes have been saved to your local browser storage!');
    }

    // --- Event Listeners ---
    loginForm.addEventListener('submit', handleLogin);
    logoutBtn.addEventListener('click', handleLogout);
    saveAllBtn.addEventListener('click', saveAllChanges);

    document.getElementById('add-game-btn').addEventListener('click', () => openModal('games'));
    document.getElementById('add-credit-btn').addEventListener('click', () => openModal('credits'));
    document.getElementById('add-admin-btn').addEventListener('click', () => openModal('admins'));
    
    // --- Initial Run ---
    initializeData();
    checkLogin();
});
