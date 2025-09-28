// --- CONFIGURATION ---
// IMPORTANT: Replace this with your actual Render API URL after you deploy it.
const API_URL = 'https://your-api-name.onrender.com/api/content';

// --- CORE FUNCTION ---
async function fetchAndUpdateContent() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            console.error('Failed to fetch data from API');
            return;
        }
        const data = await response.json();

        // Check which page we are on and update accordingly
        if (document.getElementById('script-content')) {
            updateScriptPage(data.scriptContent);
        }
        if (document.getElementById('supported-container')) {
            updateSupportedPage(data.supported);
        }
        if (document.getElementById('credits-container')) {
            updateCreditsPage(data.credits);
        }

    } catch (error) {
        console.error('An error occurred:', error);
    }
}

// --- PAGE-SPECIFIC UPDATE FUNCTIONS ---

function updateScriptPage(scriptContent) {
    const scriptElement = document.getElementById('script-content');
    if (scriptElement.textContent !== scriptContent) {
        scriptElement.textContent = scriptContent;
        // Apply highlighting
        hljs.highlightElement(scriptElement);
        console.log('Script updated!');
    }
}

function updateSupportedPage(supportedArray) {
    const container = document.getElementById('supported-container');
    let html = '';
    for (const item of supportedArray) {
        // Create a status class (e.g., 'working', 'patched') for styling
        const statusClass = item.status.toLowerCase();
        html += `
            <div class="card supported-card">
                <img src="${item.image}" alt="${item.name}">
                <h3>${item.name}</h3>
                <p>Status: <span class="status ${statusClass}">${item.status}</span></p>
                <a href="${item.link}" target="_blank">Play Game</a>
            </div>
        `;
    }
    // Only update the DOM if the content has actually changed
    if (container.innerHTML !== html) {
        container.innerHTML = html;
        console.log('Supported games updated!');
    }
}

function updateCreditsPage(creditsArray) {
    const container = document.getElementById('credits-container');
    let html = '';
    for (const dev of creditsArray) {
        html += `
            <div class="card credit-card">
                <img src="${dev.image}" alt="${dev.name}">
                <h3>${dev.name}</h3>
                <p><strong>${dev.role}</strong></p>
                <p>${dev.description || ''}</p> 
            </div>
        `;
    }
    if (container.innerHTML !== html) {
        container.innerHTML = html;
        console.log('Credits updated!');
    }
}


// --- INITIALIZATION ---
// Fetch content immediately when the page loads
document.addEventListener('DOMContentLoaded', () => {
    fetchAndUpdateContent();

    // Then, set up an interval to poll for changes.
    // NOTE: 1 second is VERY frequent and can be heavy on your free Render instance.
    // 5-10 seconds (5000-10000ms) is more reasonable.
    setInterval(fetchAndUpdateContent, 5000); // Check every 5 seconds
});
