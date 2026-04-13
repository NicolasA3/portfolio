import React from 'react';
import { createRoot } from 'react-dom/client';
import AnimatedShaderHero from './components/ui/animated-shader-hero';

const reactHeroRoot = document.getElementById('react-hero-root');
if (reactHeroRoot) {
  createRoot(reactHeroRoot).render(
    <React.StrictMode>
      <AnimatedShaderHero
        trustBadge={{
          text: "Full-Stack Developer Portfolio"
        }}
        headline={{
          line1: "Fernando",
          line2: "Adasme"
        }}
        subtitle="Full-Stack Developer · AI Integration Specialist. Transformo ideas en experiencias digitales inteligentes."
        buttons={{
          primary: {
            text: "VER PROYECTOS",
            onClick: () => { window.location.hash = "proyectos"; }
          },
          secondary: {
            text: "CONTÁCTAME",
            onClick: () => { window.location.hash = "contacto"; }
          }
        }}
      />
    </React.StrictMode>
  );
}
