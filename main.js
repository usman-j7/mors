// Year in footer
document.addEventListener('DOMContentLoaded', () => {
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
});

// Typing effect for hero title with cycling phrases
(function heroTyping() {
  const el = document.getElementById('heroTitle');
  if (!el) return;

  const phrases = [
    'Evidence, Not Hype',
    'Built on Trust',
    'Confidential by Design',
    'For Regulated Work'
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let deleting = false;

  const typeSpeed = 90;
  const deleteSpeed = 65;
  const pauseAfterType = 1100;
  const pauseAfterDelete = 400;

  function step() {
    const current = phrases[phraseIndex];

    if (!deleting) {
      charIndex++;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        setTimeout(() => {
          deleting = true;
          step();
        }, pauseAfterType);
        return;
      }
      setTimeout(step, typeSpeed);
    } else {
      charIndex--;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        setTimeout(step, pauseAfterDelete);
        return;
      }
      setTimeout(step, deleteSpeed);
    }
  }

  setTimeout(step, 300);
})();

// Appear + Stagger
const appearEls = Array.from(
  document.querySelectorAll('.appear, .panel.appear, .banner .wrap')
);
const staggerContainers = Array.from(document.querySelectorAll('.stagger'));

const appearIO = new IntersectionObserver(
  entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -10% 0px' }
);

appearEls.forEach(el => appearIO.observe(el));
staggerContainers.forEach(el => appearIO.observe(el));

// Scroll spy for top nav (top-level)
const sections = Array.from(
  document.querySelectorAll('main section[id], .banner[id]')
);
const headerLinks = Array.from(
  document.querySelectorAll('header .primary > .nav-link[href^="#"]')
);
const linkById = new Map(
  sections.map(s => [
    s.id,
    document.querySelector(`header .primary > .nav-link[href="#${s.id}"]`)
  ])
);
let activeLink = null;

const spy = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      const link = linkById.get(id);
      if (link && activeLink !== link) {
        headerLinks.forEach(l => l.removeAttribute('aria-current'));
        link.setAttribute('aria-current', 'page');
        activeLink = link;
      }
    });
  },
  { rootMargin: '-45% 0px -50% 0px', threshold: 0.01 }
);

sections.forEach(s => spy.observe(s));

// Header hide/show + light mode on scroll
const header = document.getElementById('siteHeader');
let lastY = window.scrollY;
let ticking = false;

function onScroll() {
  const y = window.scrollY;
  const down = y > lastY;

  if (down && y > 40) {
    header.classList.add('hide');
  } else {
    header.classList.remove('hide');
  }

  if (!down && y > 80) {
    header.classList.remove('hide');
    header.classList.add('light');
  } else if (y < 40) {
    header.classList.remove('light');
  }

  lastY = y;
  ticking = false;
}

window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(onScroll);
    ticking = true;
  }
});

// WHY MORS desktop overlay
const dropdown = document.querySelector('.nav-dropdown');
const toggle = dropdown?.querySelector('.nav-toggle');
const navSub = dropdown?.querySelector('.nav-sub');

if (dropdown && toggle && navSub) {
  toggle.addEventListener('click', e => {
    // On mobile, use mobile menu instead
    if (window.innerWidth < 1024) return;
    e.stopPropagation();
    const isOpen = dropdown.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  document.addEventListener('click', e => {
    if (window.innerWidth < 1024) return;
    if (!dropdown.contains(e.target) && dropdown.classList.contains('open')) {
      dropdown.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });

  navSub.addEventListener('click', e => {
    const target = e.target;
    if (
      target instanceof HTMLElement &&
      target.matches('.nav-sub .nav-link[href^="#"]')
    ) {
      dropdown.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
}

// Mobile nav
const mobileBtn = document.getElementById('mobileMenuBtn');
const mobileNav = document.getElementById('mobileNav');

if (mobileBtn && mobileNav) {
  const mobileLinks = mobileNav.querySelectorAll('.mobile-nav-link');

  function closeMobileNav() {
    mobileNav.classList.remove('open');
    mobileBtn.classList.remove('open');
    mobileBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  mobileBtn.addEventListener('click', e => {
    e.stopPropagation();
    const willOpen = !mobileNav.classList.contains('open');
    if (willOpen) {
      mobileNav.classList.add('open');
      mobileBtn.classList.add('open');
      mobileBtn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    } else {
      closeMobileNav();
    }
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMobileNav();
    });
  });

  document.addEventListener('click', e => {
    if (
      mobileNav.classList.contains('open') &&
      !mobileNav.contains(e.target) &&
      e.target !== mobileBtn &&
      !mobileBtn.contains(e.target)
    ) {
      closeMobileNav();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth >= 1024 && mobileNav.classList.contains('open')) {
      closeMobileNav();
    }
  });
}

// Formspree async submit
const form = document.querySelector('form[action^="https://formspree.io/"]');
if (form) {
  const statusEl = form.querySelector('.form-status');
  const submitBtn = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!submitBtn) return;

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';
    if (statusEl) statusEl.textContent = '';

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      });

      if (res.ok) {
        if (statusEl) {
          statusEl.textContent =
            'Thank you. We will reply with specific options within one business day.';
        }
        form.reset();
      } else {
        throw new Error();
      }
    } catch (err) {
      if (statusEl) {
        statusEl.textContent =
          'Sorry, something went wrong. Please try again in a moment.';
      }
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send secure enquiry';
    }
  });
}
