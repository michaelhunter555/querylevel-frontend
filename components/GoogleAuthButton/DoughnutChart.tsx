import React, { useMemo, useState } from "react";

import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";

import { ProductPerformanceData } from "@/types";
import { SelectChangeEvent } from "@mui/material";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { PieChart } from "@mui/x-charts/PieChart";

// Doughnut for now will just be dummy data
ChartJS.register(ArcElement, Tooltip, Legend);

interface DonutData {
  productsData: ProductPerformanceData[];
  isLoading: boolean;
}

type PieData = {
  label?: string;
  value: number;
};

const DoughnutChart = ({ productsData = [], isLoading }: DonutData) => {
  const [dataCase, setDataCase] = useState<string>("Clicks");

  const transformDataForPieChart = useMemo(() => {
    const keyMap: { [key: string]: keyof ProductPerformanceData } = {
      Clicks: "clicks",
      Cost: "cost_micros",
      Impressions: "impressions",
    };

    // Get the correct key for the data
    const dataKey = keyMap[dataCase] || "clicks"; // Defaul

    const sortData = productsData?.sort(
      (a, b) => (b[dataKey] as number) - (a[dataKey] as number)
    );
    const topPerformers = sortData?.slice(0, 3);

    return topPerformers?.map((item) => ({
      label: item.product_title, //.length > 30? item.product_title.slice(0, 30) + "...": item.product_title,
      value: item[dataKey] || 0, // Value for the segment
    }));
  }, [productsData, dataCase]);

  const dataIsEmpty =
    transformDataForPieChart?.every((data) => data.value === 0) ||
    transformDataForPieChart?.length === 0;

  return (
    <Box sx={{ width: "100%" }}>
      {isLoading && (
        <Stack
          flexDirection="row"
          justifyContent="center"
          alignItems="center"
          spacing={2}
        >
          <Skeleton variant="circular" height={250} width={250} />
        </Stack>
      )}
      {!isLoading && (
        <>
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={2}
          >
            <Stack>
              <Typography variant="subtitle1" color="text.secondary">
                Top 3 Performance Pie
              </Typography>
            </Stack>
            <Stack>
              <Select
                sx={{ minWidth: 150 }}
                value={dataCase}
                onChange={(event: SelectChangeEvent<string>) =>
                  setDataCase(event.target.value)
                }
              >
                {["Cost", "Impressions", "Clicks"].map((val, i) => (
                  <MenuItem key={i} value={val}>
                    {val}
                  </MenuItem>
                ))}
              </Select>
            </Stack>
          </Stack>

          {dataIsEmpty ? (
            <Stack
              alignItems="center"
              justifyContent="center"
              sx={{ marginTop: "5rem" }}
            >
              <Typography color="text.secondary">
                {String.fromCodePoint(0x26a0)} No data to display.
              </Typography>
            </Stack>
          ) : (
            <PieChart
              slotProps={{
                legend: {
                  labelStyle: {
                    fontSize: 10,
                  },
                  position: {
                    horizontal: "right",
                    vertical: "top",
                  },
                },
              }}
              series={[
                {
                  data: transformDataForPieChart as PieData[],
                  outerRadius: 100,
                  highlightScope: { faded: "global", highlighted: "item" },
                  faded: {
                    innerRadius: 30,
                    additionalRadius: -30,
                    color: "gray",
                  },
                  cx: "50%",
                  cy: "50%",
                },
              ]}
              height={300}
              margin={{ right: 250 }}
            />
          )}
        </>
      )}
    </Box>
  );
};
export default DoughnutChart;
/* <Doughnut data={data} /> */

// useEffect(() => {
//   switch (dataCase) {
//     case "Clicks":
//       setPieData(clicks);
//       break;
//     case "Cost":
//       setPieData(cost);
//       break;
//     case "Impressions":
//       setPieData(impressions);
//       break;
//     default:
//       setPieData(clicks);
//   }
// }, [dataCase, cost, clicks, impressions]);

// const data = {
//   labels: productTitle,
//   datasets: [
//     {
//       label: dataCase as string,
//       data: pieData,
//       backgroundColor: [
//         "rgba(255, 99, 132, 0.5)",
//         "rgba(54, 162, 235, 0.5)",
//         "rgba(255, 206, 86, 0.5)",
//         "rgba(75, 192, 192, 0.5)",
//         "rgba(153, 102, 255, 0.5)",
//       ],
//       borderColor: [
//         "rgba(255, 99, 132, 1)",
//         "rgba(54, 162, 235, 1)",
//         "rgba(255, 206, 86, 1)",
//         "rgba(75, 192, 192, 1)",
//         "rgba(153, 102, 255, 1)",
//       ],
//       borderWidth: 1,
//     },
//   ],
// };
