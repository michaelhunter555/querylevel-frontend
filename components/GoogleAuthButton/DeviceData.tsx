import React, { useMemo } from "react";

import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";

import { ProductPerformanceData } from "@/types";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";

interface DeviceData {
  isLoading: boolean;
  productsData: ProductPerformanceData[];
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  plugins: {
    title: {
      display: true,
      text: "Clicks by Device",
    },
  },
  responsive: true,
  scales: {
    x: {
      stacked: true,
    },
    y: {
      stacked: true,
    },
  },
};

const DeviceType: any = {
  0: "UNSPECIFIED",
  1: "UNKNOWN",
  2: "MOBILE",
  3: "TABLET",
  4: "DESKTOP",
  5: "OTHER",
  6: "CONNECTED_TV",
};

const DeviceData = ({ isLoading, productsData }: DeviceData) => {
  const { labels, mobileData, desktopData, tabletData } = useMemo(() => {
    let deviceMap = new Map();

    productsData?.forEach((product) => {
      const date = product.date;
      const deviceType = DeviceType[product.device] || "UNKNOWN";

      if (!deviceMap.has(date)) {
        deviceMap.set(date, {
          MOBILE: { clicks: 0, impressions: 0, cost_micros: 0 },
          TABLET: { clicks: 0, impressions: 0, cost_micros: 0 },
          DESKTOP: { clicks: 0, impressions: 0, cost_micros: 0 },
        });
      }

      const deviceData = deviceMap.get(date);

      // Update only the relevant device type data
      if (deviceData[deviceType]) {
        deviceData[deviceType].clicks += product.clicks;
        deviceData[deviceType].impressions += product.impressions;
        deviceData[deviceType].cost_micros += product.cost_micros;
      }
    });

    const labels = Array.from(deviceMap.keys());
    const mobileData = labels.map((date) => deviceMap.get(date).MOBILE.clicks);
    const desktopData = labels.map(
      (date) => deviceMap.get(date).DESKTOP.clicks
    );
    const tabletData = labels.map((date) => deviceMap.get(date).TABLET.clicks);

    return { labels, tabletData, desktopData, mobileData };
  }, [productsData]);

  const data = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: "Mobile",
          data: mobileData,
          backgroundColor: "rgb(255, 99, 132)",
        },
        {
          label: "Desktop",
          data: desktopData,
          backgroundColor: "rgb(75, 192, 192)",
        },
        {
          label: "Tablet",
          data: tabletData,
          backgroundColor: "rgb(53, 162, 235)",
        },
      ],
    }),
    [labels, tabletData, desktopData, mobileData]
  );

  return (
    <>
      {isLoading && (
        <Stack direction="column" sx={{ width: "100%" }}>
          <Skeleton width="100%" height={20} />
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} width="85%" height={25} />
          ))}
        </Stack>
      )}
      {!isLoading && <Bar options={options} data={data} />}
    </>
  );
};

export default DeviceData;
