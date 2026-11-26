import { createMetadata, websiteJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import Link from "next/link";
import { getCatalogCategories, listProducts } from "@/lib/data";
import { Container } from "@/components/ui/Container";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Hero, CollectionBanners, ProductCarousel } from "@/components/HomeShowcase";
import { RecentlyViewed } from "@/components/recommend/RecentlyViewed";

export function generateMetadata() { return createMetadata({ title: "Balo, túi xách và vali đồng hành mỗi ngày", description: "Khám phá balo, túi xách và vali tại Freshbag. Chọn mẫu cho đi học, đi làm hay du lịch, đặt hàng COD và nhận hỗ trợ bảo hành 6 tháng lỗi nhà sản xuất.", path: "/" }); }
export const revalidate = 300;
export default async function Home() {
  const [categories, latest, bags] = await Promise.all([getCatalogCategories(), listProducts({ sort: "newest" }), listProducts({ cat: 100016 })]);
  const products = bags.items.length ? bags.items : latest.items;
  const heroProducts = [products.find(p => /balo|ba lô/i.test(p.name)) ?? products[0], products.find(p => /túi/i.test(p.name)) ?? products[1], latest.items[2]].filter(Boolean);
  const titles = ["Balo, túi xách sẵn sàng cho mỗi ngày mới", "Gọn nhẹ theo cách của bạn", "Cùng bạn đi muôn nơi"];
  const descriptions = ["Balo và túi xách cho những ngày đi học, đi làm và khám phá.", "Tìm chiếc túi vừa ý, mang theo những điều cần thiết.", "Chọn người bạn đồng hành cho hành trình tiếp theo."];
  const featuredCats = [100095, 100089, 100094, 100096].flatMap(id => categories.filter(c => c.id === id && c.count > 0));
  const categoryProducts = await Promise.all(featuredCats.map(c => listProducts({ cat: c.id })));
  const commitments: [IconName, string, string][] = [["shield", "Sản phẩm chính hãng", "An tâm lựa chọn"], ["shield", "Bảo hành 6 tháng", "Lỗi từ nhà sản xuất"], ["return", "Hỗ trợ đổi trả", "Đổi hoặc hoàn tiền"], ["truck", "Giao hàng toàn quốc", "Đồng hành mọi nơi"], ["wallet", "Thanh toán COD", "Khi nhận hàng"]];
  return <>
    <JsonLd data={websiteJsonLd()}/>
    <Hero slides={heroProducts.map((p, i) => ({ title: titles[i], text: descriptions[i], label: "KHÁM PHÁ NGAY", href: i === 0 ? "/san-pham" : `/san-pham/${p.item_id}`, image: i === 0 ? "/banners/hero-desktop.webp" : p.images[0], mobileImage: i === 0 ? "/banners/hero-mobile.webp" : undefined, productName: i === 0 ? "Người mẫu cùng balo Freshbag tông kem cho hành trình mỗi ngày" : p.name }))}/>
    <Container><p className="home-answer">Freshbag mang đến balo, túi xách, cặp, ví và vali cho việc đi học, đi làm và du lịch. Bạn có thể xem ảnh, giá và phân loại từng mẫu, chọn thanh toán khi nhận hàng và tìm hiểu bảo hành 6 tháng đối với lỗi nhà sản xuất.</p><CollectionBanners items={[
      { title: "Hàng mới", caption: "THÊM LỰA CHỌN MỖI NGÀY", href: "/san-pham?sort=newest", image: "/banners/promo-hang-moi.webp", banner: true },
      { title: "Bán chạy", caption: "KHÁM PHÁ SẢN PHẨM", href: "/san-pham?view=bestsellers", image: "/banners/promo-ban-chay.webp", banner: true },
      { title: "Khuyến mãi", caption: "TÌM MẪU ĐANG GIẢM GIÁ", href: "/san-pham?view=sale", image: "/banners/promo-khuyen-mai.webp", banner: true },
    ]}/>
    <section className="home-products"><div className="section-heading"><span className="eyebrow">MANG THEO ĐIỀU BẠN YÊU</span><h2>Chiếc túi cho mỗi hành trình</h2><p>Chọn mẫu phù hợp với nhịp sống của bạn.</p></div><ProductCarousel products={products.slice(0, 20)}/><div className="section-more"><Link href="/san-pham" className="text-link">XEM TẤT CẢ SẢN PHẨM <Icon name="chevron" width="16"/></Link></div></section>
    <section className="home-categories"><div className="section-heading"><span className="eyebrow">BẠN ĐANG TÌM GÌ?</span><h2>Khám phá theo danh mục</h2></div><div className="category-tiles">{featuredCats.map((c, i) => <Link href={`/san-pham?cat=${c.id}`} className="category-tile" key={c.id}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {categoryProducts[i].items[0]?.images[0] && <img src={categoryProducts[i].items[0].images[0]} alt={`Khám phá ${c.name} tại Freshbag`} width="320" height="320" loading="lazy"/>}
      <div><h3>{c.name}</h3><p>{c.count} sản phẩm</p></div><Icon name="chevron"/></Link>)}</div></section>
    <section className="store-faq"><h2>Hỏi đáp khi mua tại Freshbag</h2><details><summary>Làm sao để chọn đúng mẫu và phân loại?</summary><p>Hãy bắt đầu từ danh mục sản phẩm, chọn khoảng giá rồi mở mẫu bạn quan tâm. Đối chiếu ảnh và bảng thông số với đồ dùng cần mang theo. Chọn đúng phân loại để xem giá cụ thể; nếu cần tư vấn thêm, bạn có thể nhắn Freshbag qua Zalo trước khi đặt hàng.</p></details><details><summary>Freshbag hỗ trợ gì sau khi mua hàng?</summary><p>Freshbag bảo hành 6 tháng đối với lỗi do nhà sản xuất và hỗ trợ đổi trả theo điều kiện trong từng chính sách. Khi cần hỗ trợ, bạn nên chuẩn bị mã đơn hàng, số điện thoại đã đặt và ảnh tình trạng sản phẩm để nhân viên kiểm tra, hướng dẫn.</p></details></section>
    <RecentlyViewed limit={10}/>
    </Container><section className="commitment-strip" aria-label="Cam kết Freshbag"><Container><div className="commitments">{commitments.map(([icon, title, text]) => <div key={title}><Icon name={icon} width="30" height="30"/><h3>{title}</h3><p>{text}</p></div>)}</div></Container></section>
  </>;
}
