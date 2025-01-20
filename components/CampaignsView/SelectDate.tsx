import React from "react";

import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import InputAdornment from "@mui/material/InputAdornment";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";

import { SelectAdDates } from "./SelectDate.enums";

interface Segment {
  segment: string;
  onSegmentChange: (val: SelectChangeEvent) => void;
  removeAllTime?: boolean;
  noSingleDays?: boolean;
  isLoading?: boolean;
}

const SelectSegment = ({
  segment,
  onSegmentChange,
  removeAllTime,
  noSingleDays,
  isLoading,
}: Segment) => {
  const segmentChangeHandler = (val: SelectChangeEvent<string>) => {
    onSegmentChange(val);
  };

  return (
    <>
      {!removeAllTime && (
        <Select
          sx={{ minWidth: { xs: "100%", md: 150 } }}
          value={segment}
          onChange={segmentChangeHandler}
          disabled={isLoading}
          startAdornment={
            <InputAdornment position="start">
              <CalendarMonthIcon />
            </InputAdornment>
          }
        >
          {Object.entries(SelectAdDates).map(([key, value]) => (
            <MenuItem key={key} value={key}>
              {value}
            </MenuItem>
          ))}
        </Select>
      )}

      {removeAllTime && (
        <Select
          sx={{ minWidth: 150 }}
          value={segment}
          onChange={segmentChangeHandler}
          disabled={isLoading}
          startAdornment={
            <InputAdornment position="start">
              <CalendarMonthIcon />
            </InputAdornment>
          }
        >
          {noSingleDays
            ? Object.entries(SelectAdDates)
                ?.slice(2)
                ?.filter(([key]) => key !== "ALL_TIME")
                .map(([key, value]) => (
                  <MenuItem key={key} value={key}>
                    {value}
                  </MenuItem>
                ))
            : Object.entries(SelectAdDates)
                ?.filter(([key]) => key !== "ALL_TIME")
                .map(([key, value]) => (
                  <MenuItem key={key} value={key}>
                    {value}
                  </MenuItem>
                ))}
        </Select>
      )}
    </>
  );
};

export default SelectSegment;
