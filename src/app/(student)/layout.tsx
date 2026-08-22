"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { ParentalGateModal } from "@/components/auth/ParentalGateModal";
import {
  Home,
  Map,
  MessageCircle,
  Video,
  Heart,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isParentGateOpen, setIsParentGateOpen] = useState(false);

  const navItems = [
    { href: "/home", label: "Home", icon: Home, iconEmoji: "🏠" },
    { href: "/adventure-map", label: "Map", icon: Map, iconEmoji: "🗺️" },
    { href: "/talk-to-luoi", label: "AI Talk", icon: MessageCircle, iconEmoji: "💬" },
    { href: "/media-world", label: "Media", icon: Video, iconEmoji: "🎬" },
    { href: "/pet", label: "Pet", icon: Heart, iconEmoji: "🐾" },
  ];

  const handleParentGateSuccess = () => {
    setIsParentGateOpen(false);
    router.push("/parent");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDF7] text-[#2D2A26]">
      {/* Top 3D Header Bar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b-2 border-amber-200/80 px-4 py-2.5 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Logo & Slogan */}
          <Link href="/home" className="flex items-center gap-2.5 group no-underline">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF8A3D] to-[#FFD166] border-2 border-white text-white flex items-center justify-center font-black text-xl shadow-xs group-hover:scale-105 transition-transform">
              🦥
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-black font-display tracking-tight text-foreground leading-none">
                LƯỜI ENGLISH
              </h1>
              <span className="text-[10px] font-bold text-primary block mt-0.5">
                Lười học mà vẫn giỏi!
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-2">
            {navItems.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href || (href !== "/home" && pathname.startsWith(href));
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black transition-all",
                    isActive
                      ? "btn-3d btn-3d-orange text-white"
                      : "text-muted-foreground hover:text-foreground hover:bg-amber-50"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Controls: Theme Switcher & Parent Gate */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setIsParentGateOpen(true)}
              aria-label="Mở cổng phụ huynh"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-100/80 border border-amber-300 text-xs font-black text-amber-950 hover:bg-amber-200 transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-amber-800" />
              <span className="hidden sm:inline">Phụ Huynh</span>
            </button>
          </div>
        </div>
      </header>

      {/* Parental Gate Modal */}
      <ParentalGateModal
        isOpen={isParentGateOpen}
        onClose={() => setIsParentGateOpen(false)}
        onSuccess={handleParentGateSuccess}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 mb-20 md:mb-6">
        {children}
      </main>

      {/* Bottom Bar 3D Dock for Mobile (Master Design) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t-3 border-amber-200 py-1.5 px-3 md:hidden shadow-lg">
        <div className="flex items-center justify-around">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || (href !== "/home" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex flex-col items-center gap-0.5 p-1.5 rounded-2xl text-[10px] font-black transition-all",
                  isActive
                    ? "text-primary scale-110 font-extrabold"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-xl flex items-center justify-center transition-all",
                    isActive ? "bg-amber-100 text-primary shadow-xs" : "bg-transparent"
                  )}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span>{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
