import { brandFacts } from "./brand-facts";

/**
 * Nội dung có cấu trúc cho trang Giới thiệu, Liên hệ và 5 trang Chính sách Freshbag.
 * Dựa trên văn bản pháp lý đã duyệt (van-ban.json, brief.md), chuyển ngữ cảnh sang website freshbag.com.vn
 * và đồng bộ dữ kiện đã chốt từ brand-facts.ts.
 */

export type PolicySlug =
  | "gioi-thieu"
  | "lien-he"
  | "chinh-sach-bao-hanh"
  | "chinh-sach-doi-tra"
  | "chinh-sach-van-chuyen"
  | "chinh-sach-thanh-toan"
  | "chinh-sach-bao-mat";

export interface PolicyTable {
  caption?: string;
  headers: string[];
  rows: string[][];
}

export interface PolicySection {
  id: string;
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
  orderedSteps?: string[];
  tables?: PolicyTable[];
  subsections?: {
    heading: string;
    paragraphs?: string[];
    bullets?: string[];
    tables?: PolicyTable[];
  }[];
  needsOwnerInput?: boolean;
  ownerInputNote?: string;
}

export interface PolicyLinkItem {
  label: string;
  href: string;
  description: string;
}

export interface PolicyDocument {
  slug: PolicySlug;
  canonicalPath: `/${PolicySlug}`;
  breadcrumbLabel: string;
  eyebrow: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  updatedAt: string;
  updatedAtIso: string;
  answerFirst: string;
  needsOwnerReview: boolean;
  ownerReviewSummary?: string;
  sections: PolicySection[];
  relatedLinks: PolicyLinkItem[];
}

export const PENDING_OWNER_MESSAGE =
  "Đang cập nhật. Vui lòng liên hệ hotline 093 268 2008 hoặc email info@freshbag.com.vn để được hỗ trợ.";

export const POLICY_LINKS: PolicyLinkItem[] = [
  {
    label: "Chính sách bảo hành",
    href: "/chinh-sach-bao-hanh",
    description: "Thời hạn bảo hành 6 tháng lỗi nhà sản xuất và hướng dẫn tiếp nhận.",
  },
  {
    label: "Chính sách đổi trả",
    href: "/chinh-sach-doi-tra",
    description: "Đổi trả 7 ngày kể từ khi nhận hàng, hoàn tiền 3–5 ngày làm việc và khiếu nại.",
  },
  {
    label: "Chính sách vận chuyển",
    href: "/chinh-sach-van-chuyen",
    description: "Giao hàng toàn quốc qua SPX Express, phí hiển thị ở bước thanh toán.",
  },
  {
    label: "Chính sách thanh toán",
    href: "/chinh-sach-thanh-toan",
    description: "Thanh toán COD, chuyển khoản VietinBank, giá đã gồm VAT và hóa đơn MISA.",
  },
  {
    label: "Chính sách bảo mật",
    href: "/chinh-sach-bao-mat",
    description: "Thu thập, lưu trữ, bảo vệ dữ liệu và quyền khách hàng theo Luật 91/2025/QH15.",
  },
  {
    label: "Bán hàng doanh nghiệp (B2B)",
    href: "/ban-hang-doanh-nghiep",
    description: "Đặt balo, túi xách quà tặng và đồng phục in/thêu logo số lượng lớn.",
  },
  {
    label: "Giới thiệu Freshbag",
    href: "/gioi-thieu",
    description: "Thông tin doanh nghiệp, danh mục sản phẩm và cam kết thương hiệu.",
  },
  {
    label: "Liên hệ Freshbag",
    href: "/lien-he",
    description: "Địa chỉ 367 Nguyễn Văn Luông, Phú Lâm, TP.HCM, hotline và Zalo B2B.",
  },
];

