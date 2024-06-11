import React, { useEffect, useState } from "react";

import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

import SearchTermView from "@/components/SearchTerms/SearchTermView";
import { useGetCampaigns } from "@/hooks/campaign-hooks";
import { TSearchTerms } from "@/types";
import { SelectChangeEvent } from "@mui/material/Select";
import { useQuery } from "@tanstack/react-query";

const SearchTerms = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [campaignId, setCampaignId] = useState<string>("");
  const [segment, setSegment] = useState("LAST_7_DAYS");
  const sessionIsValid = session?.user._id && session?.user?.googleAccountId;
  const { getShoppingCampaignNames } = useGetCampaigns();

  useEffect(() => {
    if (!sessionIsValid) {
      router.push("/user-dashboard");
    }
  }, [sessionIsValid]);

  const handleCampaignChange = (campaignId: string) => {
    setCampaignId(campaignId);
    localStorage.setItem("campaign", campaignId);
  };

  const { data: campaignNames, isLoading: campaignNamesLoading } = useQuery({
    queryKey: ["getShoppingCampaignNames"],
    queryFn: () => getShoppingCampaignNames(),
    enabled: Boolean(session?.user?._id),
    staleTime: 30 * 60 * 1000,
  });

  useEffect(() => {
    const storedData = localStorage.getItem("campaign");
    if (storedData && !campaignNamesLoading) {
      setCampaignId(storedData);
    }
  }, [campaignNamesLoading]);

  const getSearchTermViews = async (
    segment: string,
    campaignId: string | number,
    pageToken?: string
  ) => {
    //setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_SERVER}/api/reports/search-term-view-metrics?id=${session?.user?._id}&segment=${segment}&campaignId=${campaignId}&pageToken=${pageToken}`,
        { method: "GET" }
      );

      if (!response.ok) {
        throw new Error(
          "Error retreiving search term data. check reports hooks."
        );
      }

      const data = await response.json();

      const flattenData: TSearchTerms[] = data.searchTermViewMetrics.map(
        (searchTerm: TSearchTerms) => {
          return {
            adGroupName: searchTerm.ad_group.name,
            adGroupId: searchTerm.ad_group.id,
            campaignId: searchTerm.campaign.id,
            ...searchTerm.segments,
            ...searchTerm.campaign,
            ...searchTerm.metrics,
            ...searchTerm.search_term_view,
          };
        }
      );
      //setSearchTermData(flattenData);
      //setIsLoading(false);
      return flattenData;
    } catch (err) {
      //setIsLoading(false);
      console.log("There was an error in getSearchTermView.tsx API call", err);
    }
  };

  const { data: searchTermData, isLoading: searchTermsIsLoading } = useQuery({
    queryKey: ["searchTermView", campaignId?.split(":")[1], segment],
    queryFn: () => getSearchTermViews(segment, campaignId?.split(":")[1]),
    enabled: Boolean(
      session?.user?._id && segment && campaignId?.split(":")[1]
    ),
    staleTime: Infinity,
  });

  const handleSegmentChange = (event: SelectChangeEvent<string>) => {
    setSegment(event.target.value);
  };

  return (
    <SearchTermView
      segment={segment}
      onSegmentChange={handleSegmentChange}
      campaignId={campaignId}
      onSetCampaignId={handleCampaignChange}
      campaignNames={campaignNames}
      campaignNamesLoading={campaignNamesLoading}
      searchTermsIsLoading={searchTermsIsLoading}
      searchTermData={searchTermData}
    />
  );
};

export default SearchTerms;
