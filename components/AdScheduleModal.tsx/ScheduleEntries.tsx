import React from "react";

import ClearIcon from "@mui/icons-material/Clear";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";

import { SingleDayOfWeek, singleSelectDayNames } from "./singleSelectDayNames";
import { SelectScheduleTimes } from "./SingleSelectTimes";

interface ScheduleEntryProps {
  timeKey: string;
  startTime: string;
  endTime: string;
  day: number;
  onDayChange: (timeKey: string, day: number) => void;
  onTimeChange: (timeKey: string, time: string, key: "start" | "end") => void;
  onRemove: () => void;
}

export const ScheduleEntries = ({
  timeKey,
  startTime,
  endTime,
  day,
  onDayChange,
  onTimeChange,
  onRemove,
}: ScheduleEntryProps) => {
  return (
    <Box>
      <Stack direction="row" alignItems="center" spacing={1}>
        <Select
          value={Number(day)}
          onChange={(e) => {
            onDayChange(timeKey, Number(e.target.value));
          }}
          sx={{ margin: "0.5rem 0", minWidth: 200 }}
        >
          {Object.values(SingleDayOfWeek).map((dayValue, index) => {
            if (typeof dayValue === "number") {
              return (
                <MenuItem key={index} value={dayValue}>
                  {singleSelectDayNames(dayValue)}
                </MenuItem>
              );
            }
            return null;
          })}
        </Select>

        <SelectScheduleTimes
          timeKey={timeKey}
          schedule={{ startTime, endTime }}
          isDisabled={false}
          handleStartTimeChange={onTimeChange}
          handleEndTimeChange={onTimeChange}
        />
        <Button variant="contained" color="error" onClick={onRemove}>
          <ClearIcon />
        </Button>
      </Stack>
    </Box>
  );
};
