"use client";
import { BankDetails } from "./BankDetails";
import { ConversionEvent } from "@/components/Analytics";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart";
import { supabase } from "@/lib/supabase";
import { useCartNote, setCartNote } from "@/lib/cart-note";
import { vnd } from "@/lib/data";

export default function Checkout() {
  const note = useCartNote();
  const { lines, ready, subtotal, clear } = useCart();
  const router = useRouter();
  const [fee, setFee] = useState(0);
  const [freeFrom, setFreeFrom] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    supabase
      .from("shop_settings")
      .select("key,value")
      .in("key", ["shipping_fee", "free_ship_threshold"])
      .then(({ data }) => {
        for (const r of data ?? []) {
          if (r.key === "shipping_fee") setFee(Number(r.value) || 0);
          if (r.key === "free_ship_threshold") setFreeFrom(r.value == null ? null : Number(r.value));
        }
      });
  }, []);

  if (!ready) return <div className="mx-auto max-w-6xl px-4 py-16 text-center text-black/50">Đang tải…</div>;
  if (lines.length === 0)
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold text-brand-dark">Thanh toán đơn hàng</h1><p className="text-black/60">Giỏ hàng trống.</p>
        <Link href="/san-pham" className="mt-4 inline-block rounded bg-brand px-6 py-2.5 font-medium text-white">Xem sản phẩm</Link>
      </div>
    );

  const ship = freeFrom != null && subtotal >= freeFrom ? 0 : fee;

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    if (f.get("website")) return; // honeypot chống bot
    setErr("");
    setBusy(true);
    const { data, error } = await supabase.rpc("create_order", {
      p_customer: {
        name: f.get("name"),
        phone: f.get("phone"),
        email: f.get("email"),
        province: f.get("province"),
        district: f.get("district"),
        ward: f.get("ward"),
        address: f.get("address"),
        note: f.get("note"),
        payment_method: f.get("payment_method"),
      },
      p_items: lines.map((l) => ({ item_id: l.item_id, model_id: l.model_id, qty: l.qty })),
    });
    setBusy(false);
    if (error) {
      setErr(error.message || "Không đặt được hàng, vui lòng thử lại.");
      return;
    }
    clear();
    setCartNote("");
    const phone = String(f.get("phone") ?? "");
    router.push(`/dat-hang-thanh-cong?code=${encodeURIComponent(data.code)}&phone=${encodeURIComponent(phone)}`);
  }

  const input = "form-input";
  return (
    <div className="fb-container checkout-page"><ConversionEvent name="begin_checkout" params={{ currency: "VND", value: subtotal, items: lines.map(l => ({ item_id: String(l.item_id), item_name: l.name, quantity: l.qty, price: l.price })) }}/>
      <div className="page-heading"><h1>Thanh toán đơn hàng</h1><p>Điền thông tin nhận hàng và chọn cách thanh toán.</p></div>
      <form onSubmit={submit} className="grid gap-8 md:grid-cols-[1fr_340px]">
        <div className="checkout-fields space-y-4"><h2>Thông tin nhận hàng</h2>
          <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm">Họ và tên *<input name="name" required minLength={2} maxLength={100} autoComplete="name" className={input} /></label>
            <label className="block text-sm">Số điện thoại *<input name="phone" type="tel" required inputMode="tel" pattern="(0|\+84)[0-9\s.\-]{9,12}" title="Ví dụ 0912345678" autoComplete="tel" className={input} /></label>
          </div>
          <label className="block text-sm">Email (không bắt buộc)<input name="email" type="email" autoComplete="email" className={input} /></label>
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="block text-sm">Tỉnh / Thành phố<input name="province" autoComplete="address-level1" className={input} /></label>
            <label className="block text-sm">Quận / Huyện<input name="district" autoComplete="address-level2" className={input} /></label>
            <label className="block text-sm">Phường / Xã<input name="ward" autoComplete="address-level3" className={input} /></label>
          </div>
          <label className="block text-sm">Địa chỉ nhận hàng *<input name="address" required minLength={8} maxLength={300} placeholder="Số nhà, tên đường" autoComplete="street-address" className={input} /></label>
          <label className="block text-sm">Ghi chú<textarea name="note" value={note} onChange={e => setCartNote(e.target.value)} rows={3} maxLength={500} className={input} /></label>
          <fieldset className="rounded border border-black/10 p-4">
            <legend className="px-1 text-sm font-semibold uppercase text-brand">Thanh toán</legend>
            <label className="flex items-start gap-2 py-1"><input type="radio" name="payment_method" value="cod" checked={paymentMethod === "cod"} onChange={() => setPaymentMethod("cod")} className="mt-1" /><span><b>Thanh toán khi nhận hàng (COD)</b><br /><span className="text-sm text-black/60">Thanh toán cho người giao hàng khi nhận đơn.</span></span></label>
            <label className="flex items-start gap-2 py-1"><input type="radio" name="payment_method" value="bank_transfer" checked={paymentMethod === "bank_transfer"} onChange={() => setPaymentMethod("bank_transfer")} className="mt-1" /><span><b>Chuyển khoản ngân hàng</b><br /><span className="text-sm text-black/60">Xem tài khoản bên dưới. Dùng mã đơn hàng làm nội dung chuyển khoản.</span></span></label>
            {paymentMethod === "bank_transfer" && <BankDetails />}
          </fieldset>
        </div>
        <aside className="checkout-summary h-fit">
          <h2 className="mb-3 font-semibold uppercase text-brand">Đơn hàng</h2>
          <ul className="space-y-2 text-sm">
            {lines.map((l) => (
              <li key={l.key} className="flex justify-between gap-3">
                <span className="line-clamp-2">{l.name}{l.variant_name ? ` (${l.variant_name})` : ""} × {l.qty}</span>
                <span className="shrink-0">{vnd(l.price * l.qty)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 space-y-1 border-t border-black/10 pt-3 text-sm">
            <div className="flex justify-between"><span>Tạm tính</span><span>{vnd(subtotal)}</span></div>
            <div className="flex justify-between gap-3"><span className="shrink-0">Phí vận chuyển</span><span className="text-right">{ship === 0 ? "tính theo biểu phí SPX ở bước thanh toán" : vnd(ship)}</span></div>
            <div className="flex justify-between pt-1 text-base font-semibold"><span>Tổng</span><span className="text-price">{vnd(subtotal + ship)}</span></div>
          </div>
          <p className="mt-2 text-xs text-black/50">Vui lòng kiểm tra phân loại, số lượng và địa chỉ trước khi đặt hàng.</p>
          {err && <p role="alert" className="mt-3 text-sm text-price">{err}</p>}
          <button disabled={busy} className="fb-button mt-4 w-full">{busy ? "Đang gửi…" : "ĐẶT HÀNG"}</button>
          <Link href="/gio-hang" className="mt-3 block text-center text-sm text-brand-dark underline">Quay lại giỏ hàng</Link>
        </aside>
      </form>
    </div>
  );
}
