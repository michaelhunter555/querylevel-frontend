import React from "react";

import { useMediaQuery, useTheme } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";

import {
  DayOfWeek,
  getDayName,
} from "../CreateCampaignSteps/CreateShoppingCampaign/shoppingCampaign.enums";

interface SelectDay {
  handleSelectFromDay: (day: any) => void;
  handleSelectToDay?: (day: any) => void;
  selectFromDays?: number | string;
  selectToDay?: number | string;
  isDisabled?: boolean;
}

const days = Object.values(DayOfWeek).filter(Number.isInteger) as DayOfWeek[];

export const SelectDays: React.FC<SelectDay> = ({
  selectFromDays,
  selectToDay,
  handleSelectFromDay,
  handleSelectToDay,
  isDisabled,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1}
      sx={{ width: "100%" }}
    >
      <Select
        fullWidth={isMobile ? true : false}
        value={selectFromDays?.toString()}
        onChange={handleSelectFromDay}
        disabled={isDisabled}
      >
        {days.map((day) => (
          <MenuItem key={day} value={day}>
            {getDayName(day)}
          </MenuItem>
        ))}
      </Select>

      <Select
        fullWidth={isMobile ? true : false}
        value={selectToDay?.toString()}
        onChange={handleSelectToDay}
        disabled={isDisabled}
      >
        {days.map((day) => (
          <MenuItem key={day} value={day}>
            {getDayName(day)}
          </MenuItem>
        ))}
      </Select>
    </Stack>
  );
};

export default SelectDays;
