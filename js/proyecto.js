// ===== Project Detail Controller =====
import { initStarfield } from './starfield.js';
import { initCursor } from './cursor.js';
import { initI18n, getCurrentLang } from './i18n.js';

const projectsData = {
  'ezer-pme': {
    title: 'Ezer PME',
    tech: ['Python', 'Flask', 'React', 'OpenAI', 'Azure', 'Redis'],
    github: null, // private
    live: null,
    images: [
      '/images/ezer-pme/Captura de pantalla 2026-03-16 191517.png',
      '/images/ezer-pme/Captura de pantalla 2026-03-16 191615.png',
      '/images/ezer-pme/Captura de pantalla 2026-03-16 191654.png',
      '/images/ezer-pme/Captura de pantalla 2026-03-16 191736.png'
    ],
    descKey: 'projects.ezer-pme.desc'
  },
  'ezer-utp': {
    title: 'Ezer UTP',
    tech: ['React 19', 'Flask', 'OpenAI', 'Azure', 'Supabase', 'Tailwind'],
    github: null,
    live: null,
    images: [
      '/images/ezer-utp/Captura de pantalla 2026-03-16 191953.png',
      '/images/ezer-utp/Captura de pantalla 2026-03-16 192011.png',
      '/images/ezer-utp/Captura de pantalla 2026-03-16 192032.png',
      '/images/ezer-utp/Captura de pantalla 2026-03-16 192058.png'
    ],
    descKey: 'projects.ezer-utp.desc'
  },
  'floreria-esperanza': {
    title: 'Florería Esperanza',
    tech: ['React 19', 'Supabase', 'Vercel', 'Framer Motion', 'Tailwind'],
    github: null,
    live: 'https://floreriaesperanza.com',
    images: [
      '/images/floreria-esperanza/Captura de pantalla 2026-03-16 192707.png',
      '/images/floreria-esperanza/Captura de pantalla 2026-03-16 192738.png',
      '/images/floreria-esperanza/Captura de pantalla 2026-03-16 192758.png'
    ],
    descKey: 'projects.floreria.desc'
  },
  'frahda-studio': {
    title: 'Frahda Studio',
    tech: ['Django', 'React', 'PostgreSQL', 'Webpay', 'PayPal', 'Supabase'],
    github: null,
    live: 'https://www.frahdastudio.com',
    images: [
      '/images/frahda-studio/Captura de pantalla 2026-03-16 193919.png',
      '/images/frahda-studio/Captura de pantalla 2026-03-16 193945.png',
      '/images/frahda-studio/Captura de pantalla 2026-03-16 194010.png',
      '/images/frahda-studio/Captura de pantalla 2026-03-16 194039.png'
    ],
    descKey: 'projects.frahda.desc'
  },
  'eslainer': {
    title: 'Transportes Eslainer',
    tech: ['React', 'Tailwind CSS', 'Vite'],
    github: null,
    live: 'https://www.transporteseslainer.cl',
    images: [
      '/images/eslainer/foto-principal.png',
      '/images/eslainer/Captura de pantalla 2026-07-01 203839.png',
      '/images/eslainer/Captura de pantalla 2026-07-01 203905.png',
      '/images/eslainer/Captura de pantalla 2026-07-01 204014.png'
    ],
    descKey: 'projects.eslainer.desc'
  }
};

document.addEventListener('DOMContentLoaded', () => {
  // Initialize shared layout visual modules
  initStarfield();
  initCursor();
  initI18n(); // Translates DOM elements with data-i18n

  // Add scroll class to navbar
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Get project from URL query param
  const urlParams = new URLSearchParams(window.location.search);
  const projectId = urlParams.get('id');

  if (!projectId || !projectsData[projectId]) {
    // Redirect to home if project is invalid or not specified
    window.location.href = '/index.html';
    return;
  }

  const project = projectsData[projectId];
  loadProjectDetails(project);
});

