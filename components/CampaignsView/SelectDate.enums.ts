export enum SelectableDates {
  today = "TODAY",
  yesterday = "YESTERDAY",
  lastWeek = "LAST_7_DAYS",
  thisMonth = "THIS_MONTH",
  lastMonth = "LAST_MONTH",
  twoWeeks = "LAST_14_DAYS",
  month = "LAST_30_DAYS",
  allTime = "ALL_TIME",
}

export const SelectAdDates = {
  [SelectableDates.today]: "Today",
  [SelectableDates.yesterday]: "Yesterday",
  [SelectableDates.lastWeek]: "Last 7 Days",
  [SelectableDates.thisMonth]: "This Month",
  [SelectableDates.twoWeeks]: "Last 14 Days",
  [SelectableDates.month]: "Last 30 Days",
  [SelectableDates.allTime]: "All Time",
};
