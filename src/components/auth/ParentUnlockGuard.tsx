"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ShieldCheck, Lock, Delete, ArrowLeft, AlertTriangle } from "lucide-react";
import { useAuth } from "@/lib/auth/authContext";

export function ParentUnlockGuard() {
  const router = useRouter();
  const { getIdToken } = useAuth();
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleKeyClick = (digit: string) => {
    if (pin.length < 6 && !isLocked) {
      setPin((prev) => prev + digit);
      setError(null);
    }
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
    setError(null);
  };

  const handleVerify = async () => {
    if (!pin || pin.length < 4) {
      setError("Vui lòng nhập đầy đủ mã PIN (4–6 số).");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const token = await getIdToken();
      if (!token) {
        setError("Vui lòng đăng nhập tài khoản phụ huynh trước.");
        setIsLoading(false);
        return;
      }

      const res = await fetch("/api/auth/pin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action: "verify", pin }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setPin("");
        router.refresh();
      } else {
        setError(data.message || "Mã PIN không chính xác.");
        if (data.isLocked) {
          setIsLocked(true);
        }
        setPin("");
      }
    } catch {
      setError("Không thể kết nối đến máy chủ xác thực.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 animate-fade-in">
      <Card className="w-full max-w-sm p-6 bg-white flex flex-col items-center gap-4 shadow-float">
        <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
          <Lock className="w-6 h-6" />
        </div>

        <div className="text-center">
          <Badge variant="primary" className="mb-1">
            Cổng Bảo Vệ Người Lớn
          </Badge>
          <h2 className="text-xl font-black text-foreground">Khu Vực Đang Bị Khóa</h2>
          <p className="text-xs text-muted-foreground mt-1 font-semibold">
            Vui lòng nhập mã PIN phụ huynh để truy cập Bảng điều khiển
          </p>
        </div>

        {/* PIN Dots */}
        <div className="flex items-center gap-3 my-2">
          {[0, 1, 2, 3].map((idx) => (
            <div
              key={idx}
              className={`w-4 h-4 rounded-full border-2 transition-all ${
                pin.length > idx
                  ? "bg-primary border-primary scale-110"
                  : "border-border bg-muted/40"
              }`}
            />
          ))}
        </div>

        {/* Error Alert */}
        {error && (
          <div className="w-full p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-2.5 w-full mt-2">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
            <button
              key={num}
              onClick={() => handleKeyClick(num)}
              disabled={isLocked || isLoading}
              className="h-12 rounded-2xl bg-muted/30 hover:bg-muted font-black text-lg text-foreground border border-border/60 active:scale-95 transition-all"
            >
              {num}
            </button>
          ))}
          <button
            onClick={handleDelete}
            disabled={isLocked || isLoading || pin.length === 0}
            className="h-12 rounded-2xl bg-muted/20 hover:bg-muted/40 flex items-center justify-center text-muted-foreground border border-border/40"
          >
            <Delete className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleKeyClick("0")}
            disabled={isLocked || isLoading}
            className="h-12 rounded-2xl bg-muted/30 hover:bg-muted font-black text-lg text-foreground border border-border/60 active:scale-95 transition-all"
          >
            0
          </button>
          <button
            onClick={handleVerify}
            disabled={isLocked || isLoading || pin.length < 4}
            className="h-12 rounded-2xl bg-primary hover:bg-primary-hover text-primary-foreground font-black text-xs uppercase tracking-wider shadow-sm disabled:opacity-50"
          >
            {isLoading ? "..." : "Mở Khóa"}
          </button>
        </div>

        <div className="w-full pt-4 border-t border-border/60 flex items-center justify-between">
          <Link href="/home">
            <Button variant="outline" size="sm" className="gap-1 text-xs">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Góc Bé Học</span>
            </Button>
          </Link>
          <span className="text-[11px] text-muted-foreground flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Mã mặc định: 1234</span>
          </span>
        </div>
      </Card>
    </div>
  );
}