function loadProjectDetails(project) {
  // Set Title
  document.getElementById('project-title').textContent = project.title;

  // Set Description with data-i18n key for automatic i18n updates
  const descEl = document.getElementById('project-description');
  descEl.dataset.i18n = project.descKey;
  
  // Trigger initial translation manually since initI18n was run before setting dataset
  const savedLang = localStorage.getItem('lang') || 'es';
  // We can fetch translations using the shared translations object
  import('./i18n.js').then(({ translations }) => {
    descEl.textContent = translations[savedLang]?.[project.descKey] || '';
  });

  // Load Technology badges
  const techContainer = document.getElementById('project-tech');
  techContainer.innerHTML = '';
  project.tech.forEach(tech => {
    const badge = document.createElement('span');
    badge.className = 'tech-badge';
    badge.textContent = tech;
    techContainer.appendChild(badge);
  });

  // Load Links (Live, GitHub or Private)
  const linksContainer = document.getElementById('project-links-container');
  linksContainer.innerHTML = '';

  if (project.live) {
    const liveLink = document.createElement('a');
    liveLink.href = project.live;
    liveLink.target = '_blank';
    liveLink.rel = 'noopener';
    liveLink.className = 'project-link project-link-live';
    liveLink.dataset.i18n = 'project.visit';
    liveLink.textContent = savedLang === 'es' ? '🌐 Ver Sitio' : '🌐 View Live';
    linksContainer.appendChild(liveLink);
  }

  if (project.github) {
    const githubLink = document.createElement('a');
    githubLink.href = project.github;
    githubLink.target = '_blank';
    githubLink.rel = 'noopener';
    githubLink.className = 'project-link project-link-github';
    githubLink.dataset.i18n = 'project.github';
    githubLink.textContent = '🐙 GitHub';
    linksContainer.appendChild(githubLink);
  } else {
    const privateBadge = document.createElement('span');
    privateBadge.className = 'project-link project-link-github';
    privateBadge.dataset.i18n = 'projects.private';
    privateBadge.textContent = savedLang === 'es' ? '🔒 Privado' : '🔒 Private';
    linksContainer.appendChild(privateBadge);
  }

  // Load Gallery Grid
  const galleryGrid = document.getElementById('gallery-grid');
  galleryGrid.innerHTML = '';

  project.images.forEach((imgUrl, index) => {
    const galleryItem = document.createElement('div');
    galleryItem.className = 'glass-card gallery-item';
    galleryItem.innerHTML = `
      <img src="${imgUrl}" alt="${project.title} screenshot ${index + 1}" loading="lazy" />
      <div class="gallery-item-overlay">
        <div class="gallery-icon-zoom">🔍</div>
      </div>
    `;

    galleryItem.addEventListener('click', () => {
      openLightbox(project.images, index);
    });

    galleryGrid.appendChild(galleryItem);
  });
}

// ===================== LIGHTBOX FUNCTIONALITY =====================
let currentImages = [];
let currentImgIndex = 0;

function openLightbox(images, index) {
  currentImages = images;
  currentImgIndex = index;

  const lightbox = document.getElementById('lightbox');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden'; // Disable page scrolling

  updateLightboxContent();

  // Attach Lightbox event listeners
  const closeBtn = document.getElementById('lightbox-close');
  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');

  closeBtn.addEventListener('click', closeLightbox);
  prevBtn.addEventListener('click', showPrevImage);
  nextBtn.addEventListener('click', showNextImage);
  lightbox.addEventListener('click', onOverlayClick);
  document.addEventListener('keydown', onKeyDown);
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = ''; // Re-enable page scrolling

  // Remove Event listeners
  document.removeEventListener('keydown', onKeyDown);
}

function updateLightboxContent() {
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');

  lightboxImg.src = currentImages[currentImgIndex];
  
  const currentLang = localStorage.getItem('lang') || 'es';
  const textOf = currentLang === 'es' ? 'de' : 'of';
  lightboxCaption.textContent = `${currentImgIndex + 1} ${textOf} ${currentImages.length}`;
}

function showPrevImage(e) {
  if (e) e.stopPropagation();
  currentImgIndex = (currentImgIndex - 1 + currentImages.length) % currentImages.length;
  updateLightboxContent();
}

function showNextImage(e) {
  if (e) e.stopPropagation();
  currentImgIndex = (currentImgIndex + 1) % currentImages.length;
  updateLightboxContent();
}

function onOverlayClick(e) {
  if (e.target.id === 'lightbox' || e.target.classList.contains('lightbox-content')) {
    closeLightbox();
  }
}

function onKeyDown(e) {
  if (e.key === 'Escape') {
    closeLightbox();
  } else if (e.key === 'ArrowLeft') {
    showPrevImage();
  } else if (e.key === 'ArrowRight') {
    showNextImage();
  }
}
