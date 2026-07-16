import { motion, type Variants } from "framer-motion";
import type { ReactNode, ElementType } from "react";

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 25,
      mass: 0.8,
    },
  },
};

interface MotionCardProps {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  hover?: "lift" | "glow" | "none";
  reveal?: "inherit" | "scroll";
  viewportAmount?: number;
  [key: string]: unknown;
}

export function MotionCard({
  as: Tag = "div",
  children,
  className,
  hover = "lift",
  reveal = "inherit",
  viewportAmount = 0.15,
  ...props
}: MotionCardProps) {
  const hoverAnimation =
    hover === "lift"
      ? { y: -4, boxShadow: "0 20px 60px -20px rgb(15 23 42 / 0.35)" }
      : hover === "glow"
        ? { boxShadow: "0 0 30px -5px rgb(37 99 235 / 0.25)" }
        : {};

  return (
    <motion.div
      variants={cardVariants}
      initial={reveal === "scroll" ? "hidden" : undefined}
      whileInView={reveal === "scroll" ? "visible" : undefined}
      viewport={reveal === "scroll" ? { once: true, amount: viewportAmount } : undefined}
      whileHover={hoverAnimation}
      transition={{ type: "spring" as const, stiffness: 400, damping: 25 }}
      className={className}
      {...(props as Record<string, unknown>)}
    >
      {children}
    </motion.div>
  );
}
