import { useCallback, useContext, useState } from "react";

import { useSession } from "next-auth/react";

import { AuthContext } from "@/context/auth-context";
import { AuthActionTypes } from "@/context/authActions";
import {
  CampaignProperties,
  EditableCampaign,
  NestedProps,
  ScheduleState,
  State,
  UpdateBiddingStrategy,
  UpdateCampaignBudget,
  UpdateCampaignSettings,
  UpdateCampainNetworkSettings,
  UpdateGeoTargetType,
  UpdateShoppingSettings,
  UserCampaign,
} from "@/types";

import useHttp from "./http-hook";
import { useInvalidateQuery } from "./invalidateQueries";

export interface ShoppingCampaign {
  cpc: number;
  enhancedClick: boolean;
  budget: number;
  enabled: boolean;
  vendor: string;
  productTitle: string[];
  sku: string[];
  bidSeparation: number;
  adSchedule: ScheduleState;
  targetedLocations: string[];
  excludedLocations: string[];
}

export const useCampaign = () => {
  const authContext = useContext(AuthContext);
  const { data: session } = useSession();
  const {
    isLoading,
    isPostLoading,
    sendRequest,
    error,
    clearError,
    success,
    message,
    errorMessage,
  } = useHttp();
  const { invalidateQuery } = useInvalidateQuery();
  //const [message, setMessage] = useState<string>("");

  const createShoppingCampaign = useCallback(
    async (campaignData: any, budgetData: any) => {
      try {
        await sendRequest(
          `${process.env.NEXT_PUBLIC_APP_SERVER}/api/campaignActions/create-campaign?id=${session?.user?._id}`,
          "POST",
          JSON.stringify({
            campaignData: campaignData,
            budgetData: budgetData,
          }),
          { "Content-Type": "application/json" }
        );
      } catch (err) {}
    },
    []
  );

  const createThreeTieredShoppingCampaign = useCallback(
    async (campaignData: ShoppingCampaign) => {
      try {
        const response = await sendRequest(
          `${process.env.NEXT_PUBLIC_APP_SERVER}/api/campaignActions/create-three-tier?id=${session?.user._id}&accountId=${session?.user?.googleAccountId}`,
          "POST",
          JSON.stringify({ campaign: campaignData }),
          { "Content-Type": "application/json" }
        );

        if (response.ok) {
          await invalidateQuery("userSettings");
        }
      } catch (err) {}
    },
    []
  );

  const createAlphaBetaShoppingCampaign = useCallback(
    async (campaignData: ShoppingCampaign) => {
      try {
        const response = await sendRequest(
          `${process.env.NEXT_PUBLIC_APP_SERVER}/api/campaignActions/create-alpha-beta?id=${session?.user._id}&accountId=${session?.user?.googleAccountId}`,
          "POST",
          JSON.stringify({ campaign: campaignData }),
          { "Content-Type": "application/json" }
        );

        if (response.ok) {
          await invalidateQuery("userSettings");
        }
      } catch (err) {}
    },
    []
  );

  return {
    isPostLoading,
    error,
    clearError,
    isLoading,
    createShoppingCampaign,
    createThreeTieredShoppingCampaign,
    createAlphaBetaShoppingCampaign,
    message,
    errorMessage,
    success,
  };
};

