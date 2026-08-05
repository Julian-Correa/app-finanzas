import { motion, AnimatePresence, type Variants } from "framer-motion";
import type { ReactNode } from "react";

const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 30 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 350, damping: 28, mass: 0.9 },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: { duration: 0.15, ease: "easeIn" },
  },
};

interface ModalWrapperProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}

export function ModalWrapper({ open, onClose, children, className }: ModalWrapperProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40 backdrop-blur-sm sm:items-center"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={onClose}
        >
          <motion.div
            className={
              className ??
              "w-full max-w-lg rounded-t-2xl border border-slate-200/70 bg-white/95 p-6 shadow-soft backdrop-blur-2xl dark:border-white/10 dark:bg-zinc-900/95 sm:rounded-2xl"
            }
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
