import { NestedProps, UserCampaign } from "@/types";

//organizes campaigns by id and aggregates metric data accordingly
export const campaignView = (
  campaigns: UserCampaign[] | NestedProps[] | undefined
) => {
  let campaignMap = new Map();

  campaigns?.forEach((campaign) => {
    if (!campaignMap.has(campaign.id)) {
      campaignMap.set(campaign.id, {
        ...campaign,
        clicks: 0,
        impressions: 0,
        ctr: 0,
        average_cpc: 0,
        cost_micros: 0,
        all_conversions: 0,
      });
    }

    let existingCampaign = campaignMap.get(campaign.id);

    existingCampaign.clicks += campaign.clicks;
    existingCampaign.impressions += campaign.impressions;
    existingCampaign.cost_micros += campaign.cost_micros;
    existingCampaign.all_conversions += campaign.all_conversions;

    if (existingCampaign.impressions > 0) {
      existingCampaign.ctr =
        (existingCampaign.clicks / existingCampaign.impressions) * 100;
    } else {
      existingCampaign.ctr = 0;
    }

    if (existingCampaign.clicks > 0) {
      existingCampaign.average_cpc =
        existingCampaign.cost_micros / existingCampaign.clicks / 1000000;
    } else {
      existingCampaign.average_cpc = 0;
    }
  });
  return campaignMap;
};
