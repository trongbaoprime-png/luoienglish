"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { SlothMascot } from "@/components/mascot/SlothMascot";
import { AudioButton } from "@/components/learning/AudioButton";
import { Send, HelpCircle } from "lucide-react";

export default function TalkToLuoiPage() {
  const [messages, setMessages] = useState<{ sender: "luoi" | "user"; text: string; textVi?: string }[]>([
    {
      sender: "luoi",
      text: "Hello! My name is Chú Lười. What's your name?",
      textVi: "Xin chào! Mình là Chú Lười. Tên của bạn là gì nè?",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [hintLevel, setHintLevel] = useState(0);

  const hints = [
    "Gợi ý 1: Bạn có thể bắt đầu bằng 'My name is...'",
    "Gợi ý 2: Ví dụ 'My name is Bao Nhi.'",
    "Gợi ý 3: Hãy thử nói 'Hello Chú Lười! My name is Linh.'",
  ];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg = inputText.trim();
    setMessages((prev) => [...prev, { sender: "user", text: userMsg }]);
    setInputText("");

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: "luoi",
          text: `Nice to meet you, friend! You speak English so well!`,
          textVi: `Rất vui được làm quen với bạn! Bạn nói tiếng Anh giỏi quá!`,
        },
      ]);
    }, 1000);
  };

  const handleRequestHint = () => {
    setHintLevel((prev) => (prev < hints.length ? prev + 1 : 1));
  };

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <Badge variant="primary" className="mb-1">
            Giao Tiếp AI An Toàn
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-black text-foreground">
            Trò Chuyện Cùng Chú Lười
          </h2>
        </div>
        <Button onClick={handleRequestHint} variant="outline" size="sm" className="gap-1.5">
          <HelpCircle className="w-4 h-4 text-primary" />
          <span>Gợi Ý Trợ Giúp ({hintLevel}/3)</span>
        </Button>
      </div>

      {hintLevel > 0 && (
        <div className="bg-amber-100/90 border border-amber-300 p-3 rounded-2xl text-xs font-bold text-amber-950 animate-fade-in">
          💡 {hints[hintLevel - 1]}
        </div>
      )}

      {/* Chat Conversation Box */}
      <Card className="min-h-[380px] p-6 flex flex-col justify-between bg-white/90">
        <div className="flex flex-col gap-4 overflow-y-auto max-h-[400px] p-2">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 ${
                msg.sender === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              {msg.sender === "luoi" && <SlothMascot pose="speaking" size="sm" />}
              <div
                className={`max-w-[75%] p-4 rounded-3xl text-sm font-bold shadow-sm ${
                  msg.sender === "user"
                    ? "bg-primary text-primary-foreground rounded-tr-none"
                    : "bg-muted/50 text-foreground border border-border/60 rounded-tl-none"
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <p>{msg.text}</p>
                  {msg.sender === "luoi" && <AudioButton textToSpeak={msg.text} size="sm" />}
                </div>
                {msg.textVi && (
                  <p className="text-xs text-muted-foreground font-semibold pt-1 border-t border-border/40">
                    {msg.textVi}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="flex items-center gap-2 mt-4 pt-4 border-t border-border/60">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Nhập câu trả lời bằng tiếng Anh..."
            className="flex-1 px-4 py-3 rounded-2xl border-2 border-border bg-white text-foreground font-bold text-sm focus:outline-none focus:border-primary"
          />
          <Button type="submit" variant="primary" size="md">
            <Send className="w-5 h-5" />
          </Button>
        </form>
      </Card>
    </div>
  );
}
