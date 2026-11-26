import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Metadata phải nằm trong HTML ban đầu, cả khi dùng trình duyệt thông thường.
  htmlLimitedBots: /.*/,
  async headers() {
    const production =
      process.env.NEXT_PUBLIC_SITE_ENV === "production" &&
      process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true" &&
      process.env.NEXT_PUBLIC_SITE_URL === "https://freshbag.com.vn";
    return production
      ? []
      : [{ source: "/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] }];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
