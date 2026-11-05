"use client";

import * as React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, SquareArrowOutUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

// Universal Link component compatible with Vite / React SPA and Next.js
const Link = ({
  href,
  children,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
  <a href={href} {...props}>
    {children}
  </a>
);

export type CardStackItem = {
  id: string | number;
  title: string;
  description?: string;
  imageSrc?: string;
  href?: string;
  ctaLabel?: string;
  tag?: string;
  detailHref?: string;
  tech?: string[];
  isAi?: boolean;
  [key: string]: any;
};

export type CardStackProps<T extends CardStackItem> = {
  items: T[];

  /** Selected index on mount */
  initialIndex?: number;

  /** How many cards are visible around the active (odd recommended) */
  maxVisible?: number;

  /** Card sizing */
  cardWidth?: number;
  cardHeight?: number;

  /** How much cards overlap each other (0..0.8). Higher = more overlap */
  overlap?: number;

  /** Total fan angle (deg). Higher = wider arc */
  spreadDeg?: number;

  /** 3D / depth feel */
  perspectivePx?: number;
  depthPx?: number;
  tiltXDeg?: number;

  /** Active emphasis */
  activeLiftPx?: number;
  activeScale?: number;
  inactiveScale?: number;

  /** Motion */
  springStiffness?: number;
  springDamping?: number;

  /** Behavior */
  loop?: boolean;
  autoAdvance?: boolean;
  intervalMs?: number;
  pauseOnHover?: boolean;

  /** UI */
  showDots?: boolean;
  showArrows?: boolean;
  className?: string;

  /** Hooks */
  onChangeIndex?: (index: number, item: T) => void;

  /** Custom renderer (optional) */
  renderCard?: (item: T, state: { active: boolean }) => React.ReactNode;
};

function wrapIndex(n: number, len: number) {
  if (len <= 0) return 0;
  return ((n % len) + len) % len;
}

/** Minimal signed offset from active index to i, with wrapping (for loop behavior). */
function signedOffset(i: number, active: number, len: number, loop: boolean) {
  const raw = i - active;
  if (!loop || len <= 1) return raw;

  // consider wrapped alternative
  const alt = raw > 0 ? raw - len : raw + len;
  return Math.abs(alt) < Math.abs(raw) ? alt : raw;
}

export function CardStack<T extends CardStackItem>({
  items,
  initialIndex = 0,
  maxVisible = 5,

  cardWidth = 520,
  cardHeight = 320,

  overlap = 0.52,
  spreadDeg = 22,

  perspectivePx = 1100,
  depthPx = 100,
  tiltXDeg = 8,

  activeLiftPx = 16,
  activeScale = 1.02,
  inactiveScale = 0.94,

  springStiffness = 280,
  springDamping = 28,

  loop = true,
  autoAdvance = false,
  intervalMs = 3000,
  pauseOnHover = true,

  showDots = true,
  showArrows = true,
  className,

  onChangeIndex,
  renderCard,
}: CardStackProps<T>) {
  const reduceMotion = useReducedMotion();
  const len = items.length;

  const [active, setActive] = React.useState(() =>
    wrapIndex(initialIndex, len),
  );
  const [hovering, setHovering] = React.useState(false);

  // keep active in bounds if items change
  React.useEffect(() => {
    setActive((a) => wrapIndex(a, len));
  }, [len]);

  React.useEffect(() => {
    if (!len) return;
    onChangeIndex?.(active, items[active]!);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const maxOffset = Math.max(0, Math.floor(maxVisible / 2));

  const cardSpacing = Math.max(10, Math.round(cardWidth * (1 - overlap)));
  const stepDeg = maxOffset > 0 ? spreadDeg / maxOffset : 0;

  const canGoPrev = loop || active > 0;
  const canGoNext = loop || active < len - 1;

  const prev = React.useCallback(() => {
    if (!len) return;
    if (!canGoPrev) return;
    setActive((a) => wrapIndex(a - 1, len));
  }, [canGoPrev, len]);

  const next = React.useCallback(() => {
    if (!len) return;
    if (!canGoNext) return;
    setActive((a) => wrapIndex(a + 1, len));
  }, [canGoNext, len]);

  // keyboard navigation (when container focused)
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") prev();
    if (e.key === "ArrowRight") next();
  };

  // autoplay
  React.useEffect(() => {
    if (!autoAdvance) return;
    if (reduceMotion) return;
    if (!len) return;
    if (pauseOnHover && hovering) return;

    const id = window.setInterval(
      () => {
        if (loop || active < len - 1) next();
      },
      Math.max(700, intervalMs),
    );

    return () => window.clearInterval(id);
  }, [
    autoAdvance,
    intervalMs,
    hovering,
    pauseOnHover,
    reduceMotion,
    len,
    loop,
    active,
    next,
  ]);

  if (!len) return null;

  const activeItem = items[active]!;
  const stageHeight = Math.max(380, cardHeight + 70);

  return (
    <div
      className={cn("w-full select-none flex flex-col items-center", className)}
      style={{ width: "100%", position: "relative" }}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {/* Stage */}
      <div
        className="relative w-full outline-none overflow-visible"
        style={{
          position: "relative",
          width: "100%",
          height: stageHeight,
          overflow: "visible",
        }}
        tabIndex={0}
        onKeyDown={onKeyDown}
      >
        {/* Background ambient lighting */}
        <div
          className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 mx-auto h-44 w-[60%] rounded-full bg-[#A3E635]/10 blur-3xl"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            height: "180px",
            width: "60%",
            borderRadius: "9999px",
            background: "rgba(163, 230, 53, 0.1)",
            filter: "blur(60px)",
            pointerEvents: "none",
          }}
          aria-hidden="true"
        />

        {/* 3D Perspective Viewport */}
        <div
          className="absolute inset-0"
          style={{
            position: "absolute",
            inset: 0,
            perspective: `${perspectivePx}px`,
            overflow: "visible",
          }}
        >
          <AnimatePresence initial={false}>
            {items.map((item, i) => {
              const off = signedOffset(i, active, len, loop);
              const abs = Math.abs(off);
              const visible = abs <= maxOffset;

              // Hide far-away cards cleanly
              if (!visible) return null;

              // Fan geometry
              const rotateZ = off * stepDeg;
              const x = off * cardSpacing;
              const y = abs * 6; // Subtle gentle arch
              const z = -abs * depthPx;

              const isActive = off === 0;

              const scale = isActive ? activeScale : inactiveScale;
              const lift = isActive ? -activeLiftPx : 0;
              const rotateX = isActive ? 0 : tiltXDeg;
              const zIndex = 100 - abs;

              // Drag only on active card
              const dragProps = isActive
                ? {
                    drag: "x" as const,
                    dragConstraints: { left: 0, right: 0 },
                    dragElastic: 0.2,
                    onDragEnd: (
                      _e: any,
                      info: { offset: { x: number }; velocity: { x: number } },
                    ) => {
                      if (reduceMotion) return;
                      const travel = info.offset.x;
                      const v = info.velocity.x;
                      const threshold = Math.min(140, cardWidth * 0.2);

                      if (travel > threshold || v > 500) prev();
                      else if (travel < -threshold || v < -500) next();
                    },
                  }
                : {};

              return (
                <motion.div
                  key={item.id}
                  className={cn(
                    "absolute rounded-2xl overflow-hidden shadow-2xl transition-shadow duration-300",
                    "will-change-transform",
                    isActive
                      ? "cursor-grab active:cursor-grabbing border-2 border-[#A3E635] shadow-[0_0_35px_rgba(163,230,53,0.3)]"
                      : "cursor-pointer border border-white/10 hover:border-white/20 opacity-80 hover:opacity-100",
                  )}
                  style={{
                    position: "absolute",
                    bottom: "20px",
                    left: "50%",
                    marginLeft: -cardWidth / 2,
                    width: cardWidth,
                    height: cardHeight,
                    zIndex,
                    transformStyle: "preserve-3d",
                    borderRadius: "16px",
                    overflow: "hidden",
                    backgroundColor: "#111827",
                  }}
                  initial={
                    reduceMotion
                      ? false
                      : {
                          opacity: 0,
                          y: y + 30,
                          x,
                          rotateZ,
                          rotateX,
                          scale,
                        }
                  }
                  animate={{
                    opacity: 1,
                    x,
                    y: y + lift,
                    rotateZ,
                    rotateX,
                    scale,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: springStiffness,
                    damping: springDamping,
                  }}
                  onClick={() => setActive(i)}
                  {...dragProps}
                >
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      transform: `translateZ(${z}px)`,
                      transformStyle: "preserve-3d",
                      position: "relative",
                    }}
                  >
                    {renderCard ? (
                      renderCard(item, { active: isActive })
                    ) : (
                      <DefaultFanCard item={item} active={isActive} />
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Controls: Arrows & Dots */}
      <div className="mt-6 flex items-center justify-center gap-4 relative z-30">
        {showArrows && (
          <button
            onClick={prev}
            className="w-9 h-9 rounded-full flex items-center justify-center bg-[#111827]/90 border border-white/15 text-[#F3F4F6] hover:text-[#A3E635] hover:border-[#A3E635]/50 transition-all duration-200 shadow-lg active:scale-95"
            aria-label="Previous project"
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              background: "rgba(17, 24, 39, 0.9)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              color: "#F3F4F6",
            }}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        {showDots && (
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#111827]/85 border border-white/10 backdrop-blur-md"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 14px",
              borderRadius: "9999px",
              background: "rgba(17, 24, 39, 0.85)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            {items.map((it, idx) => {
              const on = idx === active;
              return (
                <button
                  key={it.id}
                  onClick={() => setActive(idx)}
                  className={cn(
                    "h-2.5 rounded-full transition-all duration-300",
                    on
                      ? "w-8 bg-[#A3E635] shadow-[0_0_12px_rgba(163,230,53,0.6)]"
                      : "w-2.5 bg-white/25 hover:bg-white/40",
                  )}
                  style={{
                    height: "10px",
                    width: on ? "30px" : "10px",
                    borderRadius: "9999px",
                    backgroundColor: on ? "#A3E635" : "rgba(255, 255, 255, 0.25)",
                    border: "none",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    boxShadow: on ? "0 0 10px rgba(163, 230, 53, 0.6)" : "none",
                  }}
                  aria-label={`Go to ${it.title}`}
                />
              );
            })}
          </div>
        )}

        {showArrows && (
          <button
            onClick={next}
            className="w-9 h-9 rounded-full flex items-center justify-center bg-[#111827]/90 border border-white/15 text-[#F3F4F6] hover:text-[#A3E635] hover:border-[#A3E635]/50 transition-all duration-200 shadow-lg active:scale-95"
            aria-label="Next project"
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              background: "rgba(17, 24, 39, 0.9)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              color: "#F3F4F6",
            }}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}

function DefaultFanCard({ item }: { item: CardStackItem; active: boolean }) {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        backgroundColor: "#111827",
      }}
    >
      {/* Image */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
        }}
      >
        {item.imageSrc ? (
          <img
            src={item.imageSrc}
            alt={item.title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            draggable={false}
            loading="eager"
          />
        ) : (
          <div
            style={{
              display: "flex",
              width: "100%",
              height: "100%",
              alignItems: "center",
              justifyContent: "center",
              color: "#9CA3AF",
            }}
          >
            No image
          </div>
        )}
      </div>

      {/* Dark gradient overlay for text readability */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to top, #0B0F17 0%, rgba(17, 24, 39, 0.7) 50%, transparent 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          height: "100%",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "20px",
        }}
      >
        {item.tag && (
          <span
            style={{
              marginBottom: "8px",
              alignSelf: "flex-start",
              borderRadius: "9999px",
              backgroundColor: "rgba(163, 230, 53, 0.15)",
              border: "1px solid rgba(163, 230, 53, 0.4)",
              padding: "4px 12px",
              fontFamily: "var(--font-mono)",
              fontSize: "12px",
              fontWeight: 600,
              color: "#A3E635",
            }}
          >
            {item.tag}
          </span>
        )}
        <div
          style={{
            fontSize: "20px",
            fontWeight: "bold",
            color: "#F3F4F6",
            fontFamily: "var(--font-heading)",
          }}
        >
          {item.title}
        </div>
        {item.description ? (
          <div
            style={{
              marginTop: "6px",
              fontSize: "13px",
              color: "#CBD5E1",
              lineHeight: 1.5,
            }}
          >
            {item.description}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default CardStack;
