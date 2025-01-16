import React from "react";

import { useCheckDevice } from "@/hooks/use-device-hook";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid2";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";

export const TempLoadingCard = () => {
  const { isMobile } = useCheckDevice();
  let tempLoadingCards = (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <Paper
          key={i}
          sx={{
            borderRadius: "15px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            padding: "1rem",
            ...(isMobile && { width: "100%" }),
          }}
        >
          <Grid
            size={12}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: isMobile ? "normal" : "center",
            }}
          >
            <Typography variant="h6" color="text.secondary">
              <Skeleton width={90} />
            </Typography>
            <Divider flexItem />
            <Typography variant="h6" color="text.secondary">
              <Skeleton width={90} />
            </Typography>
          </Grid>
        </Paper>
      ))}
    </>
  );

  return tempLoadingCards;
};
