/**
 * Eduardo Quirino — Portfólio
 * main.js — Interatividade Premium
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavScroll();
  initDotNav();
  initReveal();
  initMobileMenu();
  initPortfolioBento();
  initVideoModal();
  initDirectorAesthetic();
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
          // We don't unobserve to allow re-animating when filtering
        } else {
          // Removed logic to hide to keep it simple, but could be used for scroll-out animations
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
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

  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      links.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ─── 5. Bento Portfolio Logic ──────────────────────── */
function initPortfolioBento() {
  const grid = document.getElementById('portfolio-grid');
  const filterBtns = document.querySelectorAll('.filter-btn');
  if (!grid) return;

  const items = Array.from(grid.querySelectorAll('.bento-item'));

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filter = btn.dataset.filter;

      items.forEach(item => {
        const match = filter === 'all' || item.dataset.category === filter;
        if (match) {
          item.style.display = 'flex';
          // Re-trigger reveal animation
          setTimeout(() => item.classList.add('visible'), 50);
        } else {
          item.style.display = 'none';
          item.classList.remove('visible');
        }
      });
    });
  });
}

/* ─── 6. Video Modal Logic ─────────────────────────── */
function initVideoModal() {
  const modal = document.getElementById('video-modal');
  const videoTarget = document.getElementById('modal-video-target');
  const modalTitle = document.getElementById('modal-title');
  const modalDesc = document.getElementById('modal-desc');
  const bentoItems = document.querySelectorAll('.bento-item');
  const closeBtn = document.querySelector('.modal-close');
  const backdrop = document.querySelector('.modal-backdrop');

  if (!modal || !videoTarget) return;

  const openModal = (item) => {
    const videoId = item.dataset.videoId;
    const title = item.querySelector('.bento-title').textContent;
    const desc = item.querySelector('.bento-desc')?.textContent || '';

    if (!videoId) return;

    modalTitle.textContent = title;
    modalDesc.textContent = desc;

    videoTarget.innerHTML = `
            <iframe 
                src="https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&autoplay=1" 
                frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowfullscreen>
            </iframe>`;

    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modal.setAttribute('aria-hidden', 'true');
    videoTarget.innerHTML = '';
    document.body.style.overflow = '';
  };

  bentoItems.forEach(item => {
    item.addEventListener('click', () => openModal(item));
  });

  closeBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') {
      closeModal();
    }
  });
}

/* ─── 7. Director Aesthetic (Timecode Animation) ───── */
function initDirectorAesthetic() {
  const tcElements = document.querySelectorAll('.timecode');
  if (!tcElements.length) return;

  setInterval(() => {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');
    const ff = String(Math.floor(Math.random() * 30)).padStart(2, '0');

    tcElements.forEach(el => {
      el.textContent = `${hh}:${mm}:${ss}:${ff}`;
    });
  }, 33); // ~30 fps
}

/* ─── 8. Smooth scroll ─────────────────────────────── */
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
