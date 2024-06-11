import React from "react";

import dayjs, { Dayjs } from "dayjs";

import Stack from "@mui/material/Stack";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

interface Schedule {
  startTime: string;
  endTime: string;
}

interface ScheduleViewerProps {
  schedule: Schedule; // "6:2-9:2" should be 06:30 start time , 9:30 end time
  isDisabled?: boolean;
  timeKey: string;
  handleStartTimeChange: (
    timeKey: string,
    newStartTime: string,
    type: "start"
  ) => void;
  handleEndTimeChange: (
    timeKey: string,
    newEndTime: string,
    type: "end"
  ) => void;
}

export const SelectScheduleTimes = ({
  schedule,
  isDisabled,
  timeKey,
  handleStartTimeChange,
  handleEndTimeChange,
}: ScheduleViewerProps) => {
  const startTime = dayjs(schedule.startTime, "HH:mm");
  const endTime = dayjs(schedule.endTime, "HH:mm");

  const onHandleStartTimeChange = (newValue: Dayjs | null) => {
    const newTime = newValue?.format("HH:mm")
      ? newValue?.format("HH:mm")
      : schedule?.startTime;

    handleStartTimeChange(timeKey, newTime, "start");
  };

  const onHandleEndTimeChange = (newValue: Dayjs | null) => {
    const newTime = newValue ? newValue.format("HH:mm") : schedule?.endTime;
    handleEndTimeChange(timeKey, newTime, "end");
  };

  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <TimePicker
          label="Start Time"
          value={startTime}
          onChange={onHandleStartTimeChange}
          ampm={false}
          format="HH:mm"
          minutesStep={15}
          disabled={isDisabled}
        />
        <TimePicker
          label="End Time"
          value={endTime}
          onChange={onHandleEndTimeChange}
          ampm={false}
          format="HH:mm"
          minutesStep={15}
          disabled={isDisabled}
        />
      </LocalizationProvider>
    </Stack>
  );
};
