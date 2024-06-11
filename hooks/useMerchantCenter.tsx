import { useCallback, useContext, useState } from "react";

import { useSession } from "next-auth/react";

import { AuthContext } from "@/context/auth-context";
import { AuthActionTypes } from "@/context/authActions";

export const useMerchantCenter = () => {
  const authContext = useContext(AuthContext);
  const { data: session } = useSession();
  const [resourceNames, setResourceNames] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getMerchantCenterId = useCallback(async () => {
    // setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_SERVER}/api/get-merchant-center-id?id=${session?.user?._id}`,
        { method: "GET" }
      );

      const data = await response.json();
      //setResourceNames(data.resourceNames);
      //setIsLoading(false);

      if (!authContext?.state.merchantCenterId) {
        authContext?.dispatch({
          type: AuthActionTypes.UPDATE_MERCHANT_CENTER_ID,
          merchantCenterId: data.resourceNames as string,
        });
      }

      return data.resourceNames;
    } catch (err) {
      //setIsLoading(false);
      console.log("There was an error retrieving the merchant center id.", err);
    }
  }, []);

  return {
    resourceNames,
    getMerchantCenterId,
    isLoading,
  };
};
