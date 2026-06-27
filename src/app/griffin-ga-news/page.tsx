import { Metadata } from "next";
import { LocalCoveragePage } from "@/components/LocalCoveragePage";
import { buildPageMetadata } from "@/lib/seo/page-metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Griffin GA News",
  description:
    "Read Griffin GA news from the Griffin Grapevine, including city updates, community events, businesses, schools, weather, and Spalding County stories.",
  path: "/griffin-ga-news",
});

export default function GriffinGaNewsPage() {
  return (
    <LocalCoveragePage
      title="Griffin GA News"
      eyebrow="Local coverage"
      canonicalPath="/griffin-ga-news"
      citySlug="griffin"
      description="Follow local news from Griffin, Georgia, with weekly updates on city decisions, community events, business openings, schools, weather, and stories from across Spalding County."
      sections={[
        {
          title: "City updates",
          body: "Track local government, development, roads, public safety, and decisions that shape life in Griffin.",
        },
        {
          title: "Community life",
          body: "Find festivals, ceremonies, weekend events, school milestones, and neighbor-focused stories.",
        },
        {
          title: "Local businesses",
          body: "Keep up with openings, closings, job fairs, restaurants, shops, and the people building Griffin.",
        },
      ]}
    />
  );
}
