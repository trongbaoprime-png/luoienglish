"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ShieldCheck, Lock, Delete, X, AlertTriangle } from "lucide-react";
import { useAuth } from "@/lib/auth/authContext";

interface ParentalGateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ParentalGateModal({ isOpen, onClose, onSuccess }: ParentalGateModalProps) {
  const { getIdToken } = useAuth();
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

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
        setError("Chưa phát hiện phiên đăng nhập phụ huynh. Vui lòng đăng nhập lại.");
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
        onSuccess();
      } else {
        setError(data.message || "Mã PIN không chính xác.");
        if (data.isLocked) {
          setIsLocked(true);
        }
        setPin("");
      }
    } catch {
      setError("Không thể kết nối đến máy chủ xác thực. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <Card className="w-full max-w-sm p-6 bg-white flex flex-col items-center gap-4 relative shadow-float">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground p-1.5 rounded-full"
          aria-label="Đóng cửa sổ"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
          <ShieldCheck className="w-6 h-6" />
        </div>

        <div className="text-center">
          <Badge variant="primary" className="mb-1">
            Cổng Phụ Huynh
          </Badge>
          <h3 className="text-xl font-black text-foreground">Xác Nhận Người Lớn</h3>
          <p className="text-xs text-muted-foreground mt-1 font-semibold">
            Nhập mã PIN phụ huynh để mở khóa bảng điều khiển (Hiệu lực 15 phút)
          </p>
        </div>

        {/* PIN Dots Display */}
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

        {/* Numeric Keypad */}
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
            {isLoading ? "..." : "Xong"}
          </button>
        </div>

        <div className="text-center mt-2">
          <span className="text-[11px] text-muted-foreground flex items-center justify-center gap-1">
            <Lock className="w-3 h-3" />
            <span>Phiên bảo vệ người lớn tự động khóa lại sau 15 phút</span>
          </span>
        </div>
      </Card>
    </div>
  );
}
