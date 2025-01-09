import { useCallback, useState } from "react";

import { TShoppingPromotionRequest } from "@/types";

export const useShoppingPromotion = () => {
  const [isPostLoading, setIsPostLoading] = useState<boolean>(false);

  const getCurrentPromotions = useCallback(async (id: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_SERVER}/api/promotions/get-promotions?id=${id}`
      );

      const data = await response.json();

      if (!data.ok) {
        throw new Error(data.error);
      }
      return data.promotions;
    } catch (err) {
      console.log("error during request.", err);
    }
  }, []);

  const createPromotion = useCallback(
    async (promotion: TShoppingPromotionRequest, id: string) => {
      setIsPostLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_APP_SERVER}/api/promotions/create-promotion?id=${id}`,
          {
            method: "POST",
            body: JSON.stringify({ shoppingPromotion: promotion }),
            headers: { "Content-Type": "application/json" },
          }
        );

        const data = await response.json();

        if (!data.ok) {
          setIsPostLoading(false);
          throw new Error(data.error);
        }
        setIsPostLoading(false);
        return data;
      } catch (err) {
        setIsPostLoading(false);
        console.log(err);
      }
    },
    []
  );

  return { getCurrentPromotions, createPromotion, isPostLoading };
};
