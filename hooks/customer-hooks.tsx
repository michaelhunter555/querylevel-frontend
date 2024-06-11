import { useCallback, useContext, useState } from "react";

import { useSession } from "next-auth/react";

import { AuthContext } from "@/context/auth-context";
import { AuthActionTypes } from "@/context/authActions";
import { ProductPerformanceData } from "@/types";

import useHttp from "./http-hook";

export const useGetAppAnalytics = () => {
  const { data: session } = useSession();
  const authContext = useContext(AuthContext);
  const [shoppingPerformanceData, setShoppingPerformanceData] = useState<
    ProductPerformanceData[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  const getCurrentAnalytics = useCallback(
    async (id: string, segment: string) => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_APP_SERVER}/api/get-app-analytics?id=${id}&segment=${segment}`,
          { method: "GET" }
        );

        const data = await response.json();

        const flattenData: ProductPerformanceData[] = data?.analytics?.map(
          (product: ProductPerformanceData) => {
            return {
              ...product?.campaign,
              ...product?.segments,
              ...product?.metrics,
            };
          }
        );

        if (!authContext?.state?.accountId) {
          authContext?.dispatch({
            type: AuthActionTypes.LOGIN,
            accountId: session?.user?._id as string,
          });
        }

        // setIsLoading(false);
        return flattenData;
      } catch (err) {
        //setIsLoading(false);
        console.log(
          "There was an error getting account analytics in AccountDataCard.tsx",
          err
        );
      }
    },
    []
  );

  return {
    getCurrentAnalytics,
    isLoading,
    shoppingPerformanceData,
  };
};

export const useKeywordCleanUpService = () => {
  const { data: session } = useSession();
  const [operationResult, setOperationResult] = useState("");
  const { sendRequest, isPostLoading } = useHttp();

  const runKeywordCleanUpCheckAndService = async (
    segment: string,
    campaignId: string | number,
    brand: string,
    operationLevel: string
  ) => {
    try {
      const response = await sendRequest(
        `${process.env.NEXT_PUBLIC_APP_SERVER}/api/KeywordCleanUpService/keyword-clean-up?id=${session?.user?._id}&segment=${segment}`,
        "POST",
        JSON.stringify({ campaignId, brand, operationLevel }),
        { "Content-Type": "application/json" }
      );

      const data = await response.json();

      setOperationResult(
        `${data.message} - added ${data.count} keywords. View this segment in Search Terms to see added keywords for segment.`
      );
    } catch (err) {
      console.log(err);
    }
  };

  return {
    operationResult,
    runKeywordCleanUpCheckAndService,
    isPostLoading,
  };
};
