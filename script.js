/* ============================================================
   CONFIG — Modifier ces variables selon l'entreprise
============================================================ */
const CONFIG = {
  tel: '+33994258713',
  email: 'lespaysagesdemandin@gmail.com',
  address: '80 Rue du Puy de Cornac, 33720 Cérons',
  siteUrl: 'https://lespaysagesdemandin.fr'
};

/* ============================================================
   NAVBAR SCROLL
============================================================ */
const nav  = document.getElementById('nav');
const hero = document.getElementById('hero');
function updateNav() {
  const threshold = (hero ? hero.offsetHeight : 600) * 0.6;
  nav.classList.toggle('scrolled', window.scrollY > threshold);
}
window.addEventListener('scroll', updateNav, { passive: true });
updateNav();

/* ============================================================
   BURGER MENU
============================================================ */
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
function closeMenu() {
  burger.classList.remove('open');
  mobileMenu.classList.remove('open');
  burger.setAttribute('aria-expanded', 'false');
}
burger.addEventListener('click', () => {
  const isOpen = burger.classList.toggle('open');
  mobileMenu.classList.toggle('open', isOpen);
  burger.setAttribute('aria-expanded', isOpen);
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeMenu();
});

/* ============================================================
   SCROLL REVEAL
============================================================ */
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
revealEls.forEach(el => {
  el.style.opacity = '0';
  revealObserver.observe(el);
});

/* ============================================================
   COUNT UP
============================================================ */
const countEls = document.querySelectorAll('[data-count]');
const countObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.count);
      const duration = 1600;
      const start = performance.now();
      const animate = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target) + (el.dataset.suffix || '');
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
      countObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });
countEls.forEach(el => countObserver.observe(el));

/* ============================================================
   FAQ ACCORDION
============================================================ */
function toggleFaq(btn) {
  const item = btn.parentElement;
  const isOpen = item.classList.contains('open');
  // fermer tous
  document.querySelectorAll('.faq-item.open').forEach(i => {
    i.classList.remove('open');
    i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
  });
  if (!isOpen) {
    item.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
  }
}
// Keyboard support pour FAQ
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleFaq(btn);
    }
  });
});

/* ============================================================
   CARROUSEL RÉALISATIONS + LIGHTBOX
============================================================ */
const lightbox = document.getElementById('lightbox');
const lightboxImage = lightbox?.querySelector('.lightbox-image');
const lightboxCounter = lightbox?.querySelector('.lightbox-counter');
let lightboxImages = [];
let lightboxIdx = 0;

function showLightboxImage() {
  const img = lightboxImages[lightboxIdx];
  lightboxImage.src = img.dataset.full || img.currentSrc || img.src;
  lightboxImage.alt = img.alt;
  lightboxCounter.textContent = lightboxImages.length > 1
    ? `${lightboxIdx + 1} / ${lightboxImages.length}`
    : '';
}
function openLightbox(images, startIdx) {
  lightboxImages = images;
  lightboxIdx = startIdx;
  showLightboxImage();
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}
function lightboxNext() {
  lightboxIdx = (lightboxIdx + 1) % lightboxImages.length;
  showLightboxImage();
}
function lightboxPrev() {
  lightboxIdx = (lightboxIdx - 1 + lightboxImages.length) % lightboxImages.length;
  showLightboxImage();
}

if (lightbox) {
  lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
  lightbox.querySelector('.lightbox-prev').addEventListener('click', (e) => { e.stopPropagation(); lightboxPrev(); });
  lightbox.querySelector('.lightbox-next').addEventListener('click', (e) => { e.stopPropagation(); lightboxNext(); });
  lightboxImage.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') lightboxNext();
    if (e.key === 'ArrowLeft') lightboxPrev();
  });
}

document.querySelectorAll('[data-carousel]').forEach(carousel => {
  const imgs = Array.from(carousel.querySelectorAll('.carousel-img'));
  const dots = Array.from(carousel.querySelectorAll('.carousel-dot'));
  const prev = carousel.querySelector('.carousel-prev');
  const next = carousel.querySelector('.carousel-next');
  let idx = 0;
  let timer = null;

  function show(i) {
    imgs.forEach((img, n) => img.classList.toggle('active', n === i));
    dots.forEach((dot, n) => dot.classList.toggle('active', n === i));
    idx = i;
  }
  function start() {
    if (imgs.length <= 1) return;
    timer = setInterval(() => show((idx + 1) % imgs.length), 5000);
  }
  function stop() { clearInterval(timer); timer = null; }
  function restart() { stop(); start(); }

  if (imgs.length <= 1) {
    prev?.remove();
    next?.remove();
    carousel.querySelector('.carousel-dots')?.remove();
  } else {
    prev?.addEventListener('click', () => { show((idx - 1 + imgs.length) % imgs.length); restart(); });
    next?.addEventListener('click', () => { show((idx + 1) % imgs.length); restart(); });
    dots.forEach((dot, n) => dot.addEventListener('click', () => { show(n); restart(); }));
    carousel.addEventListener('mouseenter', stop);
    carousel.addEventListener('mouseleave', start);
    start();
  }

  imgs.forEach((img, i) => {
    img.addEventListener('click', () => openLightbox(imgs, i));
  });
});
