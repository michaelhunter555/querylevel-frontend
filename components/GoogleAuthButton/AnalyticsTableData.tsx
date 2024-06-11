import React from "react";

import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { SparkLineChart } from "@mui/x-charts/SparkLineChart";

type AnlayticsTableData = {
  text: string;
  value: number;
  isLoading: boolean;
  sparkLineData: Array<number>;
};

export const AnalyticsTableData = ({
  text,
  value,
  isLoading,
  sparkLineData,
}: AnlayticsTableData) => {
  return (
    <Paper
      sx={{
        borderRadius: "15px",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        padding: "1rem",
        minWidth: "100px",
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
        {!isLoading && sparkLineData && (
          <>
            <Typography variant="h6" color="text.secondary">
              {text}
            </Typography>
            <Divider flexItem />
            <Typography variant="subtitle1" color="text.secondary">
              {text === "Total Spent" && "$"} {text === "Avg. CpC" && "$"}{" "}
              {value}
            </Typography>
            <SparkLineChart data={sparkLineData} height={40} />
            <Box sx={{ width: "100%" }}></Box>
          </>
        )}
      </Grid>
    </Paper>
  );
};
