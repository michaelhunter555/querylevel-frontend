import { useCallback, useState } from "react";

import { useSession } from "next-auth/react";

import { ProductPerformanceData, TSearchTerms } from "@/types";

import useHttp from "./http-hook";

interface BiddingStrategy {
  bidding_strategy: TBiddingStrategy;
  metrics: TBidStrategyMetrics;
}

type TBidStrategyMetrics = {
  id: number;
  type: string;
};

type TBiddingStrategy = {
  clicks: number;
  cost_micros: number;
  impressions: number;
  conversion_value: number;
};

export const useBiddingStrategyReports = () => {
  const { data: session } = useSession();
  const [biddingStrategyData, setBiddingStrategyData] = useState<
    BiddingStrategy[]
  >([]);
  const { isLoading, sendRequest, error, clearError } = useHttp();

  const getBiddingStrategy = useCallback(async () => {
    try {
      const response = await sendRequest(
        `${process.env.NEXT_PUBLIC_APP_SERVER}/api/reports/bidding-strategy-performance-metrics?id=${session?.user._id}&accountId=${session?.user?.googleAccountId}`
      );

      console.log(response);

      let flattenBidData: BiddingStrategy[] = response?.biddingStrategyData.map(
        (val: BiddingStrategy) => {
          return {
            ...val.metrics,
            ...val.bidding_strategy,
          };
        }
      );
      setBiddingStrategyData(flattenBidData);
    } catch (err) {}
  }, []);

  return {
    getBiddingStrategy,
    biddingStrategyData,
    isLoading,
    error,
    clearError,
  };
};

