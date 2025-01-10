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
        marginBottom: "0.5rem",
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
            <Typography variant="subtitle2" color="text.secondary">
              {text}
            </Typography>
            <Divider flexItem />
            <Typography variant="subtitle1" color="text.secondary">
              {text === "Total Spent" && "$"} {text === "Avg. CpC" && "$"}{" "}
              {value}
            </Typography>
            <svg width={0} height={0}>
              <defs>
                <linearGradient
                  id="sparkLine_gradient"
                  x1="0%"
                  y1="0%"
                  x2="0%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#e01cd5" />
                  <stop offset="100%" stopColor="#1CB5E0" />
                </linearGradient>
              </defs>
            </svg>
            <SparkLineChart
              //colors={["url(#sparkLine_gradient)"]}
              data={sparkLineData}
              height={40}
            />
            <Box sx={{ width: "100%" }}></Box>
          </>
        )}
      </Grid>
    </Paper>
  );
};
