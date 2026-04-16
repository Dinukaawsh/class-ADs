"use client";

import { useMemo, useState } from "react";
import { motion, useMotionValue } from "framer-motion";
import { AdCard, type AdCardData } from "@/components/ad-card";
import styles from "./ad-carousel.module.css";

const GAP = 12;
const ITEM_WIDTH = 354;
const TRACK_ITEM_OFFSET = ITEM_WIDTH + GAP;
const DRAG_BUFFER = 0;
const VELOCITY_THRESHOLD = 500;
const SPRING = { type: "spring", stiffness: 300, damping: 30 } as const;

export function AdCarousel({ ads }: { ads: AdCardData[] }) {
  const loop = ads.length > 1;
  const itemsForRender = useMemo(() => {
    if (!loop) return ads;
    return [ads[ads.length - 1], ...ads, ads[0]];
  }, [ads, loop]);

  const [position, setPosition] = useState(loop ? 1 : 0);
  const [isJumping, setIsJumping] = useState(false);
  const x = useMotionValue(-(loop ? 1 : 0) * TRACK_ITEM_OFFSET);

  function handleDragEnd(
    _e: MouseEvent | TouchEvent | PointerEvent,
    info: { offset: { x: number }; velocity: { x: number } },
  ) {
    const { offset, velocity } = info;
    const direction =
      offset.x < -DRAG_BUFFER || velocity.x < -VELOCITY_THRESHOLD
        ? 1
        : offset.x > DRAG_BUFFER || velocity.x > VELOCITY_THRESHOLD
          ? -1
          : 0;
    if (direction === 0) return;

    setPosition((prev) => {
      const next = prev + direction;
      const max = itemsForRender.length - 1;
      return Math.max(0, Math.min(next, max));
    });
  }

  function handleAnimationComplete() {
    if (!loop || itemsForRender.length <= 1) return;
    const lastClone = itemsForRender.length - 1;

    if (position === lastClone) {
      setIsJumping(true);
      const target = 1;
      setPosition(target);
      x.set(-target * TRACK_ITEM_OFFSET);
      requestAnimationFrame(() => setIsJumping(false));
      return;
    }

    if (position === 0) {
      setIsJumping(true);
      const target = ads.length;
      setPosition(target);
      x.set(-target * TRACK_ITEM_OFFSET);
      requestAnimationFrame(() => setIsJumping(false));
    }
  }

  const activeIndex =
    ads.length === 0 ? 0 : loop ? (position - 1 + ads.length) % ads.length : position;

  return (
    <div className={styles.container}>
      <motion.div
        className={styles.track}
        drag={ads.length > 1 ? "x" : false}
        dragConstraints={{
          left: -TRACK_ITEM_OFFSET * Math.max(itemsForRender.length - 1, 0),
          right: 0,
        }}
        onDragEnd={handleDragEnd}
        style={{ x }}
        animate={{ x: -(position * TRACK_ITEM_OFFSET) }}
        transition={isJumping ? { duration: 0 } : SPRING}
        onAnimationComplete={handleAnimationComplete}
      >
        {itemsForRender.map((ad, index) => (
          <div key={`${ad._id}-${index}`} className={styles.item}>
            <AdCard ad={ad} />
          </div>
        ))}
      </motion.div>

      {ads.length > 1 && (
        <div className={styles.indicatorsWrap}>
          <div className={styles.indicators}>
            {ads.map((ad, index) => (
              <button
                key={ad._id}
                type="button"
                onClick={() => setPosition(loop ? index + 1 : index)}
                className={`${styles.dot} ${
                  activeIndex === index ? styles.dotActive : styles.dotInactive
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
