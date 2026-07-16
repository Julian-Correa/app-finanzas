import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  viewportAmount?: number;
}

export function StaggerContainer({
  children,
  className,
  viewportAmount = 0.15,
}: StaggerContainerProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: viewportAmount }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
