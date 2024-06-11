import React from "react";

import RotateRightTwoToneIcon from "@mui/icons-material/RotateRightTwoTone";
import { Button, Grid, Stack, Typography } from "@mui/material";

export const CreateRemarketingCampaign = (): JSX.Element => {
  return (
    <Grid container direction="row" alignItems="center" justifyContent="center">
      <Stack direction="column" justifyContent="center">
        <Stack alignItems="center">
          <RotateRightTwoToneIcon fontSize="large" />
        </Stack>

        <Stack alignItems="center" sx={{ paddingLeft: "1rem" }}>
          <Typography variant="h6" color="text.secondary">
            Create a Remarketing Campaign
          </Typography>
          <Typography variant="subtitle2" color="text.secondary">
            Remarket to past visits, users who added to cart and/or users who
            added to cart, visited checkout,but did not convert.
          </Typography>
          <Button>Create Campaign</Button>
        </Stack>
      </Stack>
    </Grid>
  );
};
