import { State } from "@/types";

export const createCampaignData = (
  formState: State,
  targetedLocations: string[],
  excludedLocations: string[],
  negativeKeywords: string[],
  isNewPortfolioStrategy: boolean,
  isExistingPortfolioStrategy: boolean
) => ({
  name: formState?.inputs?.budgetName?.value,
  enabled: formState?.inputs?.campaignEnabled?.value as boolean,
  enhancedClick: formState?.inputs?.enhancedClick?.value as boolean,
  priority: formState?.inputs?.campaignPriority?.value as number,
  targetGoogleSearch: formState?.inputs?.targetGoogleSearch?.value as boolean,
  targetSearchNetwork: formState?.inputs?.targetSearchNetwork?.value as boolean,
  biddingStrategyType: formState?.inputs?.biddingStrategyType?.value as number,
  geoTargetType: formState?.inputs?.geoTargetType?.value as number,
  targetedLocations: targetedLocations,
  excludedLocations: excludedLocations,
  negativeKeywords: negativeKeywords,
  inventoryFilters: formState?.inputs?.inventoryFilters?.value,
  existingPortfolioStrategy:
    formState?.inputs?.existingPortfolioStrategy?.value,
  newPortfolioStrategyName: formState?.inputs?.newPortfolioStrategyName?.value,
  targetRoasStrategyId: formState?.inputs?.targetRoasStrategyId?.value,
  targetRoasValue: formState?.inputs?.targetRoasValue?.value,
  costPerClick: formState?.inputs?.costPerClick?.value,
  localInventory: formState?.inputs?.localInventory?.value,
  isNewPortfolioStrategy: isNewPortfolioStrategy,
  isExistingPortfolioStrategy: isExistingPortfolioStrategy,
});

export const createBudgetData = (formState: State) => ({
  name: formState?.inputs?.budgetName?.value as string,
  amountMicros: formState?.inputs?.budgetAmount?.value as number,
  deliveryMethod: formState?.inputs?.budgetDeliveryMethod?.value as number,
  sharedCampaigns: formState?.inputs?.budgetShared?.value as boolean,
});
