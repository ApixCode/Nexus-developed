document.addEventListener('DOMContentLoaded', () => {

    // --- Particle.js Initialization ---
    particlesJS("particles-js", {
        "particles": {
            "number": { "value": 80, "density": { "enable": true, "value_area": 800 } },
            "color": { "value": "#e50914" },
            "shape": { "type": "circle", "stroke": { "width": 0, "color": "#000000" } },
            "opacity": { "value": 0.5, "random": false, "anim": { "enable": false } },
            "size": { "value": 3, "random": true, "anim": { "enable": false } },
            "line_linked": { "enable": true, "distance": 150, "color": "#e50914", "opacity": 0.4, "width": 1 },
            "move": { "enable": true, "speed": 4, "direction": "none", "random": false, "straight": false, "out_mode": "out", "bounce": false }
        },
        "interactivity": {
            "detect_on": "canvas",
            "events": { "onhover": { "enable": true, "mode": "grab" }, "onclick": { "enable": true, "mode": "push" }, "resize": true },
            "modes": { "grab": { "distance": 140, "line_linked": { "opacity": 1 } }, "bubble": { "distance": 400, "size": 40, "duration": 2, "opacity": 8, "speed": 3 }, "repulse": { "distance": 200, "duration": 0.4 }, "push": { "particles_nb": 4 }, "remove": { "particles_nb": 2 } }
        },
        "retina_detect": true
    });

    // --- Page Navigation (SPA) ---
    const navLinks = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('.page');
    const navMenu = document.getElementById('nav-links');
    const burger = document.getElementById('burger-menu');

    navLinks.forEach(link => {
        // Skip the external ToS link
        if (link.getAttribute('target') === '_blank') return;
        
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetPageId = link.getAttribute('data-page');

            // Switch active page
            pages.forEach(page => {
                page.classList.remove('active');
                if (page.id === targetPageId) {
                    page.classList.add('active');
                }
            });

            // Update active link style
            navLinks.forEach(navLink => navLink.classList.remove('active'));
            link.classList.add('active');
            
            // Close mobile menu on link click
            if(navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                burger.classList.remove('toggle');
            }
        });
    });

    // --- Burger Menu Toggle ---
    burger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        burger.classList.toggle('toggle');
    });
    

    // --- Copy Script Button ---
    const copyBtn = document.getElementById('copy-btn');
    const scriptCode = document.getElementById('script-code').innerText;
    
    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(scriptCode).then(() => {
            const originalText = copyBtn.querySelector('span').innerText;
            copyBtn.querySelector('span').innerText = 'Copied!';
            
            setTimeout(() => {
                copyBtn.querySelector('span').innerText = originalText;
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    });
});
