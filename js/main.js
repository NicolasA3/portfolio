// ===== Main Entry Point =====
import { initStarfield } from './starfield.js';
import { initCursor } from './cursor.js';
import { initAnimations } from './animations.js';
import { initI18n } from './i18n.js';
import { initNavigation } from './navigation.js';
import { initContact } from './contact.js';
import { initTilt3D } from './tilt3d.js';

// Initialize all modules when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  initStarfield();
  initCursor();
  initAnimations();
  initI18n();
  initNavigation();
  initContact();
  initTilt3D();

  // Remove loading state
  document.body.classList.add('loaded');

  console.log('🚀 Portfolio initialized — Fernando Adasme');
});
