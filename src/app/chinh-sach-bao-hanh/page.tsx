import { POLICIES } from "@/content/policies";
import { PolicyPageView } from "@/components/policy/PolicyPageView";
import { buildPolicyJsonLdList, buildPolicyMetadata } from "@/components/policy/policySeo";

export function generateMetadata() {
  return buildPolicyMetadata("chinh-sach-bao-hanh");
}

export default function ChinhSachBaoHanhPage() {
  return (
    <PolicyPageView
      doc={POLICIES["chinh-sach-bao-hanh"]}
      jsonLdList={buildPolicyJsonLdList("chinh-sach-bao-hanh")}
    />
  );
}
