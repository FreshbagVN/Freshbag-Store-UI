"use client";

import { useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { brandFacts } from "@/content/brand-facts";
import { Icon } from "@/components/ui/Icon";
import {
  B2B_PRODUCT_CHIPS,
  B2B_QUANTITY_TIERS,
  type B2BCategoryCardItem,
  type B2BProductChip,
  type B2BQuantityTier,
} from "./b2bData";

interface FormErrors {
  fullName?: string;
  phone?: string;
  email?: string;
}

async function copyToClipboard(text: string): Promise<boolean> {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fallback below when clipboard API is blocked.
    }
  }
  if (typeof document === "undefined") return false;
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  let copied = false;
  try {
    copied = document.execCommand("copy");
  } catch {
    copied = false;
  }
  document.body.removeChild(textarea);
  return copied;
}

function normalizePhone(raw: string): string {
  return raw.replace(/[\s.-]/g, "").trim();
}

function isValidVietnameseMobile(raw: string): boolean {
  return /^0\d{9}$/.test(normalizePhone(raw));
}

function isValidEmail(raw: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw.trim());
}

export function B2BInteractiveSection({
  categories,
}: {
  categories: B2BCategoryCardItem[];
}) {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<B2BProductChip[]>([]);
  const [quantityTier, setQuantityTier] = useState<B2BQuantityTier | "">("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [statusMessage, setStatusMessage] = useState("");
  const [lastFormattedMessage, setLastFormattedMessage] = useState("");

  const formSectionRef = useRef<HTMLElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const phoneInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);

  function scrollToForm(focusName = false) {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    formSectionRef.current?.scrollIntoView({
      behavior: prefersReduced ? "auto" : "smooth",
      block: "start",
    });
    if (focusName) {
      window.setTimeout(() => nameInputRef.current?.focus({ preventScroll: true }), 250);
    }
  }

  function handleSelectCategoryFromCard(chip: Exclude<B2BProductChip, "Chưa xác định">) {
    setSelectedProducts((prev) => {
      const withoutUnknown = prev.filter((item) => item !== "Chưa xác định");
      return withoutUnknown.includes(chip) ? withoutUnknown : [...withoutUnknown, chip];
    });
    scrollToForm(true);
  }

  function toggleProductChip(chip: B2BProductChip) {
    setSelectedProducts((prev) => {
      if (chip === "Chưa xác định") {
        return prev.includes("Chưa xác định") ? [] : ["Chưa xác định"];
      }
      const base = prev.filter((item) => item !== "Chưa xác định");
      return base.includes(chip) ? base.filter((item) => item !== chip) : [...base, chip];
    });
  }

  function toggleQuantityChip(tier: B2BQuantityTier) {
    setQuantityTier((prev) => (prev === tier ? "" : tier));
  }

  function validateForm(): FormErrors {
    const next: FormErrors = {};
    if (!fullName.trim()) {
      next.fullName = "Vui lòng nhập họ và tên người liên hệ.";
    }
    if (!phone.trim()) {
      next.phone = "Vui lòng nhập số điện thoại liên hệ.";
    } else if (!isValidVietnameseMobile(phone)) {
      next.phone = "Số điện thoại phải gồm đúng 10 chữ số và bắt đầu bằng số 0 (ví dụ: 0901234567).";
    }
    if (email.trim() && !isValidEmail(email)) {
      next.email = "Email chưa đúng định dạng (ví dụ: ten@congty.vn).";
    }
    return next;
  }

  function focusFirstError(nextErrors: FormErrors) {
    if (nextErrors.fullName) nameInputRef.current?.focus();
    else if (nextErrors.phone) phoneInputRef.current?.focus();
    else if (nextErrors.email) emailInputRef.current?.focus();
  }

  function buildMessageText(): string {
    const productText = selectedProducts.length > 0 ? selectedProducts.join(", ") : "Chưa chọn";
    const quantityText = quantityTier || "Chưa xác định";
    const lines = [
      "[YÊU CẦU BÁO GIÁ B2B - FRESHBAG]",
      `- Họ tên: ${fullName.trim()}`,
      `- Số điện thoại: ${normalizePhone(phone)}`,
      `- Tên doanh nghiệp: ${company.trim() || "Chưa cung cấp"}`,
      `- Email: ${email.trim() || "Chưa cung cấp"}`,
      `- Sản phẩm quan tâm: ${productText}`,
      `- Số lượng dự kiến: ${quantityText}`,
      `- Mô tả yêu cầu: ${notes.trim() || "Cần tư vấn thêm"}`,
    ];
    return lines.join("\n");
  }

  async function handleZaloSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const nextErrors = validateForm();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setStatusMessage("");
      focusFirstError(nextErrors);
      return;
    }

    const message = buildMessageText();
    setLastFormattedMessage(message);
    const copied = await copyToClipboard(message);
    window.open(brandFacts.b2bZaloUrl, "_blank", "noopener,noreferrer");

    setStatusMessage(
      copied
        ? "Đã chép nội dung — dán vào Zalo để gửi"
        : "Đã mở Zalo B2B — vui lòng bấm sao chép nội dung bên dưới và dán vào Zalo để gửi"
    );
  }

  function handleEmailSubmit() {
    const nextErrors = validateForm();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setStatusMessage("");
      focusFirstError(nextErrors);
      return;
    }

    const message = buildMessageText();
    setLastFormattedMessage(message);
    const subject = `Yêu cầu báo giá B2B Freshbag - ${company.trim() || fullName.trim()}`;
    const mailtoHref = `mailto:${brandFacts.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
    window.location.href = mailtoHref;
    setStatusMessage(`Đã mở ứng dụng email để gửi tới ${brandFacts.email}.`);
  }

  async function handleCopyAgain() {
    if (!lastFormattedMessage) return;
    const copied = await copyToClipboard(lastFormattedMessage);
    setStatusMessage(
      copied
        ? "Đã chép nội dung — dán vào Zalo để gửi"
        : "Không thể tự động sao chép, vui lòng chọn đoạn nội dung bên dưới để chép thủ công."
    );
  }

  const inputBaseClass =
    "mt-1.5 w-full min-h-[44px] rounded-[var(--radius-control)] border bg-white px-3.5 py-2.5 text-sm text-[var(--color-ink)] placeholder:text-[var(--color-muted)] focus:outline-none";

  return (
    <>
      <section aria-labelledby="b2b-categories-heading" className="bg-[var(--color-surface)] py-12 md:py-16">
        <div className="fb-container">
          <div className="mx-auto max-w-2xl text-center">
            <span className="eyebrow">DANH MỤC QUÀ TẶNG DOANH NGHIỆP</span>
            <h2
              id="b2b-categories-heading"
              className="mt-2 text-2xl font-bold text-[var(--color-ink)] md:text-3xl"
            >
              Chọn quà tặng theo nhóm sản phẩm
            </h2>
            <p className="mt-2 text-sm text-[var(--color-muted)] md:text-base">
              Chọn nhóm balo, túi xách hoặc vali bạn quan tâm để điền nhanh vào biểu mẫu nhận báo giá bên dưới.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
            {categories.map((cat) => (
              <article
                key={cat.chip}
                className="flex flex-col overflow-hidden rounded-[var(--radius-control)] border border-[var(--color-line)] bg-white"
              >
                <Link
                  href={cat.catalogHref}
                  className="relative block aspect-square overflow-hidden bg-[#f1f2ef]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element -- Ảnh sản phẩm Shopee dùng thẻ img theo PR_RULES 8.4 */}
                  <img
                    src={cat.image}
                    alt={cat.imageAlt}
                    width={480}
                    height={480}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </Link>
                <div className="flex flex-1 flex-col p-3.5 md:p-5">
                  <h3 className="text-base font-bold text-[var(--color-ink)] md:text-lg">{cat.title}</h3>
                  <p className="mt-1 flex-1 text-xs leading-relaxed text-[var(--color-muted)] md:text-sm">
                    {cat.description}
                  </p>
                  <button
                    type="button"
                    onClick={() => handleSelectCategoryFromCard(cat.chip)}
                    className="fb-button mt-4 w-full px-3 py-2.5 text-center text-xs md:text-sm"
                  >
                    Nhận báo giá
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="dang-ki-b2b"
        ref={formSectionRef}
        aria-labelledby="b2b-form-heading"
        className="scroll-mt-8 py-12 md:py-16"
      >
        <div className="fb-container">
          <div className="grid overflow-hidden rounded-[var(--radius-control)] border border-[var(--color-line)] bg-white shadow-sm lg:grid-cols-[5fr_7fr]">
            {/* Mobile: form renders first (order-1), quick contact below (order-2). Desktop: quick contact left (lg:order-1), form right (lg:order-2). */}
            <div className="order-2 flex flex-col justify-between bg-[var(--color-brand)] p-6 text-white md:p-8 lg:order-1">
              <div>
                <h2 className="text-2xl font-bold leading-snug text-white">Cần tư vấn nhanh?</h2>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-on-dark)]">
                  Nhắn Zalo B2B hoặc gửi email trực tiếp để bộ phận doanh nghiệp Freshbag gợi ý mẫu phù hợp ngân sách.
                </p>

                <div className="mt-6 space-y-3.5">
                  <a
                    href={brandFacts.b2bZaloUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex min-h-[60px] items-center gap-3.5 rounded-[var(--radius-control)] bg-white p-4 text-[var(--color-ink)] transition-colors hover:bg-[var(--color-soft)]"
                  >
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[var(--color-soft)] text-[var(--color-brand)]">
                      <Icon name="phone" width="20" height="20" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-xs font-medium text-[var(--color-muted)]">
                        Zalo tư vấn B2B
                      </span>
                      <span className="block text-base font-bold text-[var(--color-brand)]">
                        {brandFacts.b2bPhoneDisplay}
                      </span>
                    </span>
                  </a>

                  <a
                    href={`mailto:${brandFacts.email}`}
                    className="flex min-h-[60px] items-center gap-3.5 rounded-[var(--radius-control)] bg-white p-4 text-[var(--color-ink)] transition-colors hover:bg-[var(--color-soft)]"
                  >
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[var(--color-soft)] text-[var(--color-brand)]">
                      <Icon name="wallet" width="20" height="20" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-xs font-medium text-[var(--color-muted)]">
                        Email nhận báo giá
                      </span>
                      <span className="block break-all text-base font-bold text-[var(--color-brand)]">
                        {brandFacts.email}
                      </span>
                    </span>
                  </a>
                </div>
              </div>

              <div className="mt-8 border-t border-white/20 pt-5 text-xs leading-relaxed text-[var(--color-on-dark)]">
                <p className="font-semibold text-white">{brandFacts.companyName}</p>
                <p className="mt-1">{brandFacts.address}</p>
                <p className="mt-1">
                  Hotline CSKH chung:{" "}
                  <a href={`tel:${brandFacts.hotline}`} className="underline">
                    {brandFacts.hotlineDisplay}
                  </a>
                </p>
              </div>
            </div>

            <div className="order-1 p-5 sm:p-7 md:p-8 lg:order-2">
              <h2
                id="b2b-form-heading"
                className="text-xl font-bold uppercase tracking-tight text-[var(--color-brand)] md:text-2xl"
              >
                Nhận tư vấn & báo giá
              </h2>
              <p className="mt-1.5 text-sm text-[var(--color-muted)]">
                Điền nhu cầu bên dưới, hệ thống sẽ chép nội dung để bạn dán gửi trực tiếp qua Zalo B2B hoặc mở sẵn email.
              </p>

              <form onSubmit={handleZaloSubmit} noValidate className="mt-6 space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="b2b-full-name"
                      className="block text-xs font-semibold text-[var(--color-ink)]"
                    >
                      Họ tên <span className="text-[var(--color-price)]">*</span>
                    </label>
                    <input
                      ref={nameInputRef}
                      id="b2b-full-name"
                      name="fullName"
                      type="text"
                      required
                      autoComplete="name"
                      placeholder="Nguyễn Văn A"
                      value={fullName}
                      onChange={(e) => {
                        setFullName(e.target.value);
                        if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: undefined }));
                      }}
                      aria-invalid={Boolean(errors.fullName)}
                      aria-describedby={errors.fullName ? "b2b-full-name-error" : undefined}
                      className={`${inputBaseClass} ${
                        errors.fullName
                          ? "border-[var(--color-price)] focus:border-[var(--color-price)]"
                          : "border-[var(--color-line)] focus:border-[var(--color-brand)]"
                      }`}
                    />
                    {errors.fullName && (
                      <p
                        id="b2b-full-name-error"
                        role="alert"
                        className="mt-1 text-xs font-medium text-[var(--color-price)]"
                      >
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="b2b-phone"
                      className="block text-xs font-semibold text-[var(--color-ink)]"
                    >
                      Số điện thoại <span className="text-[var(--color-price)]">*</span>
                    </label>
                    <input
                      ref={phoneInputRef}
                      id="b2b-phone"
                      name="phone"
                      type="tel"
                      inputMode="tel"
                      required
                      autoComplete="tel"
                      placeholder="0901234567"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
                      }}
                      aria-invalid={Boolean(errors.phone)}
                      aria-describedby={errors.phone ? "b2b-phone-error" : "b2b-phone-hint"}
                      className={`${inputBaseClass} ${
                        errors.phone
                          ? "border-[var(--color-price)] focus:border-[var(--color-price)]"
                          : "border-[var(--color-line)] focus:border-[var(--color-brand)]"
                      }`}
                    />
                    <p id="b2b-phone-hint" className="mt-1 text-[11px] text-[var(--color-muted)]">
                      Nhập 10 chữ số, bắt đầu bằng số 0.
                    </p>
                    {errors.phone && (
                      <p
                        id="b2b-phone-error"
                        role="alert"
                        className="mt-1 text-xs font-medium text-[var(--color-price)]"
                      >
                        {errors.phone}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="b2b-company"
                      className="block text-xs font-semibold text-[var(--color-ink)]"
                    >
                      Tên doanh nghiệp
                    </label>
                    <input
                      id="b2b-company"
                      name="company"
                      type="text"
                      autoComplete="organization"
                      placeholder="Công ty / Tổ chức"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className={`${inputBaseClass} border-[var(--color-line)] focus:border-[var(--color-brand)]`}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="b2b-email"
                      className="block text-xs font-semibold text-[var(--color-ink)]"
                    >
                      Email
                    </label>
                    <input
                      ref={emailInputRef}
                      id="b2b-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="ten@doanhnghiep.vn"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                      }}
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={errors.email ? "b2b-email-error" : undefined}
                      className={`${inputBaseClass} ${
                        errors.email
                          ? "border-[var(--color-price)] focus:border-[var(--color-price)]"
                          : "border-[var(--color-line)] focus:border-[var(--color-brand)]"
                      }`}
                    />
                    {errors.email && (
                      <p
                        id="b2b-email-error"
                        role="alert"
                        className="mt-1 text-xs font-medium text-[var(--color-price)]"
                      >
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <span id="b2b-products-label" className="block text-xs font-semibold text-[var(--color-ink)]">
                    Sản phẩm quan tâm (có thể chọn nhiều)
                  </span>
                  <div
                    role="group"
                    aria-labelledby="b2b-products-label"
                    className="mt-2 flex flex-wrap gap-2"
                  >
                    {B2B_PRODUCT_CHIPS.map((chip) => {
                      const active = selectedProducts.includes(chip);
                      return (
                        <button
                          key={chip}
                          type="button"
                          aria-pressed={active}
                          onClick={() => toggleProductChip(chip)}
                          className={`inline-flex min-h-[44px] items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-medium transition-colors sm:text-sm ${
                            active
                              ? "border-[var(--color-brand)] bg-[var(--color-brand)] text-white"
                              : "border-[var(--color-line)] bg-white text-[var(--color-ink)] hover:border-[var(--color-brand)] hover:bg-[var(--color-soft)]"
                          }`}
                        >
                          {active && <span aria-hidden="true">✓</span>}
                          <span>{chip}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <span id="b2b-qty-label" className="block text-xs font-semibold text-[var(--color-ink)]">
                    Số lượng dự kiến (chọn một)
                  </span>
                  <div
                    role="group"
                    aria-labelledby="b2b-qty-label"
                    className="mt-2 flex flex-wrap gap-2"
                  >
                    {B2B_QUANTITY_TIERS.map((tier) => {
                      const active = quantityTier === tier;
                      return (
                        <button
                          key={tier}
                          type="button"
                          aria-pressed={active}
                          onClick={() => toggleQuantityChip(tier)}
                          className={`inline-flex min-h-[44px] items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-medium transition-colors sm:text-sm ${
                            active
                              ? "border-[var(--color-brand)] bg-[var(--color-brand)] text-white"
                              : "border-[var(--color-line)] bg-white text-[var(--color-ink)] hover:border-[var(--color-brand)] hover:bg-[var(--color-soft)]"
                          }`}
                        >
                          {active && <span aria-hidden="true">✓</span>}
                          <span>{tier}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="b2b-notes"
                    className="block text-xs font-semibold text-[var(--color-ink)]"
                  >
                    Mô tả yêu cầu
                  </label>
                  <textarea
                    id="b2b-notes"
                    name="notes"
                    rows={4}
                    placeholder="Ví dụ: vị trí in/thêu logo, màu sắc ưu tiên, thời gian cần nhận hàng hoặc địa điểm giao."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="mt-1.5 w-full rounded-[var(--radius-control)] border border-[var(--color-line)] bg-white px-3.5 py-2.5 text-sm text-[var(--color-ink)] placeholder:text-[var(--color-muted)] focus:border-[var(--color-brand)] focus:outline-none"
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <button type="submit" className="fb-button w-full text-sm">
                    Chép & gửi qua Zalo
                  </button>
                  <button
                    type="button"
                    onClick={handleEmailSubmit}
                    className="inline-flex min-h-[44px] w-full items-center justify-center rounded-[var(--radius-control)] border border-[var(--color-brand)] bg-white px-5 py-2.5 text-sm font-semibold text-[var(--color-brand)] transition-colors hover:bg-[var(--color-soft)]"
                  >
                    Gửi qua email
                  </button>
                </div>

                {statusMessage && (
                  <div
                    role="status"
                    aria-live="polite"
                    className="rounded-[var(--radius-control)] border border-[var(--color-brand)] bg-[var(--color-soft)] p-4 text-sm text-[var(--color-ink)]"
                  >
                    <p className="font-semibold text-[var(--color-brand)]">{statusMessage}</p>
                    {lastFormattedMessage && (
                      <div className="mt-2 space-y-2">
                        <pre className="overflow-x-auto whitespace-pre-wrap rounded border border-[var(--color-line)] bg-white p-3 text-xs text-[var(--color-ink)]">
                          {lastFormattedMessage}
                        </pre>
                        <div className="flex flex-wrap gap-3">
                          <button
                            type="button"
                            onClick={handleCopyAgain}
                            className="inline-flex min-h-[44px] items-center rounded-[var(--radius-control)] border border-[var(--color-brand)] bg-white px-3.5 py-2 text-xs font-semibold text-[var(--color-brand)] hover:bg-[var(--color-surface)]"
                          >
                            Sao chép lại nội dung
                          </button>
                          <a
                            href={brandFacts.b2bZaloUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex min-h-[44px] items-center rounded-[var(--radius-control)] bg-[var(--color-brand)] px-3.5 py-2 text-xs font-semibold text-white hover:opacity-90"
                          >
                            Mở Zalo B2B ({brandFacts.b2bPhoneDisplay}) ↗
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <p className="text-center text-xs text-[var(--color-muted)]">
                  Thông tin được ghép thành tin nhắn trên trình duyệt để bạn gửi qua Zalo hoặc Email, không lưu trên cơ sở dữ liệu web.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
