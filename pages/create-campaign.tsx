import React from "react";

import Link from "next/link";

import CreateNewCampaign from "@/components/CampaignsView/CreateCampaignForm";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Chip from "@mui/material/Chip";

const CreateCampaign = () => {
  return (
    <div>
      <Chip
        component={Link}
        prefetch={false}
        href="/campaign-view"
        label="Back to campaigns"
        variant="filled"
        icon={<ArrowBackIcon />}
      />
      <CreateNewCampaign />
    </div>
  );
};
export default CreateCampaign;
