import Link from "next/link";
import type { Metadata } from "next";
import { brandFacts } from "@/content/brand-facts";
import { getCatalogCategories, listProducts, type Product } from "@/lib/data";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Container } from "@/components/ui/Container";
import { Icon, type IconName } from "@/components/ui/Icon";
import { B2BInteractiveSection } from "@/components/b2b/B2BInteractiveSection";
import {
  B2B_BENEFITS,
  B2B_CASE_STUDIES,
  B2B_CLIENT_LOGOS,
  B2B_FAQS,
  B2B_HERO_HIGHLIGHTS,
  B2B_PROCESS_STEPS,
  B2B_USE_CASES,
  type B2BCategoryCardItem,
} from "@/components/b2b/b2bData";
import { absoluteUrl, breadcrumbJsonLd, createMetadata, organizationId } from "@/lib/seo";

export const revalidate = 300;

export function generateMetadata(): Metadata {
  return createMetadata({
    title: "Bán hàng doanh nghiệp – Quà tặng in logo",
    description:
      "Dịch vụ quà tặng doanh nghiệp Freshbag: balo đồng phục, túi xách, túi đeo chéo và vali in thêu logo theo yêu cầu. Tư vấn ngân sách qua Zalo 0906 818 084.",
    path: "/ban-hang-doanh-nghiep",
  });
}

function pickProductImage(items: Product[], fallbackUrl: string): string {
  return items.find((item) => item.images?.[0])?.images[0] ?? fallbackUrl;
}

