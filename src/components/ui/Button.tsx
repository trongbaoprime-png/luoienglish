"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "reward";
  size?: "sm" | "md" | "lg" | "xl";
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, disabled, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-bold tracking-wide rounded-2xl transition-all duration-150 active:translate-y-1 select-none disabled:opacity-50 disabled:pointer-events-none disabled:transform-none cursor-pointer";

    const variantStyles = {
      primary:
        "bg-primary text-primary-foreground border-b-4 border-amber-600 hover:brightness-105 active:border-b-0",
      secondary:
        "bg-secondary text-secondary-foreground border-b-4 border-emerald-700 hover:brightness-105 active:border-b-0",
      outline:
        "bg-white text-foreground border-2 border-border border-b-4 hover:bg-muted active:border-b-2",
      ghost: "bg-transparent text-foreground hover:bg-muted/50 active:translate-y-0",
      danger:
        "bg-rose-500 text-white border-b-4 border-rose-700 hover:bg-rose-600 active:border-b-0",
      reward:
        "bg-amber-400 text-amber-950 border-b-4 border-amber-600 hover:bg-amber-300 active:border-b-0 shadow-lg",
    };

    const sizeStyles = {
      sm: "text-sm px-3 py-1.5 rounded-xl border-b-2",
      md: "text-base px-5 py-2.5 rounded-2xl border-b-4",
      lg: "text-lg px-7 py-3.5 rounded-3xl border-b-4",
      xl: "text-xl px-9 py-4 rounded-3xl border-b-4",
    };

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
