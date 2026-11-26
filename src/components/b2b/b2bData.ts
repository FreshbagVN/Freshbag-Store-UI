export type B2BProductChip =
  | "Balo"
  | "Túi xách"
  | "Túi đeo chéo"
  | "Vali & phụ kiện"
  | "Chưa xác định";

export type B2BQuantityTier = "Dưới 50" | "50–199" | "200–500" | "Trên 500";

export interface B2BCategoryCardItem {
  chip: Exclude<B2BProductChip, "Chưa xác định">;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  catalogHref: string;
}

export interface B2BClientLogo {
  name: string;
  logoUrl: string;
}

export interface B2BCaseStudy {
  clientName: string;
  productType: string;
  imageUrl: string;
}

export interface B2BFaqItem {
  question: string;
  answer: string;
}

export const B2B_PRODUCT_CHIPS: readonly B2BProductChip[] = [
  "Balo",
  "Túi xách",
  "Túi đeo chéo",
  "Vali & phụ kiện",
  "Chưa xác định",
];

export const B2B_QUANTITY_TIERS: readonly B2BQuantityTier[] = [
  "Dưới 50",
  "50–199",
  "200–500",
  "Trên 500",
];

// CẦN CHỦ SHOP CUNG CẤP: logo doanh nghiệp đã đồng hành cùng Freshbag.
export const B2B_CLIENT_LOGOS: B2BClientLogo[] = [];

// CẦN CHỦ SHOP CUNG CẤP: ảnh chụp thực tế mẫu balo/túi đã in hoặc thêu logo cho khách hàng.
export const B2B_CASE_STUDIES: B2BCaseStudy[] = [];

export const B2B_HERO_HIGHLIGHTS = [
  {
    title: "Đặt theo nhu cầu",
    description: "Tư vấn mẫu balo, túi xách phù hợp đối tượng nhận và mục đích sử dụng.",
  },
  {
    title: "Tư vấn & báo giá",
    description: "Đề xuất phương án quà tặng theo nhóm sản phẩm và ngân sách dự kiến.",
  },
  {
    title: "In / thêu logo thương hiệu",
    description: "Hỗ trợ thống nhất thiết kế thể hiện logo trước khi tiến hành thực hiện.",
  },
  {
    title: "Hỗ trợ sau mua",
    description: "Áp dụng bảo hành 6 tháng lỗi nhà sản xuất theo chính sách đơn hàng.",
  },
] as const;

export const B2B_BENEFITS = [
  {
    title: "Tư vấn theo ngân sách",
    description:
      "Gợi ý các dòng balo, túi xách, túi đeo chéo hoặc vali tương ứng với ngân sách và số lượng dự kiến của doanh nghiệp.",
  },
  {
    title: "Dấu ấn thương hiệu riêng",
    description:
      "Trao đổi rõ vị trí đặt logo và phương án thể hiện phù hợp từng chất liệu vải, da, simili hoặc vỏ vali.",
  },
  {
    title: "Duyệt thiết kế trước khi làm",
    description:
      "Thống nhất bố cục logo, màu sắc và quy cách đơn hàng trước khi bước vào giai đoạn hoàn thiện hàng loạt.",
  },
  {
    title: "Hỗ trợ sau bàn giao",
    description:
      "Hỗ trợ kiểm tra hàng khi giao nhận toàn quốc và bảo hành 6 tháng đối với các lỗi kỹ thuật từ nhà sản xuất.",
  },
] as const;

export const B2B_PROCESS_STEPS = [
  {
    step: "01",
    title: "Gửi nhu cầu",
    description:
      "Doanh nghiệp chọn nhóm sản phẩm, số lượng dự kiến và mô tả yêu cầu thời gian hoặc logo qua form.",
  },
  {
    step: "02",
    title: "Tư vấn & báo giá",
    description:
      "Freshbag tiếp nhận qua Zalo B2B hoặc email để đề xuất mẫu phù hợp ngân sách và báo giá cụ thể.",
  },
  {
    step: "03",
    title: "Duyệt mẫu & xác nhận đơn",
    description:
      "Hai bên thống nhất phương án thể hiện logo, quy cách đóng gói, tiến độ giao hàng và điều khoản thanh toán.",
  },
  {
    step: "04",
    title: "Hoàn thiện & giao hàng",
    description:
      "Hoàn thiện đơn hàng theo phương án đã xác nhận, kiểm tra chất lượng và bàn giao tận nơi theo thỏa thuận.",
  },
] as const;

export const B2B_USE_CASES = [
  {
    title: "Balo đồng phục nhân viên văn phòng & kỹ thuật",
    description:
      "Các mẫu balo laptop và balo đa năng có ngăn chống sốc gọn gàng phù hợp làm đồng phục onboarding cho nhân viên mới, đội ngũ kinh doanh hoặc kỹ sư thường xuyên mang máy tính đi làm.",
  },
  {
    title: "Quà tặng hội thảo, sự kiện & tuyển sinh",
    description:
      "Túi xách, túi vải hoặc balo sự kiện có kiểu dáng dễ sử dụng hằng ngày giúp thương hiệu doanh nghiệp, trung tâm đào tạo hay trường học xuất hiện tự nhiên sau khi chương trình kết thúc.",
  },
  {
    title: "Túi đeo chéo & phụ kiện cho hoạt động nội bộ",
    description:
      "Túi đeo chéo gọn nhẹ phù hợp cho các chương trình team building, dã ngoại, quà tặng khách hàng trẻ hoặc bộ quà tặng kèm trong các chiến dịch tri ân theo mùa.",
  },
  {
    title: "Vali & hành lý du lịch tri ân đối tác",
    description:
      "Vali du lịch và túi trống size lớn là lựa chọn quà tặng giá trị cao dành cho đối tác lâu năm, đại lý đạt doanh số hoặc nhân sự gắn bó dịp cuối năm.",
  },
] as const;

