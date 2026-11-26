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
  const [categories, latest, bags] = await Promise.all([
    getCatalogCategories(),
    listProducts({ sort: "newest", limit: 27 }),
    listProducts({ cat: 100016, limit: 27 }),
  ]);
  const products = bags.items.length >= 9 ? bags.items : latest.items;
  const catCount = (id: number) => categories.find((c) => c.id === id)?.count ?? 0;
  const heroSlides = [
    {
      title: "Balo, túi xách sẵn sàng cho mỗi ngày mới",
      text: "Balo và túi xách cho những ngày đi học, đi làm và khám phá.",
      label: "Khám phá ngay",
      href: "/san-pham",
      image: "/banners/hero-desktop.webp",
      mobileImage: "/banners/hero-mobile.webp",
      productName: "Người mẫu cùng balo Freshbag tông kem cho hành trình mỗi ngày",
    },
    {
      title: "Gọn nhẹ theo cách của bạn",
      text: "Tìm chiếc balo vừa ý, mang theo trọn vẹn những điều cần thiết.",
      label: "Xem hàng mới",
      href: "/san-pham?sort=newest",
      image: "/banners/hero-2-desktop.webp",
      mobileImage: "/banners/hero-2-mobile.webp",
      productName: "Bộ sưu tập balo Freshbag mới về với thiết kế nhẹ nhàng tinh tế",
    },
    {
      title: "Cùng bạn đi muôn nơi",
      text: "Chọn người bạn đồng hành bền đẹp cho hành trình tiếp theo.",
      label: "Xem bán chạy",
      href: "/san-pham?view=bestsellers",
      image: "/banners/hero-3-desktop.webp",
      mobileImage: "/banners/hero-3-mobile.webp",
      productName: "Mẫu balo Freshbag bán chạy đồng hành cùng bạn mỗi ngày",
    },
  ];
  const wideCategories = [
    { title: "Túi đeo chéo", href: "/san-pham?cat=100095", image: "/banners/cat-tui-deo-cheo.webp", count: catCount(100095) },
    { title: "Balo", href: "/san-pham?cat=100089", image: "/banners/cat-balo.webp", count: catCount(100089) },
  ];
  const squareCategories = [
    { title: "Túi xách", href: "/san-pham?cat=100094", image: "/banners/cat-tui-xach.webp", count: catCount(100094) },
    { title: "Vali", href: "/san-pham?cat=100085", image: "/banners/cat-vali.webp", count: catCount(100085) },
    { title: "Cặp Da Công Sở", href: "/san-pham?cat=100565", image: "/banners/cat-cap-cong-so.webp", count: catCount(100565) },
    { title: "Túi Du Lịch", href: "/san-pham?cat=100086", image: "/banners/cat-tui-du-lich.webp", count: catCount(100086) },
  ];
  const commitments: [IconName, string, string][] = [["shield", "Sản phẩm chính hãng", "An tâm lựa chọn"], ["shield", "Bảo hành 6 tháng", "Lỗi từ nhà sản xuất"], ["return", "Hỗ trợ đổi trả", "Đổi hoặc hoàn tiền"], ["truck", "Giao hàng toàn quốc", "Đồng hành mọi nơi"], ["wallet", "Thanh toán COD", "Khi nhận hàng"]];
  return <>
    <JsonLd data={websiteJsonLd()}/>
    <Hero slides={heroSlides}/>
    <Container><p className="home-answer">Freshbag mang đến balo, túi xách, cặp, ví và vali cho việc đi học, đi làm và du lịch. Bạn có thể xem ảnh, giá và phân loại từng mẫu, chọn thanh toán khi nhận hàng và tìm hiểu bảo hành 6 tháng đối với lỗi nhà sản xuất.</p><CollectionBanners items={[
      { title: "Hàng mới", caption: "THÊM LỰA CHỌN MỖI NGÀY", href: "/san-pham?sort=newest", image: "/banners/promo-hang-moi.webp", banner: true },
      { title: "Bán chạy", caption: "KHÁM PHÁ SẢN PHẨM", href: "/san-pham?view=bestsellers", image: "/banners/promo-ban-chay.webp", banner: true },
      { title: "Khuyến mãi", caption: "TÌM MẪU ĐANG GIẢM GIÁ", href: "/san-pham?view=sale", image: "/banners/promo-khuyen-mai.webp", banner: true },
    ]}/>
    <section className="home-products"><div className="section-heading"><span className="eyebrow">MANG THEO ĐIỀU BẠN YÊU</span><h2>Chiếc túi cho mỗi hành trình</h2><p>Chọn mẫu phù hợp với nhịp sống của bạn.</p></div><ProductCarousel products={products.slice(0, 27)}/><div className="section-more"><Link href="/san-pham" className="text-link">Xem tất cả sản phẩm <Icon name="chevron" width="16"/></Link></div></section>
    <section className="home-categories">
      <div className="section-heading"><span className="eyebrow">BẠN ĐANG TÌM GÌ?</span><h2>Khám phá theo danh mục</h2><p>Chọn nhanh dòng sản phẩm phù hợp với nhu cầu mỗi ngày.</p></div>
      <div className="yuumy-cat-top">
        <div className="yuumy-cat-stack">
          {wideCategories.map((c) => (
            <Link href={c.href} className="yuumy-cat-banner" key={c.title}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={c.image} alt={`Danh mục ${c.title} Freshbag`} width="1200" height="600" loading="lazy"/>
              <div className="yuumy-cat-banner-copy">
                <span className="eyebrow">DANH MỤC</span>
                <h3>{c.title}</h3>
                {c.count > 0 && <p>{c.count} sản phẩm</p>}
                <span className="yuumy-cat-cta">Khám phá ngay <Icon name="chevron" width="14"/></span>
              </div>
            </Link>
          ))}
        </div>
        <Link href="/san-pham?sort=newest" className="yuumy-cat-spotlight">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/banners/hero-mobile.webp" alt="Bộ sưu tập Freshbag nổi bật" width="1080" height="1350" loading="lazy"/>
          <span className="yuumy-spotlight-badge">FRESHBAG LOOKBOOK</span>
          <div className="yuumy-spotlight-copy">
            <h3>Gọn nhẹ &amp; tinh tế mỗi ngày</h3>
            <p>Khám phá các mẫu balo, túi xách và hành lý mới nhất</p>
            <span className="yuumy-spotlight-cta">Xem bộ sưu tập <Icon name="chevron" width="14"/></span>
          </div>
        </Link>
      </div>
      <div className="yuumy-cat-grid">
        {squareCategories.map((c) => (
          <Link href={c.href} className="yuumy-cat-card" key={c.title}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={c.image} alt={`Danh mục ${c.title} Freshbag`} width="800" height="800" loading="lazy"/>
            <div className="yuumy-cat-label">
              <h3>{c.title}</h3>
              <p>{c.count > 0 ? `${c.count} sản phẩm` : "Xem bộ sưu tập"}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
    <section className="store-faq"><h2>Hỏi đáp khi mua tại Freshbag</h2><details><summary>Làm sao để chọn đúng mẫu và phân loại?</summary><p>Hãy bắt đầu từ danh mục sản phẩm, chọn khoảng giá rồi mở mẫu bạn quan tâm. Đối chiếu ảnh và bảng thông số với đồ dùng cần mang theo. Chọn đúng phân loại để xem giá cụ thể; nếu cần tư vấn thêm, bạn có thể nhắn Freshbag qua Zalo trước khi đặt hàng.</p></details><details><summary>Freshbag hỗ trợ gì sau khi mua hàng?</summary><p>Freshbag bảo hành 6 tháng đối với lỗi do nhà sản xuất và hỗ trợ đổi trả theo điều kiện trong từng chính sách. Khi cần hỗ trợ, bạn nên chuẩn bị mã đơn hàng, số điện thoại đã đặt và ảnh tình trạng sản phẩm để nhân viên kiểm tra, hướng dẫn.</p></details></section>
    <RecentlyViewed limit={10}/>
    </Container><section className="commitment-strip" aria-label="Cam kết Freshbag"><Container><div className="commitments">{commitments.map(([icon, title, text]) => <div key={title}><Icon name={icon} width="30" height="30"/><h3>{title}</h3><p>{text}</p></div>)}</div></Container></section>
  </>;
}
