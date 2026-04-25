(function () {
    // Reset scroll position on load to prevent stuck scrolling (Task 3)
    // Using setTimeout ensures it happens after browser attempts to restore scroll
    window.addEventListener('load', () => {
        window.scrollTo(0, 0);
        setTimeout(() => window.scrollTo(0, 0), 10);
    });

    const buttons = [...document.querySelectorAll(".control")];

    // Function to swap the active class for buttons and sections
    function switchSection(id) {
        const button = document.querySelector(`.control[data-id="${id}"]`);
        if (!button) return;

        // Cleanup current active elements
        const currentActiveBtn = document.querySelector(".active-btn");
        if (currentActiveBtn) currentActiveBtn.classList.remove("active-btn");

        const currentActiveSec = document.querySelector(".active");
        if (currentActiveSec) currentActiveSec.classList.remove("active");

        // Add active classes to new elements
        button.classList.add("active-btn");
        const nextActiveSec = document.getElementById(id);
        if (nextActiveSec) nextActiveSec.classList.add("active");

        // Update Neural Dock Blob Indicator
        const dock = document.getElementById("neural-dock");
        const blob = document.querySelector(".blob-indicator");
        if (dock && blob && button) {
            const dockRect = dock.getBoundingClientRect();
            const btnRect = button.getBoundingClientRect();
            const offsetLeft = btnRect.left - dockRect.left + (btnRect.width / 2);
            blob.style.left = `${offsetLeft}px`;
        }

        // Ensure scroll resets when jumping between sections
        window.scrollTo(0, 0);
    }

    // Initialize routing based on current hash
    function initHashRouting() {
        // remove the '#' symbol to get the id
        const hash = window.location.hash.substring(1);

        if (hash && document.getElementById(hash)) {
            switchSection(hash);
        } else {
            // Default to first section (home) if no valid hash
            const defaultId = buttons[0]?.dataset.id;
            if (defaultId) {
                // don't leave an empty '#' in history
                history.replaceState(null, null, window.location.pathname + window.location.search);
                switchSection(defaultId);
            }
        }
    }

    // Listeners for button clicks
    buttons.forEach(button => {
        button.addEventListener("click", function () {
            const id = this.dataset.id;
            // Update URL which will trigger the hashchange event
            window.location.hash = id;
        })
    });

    // Theme toggle
    const themeBtn = document.querySelector(".theme-btn");
    if (themeBtn) {
        themeBtn.addEventListener("click", () => {
            document.body.classList.toggle("light-mode");
        });
    }

    // Listen to back/forward navigation or URL hash changes
    window.addEventListener("hashchange", initHashRouting);

    // Initial check on page load (Task 2 solution)
    initHashRouting();

    /* ==============================================
       NEW: UNIVERSAL SCROLL REVEAL (INTERSECTION OBSERVER)
       ============================================== */
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Stop observing once revealed
                // observer.unobserve(entry.target);
            }
        });
    }, { rootMargin: "0px", threshold: 0.1 });

    // Apply observer to all elements with class .reveal-up
    document.querySelectorAll('.reveal-up, .skill-group').forEach(el => {
        revealObserver.observe(el);
    });

    /* ==============================================
       NEW: CUSTOM GLOWING CURSOR
       ============================================== */
    const cursor = document.createElement('div');
    cursor.classList.add('custom-cursor');
    document.body.appendChild(cursor);

    document.addEventListener('mousemove', (e) => {
        // Use requestAnimationFrame for smoother performance or just style direct
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    // Add hovering effect styling when mousing over clickable items
    const clickables = document.querySelectorAll('a, button, .control, .project-card, .skill-group, .interact-card');
    clickables.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
    });

    /* ==============================================
       HERO PARALLAX GLOW
       ============================================== */
    const header = document.querySelector('.header');
    if (header) {
        header.addEventListener('mousemove', (e) => {
            const x = e.clientX / window.innerWidth;
            const y = e.clientY / window.innerHeight;
            // Spot of light tracking cursor in header
            header.style.backgroundImage = `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(37, 211, 98, 0.05) 0%, transparent 40%)`;
        });
    }

    /* ==============================================
       HERO TYPEWRITER EFFECT
       ============================================== */
    const typeWriterElement = document.getElementById('typewriter-text');
    if (typeWriterElement) {
        const words = ['Backend Architect', 'Java Specialist', 'Problem Solver', 'System Designer'];
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typeSpeed = 100;

        function type() {
            const currentWord = words[wordIndex];

            if (isDeleting) {
                typeWriterElement.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
                typeSpeed = 50;
            } else {
                typeWriterElement.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
                typeSpeed = 150;
            }

            if (!isDeleting && charIndex === currentWord.length) {
                isDeleting = true;
                typeSpeed = 2000; // Pause at end of word
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                typeSpeed = 500; // Pause before typing new word
            }

            setTimeout(type, typeSpeed);
        }

        setTimeout(type, 1000); // Start delay
    }

    /* ==============================================
       CYBERTECH ORB HOVER CODE TYPING
       ============================================== */
    const orbs = document.querySelectorAll('.tech-orb');
    const overlay = document.getElementById('codeOverlay');

    let typeCodeTimeout;
    orbs.forEach(orb => {
        orb.addEventListener('mouseenter', function () {
            clearTimeout(typeCodeTimeout);
            overlay.innerHTML = '';

            const codeToType = this.getAttribute('data-code');
            const codeEl = document.createElement('div');
            codeEl.className = 'bg-typed-code active';
            overlay.appendChild(codeEl);

            let i = 0;
            function typeOut() {
                if (i < codeToType.length) {
                    codeEl.textContent += codeToType.charAt(i);
                    i++;
                    typeCodeTimeout = setTimeout(typeOut, 20);
                }
            }
            typeOut();
        });

        orb.addEventListener('mouseleave', function () {
            clearTimeout(typeCodeTimeout);
            const codeEl = overlay.querySelector('.bg-typed-code');
            if (codeEl) {
                codeEl.style.opacity = '0';
                setTimeout(() => { if (codeEl.parentNode) codeEl.remove(); }, 300);
            }
        });
    });

    /* ==============================================
       DIGITAL RAIN MATRIX BACKGROUND
       ============================================== */
    const canvas = document.getElementById('matrixBG');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const chars = '01ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()';
        const fontSize = 14;
        const columns = window.innerWidth / fontSize;
        const drops = [];

        for (let x = 0; x < columns; x++) {
            drops[x] = 1;
        }

        function drawMatrix() {
            ctx.fillStyle = 'rgba(26, 26, 26, 0.08)'; // more fading
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.font = '300 ' + fontSize + 'px "Courier New"'; // Thinner font weight

            for (let i = 0; i < drops.length; i++) {
                const text = chars.charAt(Math.floor(Math.random() * chars.length));
                // Varying opacity for the matrix text to make it elegant
                const alpha = Math.random() * 0.3 + 0.1;
                ctx.fillStyle = `rgba(37, 211, 98, ${alpha})`;

                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        }

        setInterval(drawMatrix, 50);

        window.addEventListener('resize', () => {
            // Avoid resetting completely on small resizes if possible, but keep it simple
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }

})();
