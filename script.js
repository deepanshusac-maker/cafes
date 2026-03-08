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
function getCafeSettings() {
    const saved = localStorage.getItem('aurora_settings');
    if (saved) return JSON.parse(saved);
    return (typeof CAFE_SETTINGS !== 'undefined') ? CAFE_SETTINGS : {
        hours: {
            weekday: { open: 10, close: 23 },
            weekend: { open: 9, close: 23 }
        },
        statusMode: 'auto'
    };
}

function updateCafeStatus() {
    const settings = getCafeSettings();
    const now = new Date();
    const day = now.getDay();
    const hour = now.getHours();

    const pill = document.getElementById('statusPill');
    const text = document.getElementById('statusText');

    if (!pill || !text) return;

    let isOpen = false;
    let statusMsg = '';

    if (settings.statusMode === 'open') {
        isOpen = true;
        statusMsg = 'Open Now • Experience Aurora';
    } else if (settings.statusMode === 'closed') {
        isOpen = false;
        statusMsg = 'Closed • Check back soon';
    } else {
        // Auto Mode
        const isWeekend = (day === 0 || day === 6);
        const hours = isWeekend ? settings.hours.weekend : settings.hours.weekday;

        isOpen = (hour >= hours.open && hour < hours.close);

        if (isOpen) {
            const closeTime = hours.close > 12 ? `${hours.close - 12} PM` : `${hours.close} AM`;
            statusMsg = `Open Now • Serving until ${closeTime}`;
        } else {
            const openTime = hours.open > 12 ? `${hours.open - 12} PM` : `${hours.open} AM`;
            statusMsg = `Closed • Opens at ${openTime}`;
        }
    }

    if (isOpen) {
        pill.className = 'status-pill open';
        text.innerText = statusMsg;
    } else {
        pill.className = 'status-pill closed';
        text.innerText = statusMsg;
    }
}

// ── MENU FILTERING ──
const filterBtns = document.querySelectorAll('.filter-btn');
const menuCards = document.querySelectorAll('.menu-card');

if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            menuCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    card.classList.remove('filtered-out');
                    setTimeout(() => card.classList.add('visible'), 50);
                } else {
                    card.classList.add('filtered-out');
                    card.classList.remove('visible');
                }
            });
        });
    });
}

// Mobile Nav
function openMobileNav() {
    const mn = document.getElementById('mobileNav');
    if (mn) mn.classList.add('open');
}
function closeMobileNav() {
    const mn = document.getElementById('mobileNav');
    if (mn) mn.classList.remove('open');
}

// Initialize dynamic content
document.addEventListener('DOMContentLoaded', () => {
    updateCafeStatus();
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
// ── TOAST NOTIFICATION SYSTEM ──
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let icon = 'ℹ️';
    if (type === 'success') icon = '✅';
    if (type === 'error') icon = '❌';
    if (type === 'warning') icon = '⚠️';

    toast.innerHTML = `
        <span class="toast-icon">${icon}</span>
        <span class="toast-message">${message}</span>
    `;

    container.appendChild(toast);

    // Show toast
    setTimeout(() => toast.classList.add('show'), 100);

    // Remove toast
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 500);
    }, 4000);
}

// ── RESERVATION MODAL LOGIC ──
function openReserveModal() {
    const modal = document.getElementById('reserveModal');
    if (modal) {
        modal.style.display = 'flex';
        // Force reflow for transition
        modal.offsetHeight;
        modal.classList.add('open');
        document.body.style.overflow = 'hidden'; // Prevent scroll

        // Set minimum date to today
        const dateInput = document.getElementById('resDate');
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.setAttribute('min', today);
        }
    }
}

function closeReserveModal() {
    const modal = document.getElementById('reserveModal');
    if (modal) {
        modal.classList.remove('open');
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }, 400);
    }
}

// Handle Reservation Form Submission
const reserveForm = document.getElementById('reserveForm');
if (reserveForm) {
    reserveForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('resName').value.trim();
        const phone = document.getElementById('resPhone').value.trim();
        const guests = document.getElementById('resGuests').value;
        const date = document.getElementById('resDate').value;
        const time = document.getElementById('resTime').value;
        const special = document.getElementById('resSpecial').value.trim();

        // --- VALIDATION ---
        if (name.length < 3) {
            showToast('Please enter your full name.', 'error');
            return;
        }

        const phoneRegex = /^[+]?[\d\s-]{10,}$/;
        if (!phoneRegex.test(phone)) {
            showToast('Please enter a valid phone number.', 'error');
            return;
        }

        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate < today) {
            showToast('Please select a future date.', 'error');
            return;
        }

        if (!time) {
            showToast('Please select a preferred time.', 'error');
            return;
        }

        // --- SUCCESS ---
        showToast('Requesting reservation via WhatsApp...', 'success');

        // Construct WhatsApp message
        const message = `Hi Aurora Cafe! I'd like to request a reservation:
- Name: ${name}
- Phone: ${phone}
- Group Size: ${guests}
- Date: ${date}
- Time: ${time}
${special ? `- Special Requests: ${special}` : ''}`;

        const encodedMessage = encodeURIComponent(message);

        // Use phone from settings.js or fallback
        const cafePhone = (typeof CAFE_SETTINGS !== 'undefined') ? CAFE_SETTINGS.phone.replace(/\s+/g, '') : '911234567890';

        const whatsappUrl = `https://wa.me/${cafePhone}?text=${encodedMessage}`;

        // Open WhatsApp after a short delay to let toast be seen
        setTimeout(() => {
            window.open(whatsappUrl, '_blank');
            closeReserveModal();
            reserveForm.reset();
        }, 1500);
    });
}

// Update all "Reserve" buttons to open modal
document.querySelectorAll('a[href="contact.html"].nav-cta, .btn-primary[href="contact.html"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        openReserveModal();
    });
});
