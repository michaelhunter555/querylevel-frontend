import React from "react";

import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";

interface SimpleScheduleButtons {
  selected: number | undefined;
  onSelected: (select: number) => void;
  onSelectStartTime: (time: any) => void;
  onSelectEndTime: (time: any) => void;
  isDisabled: boolean;
}

export const SimpleAdSchedule: React.FC<SimpleScheduleButtons> = ({
  selected,
  onSelected,
  onSelectStartTime,
  onSelectEndTime,
  isDisabled,
}) => {
  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      <Chip
        label="8am to 4pm"
        component={Button}
        variant={selected === 0 ? "outlined" : "filled"}
        sx={{
          color: selected === 0 ? "#1976d2" : "#bdbdbd",
          borderColor: selected === 0 ? "#1976d2" : "#bdbdbd",
        }}
        onClick={() => {
          onSelected(0);
          onSelectStartTime({ hour: 8, minute: "ZERO" });
          onSelectEndTime({ hour: 16, minute: "ZERO" });
        }}
        disabled={isDisabled}
      />

      <Chip
        component={Button}
        label="8am to 8pm"
        variant={selected === 1 ? "outlined" : "filled"}
        sx={{
          color: selected === 1 ? "#1976d2" : "#bdbdbd",
          borderColor: selected === 1 ? "#1976d2" : "#bdbdbd",
        }}
        onClick={() => {
          onSelected(1);
          onSelectStartTime({ hour: 8, minute: "ZERO" });
          onSelectEndTime({ hour: 20, minute: "ZERO" });
        }}
        disabled={isDisabled}
      />

      <Chip
        component={Button}
        label="24 hours"
        variant={selected === 2 ? "outlined" : "filled"}
        sx={{
          color: selected === 2 ? "#1976d2" : "#bdbdbd",
          borderColor: selected === 2 ? "#1976d2" : "#bdbdbd",
        }}
        onClick={() => {
          onSelected(2);
          onSelectStartTime({ hour: 0, minute: "ZERO" });
          onSelectEndTime({ hour: 0, minute: "ZERO" });
        }}
        disabled={isDisabled}
      />
    </Stack>
  );
};
