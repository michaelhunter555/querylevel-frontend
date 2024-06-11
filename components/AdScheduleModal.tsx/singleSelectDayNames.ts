export enum SingleDayOfWeek {
  MONDAY = 2,
  TUESDAY = 3,
  WEDNESDAY = 4,
  THURSDAY = 5,
  FRIDAY = 6,
  SATURDAY = 7,
  SUNDAY = 8,
  MONDAY_FRIDAY = 9,
  SATURDAY_SUNDAY = 10,
  MONDAY_SUNDAY = 11,
}

export const singleSelectDayNames = (day: SingleDayOfWeek) => {
  //monday through sunday
  switch (day) {
    case SingleDayOfWeek.MONDAY:
      return "MONDAY";
    case SingleDayOfWeek.TUESDAY:
      return "TUESDAY";
    case SingleDayOfWeek.WEDNESDAY:
      return "WEDNESDAY";
    case SingleDayOfWeek.THURSDAY:
      return "THURSDAY";
    case SingleDayOfWeek.FRIDAY:
      return "FRIDAY";
    case SingleDayOfWeek.SATURDAY:
      return "SATURDAY";
    case SingleDayOfWeek.SUNDAY:
      return "SUNDAY";
    case SingleDayOfWeek.MONDAY_FRIDAY:
      return "MONDAY - FRIDAY";
    case SingleDayOfWeek.SATURDAY_SUNDAY:
      return "SATURDAY - SUNDAY";
    case SingleDayOfWeek.MONDAY_SUNDAY:
      return "MONDAY - SUNDAY";
    default:
      throw new Error("Invalid day value");
  }
};

export type Time = {
  hour: number;
  minute: "ZERO" | "FIFTEEN" | "THIRTY" | "FORTY_FIVE" | number;
};

export const reverseMinuteMapping: Record<string, number> = {
  ZERO: 0,
  FIFTEEN: 15,
  THIRTY: 30,
  FORTY_FIVE: 45,
};
