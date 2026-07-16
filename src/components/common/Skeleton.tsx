import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg bg-slate-200/80 dark:bg-white/10",
        "before:absolute before:inset-0 before:-translate-x-full before:animate-shimmer before:bg-gradient-to-r before:from-transparent before:via-white/70 before:to-transparent dark:before:via-white/10",
        className
      )}
    />
  );
}

interface SkeletonCardProps {
  className?: string;
  children?: ReactNode;
}

export function SkeletonCard({ className, children }: SkeletonCardProps) {
  return (
    <div className={cn("rounded-card border border-slate-200/70 bg-white/75 p-5 dark:border-white/10 dark:bg-white/[0.04]", className)}>
      {children ?? (
        <div className="space-y-3">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      )}
    </div>
  );
}
