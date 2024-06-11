import React from "react";

import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";

export const ConversionLoadingSkeleton = () => {
  return (
    <>
      <>
        {/*ROW 1 NAME & ATTRIBUTION MODEL */}
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          sx={{ margin: "1rem 0" }}
        >
          <Grid item xs={12} md={7}>
            <Skeleton width="100%" />
          </Grid>
          <Grid item xs={12} md={4}>
            <Skeleton width="100%" />
          </Grid>
        </Stack>

        <Divider sx={{ margin: "0.5rem auto" }} />

        {/*ROW 2 DEFAULT VALUE MANAGEMENT */}
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          sx={{ margin: "1rem 0" }}
        >
          <Grid item xs={11} md={6}>
            <Skeleton width="100%" />
          </Grid>
          <Grid item xs={11} md={6} sx={{ padding: "0 0 0 2rem" }}>
            <Skeleton width="100%" />
          </Grid>
        </Stack>

        {/*ROW 3 COUNT & GOAL TYPE */}
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          sx={{ margin: "1rem 0" }}
        >
          <Grid item xs={11} md={6}>
            <Skeleton width="100%" />
          </Grid>
          <Grid item xs={11} md={6} sx={{ padding: "0 0 0 2rem" }}>
            <Divider sx={{ margin: "0.5rem 0" }} />

            <Skeleton width="100%" />
          </Grid>
        </Stack>

        {/*ROW 4 VIEW THROUGH & LOOKBACK WINDOWS */}
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          sx={{ margin: "1rem 0" }}
        >
          <Grid item xs={11} md={6}>
            <Skeleton width="100%" />
          </Grid>

          <Grid item xs={11} md={6}>
            <Skeleton width="100%" />
          </Grid>
        </Stack>
      </>
    </>
  );
};
