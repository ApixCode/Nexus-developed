document.addEventListener('DOMContentLoaded', () => {

    // --- DEFAULT DATA ---
    // This data is used if nothing is found in localStorage
    const defaultData = {
        script: `loadstring(game:HttpGet("https://cdn.authguard.org/virtual-file/794429cf18d6472f9d1186fc4f7e0fb0"))()`,
        games: [
            { name: 'Blade Ball', url: 'https://www.roblox.com/games/13772394625/Blade-Ball', img: 'https://cdn.discordapp.com/attachments/1396322574203359333/1418487614855712788/noFilter-5.jpg?ex=68cef5c9&is=68cda449&hm=bf86f61550f5646e7179eef7ccdd70ab7b9eb087b24cd507e65e0ec57249d69f&' },
            { name: 'Easy Stud Jumps Obby', url: 'https://www.roblox.com/games/11166344460/Easy-Stud-Jumps-Obby', img: 'https://cdn.discordapp.com/attachments/1396322574203359333/1418487614192881714/noFilter-4.jpg?ex=68cef5c9&is=68cda449&hm=633f6126e7e36edbe0a7daefeb6fb010f259d44ef495871018b6003d6ffbdb57&' },
            { name: 'Ninja legends', url: 'https://www.roblox.com/games/3956818381/Ninja-Legends', img: 'https://cdn.discordapp.com/attachments/1396322574203359333/1418487612758560888/noFilter-3.jpg?ex=68cef5c9&is=68cda449&hm=f2b7b9f821f3aaea044c21cffcbe7abfb70fcb4af05c3c757dda1bf8d3405eb4&' },
            { name: 'Blox fruits', url: 'https://www.roblox.com/games/2753915549/Blox-Fruits', img: 'https://cdn.discordapp.com/attachments/1396322574203359333/1418487613177860168/noFilter-2.jpg?ex=68cef5c9&is=68cda449&hm=dfc43f2aea679b3f73577ce7e8fc21b6b2c13c757805fd0add7cf253f621934f&' },
            { name: 'Grow a garden', url: 'https://www.roblox.com/games/126884695634066/Grow-a-Garden', img: 'https://cdn.discordapp.com/attachments/1396322574203359333/1418487613723250698/noFilter-1.jpg?ex=68cef5c9&is=68cda449&hm=24878f63f48053fc3dfa3080f859876cf7a3d061eeca69f76b2f118527aa10c&' },
            { name: 'Hunty zombie', url: 'https://www.roblox.com/games/103754275310547/Hunty-Zombie-UPDATE-1-6', img: 'https://cdn.discordapp.com/attachments/1396322574203359333/1418487612338999478/noFilter.jpg?ex=68cef5c9&is=68cda449&hm=a0fec97635b395918202d087eb26b05ef62ddd001f4537ce3e3b7e1cf31f17a8&' },
            { name: 'Evade', url: 'https://www.roblox.com/games/9872472334/Evade', img: 'https://cdn.discordapp.com/attachments/1396322574203359333/1418739689145241600/evade-button-1730325089560.jpg?ex=68cf37cc&is=68cde64c&hm=c547571116536a201b11cf322addae373bf017c1cb76967535071252162b5be3&' },
        ],
        credits: [
            { name: '.developed', role: 'Owner and Dev', img: 'https://cdn.discordapp.com/attachments/1396322574203359333/1418482971400470649/44737895a1d588d1855a3b1a88f34106.png?ex=68cef176&is=68cd9ff6&hm=6e0f83254e0a844ab606fcb1e18b663fe5058a5ee5b2106273a94bd13f6ecba6&' },
            { name: 'z3r0d4', role: 'Co-owner and Dev', img: 'https://cdn.discordapp.com/attachments/1396322574203359333/1418483481914114208/25992017dc4d81d2c71a73920f81f167.png?ex=68cef1f0&is=68cda070&hm=6f3f5540476b66fc1c4ac4e6eb96f383e3b908aed0efc6c5f4cc114a61a2d88f&' },
            { name: 'goodgamerytbro_77520', role: 'Lead Dev', img: 'https://cdn.discordapp.com/attachments/1396322574203359333/1418483689184301096/ba8d7e0e2dc77359360bf39c55712e0b-1.png?ex=68cef221&is=68cda0a1&hm=521d45bbbcfe24c23d6994486abba69a22280ed53fae90491cd42625939b21fd&' },
            { name: 'azyyza', role: 'Dev', img: 'https://cdn.discordapp.com/attachments/1396322574203359333/1418483912614875206/43e0494dc00db00d524b16d621dcc82b.png?ex=68cef256&is=68cda0d6&hm=c12b8857341ed4e4cba88030466556742c65c10030df3261df7ff8f2d8c637fc&' },
            { name: 'ypgqn', role: 'UI Designer and Helper', img: 'https://cdn.discordapp.com/attachments/1396322574203359333/1418484955088027729/97ebf66b5bc1a91a816cbd0808b42ce9.png?ex=68cef34f&is=68cda1cf&hm=fbd07c8eff1fca2f70afab03961bb4ff35dc05ba873ef2216e56ee919e8ae456&' },
        ]
    };

    // --- DATA LOADING & RENDERING ---
    function loadAndRenderData() {
        const storedData = localStorage.getItem('nexusSiteData');
        const data = storedData ? JSON.parse(storedData) : defaultData;

        // Render Script
        const scriptCodeEl = document.getElementById('script-code');
        if (scriptCodeEl) {
            scriptCodeEl.textContent = data.script;
            Prism.highlightElement(scriptCodeEl);
        }

        // Render Games
        const gameGrid = document.getElementById('game-grid');
        if (gameGrid) {
            gameGrid.innerHTML = '';
            data.games.forEach(game => {
                const gameCard = `
                <a href="${game.url}" target="_blank" class="game-card">
                    <img src="${game.img}" alt="${game.name}">
                    <div class="game-card-content">
                        <h3>${game.name}</h3>
                    </div>
                </a>`;
                gameGrid.innerHTML += gameCard;
            });
        }

        // Render Credits
        const creditsGrid = document.getElementById('credits-grid');
        if (creditsGrid) {
            creditsGrid.innerHTML = '';
            data.credits.forEach(credit => {
                const creditCard = `
                <div class="credit-card">
                    <img src="${credit.img}" alt="${credit.name}">
                    <h3>${credit.name}</h3>
                    <p>${credit.role}</p>
                </div>`;
                creditsGrid.innerHTML += creditCard;
            });
        }
    }

    loadAndRenderData();


    // --- PARTICLE.JS, NAVIGATION, AND OTHER UI LOGIC ---

    particlesJS("particles-js", {
        "particles": { "number": { "value": 80, "density": { "enable": true, "value_area": 800 } }, "color": { "value": "#e50914" }, "shape": { "type": "circle", "stroke": { "width": 0, "color": "#000000" } }, "opacity": { "value": 0.5, "random": false, "anim": { "enable": false } }, "size": { "value": 3, "random": true, "anim": { "enable": false } }, "line_linked": { "enable": true, "distance": 150, "color": "#e50914", "opacity": 0.4, "width": 1 }, "move": { "enable": true, "speed": 4, "direction": "none", "random": false, "straight": false, "out_mode": "out", "bounce": false } }, "interactivity": { "detect_on": "canvas", "events": { "onhover": { "enable": true, "mode": "grab" }, "onclick": { "enable": true, "mode": "push" }, "resize": true }, "modes": { "grab": { "distance": 140, "line_linked": { "opacity": 1 } }, "bubble": { "distance": 400, "size": 40, "duration": 2, "opacity": 8, "speed": 3 }, "repulse": { "distance": 200, "duration": 0.4 }, "push": { "particles_nb": 4 }, "remove": { "particles_nb": 2 } } }, "retina_detect": true
    });

    const navLinks = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('.page');
    const navMenu = document.getElementById('nav-links');
    const burger = document.getElementById('burger-menu');

    navLinks.forEach(link => {
        if (link.getAttribute('target') === '_blank') return;
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetPageId = link.getAttribute('data-page');
            pages.forEach(page => page.classList.remove('active'));
            document.getElementById(targetPageId).classList.add('active');
            navLinks.forEach(navLink => navLink.classList.remove('active'));
            link.classList.add('active');
            if(navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                burger.classList.remove('toggle');
            }
        });
    });

    burger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        burger.classList.toggle('toggle');
    });
    
    const copyBtn = document.getElementById('copy-btn');
    copyBtn.addEventListener('click', () => {
        const scriptCode = document.getElementById('script-code').innerText;
        navigator.clipboard.writeText(scriptCode).then(() => {
            const originalText = copyBtn.querySelector('span').innerText;
            copyBtn.querySelector('span').innerText = 'Copied!';
            setTimeout(() => {
                copyBtn.querySelector('span').innerText = originalText;
            }, 2000);
        });
    });
});
