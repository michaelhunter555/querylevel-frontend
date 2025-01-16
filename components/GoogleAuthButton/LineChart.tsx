import React, { useMemo } from "react";

import { ProductPerformanceData } from "@/types";
import Skeleton from "@mui/material/Skeleton";
import { useTheme } from "@mui/material/styles";
import { LineChart as MUILineChart } from "@mui/x-charts/LineChart";

import { StyledFadeIn } from "../Shared/StyledFadeInComponents";

type LineChartData = {
  productsData: ProductPerformanceData[];
  isLoading: boolean;
};

function AreaGradient({ color, id }: { color: string; id: string }) {
  return (
    <defs>
      <linearGradient id={id} x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor={color} stopOpacity={0.5} />
        <stop offset="100%" stopColor={color} stopOpacity={0} />
      </linearGradient>
    </defs>
  );
}

export default function LineChart({ productsData, isLoading }: LineChartData) {
  const theme = useTheme();
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

  return (
    <>
      {isLoading ? (
        <>
          <Skeleton width="100%" height={40} />
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} width="85%" height={45} />
          ))}
        </>
      ) : (
        <StyledFadeIn visible={!isLoading} delay={0.1}>
          {/* <Line options={options} data={data} /> */}
          <MUILineChart
            xAxis={[
              {
                data: labels,
                label: "Date",
                scaleType: "point",

                tickSize: 6,

                slots: {
                  axisLine: (props) => (
                    <line {...props} stroke="#ccc" strokeWidth={1} />
                  ),
                  axisTick: (props) => (
                    <line {...props} stroke="#ccc" strokeWidth={1} />
                  ),
                },
              },
            ]}
            series={[
              {
                id: "clicks",
                data: dataSet1,
                label: "Clicks",
                curve: "linear",
                showMark: false,
                stack: "total",
              },
              {
                id: "impressions",
                data: dataSet2,
                label: "Impressions",
                curve: "linear",
                showMark: false,
                stack: "total",
              },
            ]}
            height={355}
          />
        </StyledFadeIn>
      )}
    </>
  );
}
