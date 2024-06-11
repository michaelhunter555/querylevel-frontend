//campaign structure
export enum ShoppingCampaignTypes {
  ALPHA_BETA = "alpha/beta",
  THREE_TIERED = "three-tiered",
}

//separate bids from high to low by percentage (high campaign gets lowest bid set by user)
export enum cpcBidSeparation {
  ZERO_PERCENT = 0,
  FIVE_PERCENT = 0.05,
  TEN_PERCENT = 0.1,
  FIFTEEN_PERCENT = 0.15,
  TWENTY_PERCENT = 0.2,
  TWENTY_FIVE_PERCENT = 0.25,
  THIRTY_PERCENT = 0.3,
  THIRTY_FIVE_PERCENT = 0.35,
  FORTY_PERCENT = 0.4,
  FORTY_FIVE_PERCENT = 0.45,
  FIFTY_PERCENT = 0.5,
}

//string representations for UI
export const BidSeparationDisplay: Record<cpcBidSeparation, string> = {
  [cpcBidSeparation.ZERO_PERCENT]: "0%",
  [cpcBidSeparation.FIVE_PERCENT]: "5%",
  [cpcBidSeparation.TEN_PERCENT]: "10%",
  [cpcBidSeparation.FIFTEEN_PERCENT]: "15%",
  [cpcBidSeparation.TWENTY_PERCENT]: "20%",
  [cpcBidSeparation.TWENTY_FIVE_PERCENT]: "25%",
  [cpcBidSeparation.THIRTY_PERCENT]: "30%",
  [cpcBidSeparation.THIRTY_FIVE_PERCENT]: "35%",
  [cpcBidSeparation.FORTY_PERCENT]: "40%",
  [cpcBidSeparation.FORTY_FIVE_PERCENT]: "45%",
  [cpcBidSeparation.FIFTY_PERCENT]: "50%",
};

//launch campaign as paused or enabled
export enum CampaignStatus {
  PAUSED = "paused",
  ENABLED = "enabled",
}

// dayOfWeek
export enum DayOfWeek {
  MONDAY = 2,
  TUESDAY = 3,
  WEDNESDAY = 4,
  THURSDAY = 5,
  FRIDAY = 6,
  SATURDAY = 7,
  SUNDAY = 8,
}

export const getDayName = (day: DayOfWeek): string => {
  switch (day) {
    case DayOfWeek.MONDAY:
      return "MONDAY";
    case DayOfWeek.TUESDAY:
      return "TUESDAY";
    case DayOfWeek.WEDNESDAY:
      return "WEDNESDAY";
    case DayOfWeek.THURSDAY:
      return "THURSDAY";
    case DayOfWeek.FRIDAY:
      return "FRIDAY";
    case DayOfWeek.SATURDAY:
      return "SATURDAY";
    case DayOfWeek.SUNDAY:
      return "SUNDAY";
    default:
      throw new Error("Invalid day value");
  }
};
