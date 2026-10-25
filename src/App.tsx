/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useMemo, useState } from "react";
import { motion } from "motion/react";
import { Analytics } from "@vercel/analytics/react";

const stickerModules = import.meta.glob("../public/stickers/*.{png,jpg,jpeg,webp,gif}", {
  eager: true,
  import: "default",
}) as Record<string, string>;

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

export default function App() {
  const stickerCatalog = useMemo(
    () =>
      Object.values(stickerModules).sort((a, b) =>
        a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }),
      ),
    [],
  );

  const makeCandidateSticker = useCallback(
    (id: number): FloatingSticker => {
      const fallback = "/stickers/Asset%201@2x-8.png";
      const src =
        stickerCatalog[Math.floor(Math.random() * Math.max(stickerCatalog.length, 1))] ?? fallback;

      const width = 180 + Math.random() * 150;
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
        opacityPeak: 0.65 + Math.random() * 0.32,
        scalePeak: 1.02 + Math.random() * 0.25,
      };
    },
    [stickerCatalog],
  );

  const isStickerPositionAllowed = useCallback(
    (candidate: FloatingSticker, existingStickers: FloatingSticker[]) => {
      const isInsideCenterSafeZone =
        candidate.left > 27 && candidate.left < 73 && candidate.top > 24 && candidate.top < 76;

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

  const instanceCount = Math.max(10, Math.min(16, stickerCatalog.length * 2));

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

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center px-margin overflow-hidden bg-background text-on-background font-body-md">
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
              rotate: [sticker.startRotate, sticker.endRotate, sticker.startRotate * 0.35, sticker.endRotate],
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
              className="w-full h-auto object-contain"
              src={sticker.src}
            />
          </motion.div>
        ))}
      </div>

      {/* Hero Content Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-20 text-center max-w-4xl bg-surface/84 backdrop-blur-md p-lg md:p-xl rounded-4xl border border-white/70 shadow-[0_24px_80px_rgba(27,27,28,0.14)]"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
          animate={{ opacity: 1, scale: 1, rotate: -2 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
          className="inline-block bg-tertiary-fixed text-on-tertiary-fixed font-label-md text-label-md px-4 py-2 rounded-full mb-md shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
        >
          COMING SOON • በቅርቡ ይጠብቁ
        </motion.div>
        
        <h1 className="font-display-lg text-display-lg text-on-background mb-md leading-none">
          We are sticking things <br className="hidden md:block" />
          <span className="text-primary italic underline decoration-tertiary-fixed decoration-8 underline-offset-4">
            together
          </span>
          , hang tight.
        </h1>
        
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
          Something big is peeling back soon. We're crafting the ultimate playground for vinyl enthusiasts, artists, and sticker addicts. Don't let your surfaces stay naked.
        </p>
      </motion.div>

      <Analytics />
    </main>
  );
}
