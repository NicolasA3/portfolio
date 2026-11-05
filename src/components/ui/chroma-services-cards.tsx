"use client";

import React, { useState, useEffect, useRef } from "react";
import { Sparkles, Terminal, Bot, Palette, ArrowUpRight, Zap, CheckCircle2 } from "lucide-react";

interface ServiceItem {
  id: string;
  number: string;
  title: { es: string; en: string };
  subtitle: { es: string; en: string };
  description: { es: string; en: string };
  icon: React.ReactNode;
  emblemText?: string;
  badge?: { es: string; en: string };
  isFeatured?: boolean;
  colorPreset: "cyan-lime" | "electric-lime" | "violet-lime";
  features: { es: string; en: string }[];
}

const servicesData: ServiceItem[] = [
  {
    id: "web-dev",
    number: "01",
    title: { es: "Desarrollo Web", en: "Web Development" },
    subtitle: { es: "Full-Stack & Arquitecturas Modernas", en: "Full-Stack & Modern Architectures" },
    description: {
      es: "Aplicaciones web completas, reactivas y escalables con React, Python y tecnologías modernas. Desde landing pages interactivas hasta plataformas SaaS complejas con paneles de control.",
      en: "Full-stack, reactive and scalable web applications built with React, Python and modern tooling. From interactive landings to complex SaaS platforms with robust administration panels.",
    },
    icon: <Terminal style={{ width: "22px", height: "22px", color: "#A3E635" }} />,
    emblemText: "</>",
    colorPreset: "cyan-lime",
    features: [
      { es: "React 19 & Next-Gen SPAs", en: "React 19 & Next-Gen SPAs" },
      { es: "APIs RESTful con FastAPI / Flask", en: "REST APIs with FastAPI & Flask" },
      { es: "Bases de Datos & Cloud Deploy", en: "Databases & Cloud Deployments" },
      { es: "Rendimiento & Código Limpio", en: "High Performance & Clean Code" },
    ],
  },
  {
    id: "ai-integration",
    number: "02",
    title: { es: "Integración IA", en: "AI Integration" },
    subtitle: { es: "Modelos de Lenguaje & Agentes Autónomos", en: "Language Models & Autonomous Agents" },
    description: {
      es: "Automatización cognitiva con OpenAI y LLMs. Implementación de agentes autónomos, flujos RAG con embeddings, visión artificial y automatización de procesos complejos.",
      en: "Cognitive automation with OpenAI and modern LLMs. Autonomous agents implementation, RAG pipelines with vector embeddings, vision systems, and workflow automation.",
    },
    icon: <Bot style={{ width: "22px", height: "22px", color: "#A3E635" }} />,
    emblemText: "AI",
    badge: { es: "✦ ESPECIALIDAD CORE", en: "✦ CORE SPECIALTY" },
    isFeatured: true,
    colorPreset: "electric-lime",
    features: [
      { es: "OpenAI GPT-4o & Function Calling", en: "OpenAI GPT-4o & Function Calling" },
      { es: "Agentes Autónomos & Workflows", en: "Autonomous Agents & Workflows" },
      { es: "RAG & Búsqueda Semántica", en: "RAG & Semantic Vector Search" },
      { es: "Procesamiento de Lenguaje Natural", en: "Natural Language Processing" },
    ],
  },
  {
    id: "ui-ux",
    number: "03",
    title: { es: "UX/UI Design", en: "UX/UI Design" },
    subtitle: { es: "Sistemas de Diseño & Experiencia", en: "Design Systems & High-End UX" },
    description: {
      es: "Interfaces intuitivas, accesibles y con impacto estético. Diseño centrado en el usuario, prototipado de alta fidelidad, micro-interacciones fluidas y tokens de diseño estructurados.",
      en: "Intuitive, accessible and visually striking interfaces. User-centered product design, high-fidelity interactive prototyping, smooth micro-interactions, and design token architectures.",
    },
    icon: <Palette style={{ width: "22px", height: "22px", color: "#A3E635" }} />,
    emblemText: "UX",
    colorPreset: "violet-lime",
    features: [
      { es: "Sistemas de Diseño con Tailwind", en: "Tailwind Design Systems & Tokens" },
      { es: "Prototipado Interactivo", en: "Interactive User Prototyping" },
      { es: "Animaciones & 3D Web", en: "Micro-interactions & 3D Web" },
      { es: "Diseño Responsivo & Accesible", en: "Mobile-First & Accessible Design" },
    ],
  },
];

