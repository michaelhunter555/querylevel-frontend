import React from "react";

import dayjs, { Dayjs } from "dayjs";

import Stack from "@mui/material/Stack";
import {
  PickerChangeHandlerContext,
  TimeValidationError,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

interface SelectTime {
  startTime: Time;
  endTime: Time;
  handleStartTime: (time: any) => void;
  handleEndTime: (time: any) => void;
  isDisabled?: boolean;
}

export type Time = {
  hour: number;
  minute: "ZERO" | "FIFTEEN" | "THIRTY" | "FORTY_FIVE" | number;
};

export const minuteMapping: Record<number, string> = {
  0: "ZERO",
  15: "FIFTEEN",
  30: "THIRTY",
  45: "FORTY_FIVE",
};

export const reverseMinuteMapping: Record<string, number> = {
  ZERO: 0,
  FIFTEEN: 15,
  THIRTY: 30,
  FORTY_FIVE: 45,
};

export const SelectTimes = ({
  startTime,
  endTime,
  handleStartTime,
  handleEndTime,
  isDisabled,
}: SelectTime) => {
  const getDateFromTime = (time: Time) => {
    return dayjs()
      .set("hour", time?.hour)
      .set("minute", reverseMinuteMapping[time?.minute]);
  };

  const handleTimeChange = (handler: (time: Time | null) => void) => {
    return (
      date: Dayjs | null,
      context: PickerChangeHandlerContext<TimeValidationError>
    ) => {
      if (date) {
        const hour = date?.hour();
        const minute = minuteMapping[Math.floor(date.minute() / 15) * 15] as
          | "ZERO"
          | "FIFTEEN"
          | "THIRTY"
          | "FORTY_FIVE";
        handler({ hour, minute });
      } else {
        handler(null);
      }
    };
  };

  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <TimePicker<Dayjs>
          label="Set Start Time"
          value={getDateFromTime(startTime)}
          onChange={handleTimeChange(handleStartTime)}
          ampm={false}
          format="HH:mm"
          minutesStep={15}
          disabled={isDisabled}
        />
        <TimePicker<Dayjs>
          label="Set End Time"
          value={getDateFromTime(endTime)}
          onChange={handleTimeChange(handleEndTime)}
          ampm={false}
          format="HH:mm"
          minutesStep={15}
          disabled={isDisabled}
        />
      </LocalizationProvider>
    </Stack>
  );
};

export default SelectTimes;
