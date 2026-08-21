import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/lib/theme/themeContext";
import { AuthProvider } from "@/lib/auth/authContext";

export const metadata: Metadata = {
  title: "LƯỜI ENGLISH — Lười học mà vẫn giỏi!",
  description:
    "Nền tảng học tiếng Anh giao tiếp và củng cố kiến thức trường học cho trẻ em Việt Nam cùng Chú Lười thông thái.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className="antialiased min-h-screen">
        <AuthProvider>
          <ThemeProvider initialTheme="cozy">
            {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
