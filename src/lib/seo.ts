import type { Metadata } from "next";
import { brandFacts } from "@/content/brand-facts";

function configuredSiteUrl() {
  try {
    const url = new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://freshbag.cocashop001.workers.dev");
    if (url.protocol !== "https:") throw new Error("HTTPS required");
    return url.origin;
  } catch { return "https://freshbag.cocashop001.workers.dev"; }
}
export const SITE_URL = configuredSiteUrl();
// Mở index cần cả hai cờ và domain chính thức; mặc định luôn là TEST.
export const IS_PRODUCTION = process.env.NEXT_PUBLIC_SITE_ENV === "production" && process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true" && SITE_URL === "https://freshbag.com.vn";
export const absoluteUrl = (path = "/") => new URL(path, SITE_URL).toString();
export const siteUrl = SITE_URL;
export const organizationId = absoluteUrl("/#organization");
export function plainText(value: string) { return value.replace(/<[^>]*>/g, " ").replace(/["“”]/g, "").replace(/\s+/g, " ").trim(); }
export function seoTitle(value: string) {
  const raw = plainText(value).replace(/\s*\| Freshbag$/i, "");
  const text = raw.length < 19 ? `${raw} – Mua sắm trực tuyến` : raw;
  return (text.length > 49 ? text.slice(0, 46).trimEnd() + "…" : text) + " | Freshbag";
}
export function seoDescription(value: string) {
  const clean = plainText(value);
  if (clean.length > 160) return clean.slice(0, 157).trimEnd() + "…";
  return clean;
}
export type MetadataInput = { title: string; description: string; path: string; image?: string; noindex?: boolean };
export function createMetadata({ title, description, path, image, noindex = false }: MetadataInput): Metadata {
  const fullTitle = seoTitle(title);
  const desc = seoDescription(description);
  const url = absoluteUrl(path);
  const images = [{ url: absoluteUrl(image || "/logo.png"), alt: brandFacts.brandName + " – Balo, túi xách và vali" }];
  return { title: { absolute: fullTitle }, description: desc, alternates: { canonical: url },
    robots: { index: IS_PRODUCTION && !noindex, follow: IS_PRODUCTION },
    openGraph: { title: fullTitle, description: desc, url, siteName: brandFacts.brandName, locale: "vi_VN", type: "website", images },
    twitter: { card: "summary_large_image", title: fullTitle, description: desc, images } };
}
export const buildMetadata = createMetadata;
export type BreadcrumbItem = { name: string; href: string };
export function breadcrumbJsonLd(items: readonly BreadcrumbItem[]) {
  return { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: items.map((item, i) => ({ "@type": "ListItem", position: i + 1, name: item.name, item: absoluteUrl(item.href) })) };
}
export const buildBreadcrumbJsonLd = breadcrumbJsonLd;
export function openingHoursSpecification() {
  return { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map(day => `https://schema.org/${day}`), opens: brandFacts.opens, closes: brandFacts.closes };
}
export function organizationJsonLd() {
  return { "@context": "https://schema.org", "@type": ["Organization", "OnlineStore"], "@id": organizationId,
    name: brandFacts.brandName, legalName: brandFacts.companyName, slogan: brandFacts.slogan, url: absoluteUrl(), logo: absoluteUrl("/logo.png"),
    telephone: brandFacts.hotline, email: brandFacts.email, openingHoursSpecification: openingHoursSpecification(),
    address: { "@type": "PostalAddress", streetAddress: brandFacts.address, addressLocality: "TP. Hồ Chí Minh", addressCountry: "VN" },
    contactPoint: [{ "@type": "ContactPoint", telephone: brandFacts.hotline, email: brandFacts.email, contactType: "customer service", areaServed: "VN", availableLanguage: "vi" },
      { "@type": "ContactPoint", url: brandFacts.b2bZaloUrl, contactType: "business sales", areaServed: "VN", availableLanguage: "vi" }],
    ...(brandFacts.socialLinks ? { sameAs: brandFacts.socialLinks } : {}) };
}
export function websiteJsonLd() {
  return { "@context": "https://schema.org", "@type": "WebSite", "@id": absoluteUrl("/#website"), name: brandFacts.brandName, url: absoluteUrl(), inLanguage: "vi", publisher: { "@id": organizationId }, potentialAction: { "@type": "SearchAction", target: { "@type": "EntryPoint", urlTemplate: absoluteUrl("/san-pham") + "?q={search_term_string}" }, "query-input": "required name=search_term_string" } };
}
