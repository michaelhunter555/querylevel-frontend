import React from "react";

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
  return (
    <>
      <Select
        value={status}
        onChange={(event: SelectChangeEvent<string>) =>
          onStatusChange(event.target.value)
        }
        disabled={isLoading}
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