// Single Chroma / Holographic Card Component
const HoloCard: React.FC<{ item: ServiceItem; lang: "es" | "en"; index: number }> = ({ item, lang, index }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 50, y: 50 });
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "touch") return;
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    const px = Math.max(0, Math.min(100, (clientX / rect.width) * 100));
    const py = Math.max(0, Math.min(100, (clientY / rect.height) * 100));

    // Tilt limits: -14 to +14 deg for smooth 3D response
    const tiltY = ((clientX / rect.width) - 0.5) * 24;
    const tiltX = ((clientY / rect.height) - 0.5) * -24;

    setCoords({ x: px, y: py });
    setTilt({ x: tiltX, y: tiltY });
  };

  const handlePointerEnter = () => {
    setIsHovered(true);
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
    setCoords({ x: 50, y: 50 });
  };

  // Color preset styles for the holographic sheen
  const getFoilGradient = () => {
    const angle = 115 + (coords.x - 50) * 0.45;
    if (item.isFeatured) {
      // Extra luminous Electric Lime + Gold + Cyan holographic sheen
      return `linear-gradient(${angle}deg, 
        transparent 15%, 
        rgba(56, 189, 248, 0.35) 30%, 
        rgba(163, 230, 53, 0.75) 48%, 
        rgba(255, 255, 255, 0.9) 52%, 
        rgba(234, 179, 8, 0.5) 60%, 
        rgba(163, 230, 53, 0.4) 72%, 
        transparent 88%)`;
    }

    if (item.colorPreset === "cyan-lime") {
      return `linear-gradient(${angle}deg, 
        transparent 15%, 
        rgba(37, 99, 235, 0.35) 28%, 
        rgba(56, 189, 248, 0.55) 42%, 
        rgba(255, 255, 255, 0.8) 50%, 
        rgba(163, 230, 53, 0.5) 58%, 
        rgba(56, 189, 248, 0.3) 72%, 
        transparent 88%)`;
    }

    // violet-lime
    return `linear-gradient(${angle}deg, 
      transparent 15%, 
      rgba(168, 85, 247, 0.35) 28%, 
      rgba(244, 114, 182, 0.45) 42%, 
      rgba(255, 255, 255, 0.8) 50%, 
      rgba(163, 230, 53, 0.55) 58%, 
      rgba(99, 102, 241, 0.3) 72%, 
      transparent 88%)`;
  };

  return (
    <div
      style={{
        perspective: "1200px",
        width: "100%",
        maxWidth: "360px",
        height: "520px",
      }}
    >
      <div
        ref={cardRef}
        onPointerMove={handlePointerMove}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          borderRadius: "28px",
          backgroundColor: "#0d1424",
          backgroundImage:
            "radial-gradient(circle at 50% 0%, #17233d 0%, #0c1220 55%, #070a12 100%)",
          transformStyle: "preserve-3d",
          transform: isHovered
            ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(1.03, 1.03, 1.03)`
            : "rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
          transition: isHovered
            ? "transform 0.08s ease-out, box-shadow 0.25s ease"
            : "transform 0.55s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.55s ease",
          boxShadow: isHovered
            ? item.isFeatured
              ? "0 30px 60px -15px rgba(0, 0, 0, 0.85), 0 0 45px rgba(163, 230, 53, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.4)"
              : "0 30px 60px -15px rgba(0, 0, 0, 0.85), 0 0 35px rgba(56, 189, 248, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.35)"
            : "0 20px 40px -12px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
          border: item.isFeatured
            ? "1px solid rgba(163, 230, 53, 0.45)"
            : "1px solid rgba(255, 255, 255, 0.12)",
          cursor: "pointer",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "28px 24px 24px 24px",
          userSelect: "none",
        }}
      >
        {/* ================= HOLOGRAPHIC CHROMA FOIL OVERLAYS ================= */}
        {/* Layer 1: Prismatic Diagonal Sheen (Color-Dodge) */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "inherit",
            pointerEvents: "none",
            background: getFoilGradient(),
            backgroundSize: "220% 220%",
            backgroundPosition: `${coords.x * 1.3}% ${coords.y * 1.3}%`,
            mixBlendMode: "color-dodge",
            opacity: isHovered ? 0.95 : 0,
            transition: "opacity 0.25s ease",
            zIndex: 10,
          }}
          aria-hidden="true"
        />

        {/* Layer 2: Cursor Spotlight Glare (Overlay) */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "inherit",
            pointerEvents: "none",
            background: `radial-gradient(circle 300px at ${coords.x}% ${coords.y}%, rgba(255, 255, 255, 0.35) 0%, rgba(163, 230, 53, 0.15) 35%, transparent 70%)`,
            mixBlendMode: "overlay",
            opacity: isHovered ? 1 : 0,
            transition: "opacity 0.2s ease",
            zIndex: 11,
          }}
          aria-hidden="true"
        />

        {/* Layer 3: Micro Holographic Scanline Texture */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "inherit",
            pointerEvents: "none",
            backgroundImage:
              "repeating-linear-gradient(0deg, rgba(255,255,255,0.02) 0px, rgba(255,255,255,0.02) 1px, transparent 1px, transparent 4px)",
            mixBlendMode: "overlay",
            opacity: 0.5,
            zIndex: 9,
          }}
          aria-hidden="true"
        />

        {/* Layer 4: Interactive Border Glint */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "inherit",
            pointerEvents: "none",
            border: isHovered
              ? item.isFeatured
                ? "1.5px solid rgba(163, 230, 53, 0.85)"
                : "1.5px solid rgba(56, 189, 248, 0.75)"
              : "1px solid transparent",
            transition: "border 0.2s ease",
            zIndex: 12,
          }}
          aria-hidden="true"
        />

        {/* ================= 3D PARALLAX CONTENT LAYERS ================= */}
        {/* Top Bar: Number & Core Specialty Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            transform: "translateZ(30px)",
            transformStyle: "preserve-3d",
            zIndex: 15,
            position: "relative",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "12px",
                fontWeight: 700,
                color: item.isFeatured ? "#A3E635" : "#64748B",
                letterSpacing: "1px",
              }}
            >
              CARD // {item.number}
            </span>
          </div>

          {item.badge && (
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "10px",
                fontWeight: 800,
                padding: "3px 10px",
                borderRadius: "9999px",
                backgroundColor: "rgba(163, 230, 53, 0.15)",
                border: "1px solid rgba(163, 230, 53, 0.6)",
                color: "#A3E635",
                boxShadow: "0 0 14px rgba(163, 230, 53, 0.35)",
                letterSpacing: "0.5px",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <Sparkles style={{ width: "10px", height: "10px" }} />
              {item.badge[lang]}
            </span>
          )}
        </div>

        {/* Middle Visual Stage: Stylized Emblem like Pokemon Holo Artwork */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            margin: "12px 0 16px 0",
            transform: "translateZ(45px)",
            transformStyle: "preserve-3d",
            position: "relative",
            zIndex: 15,
          }}
        >
          {/* Glowing Emblem Frame */}
          <div
            style={{
              width: "120px",
              height: "120px",
              borderRadius: "24px",
              backgroundColor: "rgba(17, 24, 39, 0.75)",
              border: item.isFeatured
                ? "1px solid rgba(163, 230, 53, 0.45)"
                : "1px solid rgba(255, 255, 255, 0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: isHovered
                ? item.isFeatured
                  ? "0 0 35px rgba(163, 230, 53, 0.4), inset 0 0 20px rgba(163, 230, 53, 0.2)"
                  : "0 0 30px rgba(56, 189, 248, 0.3), inset 0 0 15px rgba(56, 189, 248, 0.15)"
                : "0 10px 25px rgba(0, 0, 0, 0.5)",
              backdropFilter: "blur(12px)",
              transition: "box-shadow 0.3s ease, border-color 0.3s ease",
              position: "relative",
            }}
          >
            {/* Ambient inner glow */}
            <div
              style={{
                position: "absolute",
                inset: "10%",
                borderRadius: "50%",
                background: item.isFeatured
                  ? "radial-gradient(circle, rgba(163, 230, 53, 0.35) 0%, transparent 70%)"
                  : "radial-gradient(circle, rgba(56, 189, 248, 0.3) 0%, transparent 70%)",
                filter: "blur(10px)",
                pointerEvents: "none",
              }}
            />

            {/* Emblem Text (like > or </> from user's collector cards) */}
            <span
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "42px",
                fontWeight: 900,
                color: "#F3F4F6",
                textShadow: isHovered
                  ? item.isFeatured
                    ? "0 0 20px #A3E635, 0 0 40px rgba(163, 230, 53, 0.6)"
                    : "0 0 20px #38BDF8, 0 0 40px rgba(56, 189, 248, 0.5)"
                  : "0 2px 10px rgba(0, 0, 0, 0.7)",
                letterSpacing: "-1px",
                transition: "text-shadow 0.3s ease",
                transform: "translateZ(15px)",
              }}
            >
              {item.emblemText}
            </span>
          </div>

          {/* Subtitle Tech Label */}
          <span
            style={{
              marginTop: "14px",
              fontFamily: "var(--font-mono)",
              fontSize: "11px",
              color: item.isFeatured ? "#A3E635" : "#94A3B8",
              textTransform: "uppercase",
              letterSpacing: "1px",
              fontWeight: 600,
            }}
          >
            {item.subtitle[lang]}
          </span>
        </div>

        {/* Lower Content: Title & Description */}
        <div
          style={{
            transform: "translateZ(35px)",
            transformStyle: "preserve-3d",
            zIndex: 15,
            position: "relative",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "8px",
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
              {item.title[lang]}
            </h3>
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {item.icon}
            </div>
          </div>

          <p
            style={{
              margin: "0 0 16px 0",
              fontSize: "12.5px",
              lineHeight: 1.55,
              color: "#CBD5E1",
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {item.description[lang]}
          </p>

          {/* Feature Micro-Badges */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "6px",
              transform: "translateZ(20px)",
            }}
          >
            {item.features.slice(0, 3).map((f, fIdx) => (
              <span
                key={fIdx}
                style={{
                  fontSize: "10px",
                  fontFamily: "var(--font-mono)",
                  padding: "3px 8px",
                  borderRadius: "6px",
                  backgroundColor: "rgba(17, 24, 39, 0.8)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  color: "#94A3B8",
                  backdropFilter: "blur(6px)",
                }}
              >
                {f[lang]}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const ChromaServicesCards: React.FC = () => {
  const [lang, setLang] = useState<"es" | "en">(() => {
    const saved = localStorage.getItem("lang");
    return saved === "en" ? "en" : "es";
  });

  useEffect(() => {
    const handleLang = (e: any) => {
      const newL = e.detail?.lang;
      if (newL === "es" || newL === "en") setLang(newL);
    };

    window.addEventListener("languageChanged", handleLang);
    return () => window.removeEventListener("languageChanged", handleLang);
  }, []);

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: "relative",
        paddingTop: "10px",
        paddingBottom: "20px",
      }}
    >
      {/* 3 Holographic Cards Grid */}
      <div
        style={{
          width: "100%",
          maxWidth: "1140px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "32px",
          justifyItems: "center",
          alignItems: "stretch",
          margin: "0 auto",
        }}
      >
        {servicesData.map((item, idx) => (
          <HoloCard key={item.id} item={item} lang={lang} index={idx} />
        ))}
      </div>
    </div>
  );
};

export default ChromaServicesCards;

