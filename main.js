// Year
document.addEventListener('DOMContentLoaded', () => {
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
});

// Typing hero
(function typeHero() {
  const el = document.getElementById('heroTitle');
  if (!el) return;
  const text = el.getAttribute('data-text') || 'Built On Trust';
  let i = 0;
  const tick = () => { el.textContent = text.slice(0, i++); if (i <= text.length) setTimeout(tick, 95); };
  setTimeout(tick, 250);
})();

// Appear + Stagger
const appearEls = [...document.querySelectorAll('.appear, .panel.appear, .footer-search, .banner .wrap, .contact-wrap')];
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

// Footer site search (in-page)
const input = document.getElementById('siteSearchInput');
const btn = document.getElementById('siteSearchBtn');
const resultsBox = document.getElementById('siteSearchResults');

let siteIndex = [];
function buildIndex() {
  siteIndex = [];
  document.querySelectorAll('section[id], .banner[id]').forEach((sec) => {
    const id = sec.id;
    const title = sec.querySelector('h1,h2')?.textContent?.trim() || id;
    const textBits = [];
    (sec.querySelectorAll('p,li,h3') || []).forEach(n => textBits.push(n.textContent.trim()));
    const blob = (title + ' ' + textBits.join(' ')).toLowerCase();
    siteIndex.push({ title, href: `#${id}`, blob });

    sec.querySelectorAll('h3')?.forEach((h3) => {
      const t = h3.textContent.trim();
      siteIndex.push({ title: `${t} — ${title}`, href: `#${id}`, blob: (t + ' ' + blob).toLowerCase() });
    });
  });
}
buildIndex();

function renderResults(q) {
  if (!resultsBox) return;
  const query = (q || '').trim().toLowerCase();
  if (!query) { resultsBox.innerHTML = ''; return; }
  const hits = siteIndex.filter(i => i.blob.includes(query)).slice(0, 12);
  resultsBox.innerHTML = hits.length
    ? hits.map(h => `<a href="${h.href}">${h.title}</a>`).join('')
    : `<div>No results for “${q}”.</div>`;
}

btn?.addEventListener('click', () => renderResults(input?.value));
input?.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    if (!resultsBox?.querySelector('a')) renderResults(input.value);
    const first = resultsBox?.querySelector('a');
    if (first) first.click();
  }
});
input?.addEventListener('input', (e) => {
  if (e.target.value.trim().length >= 2) renderResults(e.target.value);
  else resultsBox.innerHTML = '';
});

// Formspree async submit UX
const form = document.querySelector('form[action^="https://formspree.io/"]');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btnEl = form.querySelector('button[type="submit"]');
    btnEl.disabled = true; btnEl.textContent = 'Sending…';
    try {
      const res = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { 'Accept': 'application/json' }});
      if (res.ok) {
        form.innerHTML = `
          <p class="lead" style="padding:18px;border-radius:14px;background:rgba(0,0,0,.06);color:#000">
            Thank you — your message has been sent. We’ll respond within one business day.
          </p>`;
      } else { throw new Error(); }
    } catch {
      btnEl.disabled = false; btnEl.textContent = 'Submit';
      alert('Sorry, something went wrong. Please email us directly.');
    }
  });
}
