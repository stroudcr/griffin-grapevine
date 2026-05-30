import { Metadata } from "next";
import { LocalCoveragePage } from "@/components/LocalCoveragePage";
import { SITE_CONFIG } from "@/lib/seo/constants";

export const metadata: Metadata = {
  title: "Spalding County Local Government",
  description:
    "Follow Spalding County local government news, including commission meetings, city decisions, zoning, elections, public safety, and development.",
  alternates: {
    canonical: `${SITE_CONFIG.url}/local-government`,
  },
};

export default function LocalGovernmentPage() {
  return (
    <LocalCoveragePage
      title="Spalding County Local Government"
      eyebrow="Civic news"
      canonicalPath="/local-government"
      topicSlug="local-government"
      description="Follow local government news for Griffin and Spalding County, including commission meetings, city council decisions, zoning, elections, public safety, infrastructure, and development."
      sections={[
        {
          title: "Meetings and decisions",
          body: "Coverage of county commission, city council, boards, hearings, budgets, taxes, and civic deadlines.",
        },
        {
          title: "Development and zoning",
          body: "Updates on data centers, roads, infrastructure, new projects, planning decisions, and public hearings.",
        },
        {
          title: "Why it matters",
          body: "Plain-language local context for residents who want to understand what changed and what comes next.",
        },
      ]}
    />
  );
}
