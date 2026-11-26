import { brandFacts } from "@/content/brand-facts";
import { PENDING_OWNER_MESSAGE } from "@/content/policies";
import { Icon } from "@/components/ui/Icon";

export function ContactDetailsAndMap() {
  const mapQuery = encodeURIComponent(brandFacts.address);
  const mapDirectionsUrl = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;
  const mapEmbedUrl = `https://maps.google.com/maps?q=${mapQuery}&t=&z=16&ie=UTF8&iwloc=&output=embed`;

  return (
    <section
      aria-label="Thông tin liên hệ trực tiếp và bản đồ"
      className="grid gap-6 md:grid-cols-2"
    >
      <div className="rounded-[var(--radius-control)] border border-[var(--color-line)] bg-white p-5 md:p-6">
        <h2 className="text-lg font-bold text-[var(--color-brand)]">
          Đầu mối liên hệ nhanh
        </h2>
        <div className="mt-4 space-y-4 text-sm">
          <div className="rounded-[var(--radius-control)] border border-[var(--color-line)] bg-[var(--color-surface)] p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">
              Mua lẻ & Chăm sóc khách hàng
            </p>
            <div className="mt-2 flex flex-wrap gap-3">
              <a
                href={`tel:${brandFacts.hotline}`}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-[var(--radius-control)] bg-[var(--color-brand)] px-4 py-2 font-semibold text-white hover:opacity-90"
              >
                <Icon name="phone" width="18" height="18" />
                <span>Gọi {brandFacts.hotlineDisplay}</span>
              </a>
              <a
                href={brandFacts.zaloUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-[44px] items-center rounded-[var(--radius-control)] border border-[var(--color-brand)] bg-white px-4 py-2 font-semibold text-[var(--color-brand)] hover:bg-[var(--color-soft)]"
              >
                Nhắn Zalo CSKH
              </a>
            </div>
          </div>

          <div className="rounded-[var(--radius-control)] border border-[var(--color-line)] bg-[var(--color-surface)] p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">
              Khách hàng doanh nghiệp (B2B)
            </p>
            <div className="mt-2 flex flex-wrap gap-3">
              <a
                href={brandFacts.b2bZaloUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-[44px] items-center rounded-[var(--radius-control)] bg-[var(--color-brand)] px-4 py-2 font-semibold text-white hover:opacity-90"
              >
                Zalo B2B: {brandFacts.b2bPhoneDisplay}
              </a>
              <a
                href={`mailto:${brandFacts.email}`}
                className="inline-flex min-h-[44px] items-center rounded-[var(--radius-control)] border border-[var(--color-brand)] bg-white px-4 py-2 font-semibold text-[var(--color-brand)] hover:bg-[var(--color-soft)]"
              >
                {brandFacts.email}
              </a>
            </div>
          </div>

          <div className="space-y-1 text-sm text-[var(--color-ink)]">
            <p>
              <strong className="font-semibold">Pháp nhân:</strong> {brandFacts.companyName}
            </p>
            <p>
              <strong className="font-semibold">Địa chỉ:</strong> {brandFacts.address}
            </p>
            <p>
              <strong className="font-semibold">Giờ mở cửa:</strong>{" "}
              {brandFacts.workingHours ?? PENDING_OWNER_MESSAGE}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col rounded-[var(--radius-control)] border border-[var(--color-line)] bg-white p-5 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-bold text-[var(--color-brand)]">
            Bản đồ vị trí Freshbag
          </h2>
          <a
            href={mapDirectionsUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-[36px] items-center text-xs font-semibold text-[var(--color-brand)] underline"
          >
            Mở Google Maps ↗
          </a>
        </div>
        <div className="mt-4 min-h-[260px] flex-1 overflow-hidden rounded-[var(--radius-control)] border border-[var(--color-line)] bg-[var(--color-surface)]">
          <iframe
            title={`Bản đồ ${brandFacts.companyName}`}
            src={mapEmbedUrl}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-full min-h-[260px] w-full border-0"
          />
        </div>
      </div>
    </section>
  );
}
