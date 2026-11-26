import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { RecentlyViewed } from "@/components/recommend/RecentlyViewed";
export default function NotFound() {
  return <Container><section className="empty-state"><span className="eyebrow">404 · FRESHBAG</span><h1>Không tìm thấy trang</h1><p>Trang bạn tìm có thể đã thay đổi. Hãy tìm sản phẩm hoặc quay lại trang chủ.</p><form action="/san-pham" className="search-form"><label className="sr-only" htmlFor="not-found-search">Tìm sản phẩm</label><input id="not-found-search" type="search" name="q" placeholder="Tìm balo, túi xách…"/><button className="fb-button">Tìm kiếm</button></form><div className="action-row"><Link className="fb-button" href="/">VỀ TRANG CHỦ</Link><Link className="fb-button secondary" href="/san-pham">XEM SẢN PHẨM</Link></div></section><RecentlyViewed limit={10}/></Container>;
}
