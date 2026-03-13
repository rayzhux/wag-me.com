// ═══════ WAG Corporate — Shared Scripts ═══════

// Navigation scroll behavior
const nav = document.getElementById('nav');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
const navOverlay = document.getElementById('navOverlay');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  if (nav) nav.classList.toggle('scrolled', scrollY > 60);

  // Progress bar
  const bar = document.getElementById('scrollProgress');
  if (bar) {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = `scaleX(${scrollY / docHeight})`;
  }

  // Active section tracking (for single-page sections)
  const sections = document.querySelectorAll('section[id]');
  let current = '';
  sections.forEach(s => {
    if (scrollY >= s.offsetTop - 120) current = s.getAttribute('id');
  });
  document.querySelectorAll('.nav-links a[href^="#"]').forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
  });
}, { passive: true });

// Mobile toggle
if (navToggle) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    if (navOverlay) navOverlay.classList.toggle('open');
  });
}
if (navOverlay) {
  navOverlay.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navOverlay.classList.remove('open');
  });
}
// Close on link click
if (navLinks) {
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      if (navOverlay) navOverlay.classList.remove('open');
    });
  });
}

// Mark current page in nav
const currentPath = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(a => {
  const href = a.getAttribute('href');
  if (href === currentPath || (currentPath === 'index.html' && href === '/') || (currentPath === '' && href === 'index.html')) {
    // Don't mark home link active unless we want to
  }
  if (href === currentPath) {
    a.classList.add('active');
  }
});

// ═══════ NAV DROPDOWN ═══════
document.querySelectorAll('.nav-dropdown-toggle').forEach(toggle => {
  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const dropdown = toggle.closest('.nav-dropdown');
    dropdown.classList.toggle('open');
  });
});
// Close dropdown when clicking outside
document.addEventListener('click', () => {
  document.querySelectorAll('.nav-dropdown.open').forEach(d => d.classList.remove('open'));
});
// Highlight dropdown toggle if on a vertical page
const verticalPages = ['aftermarket.html', 'data-software.html', 'fintech.html', 'consulting.html'];
if (verticalPages.includes(currentPath)) {
  const toggle = document.querySelector('.nav-dropdown-toggle');
  if (toggle) toggle.style.color = 'var(--white)';
}
// Also highlight the active dropdown menu item
document.querySelectorAll('.nav-dropdown-menu a').forEach(a => {
  if (a.getAttribute('href') === currentPath) {
    a.style.color = 'var(--white)';
  }
});

// ═══════ REVEAL ON SCROLL ═══════
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
  revealObserver.observe(el);
});

// ═══════ SMOOTH SCROLL (for same-page links) ═══════
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ═══════ ANIMATED COUNTERS ═══════
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.dataset.counted) {
      entry.target.dataset.counted = 'true';
      animateCounter(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

function animateCounter(el) {
  const target = parseFloat(el.dataset.count);
  const suffix = el.dataset.suffix || '';
  const prefix = el.dataset.prefix || '';
  const duration = 1500;
  const start = performance.now();
  const isFloat = target % 1 !== 0;

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = isFloat ? (target * eased).toFixed(0) : Math.floor(target * eased);
    el.textContent = prefix + current.toLocaleString() + suffix;
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = prefix + (isFloat ? target.toFixed(0) : target).toLocaleString() + suffix;
  }
  requestAnimationFrame(update);
}
