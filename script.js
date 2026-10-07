// Book-a-demo link: set CALENDLY_URL once it's ready and every
// "Book a demo" button on the page (header, mobile nav, final CTA)
// updates automatically. Leave empty to keep the placeholder behavior.
const CALENDLY_URL = ""; // e.g. "https://calendly.com/your-handle/demo"

const demoLinks = document.querySelectorAll('[data-demo-link]');
demoLinks.forEach(link => {
  if (CALENDLY_URL) {
    link.href = CALENDLY_URL;
    link.target = '_blank';
    link.rel = 'noopener';
  } else {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      alert('Demo scheduling is coming online shortly — in the meantime, call (424) 234-7755.');
    });
  }
});

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const header = document.querySelector('.site-header');
if (navToggle) {
  navToggle.addEventListener('click', () => {
    const isOpen = header.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
  document.querySelectorAll('.mobile-nav a').forEach(link => {
    link.addEventListener('click', () => {
      header.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// Headline word rotator
const rotatorWords = document.querySelectorAll('.rotator-word');
if (rotatorWords.length) {
  let activeIndex = 0;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReducedMotion) {
    setInterval(() => {
      rotatorWords[activeIndex].classList.remove('is-active');
      activeIndex = (activeIndex + 1) % rotatorWords.length;
      rotatorWords[activeIndex].classList.add('is-active');
    }, 2600);
  }
}

// Reveal-on-scroll for bars, counters, and chart
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function animateCount(el) {
  const target = parseFloat(el.dataset.count || '0');
  const prefix = el.dataset.prefix || '';
  const suffix = el.dataset.suffix || '';
  if (prefersReducedMotion) {
    el.textContent = `${prefix}${target}${suffix}`;
    return;
  }
  const duration = 1200;
  const start = performance.now();
  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.round(target * eased);
    el.textContent = `${prefix}${value}${suffix}`;
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    if (entry.target.classList.contains('econ-num')) {
      animateCount(entry.target);
    }

    if (entry.target.id === 'costChart') {
      entry.target.querySelectorAll('.bar-fill').forEach(bar => {
        bar.style.width = (bar.dataset.pct || '0') + '%';
      });
    }

    observer.unobserve(entry.target);
  });
}, { threshold: 0.4 });

document.querySelectorAll('.econ-num').forEach(el => observer.observe(el));
const chart = document.getElementById('costChart');
if (chart) observer.observe(chart);
