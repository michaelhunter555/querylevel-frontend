import React from "react";

import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";

import { SelectAdDates } from "./SelectDate.enums";

interface Segment {
  segment: string;
  onSegmentChange: (val: SelectChangeEvent) => void;
  removeAllTime?: boolean;
  isLoading?: boolean;
}

const SelectSegment = ({
  segment,
  onSegmentChange,
  removeAllTime,
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
        >
          {Object.entries(SelectAdDates)
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
