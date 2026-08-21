import React from "react";
import { cn } from "@/lib/utils";

export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0 to 100
  color?: "primary" | "secondary" | "gold" | "rose";
  showLabel?: boolean;
}

export function ProgressBar({
  value,
  color = "primary",
  showLabel = false,
  className,
  ...props
}: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value));

  const colorStyles = {
    primary: "bg-primary",
    secondary: "bg-secondary",
    gold: "bg-amber-400",
    rose: "bg-rose-500",
  };

  return (
    <div className={cn("w-full", className)} {...props}>
      <div className="h-4 w-full bg-black/10 rounded-full overflow-hidden p-0.5 border border-black/5">
        <div
          className={cn("h-full rounded-full transition-all duration-500 ease-out shadow-sm", colorStyles[color])}
          style={{ width: `${clamped}%` }}
        />
      </div>
      {showLabel && (
        <div className="text-right text-xs font-bold text-muted-foreground mt-1">
          {clamped}%
        </div>
      )}
    </div>
  );
}
