"use client";

import React, { useState, useEffect } from "react";
import { CardStack, CardStackItem } from "./card-stack";
import { ArrowUpRight, ExternalLink, Sparkles, Lock } from "lucide-react";

interface ProjectItem extends CardStackItem {
  id: string;
  title: string;
  subtitle: { es: string; en: string };
  description: { es: string; en: string };
  imageSrc: string;
  detailHref: string;
  liveHref?: string;
  tag: { es: string; en: string };
  tech: string[];
  isAi?: boolean;
}

const portfolioProjects: ProjectItem[] = [
  {
    id: "ezer-pme",
    title: "Ezer PME",
    subtitle: {
      es: "Plataforma Educativa con Inteligencia Artificial",
      en: "Educational Platform with Artificial Intelligence",
    },
    description: {
      es: "Plataforma para la gestión inteligente del Plan de Mejoramiento Escolar. Generador de acciones con justificación pedagógica y normativa automática con IA.",
      en: "Intelligent school improvement management platform. Automated action generator with regulatory and pedagogical AI justifications.",
    },
    imageSrc: "/images/ezer-pme/Captura de pantalla 2026-03-16 191517.png",
    detailHref: "/proyecto.html?id=ezer-pme",
    tag: { es: "✦ IA Educativa & Mineduc", en: "✦ Educational AI & SaaS" },
    tech: ["OpenAI", "Python", "Flask", "React", "Azure", "Redis"],
    isAi: true,
  },
  {
    id: "ezer-utp",
    title: "Ezer UTP",
    subtitle: {
      es: "Optimización y Coherencia Curricular con IA",
      en: "Curricular Optimization & Analysis with AI",
    },
    description: {
      es: "Optimización de la planificación pedagógica. Retroalimentación instantánea sobre coherencia curricular y generación automática de material didáctico basado en OA.",
      en: "Pedagogical planning optimization with instant curricular feedback and automated teaching material generation based on learning objectives.",
    },
    imageSrc: "/images/ezer-utp/Captura de pantalla 2026-03-16 191953.png",
    detailHref: "/proyecto.html?id=ezer-utp",
    tag: { es: "✦ Copiloto Curricular", en: "✦ Curricular Copilot" },
    tech: ["OpenAI", "React 19", "Flask", "Azure", "Supabase", "Tailwind"],
    isAi: true,
  },
  {
    id: "floreria-esperanza",
    title: "Florería Esperanza",
    subtitle: {
      es: "Catálogo Web & Plataforma Serverless",
      en: "Web Catalog & Serverless E-Commerce",
    },
    description: {
      es: "App Web de catálogo para una florería con panel de administración, gestión de productos y API serverless de alta velocidad.",
      en: "Product catalog and administration web application with high-speed serverless backend and real-time inventory management.",
    },
    imageSrc: "/images/floreria-esperanza/Captura de pantalla 2026-03-16 192707.png",
    detailHref: "/proyecto.html?id=floreria-esperanza",
    liveHref: "https://floreriaesperanza.com",
    tag: { es: "✦ Catálogo & E-Commerce", en: "✦ E-Commerce & CMS" },
    tech: ["React 19", "Supabase", "Vercel", "Tailwind", "Framer Motion"],
    isAi: false,
  },
  {
    id: "frahda-studio",
    title: "FrahdaStudio",
    subtitle: {
      es: "SaaS de Gestión & Pasarela Integrada",
      en: "Salon SaaS & Integrated Payments",
    },
    description: {
      es: "App Web completa para un salón de belleza: gestión de clientes, pagos, agenda, servicios, tienda con portal de pago integrado (Getnet, Webpay, PayPal).",
      en: "Comprehensive beauty salon web application: booking engine, client CRM, multi-gateway payments (Webpay, Getnet, PayPal), and online store.",
    },
    imageSrc: "/images/frahda-studio/Captura de pantalla 2026-03-16 193919.png",
    detailHref: "/proyecto.html?id=frahda-studio",
    liveHref: "https://www.frahdastudio.com",
    tag: { es: "✦ SaaS de Gestión & Pagos", en: "✦ SaaS & Payment Engine" },
    tech: ["Django", "React", "PostgreSQL", "Webpay", "PayPal", "Supabase"],
    isAi: false,
  },
  {
    id: "eslainer",
    title: "Transportes Eslainer",
    subtitle: {
      es: "Landing Corporativa con Scroll-Driven Motion",
      en: "Corporate Landing with Scroll-Driven Motion",
    },
    description: {
      es: "Landing Page interactiva con animaciones guiadas por scroll, carrusel de servicios, botones CTA y presentación de flota empresarial.",
      en: "Interactive high-performance landing page featuring scroll-driven animations, service showcase, and certified partner carousels.",
    },
    imageSrc: "/images/eslainer/foto-principal.png",
    detailHref: "/proyecto.html?id=eslainer",
    liveHref: "https://www.transporteseslainer.cl",
    tag: { es: "✦ Landing Corporativa", en: "✦ Corporate Motion" },
    tech: ["React", "Tailwind CSS", "Vite", "Scroll Animations"],
    isAi: false,
  },
];