/**
 * Bộ 8 câu hỏi từ D:\Freshbag\_survey\seo-cluster-freshbag.md mục D (Persona 5: Doanh nghiệp B2B).
 * Các điểm chưa có dữ liệu chính thức (MOQ, chiết khấu, kỹ thuật xưởng, thời gian sản xuất, VAT)
 * đều hướng dẫn khách hàng liên hệ trực tiếp Zalo B2B 0906 818 084 để được tư vấn, không tự bịa số liệu.
 */
export const B2B_FAQS: readonly B2BFaqItem[] = [
  {
    question: "1. Freshbag có nhận đặt balo đồng phục và túi xách quà tặng cho doanh nghiệp không?",
    answer:
      "Có. Freshbag cung cấp dịch vụ bán hàng doanh nghiệp cho nhu cầu balo đồng phục công ty, balo sự kiện, túi xách, túi đeo chéo và vali quà tặng theo yêu cầu. Quý doanh nghiệp có thể gửi thông tin qua form trên trang này hoặc liên hệ Zalo B2B 0906 818 084 để được tư vấn mẫu phù hợp.",
  },
  {
    question: "2. Freshbag nhận in hoặc thêu logo lên những dòng sản phẩm nào?",
    answer:
      "Freshbag có danh mục đa dạng gồm balo laptop, balo du lịch, túi xách, cặp công sở, túi đeo chéo và vali phục vụ nhu cầu quà tặng doanh nghiệp. Về kỹ thuật in hoặc thêu logo phù hợp từng chất liệu cụ thể, quý khách vui lòng liên hệ Zalo 0906 818 084 để được tư vấn phương án chi tiết.",
  },
  {
    question: "3. Số lượng đặt tối thiểu (MOQ) và mức chiết khấu cho đơn doanh nghiệp là bao nhiêu?",
    answer:
      "Số lượng đặt tối thiểu và mức giá ưu đãi phụ thuộc vào dòng sản phẩm có sẵn hay đặt riêng cũng như yêu cầu logo đi kèm. Thông tin MOQ và bậc chiết khấu cụ thể đang được cập nhật; quý doanh nghiệp vui lòng liên hệ trực tiếp Zalo B2B 0906 818 084 hoặc gửi form để được tư vấn và báo giá nhanh.",
  },
  {
    question: "4. Doanh nghiệp đặt hàng có được duyệt mẫu thiết kế trước khi sản xuất không?",
    answer:
      "Quy trình tiếp nhận đơn doanh nghiệp của Freshbag có bước trao đổi phương án thể hiện logo và thống nhất thiết kế trước khi triển khai đơn hàng. Với nhu cầu làm mẫu vật lý, chi phí mẫu hoặc thời gian duyệt mẫu cụ thể, vui lòng liên hệ Zalo B2B 0906 818 084 để được tư vấn chi tiết.",
  },
  {
    question: "5. Thời gian hoàn thiện và giao hàng cho đơn quà tặng doanh nghiệp mất bao lâu?",
    answer:
      "Thời gian thực hiện phụ thuộc vào mẫu sản phẩm doanh nghiệp lựa chọn, số lượng đặt và yêu cầu thể hiện logo hoặc đóng gói. Để nhận lịch giao dự kiến phù hợp thời gian tổ chức sự kiện của bạn, hãy liên hệ Zalo 0906 818 084 để được tư vấn trực tiếp.",
  },
  {
    question: "6. Liên hệ báo giá đơn hàng doanh nghiệp Freshbag qua số Zalo và email nào?",
    answer:
      "Bộ phận khách hàng doanh nghiệp của Freshbag tiếp nhận yêu cầu nhanh qua Zalo 0906 818 084 và email info@freshbag.com.vn. Bạn cũng có thể điền biểu mẫu Nhận tư vấn & báo giá ngay bên dưới để sao chép nhanh thông tin đơn dự kiến và gửi qua Zalo hoặc email.",
  },
  {
    question: "7. Đơn hàng quà tặng doanh nghiệp có xuất hóa đơn VAT, hợp đồng và đặt cọc thế nào?",
    answer:
      "Freshbag hoạt động dưới pháp nhân CÔNG TY TNHH SX TM DV FRESHBAG tại TP.HCM. Các điều khoản chi tiết về xuất hóa đơn giá trị gia tăng (VAT), ký hợp đồng, tỷ lệ đặt cọc và thanh toán theo tiến độ sẽ được tư vấn cụ thể theo từng đơn hàng khi bạn liên hệ Zalo 0906 818 084 hoặc email info@freshbag.com.vn.",
  },
  {
    question: "8. Nếu sản phẩm bàn giao phát sinh lỗi kỹ thuật thì Freshbag xử lý ra sao?",
    answer:
      "Freshbag áp dụng chính sách kiểm tra hàng khi giao nhận và bảo hành 6 tháng đối với lỗi kỹ thuật từ nhà sản xuất. Đối với quy định nghiệm thu và xử lý đổi bù riêng cho đơn hàng doanh nghiệp số lượng lớn, vui lòng liên hệ Zalo 0906 818 084 hoặc hotline 093 268 2008 để được tư vấn và hỗ trợ.",
  },
];
