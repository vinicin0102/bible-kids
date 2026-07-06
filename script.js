// ===== PARTICLES BACKGROUND =====
function createParticles() {
    const container = document.getElementById('particles');
    const colors = ['#7C3AED', '#EC4899', '#F59E0B', '#A78BFA', '#FCD34D'];
    const particleCount = 20;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        const size = Math.random() * 80 + 30;
        const color = colors[Math.floor(Math.random() * colors.length)];
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.background = color;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 10}s`;
        particle.style.animationDuration = `${10 + Math.random() * 15}s`;
        container.appendChild(particle);
    }
}

// ===== NAVBAR SCROLL =====
function initNavbar() {
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        if (currentScroll > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        lastScroll = currentScroll;
    });
}

// ===== MOBILE MENU =====
function initMobileMenu() {
    const toggle = document.getElementById('mobileToggle');
    const navLinks = document.querySelector('.nav-links');

    if (toggle) {
        toggle.addEventListener('click', () => {
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
            navLinks.style.flexDirection = 'column';
            navLinks.style.position = 'absolute';
            navLinks.style.top = '100%';
            navLinks.style.left = '0';
            navLinks.style.right = '0';
            navLinks.style.background = 'rgba(15, 10, 30, 0.98)';
            navLinks.style.padding = '20px';
            navLinks.style.gap = '16px';
            navLinks.style.borderRadius = '0 0 16px 16px';
        });
    }
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 80);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
}

// ===== COUNTER ANIMATION =====
function initCounters() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseFloat(el.dataset.count);
                const isDecimal = target % 1 !== 0;
                const duration = 2000;
                const startTime = performance.now();

                function update(currentTime) {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    // Ease out cubic
                    const eased = 1 - Math.pow(1 - progress, 3);
                    const current = target * eased;

                    if (isDecimal) {
                        el.textContent = current.toFixed(1);
                    } else {
                        el.textContent = Math.floor(current).toLocaleString('pt-BR');
                    }

                    if (progress < 1) {
                        requestAnimationFrame(update);
                    } else {
                        if (isDecimal) {
                            el.textContent = target.toFixed(1);
                        } else {
                            el.textContent = target.toLocaleString('pt-BR');
                        }
                    }
                }

                requestAnimationFrame(update);
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.proof-number').forEach(el => {
        observer.observe(el);
    });
}

// ===== CAROUSEL =====
function initCarousel() {
    const track = document.getElementById('carouselTrack');
    const prevBtn = document.getElementById('carouselPrev');
    const nextBtn = document.getElementById('carouselNext');
    const dotsContainer = document.getElementById('carouselDots');

    if (!track) return;

    const cards = track.querySelectorAll('.preview-card');
    const cardCount = cards.length;
    let currentIndex = 0;

    // Create dots
    for (let i = 0; i < cardCount; i++) {
        const dot = document.createElement('button');
        dot.classList.add('carousel-dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => scrollToCard(i));
        dotsContainer.appendChild(dot);
    }

    function updateDots() {
        document.querySelectorAll('.carousel-dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
    }

    function scrollToCard(index) {
        currentIndex = Math.max(0, Math.min(index, cardCount - 1));
        const card = cards[currentIndex];
        const trackRect = track.getBoundingClientRect();
        const cardRect = card.getBoundingClientRect();
        const scrollLeft = card.offsetLeft - (trackRect.width / 2) + (cardRect.width / 2);
        track.scrollTo({ left: scrollLeft, behavior: 'smooth' });
        updateDots();
    }

    prevBtn.addEventListener('click', () => scrollToCard(currentIndex - 1));
    nextBtn.addEventListener('click', () => scrollToCard(currentIndex + 1));

    // Update active dot on scroll
    let scrollTimeout;
    track.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            const trackRect = track.getBoundingClientRect();
            const center = trackRect.left + trackRect.width / 2;
            let closestIndex = 0;
            let closestDist = Infinity;

            cards.forEach((card, i) => {
                const cardRect = card.getBoundingClientRect();
                const cardCenter = cardRect.left + cardRect.width / 2;
                const dist = Math.abs(center - cardCenter);
                if (dist < closestDist) {
                    closestDist = dist;
                    closestIndex = i;
                }
            });

            currentIndex = closestIndex;
            updateDots();
        }, 100);
    });

    // Auto-scroll
    let autoScrollInterval = setInterval(() => {
        currentIndex = (currentIndex + 1) % cardCount;
        scrollToCard(currentIndex);
    }, 4000);

    // Pause auto-scroll on hover
    track.addEventListener('mouseenter', () => clearInterval(autoScrollInterval));
    track.addEventListener('mouseleave', () => {
        autoScrollInterval = setInterval(() => {
            currentIndex = (currentIndex + 1) % cardCount;
            scrollToCard(currentIndex);
        }, 4000);
    });
}

// ===== FAQ ACCORDION =====
function initFAQ() {
    document.querySelectorAll('.faq-question').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.closest('.faq-item');
            const isOpen = item.classList.contains('open');

            // Close all
            document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));

            // Toggle current
            if (!isOpen) {
                item.classList.add('open');
            }
        });
    });
}

// ===== COUNTDOWN TIMER =====
function initCountdown() {
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    if (!hoursEl) return;

    // Set to 24 hours from now
    let totalSeconds = 24 * 60 * 60;

    // Check localStorage for saved end time
    const savedEnd = localStorage.getItem('bibliaColorirCountdown');
    if (savedEnd) {
        const remaining = Math.floor((parseInt(savedEnd) - Date.now()) / 1000);
        if (remaining > 0) {
            totalSeconds = remaining;
        } else {
            // Reset if expired
            const newEnd = Date.now() + 24 * 60 * 60 * 1000;
            localStorage.setItem('bibliaColorirCountdown', newEnd.toString());
        }
    } else {
        const endTime = Date.now() + totalSeconds * 1000;
        localStorage.setItem('bibliaColorirCountdown', endTime.toString());
    }

    function updateCountdown() {
        const savedEnd = parseInt(localStorage.getItem('bibliaColorirCountdown'));
        const remaining = Math.max(0, Math.floor((savedEnd - Date.now()) / 1000));

        const h = Math.floor(remaining / 3600);
        const m = Math.floor((remaining % 3600) / 60);
        const s = remaining % 60;

        hoursEl.textContent = String(h).padStart(2, '0');
        minutesEl.textContent = String(m).padStart(2, '0');
        secondsEl.textContent = String(s).padStart(2, '0');

        if (remaining <= 0) {
            // Reset timer
            const newEnd = Date.now() + 24 * 60 * 60 * 1000;
            localStorage.setItem('bibliaColorirCountdown', newEnd.toString());
        }
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// ===== SMOOTH SCROLL =====
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 80;
                const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });
}

// ===== PURCHASE NOTIFICATION POPUP =====
function initPurchaseNotifications() {
    const names = [
        'Maria S.', 'João P.', 'Ana L.', 'Pedro M.', 'Juliana R.',
        'Carlos A.', 'Fernanda B.', 'Lucas G.', 'Patrícia C.', 'Roberto F.',
        'Camila D.', 'Bruno T.', 'Aline V.', 'Marcos E.', 'Simone N.'
    ];
    const cities = [
        'São Paulo, SP', 'Rio de Janeiro, RJ', 'Belo Horizonte, MG',
        'Curitiba, PR', 'Salvador, BA', 'Fortaleza, CE', 'Brasília, DF',
        'Recife, PE', 'Porto Alegre, RS', 'Goiânia, GO'
    ];
    const plans = ['Essencial', 'Completo', 'Premium'];
    const emojis = ['📘', '📗', '📕'];

    function showNotification() {
        const name = names[Math.floor(Math.random() * names.length)];
        const city = cities[Math.floor(Math.random() * cities.length)];
        const planIdx = Math.floor(Math.random() * plans.length);
        const minutes = Math.floor(Math.random() * 30) + 1;

        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            bottom: 100px;
            left: 24px;
            background: white;
            border-radius: 16px;
            padding: 16px 20px;
            box-shadow: 0 8px 30px rgba(0,0,0,0.15);
            display: flex;
            align-items: center;
            gap: 12px;
            z-index: 9999;
            transform: translateX(-120%);
            transition: transform 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55);
            max-width: 340px;
            font-family: 'Nunito', sans-serif;
            border: 1px solid rgba(124, 58, 237, 0.1);
        `;

        notification.innerHTML = `
            <div style="font-size: 2rem;">${emojis[planIdx]}</div>
            <div>
                <div style="font-weight: 700; font-size: 0.85rem; color: #1E1B4B;">${name} de ${city}</div>
                <div style="font-size: 0.78rem; color: #94A3B8;">Comprou o plano <strong style="color: #7C3AED;">${plans[planIdx]}</strong></div>
                <div style="font-size: 0.72rem; color: #CBD5E1;">há ${minutes} minuto${minutes > 1 ? 's' : ''}</div>
            </div>
        `;

        document.body.appendChild(notification);

        // Animate in
        requestAnimationFrame(() => {
            notification.style.transform = 'translateX(0)';
        });

        // Animate out after 4 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(-120%)';
            setTimeout(() => notification.remove(), 500);
        }, 4000);
    }

    // Show first notification after 8 seconds, then every 15-25 seconds
    setTimeout(showNotification, 8000);
    setInterval(showNotification, Math.random() * 10000 + 15000);
}

// ===== PRICING CARD HOVER EFFECTS =====
function initPricingEffects() {
    document.querySelectorAll('.pricing-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transition = 'all 0.4s ease';
        });
    });
}

// ===== BOOK PAGE FLIP ANIMATION =====
function initBookAnimation() {
    const bookContainer = document.querySelector('.flip-book-container');
    if (!bookContainer) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.3 });

    observer.observe(bookContainer);
}

// ===== INIT ALL =====
document.addEventListener('DOMContentLoaded', () => {
    createParticles();
    initNavbar();
    initMobileMenu();
    initScrollAnimations();
    initCounters();
    initCarousel();
    initFAQ();
    initCountdown();
    initSmoothScroll();
    initPurchaseNotifications();
    initPricingEffects();
    initBookAnimation();
});
