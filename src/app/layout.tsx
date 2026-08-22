import type { Metadata } from "next";
import { Baloo_2, Nunito } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/lib/theme/themeContext";
import { AuthProvider } from "@/lib/auth/authContext";

const baloo = Baloo_2({
  subsets: ["latin", "vietnamese"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-baloo",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-nunito",
  display: "swap",
});

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
    <html lang="vi" className={`${baloo.variable} ${nunito.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased min-h-screen bg-[#FFFDF7] text-[#2D2A26] selection:bg-[#FFD166]/40">
        <AuthProvider>
          <ThemeProvider initialTheme="cozy">
            {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
