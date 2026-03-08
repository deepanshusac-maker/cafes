// Sticky Nav
const nav = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
});

// Improved Scroll Reveal
const revealElements = document.querySelectorAll('[class*="reveal"]');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Stop observing once visible to save resources
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px' // Trigger slightly before element enters viewport
});

revealElements.forEach(el => revealObserver.observe(el));

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

// Mobile Nav
function openMobileNav() { document.getElementById('mobileNav').classList.add('open'); }
function closeMobileNav() { document.getElementById('mobileNav').classList.remove('open'); }
