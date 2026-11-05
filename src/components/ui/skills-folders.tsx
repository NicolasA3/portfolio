"use client";

import React, { useState, useEffect } from "react";
import GlassFolder, { FolderFile, FolderArt } from "./glass-folder-cards";
import { Sparkles, Code2, Server, Database, Bot, CheckCircle2 } from "lucide-react";

interface SkillCategory {
  id: string;
  label: { es: string; en: string };
  meta: { es: string; en: string };
  art: FolderArt;
  seed: number;
  icon: React.ReactNode;
  isAiSpecialty?: boolean;
  files: {
    name: string;
    meta: { es: string; en: string };
    art?: FolderArt;
  }[];
}

const skillCategories: SkillCategory[] = [
  {
    id: "frontend",
    label: { es: "Frontend", en: "Frontend" },
    meta: { es: "4 Tecnologías", en: "4 Technologies" },
    art: "verdant",
    seed: 108,
    icon: <Code2 style={{ width: "16px", height: "16px", color: "#A3E635" }} />,
    files: [
      { name: "React 19", meta: { es: "UI & Componentes SPA", en: "SPA Components & UI" }, art: "verdant" },
      { name: "JavaScript ES6+", meta: { es: "Asíncrono & Tipado", en: "Async Core & DOM" }, art: "ember" },
      { name: "Tailwind CSS", meta: { es: "Diseño & Tokens", en: "Modern Utility Styling" }, art: "aurora" },
      { name: "Vite", meta: "Build Tooling Ultra Rápido", art: "glacier" } as any,
    ],
  },
  {
    id: "backend",
    label: { es: "Backend", en: "Backend" },
    meta: { es: "4 Tecnologías", en: "4 Technologies" },
    art: "ember",
    seed: 215,
    icon: <Server style={{ width: "16px", height: "16px", color: "#A3E635" }} />,
    files: [
      { name: "Python", meta: { es: "Lenguaje Central", en: "Primary Core Language" }, art: "ember" },
      { name: "FastAPI", meta: { es: "APIs Asíncronas & Tipado", en: "Async High-Perf APIs" }, art: "aurora" },
      { name: "Flask", meta: { es: "Microframework Ágil", en: "Agile Microframework" }, art: "dusk" },
      { name: "Django", meta: { es: "Arquitectura & ORM", en: "Enterprise Architecture & ORM" }, art: "glacier" },
    ],
  },
  {
    id: "cloud-db",
    label: { es: "BBDD & Cloud", en: "Database & Cloud" },
    meta: { es: "4 Tecnologías", en: "4 Technologies" },
    art: "glacier",
    seed: 342,
    icon: <Database style={{ width: "16px", height: "16px", color: "#A3E635" }} />,
    files: [
      { name: "PostgreSQL", meta: { es: "Base de Datos Relacional", en: "Relational SQL Engine" }, art: "glacier" },
      { name: "Supabase", meta: { es: "Postgres BaaS & Auth", en: "BaaS & Postgres Realtime" }, art: "verdant" },
      { name: "Azure Cloud", meta: { es: "Compute, VMs & Storage", en: "Cloud Compute & Storage" }, art: "aurora" },
      { name: "Vercel", meta: { es: "Edge Hosting & CI/CD", en: "Edge Deployments & Hosting" }, art: "dusk" },
    ],
  },
  {
    id: "ai-tools",
    label: { es: "IA & Herramientas", en: "AI & Tools" },
    meta: { es: "✦ Especialidad Principal", en: "✦ Core Specialty" },
    art: "aurora",
    seed: 489,
    icon: <Bot style={{ width: "16px", height: "16px", color: "#A3E635" }} />,
    isAiSpecialty: true,
    files: [
      { name: "OpenAI / LLMs", meta: { es: "GPT-4o & Function Calling", en: "GPT-4o & Function Calling" }, art: "aurora" },
      { name: "Agentes IA", meta: { es: "Workflows Autónomos & RAG", en: "Autonomous Workflows & RAG" }, art: "verdant" },
      { name: "REST APIs", meta: { es: "Integración de Sistemas", en: "System & API Integrations" }, art: "ember" },
      { name: "Git / GitHub", meta: { es: "Control de Versiones & CI", en: "Version Control & Gitflow" }, art: "glacier" },
    ],
  },
];

