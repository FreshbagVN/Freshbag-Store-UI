import { Analytics } from "@/components/Analytics";
import type { Metadata } from "next";
import { createMetadata, SITE_URL, organizationJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import { getCatalogCategories } from "@/lib/data";
import { CartProvider } from "@/lib/cart";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

const beVietnam = Be_Vietnam_Pro({ variable: "--font-be-vietnam", subsets: ["vietnamese", "latin"], weight: ["400", "500", "600", "700", "800"], display: "swap" });
export const metadata: Metadata = { ...createMetadata({ title: "Balo, túi xách và vali đồng hành mỗi ngày", description: "Khám phá balo, túi xách và vali tại Freshbag. Chọn phân loại, xem thông số thật, đặt hàng COD và được hỗ trợ bảo hành 6 tháng lỗi nhà sản xuất.", path: "/" }), metadataBase: new URL(SITE_URL) };
export const revalidate = 300;
export default async function RootLayout({ children }: LayoutProps<"/">) {
  const categories = await getCatalogCategories();
  return <html lang="vi" className={beVietnam.variable}><head><link rel="preconnect" href="https://cf.shopee.vn" crossOrigin="anonymous"/><link rel="dns-prefetch" href="https://cf.shopee.vn"/></head><body><Analytics/><JsonLd data={organizationJsonLd()}/><CartProvider>
    <a className="skip-link" href="#noi-dung">Bỏ qua điều hướng</a>
    <SiteHeader categories={categories}/><main id="noi-dung" className="site-main">{children}</main><SiteFooter/>
  </CartProvider></body></html>;
}
