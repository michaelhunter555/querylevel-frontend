import React, { useMemo } from "react";

import { ProductPerformanceData } from "@/types";
import Skeleton from "@mui/material/Skeleton";
import { LineChart as MUILineChart } from "@mui/x-charts/LineChart";

import { StyledFadeIn } from "../Shared/StyledFadeInComponents";

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

  // const data = useMemo(
  //   () => ({
  //     labels,
  //     datasets: [
  //       {
  //         label: "clicks",
  //         data: dataSet1,
  //         borderColor: "#02b2af",
  //         backgroundColor: "#02b2af",
  //       },
  //       {
  //         label: "impressions",
  //         data: dataSet2,
  //         borderColor: "rgb(53, 162, 235)",
  //         backgroundColor: "rgba(53, 162, 235, 0.5)",
  //       },
  //     ],
  //   }),
  //   [labels, dataSet1, dataSet2]
  // );

  console.log(labels, dataSet1, dataSet2);
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
            xAxis={[{ data: labels, label: "Date", scaleType: "point" }]}
            series={[
              {
                data: dataSet1,
                label: "Clicks",
                curve: "linear",
                showMark: false,
              },
              {
                data: dataSet2,
                label: "Impressions",
                curve: "linear",
                showMark: false,
              },
            ]}
            height={355}
          />
        </StyledFadeIn>
      )}
    </>
  );
}
