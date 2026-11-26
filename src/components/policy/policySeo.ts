import type { Metadata } from "next";
import { brandFacts } from "@/content/brand-facts";
import { POLICIES, type PolicySlug } from "@/content/policies";
import { absoluteUrl, breadcrumbJsonLd, createMetadata, organizationId, openingHoursSpecification } from "@/lib/seo";

export function buildPolicyMetadata(slug: PolicySlug): Metadata {
  const doc = POLICIES[slug];
  return createMetadata({
    title: doc.metaTitle,
    description: doc.metaDescription,
    path: doc.canonicalPath,
  });
}

export function buildPolicyJsonLdList(slug: PolicySlug): Record<string, unknown>[] {
  const doc = POLICIES[slug];
  const url = absoluteUrl(doc.canonicalPath);

  const breadcrumb = breadcrumbJsonLd([
    { name: "Trang chủ", href: "/" },
    { name: doc.breadcrumbLabel, href: doc.canonicalPath },
  ]);

  if (slug === "gioi-thieu") {
    return [
      breadcrumb,
      {
        "@context": "https://schema.org",
        "@type": "AboutPage",
        name: doc.h1,
        url,
        description: doc.metaDescription,
        dateModified: doc.updatedAtIso,
        mainEntity: { "@id": organizationId },
      },
    ];
  }

  if (slug === "lien-he") {
    return [
      breadcrumb,
      {
        "@context": "https://schema.org",
        "@type": "ContactPage",
        name: doc.h1,
        url,
        description: doc.metaDescription,
        dateModified: doc.updatedAtIso,
        mainEntity: {
          "@type": "Store",
          "@id": absoluteUrl("/#store-phu-lam"),
          name: `${brandFacts.brandName} – ${brandFacts.companyName}`,
          url: absoluteUrl("/"),
          telephone: `+84${brandFacts.hotline.replace(/^0/, "")}`,
          email: brandFacts.email,
          openingHoursSpecification: openingHoursSpecification(),
          address: {
            "@type": "PostalAddress",
            streetAddress: "367 Nguyễn Văn Luông, Phường Phú Lâm",
            addressLocality: "TP. Hồ Chí Minh",
            addressRegion: "TP. Hồ Chí Minh",
            addressCountry: "VN",
          },
          contactPoint: [
            {
              "@type": "ContactPoint",
              telephone: `+84${brandFacts.hotline.replace(/^0/, "")}`,
              email: brandFacts.email,
              contactType: "customer service",
              areaServed: "VN",
              availableLanguage: "vi",
            },
            {
              "@type": "ContactPoint",
              telephone: `+84${brandFacts.b2bPhone.replace(/^0/, "")}`,
              email: brandFacts.email,
              contactType: "sales",
              areaServed: "VN",
              availableLanguage: "vi",
            },
          ],
        },
      },
    ];
  }

  if (slug === "chinh-sach-doi-tra") {
    return [
      breadcrumb,
      {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: doc.h1,
        url,
        description: doc.metaDescription,
        dateModified: doc.updatedAtIso,
        publisher: { "@id": organizationId },
        mainEntity: {
          "@type": "MerchantReturnPolicy",
          applicableCountry: "VN",
          returnPolicyCountry: "VN",
          returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
          merchantReturnDays: brandFacts.returnDays,
          returnMethod: "https://schema.org/ReturnByMail",
          refundType: "https://schema.org/FullRefund",
          itemDefectReturnFees: "https://schema.org/FreeReturn",
          customerRemorseReturnFees: "https://schema.org/ReturnShippingFees",
          merchantReturnLink: url,
        },
      },
    ];
  }

  return [
    breadcrumb,
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: doc.h1,
      url,
      description: doc.metaDescription,
      dateModified: doc.updatedAtIso,
      publisher: { "@id": organizationId },
    },
  ];
}
