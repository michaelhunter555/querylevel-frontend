import React from "react";

import { Grid } from "@mui/material";

import CreateNewCampaign from "../CampaignsView/CreateCampaignForm";

type CloseModal = {
  onClose: () => void;
};

export const CreateShoppingCampaigns = ({ onClose }: CloseModal) => {
  return (
    <Grid container direction="row" alignItems="center" justifyContent="center">
      <CreateNewCampaign />
    </Grid>
  );
};
