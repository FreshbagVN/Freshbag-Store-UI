/* eslint-disable @next/next/no-img-element -- PR_RULES 8.4. */
"use client";
import Link from "next/link";
import { useState } from "react";
import { brandFacts } from "@/content/brand-facts";
import { vnd, type Variant } from "@/lib/data";
import { useProductPurchase, type PurchaseProps } from "./AddToCart";
import { ProductGallery, type ProductMedia } from "./ProductGallery";
import { BottomSheet } from "./ui/BottomSheet";
import { Icon } from "./ui/Icon";
import { MiniCart } from "./MiniCart";

type Props = PurchaseProps & {
  media: ProductMedia[]; variantImages: Record<number, string>; originalPrice: number | null;
  sold: number | null; shipping: { fee: number; freeFrom: number | null };
};

export function ProductDetail(props: Props) {
  const purchase = useProductPurchase(props);
  const { variant, price, stock, qty, setQty, soldOut, count } = purchase;
  const [active, setActive] = useState(0);
  const [sheet, setSheet] = useState<"add" | "buy" | "variants" | "commitments" | null>(null);
  const [nameExpanded, setNameExpanded] = useState(false);
  const [shareMessage, setShareMessage] = useState("");
  const selectedImage = (variant && props.variantImages[variant.model_id]) || props.image;
  const displayPrice = variant ? vnd(price) : props.maxPrice != null && props.basePrice !== props.maxPrice ? `${vnd(props.basePrice)} – ${vnd(props.maxPrice)}` : vnd(props.basePrice);
  const original = variant ? variant.original_price : props.originalPrice;
  const currentPrice = variant ? price : props.basePrice;
  const discount = original != null && currentPrice != null && original > currentPrice ? Math.round((1 - currentPrice / original) * 100) : 0;
  const select = (v: Variant) => {
    purchase.select(v.model_id);
    const image = props.variantImages[v.model_id];
    const index = props.media.findIndex(m => m.type === "image" && m.src === image);
    if (index >= 0) setActive(index);
  };
  function action(buy: boolean) {
    if (props.variants.length && !variant) { setSheet(buy ? "buy" : "add"); return; }
    purchase.submit(buy, selectedImage);
  }
  async function share() {
    try {
      if (navigator.share) { await navigator.share({ title: props.name, url: window.location.href }); return; }
      await navigator.clipboard.writeText(window.location.href);
      setShareMessage("Đã chép liên kết sản phẩm");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      try { await navigator.clipboard.writeText(window.location.href); setShareMessage("Đã chép liên kết sản phẩm"); }
      catch { setShareMessage(`Liên kết sản phẩm: ${window.location.href}`); }
    }
  }
  const variantOptions = <div className="pdp-variant-options">{props.variants.map(v => <button key={v.model_id} type="button" disabled={v.stock === 0} aria-pressed={variant?.model_id === v.model_id} onClick={() => select(v)}>{props.variantImages[v.model_id] && <img src={props.variantImages[v.model_id]} alt={`Phân loại ${v.name || v.sku || v.model_id}`} width="40" height="40" loading="lazy"/>}<span>{v.name || v.sku || "Tiêu chuẩn"}</span>{v.stock === 0 && <small>Hết hàng</small>}</button>)}</div>;
  const quantity = <div className="pdp-quantity-row"><span>Số lượng</span><div className="quantity-control"><button type="button" aria-label="Giảm số lượng" disabled={qty <= 1} onClick={() => setQty(q => Math.max(1, q - 1))}>−</button><input aria-label="Số lượng" inputMode="numeric" value={qty} onChange={e => setQty(Math.max(1, Math.min(99, Number(e.target.value.replace(/\D/g, "")) || 1)))}/><button type="button" aria-label="Tăng số lượng" disabled={qty >= Math.min(99, stock ?? 99)} onClick={() => setQty(q => Math.min(99, q + 1))}>+</button></div><span className="muted">{stock != null ? `Còn ${stock} sản phẩm` : variant || !props.variants.length ? "Liên hệ xác nhận tồn kho" : "Chọn phân loại để xem tồn kho"}</span></div>;
  const priceBlock = <div className="pdp-price" aria-live="polite"><strong>{displayPrice}</strong>{discount > 0 && <span className="pdp-discount-row">{!variant && props.basePrice !== props.maxPrice && <small>Giá gốc từ</small>}<del>{vnd(original)}</del><span className="discount-label">−{discount}%</span></span>}</div>;
  const fee = props.shipping.freeFrom != null && currentPrice != null && currentPrice * qty >= props.shipping.freeFrom ? 0 : props.shipping.fee;
  return <>
    <section className="pdp-overview" aria-label="Thông tin và mua sản phẩm">
      <div className="pdp-media-column">
        <div className="pdp-mobile-tools"><Link href="/san-pham" className="icon-button" aria-label="Quay lại sản phẩm">←</Link><div><button type="button" className="icon-button" aria-label="Chia sẻ sản phẩm" onClick={share}><svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><circle cx="6" cy="12" r="3"/><circle cx="18" cy="5" r="3"/><circle cx="18" cy="19" r="3"/><path d="m9 10 6-4M9 14l6 4"/></svg></button><Link href="/gio-hang" className="icon-button pdp-cart-icon" aria-label={`Giỏ hàng, ${count} sản phẩm`}><Icon name="bag"/>{count > 0 && <span>{count > 99 ? "99+" : count}</span>}</Link></div></div>
        <ProductGallery media={props.media} name={props.name} active={active} onChange={setActive}/>
      </div>
      {props.variants.length > 0 && <div className="pdp-mobile-variants"><div className="pdp-variant-caption"><span>{props.variants.length} phân loại có sẵn</span><strong aria-live="polite">{variant?.name || "Chọn phân loại"}</strong><button type="button" className="icon-button" aria-label="Mở phân loại sản phẩm" onClick={() => setSheet("variants")}><Icon name="chevron" width="16"/></button></div><div className="pdp-variant-strip">{props.variants.map(v => <button key={v.model_id} type="button" disabled={v.stock === 0} aria-label={`Chọn phân loại ${v.name || v.sku || v.model_id}`} aria-pressed={variant?.model_id === v.model_id} onClick={() => select(v)}>{props.variantImages[v.model_id] ? <img src={props.variantImages[v.model_id]} alt={`Phân loại ${v.name}`} width="54" height="54" loading="lazy"/> : <span>{v.name || "Tiêu chuẩn"}</span>}</button>)}</div></div>}
      <div className="pdp-buy-column">
        <div className="pdp-title"><h1 className={nameExpanded ? "" : "pdp-name-clamped"}>{props.name}</h1>{props.name.length > 85 && <button type="button" className="pdp-name-more" aria-expanded={nameExpanded} onClick={() => setNameExpanded(!nameExpanded)}>{nameExpanded ? "Thu gọn tên" : "Xem thêm tên sản phẩm"}</button>}{props.sold != null && <p className="pdp-sold">Đã bán {props.sold.toLocaleString("vi-VN")}</p>}</div>
        {priceBlock}
        <div className="pdp-shipping"><Icon name="truck"/><div><p>Giao hàng toàn quốc · Thanh toán khi nhận hàng (COD)</p><p className="muted">Phí vận chuyển: {fee ? vnd(fee) : "tính theo biểu phí SPX ở bước thanh toán"}{props.shipping.freeFrom != null && <> · Miễn phí từ {vnd(props.shipping.freeFrom)}</>}</p><Link href="/chinh-sach-van-chuyen">Xem chính sách giao hàng</Link></div></div>
        <div className="pdp-desktop-purchase">{props.variants.length > 0 && <div className="pdp-variant-group"><h2>Phân loại</h2>{variantOptions}</div>}{quantity}<div className="pdp-actions"><button type="button" className="fb-button pdp-add" disabled={soldOut} onClick={() => action(false)}><Icon name="bag"/>Thêm vào giỏ hàng</button><button type="button" className="fb-button" disabled={soldOut} onClick={() => action(true)}>Mua ngay</button></div></div>
        <button type="button" className="pdp-commitments" onClick={() => setSheet("commitments")}><Icon name="shield"/><span>Đổi trả {brandFacts.returnDays} ngày · Bảo hành {brandFacts.warrantyMonths} tháng · Hàng chính hãng</span><Icon name="chevron" width="16"/></button>
        {soldOut && <p className="pdp-notice" role="status">Sản phẩm tạm hết hàng.</p>}
        {purchase.err && <p role="alert" className="pdp-error">{purchase.err}</p>}
      </div>
    </section>
    {shareMessage && <p className="pdp-share-status" role="status">{shareMessage}</p>}
    <div className="pdp-bottom-buy" aria-label="Thanh mua sản phẩm"><a href={brandFacts.zaloUrl} target="_blank" rel="noreferrer" aria-label="Chat Zalo Freshbag"><svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M21 11a9 9 0 0 1-9 9H4l-2 2V11a9 9 0 1 1 19 0Z"/><path d="M6 10h11M6 14h7"/></svg><span>Zalo chat</span></a><button type="button" aria-label="Thêm vào giỏ hàng" disabled={soldOut} onClick={() => action(false)}><Icon name="bag"/><span>Thêm vào giỏ</span></button><button type="button" className="pdp-buy-now" disabled={soldOut} onClick={() => action(true)}><span>Mua ngay</span><strong>{displayPrice}</strong></button></div>
    <BottomSheet open={sheet !== null && sheet !== "commitments"} onClose={() => setSheet(null)} title="Chọn phân loại & số lượng"><div className="pdp-sheet-product">{selectedImage && <img src={selectedImage} alt={variant?.name || props.name} width="100" height="100"/>}<div>{priceBlock}<p>{variant?.name || "Vui lòng chọn phân loại"}</p><p className="muted">{stock != null ? `Còn ${stock} sản phẩm` : "Chọn phân loại để xem tồn kho"}</p></div></div>{variantOptions}{quantity}{purchase.err && <p role="alert" className="pdp-error">{purchase.err}</p>}<button type="button" className="fb-button pdp-sheet-confirm" disabled={soldOut} onClick={() => { if (sheet === "variants") { if (variant) setSheet(null); return; } if (purchase.submit(sheet === "buy", selectedImage)) setSheet(null); }}>{sheet === "buy" ? "Mua ngay" : sheet === "add" ? "Thêm vào giỏ hàng" : "Xác nhận phân loại"}</button></BottomSheet>
    <BottomSheet open={sheet === "commitments"} onClose={() => setSheet(null)} title="Cam kết Freshbag"><div className="pdp-policy-list"><h3>Đổi trả {brandFacts.returnDays} ngày</h3><p>{brandFacts.returnsSummary}</p><Link href="/chinh-sach-doi-tra">Xem chính sách đổi trả</Link><h3>Bảo hành {brandFacts.warrantyMonths} tháng</h3><p>{brandFacts.warrantySummary}</p><Link href="/chinh-sach-bao-hanh">Xem chính sách bảo hành</Link><h3>Hàng chính hãng</h3><p>Sản phẩm rõ nguồn gốc, đúng mô tả. Liên hệ Freshbag qua Zalo hoặc hotline {brandFacts.hotlineDisplay} để được hỗ trợ.</p></div></BottomSheet>
    <MiniCart open={purchase.added} onClose={() => purchase.setAdded(false)}/>
  </>;
}
