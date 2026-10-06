// ===== Navigation =====
export function initNavigation() {
  const navbar = document.getElementById('navbar');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileNav = document.getElementById('mobile-nav');
  const sections = document.querySelectorAll('section[id]');

  // Scroll -> add background to navbar
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }

    highlightActiveSection();
  }, { passive: true });

  // Mobile menu toggle
  if (mobileMenuBtn && mobileNav) {
    mobileMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      mobileMenuBtn.classList.toggle('open');
      mobileNav.classList.toggle('open');
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (mobileNav.classList.contains('open')) {
        if (!mobileNav.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
          mobileMenuBtn.classList.remove('open');
          mobileNav.classList.remove('open');
        }
      }
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
        mobileMenuBtn.classList.remove('open');
        mobileNav.classList.remove('open');
      }
    });
  }

  // Universal smooth scroll for all internal anchor links (nav, hero, buttons, back to top)
  const internalLinks = document.querySelectorAll('a[href^="#"]');
  internalLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const rawHref = link.getAttribute('href');
      if (!rawHref || rawHref === '#') return;

      e.preventDefault();
      let targetId = rawHref.substring(1);

      // Section ID aliases for Spanish / English parity
      if (targetId === 'proyectos') targetId = 'projects';
      if (targetId === 'contacto') targetId = 'contact';

      if (targetId === 'hero') {
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      } else {
        const target = document.getElementById(targetId);
        if (target) {
          const offset = navbar ? navbar.offsetHeight : 72;
          const top = target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({
            top,
            behavior: 'smooth',
          });
        }
      }

      // Close mobile menu
      if (mobileMenuBtn && mobileNav) {
        mobileMenuBtn.classList.remove('open');
        mobileNav.classList.remove('open');
      }

      // Update URL hash smoothly
      try {
        history.pushState(null, '', rawHref);
      } catch {}
    });
  });

  function highlightActiveSection() {
    if (!navbar) return;
    const scrollPos = window.scrollY + navbar.offsetHeight + 100;
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

    sections.forEach((section) => {
      const id = section.getAttribute('id');
      const top = section.offsetTop;
      const height = section.offsetHeight;

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach((link) => {
          const href = link.getAttribute('href');
          if (href === `#${id}` || (id === 'projects' && href === '#proyectos') || (id === 'contact' && href === '#contacto')) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }
}
