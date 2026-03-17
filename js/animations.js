// ===== Scroll Reveal & Animations =====
export function initAnimations() {
  // Scroll reveal via IntersectionObserver
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    }
  );

  revealElements.forEach((el) => observer.observe(el));

  // Counter animation
  const counters = document.querySelectorAll('[data-count]');
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((el) => counterObserver.observe(el));

  function animateCounter(el) {
    const target = parseInt(el.dataset.count, 10);
    const duration = 1500;
    const start = performance.now();

    function update(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = Math.round(eased * target) + '+';

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  // Typewriter effect
  initTypewriter();
}

function initTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;

  const lang = document.documentElement.lang || 'es';

  const phrases = {
    es: [
      'Transformo ideas en experiencias digitales inteligentes',
      'Automatizo procesos con Inteligencia Artificial',
      'Creo aplicaciones web intuitivas y profesionales',
      'Resuelvo problemas de manera inteligente',
    ],
    en: [
      'I transform ideas into intelligent digital experiences',
      'I automate processes with Artificial Intelligence',
      'I create intuitive and professional web applications',
      'I solve problems in smart and efficient ways',
    ],
  };

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const currentLang = () => document.documentElement.lang || 'es';

  function type() {
    const currentPhrases = phrases[currentLang()] || phrases.es;
    const currentPhrase = currentPhrases[phraseIndex % currentPhrases.length];

    if (isDeleting) {
      el.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
    } else {
      el.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
    }

    let speed = isDeleting ? 30 : 60;

    if (!isDeleting && charIndex === currentPhrase.length) {
      speed = 2000; // Pause at end
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex++;
      speed = 500; // Pause before next phrase
    }

    setTimeout(type, speed);
  }

  // Start after a small delay
  setTimeout(type, 1000);
}
