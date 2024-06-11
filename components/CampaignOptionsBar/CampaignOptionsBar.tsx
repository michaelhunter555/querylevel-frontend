import React from "react";

import Link from "next/link";

import LocalOfferTwoToneIcon from "@mui/icons-material/LocalOfferTwoTone";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";

import { campaignButtonOptions } from "./CampaignButtons";

const CampaignOptionsBar = () => {
  return (
    <Box>
      <Stack direction="row" alignItems="center" spacing={2}>
        {campaignButtonOptions.map((campaign, index) => (
          <Stack key={index} direction="row" alignItems="center">
            <Stack direction="column" justifyContent="center">
              <Chip
                color="primary"
                label={campaign.text}
                prefetch={false}
                component={Link}
                href="/create-campaign"
                variant={"outlined"}
                icon={<LocalOfferTwoToneIcon />}
              />
            </Stack>
          </Stack>
        ))}
      </Stack>
    </Box>
  );
};

export default CampaignOptionsBar;
