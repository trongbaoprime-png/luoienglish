import React from "react";
import { PetInteractionType } from "@/types/pet";
import { Heart, Sparkles, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

export interface InteractionMenuProps {
  onInteract: (type: PetInteractionType) => void;
  disabled?: boolean;
  className?: string;
}

export function InteractionMenu({
  onInteract,
  disabled = false,
  className,
}: InteractionMenuProps) {
  const actions = [
    {
      type: "PET" as PetInteractionType,
      label: "Xoa đầu",
      icon: Heart,
      color: "bg-rose-100 text-rose-600 hover:bg-rose-200 border-rose-300",
    },
    {
      type: "PLAY_SHORT" as PetInteractionType,
      label: "Chơi cùng",
      icon: Sparkles,
      color: "bg-amber-100 text-amber-700 hover:bg-amber-200 border-amber-300",
    },
    {
      type: "REST" as PetInteractionType,
      label: "Nghỉ ngơi",
      icon: Moon,
      color: "bg-indigo-100 text-indigo-700 hover:bg-indigo-200 border-indigo-300",
    },
    {
      type: "WAKE" as PetInteractionType,
      label: "Dậy nào!",
      icon: Sun,
      color: "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-emerald-300",
    },
  ];

  return (
    <div className={cn("flex items-center justify-center gap-2.5", className)}>
      {actions.map(({ type, label, icon: Icon, color }) => (
        <button
          key={type}
          onClick={() => onInteract(type)}
          disabled={disabled}
          className={cn(
            "flex flex-col items-center gap-1 px-3 py-2 rounded-2xl border text-xs font-black shadow-sm transition-transform active:scale-95 disabled:opacity-50 disabled:pointer-events-none",
            color
          )}
        >
          <Icon className="w-4 h-4" />
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}
