import React from "react";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

const CostSavingSimulator = () => {
  const searchTerms: string[] = [
    "proform hybrid Trainer",
    "proform elliptical",
    "elliptical trainers",
    "elliptical trainer reviews",
  ];

  return (
    <Container maxWidth="lg" sx={{ marginTop: "1rem" }}>
      <Paper sx={{ padding: 2 }}>
        <Grid container direction="row" alignItems="start" spacing={2}>
          <Grid item xs={12} md={4}>
            <Stack>
              <Typography variant="h6" color="text.secondary">
                Search Terms
              </Typography>
              {searchTerms.map((val, i) => (
                <Typography color="text.secondary" variant="subtitle2">
                  {val}
                </Typography>
              ))}
            </Stack>
          </Grid>
          <Grid item xs={12} md={4}>
            <Stack
              direction="column"
              alignItems="center"
              width="100%"
              spacing={2}
            >
              <Typography variant="h6" color="text.secondary">
                Structure
              </Typography>
              <Stack
                sx={{
                  borderRadius: 3,
                  border: "1px solid #b1b1b1",
                  padding: 1,
                }}
              >
                <Typography variant="subtitle2" color="text.secondary">
                  Alpha/Beta
                </Typography>
              </Stack>
              <Stack
                sx={{
                  borderRadius: 3,
                  border: "1px solid #b1b1b1",
                  padding: 1,
                }}
              >
                <Typography variant="subtitle2" color="text.secondary">
                  Single Campaign
                </Typography>
              </Stack>
            </Stack>
          </Grid>

          <Grid item xs={12} md={4}>
            <Stack direction="column" alignItems="center" spacing={2}>
              <Typography variant="h6" color="text.secondary">
                Result
              </Typography>
              <Box>
                <Typography color="text.secondary" variant="subtitle2">
                  $1.20
                </Typography>
              </Box>
              <Box>
                <Typography color="text.secondary" variant="subtitle2">
                  $1.60
                </Typography>
              </Box>
            </Stack>
          </Grid>
        </Grid>
        <Divider flexItem sx={{ margin: "1rem auto" }} />
        <Stack>
          <Typography color="text.secondary" variant="subtitle2">
            Note while this is just a simulation, the purpose is to show how
            your total cost is affected when you start to filter your keywords.
            With an
            <code>Alpha/Beta</code> structure, non-brand search queries are
            filtered into the high priority campaign. Meaning they will show
            first at the lowest possible price that was set. In the even where a
            search term contains the brand name, it will filter pass the high
            priority and be triggered in the low priority campaign where a
            higher bid is set, increasing the likeliness of a advantageous
            position in the ad results page.
          </Typography>
        </Stack>
      </Paper>
    </Container>
  );
};

export default CostSavingSimulator;
