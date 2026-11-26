/* eslint-disable @next/next/no-img-element -- Ảnh Shopee dùng img theo PR_RULES 8.4. */
"use client";
import Link from "next/link";
import { brandFacts } from "@/content/brand-facts";
import { IS_PRODUCTION } from "@/lib/seo";
import { useRef, useState } from "react";
import type { MenuCategory } from "@/lib/catalog";
import { navigationCategories } from "@/lib/catalog";
import CartLink from "./CartLink";
import { Container } from "./ui/Container";
import { Icon } from "./ui/Icon";
import { Drawer } from "./ui/Drawer";

const links = [["HÀNG MỚI", "/san-pham?sort=newest"], ["BÁN CHẠY", "/san-pham?view=bestsellers"], ["KHUYẾN MÃI", "/san-pham?view=sale"], ["TRA CỨU ĐƠN", "/tra-cuu-don"], ["DOANH NGHIỆP", "/ban-hang-doanh-nghiep"], ["LIÊN HỆ", "/lien-he"]];
function SearchForm({ mobile = false }: { mobile?: boolean }) {
  return <form action="/san-pham" role="search" className="search-form"><label className="sr-only" htmlFor={mobile ? "mobile-search" : "desktop-search"}>Tìm sản phẩm</label><input id={mobile ? "mobile-search" : "desktop-search"} name="q" placeholder="Tìm balo, túi xách…" maxLength={120}/><button type="submit" className="icon-button" aria-label="Tìm sản phẩm"><Icon name="search"/></button></form>;
}
export function SiteHeader({ categories }: { categories: MenuCategory[] }) {
  const [drawer, setDrawer] = useState<"menu" | "search" | null>(null);
  const [menu, setMenu] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  // Keep the reference's simple one-column dropdown, with actual nonempty categories.
  const main = navigationCategories(categories);
  const categoryLinks = <><Link href="/san-pham" onClick={() => { setMenu(false); setDrawer(null); }}>Tất cả sản phẩm</Link>{main.map((c) => <Link href={`/san-pham?cat=${c.id}`} key={c.id} onClick={() => { setMenu(false); setDrawer(null); }}>{c.name}</Link>)}<Link href="/san-pham?view=other" onClick={() => { setMenu(false); setDrawer(null); }}>Khác</Link></>;
  return <>
    <div className="topbar"><Container><a className="top-hotline" href={`tel:${brandFacts.hotline}`}>Hotline: <strong>{brandFacts.hotlineDisplay}</strong></a><p>Giao hàng toàn quốc · Thanh toán khi nhận hàng (COD)</p><div className="top-search"><SearchForm/></div></Container></div>
    <header className="site-header"><Container className="header-inner"><Link href="/" className="logo-link" aria-label="Freshbag – Trang chủ"><img src="/logo.png" alt="Logo thương hiệu Freshbag" width="110" height="62"/></Link>
      <nav className="desktop-nav" aria-label="Điều hướng chính"><Link href={links[0][1]}>{links[0][0]}</Link><div className="nav-dropdown" onMouseEnter={() => setMenu(true)} onMouseLeave={() => setMenu(false)} onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setMenu(false); }} onKeyDown={(e) => { if (e.key === "Escape") { setMenu(false); menuButton.current?.focus(); } }}><button ref={menuButton} type="button" aria-expanded={menu} aria-controls="product-dropdown" onClick={() => setMenu(!menu)}>SẢN PHẨM <Icon name="down" width="14" height="14"/></button><div id="product-dropdown" hidden={!menu} className="dropdown-links">{categoryLinks}</div></div>{links.slice(1).map(([label, href]) => <Link href={href} key={label}>{label}</Link>)}</nav>
      <div className="header-actions"><button type="button" className="icon-button mobile-only" aria-label="Mở tìm kiếm" onClick={() => setDrawer("search")}><Icon name="search"/></button><CartLink/><button type="button" className="icon-button mobile-only" aria-label="Mở menu" onClick={() => setDrawer("menu")}><Icon name="menu"/></button></div>
    </Container></header>{!IS_PRODUCTION && <div className="test-notice">Bản thử nghiệm · Đơn hàng chưa được xử lý thật</div>}
    <Drawer title={drawer === "search" ? "Tìm sản phẩm" : "Menu Freshbag"} open={drawer !== null} onClose={() => setDrawer(null)}>{drawer === "search" ? <SearchForm mobile/> : <nav className="mobile-nav" aria-label="Điều hướng mobile"><Link href={links[0][1]} onClick={() => setDrawer(null)}>HÀNG MỚI</Link><details open><summary>SẢN PHẨM</summary><div>{categoryLinks}</div></details>{links.slice(1).map(([label, href]) => <Link href={href} key={label} onClick={() => setDrawer(null)}>{label}</Link>)}<a href={`tel:${brandFacts.hotline}`}>Hotline: {brandFacts.hotlineDisplay}</a></nav>}</Drawer>
  </>;
}

