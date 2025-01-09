import { ReactElement } from "react";

import CodeIcon from "@mui/icons-material/Code";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import LocalOfferTwoToneIcon from "@mui/icons-material/LocalOfferTwoTone";
import PercentIcon from "@mui/icons-material/Percent";

import { CampaignText, CampaignType } from "./enums.campaignButtons";

type campaignOptions = {
  text: string;
  type: string;
  link?: string;
  icon?: ReactElement;
}[];

export const campaignButtonOptions: campaignOptions = [
  {
    text: CampaignText.SHOPPING_AD,
    type: CampaignType.SHOPPING,
    link: "/create-campaign",
    icon: <LocalOfferTwoToneIcon />,
  },
  {
    text: CampaignText.TIERED_CAMPAIGN,
    type: CampaignType.TIERED,
    link: "/create-tiered-campaigns",
    icon: <FilterAltIcon />,
  },
  {
    text: CampaignText.CREATE_CONVERSION,
    type: CampaignType.CONVERSION,
    link: "/conversion-tags-and-snippets",
    icon: <CodeIcon />,
  },
  {
    text: CampaignText.PROMOTION_TEXT,
    type: CampaignType.PROMOTION,
    link: "/manage-promotions?action=create",
    icon: <PercentIcon />,
  },
];
