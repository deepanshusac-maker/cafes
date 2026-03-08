// Sticky Nav
const nav = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
});

const revealElements = document.querySelectorAll('[class*="reveal"]');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');

            // Trigger counter if the element OR its child is a counter
            const counter = entry.target.classList.contains('counter') ?
                entry.target :
                entry.target.querySelector('.counter');

            if (counter && !counter.classList.contains('counted')) {
                startCounter(counter);
                counter.classList.add('counted');
            }

            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));

// ── DYNAMIC COUNTERS ──
function startCounter(el) {
    const target = parseFloat(el.getAttribute('data-count'));
    let current = 0;
    const duration = 2000;
    const steps = 100;
    const increment = target / steps;
    const stepTime = duration / steps;

    const interval = setInterval(() => {
        current += increment;
        if (current >= target) {
            el.innerText = target % 1 === 0 ? target : target.toFixed(1);
            clearInterval(interval);
        } else {
            el.innerText = target % 1 === 0 ? Math.floor(current) : current.toFixed(1);
        }
    }, stepTime);
}

// ── PRELOADER ──
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('loaded');
        }, 1000);
    }
});

// ── DYNAMIC OPENING STATUS ──
function updateCafeStatus() {
    const now = new Date();
    const day = now.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
    const hour = now.getHours();

    const pill = document.getElementById('statusPill');
    const text = document.getElementById('statusText');

    // Sat=6, Sun=0: 9 AM - 11 PM
    // Mon-Fri: 10 AM - 11 PM
    const isWeekend = (day === 0 || day === 6);
    const openHour = isWeekend ? 9 : 10;
    const closeHour = 23;

    const isOpen = (hour >= openHour && hour < closeHour);

    if (isOpen) {
        pill.className = 'status-pill open';
        text.innerText = 'Open Now • Serving until 11 PM';
    } else {
        pill.className = 'status-pill closed';
        text.innerText = `Closed • Opens ${isWeekend ? 'at 9 AM' : 'at 10 AM'}`;
    }
}

// ── MENU FILTERING ──
const filterBtns = document.querySelectorAll('.filter-btn');
const menuCards = document.querySelectorAll('.menu-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Update active button
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        menuCards.forEach(card => {
            const category = card.getAttribute('data-category');
            if (filter === 'all' || category === filter) {
                card.classList.remove('filtered-out');
                // Re-trigger reveal animation if hidden
                setTimeout(() => card.classList.add('visible'), 50);
            } else {
                card.classList.add('filtered-out');
                card.classList.remove('visible');
            }
        });
    });
});

// Initialize dynamic content
document.addEventListener('DOMContentLoaded', () => {
    updateCafeStatus();
    // Refresh status every minute
    setInterval(updateCafeStatus, 60000);
});

// ── REVIEWS DRAGGABLE SLIDER ──
const slider = document.querySelector('.reviews-slider-container');
const track = document.getElementById('reviewsTrack');

if (slider && track) {
    let isDown = false;
    let startX;
    let scrollLeft;
    let x = 0;

    slider.addEventListener('mousedown', (e) => {
        isDown = true;
        slider.classList.add('active');
        startX = e.pageX - track.offsetLeft;
        scrollLeft = x;
    });

    slider.addEventListener('mouseleave', () => {
        isDown = false;
    });

    slider.addEventListener('mouseup', () => {
        isDown = false;
    });

    slider.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const walkX = (e.pageX - track.offsetLeft) - startX;
        x = scrollLeft + walkX;

        // Boundaries
        const maxScroll = -(track.scrollWidth - slider.offsetWidth + 80);
        if (x > 0) x = 0;
        if (x < maxScroll) x = maxScroll;

        track.style.transform = `translateX(${x}px)`;
    });

    // Touch support
    slider.addEventListener('touchstart', (e) => {
        isDown = true;
        startX = e.touches[0].pageX - track.offsetLeft;
        scrollLeft = x;
    });

    slider.addEventListener('touchend', () => {
        isDown = false;
    });

    slider.addEventListener('touchmove', (e) => {
        if (!isDown) return;
        const walkX = (e.touches[0].pageX - track.offsetLeft) - startX;
        x = scrollLeft + walkX;

        const maxScroll = -(track.scrollWidth - slider.offsetWidth + 80);
        if (x > 0) x = 0;
        if (x < maxScroll) x = maxScroll;

        track.style.transform = `translateX(${x}px)`;
    });
}
