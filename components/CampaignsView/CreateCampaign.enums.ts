export enum BudgetDeliveryMethod {
  UNSPECIFIED = 0,
  UNKNOWN = 1,
  STANDARD = 2,
  ACCELERATED = 3,
}

export const selectBudgetDelivery = {
  [BudgetDeliveryMethod.STANDARD]: "STANDARD",
  [BudgetDeliveryMethod.ACCELERATED]: "ACCELERATED",
};

export const campaignPriority = {
  LOW: 0,
  MEDIUM: 1,
  HIGH: 2,
};

export const selectCampaignPriority = {
  [campaignPriority.LOW]: "LOW PRIORITY",
  [campaignPriority.MEDIUM]: "MEDIUM PRIORITY",
  [campaignPriority.HIGH]: "HIGH PRIORITY",
};

export const BiddingStrategyType = {
  ENHANCED_CPC: 2, // ENHANCED_CPC
  MANUAL_CPA: 18, // MANUAL_CPA
  MANUAL_CPC: 3, // MANUAL_CPC
  MANUAL_CPM: 4, // MANUAL_CPM
  MANUAL_CPV: 13, // MANUAL_CPV
  MAXIMIZE_CONVERSIONS: 10, // MAXIMIZE_CONVERSIONS
  MAXIMIZE_CONVERSION_VALUE: 11, // MAXIMIZE_CONVERSION_VALUE
  PAGE_ONE_PROMOTED: 5, // PAGE_ONE_PROMOTED
  PERCENT_CPC: 12, // PERCENT_CPC
  TARGET_CPA: 6, // TARGET_CPA
  TARGET_CPM: 14, // TARGET_CPM
  TARGET_IMPRESSION_SHARE: 15, // TARGET_IMPRESSION_SHARE
  TARGET_OUTRANK_SHARE: 7, // TARGET_OUTRANK_SHARE
  TARGET_ROAS: 8, // TARGET_ROAS
  TARGET_SPEND: 9, // TARGET_SPEND
};

export const selectBiddingStrategy = {
  [BiddingStrategyType.MANUAL_CPC]: "MANUAL CPC",
  [BiddingStrategyType.TARGET_ROAS]: "TARGET ROAS",
};

export enum PositiveGeoTargetType {
  UNSPECIFIED = 0, // UNSPECIFIED
  UNKNOWN = 1, // UNKNOWN
  PRESENCE_OR_INTEREST = 5, // PRESENCE_OR_INTEREST
  SEARCH_INTEREST = 6, // SEARCH_INTEREST
  PRESENCE = 7, // PRESENCE
}

export const selectGeoTargeting = {
  [PositiveGeoTargetType.PRESENCE_OR_INTEREST]: "PRESENCE OR INTEREST",
  [PositiveGeoTargetType.PRESENCE]: "PRESENCE",
};
