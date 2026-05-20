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

/* =========================
   FORM VALIDATION
========================= */

const form =
  document.querySelector('.contact-form');

if(form){

  const fields =
    form.querySelectorAll(
      'input, textarea'
    );

  const validators = {

    nome(value){
      return value.trim().length >= 3;
    },

    email(value){
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    },

    telefone(value){
      return value.replace(/\D/g, '')
        .length >= 10;
    },

    mensagem(value){
      return value.trim().length >= 10;
    }

  };

  const updateFieldState = (
    field,
    valid,
    message
  ) => {

    const msg =
      field.parentElement.querySelector(
        '.input-message'
      );

    field.classList.remove(
      'is-valid',
      'is-invalid'
    );

    msg.classList.remove(
      'success',
      'error'
    );

    if(field.value.trim() === ''){

      msg.textContent = '';

      return;
    }

    if(valid){

      field.classList.add('is-valid');

      msg.classList.add('success');

    }else{

      field.classList.add('is-invalid');

      msg.classList.add('error');
    }

    msg.textContent = message;
  };

  fields.forEach((field) => {

    field.addEventListener(
      'input',
      () => {

        const name =
          field.name;

        const validator =
          validators[name];

        if(!validator) return;

        const valid =
          validator(field.value);

        let message = '';

        if(valid){

          message = 'Campo válido';

        }else{

          switch(name){

            case 'nome':
              message =
                'Digite ao menos 3 letras';
            break;

            case 'email':
              message =
                'Digite um email válido';
            break;

            case 'telefone':
              message =
                'Telefone inválido';
            break;

            case 'mensagem':
              message =
                'Mínimo de 10 caracteres';
            break;
          }

        }

        updateFieldState(
          field,
          valid,
          message
        );

      }
    );

  });

  /* =========================
     FORM SUBMIT
  ========================= */

  form.addEventListener(
    'submit',
    async (e) => {

      e.preventDefault();

      let hasError = false;

      fields.forEach((field) => {

        const name =
          field.name;

        const validator =
          validators[name];

        if(!validator) return;

        const valid =
          validator(field.value);

        if(!valid){

          hasError = true;

          field.classList.add(
            'is-invalid'
          );

        }

      });

      if(hasError) return;

      const button =
        form.querySelector(
          'button'
        );

      const originalText =
        button.innerHTML;

      button.disabled = true;

      button.innerHTML =
        'Enviando...';

      try{

        const formData =
          new FormData(form);

        const response =
          await fetch(form.action, {

            method:'POST',

            body: formData,

            headers:{
              'Accept':'application/json'
            }

          });

        if(response.ok){

          /* RESETA */

          form.reset();

          /* LIMPA ESTADOS */

          fields.forEach((field) => {

            field.classList.remove(
              'is-valid',
              'is-invalid'
            );

            const msg =
              field.parentElement.querySelector(
                '.input-message'
              );

            if(msg){

              msg.textContent = '';

              msg.classList.remove(
                'success',
                'error'
              );

            }

          });

          /* FEEDBACK */

          button.innerHTML =
            'Recebemos sua resposta ✓';

          button.classList.add(
            'is-success'
          );

          setTimeout(() => {

            button.innerHTML =
              originalText;

            button.disabled = false;

            button.classList.remove(
              'is-success'
            );

          }, 4000);

        }else{

          button.innerHTML =
            'Erro ao enviar';

          button.disabled = false;
        }

      }catch(err){

        button.innerHTML =
          'Erro de conexão';

        button.disabled = false;
      }

    }
  );

}

})();
