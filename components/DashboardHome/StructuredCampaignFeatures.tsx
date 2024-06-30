import React from "react";

import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { PaletteMode } from "@mui/material";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";

interface CampaignStructureTheme {
  userTheme: PaletteMode;
}
const campaignStructFeatures = [
  {
    title: "Keywords",
    items: [
      "pre-set negative keywords",
      "campaign keyword allocation",
      "modifying keyword phrases",
    ],
  },
  {
    title: "Budget",
    items: [
      "shared budget that acts as one budget for all campaigns",
      "Bid seperation for CpC",
      "preview bids for a/b & 3-tier",
    ],
  },
  {
    title: "Campaigns",
    items: [
      "Creates 2 to 3 campaigns per operation",
      "Priority settings of High & Low, or High, Medium, Low",
      "Negative keywords added at campaign level",
    ],
  },
  {
    title: "Ad Schedule",
    items: [
      "Quickly pre-set ad schedule or select custom time",
      "Easily edit in campaign view with time-conflict checking",
    ],
  },
  {
    title: "Geo Location Constants",
    items: [
      "Select Target US Locations",
      "Exclude Target US Locations",
      "Modify as you see fit",
    ],
  },
  {
    title: "Bid Separation",
    items: [
      "Creates 2 to 3 campaigns per operation",
      "Priority settings of high & Low, or high, medium, low",
      "Negative keywords added at campaign level",
    ],
  },
];
export const StructuredCampaignFeatures = ({
  userTheme,
}: CampaignStructureTheme) => {
  return (
    <Container maxWidth="lg">
      <Stack sx={{ width: "100%" }} alignItems="center">
        <Grid
          item
          xs={10}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        ></Grid>
        <Grid item xs={12}>
          <Paper elevation={1} sx={{ padding: "2rem" }}>
            <Stack spacing={2}>
              <Typography color="text.secondary" variant="h3">
                Quickly build complex campaigns
              </Typography>

              <Typography
                gutterBottom
                variant="subtitle1"
                color="text.secondary"
              >
                The notion that if you build your campaign, "they will come" is
                understandable if you're new, but also mistaken. While Shopping
                ads have certain constraints, there are ways for us to leverage
                certain settings to optimize our campaigns. Marketing agencies
                charge a hefty sum to implement these campaign stratagies on
                accounts. This is because the process itself can be very long
                when you consider all the steps required. The list below details
                all the steps we perform for you when creating an alpha-beta or
                3-tiered campaign.
              </Typography>
              <Divider />
            </Stack>
          </Paper>
        </Grid>
      </Stack>
    </Container>
  );
};

const features = [
  { feature: "Creates 2 campaigns", alphaBeta: true, threeTiered: false },
  { feature: "Creates 3 campaigns", alphaBeta: false, threeTiered: true },
  { feature: "Shared Budget", alphaBeta: true, threeTiered: true },
  { feature: "CpC Bid Separation", alphaBeta: true, threeTiered: true },
  {
    feature: "High, Medium & Low Negative Keywords Allocation",
    alphaBeta: false,
    threeTiered: true,
  },
  {
    feature: "High & Low Negative Keywords Allocation",
    alphaBeta: true,
    threeTiered: false,
  },
  { feature: "Manage Location Settings", alphaBeta: true, threeTiered: true },
  {
    feature: "Pre or Dynamically Select Ad Schedule",
    alphaBeta: true,
    threeTiered: true,
  },
  { feature: "Appropriate titling", alphaBeta: true, threeTiered: true },
];

export const CampaignFeaturesTables = () => {
  return (
    <Container maxWidth="lg">
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>At a Glance: </TableCell>
              <TableCell>Alpha/Beta</TableCell>
              <TableCell>Three-tiered</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {features?.map((feature, i) => (
              <TableRow key={i}>
                <TableCell>{feature?.feature}</TableCell>

                <TableCell>
                  {feature?.alphaBeta ? (
                    <CheckIcon color="success" />
                  ) : (
                    <CloseIcon color="error" />
                  )}
                </TableCell>

                <TableCell>
                  {feature?.threeTiered ? (
                    <CheckIcon color="success" />
                  ) : (
                    <CloseIcon color="error" />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};
