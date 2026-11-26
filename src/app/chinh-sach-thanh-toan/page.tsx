import { POLICIES } from "@/content/policies";
import { PolicyPageView } from "@/components/policy/PolicyPageView";
import { buildPolicyJsonLdList, buildPolicyMetadata } from "@/components/policy/policySeo";

export function generateMetadata() {
  return buildPolicyMetadata("chinh-sach-thanh-toan");
}

export default function ChinhSachThanhToanPage() {
  return (
    <PolicyPageView
      doc={POLICIES["chinh-sach-thanh-toan"]}
      jsonLdList={buildPolicyJsonLdList("chinh-sach-thanh-toan")}
    />
  );
}
