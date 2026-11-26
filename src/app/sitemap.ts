import type { MetadataRoute } from "next";
import { IS_PRODUCTION, absoluteUrl } from "@/lib/seo";
import { supabase } from "@/lib/supabase";
import { getCatalogCategories } from "@/lib/data";
export const revalidate = 3600;
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!IS_PRODUCTION) return [];
  const urls: MetadataRoute.Sitemap = ["/", "/san-pham", "/gioi-thieu", "/lien-he", "/ban-hang-doanh-nghiep", "/chinh-sach-bao-hanh", "/chinh-sach-doi-tra", "/chinh-sach-van-chuyen", "/chinh-sach-thanh-toan", "/chinh-sach-bao-mat"].map(path => ({ url: absoluteUrl(path) }));
  for (const cat of await getCatalogCategories()) if (cat.count > 0) urls.push({ url: absoluteUrl(`/san-pham?cat=${cat.id}`) });
  for (let offset = 0; ; offset += 1000) {
    const { data, error } = await supabase.from("products").select("item_id,shopee_updated_at").eq("status", "NORMAL").order("item_id").range(offset, offset + 999);
    if (error) throw error;
    for (const p of data ?? []) urls.push({ url: absoluteUrl(`/san-pham/${p.item_id}`), ...(p.shopee_updated_at && Number.isFinite(Date.parse(p.shopee_updated_at)) ? { lastModified: new Date(p.shopee_updated_at).toISOString() } : {}) });
    if ((data?.length ?? 0) < 1000) break;
  }
  return urls;
}
