/**
 * Eduardo Quirino — Portfólio
 * main.js — Interatividade: scroll, vídeos, filtros, navegação
 */

/* ─── DOM Ready ────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initNavScroll();
  initDotNav();
  initReveal();
  initMobileMenu();
  initPortfolio();
  initSmoothLinks();
});

/* ─── 1. Nav scroll effect ─────────────────────────── */
function initNavScroll() {
  const nav = document.querySelector('.site-nav');
  if (!nav) return;
  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ─── 2. Dot navigation + active nav links ─────────── */
function initDotNav() {
  const sections = document.querySelectorAll('section[id]');
  const dots = document.querySelectorAll('.dot');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!sections.length) return;

  const setActive = (id) => {
    dots.forEach(d => d.classList.toggle('active', d.dataset.section === id));
    navLinks.forEach(l => l.classList.toggle('active', l.dataset.section === id));
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActive(entry.target.id);
        }
      });
    },
    { threshold: 0.4 }
  );

  sections.forEach(s => observer.observe(s));
}

/* ─── 3. Reveal on scroll (Intersection Observer) ──── */
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  // Respect prefers-reduced-motion
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    els.forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
  );

  els.forEach(el => observer.observe(el));
}

/* ─── 4. Mobile burger menu ─────────────────────────── */
function initMobileMenu() {
  const burger = document.querySelector('.nav-burger');
  const links = document.querySelector('.nav-links');
  if (!burger || !links) return;

  burger.addEventListener('click', () => {
    const isOpen = links.classList.toggle('open');
    burger.setAttribute('aria-expanded', String(isOpen));
  });

  // Close on link click
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      links.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ─── 5. Portfolio: video switching + filters ───────── */
function initPortfolio() {
  const grid = document.getElementById('video-grid');
  if (!grid) return;

  const iframe = document.getElementById('main-video-iframe');
  const featuredTitle = document.getElementById('featured-title');
  const featuredDesc = document.getElementById('featured-desc');
  const featuredCat = document.querySelector('.featured-category');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const filterBtns = document.querySelectorAll('.filter-btn');

  let cards = Array.from(grid.querySelectorAll('.video-card'));
  let visibleCards = [...cards];
  let activeIndex = 0;

  /* Set featured video */
  function setFeatured(card) {
    if (!card) return;

    const videoId = card.dataset.videoId;
    const title = card.dataset.title;
    const desc = card.dataset.desc;
    const cat = card.dataset.category;

    const placeholder = document.getElementById('video-placeholder');
    const iframeTarget = document.getElementById('video-iframe-target');
    const placeholderImg = document.getElementById('placeholder-img');

    // Reset placeholder for new video
    if (placeholder) {
      placeholder.style.display = 'flex';
      if (placeholderImg && videoId && !videoId.startsWith('SUBSTITUA')) {
        placeholderImg.src = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
      }
    }

    // Clear old iframe
    if (iframeTarget) iframeTarget.innerHTML = '';

    if (featuredTitle) featuredTitle.textContent = title || '';
    if (featuredDesc) featuredDesc.textContent = desc || '';
    if (featuredCat) featuredCat.textContent = (cat || '').toUpperCase();

    // Active card styling
    cards.forEach(c => c.classList.remove('active'));
    card.classList.add('active');

    // Update active index in visible cards
    activeIndex = visibleCards.indexOf(card);

    // Setup click to load for this specific video
    const loadVideo = () => {
      if (iframeTarget && videoId && !videoId.startsWith('SUBSTITUA')) {
        iframeTarget.innerHTML = `
          <iframe 
            src="https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&autoplay=1" 
            title="${title}" 
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            allowfullscreen 
            style="position: absolute; inset: 0; width: 100%; height: 100%;">
          </iframe>`;
        if (placeholder) placeholder.style.display = 'none';
      }
    };

    // Remove old listeners and add new one
    const newPlaceholder = placeholder.cloneNode(true);
    placeholder.parentNode.replaceChild(newPlaceholder, placeholder);
    newPlaceholder.addEventListener('click', loadVideo);
  }

  /* Click on Up Next card */
  grid.addEventListener('click', (e) => {
    const card = e.target.closest('.video-card');
    if (!card) return;
    const visIdx = visibleCards.indexOf(card);
    if (visIdx !== -1) activeIndex = visIdx;
    setFeatured(card);
  });

  /* Prev / Next buttons */
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (!visibleCards.length) return;
      activeIndex = (activeIndex - 1 + visibleCards.length) % visibleCards.length;
      setFeatured(visibleCards[activeIndex]);
      visibleCards[activeIndex]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (!visibleCards.length) return;
      activeIndex = (activeIndex + 1) % visibleCards.length;
      setFeatured(visibleCards[activeIndex]);
      visibleCards[activeIndex]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    });
  }

  /* Filters */
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filter = btn.dataset.filter;

      cards.forEach(card => {
        const match = filter === 'all' || card.dataset.category === filter;
        card.style.display = match ? '' : 'none';
      });

      visibleCards = cards.filter(c => c.style.display !== 'none');
      activeIndex = 0;
      if (visibleCards.length) setFeatured(visibleCards[0]);
    });
  });
}

/* ─── 6. Smooth scroll for anchor links ─────────────── */
function initSmoothLinks() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}
