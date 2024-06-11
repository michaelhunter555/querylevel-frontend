import React from "react";

import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";

import { SingleDayOfWeek, singleSelectDayNames } from "./singleSelectDayNames";

interface SingleSelectDay {
  handleSelectedDay: (day: any) => void;
  selectedDays?: number | string;
  hasMatchingTimes?: boolean;
  isDisabled?: boolean;
}

export const SingleSelectDays = ({
  selectedDays,
  handleSelectedDay,
  isDisabled,
  hasMatchingTimes,
}: SingleSelectDay) => {
  const days = hasMatchingTimes
    ? (Object.values(SingleDayOfWeek).filter(
        Number.isInteger
      ) as SingleDayOfWeek[])
    : (Object.values(SingleDayOfWeek).filter(
        (value) => typeof value === "number" && value < 9
      ) as SingleDayOfWeek[]);

  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      <Select
        value={selectedDays}
        onChange={handleSelectedDay}
        displayEmpty
        disabled={isDisabled}
        renderValue={(selected) =>
          selected
            ? singleSelectDayNames(Number(selected) as SingleDayOfWeek)
            : "Select Day"
        }
      >
        {days.map((day) => (
          <MenuItem key={day} value={day}>
            {singleSelectDayNames(day)}
          </MenuItem>
        ))}
      </Select>
    </Stack>
  );
};
