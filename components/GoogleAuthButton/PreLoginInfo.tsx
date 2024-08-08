import React, { useState } from "react";

import { useSession } from "next-auth/react";
import Link from "next/link";

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
        width: "60%",
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
              <li>Access to your Google Ads data.</li>
              <li>Access to your Google Shopping data</li>
            </ol>
            <Alert
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
