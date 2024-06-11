import React from "react";

import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";

export const TempLoadingCard = () => {
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
          }}
        >
          <Grid
            item
            xs={12}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
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
