import { POLICIES } from "@/content/policies";
import { PolicyPageView } from "@/components/policy/PolicyPageView";
import { buildPolicyJsonLdList, buildPolicyMetadata } from "@/components/policy/policySeo";

export function generateMetadata() {
  return buildPolicyMetadata("chinh-sach-bao-mat");
}

export default function ChinhSachBaoMatPage() {
  return (
    <PolicyPageView
      doc={POLICIES["chinh-sach-bao-mat"]}
      jsonLdList={buildPolicyJsonLdList("chinh-sach-bao-mat")}
    />
  );
}
