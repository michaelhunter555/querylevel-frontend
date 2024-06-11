import React from "react";

import PageviewTwoToneIcon from "@mui/icons-material/PageviewTwoTone";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

export const CreateLocalInventoryCampaign = (): JSX.Element => {
  return (
    <Grid container direction="row" alignItems="center" justifyContent="center">
      <Stack direction="column" justifyContent="center">
        <Stack alignItems="center">
          <PageviewTwoToneIcon fontSize="large" />
        </Stack>

        <Stack alignItems="center" sx={{ paddingLeft: "1rem" }}>
          <Typography variant="h6" color="text.secondary">
            Create A Local Inventory Ad
          </Typography>
          <Typography variant="subtitle2" color="text.secondary">
            Create Single Keyword Ad Groups that have perform a separation of
            operations approach.
          </Typography>
          <Button>Create Campaign</Button>
        </Stack>
      </Stack>
    </Grid>
  );
};
