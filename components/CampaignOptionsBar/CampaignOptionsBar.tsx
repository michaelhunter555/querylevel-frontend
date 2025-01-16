import React, { useState } from "react";

import Link from "next/link";

import { useCheckDevice } from "@/hooks/use-device-hook";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";

import { invisibleScroll } from "../GoogleAuthButton/AuthStyles";
import { campaignButtonOptions } from "./CampaignButtons";

const CampaignOptionsBar = () => {
  const [open, setOpen] = useState(false);
  const { isMobile } = useCheckDevice();

  const handleSpeedDial = () => setOpen((prev) => !prev);
  return (
    <Box
      sx={{
        ...(isMobile && {
          overflowX: "auto",
          width: "100%",
          ...invisibleScroll,
        }),
      }}
    >
      <Stack direction="row" alignItems="center" spacing={2}>
        {campaignButtonOptions.map((campaign, index) => (
          <Stack key={index} direction="row" alignItems="center" spacing={2}>
            {index !== 0 && (
              <Divider
                orientation="vertical"
                flexItem
                sx={{ margin: "0 auto" }}
              />
            )}
            <Stack direction="column" justifyContent="center">
              <Chip
                sx={{ border: "1px solid grey", cursor: "pointer" }}
                color="primary"
                label={campaign.text}
                prefetch={false}
                component={Link}
                href={campaign?.link as string}
                variant={"outlined"}
                icon={campaign?.icon}
              />
            </Stack>
          </Stack>
        ))}
      </Stack>
    </Box>
  );
};

export default CampaignOptionsBar;
