import { brandFacts as b } from "@/content/brand-facts";
import { IS_PRODUCTION, absoluteUrl } from "@/lib/seo";
export function GET() {
  const links = [["/san-pham", "Sản phẩm: balo, túi xách, ví, cặp và vali"], ["/gioi-thieu", "Giới thiệu Freshbag"], ["/lien-he", "Liên hệ"], ["/ban-hang-doanh-nghiep", "Quà tặng doanh nghiệp"], ["/chinh-sach-bao-hanh", "Bảo hành"], ["/chinh-sach-doi-tra", "Đổi trả"], ["/chinh-sach-van-chuyen", "Vận chuyển"], ["/chinh-sach-thanh-toan", "Thanh toán"], ["/chinh-sach-bao-mat", "Bảo mật"]];
  const text = `# ${b.brandName}\n\n${!IS_PRODUCTION ? "> Bản thử nghiệm, chưa mở lập chỉ mục.\n\n" : ""}${b.companyName} — ${b.slogan}\n\nHotline: ${b.hotlineDisplay} · Zalo: ${b.zaloUrl}\nZalo doanh nghiệp: ${b.b2bZaloUrl}\nEmail: ${b.email}\nĐịa chỉ: ${b.address}\n\n${b.warrantySummary}\n\n## Trang công khai\n${links.map(([path, name]) => `- [${name}](${absoluteUrl(path)})`).join("\n")}\n`;
  return new Response(text, { headers: { "Content-Type": "text/plain; charset=utf-8", ...(!IS_PRODUCTION ? { "X-Robots-Tag": "noindex, nofollow" } : {}) } });
}
