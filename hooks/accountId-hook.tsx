import { useCallback, useState } from "react";

import { useSession } from "next-auth/react";

import useHttp from "./http-hook";

export const useGetGoogleAdAccountId = () => {
  const { data: session, update } = useSession();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [accountIdError, setAccountIdError] = useState<boolean>(false);
  const [resourceNamesArray, setResourceNamesArray] = useState<string[]>([]);
  const { sendRequest, isPostLoading } = useHttp();

  const getResourceNamesHandler = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_SERVER}/api/get-resource-names?id=${session?.user._id}`,
        { method: "GET" }
      );

      const data = await response.json();

      if (!response.ok) {
        setAccountIdError(data.noAccountId);
        throw new Error(
          "There was an error with the request to get resource names."
        );
      }

      //const data = await response.json();

      const updateUser = {
        ...session,
        user: {
          ...session?.user,
          googleAccountId: data.resourceName,
        },
      };
      await update(updateUser);

      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      console.log(
        "There was an error with the request to update google Account Id",
        err
      );
    }
  }, [session?.user?._id, update]);

  const setResourceNameHandler = useCallback(
    async (googleAccountId: string) => {
      try {
        const response = await sendRequest(
          `${process.env.NEXT_PUBLIC_APP_SERVER}/api/set-resource-names?id=${session?.user?._id}`,
          "POST",
          JSON.stringify({ googleAccountId: googleAccountId }),
          { "Content-Type": "application/json" }
        );

        if (!response.ok) {
          throw new Error("Error with the request. Please check console.");
        }

        const updateUser = {
          ...session,
          user: {
            ...session?.user,
            googleAccountId: response.googleAccountId,
          },
        };

        await update(updateUser);
      } catch (err) {}
    },
    [session?.user?._id, update]
  );

  return {
    accountIdError,
    isLoading,
    getResourceNamesHandler,
    resourceNamesArray,
    setResourceNameHandler,
    isPostLoading,
  };
};