export default async function B2BPage() {
  const [categories, latest] = await Promise.all([
    getCatalogCategories(),
    listProducts({ sort: "newest" }),
  ]);

  const findCategoryId = (pattern: RegExp) =>
    categories.find((c) => c.count > 0 && pattern.test(c.name))?.id;

  const baloCatId = findCategoryId(/balo|ba\s*lô/i);
  const tuiXachCatId = findCategoryId(/túi xách|cặp/i);
  const deoCheoCatId = findCategoryId(/đeo chéo/i);
  const valiCatId = findCategoryId(/vali|du lịch|phụ kiện/i);

  const [baloRes, tuiXachRes, deoCheoRes, valiRes] = await Promise.all([
    baloCatId ? listProducts({ cat: baloCatId }) : listProducts({ q: "balo" }),
    tuiXachCatId ? listProducts({ cat: tuiXachCatId }) : listProducts({ q: "túi xách" }),
    deoCheoCatId ? listProducts({ cat: deoCheoCatId }) : listProducts({ q: "đeo chéo" }),
    valiCatId ? listProducts({ cat: valiCatId }) : listProducts({ q: "vali" }),
  ]);

  const fallbackImg = latest.items.find((p) => p.images?.[0])?.images[0] ?? "/logo.png";

  const b2bCategoryCards: B2BCategoryCardItem[] = [
    {
      chip: "Balo",
      title: "Balo đồng phục & sự kiện",
      description: "Balo laptop, balo đa năng, balo học sinh phù hợp tặng nhân viên và hội thảo.",
      image: pickProductImage(baloRes.items, fallbackImg),
      imageAlt: "Mẫu balo Freshbag dành cho quà tặng và đồng phục doanh nghiệp",
      catalogHref: baloCatId ? `/san-pham?cat=${baloCatId}` : "/san-pham?q=balo",
    },
    {
      chip: "Túi xách",
      title: "Túi xách & cặp công sở",
      description: "Túi xách tay, cặp da công sở lịch sự cho cán bộ nhân viên và đối tác.",
      image: pickProductImage(tuiXachRes.items, fallbackImg),
      imageAlt: "Mẫu túi xách công sở Freshbag gợi ý cho quà tặng doanh nghiệp",
      catalogHref: tuiXachCatId ? `/san-pham?cat=${tuiXachCatId}` : "/san-pham?q=túi",
    },
    {
      chip: "Túi đeo chéo",
      title: "Túi đeo chéo năng động",
      description: "Gọn nhẹ, dễ phối logo thương hiệu cho chiến dịch tri ân và team building.",
      image: pickProductImage(deoCheoRes.items, fallbackImg),
      imageAlt: "Mẫu túi đeo chéo Freshbag phù hợp quà tặng sự kiện doanh nghiệp",
      catalogHref: deoCheoCatId ? `/san-pham?cat=${deoCheoCatId}` : "/san-pham?q=đeo+chéo",
    },
    {
      chip: "Vali & phụ kiện",
      title: "Vali & phụ kiện du lịch",
      description: "Vali du lịch, túi trống và phụ kiện hành lý làm quà tặng khách hàng thân thiết.",
      image: pickProductImage(valiRes.items, fallbackImg),
      imageAlt: "Mẫu vali và phụ kiện du lịch Freshbag cho chương trình quà tặng B2B",
      catalogHref: valiCatId ? `/san-pham?cat=${valiCatId}` : "/san-pham?q=vali",
    },
  ];

  const benefitIcons: IconName[] = ["wallet", "shield", "filter", "phone"];

  const jsonLdList: Record<string, unknown>[] = [
    breadcrumbJsonLd([
      { name: "Trang chủ", href: "/" },
      { name: "Bán hàng doanh nghiệp", href: "/ban-hang-doanh-nghiep" },
    ]),
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Quà tặng doanh nghiệp – Balo, túi xách & vali in logo",
      url: absoluteUrl("/ban-hang-doanh-nghiep"),
      mainEntity: {
        "@type": "Service",
        name: "Dịch vụ quà tặng doanh nghiệp & đồng phục balo, túi xách, vali Freshbag",
        serviceType: "Cung cấp balo, túi xách, túi đeo chéo và vali quà tặng doanh nghiệp",
        areaServed: "VN",
        provider: { "@id": organizationId },
      },
    },
  ];

  return (
    <>
      {jsonLdList.map((schema, idx) => (
        <script
          key={idx}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <Breadcrumb label="Bán hàng doanh nghiệp" />

      {/* Khối 1: Hero & 4 điểm nhấn */}
      <section className="bg-[var(--color-surface)] py-8 md:py-12">
        <Container>
          <div className="b2b-hero">
            <picture className="b2b-hero-picture">
              <source media="(max-width: 767px)" srcSet="/banners/b2b-hero-mobile.webp" width="1080" height="1350" />
              <img src="/banners/b2b-hero-desktop.webp" alt="Balo Freshbag và hộp quà dành cho chương trình quà tặng doanh nghiệp" width="2400" height="900" loading="eager" fetchPriority="high" />
            </picture>
            <div className="b2b-hero-copy">
              <span className="eyebrow">FRESHBAG B2B · QUÀ TẶNG & ĐỒNG PHỤC</span>
              <h1>Quà tặng doanh nghiệp</h1>
              <p>Balo, túi xách và vali in thêu logo theo yêu cầu. Tư vấn mẫu theo ngân sách, duyệt thiết kế trước khi làm, bảo hành 6 tháng lỗi nhà sản xuất.</p>
              <div className="b2b-hero-actions">
                <a href="#dang-ki-b2b" className="fb-button">Nhận báo giá</a>
                <a href={brandFacts.b2bZaloUrl} target="_blank" rel="noreferrer" className="fb-button b2b-zalo">Zalo: {brandFacts.b2bPhoneDisplay}</a>
              </div>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-[var(--radius-control)] border border-[var(--color-line)] bg-[var(--color-line)] lg:grid-cols-4">
            {B2B_HERO_HIGHLIGHTS.map((item) => (
              <div key={item.title} className="bg-white p-4 md:p-5">
                <h2 className="text-sm font-bold text-[var(--color-brand)] md:text-base">{item.title}</h2>
                <p className="mt-1 text-xs leading-relaxed text-[var(--color-muted)] md:text-sm">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Khối 2 & Khối Form tương tác (để chọn chip từ card ở trên sync trực tiếp xuống form) */}
      <B2BInteractiveSection categories={b2bCategoryCards} />

      {/* Khối 3 & 4 (Logo khách hàng & Mẫu đã thực hiện): ẨN khi chưa có dữ liệu thật từ chủ shop */}
      {B2B_CLIENT_LOGOS.length > 0 && (
        <section className="py-12">
          <Container>
            <h2 className="text-center text-2xl font-bold text-[var(--color-ink)]">
              Doanh nghiệp đã tin chọn Freshbag
            </h2>
            <div className="mt-8 grid grid-cols-3 gap-4 md:grid-cols-6">
              {B2B_CLIENT_LOGOS.map((client) => (
                <div
                  key={client.name}
                  className="flex items-center justify-center rounded border border-[var(--color-line)] bg-white p-4"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={client.logoUrl} alt={client.name} width={140} height={60} loading="lazy" />
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {B2B_CASE_STUDIES.length > 0 && (
        <section className="bg-[var(--color-surface)] py-12">
          <Container>
            <h2 className="text-center text-2xl font-bold text-[var(--color-ink)]">
              Quà tặng đã thực hiện
            </h2>
            <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3">
              {B2B_CASE_STUDIES.map((item) => (
                <article
                  key={`${item.clientName}-${item.productType}`}
                  className="overflow-hidden rounded border border-[var(--color-line)] bg-white"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.imageUrl}
                    alt={`${item.productType} cho ${item.clientName}`}
                    width={480}
                    height={480}
                    loading="lazy"
                    className="aspect-square w-full object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-sm font-bold text-[var(--color-ink)]">{item.clientName}</h3>
                    <p className="mt-1 text-xs text-[var(--color-muted)]">{item.productType}</p>
                  </div>
                </article>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Khối 5: Vì sao chọn Freshbag */}
      <section aria-labelledby="b2b-why-heading" className="py-12 md:py-16">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <span className="eyebrow">CAM KẾT DỊCH VỤ B2B</span>
            <h2 id="b2b-why-heading" className="mt-2 text-2xl font-bold text-[var(--color-ink)] md:text-3xl">
              Vì sao chọn Freshbag?
            </h2>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {B2B_BENEFITS.map((item, idx) => (
              <div
                key={item.title}
                className="flex items-start gap-4 rounded-[var(--radius-control)] border border-[var(--color-line)] bg-white p-5 lg:flex-col lg:items-center lg:text-center"
              >
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[var(--color-soft)] text-[var(--color-brand)]">
                  <Icon name={benefitIcons[idx]} width="24" height="24" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-[var(--color-ink)]">{item.title}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-[var(--color-muted)] md:text-sm">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Khối 6: Quy trình 4 bước */}
      <section aria-labelledby="b2b-process-heading" className="bg-[var(--color-surface)] py-12 md:py-16">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <span className="eyebrow">QUY TRÌNH RÕ RÀNG</span>
            <h2
              id="b2b-process-heading"
              className="mt-2 text-2xl font-bold text-[var(--color-ink)] md:text-3xl"
            >
              Đặt quà tặng cùng Freshbag qua 4 bước
            </h2>
          </div>

          <ol className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {B2B_PROCESS_STEPS.map((item) => (
              <li
                key={item.step}
                className="flex items-start gap-4 rounded-[var(--radius-control)] border border-[var(--color-line)] bg-white p-5 lg:flex-col"
              >
                <span className="text-2xl font-extrabold leading-none text-[var(--color-brand)] md:text-3xl">
                  {item.step}
                </span>
                <div>
                  <h3 className="text-base font-bold text-[var(--color-ink)]">{item.title}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-[var(--color-muted)] md:text-sm">
                    {item.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-8 text-center">
            <a href="#dang-ki-b2b" className="fb-button">
              Nhận tư vấn & báo giá
            </a>
          </div>
        </Container>
      </section>

      {/* Khối 7: Giải pháp theo dịp tặng & thông tin B2B minh bạch */}
      <section aria-labelledby="b2b-solutions-heading" className="py-12 md:py-16">
        <Container>
          <div className="mx-auto max-w-4xl">
            <h2 id="b2b-solutions-heading" className="text-2xl font-bold text-[var(--color-ink)] md:text-3xl">
              Giải pháp balo, túi xách và vali cho từng chương trình doanh nghiệp
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[var(--color-muted)] md:text-base">
              Mỗi sự kiện nội bộ hay chiến dịch tri ân đối tác có ngân sách và nhóm người nhận khác nhau. Freshbag giúp doanh nghiệp lựa chọn đúng dòng sản phẩm để quà tặng vừa có tính ứng dụng cao trong sinh hoạt hằng ngày, vừa giữ hình ảnh thương hiệu gọn gàng và chuyên nghiệp.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {B2B_USE_CASES.map((useCase) => (
                <article
                  key={useCase.title}
                  className="rounded-[var(--radius-control)] border border-[var(--color-line)] bg-[var(--color-surface)] p-5"
                >
                  <h3 className="text-base font-bold text-[var(--color-brand)]">{useCase.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink)]">{useCase.description}</p>
                </article>
              ))}
            </div>

            <div className="mt-6 rounded-[var(--radius-control)] border border-[var(--color-line)] bg-[var(--color-soft)] p-5 text-sm leading-relaxed text-[var(--color-ink)]">
              <h3 className="text-base font-bold text-[var(--color-brand)]">
                Thông tin về số lượng tối thiểu, kỹ thuật logo, hóa đơn VAT và giao nhận
              </h3>
              <p className="mt-2">
                Các thông số chi tiết như số lượng đặt tối thiểu (MOQ), mức chiết khấu theo bậc số lượng, kỹ thuật in hoặc thêu logo theo từng chất liệu, tiến độ hoàn thiện và quy trình xuất hóa đơn GTGT (VAT) sẽ được tư vấn trực tiếp dựa trên mẫu hàng và số lượng thực tế của doanh nghiệp.
              </p>
              <p className="mt-2">
                Mọi đơn hàng đều thuộc pháp nhân <strong>{brandFacts.companyName}</strong> ({brandFacts.address}), áp dụng{" "}
                <Link href="/chinh-sach-bao-hanh" className="font-semibold text-[var(--color-brand)] underline">
                  chính sách bảo hành 6 tháng
                </Link>
                ,{" "}
                <Link href="/chinh-sach-van-chuyen" className="font-semibold text-[var(--color-brand)] underline">
                  giao hàng và kiểm hàng toàn quốc
                </Link>{" "}
                và{" "}
                <Link href="/chinh-sach-thanh-toan" className="font-semibold text-[var(--color-brand)] underline">
                  hướng dẫn thanh toán minh bạch
                </Link>
                .
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Khối 8: FAQ (6-8 câu, dùng details/summary, chỉ xuất HTML sạch) */}
      <section aria-labelledby="b2b-faq-heading" className="border-t border-[var(--color-line)] bg-[var(--color-surface)] py-12 md:py-16">
        <Container>
          <div className="mx-auto max-w-3xl">
            <div className="text-center">
              <span className="eyebrow">GIẢI ĐÁP THẮC MẮC</span>
              <h2 id="b2b-faq-heading" className="mt-2 text-2xl font-bold text-[var(--color-ink)] md:text-3xl">
                Câu hỏi thường gặp
              </h2>
            </div>

            <div className="mt-8 divide-y divide-[var(--color-line)] rounded-[var(--radius-control)] border border-[var(--color-line)] bg-white">
              {B2B_FAQS.map((faq, idx) => (
                <details key={faq.question} open={idx === 0} className="group p-4 md:p-5">
                  <summary className="flex min-h-[44px] list-none items-center justify-between gap-4 text-sm font-bold text-[var(--color-ink)] group-open:text-[var(--color-brand)] md:text-base [&::-webkit-details-marker]:hidden">
                    <span>{faq.question}</span>
                    <span
                      aria-hidden="true"
                      className="shrink-0 text-lg font-semibold leading-none text-[var(--color-brand)]"
                    >
                      <span className="group-open:hidden">+</span>
                      <span className="hidden group-open:inline">−</span>
                    </span>
                  </summary>
                  <p className="mt-2.5 text-sm leading-relaxed text-[var(--color-muted)]">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
