type BrandKeyword = string | undefined;

export const createTierCampaignFields = {
  budget: {
    value: 15,
    isValid: true,
  },
  cpc: {
    value: 0.15,
    isValid: true,
  },
  campaignType: {
    value: "",
    isValid: false,
  },
  bidSeparation: {
    value: 0.1,
    isValid: true,
  },
  enabled: {
    value: false,
    isValid: true,
  },
  enhancedClick: {
    value: false,
    isValid: true,
  },
};

//const fields = createTierCampaignFields(brandKeyword)
