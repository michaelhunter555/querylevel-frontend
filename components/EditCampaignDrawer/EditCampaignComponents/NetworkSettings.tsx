import React from "react";

import { State } from "@/types";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import FormLabel from "@mui/material/FormLabel";

interface EditNetworkSettings {
  formState: State;
  inputHandler: (id: string, value: boolean, isValid: boolean) => void;
}

export const EditNetworkSettings = ({
  formState,
  inputHandler,
}: EditNetworkSettings) => {
  return (
    <>
      <FormGroup>
        <FormLabel>Advertising Channels</FormLabel>
        <FormControlLabel
          sx={{ color: "text.secondary" }}
          id="targetGoogleSearch"
          name="targetGoogleSearch"
          label="Google Search"
          disabled
          control={
            <Checkbox
              checked={formState?.inputs?.targetGoogleSearch?.value as boolean}
              value={formState?.inputs?.targetGoogleSearch?.value}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                inputHandler("targetGoogleSearch", event.target.checked, true);
              }}
            />
          }
        />
        <FormControlLabel
          id="targetSearchNetwork"
          name="targetSearchNetwork"
          sx={{ color: "text.secondary" }}
          control={
            <Checkbox
              checked={formState?.inputs?.targetSearchNetwork?.value as boolean}
              value={formState?.inputs?.targetSearchNetwork?.value}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                inputHandler("targetSearchNetwork", event.target.checked, true);
              }}
            />
          }
          label="Search Partners Network"
        />
      </FormGroup>
    </>
  );
};
