"use client";
import type { ReactNode } from "react";

interface CardHeaderProps {
  icon: ReactNode;
  title: string;
  /** Renders the title as an h2 for the single most important card. */
  as?: "h2" | "h3";
}

export function CardHeader({ icon, title, as = "h3" }: CardHeaderProps) {
  const Tag = as;
  return (
    <header className="flex items-center gap-3 mb-5">
      <span className="text-accent-light text-xl shrink-0" aria-hidden="true">
        {icon}
      </span>
      <Tag className="text-[clamp(1rem,2.5vw,1.125rem)] font-bold text-white">{title}</Tag>
    </header>
  );
}

/**
 * Placeholder shown inside a single card while its data loads, so one slow
 * request never blocks the rest of the page from rendering.
 */
export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-white/[0.06] ${className}`}
      aria-hidden="true"
    />
  );
}

export function CardBody({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`p-6 sm:p-7 h-full flex flex-col ${className}`}>{children}</div>;
}
