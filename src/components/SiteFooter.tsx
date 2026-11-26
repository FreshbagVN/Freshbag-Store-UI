"use client";
import Link from "next/link";
import { brandFacts } from "@/content/brand-facts";
import { useSyncExternalStore, type ReactNode } from "react";
import { Container } from "./ui/Container";
import { Icon } from "./ui/Icon";
const subscribe = (callback: () => void) => { const m = window.matchMedia("(min-width: 1024px)"); m.addEventListener("change", callback); return () => m.removeEventListener("change", callback); };
function FooterColumn({ title, children, first, desktop }: { title: string; children: ReactNode; first?: boolean; desktop: boolean }) {
  return <details className="footer-column" open={desktop || first}><summary>{title}<Icon name="down" width="16" height="16"/></summary><div>{children}</div></details>;
}
export function SiteFooter() {
  const desktop = useSyncExternalStore(subscribe, () => window.matchMedia("(min-width: 1024px)").matches, () => true);
  return <><footer className="site-footer" id="lien-he"><Container><div className="footer-grid">
    <FooterColumn title="Giới thiệu" first desktop={desktop}><p>Freshbag mang đến balo, túi xách và hành lý đồng hành cùng bạn mỗi ngày.</p><p className="footer-slogan">{brandFacts.slogan}</p><a className="footer-phone" href={`tel:${brandFacts.hotline}`}><Icon name="phone"/>{brandFacts.hotlineDisplay}</a></FooterColumn>
    <FooterColumn title="Về Freshbag" desktop={desktop}><Link href="/gioi-thieu">Giới thiệu Freshbag</Link><Link href="/lien-he">Liên hệ</Link><Link href="/ban-hang-doanh-nghiep">Quà tặng doanh nghiệp</Link><Link href="/san-pham">Khám phá sản phẩm</Link><Link href="/san-pham?sort=newest">Hàng mới</Link><Link href="/san-pham?view=sale">Khuyến mãi</Link><a href={brandFacts.zaloUrl} target="_blank" rel="noreferrer">Tư vấn chọn sản phẩm</a></FooterColumn>
    <FooterColumn title="Hỗ trợ khách hàng" desktop={desktop}><Link href="/tra-cuu-don">Tra cứu đơn hàng</Link><Link href="/chinh-sach-bao-hanh">Chính sách bảo hành</Link><Link href="/chinh-sach-doi-tra">Chính sách đổi trả</Link><Link href="/chinh-sach-van-chuyen">Vận chuyển & giao nhận</Link><Link href="/chinh-sach-thanh-toan">Chính sách thanh toán</Link><Link href="/chinh-sach-bao-mat">Chính sách bảo mật</Link></FooterColumn>
    <FooterColumn title="Liên hệ" desktop={desktop}><p>{brandFacts.companyName}</p><p>{brandFacts.address}</p><p>Giờ mở cửa: {brandFacts.workingHours}</p><a href={`mailto:${brandFacts.email}`}>{brandFacts.email}</a><a href={brandFacts.zaloUrl} target="_blank" rel="noreferrer">Tư vấn qua Zalo ↗</a></FooterColumn>
    </div><div className="copyright">© {new Date().getFullYear()} Freshbag. Bản quyền thuộc Freshbag.</div></Container></footer><aside className="floating-contact" aria-label="Liên hệ nhanh"><a href={brandFacts.zaloUrl} target="_blank" rel="noreferrer" aria-label="Nhắn tin Freshbag qua Zalo">Zalo</a><a href={`tel:${brandFacts.hotline}`} aria-label="Gọi hotline 093 268 2008"><Icon name="phone"/></a></aside></>;
}
