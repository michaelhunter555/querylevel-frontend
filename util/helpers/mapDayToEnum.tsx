import { DayOfWeek } from "@/components/CreateCampaignSteps/CreateShoppingCampaign/shoppingCampaign.enums";

export const mapDayNumberToEnum = (
  dayNumber: number
): DayOfWeek | undefined => {
  switch (dayNumber) {
    case 2:
      return DayOfWeek.MONDAY;
    case 3:
      return DayOfWeek.TUESDAY;
    case 4:
      return DayOfWeek.WEDNESDAY;
    case 5:
      return DayOfWeek.THURSDAY;
    case 6:
      return DayOfWeek.FRIDAY;
    case 7:
      return DayOfWeek.SATURDAY;
    case 8:
      return DayOfWeek.SUNDAY;
    default:
      return undefined;
  }
};
