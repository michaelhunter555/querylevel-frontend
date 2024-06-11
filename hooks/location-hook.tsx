import { useCallback, useState } from "react";

import { useSession } from "next-auth/react";

export interface StateData {
  geo_target_constant: {
    canonical_name?: string;
    name: string;
    id: number;
    country_code: string;
    resource_name?: string;
  };
}

export const useGetUnitedStates = () => {
  const { data: session } = useSession();
  const [unitedStates, setUnitedStates] = useState<StateData[]>([]);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getStates = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_SERVER}/api/get-us-states-query?id=${session?.user?._id}&accountId=${session?.user?.googleAccountId}`,
        {
          method: "GET",
        }
      );
      const data = await response.json();
      console.log("states Data response.", data);
      const states = data.states.map(
        (item: StateData) => item.geo_target_constant
      );
      setUnitedStates(states);
      setIsLoading(false);
    } catch (err) {
      console.log("Error getting states data.", err);
      setError(true);
      setIsLoading(false);
    }
  }, []);

  const clearError = () => {
    setError(false);
  };

  return {
    unitedStates,
    error,
    isLoading,
    getStates,
    clearError,
  };
};

type CampaignLocationInfo = {
  campaign: { id: number };
  campaign_criterion: {
    location: {
      geo_target_constant: string;
    };
    criterion_id: number;
    negative: boolean;
  };
  campaignId: number;
  location: {
    geo_target_constant: string;
  };
  criterion_id: number;
  negative: boolean;
};

export const useGeoTargetConstants = () => {
  const { data: session } = useSession();
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  const getGeoTargetConstants = useCallback(
    async (campaignId: string | number) => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_APP_SERVER}/api/get-targeted-geo-constants?id=${session?.user?._id}&campaignId=${campaignId}`,
          { method: "GET" }
        );

        if (!response.ok) {
          throw new Error(
            "There was an error with the request to find location settings."
          );
        }

        const data = await response.json();
        const flattenData = data.locationResult.map(
          (location: CampaignLocationInfo) => {
            return {
              campaignId: location.campaign.id,
              ...location.campaign_criterion,
            };
          }
        );

        return flattenData;
      } catch (err) {
        console.log("Error with the request. Please check code: ", err);
      }
    },
    []
  );

  const updateGeoLocation = useCallback(
    async (
      currentLocations: CampaignLocationInfo[],
      targetedLocations: string[],
      excludedLocations: string[],
      campaignId: number
    ) => {
      setIsUpdating(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_APP_SERVER}/api/campaignActions/campaignCriterion/edit-geo-targeting-constants?id=${session?.user?._id}`,
          {
            method: "POST",
            body: JSON.stringify({
              currentLocations,
              targetedLocations,
              excludedLocations,
              campaignId,
            }),
            headers: { "Content-Type": "application/json" },
          }
        );

        if (!response.ok) {
          throw new Error("There was an error updating geo target constants.");
        }

        setIsUpdating(false);
      } catch (err) {
        setIsUpdating(false);
        console.log(
          "There was an error with the request to update geo location",
          err
        );
      }
    },
    []
  );

  return {
    getGeoTargetConstants,
    updateGeoLocation,
    isUpdating,
  };
};
