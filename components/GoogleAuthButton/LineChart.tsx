import React, { useMemo } from "react";

import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";

import { ProductPerformanceData } from "@/types";
import Skeleton from "@mui/material/Skeleton";

import { StyledFadeIn } from "../Shared/FadeInComponent";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  animation: {
    duration: 0,
  },
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Shopping Performance",
    },
  },
};

type LineChartData = {
  productsData: ProductPerformanceData[];
  isLoading: boolean;
};

export default function LineChart({ productsData, isLoading }: LineChartData) {
  const { labels, dataSet1, dataSet2 } = useMemo(() => {
    const dataMap = new Map();

    productsData?.forEach((product) => {
      if (!dataMap.has(product.date)) {
        dataMap.set(product.date, {
          clicks: 0,
          impressions: 0,
        });
      }
      const aggregatedData = dataMap.get(product.date);
      dataMap.set(product.date, {
        clicks: aggregatedData.clicks + product.clicks,
        impressions: aggregatedData.impressions + product.impressions,
      });
    });

    const labels = Array.from(dataMap.keys());
    const dataSet1 = Array.from(dataMap.values()).map((data) => data.clicks);
    const dataSet2 = Array.from(dataMap.values()).map(
      (data) => data.impressions
    );

    return { labels, dataSet1, dataSet2 };
  }, [productsData]);

  const data = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: "clicks",
          data: dataSet1,
          borderColor: "#02b2af",
          backgroundColor: "#02b2af",
        },
        {
          label: "impressions",
          data: dataSet2,
          borderColor: "rgb(53, 162, 235)",
          backgroundColor: "rgba(53, 162, 235, 0.5)",
        },
      ],
    }),
    [labels, dataSet1, dataSet2]
  );

  return (
    <>
      {isLoading ? (
        <>
          <Skeleton width="100%" height={40} />
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} width="85%" height={45} />
          ))}
        </>
      ) : (
        <StyledFadeIn visible={!isLoading} delay={0.1}>
          <Line options={options} data={data} />
        </StyledFadeIn>
      )}
    </>
  );
}
