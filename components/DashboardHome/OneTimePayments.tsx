import React from "react";

import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

const OneTimePayments = () => {
  return (
    <Container>
      <Paper
        elevation={0}
        sx={{
          padding: "2rem",
        }}
      >
        <Grid container direction="row" alignItems="center">
          <Grid
            item
            xs={12}
            md={7}
            sx={{ display: "flex", flexDirection: "column" }}
          >
            <Typography color="text.secondary" variant="h4">
              Pay As You Go:
            </Typography>
            <Typography gutterBottom color="text.secondary">
              Create Alpha/Beta or Three-tiered campaigns without the need to
              subscribe. This option has reduced features that are Ideal for
              users that don't wish to subscribe for the full app experience.
              Turn 30min - 1hr of manually structuring complex campaigns &
              keywords into less than 5-10 seconds!
            </Typography>
          </Grid>
          <Divider orientation="vertical" flexItem sx={{ margin: "1rem" }} />
          <Grid
            item
            xs={12}
            md={4}
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: "5px",
            }}
          >
            <Typography align="center" color="text.secondary" variant="h2">
              $5
            </Typography>
            <Typography align="center" color="text.secondary" gutterBottom>
              per campaign
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default OneTimePayments;
