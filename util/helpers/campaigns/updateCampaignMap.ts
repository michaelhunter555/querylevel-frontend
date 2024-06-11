import { enums } from "google-ads-api";

import { State } from "@/types";

export const createUpdateCampaignSettings = (formState: State) => ({
  name: formState?.inputs?.campaignName?.value as string,
});

export const createUpdateNetworkSettings = (formState: State) => ({
  target_google_search: formState?.inputs?.targetGoogleSearch?.value as boolean,
  target_search_network: formState?.inputs?.targetSearchNetwork
    ?.value as boolean,
});

export const createUpdateCampaignBudget = (formState: State) => ({
  resource_name: formState?.inputs?.campaignBudget?.value as string,
  explicitly_shared: formState?.inputs?.campaignBudgetShared?.value as boolean,
  amount_micros: formState?.inputs?.campaignBudgetAmount?.value as number,
  delivery_method: formState?.inputs?.campaignBudgetDelivery
    ?.value as enums.BudgetDeliveryMethod,
});

export const createUpdateCampaignGeoTargetType = (formState: State) => ({
  negative_geo_target_type: formState?.inputs?.negativeGeoTargetType
    ?.value as enums.NegativeGeoTargetType,
  positive_geo_target_type: formState?.inputs?.positiveGeoTargetType
    ?.value as enums.PositiveGeoTargetType,
});

export const createUpdateCampaignShoppingSettings = (formState: State) => ({
  campaign_priority: formState?.inputs?.campaignPriority?.value as number,
});

export const createUpdateCampaignBiddingStrategyType = (formState: State) => ({
  bidding_strategy_type: formState?.inputs?.biddingStrategyType?.value, // number
  bidding_strategy: formState?.inputs?.biddingStrategy?.value, // string
  ...(formState?.inputs?.newPortfolioStrategyName?.value
    ? {
        strategy_name: formState?.inputs?.newPortfolioStrategyName?.value,
      }
    : {}),
  ...(formState?.inputs?.targetRoasValue?.value
    ? {
        target_roas: formState?.inputs?.targetRoasValue?.value,
      }
    : {}),
  ...(formState?.inputs?.enhancedClick?.value
    ? {
        enhanced_click: formState?.inputs?.enhancedClick?.value,
      }
    : {}),
});
