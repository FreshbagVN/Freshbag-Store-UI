import type { MetadataRoute } from "next";
import { IS_PRODUCTION, absoluteUrl } from "@/lib/seo";
export default function robots(): MetadataRoute.Robots {
  if (!IS_PRODUCTION) return { rules: [{ userAgent: "*", disallow: "/" }] };
  const disallow = ["/gio-hang", "/thanh-toan", "/dat-hang-thanh-cong", "/tra-cuu-don", "/api/", "/*?q=", "/*&q="];
  return { rules: [{ userAgent: ["*", "Googlebot", "Bingbot", "Applebot", "OAI-SearchBot", "ChatGPT-User", "PerplexityBot", "Perplexity-User", "Claude-SearchBot", "Claude-User", "ClaudeBot", "GPTBot", "Google-Extended", "DuckAssistBot"], allow: "/", disallow }], sitemap: absoluteUrl("/sitemap.xml") };
}
