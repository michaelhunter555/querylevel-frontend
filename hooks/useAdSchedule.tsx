import { useCallback, useReducer } from "react";

import { ScheduleAction, ScheduleItem, ScheduleState } from "@/types";

const initialScheduleState = {
  MONDAY: null,
  TUESDAY: null,
  WEDNESDAY: null,
  THURSDAY: null,
  FRIDAY: null,
  SATURDAY: null,
  SUNDAY: null,
};

const scheduleReducer = (state: ScheduleState, action: ScheduleAction) => {
  switch (action.type) {
    case "SET_DAY_SCHEDULE":
      return {
        ...state,
        days: {
          ...state.days,
          [action.day!]: action.schedule,
        },
      };
    case "RESET_SCHEDULE":
      return {
        ...state,
        days: {},
      };
    default:
      return state;
  }
};

export const useAdSchedule = () => {
  const [scheduleState, dispatch] = useReducer<
    (state: ScheduleState, action: ScheduleAction) => any
  >(scheduleReducer, {
    days: initialScheduleState,
  });

  const setDaySchedule = useCallback((day: string, schedule: ScheduleItem) => {
    dispatch({ type: "SET_DAY_SCHEDULE", day, schedule });
  }, []);

  const resetSchedule = useCallback(() => {
    dispatch({ type: "RESET_SCHEDULE" });
  }, []);

  return {
    scheduleState,
    setDaySchedule,
    resetSchedule,
  };
};
