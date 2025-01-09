import React from "react";

import { StatusDot } from "@/components/Shared/StatusDot";
import InputAdornment from "@mui/material/InputAdornment";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";

type CampaignStatus = {
  status: string;
  onStatusChange: (val: string) => void;
  isLoading?: boolean;
};

export const StatusSelector = ({
  status,
  onStatusChange,
  isLoading,
}: CampaignStatus) => {
  const statusArray = ["ENABLED", "PAUSED"];
  const determineSatusValue: number = status === "ENABLED" ? 2 : 3;
  return (
    <>
      <Select
        value={status}
        onChange={(event: SelectChangeEvent<string>) =>
          onStatusChange(event.target.value)
        }
        disabled={isLoading}
        startAdornment={
          <InputAdornment position="start">
            <StatusDot status={determineSatusValue} />
          </InputAdornment>
        }
      >
        {statusArray.map((val, i) => (
          <MenuItem key={i} value={val}>
            {val.slice(0, 1) + val.slice(1).toLowerCase()}
          </MenuItem>
        ))}
      </Select>
    </>
  );
};
