import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  async rewrites() {
    return [
      {
        source: "/api/Auth/login",
        destination: `${process.env.NEXT_PUBLIC_API_URL}/Auth/login`,
      },
      {
        source: "/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*`,
        has: [
          {
            type: "header",
            key: "x-next-auth",
            value: undefined,
          },
        ],
      },
    ];
  },
  env: {
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
};

export default nextConfig;