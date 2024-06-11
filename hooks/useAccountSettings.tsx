import { useCallback, useState } from "react";

import { useSession } from "next-auth/react";

import useHttp from "@/hooks/http-hook";

export const useAccountSettings = () => {
  const { data: session, update } = useSession();
  const userId = session?.user?._id;
  const [deleteMessage, setDeleteMessage] = useState("");
  const [updateMessage, setUpdateMessage] = useState("");
  const { sendRequest, isPostLoading } = useHttp();

  const getAccountSettings = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_SERVER}/api/plans/get-user-account-settings?id=${userId}`
      );

      if (!response.ok) {
        const data = await response.json();
        return data.message;
      }

      const data = await response.json();

      return {
        ...data.user,
        amountDue: data.amountDue,
        charges: data.charges,
      };
    } catch (err) {
      console.log(err);
    }
  }, []);

  const selectPaymentPlan = useCallback(
    async (userPricePlan: string, planName: string) => {
      try {
        const response = await sendRequest(
          `${process.env.NEXT_PUBLIC_APP_SERVER}/api/plans/selectNewPlan?id=${userId}`,
          "POST",
          JSON.stringify({
            selectedPricePlan: userPricePlan,
            selectedPlan: planName,
          }),
          { "Content-Type": "application/json" }
        );

        if (!response.ok) {
          throw new Error(
            "There was an error with the request to select a plan."
          );
        }
        return response.url;
      } catch (err) {
        console.log(err);
      }
    },
    [userId, sendRequest]
  );

  const deleteUserSubscription = useCallback(async (subscriptionId: string) => {
    const response = await sendRequest(
      `${process.env.NEXT_PUBLIC_APP_SERVER}/api/plans/delete-plan?id=${userId}`,
      "POST",
      JSON.stringify({ subscriptionId }),
      { "Content-Type": "application/json" }
    );

    if (!response.ok) {
      throw new Error("Error with attempt to delete user subscription.");
    }

    const updateUser = {
      ...session,
      user: {
        ...session?.user,
        planType: response.planType,
      },
    };

    await update(updateUser);
    setDeleteMessage(response.message);
  }, []);

  const upgradeSubscription = useCallback(
    async (newPriceId: string, newPlanName: string) => {
      try {
        const response = await sendRequest(
          `${process.env.NEXT_PUBLIC_APP_SERVER}/api/plans/update-plan?id=${userId}`,
          "POST",
          JSON.stringify({ newPriceId, newPlanName }),
          { "Content-Type": "application/json" }
        );

        if (!response.ok) {
          throw new Error("Error with updating the subscription.");
        }

        const updateUser = {
          ...session,
          user: {
            ...session?.user,
            planType: response.planType,
          },
        };

        await update(updateUser);

        setUpdateMessage(response.message);
      } catch (err) {
        console.log(err);
      }
    },
    []
  );

  const viewProrationUpgrade = useCallback(
    async (
      priceId: string,
      stripeCustomerId: string,
      stripeSubscriptionId: string
    ) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_SERVER}/api/plans/proration-preview?id=${userId}&pricePreview=${priceId}&stripeCustomerId=${stripeCustomerId}&stripeSubscriptionId=${stripeSubscriptionId}`
      );

      if (!response.ok) {
        throw new Error("Error with retrieving preview.");
      }
      const data = await response.json();
      return data.invoicePreview;
    },
    []
  );

  return {
    viewProrationUpgrade,
    upgradeSubscription,
    deleteUserSubscription,
    getAccountSettings,
    selectPaymentPlan,
    isPostLoading,
    deleteMessage,
    updateMessage,
  };
};
