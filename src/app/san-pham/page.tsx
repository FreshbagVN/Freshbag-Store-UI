import { createMetadata, absoluteUrl, breadcrumbJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { redirect } from "next/navigation";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { getCatalogCategories, listProducts } from "@/lib/data";
import { mainCategories, priceOptions, sortOptions } from "@/lib/catalog";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { CatalogToolbar } from "@/components/CatalogToolbar";
import { RecentlyViewed } from "@/components/recommend/RecentlyViewed";
import { SimilarProducts } from "@/components/recommend/SimilarProducts";

export async function generateMetadata({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const raw = await searchParams;
  const cats = await getCatalogCategories();
  const cat = cats.find(c => String(c.id) === raw.cat && c.count > 0);
  const view = ["sale", "bestsellers", "other"].includes(String(raw.view)) ? String(raw.view) : "";
  const params = new URLSearchParams();
  if(cat) params.set("cat",String(cat.id)); else if(view) params.set("view",view);
  const page = Number(raw.page);
  if(Number.isSafeInteger(page) && page > 1 && page <= 10000) params.set("page",String(page));
  const title = cat ? `${cat.name} – Chọn mẫu phù hợp mỗi ngày` : view === "sale" ? "Khuyến mãi balo, túi xách và vali" : view === "bestsellers" ? "Khám phá sản phẩm được quan tâm" : "Sản phẩm balo, túi xách và vali";
  const description = cat ? `Khám phá danh mục ${cat.name.toLowerCase()} tại Freshbag, xem giá và phân loại từng mẫu. Lựa chọn theo nhu cầu, giao hàng toàn quốc và hỗ trợ thanh toán COD.` : "Tìm balo, túi xách, ví và vali tại Freshbag theo danh mục, khoảng giá và phân loại. Xem thông số từng mẫu, đặt hàng COD và nhận tư vấn khi cần.";
  return createMetadata({ title, description, path: "/san-pham" + (params.size ? `?${params}` : ""), noindex: !!(raw.q || raw.price || raw.sort) });
}
export default async function Products({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const raw = await searchParams;
  const value = (key: string) => typeof raw[key] === "string" ? raw[key] as string : "";
  const categories = await getCatalogCategories();
  const cat = categories.find(c => String(c.id) === value("cat"));
  const price = priceOptions.find(p => p.value === value("price"));
  const sort = sortOptions.find(([key]) => key === value("sort"))?.[0] ?? "featured";
  const q = value("q").trim().slice(0, 120);
  const view = ["sale", "bestsellers", "other"].includes(value("view")) ? value("view") : "";
  const parsedPage = Number(value("page"));
  const page = Number.isSafeInteger(parsedPage) && parsedPage > 0 ? Math.min(parsedPage, 10000) : 1;
  const params: Record<string, string> = { sort };
  if (cat) params.cat = String(cat.id);
  if (price) params.price = price.value;
  if (q) params.q = q;
  if (view) params.view = view;
  const opts = { cat: cat?.id, q, page, sort, min: price?.min, max: price?.max, sale: view === "sale" };
  const res = await listProducts(opts);
  if (res.page > res.pages) { const u = new URLSearchParams(params); u.set("page",String(res.pages)); redirect(`/san-pham?${u}`); }
  const fallbackProductId = res.items.length === 0 ? (await listProducts({ sort: "newest" })).items[0]?.item_id ?? 18734671622 : null;
  const title = cat?.name ?? (view === "sale" ? "Khuyến mãi" : view === "bestsellers" ? "Bán chạy" : view === "other" ? "Khám phá thêm" : "Tất cả sản phẩm");
  const qs = (p: number) => { const u = new URLSearchParams(params); u.set("page", String(p)); return `/san-pham?${u}`; };
  const pages = [...new Set([1, ...Array.from({length: 5}, (_, i) => res.page - 2 + i), res.pages])].filter(p => p > 0 && p <= res.pages).sort((a,b) => a-b);
  const otherRoots = categories.filter(c => c.parent_id === null && c.count && !mainCategories(categories).some(m => m.id === c.id));
  return <><JsonLd data={breadcrumbJsonLd([{ name: "Trang chủ", href: "/" }, { name: title, href: `/san-pham${cat ? `?cat=${cat.id}` : view ? `?view=${view}` : ""}` }])}/><JsonLd data={{ "@context": "https://schema.org", "@type": "CollectionPage", name: title, url: absoluteUrl(`/san-pham${cat ? `?cat=${cat.id}` : view ? `?view=${view}` : ""}`), mainEntity: { "@type": "ItemList", itemListElement: res.items.map((p,i) => ({ "@type": "ListItem", position: (res.page-1)*24+i+1, name: p.name, url: absoluteUrl(`/san-pham/${p.item_id}`) })) } }}/><Breadcrumb label={title}/><Container><section className="catalog-banner"><span className="eyebrow">FRESHBAG · ĐỒNG HÀNH MỖI NGÀY</span><h1>{title}</h1><p>Balo, túi xách và những lựa chọn cho hành trình của bạn.</p><span className="catalog-banner-decoration" aria-hidden="true"/></section>
    {view === "bestsellers" && <p className="catalog-notice">Freshbag đang cập nhật dữ liệu bán chạy. Bạn có thể khám phá toàn bộ sản phẩm bên dưới.</p>}
    {view === "other" && <div className="other-categories" aria-label="Danh mục khác">{otherRoots.map(c => <Link key={c.id} href={`/san-pham?cat=${c.id}`}>{c.name} ({c.count})</Link>)}</div>}
    <CatalogToolbar categories={categories} params={params} title={title} total={res.total}/>
    {q && <p className="search-result">Kết quả cho “{q}”</p>}
    {(cat || price) && <div className="active-filters"><span>Đang lọc: {[cat?.name, price?.label].filter(Boolean).join(" · ")}</span><Link href="/san-pham">Xóa bộ lọc ×</Link></div>}
    {res.items.length ? <div className="catalog-grid">{res.items.map(p => <ProductCard key={p.item_id} p={p}/>)}</div> : <><div className="catalog-empty"><h2>Chưa có sản phẩm phù hợp</h2><p>Thử chọn khoảng giá hoặc danh mục khác.</p><Link href="/san-pham" className="fb-button">Xem tất cả sản phẩm</Link></div><RecentlyViewed limit={10}/>{fallbackProductId != null && <SimilarProducts productId={fallbackProductId} limit={6} title="Gợi ý nổi bật"/>}</>}
    {res.pages > 1 && <nav className="pagination" aria-label="Phân trang sản phẩm">{res.page > 1 && <Link href={qs(res.page - 1)} aria-label="Trang trước">‹</Link>}{pages.map((p,i) => <span key={p}>{i > 0 && p - pages[i-1] > 1 && <span className="page-ellipsis">…</span>}<Link href={qs(p)} aria-current={p === res.page ? "page" : undefined} aria-label={`Trang ${p}`}>{p}</Link></span>)}{res.page < res.pages && <Link href={qs(res.page + 1)} aria-label="Trang sau">›</Link>}</nav>}
    <section className="catalog-description"><h2>Tìm chiếc túi phù hợp cùng Freshbag</h2><p>Freshbag có balo, túi xách, cặp, ví và vali để bạn lựa chọn theo nhu cầu đi học, đi làm hoặc du lịch. Dùng bộ lọc danh mục và giá, xem ảnh cùng thông số từng mẫu, rồi chọn đúng phân loại trước khi thêm vào giỏ hàng.</p>
    <h3>Chọn theo những đồ bạn cần mang</h3><p>Hãy bắt đầu từ những vật dụng bạn sử dụng mỗi ngày: điện thoại, ví, sách vở, máy tính hay quần áo cho chuyến đi. Một chiếc túi phù hợp cần có không gian vừa với đồ dùng thực tế. Với laptop, bạn nên đo chiều ngang, chiều cao và độ dày của máy, sau đó đối chiếu thông tin ngăn chứa trong mô tả. Kích thước đóng gói phục vụ vận chuyển có thể khác kích thước sử dụng, vì vậy đừng dùng số đo đóng gói để quyết định máy tính có vừa túi hay không.</p>
    <h3>Xem phân loại, chất liệu và cách sử dụng</h3><p>Mỗi mẫu có thể có nhiều màu hoặc kích cỡ với mức giá khác nhau. Khi mở trang chi tiết, chọn một phân loại để xem giá và số lượng còn lại của lựa chọn đó. Ảnh sản phẩm giúp bạn quan sát hình dáng và cách bố trí các ngăn; bảng thông số cung cấp những dữ liệu hiện có như mã hàng, thương hiệu, trọng lượng và chất liệu. Nếu thông tin bạn cần chưa xuất hiện, hãy hỏi Freshbag trước khi đặt. Đặc biệt, khả năng chống nước, kích cỡ laptop và sức chứa cần được đối chiếu riêng cho từng mẫu.</p>
    <h3>So sánh giá và kiểm tra giỏ hàng</h3><p>Bạn có thể sắp xếp giá tăng hoặc giảm để tìm lựa chọn trong ngân sách. Giá gạch ngang và nhãn giảm chỉ xuất hiện khi dữ liệu có giá gốc cao hơn giá hiện tại. Giá theo khoảng cho biết có sự khác biệt giữa các phân loại; hãy kiểm tra giá của lựa chọn cụ thể. Trong giỏ hàng, xem lại tên, phân loại, số lượng và tạm tính. Bạn cũng có thể thêm lời nhắn để Freshbag nắm được yêu cầu của đơn.</p>
    <h3>Đặt hàng và tìm hỗ trợ sau mua</h3><p>Ở bước thanh toán, điền họ tên, số điện thoại và địa chỉ nhận hàng đầy đủ để shop có thể liên hệ xác nhận. Sau khi đặt thành công, lưu mã đơn cùng số điện thoại để <Link href="/tra-cuu-don">tra cứu đơn hàng</Link>. Freshbag hỗ trợ <Link href="/chinh-sach-bao-hanh">bảo hành 6 tháng đối với lỗi nhà sản xuất</Link>; điều kiện đổi trả được trình bày tại <Link href="/chinh-sach-doi-tra">chính sách đổi trả</Link>. Với nhu cầu quà tặng hoặc đặt số lượng lớn, xem trang <Link href="/ban-hang-doanh-nghiep">khách hàng doanh nghiệp</Link> để chọn đầu mối tư vấn phù hợp.</p>
    <h3>Cần kiểm tra gì trước khi chọn một phân loại?</h3><p>Bạn nên kiểm tra tên phân loại, ảnh, giá và tồn kho đang hiển thị, sau đó đối chiếu kích thước cùng chất liệu trong mô tả. Nếu chưa rõ về màu hoặc độ vừa của đồ dùng, nhắn Freshbag qua Zalo để được tư vấn trước khi thêm sản phẩm vào giỏ.</p></section>
  </Container></>;
}
