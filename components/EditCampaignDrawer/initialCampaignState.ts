export const initialCampaignState = {
  id: {
    value: "",
    isValid: false,
  },
  status: {
    value: "",
    isValid: false,
  },
  campaignBudget: {
    value: "",
    isValid: false,
  },
  biddingStrategy: {
    value: "",
    isValid: false,
  },
  biddingStrategyType: {
    value: "",
    isValid: false,
  },
  advertisingChannelType: {
    value: "",
    isValid: false,
  },
  negativeGeoTargetType: {
    value: "",
    isValid: false,
  },
  positiveGeoTargetType: {
    value: "",
    isValid: false,
  },
  targetGoogleSearch: {
    value: false,
    isValid: true,
  },
  targetSearchNetwork: {
    value: false,
    isValid: true,
  },
  enhancedClick: {
    value: "",
    isValid: false,
  },
  campaignPriority: {
    value: "",
    isValid: false,
  },
  enableLocalInventory: {
    value: false,
    isValid: false,
  },
  salesCountry: {
    value: "",
    isValid: false,
  },
  campaignBudgetAmount: {
    value: "",
    isValid: false,
  },
  campaignBudgetName: {
    value: "",
    isValid: false,
  },
  campaignBudgetShared: {
    value: "",
    isValid: false,
  },
  campaignBudgetDelivery: {
    value: "",
    isValid: false,
  },
  existingPortfolioStrategy: {
    value: false,
    isValid: true,
  },
  campaignName: {
    value: "",
    isValid: false,
  },
};

type CampaignFields = {};
const setCampaignFields = (campaignData: any) => {
  const data = campaignData[0] || {};

  const campaignFields = data.reduce(
    (acc: keyof typeof initialCampaignState, field: string) => {
      let key, value;

      if (typeof field === "string") {
        key = field;
        value = data[field];
      } else {
      }
    }
  );
};
