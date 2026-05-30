import { Metadata } from "next";
import { LocalCoveragePage } from "@/components/LocalCoveragePage";
import { SITE_CONFIG } from "@/lib/seo/constants";

export const metadata: Metadata = {
  title: "Spalding County Events",
  description:
    "Find Spalding County events, weekend calendars, festivals, ceremonies, concerts, markets, and local things to do from Griffin Grapevine.",
  alternates: {
    canonical: `${SITE_CONFIG.url}/spalding-county-events`,
  },
};

export default function SpaldingCountyEventsPage() {
  return (
    <LocalCoveragePage
      title="Spalding County Events"
      eyebrow="Things to do"
      canonicalPath="/spalding-county-events"
      topicSlug="events"
      description="Find local events and things to do in Spalding County, including weekend calendars, festivals, community ceremonies, concerts, markets, school events, and family-friendly happenings."
      sections={[
        {
          title: "Weekend plans",
          body: "A practical look at what is happening around Griffin, Orchard Hill, Sunny Side, and nearby communities.",
        },
        {
          title: "Community gatherings",
          body: "Ceremonies, fundraisers, seasonal events, markets, performances, and local traditions worth knowing about.",
        },
        {
          title: "Weekly context",
          body: "Events appear alongside the civic updates and community news that help residents stay connected.",
        },
      ]}
    />
  );
}
