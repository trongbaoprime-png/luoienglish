"use client";

import React from "react";
import { KnowledgeItem } from "@/types/curriculum";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { AudioButton } from "./AudioButton";
import { cn } from "@/lib/utils";

export interface KnowledgeItemCardProps {
  item: KnowledgeItem;
  className?: string;
}

export function KnowledgeItemCard({ item, className }: KnowledgeItemCardProps) {
  return (
    <Card
      className={cn(
        "relative flex flex-col justify-between overflow-hidden group hover:border-primary transition-all duration-300",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <Badge variant="primary" className="mb-2">
            {item.type}
          </Badge>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight group-hover:text-primary transition-colors">
            {item.primaryText}
          </h3>
          {item.phoneticIpa && (
            <span className="text-sm font-semibold text-muted-foreground block mt-0.5">
              {item.phoneticIpa}
            </span>
          )}
        </div>
        <AudioButton textToSpeak={item.primaryText} size="md" />
      </div>

      <div className="pt-3 border-t border-border/60">
        <p className="text-lg font-bold text-primary mb-1">
          {item.vietnameseMeaning}
        </p>
        {item.exampleSentence && (
          <p className="text-xs text-muted-foreground italic mt-2 bg-muted/40 p-2.5 rounded-xl border border-border/40">
            &ldquo;{item.exampleSentence}&rdquo;
          </p>
        )}
      </div>
    </Card>
  );
}
