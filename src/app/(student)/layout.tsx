"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import {
  Home,
  Map,
  MessageCircle,
  BookOpen,
  Video,
  Gamepad2,
  Heart,
  TrendingUp,
  ShieldCheck,
  Star,
  Zap,
  Coins,
  Utensils,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [balance] = useState({
    stars: 12,
    xp: 180,
    coins: 85,
    petFood: 5,
  });

  const navItems = [
    { href: "/home", label: "Trang Chủ", icon: Home },
    { href: "/adventure-map", label: "Bản Đồ", icon: Map },
    { href: "/talk-to-luoi", label: "Nói Cùng Lười", icon: MessageCircle },
    { href: "/story-world", label: "Góc Truyện", icon: BookOpen },
    { href: "/media-world", label: "Media & Nhạc", icon: Video },
    { href: "/game-land", label: "Trò Chơi", icon: Gamepad2 },
    { href: "/pet", label: "Nuôi Lười", icon: Heart },
    { href: "/progress", label: "Tiến Độ", icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-card/90 backdrop-blur-md border-b-2 border-border px-4 py-3 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Logo & Slogan */}
          <Link href="/home" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center font-black text-xl shadow-sm group-hover:scale-105 transition-transform">
              🦥
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-black tracking-tight text-foreground leading-none">
                LƯỜI ENGLISH
              </h1>
              <span className="text-[10px] font-bold text-primary block mt-0.5">
                Lười học mà vẫn giỏi!
              </span>
            </div>
          </Link>

          {/* Reward Balances */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-amber-100/80 px-3 py-1.5 rounded-full border border-amber-300 text-amber-900 text-xs font-bold shadow-sm">
              <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
              <span>{balance.stars}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-sky-100/80 px-3 py-1.5 rounded-full border border-sky-300 text-sky-900 text-xs font-bold shadow-sm">
              <Zap className="w-4 h-4 fill-sky-400 text-sky-500" />
              <span>{balance.xp} XP</span>
            </div>
            <div className="flex items-center gap-1.5 bg-yellow-100/80 px-3 py-1.5 rounded-full border border-yellow-300 text-yellow-900 text-xs font-bold shadow-sm">
              <Coins className="w-4 h-4 text-yellow-600" />
              <span>{balance.coins}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-emerald-100/80 px-3 py-1.5 rounded-full border border-emerald-300 text-emerald-900 text-xs font-bold shadow-sm">
              <Utensils className="w-4 h-4 text-emerald-600" />
              <span>{balance.petFood}</span>
            </div>
          </div>

          {/* Controls: Theme Switcher & Parent Gate */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              href="/parent"
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-muted border border-border text-xs font-bold text-foreground hover:bg-muted/80 transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-muted-foreground" />
              <span className="hidden sm:inline">Phụ Huynh</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 mb-20 md:mb-6">
        {children}
      </main>

      {/* Bottom Bar Navigation for Kids */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-md border-t-2 border-border py-2 px-2 md:hidden">
        <div className="flex items-center justify-around">
          {navItems.slice(0, 5).map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex flex-col items-center gap-1 p-2 rounded-xl text-[10px] font-bold transition-all",
                  isActive
                    ? "text-primary scale-110 font-extrabold"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