export const ProjectsShowcase: React.FC = () => {
  const [lang, setLang] = useState<"es" | "en">(() => {
    const saved = localStorage.getItem("lang");
    return saved === "en" ? "en" : "es";
  });

  const [activeIndex, setActiveIndex] = useState(0);
  const [cardDims, setCardDims] = useState({ width: 520, height: 320 });

  useEffect(() => {
    const handleLang = (e: any) => {
      const newL = e.detail?.lang;
      if (newL === "es" || newL === "en") setLang(newL);
    };

    const handleResize = () => {
      const w = window.innerWidth;
      if (w < 480) {
        setCardDims({ width: Math.min(320, w - 32), height: 230 });
      } else if (w < 768) {
        setCardDims({ width: Math.min(440, w - 48), height: 280 });
      } else {
        setCardDims({ width: 520, height: 320 });
      }
    };

    handleResize();
    window.addEventListener("languageChanged", handleLang);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("languageChanged", handleLang);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const activeProject = portfolioProjects[activeIndex] || portfolioProjects[0];

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: "relative",
      }}
    >
      {/* 3D Stack Stage */}
      <div style={{ width: "100%", maxWidth: "1000px" }}>
        <CardStack
          items={portfolioProjects}
          initialIndex={0}
          cardWidth={cardDims.width}
          cardHeight={cardDims.height}
          overlap={0.52}
          spreadDeg={20}
          perspectivePx={1100}
          depthPx={90}
          autoAdvance={false}
          showDots={true}
          showArrows={true}
          onChangeIndex={(idx) => setActiveIndex(idx)}
          renderCard={(item, { active }) => {
            const proj = item as ProjectItem;
            return (
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  height: "100%",
                  backgroundColor: "#111827",
                  overflow: "hidden",
                  borderRadius: "16px",
                }}
              >
                {/* Background Image */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <img
                    src={proj.imageSrc}
                    alt={proj.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                      transition: "transform 0.6s ease",
                    }}
                    draggable={false}
                  />
                </div>

                {/* Cyber Gradient Overlay */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(to top, #090D16 0%, rgba(17, 24, 39, 0.75) 55%, transparent 100%)",
                    pointerEvents: "none",
                  }}
                />

                {/* Top Badge: AI / Category & Counter */}
                <div
                  style={{
                    position: "absolute",
                    top: "14px",
                    left: "14px",
                    right: "14px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    zIndex: 10,
                    pointerEvents: "none",
                  }}
                >
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "4px 12px",
                      borderRadius: "9999px",
                      fontSize: "11px",
                      fontFamily: "var(--font-mono)",
                      fontWeight: 600,
                      backdropFilter: "blur(10px)",
                      backgroundColor: proj.isAi
                        ? "rgba(17, 24, 39, 0.9)"
                        : "rgba(17, 24, 39, 0.85)",
                      border: proj.isAi
                        ? "1px solid rgba(163, 230, 53, 0.6)"
                        : "1px solid rgba(255, 255, 255, 0.15)",
                      color: proj.isAi ? "#A3E635" : "#F3F4F6",
                      boxShadow: proj.isAi
                        ? "0 0 12px rgba(163, 230, 53, 0.3)"
                        : "none",
                    }}
                  >
                    {proj.isAi && <Sparkles style={{ width: "12px", height: "12px", color: "#A3E635" }} />}
                    {proj.tag[lang]}
                  </span>

                  <span
                    style={{
                      fontSize: "11px",
                      fontFamily: "var(--font-mono)",
                      padding: "3px 8px",
                      borderRadius: "6px",
                      backgroundColor: "rgba(17, 24, 39, 0.8)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      color: "#94A3B8",
                      backdropFilter: "blur(8px)",
                    }}
                  >
                    0{portfolioProjects.indexOf(proj) + 1} / 0{portfolioProjects.length}
                  </span>
                </div>

                {/* Bottom Content pinned inside card */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: "18px 20px",
                    zIndex: 10,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                  }}
                >
                  <h3
                    style={{
                      margin: 0,
                      fontSize: "22px",
                      fontWeight: 800,
                      fontFamily: "var(--font-heading)",
                      color: "#F3F4F6",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {proj.title}
                  </h3>

                  <p
                    style={{
                      margin: "4px 0 10px 0",
                      fontSize: "12px",
                      color: "#CBD5E1",
                      lineHeight: 1.45,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {proj.description[lang]}
                  </p>

                  {/* Micro Tech Tags */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {proj.tech.slice(0, 4).map((t, idx) => (
                      <span
                        key={idx}
                        style={{
                          fontSize: "10px",
                          fontFamily: "var(--font-mono)",
                          padding: "2px 8px",
                          borderRadius: "9999px",
                          backgroundColor: "rgba(0, 0, 0, 0.5)",
                          border: "1px solid rgba(255, 255, 255, 0.12)",
                          color: "#F3F4F6",
                          backdropFilter: "blur(6px)",
                        }}
                      >
                        {t}
                      </span>
                    ))}
                    {proj.tech.length > 4 && (
                      <span
                        style={{
                          fontSize: "10px",
                          fontFamily: "var(--font-mono)",
                          padding: "2px 6px",
                          borderRadius: "9999px",
                          backgroundColor: "rgba(0, 0, 0, 0.5)",
                          color: "#A3E635",
                        }}
                      >
                        +{proj.tech.length - 4}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          }}
        />
      </div>

      {/* Active Project Minimalist Control & Action Card */}
      <div
        style={{
          width: "100%",
          maxWidth: "780px",
          marginTop: "24px",
          padding: "0 16px",
          position: "relative",
          zIndex: 20,
        }}
      >
        <div
          style={{
            padding: "24px 28px",
            borderRadius: "18px",
            backgroundColor: "rgba(17, 24, 39, 0.8)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.5)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Subtle Electric Lime Accent Bar */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "2px",
              background:
                "linear-gradient(90deg, transparent 0%, #A3E635 50%, transparent 100%)",
            }}
          />

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "20px",
            }}
          >
            {/* Info Area */}
            <div style={{ flex: "1 1 340px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "6px",
                }}
              >
                <span
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    backgroundColor: "#A3E635",
                    boxShadow: "0 0 8px #A3E635",
                    display: "inline-block",
                  }}
                />
                <span
                  style={{
                    fontSize: "12px",
                    fontFamily: "var(--font-mono)",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    color: "#A3E635",
                  }}
                >
                  {activeProject.subtitle[lang]}
                </span>
              </div>

              <h4
                style={{
                  margin: 0,
                  fontSize: "26px",
                  fontWeight: 800,
                  fontFamily: "var(--font-heading)",
                  color: "#F3F4F6",
                }}
              >
                {activeProject.title}
              </h4>

              <p
                style={{
                  margin: "8px 0 0 0",
                  fontSize: "14px",
                  color: "#94A3B8",
                  lineHeight: 1.6,
                }}
              >
                {activeProject.description[lang]}
              </p>
            </div>

            {/* CTA Buttons Area */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                minWidth: "220px",
                flex: "0 0 auto",
              }}
            >
              {/* Technical Detail Button */}
              <a
                href={activeProject.detailHref}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  padding: "14px 24px",
                  borderRadius: "9999px",
                  backgroundColor: "#A3E635",
                  color: "#111827",
                  fontFamily: "var(--font-heading)",
                  fontWeight: 800,
                  fontSize: "13px",
                  letterSpacing: "0.5px",
                  boxShadow: "0 0 20px rgba(163, 230, 53, 0.4)",
                  textDecoration: "none",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#BEF264";
                  e.currentTarget.style.boxShadow =
                    "0 0 30px rgba(163, 230, 53, 0.65)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#A3E635";
                  e.currentTarget.style.boxShadow =
                    "0 0 20px rgba(163, 230, 53, 0.4)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <span>
                  {lang === "es" ? "VER DETALLE TÉCNICO" : "VIEW TECHNICAL DETAILS"}
                </span>
                <ArrowUpRight style={{ width: "16px", height: "16px" }} />
              </a>

              {/* Optional Live Demo Link / Private Codebase Badge */}
              {activeProject.liveHref ? (
                <a
                  href={activeProject.liveHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    padding: "10px 18px",
                    borderRadius: "9999px",
                    backgroundColor: "rgba(17, 24, 39, 0.8)",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    color: "#F3F4F6",
                    fontFamily: "var(--font-heading)",
                    fontWeight: 600,
                    fontSize: "11px",
                    letterSpacing: "0.8px",
                    textTransform: "uppercase",
                    textDecoration: "none",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#A3E635";
                    e.currentTarget.style.color = "#A3E635";
                    e.currentTarget.style.backgroundColor =
                      "rgba(163, 230, 53, 0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor =
                      "rgba(255, 255, 255, 0.15)";
                    e.currentTarget.style.color = "#F3F4F6";
                    e.currentTarget.style.backgroundColor =
                      "rgba(17, 24, 39, 0.8)";
                  }}
                >
                  <span>{lang === "es" ? "PROBAR SITIO WEB" : "VISIT LIVE SITE"}</span>
                  <ExternalLink style={{ width: "14px", height: "14px" }} />
                </a>
              ) : (
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                    padding: "8px 14px",
                    borderRadius: "9999px",
                    backgroundColor: "rgba(255, 255, 255, 0.04)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    fontSize: "11px",
                    fontFamily: "var(--font-mono)",
                    color: "rgba(148, 163, 184, 0.7)",
                  }}
                >
                  <Lock style={{ width: "12px", height: "12px" }} />
                  <span>
                    {lang === "es" ? "Código Privado / Confidencial" : "Private Codebase"}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectsShowcase;
