import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import PercentIcon from "@mui/icons-material/Percent";

export type PromotionItemProps = {
  id: number;
  promoType: string;
  icon: React.ReactElement;
  description: string;
};

export const promoItems: PromotionItemProps[] = [
  {
    id: 0,
    promoType: "Percantage(%) Off",
    icon: <PercentIcon />,
    description: "Create a Percentage-based discount.",
  },

  {
    id: 1,
    promoType: "Amount($) Off",
    icon: <AttachMoneyIcon />,
    description: "Create an amount-based discount.",
  },
];
