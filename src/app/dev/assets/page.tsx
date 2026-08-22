"use client";

import React, { useState } from "react";
import { listRegisteredAssets, AssetMetadata } from "@/lib/assets/assetRegistry";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Search, ImageIcon } from "lucide-react";

export default function DevAssetsPage() {
  const [filter, setFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const assets = listRegisteredAssets();

  const filteredAssets = assets.filter((asset) => {
    const matchesQuery =
      asset.id.toLowerCase().includes(filter.toLowerCase()) ||
      asset.category.toLowerCase().includes(filter.toLowerCase());
    const matchesCategory = categoryFilter === "all" || asset.category === categoryFilter;
    return matchesQuery && matchesCategory;
  });

  return (
    <div className="p-6 max-w-6xl mx-auto flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <Badge variant="primary" className="mb-1">Development Only</Badge>
          <h1 className="text-2xl font-black text-foreground">Asset Inspector (/dev/assets)</h1>
          <p className="text-xs text-muted-foreground">
            Danh mục kiểm tra toàn bộ tài nguyên hình ảnh, linh vật, hoạt ảnh và quy ước fallback.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Tìm asset ID..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="pl-9 pr-3 py-1.5 rounded-xl border border-border text-xs bg-white"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-border text-xs bg-white font-bold"
          >
            <option value="all">Tất cả ({assets.length})</option>
            <option value="character">Character</option>
            <option value="world">World</option>
            <option value="reward">Reward</option>
            <option value="icon">Icon</option>
            <option value="pet">Pet</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredAssets.map((asset: AssetMetadata) => (
          <Card key={asset.id} className="p-4 flex flex-col gap-2 bg-white/90 border-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-muted-foreground capitalize">
                {asset.category} {asset.theme && `• ${asset.theme}`}
              </span>
              <Badge
                variant={
                  asset.status === "PRODUCTION"
                    ? "secondary"
                    : asset.status === "PROVISIONAL"
                    ? "primary"
                    : "outline"
                }
                className="text-[10px]"
              >
                {asset.status}
              </Badge>
            </div>

            <h4 className="text-xs font-black text-foreground font-mono truncate">{asset.id}</h4>

            <div className="h-28 bg-muted/20 rounded-2xl border border-border/60 flex items-center justify-center overflow-hidden p-2">
              <div className="flex flex-col items-center gap-1 text-muted-foreground">
                <ImageIcon className="w-8 h-8 opacity-40" />
                <span className="text-[10px] font-mono">{asset.url}</span>
              </div>
            </div>

            <div className="text-[10px] text-muted-foreground flex flex-col gap-0.5 mt-1 font-mono">
              <span>Fallback: {asset.fallbackUrl}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
