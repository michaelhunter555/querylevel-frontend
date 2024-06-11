export const formStateHelper = (campaignData: { [key: string]: any }[]) => {
  return {
    id: {
      value: campaignData[0]?.id || "",
      isValid: true,
    },
    status: {
      value: campaignData[0]?.status || "",
      isValid: true,
    },
    campaignBudget: {
      value: campaignData[0]?.campaign_budget || "",
      isValid: true,
    },
    biddingStrategy: {
      value: campaignData[0]?.bidding_strategy || "",
      isValid: true,
    },
    biddingStrategyType: {
      value: campaignData[0]?.bidding_strategy_type || "",
      isValid: true,
    },
    advertisingChannelType: {
      value: campaignData[0]?.advertising_channel_type || "",
      isValid: true,
    },
    negativeGeoTargetType: {
      value:
        campaignData[0]?.geo_target_type_setting?.negative_geo_target_type ||
        "",
      isValid: true,
    },
    positiveGeoTargetType: {
      value:
        campaignData[0]?.geo_target_type_setting?.positive_geo_target_type ||
        "",
      isValid: true,
    },
    targetGoogleSearch: {
      value: campaignData[0]?.network_settings?.target_google_search || false,
      isValid: true,
    },
    targetSearchNetwork: {
      value: campaignData[0]?.network_settings?.target_search_network || false,
      isValid: true,
    },
    enhancedClick: {
      value: campaignData[0]?.manual_cpc?.enhanced_cpc_enabled || false,
      isValid: true,
    },
    campaignPriority: {
      value:
        campaignData[0]?.shopping_setting?.campaign_priority?.toString() || "",
      isValid: true,
    },
    enableLocalInventory: {
      value: campaignData[0]?.shopping_setting?.enable_local || false,
      isValid: true,
    },
    salesCountry: {
      value: campaignData[0]?.shopping_setting?.sales_country || "",
      isValid: true,
    },
    // budget
    campaignBudgetAmount: {
      value: campaignData[0]?.amount_micros / 1000000 || "",
      isValid: true,
    },
    campaignBudgetShared: {
      value: (campaignData[0]?.explicitly_shared as boolean) || false,
      isValid: true,
    },
    campaignBudgetDelivery: {
      value: campaignData[0]?.delivery_method || "",
      isValid: true,
    },
    campaignBudgetName: {
      value: campaignData[0]?.budget_name || "",
      isValid: true,
    },
    campaignName: {
      value: campaignData[0]?.campaign_name || "",
      isValid: true,
    },
  };
};
