import { useCallback, useState } from "react";

import { useSession } from "next-auth/react";

import { GetConversionDataResponse, WebsiteConversion } from "@/types";

import useHttp from "./http-hook";

export const useCreateConversion = () => {
  const { data: session } = useSession();
  const { isPostLoading, sendRequest, error, clearError } = useHttp();
  const [response, setResponse] = useState("");

  const createWebsiteConversion = useCallback(
    async (conversion: WebsiteConversion) => {
      try {
        const response = await sendRequest(
          `${process.env.NEXT_PUBLIC_APP_SERVER}/api/conversionActions/create-conversion-action?id=${session?.user?._id}`,
          "POST",
          JSON.stringify({ conversionData: conversion }),
          { "Content-Type": "application/json" }
        );

        setResponse(response.ok);
      } catch (err) {
        console.log("There was an error with the sending the request.", err);
      }
    },
    []
  );

  return {
    isPostLoading,
    error,
    clearError,
    createWebsiteConversion,
    response,
  };
};

//set conversionData type here...

export const useGetConversionData = () => {
  const { data: session } = useSession();
  const { sendRequest, isPostLoading } = useHttp();
  const id = session?.user?._id;

  const getConversionData = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_SERVER}/api/get-conversion-data?id=${id}`,
        { method: "GET" }
      ); //change !!

      if (!response.ok) {
        throw new Error(
          "There was an error with the request to get conversion data."
        );
      }

      const data = await response.json();
      const flattenData = data.conversionData?.map(
        (resource: GetConversionDataResponse) => {
          return {
            ...resource?.conversion_action,
            allConversions: resource.metrics.all_conversions,
          };
        }
      );

      return flattenData;
    } catch (err) {
      console.log(err);
    }
  }, []);

  const updateWebsiteConversion = useCallback(
    async (newConversionData: WebsiteConversion, conversionId: number) => {
      try {
        await sendRequest(
          `${process.env.NEXT_PUBLIC_APP_SERVER}/api/conversionActions/update-conversion-action?id=${id}`,
          "POST",
          JSON.stringify({ newConversionData, conversionId }),
          { "Content-Type": "application/json" }
        );
      } catch (err) {
        console.log(err);
      }
    },
    []
  );

  const removeWebConversion = useCallback(async (conversionIds: string[]) => {
    try {
      await sendRequest(
        `${process.env.NEXT_PUBLIC_APP_SERVER}/api/conversionActions/remove-conversion-action?id=${id}`,
        "POST",
        JSON.stringify({ conversionIds }),
        { "Content-Type": "application/json" }
      );
    } catch (err) {
      console.log(err);
    }
  }, []);

  return {
    getConversionData,
    removeWebConversion,
    updateWebsiteConversion,
    isPostLoading,
  };
};
