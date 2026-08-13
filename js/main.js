// ---------- mobile nav ----------
function initMobileNav() {
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.getElementById('nav-menu');
  if (!header || !toggle || !menu) return;

  const setOpen = (open) => {
    header.classList.toggle('nav-open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };

  toggle.addEventListener('click', () => {
    setOpen(!header.classList.contains('nav-open'));
  });

  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => setOpen(false));
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') setOpen(false);
  });

  document.addEventListener('click', e => {
    if (!header.classList.contains('nav-open')) return;
    if (!header.contains(e.target)) setOpen(false);
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) setOpen(false);
  });
}

// ---------- before/after sliders ----------
function initBaSliders() {
  document.querySelectorAll('.ba-slider').forEach(slider => {
    const range = slider.querySelector('.ba-range');
    const beforeWrap = slider.querySelector('.ba-before-wrap');
    const beforeImg = slider.querySelector('.ba-before-wrap img');
    const handle = slider.querySelector('.ba-handle');

    if (beforeImg) {
      beforeImg.style.filter = 'grayscale(0.35) brightness(0.94)';
      beforeImg.style.webkitFilter = 'grayscale(0.35) brightness(0.94)';
    }

    function setPos(pct) {
      pct = Math.max(0, Math.min(100, pct));
      beforeWrap.style.width = pct + '%';
      beforeImg.style.width = (10000 / pct) + '%';
      handle.style.left = pct + '%';
    }

    if (range) {
      range.addEventListener('input', e => setPos(Number(e.target.value)));
      setPos(Number(range.value));
    }

    // smoother drag directly on the frame
    let dragging = false;
    const move = (clientX) => {
      const rect = slider.getBoundingClientRect();
      const pct = ((clientX - rect.left) / rect.width) * 100;
      setPos(pct);
      if (range) range.value = pct;
    };
    slider.addEventListener('pointerdown', e => { dragging = true; move(e.clientX); });
    window.addEventListener('pointermove', e => { if (dragging) move(e.clientX); });
    window.addEventListener('pointerup', () => dragging = false);
  });
}

// ---------- gallery filter (gallery.html) ----------
function initFilters() {
  const bar = document.querySelector('.filter-bar');
  if (!bar) return;
  const buttons = bar.querySelectorAll('button');
  const items = document.querySelectorAll('[data-cat]');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.filter;
      items.forEach(item => {
        const show = cat === 'all' || item.dataset.cat === cat;
        item.style.display = show ? '' : 'none';
      });
    });
  });
}

// ---------- lightbox ----------
function initLightbox() {
  const lb = document.getElementById('lightbox');
  if (!lb) return;
  const lbImg = lb.querySelector('img');
  const lbCap = lb.querySelector('.lb-cap');
  document.querySelectorAll('.mosaic figure').forEach(fig => {
    fig.addEventListener('click', () => {
      const img = fig.querySelector('img');
      lbImg.src = img.src;
      lbImg.alt = img.alt;
      lbCap.textContent = img.alt || '';
      lb.classList.add('open');
    });
  });
  lb.querySelector('.lb-close').addEventListener('click', () => lb.classList.remove('open'));
  lb.addEventListener('click', e => { if (e.target === lb) lb.classList.remove('open'); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') lb.classList.remove('open'); });
}

// ---------- contact form ----------
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(form);
    const lines = [
      'New quote request from the website:',
      '',
      'Name: ' + data.get('name'),
      'Phone: ' + data.get('phone'),
      'Email: ' + data.get('email'),
      'Service: ' + data.get('service'),
      'Address: ' + data.get('address') + ', ' + data.get('city'),
      '',
      'Notes:',
      data.get('notes')
    ].join('\n');
    const subject = encodeURIComponent('Quote request — ' + data.get('name'));
    const body = encodeURIComponent(lines);
    window.location.href = `mailto:Greenmagiclawncare@outlook.com?subject=${subject}&body=${body}`;
  });
}

// ---------- hero background slideshow ----------
function initHeroSlideshow() {
  const slides = document.querySelectorAll('.hero-slide');
  if (slides.length < 2) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let index = 0;
  setInterval(() => {
    slides[index].classList.remove('is-active');
    index = (index + 1) % slides.length;
    slides[index].classList.add('is-active');
  }, 5000);
}

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initHeroSlideshow();
  initBaSliders();
  initFilters();
  initLightbox();
  initContactForm();
});
