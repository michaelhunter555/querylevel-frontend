import { useCallback, useState } from "react";

import { useSession } from "next-auth/react";

import { AdGroupsTableData } from "@/components/CampaignsView/AdGroupsTable";

type AdGroupTable = {
  campaign: AdGroupCampaign;
  ad_group: AdGroup;
  metrics: Metrics;
};

type Metrics = {
  clicks: number;
  conversions: number;
  cost_micros: number;
  ctr: number;
  impression: number;
};

type AdGroupCampaign = {
  id: string;
  resource_name: string;
  bidding_strategy_type: number;
};

type AdGroup = {
  campaign: string;
  cpc_bid_micros: number;
  id: string;
  name: string;
  resource_name: string;
  target_roas: string | null;
  target_cpa_micros: number;
  status: number;
};

export const useGetAdGroups = () => {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [adGroupData, setAdGroupData] = useState<Array<object>>([]);

  const getAdGroups = useCallback(
    async (campaignId: string, segment: string, status: string) => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_APP_SERVER}/api/getUserAdGroups?id=${session?.user?._id}&campaignId=${campaignId}&segment=${segment}&status=${status}`,
          { method: "GET" }
        );

        if (!response.ok) {
          throw new Error("Error trying to retrieve Ad Groups Data.");
        }

        const data = await response.json();

        const adGroupData = data?.adGroups?.map((adGroup: AdGroupTable) => {
          return {
            adGroupId: adGroup?.ad_group?.id,
            adGroupResource: adGroup.ad_group?.resource_name,
            campaignResource: adGroup.campaign.resource_name,
            campaignId: adGroup?.campaign.id,
            //everything else
            ...adGroup?.ad_group,
            ...adGroup?.campaign,
            ...adGroup?.metrics,
          };
        });

        setAdGroupData(adGroupData);
        //console.log(adGroupData);
        setIsLoading(false);
        return adGroupData;
      } catch (err) {
        setIsLoading(false);
        console.log("Error with the request to retrieve Ad Groups Data:", err);
      }
    },
    []
  );

  return {
    isLoading,
    adGroupData,
    getAdGroups,
  };
};

export const useCreateAdGroup = () => {
  const { data: session } = useSession();
  const [createAdGroupSuccess, setCreateAdGroupSuccess] =
    useState<boolean>(false);
  const [adGroupPostIsLoading, setAdGroupPostIsLoading] =
    useState<boolean>(false);

  const createAdGroup = useCallback(
    async (adGroup: { [key: string]: string | number }) => {
      setAdGroupPostIsLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_APP_SERVER}/api/adGroupActions/adGroup/create-ad-group?id=${session?.user?._id}`,
          {
            method: "POST",
            body: JSON.stringify({ adGroup }),
            headers: { "Content-Type": "application/json" },
          }
        );

        if (!response.ok) {
          throw new Error(
            "There was an error with the request, please check your code"
          );
        }

        const data = await response.json();
        setCreateAdGroupSuccess(data.ok);
        setAdGroupPostIsLoading(false);
      } catch (err) {
        setAdGroupPostIsLoading(false);
        console.log(
          "there was an error with the operation, please view server logs."
        );
      }
    },
    []
  );

  const resetAdGroupResponse = useCallback(() => {
    setCreateAdGroupSuccess(false);
  }, []);

  return {
    createAdGroupSuccess,
    adGroupPostIsLoading,
    createAdGroup,
    resetAdGroupResponse,
  };
};

export const useUpdateAdGroups = () => {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [updateBidsAreLoading, setUpdateBidsAreLoading] =
    useState<boolean>(false);
  const [adGroupStatusUpdating, setAdGroupStatusUpdating] =
    useState<boolean>(false);
  const [removingAdGroups, setRemovingAdGroups] = useState<boolean>(false);

  const updateAdGroupName = useCallback(
    async (adGroup: { name: string; id: number }) => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_APP_SERVER}/api/adGroupActions/adGroup/update-ad-group-name?id=${session?.user?._id}`,
          {
            method: "POST",
            body: JSON.stringify({ adGroup }),
            headers: { "Content-Type": "application/json" },
          }
        );

        if (!response.ok) {
          throw new Error("Error");
        }
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        console.log("There was an error with the request: ", err);
      }
    },
    []
  );

  const updateAdGroupBids = useCallback(
    async (adGroup: AdGroupsTableData | {} | string[], cpcBid: number) => {
      setUpdateBidsAreLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_APP_SERVER}/api/adGroupActions/adGroup/update-ad-group-bids?id=${session?.user?._id}`,
          {
            method: "POST",
            body: JSON.stringify({ adGroup, newBid: cpcBid }),
            headers: { "Content-Type": "application/json" },
          }
        );

        if (!response.ok) {
          throw new Error(
            "There was an error with the request to update cpc bids."
          );
        }
        setUpdateBidsAreLoading(false);
      } catch (err) {
        setUpdateBidsAreLoading(false);
        console.log("Error Message in updateAdBids: ", err);
      }
    },
    []
  );

  const updateAdGroupStatus = useCallback(
    async (adGroup: {} | string[], status?: number) => {
      setAdGroupStatusUpdating(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_APP_SERVER}/api/adGroupActions/adGroup/update-ad-group-status?id=${session?.user?._id}`,
          {
            method: "POST",
            body: JSON.stringify({ adGroup, status }),
            headers: { "Content-Type": "application/json" },
          }
        );

        if (!response.ok) {
          throw new Error("Error with the request to update ad group status.");
        }
        setAdGroupStatusUpdating(false);
      } catch (err) {
        console.log(err);
      }
    },
    []
  );

  const removeAdGroups = useCallback(async (adGroupIds: string[]) => {
    setRemovingAdGroups(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_SERVER}/api/adGroupActions/adGroup/remove-ad-group?id=${session?.user?._id}`,
        {
          method: "POST",
          body: JSON.stringify({ adGroups: adGroupIds }),
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!response.ok) {
        throw new Error("Error with the request to delete ad groups.");
      }
      setRemovingAdGroups(false);
    } catch (err) {
      setRemovingAdGroups(false);
      console.log(
        "There was an error with the request to delete ad groups.",
        err
      );
    }
  }, []);

  return {
    removeAdGroups,
    removingAdGroups,
    updateAdGroupStatus,
    adGroupStatusUpdating,
    updateAdGroupName,
    updateBidsAreLoading,
    updateAdGroupBids,
    isLoading,
  };
};
