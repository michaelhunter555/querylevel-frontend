import React from "react";

import { State } from "@/types";
import Alert from "@mui/material/Alert";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

interface LocalInventory {
  inputHandler: (id: string, val: boolean, isValid: boolean) => void;
  formState: State;
}

export const LocalInventory = ({ inputHandler, formState }: LocalInventory) => {
  return (
    <Grid item xs={11}>
      <Alert severity="info">
        In order to enable local inventory ads, you must have: 1. A Google a
        business profile 2. Profile linked to your merchant center account 3.
        Created a local product inventory feed - successfully verified. This
        feature will not work otherwise.
      </Alert>
      <Stack
        spacing={2}
        direction="column"
        alignItems="start"
        sx={{ marginTop: "0.5rem" }}
      >
        <Stack>
          <Typography>Enable Local Inventory for this campaign</Typography>
        </Stack>
        <Stack>
          <FormControl>
            <FormControlLabel
              control={
                <Checkbox
                  id="enableLocalInventory"
                  name="enableLocalInventory"
                  checked={
                    formState?.inputs?.enableLocalInventory?.value as boolean
                  }
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    inputHandler(
                      "enableLocalInventory", //enableLocalInventory
                      event.target.checked as boolean,
                      true
                    );
                  }}
                />
              }
              label="Enable Local Inventory"
            />
          </FormControl>
        </Stack>
      </Stack>
    </Grid>
  );
};
