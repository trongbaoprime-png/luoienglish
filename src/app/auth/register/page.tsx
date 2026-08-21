"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useAuth } from "@/lib/auth/authContext";
import { ShieldCheck, Mail, Lock, User, ArrowRight, AlertCircle } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { registerWithEmail, isLoading, error, clearError } = useAuth();

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    if (!displayName || !email || !password) {
      setLocalError("Vui lòng điền đầy đủ các thông tin yêu cầu.");
      return;
    }

    if (password.length < 6) {
      setLocalError("Mật khẩu phải có tối thiểu 6 ký tự.");
      return;
    }

    if (password !== confirmPassword) {
      setLocalError("Mật khẩu xác nhận không khớp.");
      return;
    }

    try {
      await registerWithEmail(email, password, displayName);
      router.push("/parent");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setLocalError(err.message);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background text-foreground animate-fade-in">
      <Card className="w-full max-w-md p-8 bg-white flex flex-col gap-6 shadow-float">
        <div className="flex flex-col items-center text-center gap-2">
          <div className="w-12 h-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center text-2xl shadow-sm">
            🦥
          </div>
          <div>
            <Badge variant="primary" className="mb-1">
              Đăng Ký Tài Khoản Phụ Huynh
            </Badge>
            <h1 className="text-2xl font-black text-foreground">LƯỜI ENGLISH</h1>
            <p className="text-xs font-semibold text-muted-foreground mt-1">
              Tạo tài khoản người giám hộ để quản lý hồ sơ bé
            </p>
          </div>
        </div>

        {(localError || error) && (
          <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{localError || error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-bold text-foreground mb-1 block">
              Tên Phụ Huynh / Người Giám Hộ
            </label>
            <div className="relative flex items-center">
              <User className="w-5 h-5 text-muted-foreground absolute left-3.5" />
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Ví dụ: Bố Tuấn, Mẹ Linh"
                className="w-full pl-11 pr-4 py-3 rounded-2xl border-2 border-border bg-white text-sm font-semibold focus:outline-none focus:border-primary"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-foreground mb-1 block">
              Email Phụ Huynh
            </label>
            <div className="relative flex items-center">
              <Mail className="w-5 h-5 text-muted-foreground absolute left-3.5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@domain.com"
                className="w-full pl-11 pr-4 py-3 rounded-2xl border-2 border-border bg-white text-sm font-semibold focus:outline-none focus:border-primary"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-foreground mb-1 block">
              Mật Khẩu (Tối thiểu 6 ký tự)
            </label>
            <div className="relative flex items-center">
              <Lock className="w-5 h-5 text-muted-foreground absolute left-3.5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3 rounded-2xl border-2 border-border bg-white text-sm font-semibold focus:outline-none focus:border-primary"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-foreground mb-1 block">
              Xác Nhận Mật Khẩu
            </label>
            <div className="relative flex items-center">
              <Lock className="w-5 h-5 text-muted-foreground absolute left-3.5" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3 rounded-2xl border-2 border-border bg-white text-sm font-semibold focus:outline-none focus:border-primary"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={isLoading}
            className="w-full gap-2 mt-2"
          >
            <span>{isLoading ? "Đang tạo tài khoản..." : "Hoàn Tất Đăng Ký"}</span>
            <ArrowRight className="w-5 h-5" />
          </Button>
        </form>

        <div className="text-center text-xs text-muted-foreground font-semibold pt-2 border-t border-border/60">
          <p>
            Đã có tài khoản?{" "}
            <Link href="/auth/login" className="font-bold text-primary hover:underline">
              Đăng nhập tại đây
            </Link>
          </p>
          <p className="flex items-center justify-center gap-1 text-[11px] text-muted-foreground/80 mt-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Tài khoản trẻ em chỉ được tạo từ bên trong Cổng Phụ Huynh</span>
          </p>
        </div>
      </Card>
    </div>
  );
}