export const POLICIES: Record<PolicySlug, PolicyDocument> = {
  "gioi-thieu": {
    slug: "gioi-thieu",
    canonicalPath: "/gioi-thieu",
    breadcrumbLabel: "Giới thiệu",
    eyebrow: "VỀ THƯƠNG HIỆU FRESHBAG",
    metaTitle: "Giới thiệu Freshbag – Balo, túi xách & vali",
    metaDescription:
      "Tìm hiểu Freshbag – Công ty TNHH SX TM DV Freshbag tại TP.HCM chuyên balo, túi xách, vali chính hãng, bảo hành 6 tháng, giao hàng toàn quốc và quà tặng B2B.",
    h1: "Giới thiệu Freshbag – Đồng hành mỗi ngày cùng bạn",
    updatedAt: "26/11/2026",
    updatedAtIso: "2026-11-26",
    answerFirst:
      "Freshbag là thương hiệu trực thuộc CÔNG TY TNHH SX TM DV FRESHBAG tại 367 Nguyễn Văn Luông, Phường Phú Lâm, TP. Hồ Chí Minh, cung cấp balo, cặp sách, túi xách, ví và vali trên website freshbag.com.vn với bảo hành 6 tháng lỗi nhà sản xuất, đổi trả 7 ngày kể từ khi nhận hàng và giao hàng toàn quốc qua SPX Express.",
    needsOwnerReview: true,
    ownerReviewSummary:
      "Cần chủ shop bổ sung mã số thuế, người đại diện pháp luật và xác nhận danh sách thương hiệu phân phối hiện hành.",
    sections: [
      {
        id: "thuong-hieu-va-hanh-trinh",
        heading: "Freshbag là ai và phục vụ nhu cầu nào?",
        paragraphs: [
          "Với khẩu hiệu Grow up with you, Freshbag (website chính thức freshbag.com.vn) hoạt động trong lĩnh vực cung cấp balo, cặp sách, túi xách, ví và vali phục vụ khách hàng cá nhân trên toàn quốc cũng như khách hàng doanh nghiệp.",
          "Hệ thống sản phẩm tại Freshbag được tuyển chọn để đáp ứng nhiều nhịp sống hằng ngày: từ balo học sinh, balo laptop đi làm, cặp da công sở, túi đeo chéo gọn nhẹ đến túi trống du lịch và vali hành lý nhiều kích cỡ.",
          "Ngoài kênh bán lẻ trực tuyến giúp khách hàng tra cứu giá đã bao gồm VAT, chọn phân loại và đặt hàng nhanh qua COD hoặc chuyển khoản, Freshbag còn phát triển mảng quà tặng và đồng phục doanh nghiệp (B2B) cho các dịp hội thảo, sự kiện và tri ân đối tác.",
        ],
      },
      {
        id: "danh-muc-va-chat-lieu",
        heading: "Danh mục sản phẩm và chất liệu tại Freshbag",
        paragraphs: [
          "Danh mục sản phẩm tại Freshbag đa dạng về kiểu dáng, kích thước và chất liệu như da, vải tổng hợp, vải dù, nhựa và simili để phù hợp từng nhu cầu sử dụng thực tế.",
        ],
        bullets: [
          "Balo các loại: balo laptop chống sốc, balo học sinh, balo du lịch, balo đa năng, balo thời trang.",
          "Túi xách & cặp công sở: cặp da công sở, túi xách nữ, túi tote, ví nữ.",
          "Hành lý & túi phụ kiện: vali du lịch nhiều size, túi trống du lịch, túi đeo chéo và phụ kiện.",
        ],
        needsOwnerInput: true,
        ownerInputNote:
          "Cần chủ shop xác nhận danh sách các thương hiệu phân phối/đại lý chính thức và hình thức tiếp đón khách trực tiếp tại cửa hàng.",
      },
      {
        id: "cam-ket-dich-vu",
        heading: "Cam kết dịch vụ dành cho khách hàng Freshbag",
        paragraphs: [
          "Mọi đơn hàng đặt mua tại website freshbag.com.vn đều được áp dụng công khai các cam kết về nguồn gốc, giá bán, giao nhận và hỗ trợ sau bán hàng:",
        ],
        bullets: [
          "Sản phẩm rõ nguồn gốc, đúng mô tả chất liệu và thông số công bố trên trang sản phẩm.",
          "Giá hiển thị trên website đã bao gồm thuế giá trị gia tăng (VAT); xuất hóa đơn điện tử qua MISA khi khách hàng yêu cầu.",
          "Bảo hành 6 tháng đối với các lỗi kỹ thuật phát sinh từ nhà sản xuất.",
          "Hỗ trợ đổi trả trong vòng 7 ngày kể từ khi nhận hàng theo điều kiện minh bạch tại Chính sách đổi trả.",
          "Thanh toán linh hoạt qua tiền mặt khi nhận hàng (COD) hoặc chuyển khoản ngân hàng VietinBank.",
          "Giao hàng toàn quốc qua đơn vị vận chuyển SPX Express; phí giao hàng hiển thị rõ ở bước thanh toán trước khi đặt hàng.",
        ],
      },
      {
        id: "giai-phap-doanh-nghiep",
        heading: "Dịch vụ quà tặng & đồng phục doanh nghiệp (B2B)",
        paragraphs: [
          "Bên cạnh bán lẻ, Freshbag đồng hành cùng doanh nghiệp, trường học và tổ chức khi cần đặt balo đồng phục, túi xách sự kiện hoặc vali quà tặng có in/thêu logo thương hiệu.",
          "Doanh nghiệp có thể gửi yêu cầu trực tiếp tại trang Bán hàng doanh nghiệp, kết nối Zalo B2B 0906 818 084 hoặc gửi email về info@freshbag.com.vn để được tư vấn mẫu phù hợp ngân sách.",
        ],
      },
      {
        id: "thong-tin-phap-nhan",
        heading: "Thông tin người bán & liên hệ chính thức",
        paragraphs: [
          "Đơn vị vận hành website freshbag.com.vn: CÔNG TY TNHH SX TM DV FRESHBAG.",
          "Địa chỉ: 367 Nguyễn Văn Luông, Phường Phú Lâm, TP. Hồ Chí Minh.",
          "Hotline / Zalo CSKH: 093 268 2008 (zalo.me/0932682008) · Zalo B2B: 0906 818 084 · Email: info@freshbag.com.vn.",
          "Giờ mở cửa: 8:00–17:30, Thứ 2–Thứ 7. Mã số thuế và người đại diện pháp luật: đang cập nhật.",
        ],
        needsOwnerInput: true,
        ownerInputNote: "Cần chủ shop bổ sung mã số thuế (MST) và họ tên người đại diện pháp luật.",
      },
    ],
    relatedLinks: [
      {
        label: "Khám phá toàn bộ sản phẩm Freshbag",
        href: "/san-pham",
        description: "Xem balo, túi xách, ví và vali đang kinh doanh.",
      },
      {
        label: "Bán hàng doanh nghiệp (B2B)",
        href: "/ban-hang-doanh-nghiep",
        description: "Nhận tư vấn và báo giá quà tặng balo, túi xách in logo.",
      },
      {
        label: "Chính sách bảo hành 6 tháng",
        href: "/chinh-sach-bao-hanh",
        description: "Thông tin tiếp nhận bảo hành lỗi nhà sản xuất.",
      },
      {
        label: "Liên hệ Freshbag tại TP.HCM",
        href: "/lien-he",
        description: "Địa chỉ 367 Nguyễn Văn Luông và các kênh hỗ trợ nhanh.",
      },
    ],
  },

  "lien-he": {
    slug: "lien-he",
    canonicalPath: "/lien-he",
    breadcrumbLabel: "Liên hệ",
    eyebrow: "HỖ TRỢ KHÁCH HÀNG & B2B",
    metaTitle: "Liên hệ Freshbag – Địa chỉ, Hotline & Zalo",
    metaDescription:
      "Liên hệ CÔNG TY TNHH SX TM DV FRESHBAG tại 367 Nguyễn Văn Luông, P. Phú Lâm, TP.HCM. Hotline 093 268 2008, Zalo B2B 0906 818 084, email info@freshbag.com.vn.",
    h1: "Liên hệ Freshbag – CSKH & Tư vấn doanh nghiệp",
    updatedAt: "26/11/2026",
    updatedAtIso: "2026-11-26",
    answerFirst:
      "Khách hàng liên hệ CÔNG TY TNHH SX TM DV FRESHBAG tại 367 Nguyễn Văn Luông, Phường Phú Lâm, TP. Hồ Chí Minh. Hỗ trợ mua lẻ, đổi trả, bảo hành và khiếu nại qua Hotline/Zalo 093 268 2008 hoặc email info@freshbag.com.vn; tư vấn đơn hàng doanh nghiệp qua Zalo B2B 0906 818 084. Phản hồi ban đầu trong 1 ngày làm việc.",
    needsOwnerReview: true,
    ownerReviewSummary:
      "Cần chủ shop bổ sung mã số thuế, người đại diện pháp luật và xác nhận quy trình tiếp đón khách ghé trực tiếp tại 367 Nguyễn Văn Luông.",
    sections: [
      {
        id: "kenh-lien-he-chinh-thuc",
        heading: "Kênh liên hệ chính thức của Freshbag",
        paragraphs: [
          "Để được hỗ trợ nhanh chóng và đúng bộ phận phụ trách khi mua sắm trên website freshbag.com.vn, quý khách vui lòng liên hệ qua các kênh chính thức sau:",
        ],
        bullets: [
          "Hotline & Zalo CSKH (khách lẻ, tra cứu đơn, đổi trả, bảo hành, khiếu nại): 093 268 2008 (https://zalo.me/0932682008).",
          "Zalo Tư vấn Doanh nghiệp (B2B, quà tặng số lượng lớn, in/thêu logo): 0906 818 084 (https://zalo.me/0906818084).",
          "Email tiếp nhận hỗ trợ, hóa đơn điện tử & báo giá: info@freshbag.com.vn.",
          "Địa chỉ công ty: 367 Nguyễn Văn Luông, Phường Phú Lâm, TP. Hồ Chí Minh.",
        ],
      },
      {
        id: "gio-lam-viec-va-tham-quan",
        heading: "Giờ làm việc & tiếp nhận phản hồi",
        paragraphs: [
          "Giờ mở cửa: 8:00–17:30, Thứ 2–Thứ 7 (trừ các ngày lễ, Tết theo quy định).",
          "Với các phản ánh, yêu cầu đổi trả, bảo hành hoặc khiếu nại gửi qua hotline, Zalo hoặc email, Freshbag thực hiện phản hồi ban đầu trong vòng 1 ngày làm việc.",
          "Trường hợp quý khách cần đến trực tiếp địa chỉ 367 Nguyễn Văn Luông, Phường Phú Lâm, TP. Hồ Chí Minh để gửi hàng đổi trả/bảo hành hoặc trao đổi trực tiếp, vui lòng gọi hoặc nhắn Zalo 093 268 2008 trước khi ghé để bộ phận phụ trách sắp xếp tiếp đón thuận tiện.",
        ],
        needsOwnerInput: true,
        ownerInputNote:
          "Cần chủ shop xác nhận hình thức tiếp đón khách mua trực tiếp tại 367 Nguyễn Văn Luông và bổ sung MST / người đại diện pháp luật.",
      },
      {
        id: "ho-tro-nhanh-theo-nhu-cau",
        heading: "Tra cứu nhanh trước khi liên hệ",
        paragraphs: [
          "Nếu bạn đã đặt hàng trên website freshbag.com.vn và cần kiểm tra tiến độ xử lý, bạn có thể nhập Mã đơn hàng cùng Số điện thoại tại trang Tra cứu đơn hàng. Với nhu cầu đặt quà tặng công ty, vui lòng gửi yêu cầu trực tiếp tại trang Bán hàng doanh nghiệp.",
        ],
      },
    ],
    relatedLinks: [
      {
        label: "Tra cứu đơn hàng trực tuyến",
        href: "/tra-cuu-don",
        description: "Kiểm tra trạng thái đơn hàng bằng mã đơn và số điện thoại.",
      },
      {
        label: "Trang Bán hàng doanh nghiệp (B2B)",
        href: "/ban-hang-doanh-nghiep",
        description: "Gửi yêu cầu báo giá balo, túi xách in logo nhanh qua Zalo/Email.",
      },
      {
        label: "Chính sách đổi trả 7 ngày",
        href: "/chinh-sach-doi-tra",
        description: "Điều kiện đổi trả, hoàn tiền và tiếp nhận khiếu nại.",
      },
      {
        label: "Chính sách bảo hành 6 tháng",
        href: "/chinh-sach-bao-hanh",
        description: "Hướng dẫn gửi sản phẩm cần bảo hành lỗi nhà sản xuất.",
      },
    ],
  },

  "chinh-sach-bao-hanh": {
    slug: "chinh-sach-bao-hanh",
    canonicalPath: "/chinh-sach-bao-hanh",
    breadcrumbLabel: "Chính sách bảo hành",
    eyebrow: "CHÍNH SÁCH HẬU MÃI",
    metaTitle: "Chính sách bảo hành balo, túi xách, vali",
    metaDescription:
      "Chính sách bảo hành 6 tháng đối với lỗi kỹ thuật từ nhà sản xuất tại Freshbag. Liên hệ hotline 093 268 2008 hoặc gửi về 367 Nguyễn Văn Luông, Phú Lâm, TP.HCM.",
    h1: "Chính sách bảo hành sản phẩm tại Freshbag",
    updatedAt: "26/11/2026",
    updatedAtIso: "2026-11-26",
    answerFirst:
      "Các sản phẩm balo, túi xách và vali mua tại Freshbag được áp dụng bảo hành 6 tháng đối với lỗi kỹ thuật từ nhà sản xuất. Khi cần bảo hành, quý khách liên hệ hotline/Zalo 093 268 2008 hoặc email info@freshbag.com.vn; Freshbag phản hồi ban đầu trong 1 ngày làm việc và tiếp nhận sản phẩm tại 367 Nguyễn Văn Luông, Phường Phú Lâm, TP. Hồ Chí Minh.",
    needsOwnerReview: true,
    ownerReviewSummary:
      "Cần chủ shop bổ sung danh mục linh kiện bảo hành chi tiết, trường hợp từ chối, thời gian hoàn tất sửa chữa và quy định phí vận chuyển bảo hành.",
    sections: [
      {
        id: "thoi-han-va-pham-vi-bao-hanh",
        heading: "Thời hạn và nguyên tắc bảo hành chung",
        paragraphs: [
          "Thời hạn bảo hành tiêu chuẩn đối với các sản phẩm balo, cặp sách, túi xách và vali tại Freshbag là 6 tháng kể từ ngày mua hàng/nhận hàng đối với các lỗi kỹ thuật phát sinh từ nhà sản xuất.",
          "Chính sách được thực hiện phù hợp với Luật Bảo vệ quyền lợi người tiêu dùng số 19/2023/QH15, Luật Thương mại điện tử số 122/2025/QH15 và Nghị định 248/2026/NĐ-CP.",
        ],
        bullets: [
          "Thời hạn bảo hành: 6 tháng.",
          "Phạm vi áp dụng: lỗi kỹ thuật từ nhà sản xuất trên balo, cặp sách, túi xách, vali do CÔNG TY TNHH SX TM DV FRESHBAG cung cấp.",
          "Thông tin đối chiếu: mã đơn hàng hoặc số điện thoại đặt mua trên website freshbag.com.vn.",
        ],
      },
      {
        id: "hang-muc-chi-tiet-va-tu-choi",
        heading: "Hạng mục chi tiết và trường hợp ngoài phạm vi bảo hành",
        paragraphs: [
          "Danh mục chi tiết từng bộ phận được bảo hành (như đường chỉ may, khóa kéo, quai đeo, bánh xe, cần kéo vali), các trường hợp từ chối bảo hành (rách do vật nhọn, quá tải, tác động ngoại lực, hao mòn tự nhiên) và quy định chi phí vận chuyển bảo hành hai chiều: " +
            PENDING_OWNER_MESSAGE,
        ],
        needsOwnerInput: true,
        ownerInputNote:
          "Cần chủ shop chốt danh mục bộ phận được bảo hành, trường hợp từ chối và bên chịu phí vận chuyển bảo hành.",
      },
      {
        id: "quy-trinh-tiep-nhan-bao-hanh",
        heading: "Quy trình gửi yêu cầu bảo hành tại Freshbag",
        paragraphs: [
          "Để được kiểm tra tình trạng sản phẩm và hướng dẫn xử lý kịp thời, quý khách vui lòng thực hiện theo 3 bước sau:",
        ],
        orderedSteps: [
          "Liên hệ Hotline/Zalo 093 268 2008 hoặc email info@freshbag.com.vn, cung cấp mã đơn hàng/số điện thoại mua hàng kèm hình ảnh hoặc video thể hiện rõ lỗi sản phẩm.",
          "Freshbag phản hồi ban đầu trong vòng 1 ngày làm việc, đối chiếu thời hạn bảo hành 6 tháng và hướng dẫn phương án xử lý phù hợp trước khi quý khách gửi hàng.",
          "Gửi sản phẩm về hoặc mang trực tiếp (sau khi đã hẹn trước) tới địa chỉ: 367 Nguyễn Văn Luông, Phường Phú Lâm, TP. Hồ Chí Minh.",
        ],
      },
      {
        id: "thoi-gian-xu-ly-va-ho-tro",
        heading: "Thời gian xử lý bảo hành và hỗ trợ liên quan",
        paragraphs: [
          "Thời gian hoàn tất sửa chữa hoặc khắc phục bảo hành cụ thể theo từng nhóm lỗi: " +
            PENDING_OWNER_MESSAGE,
          "Nếu sản phẩm mới nhận gặp hư hỏng, sai mẫu, thiếu hàng hoặc giao nhầm trong vòng 7 ngày kể từ ngày nhận hàng, quý khách vui lòng xem thêm tại Chính sách đổi trả để được đổi trả và hoàn tiền nhanh chóng.",
        ],
        needsOwnerInput: true,
        ownerInputNote: "Cần chủ shop chốt thời gian hoàn tất bảo hành (ví dụ số ngày làm việc).",
      },
    ],
    relatedLinks: [
      {
        label: "Xem Chính sách đổi trả 7 ngày",
        href: "/chinh-sach-doi-tra",
        description: "Áp dụng khi sản phẩm lỗi, giao nhầm, thiếu hàng hoặc khách đổi ý trong 7 ngày.",
      },
      {
        label: "Xem Chính sách vận chuyển",
        href: "/chinh-sach-van-chuyen",
        description: "Thông tin giao hàng toàn quốc qua SPX Express và kiểm tra kiện hàng.",
      },
      {
        label: "Tra cứu đơn hàng đã mua",
        href: "/tra-cuu-don",
        description: "Kiểm tra lại mã đơn hàng và thông tin sản phẩm đã đặt.",
      },
      {
        label: "Liên hệ bộ phận CSKH Freshbag",
        href: "/lien-he",
        description: "Địa chỉ 367 Nguyễn Văn Luông và hotline/Zalo hỗ trợ.",
      },
    ],
  },

  "chinh-sach-doi-tra": {
    slug: "chinh-sach-doi-tra",
    canonicalPath: "/chinh-sach-doi-tra",
    breadcrumbLabel: "Chính sách đổi trả",
    eyebrow: "ĐỔI TRẢ, HOÀN TIỀN & KHIẾU NẠI",
    metaTitle: "Chính sách đổi trả & hoàn tiền Freshbag",
    metaDescription:
      "Đổi trả trong 7 ngày từ khi nhận hàng tại Freshbag: lỗi do shop miễn phí vận chuyển, đổi ý chịu phí 2 chiều. Hoàn tiền chuyển khoản trong 3–5 ngày làm việc.",
    h1: "Chính sách đổi trả, hoàn tiền & khiếu nại",
    updatedAt: "26/11/2026",
    updatedAtIso: "2026-11-26",
    answerFirst:
      "Freshbag hỗ trợ đổi hoặc trả hàng trong vòng 7 ngày kể từ ngày nhận hàng. Nếu lỗi do Freshbag (hư hỏng, sai mẫu, thiếu hàng, giao nhầm), shop chịu toàn bộ phí vận chuyển đổi/trả; nếu bạn đổi ý, hàng cần còn nguyên tem nhãn, chưa qua sử dụng và bạn chịu phí vận chuyển 2 chiều. Hoàn tiền chuyển khoản trong 3–5 ngày làm việc sau khi nhận lại và kiểm tra hàng; phản hồi khiếu nại trong 1 ngày làm việc.",
    needsOwnerReview: false,
    sections: [
      {
        id: "pham-vi-va-can-cu-phap-ly",
        heading: "Phạm vi áp dụng và căn cứ pháp lý",
        paragraphs: [
          "Chính sách này áp dụng cho mọi đơn hàng đặt trên website freshbag.com.vn của CÔNG TY TNHH SX TM DV FRESHBAG (địa chỉ: 367 Nguyễn Văn Luông, Phường Phú Lâm, TP. Hồ Chí Minh).",
          "Điều khoản được xây dựng theo Luật Bảo vệ quyền lợi người tiêu dùng số 19/2023/QH15, Luật Thương mại điện tử số 122/2025/QH15 và Nghị định 248/2026/NĐ-CP. Những nội dung chưa nêu tại đây được thực hiện theo quy định pháp luật hiện hành về bảo vệ quyền lợi người tiêu dùng và thương mại điện tử.",
        ],
      },
      {
        id: "dieu-kien-doi-tra",
        heading: "Điều kiện đổi trả hàng trong 7 ngày",
        paragraphs: [
          "Bạn có thể yêu cầu đổi hoặc trả hàng trong vòng 7 ngày kể từ ngày nhận hàng trong các trường hợp sau:",
        ],
        bullets: [
          "Lỗi do Freshbag: sản phẩm hư hỏng khi giao nhận, sai mẫu, thiếu hàng hoặc giao nhầm sản phẩm.",
          "Bạn đổi ý: sản phẩm phải còn nguyên tem, nhãn, chưa qua sử dụng, còn đầy đủ phụ kiện, quà tặng kèm (nếu có) và bao bì ở tình trạng như khi nhận.",
          "Chứng cứ xác minh: bạn vui lòng cung cấp video mở hàng liên tục (thấy rõ mã vận đơn và sản phẩm bên trong) và ảnh chụp rõ sản phẩm, tem nhãn, mã vận đơn. Với trường hợp thiếu hàng hoặc giao nhầm, video mở hàng liên tục là căn cứ quan trọng nhất.",
          "Trường hợp từ chối đổi trả: yêu cầu gửi quá 7 ngày kể từ ngày nhận hàng; sản phẩm bị hư hỏng do sử dụng hoặc bảo quản không đúng; hoặc sản phẩm không còn nguyên tem nhãn, đã qua sử dụng đối với trường hợp đổi ý. Khi từ chối, Freshbag sẽ giải thích rõ lý do cho bạn.",
        ],
        tables: [
          {
            caption: "Tóm tắt quyền lợi và chi phí vận chuyển đổi trả theo lý do",
            headers: ["Trường hợp", "Điều kiện chính", "Phí vận chuyển đổi/trả"],
            rows: [
              [
                "Lỗi do Freshbag (hư hỏng, sai mẫu, thiếu hàng, giao nhầm)",
                "Trong 7 ngày kể từ ngày nhận hàng; có video mở hàng/ảnh chứng cứ.",
                "Freshbag chịu toàn bộ phí vận chuyển đổi, trả (hoặc gửi bù/hoàn tiền phần thiếu không cần gửi lại hàng).",
              ],
              [
                "Khách hàng đổi ý",
                "Trong 7 ngày kể từ ngày nhận hàng; hàng còn nguyên tem nhãn, chưa sử dụng, đủ phụ kiện/quà tặng kèm.",
                "Khách hàng chịu phí vận chuyển 2 chiều (chiều gửi trả và chiều gửi hàng đổi, nếu có).",
              ],
            ],
          },
        ],
      },
      {
        id: "quy-trinh-va-chi-phi-doi-tra",
        heading: "Quy trình và chi phí đổi trả",
        paragraphs: [
          "Để quá trình đổi hoặc trả hàng diễn ra thuận tiện, bạn vui lòng thực hiện theo 4 bước sau:",
        ],
        orderedSteps: [
          "Gửi yêu cầu qua Hotline/Zalo 093 268 2008 hoặc email info@freshbag.com.vn, kèm mã đơn hàng, lý do và video/ảnh chứng cứ.",
          "Freshbag phản hồi trong vòng 1 ngày làm việc, xác nhận yêu cầu có đủ điều kiện và hướng dẫn cách đóng gói, gửi hàng về 367 Nguyễn Văn Luông, Phường Phú Lâm, TP. Hồ Chí Minh.",
          "Bạn đóng gói sản phẩm cẩn thận và gửi lại theo hướng dẫn của CSKH.",
          "Freshbag kiểm tra hàng nhận lại, sau đó gửi sản phẩm thay thế hoặc tiến hành hoàn tiền theo mục Hoàn tiền.",
        ],
        subsections: [
          {
            heading: "Chi phí vận chuyển đổi trả & xử lý đơn thiếu hàng",
            bullets: [
              "Lỗi do Freshbag (hư hỏng, sai mẫu, thiếu hàng, giao nhầm): Freshbag chịu toàn bộ phí vận chuyển đổi, trả.",
              "Bạn đổi ý: bạn chịu phí vận chuyển 2 chiều (chiều gửi trả và chiều gửi hàng đổi, nếu có).",
              "Với đơn thiếu hàng: Freshbag gửi bù phần còn thiếu hoặc hoàn tiền phần tương ứng theo lựa chọn của bạn mà không cần bạn gửi lại hàng.",
            ],
          },
        ],
      },
      {
        id: "hoan-tien",
        heading: "Phương thức và thời hạn hoàn tiền",
        paragraphs: [
          "Khi yêu cầu trả hàng được chấp nhận, Freshbag hoàn tiền bằng hình thức chuyển khoản ngân hàng:",
        ],
        bullets: [
          "Đơn thanh toán khi nhận hàng (COD): hoàn vào tài khoản ngân hàng do bạn cung cấp (tên chủ tài khoản, số tài khoản, ngân hàng).",
          "Đơn thanh toán chuyển khoản: hoàn vào tài khoản đã dùng để thanh toán.",
          "Thời hạn hoàn tiền: trong vòng 3 đến 5 ngày làm việc kể từ khi Freshbag nhận lại và kiểm tra hàng hoàn trả. Với trường hợp không cần gửi lại hàng (ví dụ thiếu hàng), thời hạn tính từ khi Freshbag xác nhận yêu cầu.",
          "Số tiền hoàn gồm giá trị sản phẩm trả lại; phí giao hàng ban đầu được hoàn nếu lỗi do Freshbag. Với trường hợp đổi ý, phí vận chuyển 2 chiều do bạn chịu.",
          "Freshbag sẽ gửi xác nhận khi đã chuyển tiền; thời gian tiền về tài khoản có thể phụ thuộc vào ngân hàng của bạn. Nếu đơn đã xuất hóa đơn điện tử (MISA), Freshbag sẽ điều chỉnh hóa đơn theo quy định pháp luật về hóa đơn.",
        ],
      },
      {
        id: "tiep-nhan-va-giai-quyet-khieu-nai",
        heading: "Tiếp nhận và giải quyết khiếu nại",
        paragraphs: [
          "Bạn có thể gửi phản ánh, yêu cầu hoặc khiếu nại về sản phẩm, giao hàng, đổi trả, hoàn tiền qua các kênh trực tuyến và hỗ trợ của Freshbag gồm Zalo (zalo.me/0932682008), email info@freshbag.com.vn hoặc hotline 093 268 2008. Vui lòng nêu mã đơn hàng, nội dung sự việc và đính kèm hình ảnh, video nếu có.",
        ],
        bullets: [
          "Freshbag phản hồi ban đầu trong vòng 1 ngày làm việc kể từ khi nhận được khiếu nại.",
          "Freshbag xác minh với bộ phận kho, đơn vị vận chuyển SPX Express hoặc đối tác liên quan và đề xuất phương án xử lý.",
          "Với các vấn đề như giao nhầm, thiếu hàng, hư hỏng, Freshbag ưu tiên xử lý ngay theo quy định đổi trả và hoàn tiền nêu trên.",
          "Freshbag ưu tiên thương lượng, hòa giải để bảo vệ quyền lợi của bạn. Nếu chưa đạt được thỏa thuận, bạn có quyền yêu cầu cơ quan, tổ chức có thẩm quyền về bảo vệ quyền lợi người tiêu dùng hỗ trợ, hoặc giải quyết theo trọng tài, tòa án theo quy định pháp luật.",
        ],
      },
    ],
    relatedLinks: [
      {
        label: "Chính sách bảo hành 6 tháng",
        href: "/chinh-sach-bao-hanh",
        description: "Áp dụng cho sản phẩm phát sinh lỗi kỹ thuật NSX trong 6 tháng.",
      },
      {
        label: "Chính sách vận chuyển SPX Express",
        href: "/chinh-sach-van-chuyen",
        description: "Quy định giao nhận toàn quốc và khuyến khích quay video mở hàng.",
      },
      {
        label: "Tra cứu đơn hàng",
        href: "/tra-cuu-don",
        description: "Xem lại mã đơn hàng và thông tin sản phẩm đã đặt mua.",
      },
      {
        label: "Liên hệ CSKH Freshbag",
        href: "/lien-he",
        description: "Thông tin địa chỉ tiếp nhận và hotline/Zalo hỗ trợ.",
      },
    ],
  },

  "chinh-sach-van-chuyen": {
    slug: "chinh-sach-van-chuyen",
    canonicalPath: "/chinh-sach-van-chuyen",
    breadcrumbLabel: "Chính sách vận chuyển",
    eyebrow: "GIAO NHẬN TOÀN QUỐC",
    metaTitle: "Chính sách vận chuyển SPX Express Freshbag",
    metaDescription:
      "Freshbag giao hàng toàn quốc qua SPX Express. Phí vận chuyển tính theo biểu phí SPX tại bước thanh toán trước khi đặt hàng, hỗ trợ theo dõi đơn và giải đáp.",
    h1: "Chính sách vận chuyển – giao nhận tại Freshbag",
    updatedAt: "26/11/2026",
    updatedAtIso: "2026-11-26",
    answerFirst:
      "Freshbag giao hàng trên toàn quốc thông qua đơn vị vận chuyển SPX Express. Phí giao hàng được thu theo biểu phí SPX Express, tính và hiển thị rõ tại bước thanh toán trước khi bạn xác nhận đặt hàng. Thời gian giao dự kiến phụ thuộc vào SPX Express và khu vực nhận hàng; khi nhận hàng, bạn nên kiểm tra tình trạng bên ngoài kiện hàng và quay video liên tục quá trình mở hàng.",
    needsOwnerReview: true,
    ownerReviewSummary:
      "Cần chủ shop xác nhận quy định đồng kiểm trực tiếp với bưu tá (nếu áp dụng) khi kết nối đầy đủ API SPX Express.",
    sections: [
      {
        id: "pham-vi-va-phi-giao-hang",
        heading: "Phạm vi giao hàng và phí vận chuyển SPX Express",
        paragraphs: [
          "Freshbag giao hàng trên toàn quốc thông qua đơn vị vận chuyển SPX Express cho các đơn hàng đặt trên website freshbag.com.vn.",
          "Phí giao hàng được thu theo biểu phí SPX Express và được hiển thị riêng, cộng vào tổng tiền đơn hàng ở bước thanh toán trước khi bạn xác nhận đặt hàng, giúp bạn luôn biết rõ số tiền phải trả.",
          "Để đơn hàng được giao thuận lợi, bạn vui lòng cung cấp chính xác họ tên người nhận, số điện thoại và địa chỉ giao hàng đầy đủ. Nếu cần thay đổi thông tin nhận hàng sau khi đặt, hãy liên hệ ngay hotline/Zalo 093 268 2008 hoặc email info@freshbag.com.vn để Freshbag hỗ trợ cập nhật nếu đơn chưa bàn giao cho đơn vị vận chuyển. Trường hợp thông tin sai dẫn đến giao không thành công, Freshbag sẽ liên hệ bạn để thống nhất cách xử lý.",
        ],
      },
      {
        id: "thoi-gian-giao-hang-va-theo-doi",
        heading: "Thời gian giao hàng và theo dõi đơn",
        paragraphs: [
          "Freshbag không cam kết số ngày giao hàng cố định. Thời gian giao dự kiến phụ thuộc vào đơn vị vận chuyển SPX Express và khu vực nhận hàng, được thông báo cho bạn khi đặt hàng hoặc qua các kênh liên hệ của Freshbag.",
          "Thông tin hành trình đơn do đơn vị vận chuyển cập nhật. Bạn có thể kiểm tra trạng thái đơn tại trang Tra cứu đơn hàng (freshbag.com.vn/tra-cuu-don); nếu thấy đơn chậm hoặc trạng thái bất thường, hãy liên hệ hotline/Zalo 093 268 2008 để được kiểm tra với SPX Express.",
          "Thời gian giao có thể kéo dài do thiên tai, dịch bệnh, thời tiết hoặc sự kiện bất khả kháng; Freshbag sẽ thông báo để bạn nắm được.",
        ],
      },
      {
        id: "kiem-tra-kien-hang-khi-nhan",
        heading: "Kiểm tra kiện hàng khi nhận và chứng cứ mở hàng",
        paragraphs: [
          "Khi nhận hàng từ nhân viên giao nhận, bạn nên kiểm tra tình trạng bên ngoài kiện hàng (niêm phong, rách vỡ, móp méo, đúng thông tin người nhận).",
          "Để thuận tiện cho việc đổi trả, hoàn tiền khi có sự cố như hư hỏng, thiếu hàng hoặc giao nhầm, Freshbag khuyến khích bạn quay video liên tục quá trình mở hàng, thấy rõ mã vận đơn và sản phẩm bên trong.",
        ],
        needsOwnerInput: true,
        ownerInputNote:
          "Quy định đồng kiểm chi tiết theo từng tuyến vận chuyển SPX đang cập nhật; hiện ưu tiên kiểm tra ngoại quan kiện hàng và quay video mở hàng.",
      },
      {
        id: "trach-nhiem-chung-tu-van-chuyen",
        heading: "Trách nhiệm cung cấp thông tin và chứng từ trong quá trình giao nhận",
        paragraphs: [
          "Thực hiện theo Luật Thương mại điện tử số 122/2025/QH15, Nghị định 248/2026/NĐ-CP và Luật Bảo vệ quyền lợi người tiêu dùng số 19/2023/QH15, Freshbag và đơn vị vận chuyển thực hiện minh bạch trách nhiệm giao nhận:",
        ],
        bullets: [
          "Cung cấp thông tin về phương thức giao hàng, đơn vị vận chuyển, phí giao hàng và thời hạn ước tính trước khi khách hàng xác nhận đặt hàng.",
          "Bảo mật thông tin người nhận và an toàn kiện hàng trong suốt quá trình vận chuyển; không tự ý bóc mở, tráo đổi hàng hóa hoặc chứng từ trừ trường hợp pháp luật quy định.",
          "Lưu giữ và cung cấp thông tin vận đơn, chứng từ giao nhận để đối chiếu khi khách hàng tra cứu hoặc khiếu nại.",
          "Khi giao không thành công, đơn vị vận chuyển hoặc Freshbag thông báo cho khách hàng để thống nhất hướng xử lý hoặc hoàn trả hàng.",
        ],
      },
    ],
    relatedLinks: [
      {
        label: "Chính sách thanh toán (COD & chuyển khoản)",
        href: "/chinh-sach-thanh-toan",
        description: "Giá đã gồm VAT, thanh toán COD/chuyển khoản và hóa đơn điện tử MISA.",
      },
      {
        label: "Chính sách đổi trả 7 ngày",
        href: "/chinh-sach-doi-tra",
        description: "Hướng dẫn xử lý nếu hàng giao sai, thiếu hoặc hư hỏng.",
      },
      {
        label: "Tra cứu đơn hàng",
        href: "/tra-cuu-don",
        description: "Theo dõi trạng thái đơn đã đặt bằng mã đơn và SĐT.",
      },
      {
        label: "Mua sắm sản phẩm Freshbag",
        href: "/san-pham",
        description: "Chọn balo, túi xách hoặc vali phù hợp nhu cầu của bạn.",
      },
    ],
  },

  "chinh-sach-thanh-toan": {
    slug: "chinh-sach-thanh-toan",
    canonicalPath: "/chinh-sach-thanh-toan",
    breadcrumbLabel: "Chính sách thanh toán",
    eyebrow: "GIÁ BÁN, THANH TOÁN & HÓA ĐƠN",
    metaTitle: "Chính sách thanh toán COD & chuyển khoản",
    metaDescription:
      "Thanh toán tại website Freshbag qua COD hoặc chuyển khoản VietinBank. Giá đã gồm VAT, xuất hóa đơn điện tử MISA theo yêu cầu, đối soát đơn hàng nhanh chóng.",
    h1: "Chính sách thanh toán & hóa đơn tại Freshbag",
    updatedAt: "26/11/2026",
    updatedAtIso: "2026-11-26",
    answerFirst:
      "Giá sản phẩm hiển thị trên website freshbag.com.vn đã bao gồm thuế giá trị gia tăng (VAT); phí giao hàng theo biểu phí SPX Express được hiển thị riêng trước khi đặt hàng. Freshbag hỗ trợ 2 phương thức thanh toán là thanh toán khi nhận hàng (COD) và chuyển khoản ngân hàng VietinBank (STK 112003063688, chủ TK CTY TNHH SX TM DV FRESHBAG, nội dung là mã đơn hàng), kèm xuất hóa đơn điện tử qua MISA khi khách hàng yêu cầu.",
    needsOwnerReview: false,
    sections: [
      {
        id: "gia-ban-va-thue-vat",
        heading: "Giá bán, thuế VAT và hiển thị tổng tiền",
        paragraphs: [
          "Giá sản phẩm hiển thị trên website freshbag.com.vn là giá bán đã bao gồm thuế giá trị gia tăng (VAT).",
          "Phí giao hàng (theo biểu phí SPX Express) được hiển thị riêng và cộng vào tổng tiền đơn hàng ở bước thanh toán trước khi bạn xác nhận đặt hàng, giúp bạn luôn biết rõ số tiền phải trả.",
          "Chính sách thanh toán được xây dựng phù hợp Luật Bảo vệ quyền lợi người tiêu dùng số 19/2023/QH15, Luật Thương mại điện tử số 122/2025/QH15 và Nghị định 248/2026/NĐ-CP.",
        ],
      },
      {
        id: "phuong-thuc-thanh-toan-hien-co",
        heading: "Hai phương thức thanh toán chính thức",
        paragraphs: [
          "Khi đặt hàng trên website freshbag.com.vn, quý khách có thể lựa chọn một trong hai phương thức thanh toán sau:",
        ],
        bullets: [
          "Thanh toán khi nhận hàng (COD): bạn trả tiền mặt trực tiếp cho nhân viên giao hàng SPX Express khi nhận đơn hàng.",
          "Chuyển khoản ngân hàng: bạn chuyển khoản theo thông tin tài khoản hiển thị ở bước thanh toán và trang xác nhận đơn hàng. Vui lòng ghi đúng nội dung chuyển khoản là mã đơn hàng để hệ thống (qua ngân hàng / SePay) đối soát và xác nhận đơn nhanh.",
        ],
      },
      {
        id: "tai-khoan-ngan-hang",
        heading: "Thông tin tài khoản chuyển khoản chính thức",
        paragraphs: [
          "Ngân hàng: " + brandFacts.bank.bank_name,
          "Số tài khoản: " + brandFacts.bank.account_number,
          "Chủ tài khoản: " + brandFacts.bank.account_name,
          "Nội dung chuyển khoản: mã đơn hàng (hiển thị ngay sau khi bạn bấm Đặt hàng).",
        ],
      },
      {
        id: "hoa-don-dien-tu-misa",
        heading: "Xuất hóa đơn điện tử (MISA) & đơn hàng doanh nghiệp",
        paragraphs: [
          "Freshbag xuất hóa đơn điện tử qua hệ thống MISA khi khách hàng có yêu cầu.",
          "Nếu cần xuất hóa đơn ghi thông tin cá nhân hoặc doanh nghiệp, quý khách vui lòng cung cấp tên người mua hoặc tên đơn vị, mã số thuế, địa chỉ và email nhận hóa đơn trong phần ghi chú khi đặt hàng hoặc nhắn qua hotline/Zalo 093 268 2008, email info@freshbag.com.vn.",
          "Đối với khách hàng doanh nghiệp đặt hàng số lượng lớn hoặc in/thêu logo, vui lòng trao đổi điều khoản thanh toán, đặt cọc và hợp đồng qua Zalo B2B 0906 818 084.",
        ],
      },
      {
        id: "luu-y-giao-dich",
        heading: "Lưu ý an toàn khi thanh toán đơn hàng",
        paragraphs: [
          "Để bảo vệ quyền lợi khi giao dịch trực tuyến, quý khách lưu ý chỉ thanh toán theo đúng tổng tiền và mã đơn hàng hiển thị trên hệ thống Freshbag.",
        ],
        bullets: [
          "Lưu lại mã đơn hàng (dạng FB...) sau khi đặt để dùng làm nội dung chuyển khoản và tra cứu nhanh tại trang Tra cứu đơn hàng.",
          "Chỉ chuyển khoản vào số tài khoản VietinBank mang tên CTY TNHH SX TM DV FRESHBAG nêu trên; liên hệ ngay hotline 093 268 2008 hoặc email info@freshbag.com.vn nếu cần xác minh.",
          "Quy định hoàn tiền (khi đơn hủy/trả hàng hợp lệ) được thực hiện bằng chuyển khoản trong 3–5 ngày làm việc theo Chính sách đổi trả.",
        ],
      },
    ],
    relatedLinks: [
      {
        label: "Chính sách vận chuyển SPX Express",
        href: "/chinh-sach-van-chuyen",
        description: "Thông tin giao hàng toàn quốc và phí hiển thị ở bước thanh toán.",
      },
      {
        label: "Chính sách đổi trả & hoàn tiền",
        href: "/chinh-sach-doi-tra",
        description: "Quy định hoàn tiền chuyển khoản trong 3–5 ngày làm việc.",
      },
      {
        label: "Tra cứu đơn hàng",
        href: "/tra-cuu-don",
        description: "Kiểm tra tổng tiền và trạng thái xử lý đơn hàng đã đặt.",
      },
      {
        label: "Đặt hàng doanh nghiệp (B2B)",
        href: "/ban-hang-doanh-nghiep",
        description: "Liên hệ nhận báo giá và tư vấn thanh toán cho đơn B2B.",
      },
    ],
  },

  "chinh-sach-bao-mat": {
    slug: "chinh-sach-bao-mat",
    canonicalPath: "/chinh-sach-bao-mat",
    breadcrumbLabel: "Chính sách bảo mật",
    eyebrow: "BẢO VỆ DỮ LIỆU CÁ NHÂN",
    metaTitle: "Chính sách bảo mật dữ liệu cá nhân",
    metaDescription:
      "Chính sách bảo mật dữ liệu cá nhân tại freshbag.com.vn theo Luật 91/2025/QH15 và NĐ 356/2025/NĐ-CP: mục đích thu thập, lưu trữ và quyền của khách hàng.",
    h1: "Chính sách bảo mật và xử lý dữ liệu cá nhân",
    updatedAt: "26/11/2026",
    updatedAtIso: "2026-11-26",
    answerFirst:
      "Freshbag thu thập và xử lý dữ liệu cá nhân cần thiết khi bạn truy cập, đặt hàng trên website freshbag.com.vn (họ tên, số điện thoại, địa chỉ, email nếu có, thông tin đơn hàng, hóa đơn khi yêu cầu) theo Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15 và Nghị định 356/2025/NĐ-CP. Giỏ hàng và sản phẩm đã xem lưu trên localStorage thiết bị của bạn; đo lường bằng PostHog không dùng cookie; Freshbag cam kết không bán dữ liệu cá nhân.",
    needsOwnerReview: true,
    ownerReviewSummary:
      "Cần chủ shop bổ sung mã số thuế, người đại diện pháp luật và rà soát thời hạn xử lý riêng cho yêu cầu xem/chỉnh sửa dữ liệu nếu cần.",
    sections: [
      {
        id: "gioi-thieu-va-pham-vi-ap-dung",
        heading: "Giới thiệu và phạm vi áp dụng",
        paragraphs: [
          "Chính sách này giải thích cách Freshbag thu thập, sử dụng, chia sẻ, lưu trữ và bảo vệ dữ liệu cá nhân của bạn khi bạn truy cập, đặt hàng, tra cứu đơn hàng trên website freshbag.com.vn và liên hệ với Freshbag qua hotline, email hoặc Zalo.",
          "Bên kiểm soát và xử lý dữ liệu: CÔNG TY TNHH SX TM DV FRESHBAG (thương hiệu Freshbag), địa chỉ 367 Nguyễn Văn Luông, Phường Phú Lâm, TP. Hồ Chí Minh. Liên hệ về dữ liệu cá nhân qua hotline 093 268 2008, email info@freshbag.com.vn hoặc Zalo zalo.me/0932682008.",
          "Chính sách được xây dựng theo Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15, Nghị định 356/2025/NĐ-CP hướng dẫn thi hành Luật này, Luật Bảo vệ quyền lợi người tiêu dùng số 19/2023/QH15, Luật Thương mại điện tử số 122/2025/QH15 và Nghị định 248/2026/NĐ-CP. Khi bạn tiếp tục sử dụng website và đặt hàng, bạn đã đọc và hiểu chính sách này; nếu chưa đồng ý với nội dung nào, bạn có thể dừng sử dụng hoặc liên hệ Freshbag để được giải thích thêm.",
        ],
      },
      {
        id: "du-lieu-ca-nhan-thu-thap",
        heading: "Dữ liệu cá nhân Freshbag thu thập",
        paragraphs: [
          "Freshbag chỉ thu thập những dữ liệu cần thiết để xử lý đơn hàng và hỗ trợ bạn, gồm:",
        ],
        bullets: [
          "Thông tin đặt hàng trên website: họ tên, số điện thoại, địa chỉ giao hàng (tỉnh/thành phố, quận/huyện, phường/xã, địa chỉ chi tiết), email (nếu bạn cung cấp) và ghi chú đơn hàng.",
          "Lịch sử đơn hàng và tra cứu đơn: mã đơn hàng, sản phẩm, phân loại, số lượng, giá trị, phương thức thanh toán, trạng thái giao hàng, đổi trả.",
          "Dữ liệu giỏ hàng và sản phẩm đã xem trên trình duyệt: lưu cục bộ ngay trên thiết bị của bạn bằng localStorage (không chứa thông tin định danh cá nhân ở danh sách sản phẩm đã xem); cùng nhật ký kỹ thuật truy cập hệ thống.",
          "Nội dung trao đổi hỗ trợ khi bạn chủ động liên hệ Freshbag qua hotline, email hoặc Zalo (biểu mẫu tư vấn B2B trên website chỉ ghép nội dung trên trình duyệt để bạn gửi đi, không tự lưu vào cơ sở dữ liệu web).",
          "Thông tin xuất hóa đơn điện tử khi bạn yêu cầu: tên người mua hoặc đơn vị, mã số thuế, địa chỉ, email nhận hóa đơn.",
          "Thông tin tài khoản ngân hàng nhận hoàn tiền (tên chủ tài khoản, số tài khoản, ngân hàng), chỉ khi bạn cần hoàn tiền cho đơn thanh toán COD.",
          "Freshbag không thu thập dữ liệu cá nhân nhạy cảm (như sức khỏe, sinh trắc học, tôn giáo, vị trí định vị chính xác). Vui lòng không gửi các thông tin này khi liên hệ.",
        ],
      },
      {
        id: "muc-dich-xu-ly-du-lieu",
        heading: "Mục đích xử lý dữ liệu",
        paragraphs: [
          "Freshbag sử dụng dữ liệu của bạn cho các mục đích sau:",
        ],
        bullets: [
          "Xác nhận, xử lý, đóng gói và giao đơn hàng; liên hệ qua điện thoại, email hoặc Zalo khi cần xác minh địa chỉ hoặc thời gian nhận hàng.",
          "Thông báo trạng thái đơn hàng, giao hàng, đổi trả, bảo hành và hoàn tiền.",
          "Tiếp nhận và giải quyết yêu cầu đổi trả, hoàn tiền, phản ánh, khiếu nại.",
          "Xuất hóa đơn điện tử (qua MISA) và thực hiện nghĩa vụ kế toán, thuế theo quy định pháp luật.",
          "Đo lường lượt truy cập và cải thiện trải nghiệm website ở mức tổng hợp qua PostHog không sử dụng cookie; bảo đảm an toàn hệ thống, phòng chống gian lận, đơn hàng ảo.",
          "Thực hiện yêu cầu của cơ quan nhà nước có thẩm quyền theo quy định pháp luật.",
        ],
      },
      {
        id: "su-dong-y-va-co-so-xu-ly",
        heading: "Sự đồng ý và cơ sở xử lý dữ liệu",
        paragraphs: [
          "Freshbag xử lý dữ liệu cá nhân của bạn trên cơ sở sự đồng ý tự nguyện, rõ ràng khi bạn chủ động cung cấp thông tin đặt hàng hoặc liên hệ hỗ trợ trên website, và bạn có thể rút lại bất cứ lúc nào theo hướng dẫn ở mục Quyền và thời hạn xử lý.",
          "Ngoài ra, trong một số trường hợp pháp luật cho phép, Freshbag có thể xử lý dữ liệu mà không cần sự đồng ý, chẳng hạn để thực hiện nghĩa vụ hợp đồng mua bán với bạn, thực hiện nghĩa vụ kế toán, thuế hoặc theo yêu cầu của cơ quan nhà nước có thẩm quyền theo quy định pháp luật về bảo vệ dữ liệu cá nhân.",
          "Lưu ý: việc rút lại đồng ý không ảnh hưởng đến tính hợp pháp của việc xử lý đã thực hiện trước đó. Nếu bạn rút lại đồng ý với những dữ liệu bắt buộc để giao hàng (họ tên, số điện thoại, địa chỉ), Freshbag có thể không tiếp tục xử lý được đơn hàng đang có.",
        ],
      },
      {
        id: "to-chuc-duoc-tiep-can-du-lieu",
        heading: "Tổ chức và bên xử lý được tiếp cận dữ liệu",
        paragraphs: [
          "Freshbag không bán, cho thuê hay trao đổi dữ liệu cá nhân của bạn. Dữ liệu chỉ được chia sẻ ở mức cần thiết với các bên sau:",
        ],
        bullets: [
          "Nhà cung cấp hạ tầng vận hành website và cơ sở dữ liệu: Cloudflare (mạng phân phối/ứng dụng web) và Supabase (cơ sở dữ liệu lưu trữ đơn hàng).",
          "Đơn vị vận chuyển SPX Express: nhận họ tên, số điện thoại, địa chỉ và thông tin đơn hàng để giao hàng.",
          "MISA: đơn vị cung cấp dịch vụ hóa đơn điện tử, nhận thông tin xuất hóa đơn khi bạn yêu cầu hoặc khi pháp luật yêu cầu.",
          "Ngân hàng và SePay: hỗ trợ đối soát, xác nhận giao dịch chuyển khoản ngân hàng theo mã đơn hàng.",
          "PostHog: công cụ đo lường truy cập website không sử dụng cookie (cookie-less).",
          "Nền tảng liên lạc Zalo (VNG): khi bạn chủ động nhắn tin trao đổi qua kênh Zalo CSKH hoặc Zalo B2B của Freshbag.",
          "Nhân sự của Freshbag được phân quyền xử lý đơn hàng, kế toán và chăm sóc khách hàng; cùng cơ quan nhà nước có thẩm quyền khi có yêu cầu theo quy định pháp luật.",
        ],
      },
      {
        id: "thoi-gian-luu-tru-du-lieu",
        heading: "Thời gian lưu trữ dữ liệu",
        paragraphs: [
          "Freshbag chỉ lưu dữ liệu trong thời gian cần thiết cho mục đích xử lý hoặc theo thời hạn pháp luật yêu cầu:",
        ],
        bullets: [
          "Dữ liệu trình duyệt (localStorage lưu giỏ hàng và sản phẩm đã xem): lưu trên thiết bị của bạn đến khi bạn xóa giỏ hàng, xóa lịch sử xem hoặc xóa dữ liệu trình duyệt.",
          "Nội dung webhook kỹ thuật từ đối tác: 30 ngày.",
          "Nội dung tin nhắn thông báo giao dịch đã gửi (nếu có): 90 ngày.",
          "Nhật ký truy cập dữ liệu cá nhân: 12 tháng.",
          "Thông tin liên hệ gắn với đơn hàng đã kết thúc: 120 tháng (10 năm), để phục vụ nghĩa vụ kế toán, thuế theo quy định pháp luật về kế toán.",
          "Bản ghi sự đồng ý và các yêu cầu về dữ liệu đã hoàn tất: 60 tháng, làm bằng chứng cho việc tuân thủ.",
        ],
      },
      {
        id: "bien-phap-bao-ve-du-lieu",
        heading: "Biện pháp bảo vệ dữ liệu",
        paragraphs: [
          "Freshbag áp dụng các biện pháp quản lý và kỹ thuật phù hợp để bảo vệ dữ liệu của bạn, gồm:",
        ],
        bullets: [
          "Phân quyền truy cập: chỉ nhân sự có nhiệm vụ mới được xem dữ liệu cần thiết cho công việc.",
          "Ghi nhật ký truy cập dữ liệu cá nhân và lưu trong 12 tháng để kiểm tra, phát hiện truy cập bất thường.",
          "Truyền dữ liệu qua kết nối được mã hóa (HTTPS) và vận hành trên hạ tầng đối tác có cơ chế bảo mật.",
          "Tự động xóa dữ liệu khi hết thời hạn lưu trữ, hạn chế lưu trữ dư thừa.",
          "Không thu thập dữ liệu nhạy cảm, chỉ thu thập thông tin cần thiết cho đơn hàng.",
        ],
      },
      {
        id: "quyen-cua-ban-doi-voi-du-lieu",
        heading: "Quyền của bạn đối với dữ liệu cá nhân",
        paragraphs: [
          "Theo Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15, bạn có các quyền chính sau:",
        ],
        bullets: [
          "Được biết về hoạt động xử lý dữ liệu cá nhân của mình.",
          "Đồng ý hoặc không đồng ý, và rút lại sự đồng ý.",
          "Xem, chỉnh sửa hoặc yêu cầu chỉnh sửa dữ liệu của mình.",
          "Yêu cầu cung cấp, xóa dữ liệu, hạn chế xử lý dữ liệu và phản đối xử lý dữ liệu.",
          "Khiếu nại, tố cáo, khởi kiện và yêu cầu bồi thường thiệt hại theo quy định pháp luật; yêu cầu cơ quan có thẩm quyền áp dụng biện pháp bảo vệ dữ liệu của mình.",
          "Bạn có trách nhiệm cung cấp thông tin chính xác, tự bảo vệ dữ liệu cá nhân và tôn trọng dữ liệu của người khác (ví dụ khi đặt hàng hộ người thân, cần được họ đồng ý cung cấp tên, số điện thoại, địa chỉ cho Freshbag).",
        ],
      },
      {
        id: "cach-gui-yeu-cau-va-thoi-han-xu-ly",
        heading: "Cách gửi yêu cầu và thời hạn xử lý",
        paragraphs: [
          "Để gửi yêu cầu về dữ liệu cá nhân (rút lại đồng ý, xem/chỉnh sửa, cung cấp, hạn chế, phản đối xử lý hoặc xóa dữ liệu), bạn vui lòng liên hệ qua hotline 093 268 2008, email info@freshbag.com.vn hoặc Zalo zalo.me/0932682008. Freshbag có thể đề nghị xác minh bạn là chủ thể dữ liệu trước khi xử lý.",
        ],
        bullets: [
          "Rút lại đồng ý, hạn chế xử lý, phản đối xử lý: tiếp nhận trong 2 ngày làm việc và hoàn tất trong 2 ngày làm việc tiếp theo.",
          "Xóa dữ liệu: tiếp nhận trong 2 ngày và hoàn tất trong 20 ngày; trường hợp có bên xử lý khác liên quan (như đơn vị vận chuyển, hóa đơn) thì hoàn tất trong 30 ngày (tính theo ngày lịch).",
          "Với dữ liệu pháp luật bắt buộc phải lưu giữ (ví dụ thông tin đơn hàng phục vụ kế toán, thuế), Freshbag sẽ giải thích rõ lý do và chỉ lưu đến hết thời hạn bắt buộc.",
        ],
        needsOwnerInput: true,
        ownerInputNote:
          "Thời hạn xử lý riêng đối với yêu cầu xem/chỉnh sửa dữ liệu và thông tin đánh giá tác động chuyển dữ liệu xuyên biên giới (nếu phát sinh với máy chủ đối tác nước ngoài) đang cập nhật theo rà soát của chủ shop.",
      },
      {
        id: "khieu-nai-va-cap-nhat-chinh-sach",
        heading: "Khiếu nại về bảo mật và cập nhật chính sách",
        paragraphs: [
          "Nếu bạn cho rằng dữ liệu của mình bị xử lý chưa đúng, vui lòng gửi phản ánh qua hotline 093 268 2008, email info@freshbag.com.vn hoặc Zalo zalo.me/0932682008, nêu rõ nội dung và thời điểm phát sinh. Freshbag sẽ phản hồi ban đầu trong vòng 1 ngày làm việc, xác minh và thông báo hướng xử lý cho bạn. Nếu chưa hài lòng với kết quả, bạn có quyền khiếu nại đến cơ quan nhà nước có thẩm quyền về bảo vệ dữ liệu cá nhân hoặc khởi kiện theo quy định pháp luật.",
          "Freshbag có thể cập nhật chính sách này khi pháp luật thay đổi hoặc khi thay đổi cách thức xử lý dữ liệu. Bản cập nhật được đăng trên website freshbag.com.vn kèm ngày hiệu lực/cập nhật; với thay đổi quan trọng như thêm mục đích xử lý hay bên nhận dữ liệu mới, Freshbag sẽ thông báo cho bạn và xin lại sự đồng ý khi pháp luật yêu cầu.",
        ],
      },
    ],
    relatedLinks: [
      {
        label: "Giới thiệu CÔNG TY TNHH SX TM DV FRESHBAG",
        href: "/gioi-thieu",
        description: "Thông tin doanh nghiệp và cam kết minh bạch của Freshbag.",
      },
      {
        label: "Chính sách đổi trả & giải quyết khiếu nại",
        href: "/chinh-sach-doi-tra",
        description: "Quy trình tiếp nhận khiếu nại và phản hồi trong 1 ngày làm việc.",
      },
      {
        label: "Chính sách thanh toán",
        href: "/chinh-sach-thanh-toan",
        description: "Lưu ý giao dịch an toàn qua COD và chuyển khoản VietinBank.",
      },
      {
        label: "Liên hệ bảo vệ dữ liệu & CSKH",
        href: "/lien-he",
        description: "Gửi yêu cầu về dữ liệu qua hotline, email hoặc Zalo.",
      },
    ],
  },
};
