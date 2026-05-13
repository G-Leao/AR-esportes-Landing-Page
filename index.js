(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // Loading overlay
  const loadingOverlay = $('#loadingOverlay');
  const hideLoader = () => {
    if (!loadingOverlay) return;
    loadingOverlay.style.transition = 'opacity .35s ease, transform .35s ease';
    loadingOverlay.style.opacity = '0';
    loadingOverlay.style.transform = 'translateY(-6px)';
    setTimeout(() => {
      loadingOverlay.remove();
    }, 380);
  };
  window.addEventListener('load', hideLoader, { once: true });

  // Sticky header (transparent -> solid)
  const header = document.querySelector('header');
  const onScroll = () => {
    if (!header) return;
    header.classList.toggle('is-sticky', window.scrollY > 18);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile menu (keep existing behavior, but close on link click)
// Mobile menu
const burger = $('#burger');
const body = document.body;
const menu = $('#menu');

console.log('burger:', burger);
console.log('menu:', menu);
  if (burger && menu) {
    burger.addEventListener('click', () => {
      const open = body.classList.toggle('nav-open');
      burger.setAttribute('aria-expanded', String(open));
    });

    document.addEventListener('click', (e) => {
      if (!body.classList.contains('nav-open')) return;
      const clickedInside = menu.contains(e.target) || burger.contains(e.target);
      if (!clickedInside) {
        body.classList.remove('nav-open');
        burger.setAttribute('aria-expanded', 'false');
      }
    });

    $$('#menu a').forEach((a) => {
      a.addEventListener('click', () => {
        body.classList.remove('nav-open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {

  let current = '';

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 140;

    if (scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');

    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });

});

  // Smooth scroll fallback (also update URL hash)
  $$('.nav-links a[href^="#"], a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (!href || href === '#') return;
      if (!href.startsWith('#')) return;
      const target = document.querySelector(href);
      if (!target) return;

      const isExternalHash = a.getAttribute('href')?.includes('www') || a.getAttribute('href')?.includes('http');
      if (isExternalHash) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.pushState(null, '', href);
    });
  });

  // Reveal on scroll
  const revealEls = $$('[data-reveal]');
  if (revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-in');
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
    );

    revealEls.forEach((el) => io.observe(el));
  }

  // Counters
  const counterEls = $$('[data-count]');


  const animateCounter = (el) => {
    const target = Number(el.getAttribute('data-count') || '0');
    const duration = 1100;
    const start = performance.now();

    const step = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = String(Math.round(target * eased));
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  if (counterEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.35 }
    );

    counterEls.forEach((el) => io.observe(el));
  }

  // Testimonials slider
  const slider = $('.testimonials-section .slider');
  if (slider) {
    const slides = $$('.slide', slider);
    const prevBtn = $('[data-slider-prev]', slider);
    const nextBtn = $('[data-slider-next]', slider);
    const dotBtns = $$('[data-slider-dot]', slider);
    let index = 0;
    let autoplayTimer = null;

    const setActive = (i) => {
      index = (i + slides.length) % slides.length;
      slides.forEach((s, idx) => {
        s.classList.toggle('active', idx === index);
      });
      dotBtns.forEach((d, idx) => {
        d.classList.toggle('active', idx === index);
      });
    };

    const goPrev = () => setActive(index - 1);
    const goNext = () => setActive(index + 1);

    prevBtn?.addEventListener('click', goPrev);
    nextBtn?.addEventListener('click', goNext);

    dotBtns.forEach((d) => {
      d.addEventListener('click', () => {
        const i = Number(d.getAttribute('data-slider-dot')) || 0;
        setActive(i);
      });
    });

    const startAutoplay = () => {
      if (autoplayTimer) return;
      autoplayTimer = setInterval(goNext, 6500);
    };
    const stopAutoplay = () => {
      if (!autoplayTimer) return;
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    };

    slider.addEventListener('mouseenter', stopAutoplay);
    slider.addEventListener('mouseleave', startAutoplay);
    slider.addEventListener('touchstart', stopAutoplay, { passive: true });

    setActive(0);
    startAutoplay();
  }

  // CTA parallax (light)
  const ctaSection = $('#cta');
  const ctaBg = ctaSection?.querySelector('.cta-bg');
  if (ctaSection && ctaBg) {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReducedMotion) {
      const onMove = () => {
        const rect = ctaSection.getBoundingClientRect();
        const viewH = window.innerHeight || document.documentElement.clientHeight;
        // progress: -1..1
        const progress = Math.min(1, Math.max(-1, (viewH - rect.top) / (viewH + rect.height)));
        const y = progress * -18;
        ctaBg.style.transform = `translateY(${y}px)`;
      };
      let ticking = false;
      window.addEventListener('scroll', () => {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(() => {
          onMove();
          ticking = false;
        });
      }, { passive: true });
      onMove();
    }
  }

  // Footer year
  const year = $('#year');
  if (year) year.textContent = String(new Date().getFullYear());

  // Close nav open on hash navigation by keyboard
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (body.classList.contains('nav-open')) {
        body.classList.remove('nav-open');
        if (burger) burger.setAttribute('aria-expanded', 'false');
      }
    }
  });
})();

