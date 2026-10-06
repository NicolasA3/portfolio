import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import AnimatedShaderHero from './components/ui/animated-shader-hero';

const heroTexts = {
  es: {
    trustBadge: "Especialista en Integración de IA & Desarrollo Full-Stack",
    headline: {
      line1: "Fernando",
      line2: "Adasme",
    },
    subtitle: "Desarrollador Full-Stack enfocado en Inteligencia Artificial y arquitecturas modernas. Transformo ideas complejas en experiencias digitales inteligentes, escalables y de alto impacto.",
    primaryBtn: "VER PROYECTOS",
    secondaryBtn: "CONTÁCTAME",
  },
  en: {
    trustBadge: "AI Integration Specialist & Full-Stack Developer",
    headline: {
      line1: "Fernando",
      line2: "Adasme",
    },
    subtitle: "Full-Stack Developer focused on Artificial Intelligence and modern web architectures. Transforming complex ideas into intelligent, scalable, and high-impact digital experiences.",
    primaryBtn: "VIEW PROJECTS",
    secondaryBtn: "CONTACT ME",
  },
};

const HeroApp: React.FC = () => {
  const [lang, setLang] = useState<'es' | 'en'>(() => {
    const saved = localStorage.getItem('lang');
    return saved === 'en' ? 'en' : 'es';
  });

  useEffect(() => {
    const handleLangChange = (event: any) => {
      const newLang = event.detail?.lang;
      if (newLang === 'en' || newLang === 'es') {
        setLang(newLang);
      }
    };

    window.addEventListener('languageChanged', handleLangChange);
    return () => window.removeEventListener('languageChanged', handleLangChange);
  }, []);

  const scrollToSection = (id: string) => {
    const target = document.getElementById(id);
    if (target) {
      const navbar = document.getElementById('navbar');
      const offset = navbar ? navbar.offsetHeight : 72;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({
        top,
        behavior: 'smooth',
      });
      try {
        history.pushState(null, '', `#${id}`);
      } catch {}
    }
  };

  const t = heroTexts[lang];

  return (
    <AnimatedShaderHero
      trustBadge={{
        text: t.trustBadge,
      }}
      headline={t.headline}
      subtitle={t.subtitle}
      buttons={{
        primary: {
          text: t.primaryBtn,
          onClick: () => scrollToSection('projects'),
        },
        secondary: {
          text: t.secondaryBtn,
          onClick: () => scrollToSection('contact'),
        },
      }}
    />
  );
};

const reactHeroRoot = document.getElementById('react-hero-root');
if (reactHeroRoot) {
  createRoot(reactHeroRoot).render(
    <React.StrictMode>
      <HeroApp />
    </React.StrictMode>
  );
}
