/* eslint-disable @next/next/no-img-element -- PR_RULES 8.4. */
import { ConversionEvent } from "@/components/Analytics";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import { ProductDetail } from "@/components/ProductDetail";
import type { ProductMedia } from "@/components/ProductGallery";
import { ProductDescription, ProductRecommendations, ProductReviews, ProductSpecifications } from "@/components/ProductContent";
import { RecentlyViewed } from "@/components/recommend/RecentlyViewed";
import { SimilarProducts } from "@/components/recommend/SimilarProducts";
import { TrackRecentlyViewed } from "@/components/recommend/TrackRecentlyViewed";
import { supabase } from "@/lib/supabase";
import { Container } from "@/components/ui/Container";
import { JsonLd } from "@/components/JsonLd";
import { getProduct, listProducts } from "@/lib/data";
import { getSimilarProducts } from "@/lib/recommend";
import { createMetadata, absoluteUrl, organizationId, breadcrumbJsonLd, plainText } from "@/lib/seo";
import { productSpecs } from "@/lib/product-specs";
import { brandFacts } from "@/content/brand-facts";
type Props = { params: Promise<{ id: string }> };
type Block = { type: "text"; text: string } | { type: "image"; url: string };
const readProduct = cache(async (id: string) => /^[1-9]\d*$/.test(id) && Number.isSafeInteger(Number(id)) ? getProduct(Number(id)) : null);
export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const r = await readProduct(id);
  if(!r) notFound();
  const p = r.product;
  const specs = productSpecs(p).slice(0,3).map(([k,v]) => `${k}: ${v}`).join(". ");
  const description = plainText(p.description || specs || `Xem ảnh và các phân loại của ${p.name}`);
  const detail = description.length < 120 ? `${description}. Xem phân loại, giá và thông số tại Freshbag, giao hàng toàn quốc và bảo hành 6 tháng lỗi nhà sản xuất.` : description;
  return createMetadata({ title: p.name, description: detail, path: `/san-pham/${id}`, image: p.images?.[0] });
}
export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const r = await readProduct(id);
  if (!r) notFound();
  const { product: p, variants, category } = r;
  const images: string[] = p.images ?? [];
  const blocks: Block[] = p.description_blocks ?? (p.description ? [{ type: "text", text: p.description }] : []);
  const specs: [string, string][] = [...productSpecs(p), ...(category ? [["Danh mục", category.name] as [string, string]] : [])];
  const video = (p.video as { video_url: string; thumbnail_url?: string }[] | null)?.[0];
  const [related, similarItems, shopCount, settings] = await Promise.all([
    listProducts({ cat: category?.id ?? p.category_id }),
    getSimilarProducts(p.item_id, 12),
    supabase.from("products").select("item_id", { count: "exact", head: true }),
    supabase.from("shop_settings").select("key,value").in("key", ["shipping_fee", "free_ship_threshold"]),
  ]);
  const similarIds = similarItems.map((x) => x.item_id);
  const similarIdSet = new Set(similarIds);
  const shipping = { fee: 0, freeFrom: null as number | null };
  for (const setting of settings.data ?? []) {
    if (setting.key === "shipping_fee") shipping.fee = Number(setting.value) || 0;
    if (setting.key === "free_ship_threshold") shipping.freeFrom = setting.value == null ? null : Number(setting.value);
  }
  type Tier = { option_list?: { image?: { image_url?: string } }[] };
  const tiers: Tier[] = Array.isArray(p.tier_variation) ? p.tier_variation : [];
  const variantImages: Record<number, string> = {};
  for (const variant of variants) {
    for (let index = 0; index < tiers.length; index++) {
      const optionIndex = variant.tier_index?.[index];
      const image = optionIndex != null ? tiers[index].option_list?.[optionIndex]?.image?.image_url : undefined;
      if (image) { variantImages[variant.model_id] = image; break; }
    }
  }
  const galleryImages = [...new Set([...images, ...Object.values(variantImages)])];
  const media: ProductMedia[] = [...(video?.video_url ? [{ type: "video" as const, src: video.video_url, poster: video.thumbnail_url || images[0] }] : []), ...galleryImages.map(src => ({ type: "image" as const, src }))];
  const sold = typeof p.sold === "number" && Number.isFinite(p.sold) && p.sold >= 0 ? p.sold : null;
  const originalPrice = variants.find(v => v.price === p.min_price && v.original_price != null && v.price != null && v.original_price > v.price)?.original_price ?? null;
  const path = `/san-pham/${p.item_id}`;
  const crumbs = [{ name: "Trang chủ", href: "/" }, { name: "Sản phẩm", href: "/san-pham" }, ...(category ? [{ name: category.name, href: `/san-pham?cat=${category.id}` }] : []), { name: p.name, href: path }];
  // Thời hạn đổi trả đã xác nhận; phí và điều kiện chi tiết theo trang chính sách.
  const returnPolicy = { "@type": "MerchantReturnPolicy", merchantReturnDays: brandFacts.returnDays, returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow", applicableCountry: "VN", returnPolicyCountry: "VN", merchantReturnLink: absoluteUrl("/chinh-sach-doi-tra") };
  const shippingDetails = { "@type": "OfferShippingDetails", shippingDestination: { "@type": "DefinedRegion", addressCountry: "VN" }, shippingSettingsLink: absoluteUrl("/chinh-sach-van-chuyen") };
  const offer = (price: number | null, stock: number | null, sku?: string | null) => price == null ? null : { "@type": "Offer", url: absoluteUrl(path), price, priceCurrency: "VND", ...(sku ? { sku } : {}), availability: stock === 0 ? "https://schema.org/OutOfStock" : "https://schema.org/InStock", seller: { "@id": organizationId }, hasMerchantReturnPolicy: returnPolicy, shippingDetails };
  const offers = variants.length ? variants.map(v => offer(v.price,v.stock,v.sku)).filter(Boolean) : offer(p.min_price,p.total_stock,p.sku);
  const productSchema = { "@context": "https://schema.org", "@type": "Product", "@id": absoluteUrl(path) + "#product", url: absoluteUrl(path), name: p.name, image: images, description: plainText(p.description || p.name), ...(p.sku ? { sku: p.sku } : {}), ...(p.brand && p.brand !== "NoBrand" ? { brand: { "@type": "Brand", name: p.brand } } : {}), ...(offers ? { offers } : {}) };
  const groupSchema = variants.length > 1 ? { "@context": "https://schema.org", "@type": "ProductGroup", "@id": absoluteUrl(path) + "#group", productGroupID: String(p.item_id), name: p.name, url: absoluteUrl(path), hasVariant: variants.map(v => ({ "@type": "Product", name: `${p.name}${v.name ? ` – ${v.name}` : ""}`, productID: `${p.item_id}:${v.model_id}`, ...(v.sku ? { sku: v.sku } : {}), image: images, isVariantOf: { "@id": absoluteUrl(path) + "#group" }, ...(offer(v.price,v.stock,v.sku) ? { offers: offer(v.price,v.stock,v.sku) } : {}) })) } : null;
  return <div className="freshbag-pdp">
    <TrackRecentlyViewed productId={p.item_id}/>
    <ConversionEvent name="view_item" params={{ currency: "VND", value: p.min_price, items: [{ item_id: String(p.item_id), item_name: p.name }] }}/>
    <JsonLd data={breadcrumbJsonLd(crumbs)}/><JsonLd data={productSchema}/>{groupSchema && <JsonLd data={groupSchema}/>}
    <nav className="breadcrumb pdp-breadcrumb" aria-label="Đường dẫn"><Container><ol>{crumbs.map((c,i) => <li key={c.href}>{i > 0 && <span aria-hidden="true">/ </span>}{i === crumbs.length-1 ? <span aria-current="page">{c.name}</span> : <Link href={c.href}>{c.name}</Link>}</li>)}</ol></Container></nav>
    <Container className="pdp-container"><article>
      <ProductDetail key={p.item_id} itemId={p.item_id} name={p.name} image={images[0] ?? null} variants={variants} basePrice={p.min_price} maxPrice={p.max_price} baseStock={p.total_stock} media={media} variantImages={variantImages} originalPrice={originalPrice} sold={sold} shipping={shipping}/>
      <section className="pdp-shop-card" aria-label="Cửa hàng Freshbag"><img src="/logo.png" alt="Logo Freshbag" width="110" height="62"/><div><h2>Freshbag</h2>{shopCount.count != null && <p>{shopCount.count.toLocaleString("vi-VN")} sản phẩm</p>}<p className="muted">Giờ mở cửa: {brandFacts.workingHours}</p></div><Link href="/san-pham" className="fb-button secondary">Xem shop</Link></section>
      <ProductSpecifications rows={specs}/>
      <ProductDescription><div className="product-description">{blocks.length ? blocks.map((b,i) => b.type === "image" ? <img key={i} src={b.url} alt={`${p.name.slice(0,90)} – chi tiết ${i+1}`} width="800" height="800" loading="lazy" decoding="async"/> : <p key={i}>{b.text}</p>) : <p>Thông tin chi tiết đang được cập nhật. Nhắn <a href={brandFacts.zaloUrl}>Freshbag qua Zalo</a> để được tư vấn về mẫu này.</p>}</div></ProductDescription>
      <ProductReviews reviews={[]}/>
    </article>
    <SimilarProducts productId={p.item_id} limit={12} items={similarItems}/>
    <ProductRecommendations initial={related.items.filter(x => x.item_id !== p.item_id && !similarIdSet.has(x.item_id))} categoryId={category?.id ?? p.category_id} itemId={p.item_id} pages={related.pages} excludeIds={similarIds}/>
    <RecentlyViewed excludeId={p.item_id} limit={12}/>
    </Container>
  </div>;
}
