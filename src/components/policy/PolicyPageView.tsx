import Link from "next/link";
import type { ReactNode } from "react";
import { brandFacts } from "@/content/brand-facts";
import { PENDING_OWNER_MESSAGE, type PolicyDocument } from "@/content/policies";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Container } from "@/components/ui/Container";

export function PolicyPageView({
  doc,
  extraBeforeRelated,
  jsonLdList,
}: {
  doc: PolicyDocument;
  extraBeforeRelated?: ReactNode;
  jsonLdList: Record<string, unknown>[];
}) {
  return (
    <>
      {jsonLdList.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <Breadcrumb label={doc.breadcrumbLabel} />

      <Container className="py-8 md:py-12">
        <div className="mx-auto max-w-4xl">
          <header className="rounded-[var(--radius-control)] border border-[var(--color-line)] bg-[var(--color-surface)] p-6 md:p-8">
            <span className="eyebrow">{doc.eyebrow}</span>
            <h1 className="mt-3 text-2xl font-bold leading-snug text-[var(--color-brand)] md:text-4xl">
              {doc.h1}
            </h1>
            <p className="mt-2 text-xs text-[var(--color-muted)]">
              Ngày hiệu lực / cập nhật: <time dateTime={doc.updatedAtIso}>{doc.updatedAt}</time> · Người bán:{" "}
              <strong className="font-semibold text-[var(--color-ink)]">{brandFacts.companyName}</strong>
            </p>

            <div className="mt-5 rounded-[var(--radius-control)] border-l-4 border-[var(--color-brand)] bg-white p-4 text-sm leading-relaxed text-[var(--color-ink)]">
              <p className="font-semibold text-[var(--color-brand)]">Tóm tắt nhanh</p>
              <p className="mt-1">{doc.answerFirst}</p>
            </div>
          </header>

          <nav
            aria-label="Mục lục nội dung"
            className="mt-6 rounded-[var(--radius-control)] border border-[var(--color-line)] bg-white p-5"
          >
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-brand)]">
              Mục lục trang
            </p>
            <ol className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
              {doc.sections.map((section, idx) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="inline-flex min-h-[36px] items-center gap-2 text-[var(--color-ink)] underline-offset-4 hover:text-[var(--color-brand)] hover:underline"
                  >
                    <span className="font-semibold text-[var(--color-brand)]">{idx + 1}.</span>
                    <span>{section.heading}</span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <article className="mt-8 space-y-8">
            {doc.sections.map((section, idx) => (
              <section
                key={section.id}
                id={section.id}
                className="scroll-mt-8 rounded-[var(--radius-control)] border border-[var(--color-line)] bg-white p-5 md:p-7"
              >
                <h2 className="text-lg font-bold text-[var(--color-brand)] md:text-xl">
                  {idx + 1}. {section.heading}
                </h2>

                {section.paragraphs?.map((paragraph, pIdx) => (
                  <p key={pIdx} className="mt-3 text-sm leading-relaxed text-[var(--color-ink)] md:text-[15px]">
                    {paragraph}
                  </p>
                ))}

                {section.bullets && section.bullets.length > 0 && (
                  <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-[var(--color-ink)] md:text-[15px]">
                    {section.bullets.map((bullet, bIdx) => (
                      <li key={bIdx}>{bullet}</li>
                    ))}
                  </ul>
                )}

                {section.orderedSteps && section.orderedSteps.length > 0 && (
                  <ol className="mt-4 list-decimal space-y-2.5 pl-5 text-sm leading-relaxed text-[var(--color-ink)] md:text-[15px]">
                    {section.orderedSteps.map((step, sIdx) => (
                      <li key={sIdx}>{step}</li>
                    ))}
                  </ol>
                )}

                {section.tables?.map((table, tIdx) => (
                  <div key={tIdx} className="mt-5 overflow-x-auto">
                    <table className="w-full min-w-[520px] border-collapse border border-[var(--color-line)] text-left text-sm">
                      {table.caption && (
                        <caption className="mb-2 text-left text-xs font-medium text-[var(--color-muted)]">
                          {table.caption}
                        </caption>
                      )}
                      <thead>
                        <tr className="bg-[var(--color-soft)]">
                          {table.headers.map((header) => (
                            <th
                              key={header}
                              scope="col"
                              className="border border-[var(--color-line)] px-3.5 py-2.5 font-semibold text-[var(--color-brand)]"
                            >
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {table.rows.map((row, rIdx) => (
                          <tr key={rIdx} className="odd:bg-white even:bg-[var(--color-surface)]/55">
                            {row.map((cell, cIdx) => (
                              <td
                                key={cIdx}
                                className={`border border-[var(--color-line)] px-3.5 py-3 align-top leading-relaxed ${
                                  cIdx === 0 ? "font-semibold text-[var(--color-ink)]" : "text-[var(--color-ink)]"
                                }`}
                              >
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}

                {section.subsections?.map((sub, subIdx) => (
                  <div key={subIdx} className="mt-6 border-t border-[var(--color-line)] pt-5">
                    <h3 className="text-base font-bold text-[var(--color-ink)]">{sub.heading}</h3>
                    {sub.paragraphs?.map((paragraph, pIdx) => (
                      <p key={pIdx} className="mt-2.5 text-sm leading-relaxed text-[var(--color-ink)]">
                        {paragraph}
                      </p>
                    ))}
                    {sub.tables?.map((table, tIdx) => (
                      <div key={tIdx} className="mt-4 overflow-x-auto">
                        <table className="w-full min-w-[500px] border-collapse border border-[var(--color-line)] text-left text-sm">
                          <thead>
                            <tr className="bg-[var(--color-soft)]">
                              {table.headers.map((header) => (
                                <th
                                  key={header}
                                  scope="col"
                                  className="border border-[var(--color-line)] px-3.5 py-2.5 font-semibold text-[var(--color-brand)]"
                                >
                                  {header}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {table.rows.map((row, rIdx) => (
                              <tr key={rIdx} className="odd:bg-white even:bg-[var(--color-surface)]/55">
                                {row.map((cell, cIdx) => (
                                  <td
                                    key={cIdx}
                                    className={`border border-[var(--color-line)] px-3.5 py-2.5 align-top ${
                                      cIdx === 0 ? "font-semibold" : ""
                                    }`}
                                  >
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ))}
                    {sub.bullets && sub.bullets.length > 0 && (
                      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-[var(--color-ink)]">
                        {sub.bullets.map((bullet, bIdx) => (
                          <li key={bIdx}>{bullet}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}

                {section.needsOwnerInput && (
                  <p className="mt-4 rounded-[var(--radius-control)] border border-dashed border-[var(--color-brand)]/40 bg-[var(--color-soft)] px-3.5 py-2.5 text-xs text-[var(--color-muted)]">
                    Ghi chú: Một số thông tin chi tiết ở mục này đang cập nhật và sẽ được hoàn thiện khi chủ shop xác nhận bổ sung.
                  </p>
                )}
              </section>
            ))}

            {extraBeforeRelated}

            <section
              aria-label="Thông tin đơn vị chịu trách nhiệm"
              className="rounded-[var(--radius-control)] border border-[var(--color-line)] bg-[var(--color-soft)] p-5 md:p-7"
            >
              <h2 className="text-base font-bold text-[var(--color-brand)] md:text-lg">
                Thông tin doanh nghiệp & hỗ trợ trực tiếp
              </h2>
              <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">
                    Đơn vị
                  </dt>
                  <dd className="mt-0.5 font-semibold text-[var(--color-ink)]">{brandFacts.companyName}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">
                    Địa chỉ
                  </dt>
                  <dd className="mt-0.5 text-[var(--color-ink)]">{brandFacts.address}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">
                    Hotline / Zalo CSKH
                  </dt>
                  <dd className="mt-0.5">
                    <a
                      href={`tel:${brandFacts.hotline}`}
                      className="font-semibold text-[var(--color-brand)] underline"
                    >
                      {brandFacts.hotlineDisplay}
                    </a>{" "}
                    ·{" "}
                    <a
                      href={brandFacts.zaloUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-[var(--color-brand)] underline"
                    >
                      Nhắn Zalo CSKH
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">
                    Email & Zalo B2B
                  </dt>
                  <dd className="mt-0.5">
                    <a
                      href={`mailto:${brandFacts.email}`}
                      className="font-semibold text-[var(--color-brand)] underline"
                    >
                      {brandFacts.email}
                    </a>{" "}
                    ·{" "}
                    <a
                      href={brandFacts.b2bZaloUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-[var(--color-brand)] underline"
                    >
                      Zalo B2B {brandFacts.b2bPhoneDisplay}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">
                    Mã số thuế
                  </dt>
                  <dd className="mt-0.5 text-[var(--color-ink)]">
                    {brandFacts.taxCode ?? "Đang cập nhật"}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">
                    Người đại diện pháp luật
                  </dt>
                  <dd className="mt-0.5 text-[var(--color-ink)]">
                    {brandFacts.representative ?? "Đang cập nhật"}
                  </dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">
                    Giờ làm việc
                  </dt>
                  <dd className="mt-0.5 text-[var(--color-ink)]">
                    {brandFacts.workingHours ?? PENDING_OWNER_MESSAGE}
                  </dd>
                </div>
              </dl>
            </section>

            <section aria-label="Liên kết chính sách liên quan" className="pt-2">
              <h2 className="text-lg font-bold text-[var(--color-ink)]">
                Chính sách & thông tin liên quan tại Freshbag
              </h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {doc.relatedLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex min-h-[64px] flex-col justify-center rounded-[var(--radius-control)] border border-[var(--color-line)] bg-white p-4 transition-colors hover:border-[var(--color-brand)] hover:bg-[var(--color-soft)]"
                  >
                    <span className="text-sm font-semibold text-[var(--color-brand)]">{item.label}</span>
                    <span className="mt-1 text-xs text-[var(--color-muted)]">{item.description}</span>
                  </Link>
                ))}
              </div>
            </section>
          </article>
        </div>
      </Container>
    </>
  );
}
