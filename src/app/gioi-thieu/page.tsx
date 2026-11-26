import { POLICIES } from "@/content/policies";
import { PolicyPageView } from "@/components/policy/PolicyPageView";
import { buildPolicyJsonLdList, buildPolicyMetadata } from "@/components/policy/policySeo";

export function generateMetadata() {
  return buildPolicyMetadata("gioi-thieu");
}

export default function GioiThieuPage() {
  return (
    <PolicyPageView
      doc={POLICIES["gioi-thieu"]}
      jsonLdList={buildPolicyJsonLdList("gioi-thieu")}
    />
  );
}
