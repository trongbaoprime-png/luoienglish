import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 64, 96, 128, 256, 384],
    minimumCacheTTL: 86400,
    dangerouslyAllowSVG: false,
  },
  // Nén output để giảm JS bundle size
  compress: true,
  // Dọn dẹp console.log trong production
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  // Tối ưu import size cho các thư viện lớn (giảm bundle JS)
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  // HTTP Cache headers cho các API routes không thay đổi thường xuyên
  async headers() {
    return [
      {
        source: "/api/settings",
        headers: [
          { key: "Cache-Control", value: "public, max-age=60, s-maxage=300, stale-while-revalidate=600" },
        ],
      },
      {
        source: "/api/geo",
        headers: [
          { key: "Cache-Control", value: "public, max-age=3600, s-maxage=86400, stale-while-revalidate=3600" },
        ],
      },
      // Static assets cache dài
      {
        source: "/uploads/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/_next/static/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default nextConfig;
