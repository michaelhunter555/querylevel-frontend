import { CampaignText, CampaignType } from "./enums.campaignButtons";

type campaignOptions = {
  text: string;
  type: string;
}[];

export const campaignButtonOptions: campaignOptions = [
  {
    text: CampaignText.SHOPPING_AD,
    type: CampaignType.SHOPPING,
  },
  // {
  //   text: CampaignText.SEARCH_LOCAL_INVENTORY_AD,
  //   type: CampaignType.LOCAL_SHOPPING,
  //   icon: <LocalActivityIcon />,
  // },
  // {
  //   text: CampaignText.REMARKETING,
  //   type: CampaignType.REMARKET,
  //   icon: <RotateRightTwoToneIcon />,
  // },
];
