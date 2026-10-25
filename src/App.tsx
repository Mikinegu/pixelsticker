/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Analytics } from "@vercel/analytics/react";

// Glob all stickers recursively from public/stickers/**
const stickerModules = import.meta.glob(
  "../public/stickers/**/*.{png,jpg,jpeg,webp,gif}",
  {
    eager: true,
    import: "default",
  },
) as Record<string, string>;

export interface CategoryDefinition {
  id: string;
  name: string;
  shortTag: string;
  emoji: string;
  badgeBg: string;
  badgeText: string;
  accentBorder: string;
  matchKeys: string[];
}

const PRESET_CATEGORIES: CategoryDefinition[] = [
  {
    id: "gumball",
    name: "The Amazing World of Gumball",
    shortTag: "Gumball",
    emoji: "🐱",
    badgeBg: "bg-cyan-100",
    badgeText: "text-cyan-900",
    accentBorder: "border-cyan-500",
    matchKeys: ["gumball", "gamball"],
  },
  {
    id: "we_bare_bears",
    name: "We Bare Bears",
    shortTag: "We Bare Bears",
    emoji: "🐻",
    badgeBg: "bg-amber-100",
    badgeText: "text-amber-900",
    accentBorder: "border-amber-600",
    matchKeys: ["we_bare_bears", "we bears", "we_bears", "webarebears", "bears"],
  },
  {
    id: "httyd",
    name: "How to Train Your Dragon",
    shortTag: "HTTYD",
    emoji: "🐉",
    badgeBg: "bg-emerald-100",
    badgeText: "text-emerald-900",
    accentBorder: "border-emerald-600",
    matchKeys: ["httyd", "dragon", "how_to_train_your_dragon"],
  },
  {
    id: "other",
    name: "Curated Vinyl Mix",
    shortTag: "Curated Mix",
    emoji: "✨",
    badgeBg: "bg-purple-100",
    badgeText: "text-purple-900",
    accentBorder: "border-purple-600",
    matchKeys: ["other", "misc", "default"],
  },
];

function resolveCategoryFromPath(filePath: string): string {
  const normalized = filePath.replace(/\\/g, "/");
  const parts = normalized.split("/");
  const stickersIdx = parts.findIndex((part) => part === "stickers");

  if (stickersIdx !== -1 && parts.length > stickersIdx + 2) {
    const rawFolder = parts[stickersIdx + 1].toLowerCase().trim().replace(/[\s-]+/g, "_");
    for (const cat of PRESET_CATEGORIES) {
      if (cat.id === rawFolder || cat.matchKeys.includes(rawFolder)) {
        return cat.id;
      }
    }
    return rawFolder;
  }
  return "other";
}

type FloatingSticker = {
  id: number;
  src: string;
  left: number;
  top: number;
  width: number;
  radius: number;
  zIndex: number;
  startRotate: number;
  driftX: number;
  driftY: number;
  endRotate: number;
  duration: number;
  delay: number;
  opacityPeak: number;
  scalePeak: number;
};

const CYCLE_INTERVAL_MS = 12000;

function sanitizeStickerUrl(url: string): string {
  if (typeof url === "string" && url.startsWith("/public/")) {
    return url.replace(/^\/public/, "");
  }
  return url;
}

