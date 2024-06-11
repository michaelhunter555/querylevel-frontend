import { useCallback, useState } from "react";

import { useSession } from "next-auth/react";

import { AdGroupCriterionResource, CriterionData } from "@/types";

import useHttp from "./http-hook";

export const useGetProductPartitions = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [criterionIsLoading, setCriterionIsLoading] = useState<boolean>(false);
  const [productGroups, setProductGroups] = useState<
    AdGroupCriterionResource[]
  >([]);
  const [criterionData, setCriterionData] = useState<CriterionData[]>([]);
  const { data: session } = useSession();

  const getProductPartitions = useCallback(
    async (status: string, segment: string, adGroupId: string | number) => {
      setIsLoading(true);

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_APP_SERVER}/api/reports/product-partition-metrics?id=${session?.user?._id}&status=${status}&segment=${segment}&adGroupId=${adGroupId}`
        );

        if (!response.ok) {
          throw new Error(
            "There was an error retrieving product partition metrics."
          );
        }

        const data = await response.json();
        const flattenData = data.productGroupView.map((val: any) => {
          return {
            adGroupResource: val.ad_group.resource_name,
            AdGroupCriterionResource: val.ad_group_criterion.resource_name,
            ...val.ad_group_criterion,
            ...val.metrics,
            ...val.ad_group,
            ...val.segments,
          };
        });

        setProductGroups(flattenData);
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        console.log(
          "There was an error retrieving product partition data.",
          err
        );
      }
    },
    []
  );

  const getEditablePartitions = useCallback(async () => {
    setCriterionIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_SERVER}/api/adGroupActions/AdGroupCriterionActions/getAvailablePartitions?id=${session?.user?._id}`,
        { method: "GET" }
      );
      if (!response.ok) {
        throw new Error(
          "There was an error with the request to retrieve ad_group_criterion data for the selected Id."
        );
      }
      const data = await response.json();
      setCriterionData(data.result);
      setCriterionIsLoading(false);
      return data.result;
    } catch (err) {
      setCriterionIsLoading(false);
      console.log("There was an error with the request", err);
    }
  }, []);

  return {
    isLoading,
    productGroups,
    getProductPartitions,
    getEditablePartitions,
    criterionData,
    criterionIsLoading,
  };
};

//Edit Partitions Hook
export const useEditProductPartition = () => {
  const { data: session } = useSession();
  const [partitionResponse, setPartitionResponse] = useState<boolean>(false);
  const { sendRequest, isPostLoading } = useHttp();

  const editPartitionTree = useCallback(
    async (
      selectedNode: AdGroupCriterionResource,
      partition: CriterionData[],
      removedPartitions: string[],
      adGroupResource: string
    ): Promise<void> => {
      try {
        const response = await sendRequest(
          `${process.env.NEXT_PUBLIC_APP_SERVER}/api/adGroupActions/AdGroupCriterionActions/product-partition-operation?id=${session?.user?._id}`,
          "POST",
          JSON.stringify({
            partitionData: partition,
            removedPartitions: removedPartitions,
            adGroupResource: adGroupResource,
            selectedNode: selectedNode,
          }),
          { "Content-Type": "application/json" }
        );

        if (response.ok) {
          setPartitionResponse(response.ok);
        }
        console.log("hook:", response.ok);
      } catch (err) {
        console.log("There was an error while attempting to add subdivision.");
      }
    },
    []
  );

  const resetPartitionResponse = useCallback(() => {
    setPartitionResponse(false);
  }, []);

  return {
    partitionResponse,
    editPartitionTree,
    isPostLoading,
    resetPartitionResponse,
  };
};

export const useCreateRootPartitionNode = () => {
  const { data: session } = useSession();
  const [createRootNodeSuccess, setCreateRootNodeSuccess] =
    useState<boolean>(false);
  const [createRootNodeIsLoading, setCreateRootNodeIsLoading] =
    useState<boolean>(false);

  const createRootNode = useCallback(async (adGroupId: string | number) => {
    setCreateRootNodeIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_SERVER}/api/adGroupActions/AdGroupCriterionActions/create-root-node?id=${session?.user?._id}&adGroupId=${adGroupId}`
      );

      if (!response.ok) {
        throw new Error("Error with request to create root node.");
      }

      const data = await response.json();
      setCreateRootNodeSuccess(data.ok);
      setCreateRootNodeIsLoading(false);
    } catch (err) {
      setCreateRootNodeIsLoading(false);
      console.log("Failed to create root node");
    }
  }, []);

  const resetCreateRootNodeSuccess = useCallback(() => {
    setCreateRootNodeSuccess(false);
  }, []);

  return {
    createRootNode,
    createRootNodeIsLoading,
    createRootNodeSuccess,
    resetCreateRootNodeSuccess,
  };
};

export const useUpdateNegativeStatus = () => {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [updateNegativeSucess, setUpdateNegativeSucess] = useState(false);

  const updateNegativeStatus = useCallback(
    async (selectedNode: AdGroupCriterionResource, cpc: number | null) => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_APP_SERVER}/api/adGroupActions/AdGroupCriterionActions/target-exclude-criterion?id=${session?.user?._id}`,
          {
            method: "POST",
            body: JSON.stringify({ selectedNode, cpcBid: cpc }),
            headers: { "Content-Type": "application/json" },
          }
        );

        if (!response.ok) {
          throw new Error(
            "There was an error chaning the negative status of the node"
          );
        }
        setUpdateNegativeSucess(response.ok);
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        console.log("ERROR in updateNegativeStatus:", err);
      }
    },
    []
  );

  const resetUpdateNegativeSucess = useCallback(async () => {
    setUpdateNegativeSucess(false);
  }, []);

  return {
    isLoading,
    updateNegativeStatus,
    updateNegativeSucess,
    resetUpdateNegativeSucess,
  };
};

export const useUpdateCpcBids = () => {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [updateCpcBidSuccess, setUpdateCpcBidSuccess] = useState(false);

  const updateCpCMicros = useCallback(
    async (selectedNode: AdGroupCriterionResource, cpc: number | null) => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_APP_SERVER}/api/adGroupActions/AdGroupCriterionActions/update-cpc?id=${session?.user?._id}`,
          {
            method: "POST",
            body: JSON.stringify({ selectedNode, cpcBid: cpc }),
            headers: { "Content-Type": "application/json" },
          }
        );

        if (!response.ok) {
          throw new Error(
            "There was an error chaning the negative status of the node"
          );
        }
        setUpdateCpcBidSuccess(response.ok);
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        console.log("ERROR in updateNegativeStatus:", err);
      }
    },
    []
  );

  const resetUpdateCpcBidSuccess = useCallback(async () => {
    setUpdateCpcBidSuccess(false);
  }, []);

  return {
    isLoading,
    updateCpCMicros,
    updateCpcBidSuccess,
    resetUpdateCpcBidSuccess,
  };
};
