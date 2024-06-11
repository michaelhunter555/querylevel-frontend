import React from "react";

import dynamic from "next/dynamic";

import ManageKeywordsLayout from "@/components/Shared/ManageKeywordsLayout/ManageKeywordLayout";
import { useGetCampaigns } from "@/hooks/campaign-hooks";
import { useGetShoppingSearchTerms } from "@/hooks/reports-hooks";

//import ManageNegativeKeywords from "@/components/SearchTerms/ManageNegativeKeywords";
const ManageNegativeKeywords = dynamic(
  () => import("@/components/SearchTerms/ManageNegativeKeywords"),
  { ssr: false }
);

const ManageCampaignCriterionKeywords = () => {
  const { getNegativeKeywords } = useGetShoppingSearchTerms();
  const { getShoppingCampaignNames } = useGetCampaigns();

  return (
    <ManageKeywordsLayout
      keywordLevel="AD_GROUP"
      getCampaignNames={getShoppingCampaignNames}
      getNegativeKeywords={getNegativeKeywords}
      ManageNegativeKeywordsComponent={ManageNegativeKeywords}
    />
  );
};

export default ManageCampaignCriterionKeywords;
