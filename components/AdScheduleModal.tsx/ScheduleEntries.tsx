import React from "react";

import { useCheckDevice } from "@/hooks/use-device-hook";
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
  const { isMobile } = useCheckDevice();
  return (
    <Box>
      <Stack
        direction={isMobile ? "column" : "row"}
        alignItems={isMobile ? "start" : "center"}
        justifyContent={isMobile ? "flex-start" : "normal"}
        spacing={1}
      >
        <Stack sx={{ ...(isMobile && { width: "100%" }) }}>
          <Select
            value={Number(day)}
            onChange={(e) => {
              onDayChange(timeKey, Number(e.target.value));
            }}
            sx={{ margin: "0.5rem 0", minWidth: 100 }}
          >
            {Object.values(SingleDayOfWeek).map((dayValue, index) => {
              if (typeof dayValue === "number") {
                return (
                  <MenuItem sx={{ fontSize: 10 }} key={index} value={dayValue}>
                    {singleSelectDayNames(dayValue)}
                  </MenuItem>
                );
              }
              return null;
            })}
          </Select>
        </Stack>

        <Stack direction="row" spacing={1}>
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
      </Stack>
    </Box>
  );
};
