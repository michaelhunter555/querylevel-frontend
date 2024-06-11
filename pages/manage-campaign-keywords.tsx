import React from "react";

import dynamic from "next/dynamic";

//import ManageCampaignCriterionNegativeKeywords from "@/components/SearchTerms/ManageCampaignCriterionNegativeKeywords";
import ManageKeywordsLayout from "@/components/Shared/ManageKeywordsLayout/ManageKeywordLayout";
import { useGetCampaigns } from "@/hooks/campaign-hooks";
import { useGetShoppingSearchTerms } from "@/hooks/reports-hooks";

const ManageCampaignCriterionNegativeKeywords = dynamic(
  () =>
    import("@/components/SearchTerms/ManageCampaignCriterionNegativeKeywords"),
  { ssr: false }
);

const ManageCampaignCriterionKeywords = () => {
  const { getNegativeKeywords } = useGetShoppingSearchTerms();
  const { getShoppingCampaignNames } = useGetCampaigns();

  return (
    <ManageKeywordsLayout
      keywordLevel="CAMPAIGN"
      getCampaignNames={getShoppingCampaignNames}
      getNegativeKeywords={getNegativeKeywords}
      ManageNegativeKeywordsComponent={ManageCampaignCriterionNegativeKeywords}
    />
  );
};

export default ManageCampaignCriterionKeywords;
