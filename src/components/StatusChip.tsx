import clsx from "clsx";
import type { ReactNode } from "react";

type Variant = "neutral" | "cyan" | "success" | "warning" | "error";

const VARIANT_CLASSES: Record<Variant, string> = {
  neutral: "bg-surface-container-low text-on-surface-variant border-outline-variant",
  cyan: "bg-accent-cyan/10 text-primary-container border-accent-cyan/40",
  success: "bg-success-container text-success border-success/30",
  warning: "bg-warning-container text-warning border-warning/30",
  error: "bg-error-container text-error border-error/30",
};

export function StatusChip({
  children,
  variant = "neutral",
  className,
}: {
  children: ReactNode;
  variant?: Variant;
  className?: string;
}) {
  return (
    <span
      className={clsx(
        "font-mono text-[10px] tracking-widest uppercase px-2 py-0.5 rounded-md border inline-flex items-center gap-1",
        VARIANT_CLASSES[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
