export const createCampaignCards = (
  clicks: number,
  conversions: number,
  impressions: number,
  ctr: number,
  cost: number
) => [
  { name: "Clicks", value: clicks },
  { name: "Impressions", value: impressions },
  { name: "CTR", value: ctr.toFixed(2) + " %" },
  { name: "Cost", value: "$ " + cost.toFixed(2) },
  { name: "Conversions", value: conversions },
];
