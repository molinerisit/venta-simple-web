import type { NextConfig } from "next";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",          // unsafe-inline requerido por Next.js RSC
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https:",
  "font-src 'self' data:",
  "connect-src 'self' https://api.ventasimple.cloud https://mrlgrhqlvtpopqfvqoxa.supabase.co",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${BACKEND_URL}/api/:path*`,
      },
    ];
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy",            value: CSP },
          { key: "X-Frame-Options",                    value: "DENY" },
          { key: "X-Content-Type-Options",             value: "nosniff" },
          { key: "Referrer-Policy",                    value: "strict-origin-when-cross-origin" },
          { key: "Strict-Transport-Security",          value: "max-age=31536000; includeSubDomains; preload" },
          { key: "Permissions-Policy",                 value: "camera=(), microphone=(), geolocation=()" },
          { key: "X-DNS-Prefetch-Control",             value: "on" },
        ],
      },
    ];
  },
};

export default nextConfig;
