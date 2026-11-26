"use client";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { trackEvent } from "@/lib/analytics";
import { useCart } from "@/lib/cart";
import type { Variant } from "@/lib/data";

export type PurchaseProps = {
  itemId: number; name: string; image: string | null; variants: Variant[];
  basePrice: number | null; baseStock: number | null; maxPrice: number | null;
};

/** Same cart payload and price/stock checks; buy-now adds then opens checkout. */
export function useProductPurchase({ itemId, name, image, variants, basePrice, baseStock }: PurchaseProps) {
  const { add, count } = useCart();
  const router = useRouter();
  const [sel, setSel] = useState<number | null>(variants.length === 1 ? variants[0].model_id : null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [err, setErr] = useState("");
  const variant = useMemo(() => variants.find(x => x.model_id === sel) ?? null, [variants, sel]);
  const price = variants.length ? (variant?.price ?? null) : basePrice;
  const stock = variants.length ? (variant?.stock ?? null) : baseStock;
  const soldOut = variants.length ? variants.every(x => x.stock === 0) : baseStock === 0;
  function select(id: number) { setSel(id); setQty(1); setErr(""); }
  function submit(buyNow = false, selectedImage = image) {
    setErr("");
    if (variants.length && !variant) { setErr("Vui lòng chọn phân loại"); return false; }
    if (price == null) { setErr("Sản phẩm chưa có giá, vui lòng liên hệ shop"); return false; }
    if (stock === 0) { setErr("Phân loại này đã hết hàng"); return false; }
    if (stock != null && qty > stock) { setErr(`Chỉ còn ${stock} sản phẩm`); return false; }
    add({ item_id: itemId, model_id: variant?.model_id ?? null, name, variant_name: variant?.name ?? null, image: selectedImage, price, qty });
    trackEvent("add_to_cart", { currency: "VND", value: price * qty, items: [{ item_id: String(itemId), item_name: name, item_variant: variant?.name, price, quantity: qty }] });
    if (buyNow) router.push("/thanh-toan"); else setAdded(true);
    return true;
  }
  return { variant, qty, setQty, select, price, stock, soldOut, err, added, setAdded, submit, count };
}