export default function App() {
  // 1. Group discovered images by category
  const { categoryMap, allStickers, categories } = useMemo(() => {
    const map: Record<string, string[]> = {};
    const all: string[] = [];

    // Pre-populate preset categories
    for (const preset of PRESET_CATEGORIES) {
      map[preset.id] = [];
    }

    const dynamicCategories: CategoryDefinition[] = [...PRESET_CATEGORIES];

    // Assign files to categories
    for (const [path, rawUrl] of Object.entries(stickerModules)) {
      const catId = resolveCategoryFromPath(path);
      const url = sanitizeStickerUrl(rawUrl);
      if (!map[catId]) {
        map[catId] = [];
        // Register any unknown custom folder dynamically
        const label = catId.replace(/[-_]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
        dynamicCategories.push({
          id: catId,
          name: label,
          shortTag: label,
          emoji: "🎨",
          badgeBg: "bg-stone-100",
          badgeText: "text-stone-900",
          accentBorder: "border-stone-500",
          matchKeys: [catId],
        });
      }
      map[catId].push(url);
      all.push(url);
    }

    // Sort stickers inside each category for stability
    for (const key of Object.keys(map)) {
      map[key].sort((a, b) =>
        a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }),
      );
    }
    all.sort((a, b) =>
      a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }),
    );

    return { categoryMap: map, allStickers: all, categories: dynamicCategories };
  }, []);

  // 2. Active category & auto-cycle state
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);

  const currentCategory = categories[activeCategoryIndex] ?? categories[0];
  const currentCategoryRef = useRef(currentCategory);

  useEffect(() => {
    currentCategoryRef.current = currentCategory;
  }, [currentCategory]);

  // Timer loop for auto-cycling categories
  useEffect(() => {
    if (categories.length <= 1) return;

    const timer = setInterval(() => {
      setActiveCategoryIndex((curr) => (curr + 1) % categories.length);
    }, CYCLE_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [categories.length]);

  // Helper to get active pool of sticker URLs
  const getCategoryPool = useCallback(
    (categoryId: string): string[] => {
      const specific = categoryMap[categoryId];
      if (specific && specific.length > 0) {
        return specific;
      }
      // Graceful fallback to all available stickers if category is currently empty
      return allStickers.length > 0 ? allStickers : ["/stickers/other/Asset%201@2x-8.png"];
    },
    [categoryMap, allStickers],
  );

  // Background Prefetcher: Silently preloads active and upcoming category images into browser cache
  const prefetchedUrls = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (categories.length === 0) return;

    // Preload current category stickers + upcoming category stickers ahead of the 12s cycle
    const currentPool = getCategoryPool(currentCategory.id);
    const nextCategory = categories[(activeCategoryIndex + 1) % categories.length];
    const nextPool = nextCategory ? getCategoryPool(nextCategory.id) : [];

    const urlsToPreload = [...currentPool, ...nextPool];

    for (const src of urlsToPreload) {
      if (!prefetchedUrls.current.has(src)) {
        prefetchedUrls.current.add(src);
        const img = new Image();
        img.decoding = "async";
        img.src = src;
      }
    }
  }, [activeCategoryIndex, categories, currentCategory.id, getCategoryPool]);

  // 3. Floating Sticker generation with collision prevention
  const makeCandidateSticker = useCallback(
    (id: number): FloatingSticker => {
      const pool = getCategoryPool(currentCategoryRef.current.id);
      const src = pool[Math.floor(Math.random() * Math.max(pool.length, 1))];

      const width = 170 + Math.random() * 140;
      const radius = 7.5 + width / 40;

      return {
        id,
        src,
        left: 2 + Math.random() * 95,
        top: 2 + Math.random() * 94,
        width,
        radius,
        zIndex: 1 + Math.floor(Math.random() * 7),
        startRotate: -28 + Math.random() * 56,
        driftX: -230 + Math.random() * 460,
        driftY: -200 + Math.random() * 400,
        endRotate: -40 + Math.random() * 80,
        duration: 7 + Math.random() * 10,
        delay: Math.random() * 2,
        opacityPeak: 0.68 + Math.random() * 0.3,
        scalePeak: 1.02 + Math.random() * 0.22,
      };
    },
    [getCategoryPool],
  );

  const isStickerPositionAllowed = useCallback(
    (candidate: FloatingSticker, existingStickers: FloatingSticker[]) => {
      // Safe center zone for hero card
      const isInsideCenterSafeZone =
        candidate.left > 25 && candidate.left < 75 && candidate.top > 20 && candidate.top < 80;

      if (isInsideCenterSafeZone) {
        return false;
      }

      return existingStickers.every((existing) => {
        const dx = candidate.left - existing.left;
        const dy = candidate.top - existing.top;
        const distance = Math.hypot(dx, dy);
        const requiredGap = candidate.radius + existing.radius;

        return distance > requiredGap;
      });
    },
    [],
  );

  const createRandomSticker = useCallback(
    (id: number, existingStickers: FloatingSticker[]): FloatingSticker => {
      let fallbackCandidate = makeCandidateSticker(id);

      for (let attempt = 0; attempt < 50; attempt += 1) {
        const candidate = makeCandidateSticker(id);
        fallbackCandidate = candidate;

        if (isStickerPositionAllowed(candidate, existingStickers)) {
          return candidate;
        }
      }

      return fallbackCandidate;
    },
    [isStickerPositionAllowed, makeCandidateSticker],
  );

  const instanceCount = Math.max(10, Math.min(16, Math.max(allStickers.length * 2, 12)));

  const [floatingStickers, setFloatingStickers] = useState<FloatingSticker[]>(() => {
    const seeded: FloatingSticker[] = [];
    for (let index = 0; index < instanceCount; index += 1) {
      seeded.push(createRandomSticker(index, seeded));
    }
    return seeded;
  });

  const respawnSticker = useCallback(
    (id: number) => {
      setFloatingStickers((current) => {
        const survivors = current.filter((sticker) => sticker.id !== id);
        const replacement = createRandomSticker(id, survivors);
        return current.map((sticker) => (sticker.id === id ? replacement : sticker));
      });
    },
    [createRandomSticker],
  );

  // When category changes, softly swap some background stickers to the new theme
  useEffect(() => {
    const pool = getCategoryPool(currentCategory.id);
    if (pool.length === 0) return;

    setFloatingStickers((current) => {
      const updated = [...current];
      const countToUpdate = Math.min(4, Math.floor(updated.length * 0.4));
      for (let i = 0; i < countToUpdate; i++) {
        const targetIdx = (i * 3 + activeCategoryIndex) % updated.length;
        const nextSrc = pool[Math.floor(Math.random() * pool.length)];
        updated[targetIdx] = {
          ...updated[targetIdx],
          src: nextSrc,
        };
      }
      return updated;
    });
  }, [activeCategoryIndex, currentCategory.id, getCategoryPool]);

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center px-margin overflow-hidden bg-background text-on-background font-body-md">
      {/* Top Right Corner Category Spotlight Indicator */}
      <div className="fixed top-4 right-4 md:top-6 md:right-6 z-30 pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentCategory.id}
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className={`inline-flex items-center gap-2 font-label-md text-label-md px-4 py-2 rounded-full border border-black/10 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)] backdrop-blur-sm ${currentCategory.badgeBg} ${currentCategory.badgeText}`}
          >
            <span>{currentCategory.emoji}</span>
            <span className="font-bold tracking-wide uppercase">
              Spotlight: {currentCategory.shortTag}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Background Floating Canvas */}
      <div className="absolute inset-0 z-0 select-none overflow-hidden bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.96)_0%,rgba(252,248,249,0.92)_42%,rgba(244,237,239,0.95)_100%)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,190,210,0.22),transparent_30%),radial-gradient(circle_at_80%_15%,rgba(0,64,224,0.13),transparent_28%),radial-gradient(circle_at_50%_80%,rgba(245,230,10,0.15),transparent_32%)]" />

        {floatingStickers.map((sticker) => (
          <motion.div
            key={`${sticker.id}-${sticker.src}-${sticker.left.toFixed(1)}-${sticker.top.toFixed(1)}`}
            initial={{
              opacity: 0,
              scale: 0.72,
              x: 0,
              y: 0,
              rotate: sticker.startRotate,
            }}
            animate={{
              opacity: [0, sticker.opacityPeak, sticker.opacityPeak * 0.92, 0],
              scale: [0.72, sticker.scalePeak, sticker.scalePeak * 0.95, 0.86],
              x: [0, sticker.driftX * 0.55, sticker.driftX, sticker.driftX * 0.2],
              y: [0, sticker.driftY * -0.45, sticker.driftY * 0.9, sticker.driftY * 0.15],
              rotate: [
                sticker.startRotate,
                sticker.endRotate,
                sticker.startRotate * 0.35,
                sticker.endRotate,
              ],
            }}
            transition={{
              duration: sticker.duration,
              delay: sticker.delay,
              times: [0, 0.18, 0.78, 1],
              ease: "easeInOut",
            }}
            onAnimationComplete={() => respawnSticker(sticker.id)}
            className="absolute pointer-events-none"
            style={{
              left: `${sticker.left}%`,
              top: `${sticker.top}%`,
              zIndex: sticker.zIndex,
              width: `clamp(140px, ${sticker.width / 16}vw, ${sticker.width + 100}px)`,
            }}
          >
            <img
              alt="Floating sticker"
              className="w-full h-auto object-contain select-none pointer-events-none"
              src={sticker.src}
              decoding="async"
            />
          </motion.div>
        ))}
      </div>

      {/* Hero Content Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-20 text-center max-w-4xl bg-surface/85 backdrop-blur-md p-lg md:p-xl rounded-4xl border border-white/70 shadow-[0_24px_80px_rgba(27,27,28,0.14)]"
      >
        {/* Launch Announcement Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: -6 }}
          animate={{ opacity: 1, scale: 1, rotate: -2 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="inline-block bg-tertiary-fixed text-on-tertiary-fixed font-label-md text-label-md px-4 py-2 rounded-full mb-md shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
        >
          COMING SOON • በቅርቡ ይጠብቁ
        </motion.div>

        {/* Headline */}
        <h1 className="font-display-lg text-display-lg text-on-background mb-md leading-none">
          We are sticking things <br className="hidden md:block" />
          <span className="text-primary italic underline decoration-tertiary-fixed decoration-8 underline-offset-4">
            together
          </span>
          , hang tight.
        </h1>

        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
          Something big is peeling back soon. We're crafting the ultimate playground for vinyl
          enthusiasts, artists, and sticker addicts. Don't let your surfaces stay naked.
        </p>
      </motion.div>

      <Analytics />
    </main>
  );
}
