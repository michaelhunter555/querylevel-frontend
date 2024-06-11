import React from "react";

import { SelectChangeEvent } from "@mui/material";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";

type ResourceNames = {
  resource: string;
  resourceNames: string[];
  onSelectResource: (resource: SelectChangeEvent) => void;
  onSetAccountId: () => void;
};

export const SelectAccounts = ({
  resource,
  resourceNames,
  onSelectResource,
  onSetAccountId,
}: ResourceNames) => {
  return (
    <>
      <Select
        id="select-resource"
        label="Select Resource"
        value={resource}
        onChange={onSelectResource}
        sx={{ width: "300px" }}
      >
        {resourceNames?.map((resourceId) => (
          <MenuItem key={resourceId} value={resourceId}>
            <Typography variant="subtitle2">{resourceId}</Typography>
          </MenuItem>
        ))}
      </Select>

      <Button
        onClick={onSetAccountId}
        disabled={resourceNames.length < 0 && resource !== ""}
      >
        Set Credentials
      </Button>
    </>
  );
};