export const SkillsFolders: React.FC = () => {
  const [lang, setLang] = useState<"es" | "en">(() => {
    const saved = localStorage.getItem("lang");
    return saved === "en" ? "en" : "es";
  });

  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );
  const [selectedFile, setSelectedFile] = useState<{ category: string; file: string; meta: string } | null>(null);

  useEffect(() => {
    const handleLang = (e: any) => {
      const newL = e.detail?.lang;
      if (newL === "es" || newL === "en") setLang(newL);
    };

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    handleResize();
    window.addEventListener("languageChanged", handleLang);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("languageChanged", handleLang);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const isMobile = windowWidth < 680;
  // Size folders generously for the 2x2 layout
  const folderWidth = isMobile
    ? Math.min(320, windowWidth - 40)
    : windowWidth < 1024
    ? 295
    : 320;

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: "relative",
        paddingTop: "12px",
        paddingBottom: "24px",
      }}
    >
      {/* Interactive Helper Banner */}
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          padding: "6px 16px",
          borderRadius: "9999px",
          backgroundColor: "rgba(17, 24, 39, 0.85)",
          border: "1px solid rgba(163, 230, 53, 0.25)",
          boxShadow: "0 0 20px rgba(0, 0, 0, 0.4)",
          backdropFilter: "blur(12px)",
          marginBottom: "36px",
        }}
      >
        <Sparkles style={{ width: "14px", height: "14px", color: "#A3E635" }} />
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "12px",
            color: "#94A3B8",
            letterSpacing: "0.02em",
          }}
        >
          {lang === "es"
            ? "Toca o haz clic en cualquier carpeta para desplegar y explorar las tecnologías"
            : "Click or tap any glass folder to fan out and explore the technologies"}
        </span>
      </div>

      {/* Folders Grid: 2 arriba y 2 abajo (2x2) */}
      <div
        style={{
          width: "100%",
          maxWidth: isMobile ? "360px" : "820px",
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
          columnGap: "48px",
          rowGap: "56px",
          justifyItems: "center",
          alignItems: "start",
          margin: "0 auto",
        }}
      >
        {skillCategories.map((cat, idx) => {
          const files: FolderFile[] = cat.files.map((f) => ({
            name: f.name,
            meta: typeof f.meta === "object" ? f.meta[lang] : f.meta,
            art: f.art,
          }));

          return (
            <div
              key={cat.id}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                position: "relative",
                width: folderWidth + "px",
              }}
            >
              {/* Category Header Label with Icon */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                  marginBottom: "12px",
                  padding: "0 4px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "8px",
                      backgroundColor: "rgba(17, 24, 39, 0.9)",
                      border: cat.isAiSpecialty
                        ? "1px solid rgba(163, 230, 53, 0.45)"
                        : "1px solid rgba(255, 255, 255, 0.12)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: cat.isAiSpecialty
                        ? "0 0 10px rgba(163, 230, 53, 0.25)"
                        : "none",
                    }}
                  >
                    {cat.icon}
                  </div>
                  <span
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: "14px",
                      fontWeight: 700,
                      color: "#F3F4F6",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {cat.label[lang]}
                  </span>
                </div>

                {cat.isAiSpecialty ? (
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "10px",
                      fontWeight: 600,
                      padding: "2px 8px",
                      borderRadius: "9999px",
                      backgroundColor: "rgba(163, 230, 53, 0.12)",
                      border: "1px solid rgba(163, 230, 53, 0.4)",
                      color: "#A3E635",
                      boxShadow: "0 0 8px rgba(163, 230, 53, 0.2)",
                    }}
                  >
                    {lang === "es" ? "✦ Core" : "✦ Core"}
                  </span>
                ) : (
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "11px",
                      color: "#64748B",
                    }}
                  >
                    0{idx + 1}
                  </span>
                )}
              </div>

              {/* The Glass Folder Card */}
              <GlassFolder
                label={cat.label[lang]}
                meta={cat.meta[lang]}
                tone="dark"
                art={cat.art}
                seed={cat.seed}
                files={files}
                width={folderWidth}
                appear={true}
                appearDelay={idx * 120}
                onFileSelect={(file) => {
                  setSelectedFile({
                    category: cat.label[lang],
                    file: file.name,
                    meta: file.meta || "",
                  });
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Selected Skill Notification Pill */}
      {selectedFile && (
        <div
          style={{
            marginTop: "32px",
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            padding: "8px 20px",
            borderRadius: "12px",
            backgroundColor: "#111827",
            border: "1px solid rgba(163, 230, 53, 0.4)",
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.6), 0 0 15px rgba(163, 230, 53, 0.2)",
            animation: "fadeIn 0.3s ease",
          }}
        >
          <CheckCircle2 style={{ width: "16px", height: "16px", color: "#A3E635" }} />
          <span style={{ fontSize: "13px", color: "#F3F4F6", fontFamily: "var(--font-heading)" }}>
            <strong style={{ color: "#A3E635" }}>{selectedFile.file}</strong> ({selectedFile.meta}) — {selectedFile.category}
          </span>
          <button
            onClick={() => setSelectedFile(null)}
            style={{
              all: "unset",
              marginLeft: "8px",
              cursor: "pointer",
              fontSize: "13px",
              color: "#94A3B8",
              padding: "2px 6px",
              borderRadius: "4px",
            }}
            title="Cerrar"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

export default SkillsFolders;

