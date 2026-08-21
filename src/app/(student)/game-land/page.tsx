"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Gamepad2, Sparkles } from "lucide-react";

export default function GameLandPage() {
  const games = [
    {
      id: "game_word_catch",
      title: "Hứng Từ Vựng Đúng",
      description: "Điều khiển Chú Lười hứng đúng quả táo mang từ tiếng Anh tương ứng!",
      reward: "+15 Xu / ván",
    },
    {
      id: "game_sentence_builder",
      title: "Xây Cầu Câu Chuyện",
      description: "Xếp các khối từ thành câu hoàn chỉnh để giúp Chú Lười qua sông.",
      reward: "+20 Xu / ván",
    },
  ];

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <Badge variant="accent" className="mb-1">
            Game Land • Học Qua Trò Chơi
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-black text-foreground">
            Khu Trò Chơi Phản Xạ Tiếng Anh
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {games.map((game) => (
          <Card key={game.id} className="flex flex-col justify-between hover:border-primary">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-3">
                <Gamepad2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-foreground mb-1">{game.title}</h3>
              <p className="text-xs text-muted-foreground mb-3">{game.description}</p>
              <Badge variant="success">{game.reward}</Badge>
            </div>

            <Button variant="primary" size="md" className="mt-5 w-full gap-2">
              <Sparkles className="w-4 h-4" />
              <span>Chơi Ngay</span>
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
