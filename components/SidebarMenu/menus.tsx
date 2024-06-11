import React from "react";

import AccountTreeTwoToneIcon from "@mui/icons-material/AccountTreeTwoTone";
import MailTwoToneIcon from "@mui/icons-material/MailTwoTone";
import OtherHousesTwoToneIcon from "@mui/icons-material/OtherHousesTwoTone";
import PsychologyTwoToneIcon from "@mui/icons-material/PsychologyTwoTone";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import ScreenSearchDesktopIcon from "@mui/icons-material/ScreenSearchDesktop";
import TableChartTwoToneIcon from "@mui/icons-material/TableChartTwoTone";

import {
  MenuComponent,
  MenuSecondText,
  MenuText,
  PageRoutes,
} from "./enums.menuItems";

interface MenuItem {
  text: string;
  secondary?: string;
  component: string;
  icon: React.ReactNode;
  route: string;
}

export const menuItems: MenuItem[] = [
  {
    text: MenuText.HOME,
    secondary: MenuSecondText.HOME,
    component: MenuComponent.AUTHENTICATE,
    icon: <OtherHousesTwoToneIcon />,
    route: PageRoutes.USER_DASHBOARD,
  },
  {
    text: MenuText.MY_CAMPAIGNS,
    secondary: MenuSecondText.MY_CAMPAIGNS,
    component: MenuComponent.CAMPAIGN,
    icon: <TableChartTwoToneIcon />,
    route: PageRoutes.CAMPAIGN_VIEW,
  },
  {
    text: MenuText.CREATE_NEW_CAMPAIGN,
    secondary: MenuSecondText.CREATE_NEW_CAMPAIGN,
    component: MenuComponent.CREATE_CAMPAIGN,
    icon: <AccountTreeTwoToneIcon />,
    route: PageRoutes.CREATE_TIERED,
  },
  {
    // was added to render component FOR NOW
    text: MenuText.SEARCH_TERM_VIEW,
    secondary: MenuSecondText.SEARCH_TERM_VIEW,
    component: MenuComponent.SEARCH_TERM_VIEW,
    icon: <ScreenSearchDesktopIcon />,
    route: PageRoutes.SEARCH_TERM_VIEW,
  },
  {
    text: MenuText.CREATE_CONVERSION,
    secondary: MenuSecondText.CREATE_CONVERSION,
    component: MenuComponent.CREATE_CONVERSION,
    icon: <PsychologyTwoToneIcon />,
    route: PageRoutes.CONVERSIONS,
  },
  {
    text: MenuText.USER_SETTINGS,
    secondary: MenuSecondText.USER_SETTINGS,
    component: MenuComponent.USER_SETTINGS,
    icon: <ReceiptLongIcon />,
    route: PageRoutes.USER_SETTINGS,
  },
  {
    text: MenuText.CONTACT,
    component: MenuComponent.CONTACT,
    icon: <MailTwoToneIcon />,
    route: PageRoutes.CONTACT_US,
  },
];
