"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

const ease = [0.22, 1, 0.36, 1] as const;

type FadeInProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  replayKey?: string;
};

export function FadeIn({ children, className, delay = 0, y = 8, replayKey }: FadeInProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      key={replayKey}
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={reduce ? { duration: 0 } : { duration: 0.4, delay, ease }}
    >
      {children}
    </motion.div>
  );
}
