// Year
document.addEventListener('DOMContentLoaded', () => {
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
});

// Typing hero
(function typeHero() {
  const el = document.getElementById('heroTitle');
  if (!el) return;
  const text = el.getAttribute('data-text') || 'Applied Intelligence';
  let i = 0;
  const tick = () => { el.textContent = text.slice(0, i++); if (i <= text.length) setTimeout(tick, 105); };
  setTimeout(tick, 250);
})();

// Appear + Stagger
const appearEls = [...document.querySelectorAll('.appear, .panel.appear, .banner .wrap')];
const staggerContainers = [...document.querySelectorAll('.stagger')];

const appearIO = new IntersectionObserver((entries) => {
  entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('in'); });
}, { threshold: 0.12, rootMargin: '0px 0px -10% 0px' });

appearEls.forEach((el) => appearIO.observe(el));
staggerContainers.forEach((el) => appearIO.observe(el));

// Scroll spy underline
const sections = [...document.querySelectorAll('main section[id], .banner[id]')];
const headerLinks = [...document.querySelectorAll('header .nav-link[href^="#"]')];
const linkById = new Map(sections.map((s) => [s.id, document.querySelector(`header a[href="#${s.id}"]`)]));
let activeLink = null;

const spy = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const id = entry.target.id;
    const link = linkById.get(id);
    if (link && activeLink !== link) {
      headerLinks.forEach((l) => l.removeAttribute('aria-current'));
      link.setAttribute('aria-current','page');
      activeLink = link;
    }
  });
}, { rootMargin: '-45% 0px -50% 0px', threshold: 0.01 });

sections.forEach((s) => spy.observe(s));

// Header hide/show
const header = document.getElementById('siteHeader');
let lastY = window.scrollY, ticking = false;
function onScroll() {
  const y = window.scrollY, down = y > lastY;
  if (down && y > 40) header.classList.add('hide'); else header.classList.remove('hide');
  if (!down && y > 80) { header.classList.remove('hide'); header.classList.add('light'); }
  else if (y < 40) { header.classList.remove('light'); }
  lastY = y; ticking = false;
}
window.addEventListener('scroll', () => { if (!ticking){ requestAnimationFrame(onScroll); ticking = true; }});

// Formspree async submit UX
const form = document.querySelector('form[action^="https://formspree.io/"]');
if (form) {
  const status = form.querySelector('.form-status');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btnEl = form.querySelector('button[type="submit"]');
    if (!btnEl) return;
    const originalText = btnEl.textContent;
    btnEl.disabled = true; btnEl.textContent = 'Sending…';
    if (status) status.textContent = '';
    try {
      const res = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { 'Accept': 'application/json' }});
      if (res.ok) {
        form.innerHTML = `
          <div class="lead" style="padding:20px;border-radius:14px;background:rgba(0,0,0,0.05);max-width:640px;">
            Thank you — your secure enquiry has been received. We will respond within one business day.
          </div>`;
      } else { throw new Error(); }
    } catch {
      btnEl.disabled = false; btnEl.textContent = originalText;
      if (status) status.textContent = 'Sorry, something went wrong. Please email contact@morsglobal.com and we will assist right away.';
    }
  });
}
