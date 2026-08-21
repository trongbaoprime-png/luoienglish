import React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: "default" | "elevated" | "flat" | "accent";
}

export function Card({
  className,
  variant = "default",
  children,
  ...props
}: CardProps) {
  const variantStyles = {
    default: "bg-card text-card-foreground border-2 border-border shadow-card",
    elevated: "bg-card text-card-foreground border-2 border-border shadow-float",
    flat: "bg-muted/40 text-foreground border border-border/50",
    accent: "bg-accent/20 text-accent-foreground border-2 border-accent shadow-card",
  };

  return (
    <div
      className={cn("rounded-3xl p-5 sm:p-6 transition-all duration-200", variantStyles[variant], className)}
      {...props}
    >
      {children}
    </div>
  );
}
