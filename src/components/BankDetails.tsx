import { brandFacts } from "@/content/brand-facts";
import { vnd } from "@/lib/data";

export function BankDetails({ bank = brandFacts.bank, code, total }: {
  bank?: { bank_name: string | null; account_number: string | null; account_name: string | null };
  code?: string;
  total?: number;
}) {
  return <div className="bank-details mt-3 rounded border border-black/10 p-4">
    <h2 className="font-semibold text-brand">Thông tin chuyển khoản</h2>
    <dl>
      <dt>Ngân hàng</dt><dd>{bank.bank_name}</dd>
      <dt>Số tài khoản</dt><dd className="font-semibold">{bank.account_number}</dd>
      <dt>Chủ tài khoản</dt><dd>{bank.account_name}</dd>
      {total != null && <><dt>Số tiền</dt><dd>{vnd(total)}</dd></>}
    </dl>
    <p className="mt-3 text-sm">Nội dung chuyển khoản: mã đơn hàng{code ? <> – <strong>{code}</strong></> : ". Mã đơn sẽ hiển thị sau khi đặt hàng."}</p>
  </div>;
}
