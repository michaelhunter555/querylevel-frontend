import AccountTreeIcon from "@mui/icons-material/AccountTree";
import SsidChartIcon from "@mui/icons-material/SsidChart";

import {
  CampaignMenuItem,
  CampaignMenuItemComponent,
  CampaignMenuItemSecondaryText,
} from "./campaignSideBar.enum";

export const campaignMenuItems = [
  {
    text: CampaignMenuItem.AD_GROUP,
    secondary: CampaignMenuItemSecondaryText.AD_GROUP_SECONDARY,
    component: CampaignMenuItemComponent.AD_GROUP,
    icon: <AccountTreeIcon />,
  },
  {
    text: CampaignMenuItem.CAMPAIGN_CHART_DATA,
    secondary: CampaignMenuItemSecondaryText.CAMPAIGN_CHART_SECONDARY,
    component: CampaignMenuItemComponent.CAMPAIGN_CHART_DATA,
    icon: <SsidChartIcon />,
  },

  // {
  //   text: CampaignMenuItem.SEARCH_TERMS,
  //   secondary: CampaignMenuItemSecondaryText.SEARCH_TERMS_SECONDARY,
  //   component: CampaignMenuItemComponent.SEARCH_TERM,
  //   icon: <QueryStatsIcon />,
  // },
];
