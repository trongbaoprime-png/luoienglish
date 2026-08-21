"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useAuth } from "@/lib/auth/authContext";
import { Mail, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const { resetPassword, isLoading, error, clearError } = useAuth();
  const [email, setEmail] = useState("");
  const [isSent, setIsSent] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    if (!email) {
      setLocalError("Vui lòng nhập địa chỉ email tài khoản.");
      return;
    }

    try {
      await resetPassword(email);
      setIsSent(true);
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
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center text-2xl shadow-sm">
            🔑
          </div>
          <div>
            <Badge variant="primary" className="mb-1">
              Khôi Phục Mật Khẩu
            </Badge>
            <h1 className="text-2xl font-black text-foreground">LƯỜI ENGLISH</h1>
            <p className="text-xs font-semibold text-muted-foreground mt-1">
              Nhận liên kết đặt lại mật khẩu gửi về email của bạn
            </p>
          </div>
        </div>

        {isSent ? (
          <div className="flex flex-col items-center text-center gap-4 py-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-black text-base text-foreground">Đã Gửi Email Khôi Phục</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Vui lòng kiểm tra hộp thư đến của <strong>{email}</strong> và làm theo hướng dẫn.
              </p>
            </div>
            <Link href="/auth/login" className="w-full">
              <Button variant="primary" size="md" className="w-full">
                Quay Lại Đăng Nhập
              </Button>
            </Link>
          </div>
        ) : (
          <>
            {(localError || error) && (
              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{localError || error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-bold text-foreground mb-1 block">
                  Email Phụ Huynh Đã Đăng Ký
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

              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={isLoading}
                className="w-full mt-2"
              >
                {isLoading ? "Đang gửi yêu cầu..." : "Gửi Email Đặt Lại Mật Khẩu"}
              </Button>
            </form>

            <div className="text-center pt-2 border-t border-border/60">
              <Link
                href="/auth/login"
                className="text-xs font-bold text-muted-foreground hover:text-primary inline-flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Quay về trang Đăng nhập</span>
              </Link>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
