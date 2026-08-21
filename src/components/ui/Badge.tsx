import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "primary" | "secondary" | "accent" | "outline" | "success";
  children: React.ReactNode;
}

export function Badge({
  className,
  variant = "primary",
  children,
  ...props
}: BadgeProps) {
  const variantStyles = {
    primary: "bg-primary/15 text-primary border border-primary/30",
    secondary: "bg-secondary/15 text-secondary border border-secondary/30",
    accent: "bg-amber-100 text-amber-900 border border-amber-300",
    outline: "bg-white text-foreground border border-border",
    success: "bg-emerald-100 text-emerald-800 border border-emerald-300",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
