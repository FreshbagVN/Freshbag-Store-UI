/** Nguồn sự thật duy nhất cho thông tin thương hiệu đã được xác nhận. */
export interface BrandFacts {
  companyName: string;
  brandName: string;
  slogan: string;
  hotline: string;
  hotlineDisplay: string;
  zaloUrl: string;
  b2bPhone: string;
  b2bPhoneDisplay: string;
  b2bZaloUrl: string;
  email: string;
  address: string;
  warrantyMonths: number;
  warrantySummary: string;
  cod: boolean;
  nationwideShipping: boolean;
  returnDays: number;
  bank: { bank_name: string; account_number: string; account_name: string };
  opens: string;
  closes: string;
  returnsSummary: string;
  workingHours: string | null;
  taxCode: string | null;
  representative: string | null;
  socialLinks: readonly string[] | null;
}

export const brandFacts: Readonly<BrandFacts> = {
  companyName: "CÔNG TY TNHH SX TM DV FRESHBAG",
  brandName: "Freshbag",
  slogan: "Grow up with you",
  hotline: "0932682008",
  hotlineDisplay: "093 268 2008",
  zaloUrl: "https://zalo.me/0932682008",
  b2bPhone: "0906818084",
  b2bPhoneDisplay: "0906 818 084",
  b2bZaloUrl: "https://zalo.me/0906818084",
  email: "info@freshbag.com.vn",
  address: "367 Nguyễn Văn Luông, Phường Phú Lâm, TP. Hồ Chí Minh",
  warrantyMonths: 6,
  warrantySummary: "Bảo hành 6 tháng đối với lỗi do nhà sản xuất.",
  cod: true,
  nationwideShipping: true,
  returnDays: 7,
  bank: { bank_name: "Ngân hàng TMCP Công Thương Việt Nam (VietinBank)", account_number: "112003063688", account_name: "CTY TNHH SX TM DV FRESHBAG" },
  opens: "08:00",
  closes: "17:30",
  returnsSummary: "Hỗ trợ đổi trả trong 7 ngày kể từ khi nhận hàng: lỗi do shop miễn phí vận chuyển; đổi ý khách chịu phí 2 chiều (còn nguyên tem nhãn, chưa sử dụng).",
  workingHours: "8:00–17:30, Thứ 2–Thứ 7",
  taxCode: null, // CẦN CHỦ SHOP XÁC NHẬN
  representative: null, // CẦN CHỦ SHOP XÁC NHẬN
  socialLinks: null, // CẦN CHỦ SHOP XÁC NHẬN
};
