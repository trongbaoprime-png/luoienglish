"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useAuth } from "@/lib/auth/authContext";
import { ShieldCheck, Mail, Lock, ArrowRight, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { loginWithEmail, loginWithGoogle, isLoading, error, clearError } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    if (!email || !password) {
      setLocalError("Vui lòng nhập đầy đủ email và mật khẩu.");
      return;
    }

    try {
      await loginWithEmail(email, password);
      router.push("/parent");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setLocalError(err.message);
      }
    }
  };

  const handleGoogleSignIn = async () => {
    setLocalError(null);
    clearError();
    try {
      await loginWithGoogle();
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
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center gap-2">
          <div className="w-12 h-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center text-2xl shadow-sm">
            🦥
          </div>
          <div>
            <Badge variant="primary" className="mb-1">
              Cổng Đăng Nhập Phụ Huynh
            </Badge>
            <h1 className="text-2xl font-black text-foreground">LƯỜI ENGLISH</h1>
            <p className="text-xs font-semibold text-muted-foreground mt-1">
              Đồng hành cùng con học tiếng Anh chuẩn và an toàn
            </p>
          </div>
        </div>

        {/* Error Notification */}
        {(localError || error) && (
          <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{localError || error}</span>
          </div>
        )}

        {/* Email/Password Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-foreground block">
                Mật Khẩu
              </label>
              <Link
                href="/auth/forgot-password"
                className="text-xs font-bold text-primary hover:underline"
              >
                Quên mật khẩu?
              </Link>
            </div>
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

          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={isLoading}
            className="w-full gap-2 mt-2"
          >
            <span>{isLoading ? "Đang xử lý..." : "Đăng Nhập"}</span>
            <ArrowRight className="w-5 h-5" />
          </Button>
        </form>

        <div className="relative flex items-center justify-center my-1">
          <div className="border-t border-border w-full" />
          <span className="bg-white px-3 text-xs font-bold text-muted-foreground uppercase">
            Hoặc
          </span>
        </div>

        {/* Google Sign-in Button */}
        <Button
          onClick={handleGoogleSignIn}
          variant="outline"
          size="lg"
          disabled={isLoading}
          className="w-full gap-2 font-bold"
        >
          <span>🔵</span>
          <span>Đăng nhập nhanh với Google</span>
        </Button>

        {/* Footer Navigation */}
        <div className="text-center text-xs text-muted-foreground font-semibold flex flex-col gap-2 pt-2 border-t border-border/60">
          <p>
            Chưa có tài khoản phụ huynh?{" "}
            <Link href="/auth/register" className="font-bold text-primary hover:underline">
              Đăng ký ngay
            </Link>
          </p>
          <p className="flex items-center justify-center gap-1 text-[11px] text-muted-foreground/80">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Bảo vệ quyền riêng tư theo tiêu chuẩn COPPA / GDPR-K</span>
          </p>
        </div>
      </Card>
    </div>
  );
}