export const useGetCampaigns = () => {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>();
  const [campaigns, setCampaigns] = useState<UserCampaign[]>([]);
  const [campaignNames, setCampaignNames] = useState<string[]>([]);
  const [campaignData, setCampaignData] = useState<EditableCampaign[] | null>(
    null
  );

  async function getCampaigns(
    userId: string,
    segment: string,
    status: string,
    accountId: string
  ) {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_SERVER}/api/getUserCampaigns?userId=${userId}&segment=${segment}&status=${status}&accountId=${accountId}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: response: ${response.status}`);
      }
      const data = await response.json();
      setIsLoading(false);

      let flattendCampaigns: NestedProps[] = data.campaigns.map(
        (campaign: NestedProps) => {
          return {
            ...campaign.campaign,
            ...campaign.metrics,
            ...campaign.segments,
          };
        }
      );

      setCampaigns(flattendCampaigns);
    } catch (error) {
      console.log(error);
      setError(new Error("Failed to get campaigns"));
    }
  }

  const getShoppingCampaignNames = async () => {
    //setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_SERVER}/api/get-campaign-names?id=${session?.user?._id}`,
        { method: "GET" }
      );
      const data = await response.json();
      //setCampaignNames(data.campaignNames);
      //setIsLoading(false);
      return data.campaignNames;
    } catch (err) {
      console.log(
        "There was an error with the request for campaign names.",
        err
      );
    }
  };

  const getEditableCampaign = async (campaignId: string | number) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_SERVER}/api/get-editable-campaign?id=${session?.user?._id}&campaignId=${campaignId}`,
        { method: "GET" }
      );

      if (!response.ok) {
        throw new Error("There was and erorr with the request.");
      }

      const data = await response.json();
      const campaignInfo = data.campaignData?.map(
        (campaign: CampaignProperties) => {
          return {
            ...campaign?.campaign,
            campaign_name: campaign?.campaign?.name,
            ...campaign?.campaign_budget,
            budget_name: campaign?.campaign_budget?.name,
          };
        }
      );

      // setCampaignData(campaignInfo);
      // setIsLoading(false);
      return campaignInfo;
    } catch (err) {
      console.log(
        "There was an error with the GET request for editable campaign data.",
        err
      );
    }
  };

  return {
    isLoading,
    error,
    campaigns,
    getCampaigns,
    getShoppingCampaignNames,
    getEditableCampaign,
    campaignNames,
    campaignData,
  };
};

type AvailableProducts = {
  category: string;
  count?: number;
  formState: State;
};

type ApiResponse = {
  segmentTitle: string;
  titles: string;
};

type ListingScopeProps = {
  campaign_criterion: {
    listing_scope: {
      dimensions: [{ [key: string]: { [key: string]: string } }];
    };
  };
  campaign: { id: number | string };
};

export const useInventoryFilter = () => {
  const authContext = useContext(AuthContext);
  const { data: session } = useSession();
  const [filteredData, setFilterData] = useState<AvailableProducts[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { sendRequest, isPostLoading } = useHttp();

  const getFilteredData = useCallback(async (productFilter: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_SERVER}/api/inventory-filter?id=${session?.user?._id}&filterSegment=${productFilter}`,
        { method: "GET" }
      );

      if (!response.ok) {
        throw new Error("There was an error with the response.");
      }

      const data = await response.json();
      const queryResults = data.productsAvailable.map((item: ApiResponse) => ({
        category: item.segmentTitle,
        count: item.titles,
      }));

      setFilterData(queryResults);
      setIsLoading(false);
      return queryResults;
    } catch (err) {
      setIsLoading(false);
      console.error("There was an error retrieving inventory data.", err);
    }
  }, []);

  const getCampaignCriterionListingScope = useCallback(
    async (campaignId: string | number) => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_APP_SERVER}/api/get-listing-scope?id=${session?.user?._id}&campaignId=${campaignId}`
        );
        if (!response.ok) {
          throw new Error("Error retrieving listing scope data.");
        }
        const data = await response.json();

        const flattenListingScopeData = data.listingScope.map(
          (val: ListingScopeProps) => {
            return {
              ...val.campaign_criterion,
              ...val,
            };
          }
        );

        if (flattenListingScopeData.length > 0) {
          authContext?.dispatch({
            type: AuthActionTypes.SET_LISTING_SCOPE_DATA,
            listingScope: flattenListingScopeData[0],
          });
        } else {
          authContext?.dispatch({
            type: AuthActionTypes.SET_LISTING_SCOPE_DATA,
            listingScope: {},
          });
        }

        return flattenListingScopeData;
      } catch (err) {
        console.log(err);
      }
    },
    []
  );

  const updateCampaignCriterionListingScope = useCallback(
    async (
      campaignId: number | string,
      newListingScope: string,
      currentScope?: number,
      shouldRemove?: boolean
    ) => {
      try {
        const response = await sendRequest(
          `${process.env.NEXT_PUBLIC_APP_SERVER}/api/campaignActions/campaignCriterion/update-inventory-filter?id=${session?.user?._id}`,
          "POST",
          JSON.stringify({
            currentScopeId: currentScope,
            campaignId,
            newListingScope,
            shouldRemove,
          }),
          { "Content-Type": "application/json" }
        );
        if (!response.ok) {
          throw new Error(
            "Error with request to update campaign listing scope."
          );
        }
      } catch (err) {
        console.log(err);
      }
    },
    []
  );

  return {
    getFilteredData,
    getCampaignCriterionListingScope,
    updateCampaignCriterionListingScope,
    isPostLoading,
    filteredData,
    isLoading,
  };
};

export const useUpdateCampaign = () => {
  const { data: session } = useSession();
  const { isPostLoading, sendRequest } = useHttp();
  const [message, setMessage] = useState<string>("");
  const [updateDetailsSuccess, setupdatedDetailsSuccess] =
    useState<boolean>(false);

  //update single field campaign settings
  const updateCampaignSettings = useCallback(
    async (
      campaignId: string | number,
      campaignField: UpdateCampaignSettings
    ) => {
      try {
        const response = await sendRequest(
          `${process.env.NEXT_PUBLIC_APP_SERVER}/api/campaignActions/updateCampaignTypes/update-campaign-details?id=${session?.user?._id}&campaignId=${campaignId}`,
          "POST",
          JSON.stringify({ campaignField: campaignField }),
          { "Content-Type": "application/json" }
        );

        if (!response.ok) {
          throw new Error("There was an error updating the campaign");
        }
        setupdatedDetailsSuccess(response.ok);

        setMessage(response.message);
      } catch (err) {}
    },
    []
  );

  //update network settings
  const updateCampaignNetworkSettings = useCallback(
    async (
      campaignId: string | number,
      campaignField: UpdateCampainNetworkSettings
    ) => {
      try {
        const response = await sendRequest(
          `${process.env.NEXT_PUBLIC_APP_SERVER}/api/campaignActions/updateCampaignTypes/update-network-settings?id=${session?.user?._id}`,
          "POST",
          JSON.stringify({
            networkSettings: campaignField,
            campaignId: campaignId,
          }),
          { "Content-Type": "application/json" }
        );

        if (!response.ok) {
          throw new Error("There was an error updating the campaign");
        }
        setMessage(response.message);
      } catch (err) {}
    },
    []
  );

  //update campaign budget
  const updateCampaignBudgetSettings = useCallback(
    async (
      campaignId: string | number,
      newBudgetData: UpdateCampaignBudget,
      currentBudgetData: UpdateCampaignBudget
    ) => {
      try {
        const response = await sendRequest(
          `${process.env.NEXT_PUBLIC_APP_SERVER}/api/campaignActions/updateCampaignTypes/update-campaign-budget?id=${session?.user?._id}&campaignId=${campaignId}`,
          "POST",
          JSON.stringify({
            newBudgetData: newBudgetData,
            currentBudgetData: currentBudgetData,
          }),
          { "Content-Type": "application/json" }
        );

        if (!response.ok) {
          throw new Error("There was an error updating the campaign");
        }
        setMessage(response.message);
      } catch (err) {}
    },
    []
  );

  //update campaign budget
  const updateCampaignShoppingSettings = useCallback(
    async (
      campaignId: string | number,
      campaignField: UpdateShoppingSettings
    ) => {
      try {
        const response = await sendRequest(
          `${process.env.NEXT_PUBLIC_APP_SERVER}/api/campaignActions/updateCampaignTypes/update-campaign-shopping-settings?id=${session?.user?._id}&campaignId=${campaignId}`,
          "POST",
          JSON.stringify({ campaignShoppingSettings: campaignField }),
          { "Content-Type": "application/json" }
        );

        if (!response.ok) {
          throw new Error("There was an error updating the campaign");
        }
        setMessage(response.message);
      } catch (err) {}
    },
    []
  );

  //update campaign budget
  const updateCampaignGeoTargeting = useCallback(
    async (campaignId: string | number, campaignField: UpdateGeoTargetType) => {
      try {
        const response = await sendRequest(
          `${process.env.NEXT_PUBLIC_APP_SERVER}/api/campaignActions/updateCampaignTypes/update-geo-target-settings?id=${session?.user?._id}&campaignId=${campaignId}`,
          "POST",
          JSON.stringify({ geoTargetSettings: campaignField }),
          { "Content-Type": "application/json" }
        );

        if (!response.ok) {
          throw new Error("There was an error updating the campaign");
        }
        setMessage(response.message);
      } catch (err) {}
    },
    []
  );

  const updateBiddingStrategyType = useCallback(
    async (
      campaignId: number,
      biddingStrategy: UpdateBiddingStrategy,
      isEnhanced?: boolean,
      biddingValue?: number | string
    ) => {
      try {
        const response = await sendRequest(
          `${process.env.NEXT_PUBLIC_APP_SERVER}/api/campaignActions/updateCampaignTypes/update-bidding-strategy-type?id=${session?.user?._id}`,
          "POST",
          JSON.stringify({
            campaignId,
            biddingStrategy,
            isEnhanced,
            biddingValue,
          }),
          { "Content-Type": "application/json" }
        );
        if (!response.ok) {
          throw new Error(
            "There was an erorr with the request to update bidding strategy."
          );
        }
      } catch (err) {
        console.log(
          "There was an error with the request for updating bidding strategy type.",
          err
        );
      }
    },
    []
  );

  const updateLocalInventory = useCallback(
    async (campaignId: number | string, enableLocal: boolean) => {
      try {
        const response = await sendRequest(
          `${process.env.NEXT_PUBLIC_APP_SERVER}/api/campaignActions/updateCampaignTypes/update-local-inventory?id=${session?.user?._id}`,
          "POST",
          JSON.stringify({ campaignId, enableLocal }),
          { "Content-Type": "application/json" }
        );

        if (!response.ok) {
          throw new Error(
            "There was an Error with the request to update local inventory."
          );
        }
      } catch (err) {
        console.log("Local inventory updat error: ", err);
      }
    },
    []
  );

  return {
    isPostLoading,
    message,
    updateCampaignSettings,
    updateCampaignNetworkSettings,
    updateCampaignBudgetSettings,
    updateCampaignShoppingSettings,
    updateCampaignGeoTargeting,
    updateBiddingStrategyType,
    updateLocalInventory,
    //success flags,
    updateDetailsSuccess,
  };
};

export const useUpdateCampaignStatus = () => {
  const { data: session } = useSession();
  const { isPostLoading, sendRequest } = useHttp();
  const [message, setMessage] = useState<string>("");

  const updateCampaignStatus = useCallback(
    async (campaigns: {}, status: string) => {
      try {
        const response = await sendRequest(
          `${process.env.NEXT_PUBLIC_APP_SERVER}/api/campaignActions/campaign-status-update?id=${session?.user?._id}`,
          "POST",
          JSON.stringify({ campaigns: campaigns, status: status }),
          { "Content-Type": "application/json" }
        );

        if (!response.ok) {
          throw new Error(response.error);
        }

        setMessage(response.message);
      } catch (err) {}
    },
    []
  );

  return {
    isPostLoading,
    message,
    updateCampaignStatus,
  };
};

export const useDeleteCampaign = () => {
  const { data: session } = useSession();
  const { isPostLoading, sendRequest } = useHttp();
  const [message, setMessage] = useState<string>("");

  const deleteCampaign = useCallback(async (campaignId: {}) => {
    try {
      const response = await sendRequest(
        `${process.env.NEXT_PUBLIC_APP_SERVER}/api/campaignActions/delete-campaign?id=${session?.user?._id}`,
        "POST",
        JSON.stringify({ campaignIds: campaignId }),
        { "Content-Type": "application/json" }
      );

      if (!response.ok) {
        throw new Error(response.error);
      }

      setMessage(response.message);
    } catch (err) {}
  }, []);

  return {
    isPostLoading,
    message,
    deleteCampaign,
  };
};

export type AdScheduleProps = {
  campaign_criterion: AdSchedule;
};

export type AdSchedule = {
  ad_schedule: ScheduleItems;
  resource_name: string;
};

export type ScheduleItems = {
  day_of_week: number;
  start_hour: number;
  end_hour: number;
  start_minute: number;
  end_minute: number;
};
//campaign ad schedule
export const useAdScheduleApi = () => {
  const { data: session } = useSession();
  const { sendRequest, isPostLoading: isUpdatingSchedule } = useHttp();

  const getAdSchedule = useCallback(async (campaignId: string | number) => {
    //setAdScheduleIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_SERVER}/api/get-campaign-ad-schedule?id=${session?.user?._id}&campaignId=${campaignId}`,
        { method: "GET" }
      );

      if (!response.ok) {
        throw new Error(
          "There was an error retrieving the ad schedule info for this campaign."
        );
      }

      const data = await response.json();
      const schedule = data?.adScheduleResult?.map((val: AdScheduleProps) => {
        return {
          ...val.campaign_criterion,
        };
      });

      // setCampaignAdSchedule(schedule);
      // setAdScheduleIsLoading(false);
      return schedule;
    } catch (err) {
      // setAdScheduleIsLoading(false);
      console.log(
        "There was an error with the request to get campaign ad schedule: " +
          err
      );
    }
  }, []);

  type UpdateScheduleRequest = Record<
    string,
    {
      startTime: string;
      endTime: string;
      ids?: number[];
      day?: number | number[] | undefined;
    }
  >;

  const updateAdSchedule = useCallback(
    async (
      currentScheduleData: UpdateScheduleRequest,
      newScheduleData: UpdateScheduleRequest,
      campaignId: number | string
    ) => {
      try {
        await sendRequest(
          `${process.env.NEXT_PUBLIC_APP_SERVER}/api/campaignActions/campaignCriterion/update-ad-schedule?id=${session?.user?._id}`,
          "POST",
          JSON.stringify({ currentScheduleData, newScheduleData, campaignId }),
          { "Content-Type": "application/json" }
        );
      } catch (err) {
        console.log("Error with the request to update Schedule." + err);
      }
    },
    []
  );

  return {
    updateAdSchedule,
    isUpdatingSchedule,
    getAdSchedule,
  };
};