export const useProductReports = () => {
  const { data: session } = useSession();
  const [productsData, setProductsData] = useState<ProductPerformanceData[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);

  const getProductPerformanceData = useCallback(async (brand: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_SERVER}/api/reports/product-performance-reports?id=${session?.user?._id}&accountId=${session?.user?.googleAccountId}&brand=${brand}`
      );

      const data = await response.json();

      const flattenData: ProductPerformanceData[] = data.productPerformance.map(
        (product: ProductPerformanceData) => {
          return {
            ...product.campaign,
            ...product.segments,
            ...product.metrics,
          };
        }
      );

      setProductsData(flattenData);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      console.log("There was an error with products request.", err);
    }
  }, []);

  return {
    getProductPerformanceData,
    isLoading,
    productsData,
  };
};

type NegativeKeywordView = {
  ad_group_criterion: {
    keyword: { text: string; match_type: number };
    negative: boolean;
    criterion_id: number;
  };
  ad_group: { id: number; name: string; campaign: string };
  campaign: { id: number; name: string };
  keyword: { text: string; match_type: number };
  negative: boolean;
  criterion_id: number;
};

type NegativeCampaignCriterionKeywordView = {
  campaign_criterion: {
    keyword: { text: string; match_type: number };
    negative: boolean;
    criterion_id: number;
  };
  campaign: { id: number; name: string };
  keyword: { text: string; match_type: number };
  negative: boolean;
  criterion_id: number;
};

export const useGetShoppingSearchTerms = () => {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [searchTermData, setSearchTermData] = useState<TSearchTerms[]>([]);
  const [isPostLoading, setIsPostLoading] = useState<boolean>(false);
  const [addNegativeKeywordSuccess, setAddNegativeKeywordSuccess] =
    useState<boolean>(false);
  const [messageResponse, setMessageResponse] = useState<string>("");
  const [addNegativeKeywordsLoading, setAddNegativeKeywordLoading] =
    useState<boolean>(false);
  const [bulkRemoveIsLoading, setBulkRemoveIsLoading] =
    useState<boolean>(false);
  const [bulkUpdateMatchTypeIsLoading, setBulkUpdateMatchTypeIsLoading] =
    useState<boolean>(false);
  const [editNegativeKeywordLoading, setEditNegativeKeywordLoading] =
    useState<boolean>(false);
  const [isManuallyAddingKeyword, setIsManuallyAddingKeyword] =
    useState<boolean>(false);

  //get all searchterms at campaign level
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

  //negativeKeywords at ad_group_criterion level
  const getNegativeKeywords = useCallback(
    async (campaignId: string | number) => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_APP_SERVER}/api/get-negative-keywords?id=${session?.user?._id}&campaignId=${campaignId}`,
          { method: "GET" }
        );
        if (!response.ok) {
          throw new Error(
            "There was an issue with the request, please check getNegativeKeywords."
          );
        }

        const data = await response.json();

        const flattenAdGroupCriterionKeywords = data.adGroupCriterion?.map(
          (keywords: NegativeKeywordView) => {
            return {
              ...keywords.ad_group_criterion,
              ...keywords,
            };
          }
        );

        const flattenCampaignCriterionKeywords = data.campaignCriterion?.map(
          (keywords: NegativeCampaignCriterionKeywordView) => {
            return {
              ...keywords.campaign_criterion,
              ...keywords,
            };
          }
        );

        return {
          flattenAdGroupCriterionKeywords,
          flattenCampaignCriterionKeywords,
        };
      } catch (err) {
        console.log(err);
      }
    },
    []
  );

  //add negativeKeywords at campaign level
  const addCampaignNegativeKeywords = useCallback(
    async (keywords: {}, matchType: string) => {
      setAddNegativeKeywordLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_APP_SERVER}/api/campaignActions/campaignCriterion/add-negative-keywords?id=${session?.user?._id}&matchType=${matchType}`,
          {
            method: "POST",
            body: JSON.stringify({ keywords }),
            headers: { "Content-Type": "application/json" },
          }
        );

        if (!response.ok) {
          throw new Error(
            "Error with response. Please check logs for add-negative-keywords"
          );
        }

        const data = await response.json();
        setAddNegativeKeywordLoading(false);
      } catch (err) {
        setAddNegativeKeywordLoading(false);
        console.log(
          "Error with POST - ADD negative keywords report-hooks",
          err
        );
      }
    },
    []
  );

  //add negativeKeywords at ad_group_criterion level
  const addAdGroupNegativeKeywords = useCallback(
    async (keywords: {}, matchType: string) => {
      setAddNegativeKeywordLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_APP_SERVER}/api/adGroupActions/AdGroupCriterionActions/add-ad-group-criterion-negative-keyword?id=${session?.user?._id}&matchType=${matchType}`,
          {
            method: "POST",
            body: JSON.stringify({ keywords }),
            headers: { "Content-Type": "application/json" },
          }
        );

        if (!response.ok) {
          throw new Error(
            "Error with response. Please check logs for add-negative-keywords"
          );
        }

        const data = await response.json();
        setAddNegativeKeywordLoading(false);
      } catch (err) {
        setAddNegativeKeywordLoading(false);
        console.log(
          "Error with POST - ADD negative keywords report-hooks",
          err
        );
      }
    },
    []
  );

  //bulk remove excluded keywords at ad_group_criterion level
  const bulkRemoveNegativeKeywords = useCallback(async (keywords: {}) => {
    setBulkRemoveIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_SERVER}/api/adGroupActions/AdGroupCriterionActions/bulk-remove-criterion-negative-keywords?id=${session?.user?._id}`,
        {
          method: "POST",
          body: JSON.stringify({ criterionData: keywords }),
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        throw new Error("There was an error with the request");
      }
      setBulkRemoveIsLoading(false);
    } catch (err) {
      setBulkRemoveIsLoading(false);
      console.log(
        "There was an error with the request for bulk negatives.",
        err
      );
    }
  }, []);

  //bulk remove excluded keywords at campaign_criterion level
  const bulkRemoveCampaignCriterionNegativeKeywords = useCallback(
    async (keywords: {}) => {
      setBulkRemoveIsLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_APP_SERVER}/api/campaignActions/campaignCriterion/bulk-remove-campaign-criterion-keyword?id=${session?.user?._id}`,
          {
            method: "POST",
            body: JSON.stringify({ criterionData: keywords }),
            headers: { "Content-Type": "application/json" },
          }
        );

        if (!response.ok) {
          throw new Error("There was an error with the request");
        }
        setBulkRemoveIsLoading(false);
      } catch (err) {
        setBulkRemoveIsLoading(false);
        console.log(
          "There was an error with the request for bulk negatives.",
          err
        );
      }
    },
    []
  );

  //bulk update negative kw matchtype at ad_group_criterion level
  const bulkUpdateAdGroupCriterionKeywordMatchType = useCallback(
    async (keywords: {}, matchType: number) => {
      setBulkUpdateMatchTypeIsLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_APP_SERVER}/api/adGroupActions/AdGroupCriterionActions/bulk-edit-ad-group-criterion-match-type?id=${session?.user?._id}`,
          {
            method: "POST",
            body: JSON.stringify({
              criterionData: keywords,
              newMatchType: matchType,
            }),
            headers: { "Content-Type": "application/json" },
          }
        );

        if (!response.ok) {
          throw new Error(
            "There was an error with the request to bulk update negative keywords"
          );
        }
        setBulkUpdateMatchTypeIsLoading(false);
      } catch (err) {
        setBulkUpdateMatchTypeIsLoading(false);
        console.log(err);
      }
    },
    []
  );

  //bulk update negative kw matchType at campaign_criterion_level
  const bulkUpdateCampaignCriterionKeywordMatchType = useCallback(
    async (keywords: {}, matchType: number) => {
      setBulkUpdateMatchTypeIsLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_APP_SERVER}/api/campaignActions/campaignCriterion/bulk-edit-campaign-criterion-match-type?id=${session?.user?._id}`,
          {
            method: "POST",
            body: JSON.stringify({
              criterionData: keywords,
              newMatchType: matchType,
            }),
            headers: { "Content-Type": "application/json" },
          }
        );

        if (!response.ok) {
          throw new Error(
            "There was an error with the request to bulk update negative keywords"
          );
        }
        setBulkUpdateMatchTypeIsLoading(false);
      } catch (err) {
        setBulkUpdateMatchTypeIsLoading(false);
        console.log(err);
      }
    },
    []
  );

  //edit negativeKeyword and/or matchType at ad_group_criterion Level
  const editNegativeAdGroupCriterionKeyword = useCallback(
    async (keywordData: {}) => {
      setEditNegativeKeywordLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_APP_SERVER}/api/adGroupActions/AdGroupCriterionActions/edit-negative-keywords?id=${session?.user?._id}`,
          {
            method: "POST",
            body: JSON.stringify({ keywordData }),
            headers: { "Content-Type": "application/json" },
          }
        );

        if (!response.ok) {
          throw new Error(
            "There was an error with the request to edit ad_group_criterion keywords"
          );
        }
        setEditNegativeKeywordLoading(false);
      } catch (err) {
        setEditNegativeKeywordLoading(false);
        console.log(err);
      }
    },
    []
  );

  const editNegativeCampaignCriterionKeyword = useCallback(
    async (keywordData: {}) => {
      setEditNegativeKeywordLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_APP_SERVER}/api/campaignActions/campaignCriterion/edit-negative-keywords?id=${session?.user?._id}`,
          {
            method: "POST",
            body: JSON.stringify({ keywordData }),
            headers: { "Content-Type": "application/json" },
          }
        );

        if (!response.ok) {
          throw new Error(
            "There was an error with the request to edit ad_group_criterion keywords"
          );
        }
        setEditNegativeKeywordLoading(false);
      } catch (err) {
        setEditNegativeKeywordLoading(false);
        console.log(err);
      }
    },
    []
  );

  //manually add campaign negative keyword
  const manuallyAddNegativeKeyword = useCallback(
    async (
      campaign: { id: number; name: string },
      negativeKeywords: string[]
    ) => {
      setIsManuallyAddingKeyword(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_APP_SERVER}/api/campaignActions/campaignCriterion/add-new-negative-keywords?id=${session?.user?._id}`,
          {
            method: "POST",
            body: JSON.stringify({ campaign, negativeKeywords }),
            headers: { "Content-Type": "application/json" },
          }
        );

        if (!response.ok) {
          throw new Error(
            "There was an error with the request. Please check your code."
          );
        }
        setIsManuallyAddingKeyword(false);
      } catch (err) {
        setIsManuallyAddingKeyword(false);
        console.log(err);
      }
    },
    []
  );

  //manually add ad_group_criterion keyword
  //manually add campaign negative keyword
  const manuallyAddAdGroupNegativeKeyword = useCallback(
    async (
      adGroup: { id: number; name: string },
      negativeKeywords: string[]
    ) => {
      setIsManuallyAddingKeyword(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_APP_SERVER}/api/adGroupActions/AdGroupCriterionActions/add-new-negative-keywords?id=${session?.user?._id}`,
          {
            method: "POST",
            body: JSON.stringify({ adGroup, negativeKeywords }),
            headers: { "Content-Type": "application/json" },
          }
        );

        if (!response.ok) {
          throw new Error(
            "There was an error with the request. Please check your code."
          );
        }
        setIsManuallyAddingKeyword(false);
      } catch (err) {
        setIsManuallyAddingKeyword(false);
        console.log(err);
      }
    },
    []
  );

  const resetAddNegativeKeywordSuccess = useCallback(() => {
    setAddNegativeKeywordSuccess(false);
  }, []);

  return {
    isLoading,
    searchTermData,
    getSearchTermViews,
    addAdGroupNegativeKeywords,
    addCampaignNegativeKeywords,
    isPostLoading,
    addNegativeKeywordSuccess,
    resetAddNegativeKeywordSuccess,
    messageResponse,
    getNegativeKeywords,
    bulkRemoveNegativeKeywords,
    bulkRemoveIsLoading,
    bulkUpdateAdGroupCriterionKeywordMatchType,
    bulkUpdateMatchTypeIsLoading,
    bulkRemoveCampaignCriterionNegativeKeywords,
    bulkUpdateCampaignCriterionKeywordMatchType,
    addNegativeKeywordsLoading,
    editNegativeCampaignCriterionKeyword,
    editNegativeAdGroupCriterionKeyword,
    editNegativeKeywordLoading,
    manuallyAddNegativeKeyword,
    isManuallyAddingKeyword,
    manuallyAddAdGroupNegativeKeyword,
  };
};

type SharedBudgets = {};

export const useGetSharedBudgets = () => {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [sharedBudgets, setSharedBudgets] = useState([]);

  const getSharedBudgets = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_SERVER}/api/get-shared-budgets?id=${session?.user?._id}`,
        { method: "GET" }
      );

      if (!response.ok) {
        throw new Error(
          "there was an error with the request to get shared budgets."
        );
      }

      const data = await response.json();
      setSharedBudgets(data.sharedBudgets);
      setIsLoading(false);
      return data.sharedBudgets;
    } catch (err) {
      setIsLoading(false);
      console.log(
        "There was an error with the request for shared budgets",
        err
      );
    }
  }, []);

  return {
    isLoading,
    sharedBudgets,
    getSharedBudgets,
  };
};
