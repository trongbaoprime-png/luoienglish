import React from "react";
import { Button } from "@/components/ui/Button";
import { Utensils } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FeedButtonProps {
  foodBalance: number;
  onFeed: () => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

export function FeedButton({
  foodBalance,
  onFeed,
  disabled = false,
  loading = false,
  className,
}: FeedButtonProps) {
  const hasFood = foodBalance > 0;

  return (
    <div className={cn("flex flex-col items-center gap-1.5", className)}>
      <Button
        onClick={onFeed}
        disabled={disabled || !hasFood || loading}
        variant={hasFood ? "reward" : "outline"}
        size="lg"
        className={cn(
          "gap-2 px-6 py-3 rounded-2xl text-sm font-black shadow-card transition-all active:scale-95",
          hasFood && "hover:shadow-glow-sm"
        )}
      >
        <Utensils className="w-5 h-5" />
        <span>Cho Lười Ăn (1 🍎)</span>
      </Button>
      <span className="text-[11px] font-bold text-muted-foreground">
        Thức ăn có sẵn: <strong className={hasFood ? "text-amber-600 font-extrabold" : "text-rose-500"}>{foodBalance} 🍎</strong>
      </span>
    </div>
  );
}
