"use client";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { Icon } from "./ui/Icon";
export default function CartLink() {
  const { count, ready } = useCart();
  return <Link href="/gio-hang" className="icon-button cart-link" aria-label={`Giỏ hàng, ${ready ? count : 0} sản phẩm`}><Icon name="bag"/><span className="cart-count">{ready ? count : 0}</span></Link>;
}
