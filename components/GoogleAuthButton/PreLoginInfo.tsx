import React, { useState } from "react";

import { useSession } from "next-auth/react";
import Link from "next/link";

import { useMediaQuery, useTheme } from "@mui/material/";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import FirstTimeConnectModal from "../Modal/FirstTimeConnectModal";

export const PreLoginInfo = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { status } = useSession();
  const [openInfo, setOpenInfo] = useState<boolean>(false);

  const handleModalOpen = () => {
    setOpenInfo((prev) => !prev);
  };

  return (
    <Paper
      sx={{
        borderRadius: "15px",
        marginTop: "2rem",
        padding: "1rem",
        width: { xs: "100%", md: "60%" },
      }}
    >
      <FirstTimeConnectModal open={openInfo} onClose={handleModalOpen} />
      <>
        {status !== "loading" && (
          <>
            <Typography variant="subtitle2">
              NOTE: This app only supports personal ad accounts. Linked accounts
              & MCC accounts are not currently supported. The Permissions we
              request are necessary to provide the intended app experience.
            </Typography>
            <Divider />
            <Typography variant="subtitle2">Requested Permissions:</Typography>
            <ol>
              <li>
                Permission to communicate with Google Ads to present your ads
                data
              </li>
              <li>
                Permission to communicate with Google Shopping to create
                shopping campaigns
              </li>
            </ol>
            <Alert
              sx={{ flexDirection: { xs: "column", md: "row" } }}
              severity="info"
              action={
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Chip
                    variant="outlined"
                    label="Learn More"
                    component={Button}
                    onClick={handleModalOpen}
                  />
                  <Chip
                    variant="outlined"
                    label="Home"
                    component={Link}
                    href="/"
                  />
                </Stack>
              }
            >
              What happens when after I authorize the app?
            </Alert>
          </>
        )}
        {status === "loading" && (
          <>
            <Skeleton width="100%" />
            <Skeleton width="80%" />
            <Skeleton width="80%" />
            <Skeleton width="80%" />
          </>
        )}
      </>
    </Paper>
  );
};
