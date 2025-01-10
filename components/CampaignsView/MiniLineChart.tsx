import React from "react";

import { UserCampaign } from "@/types";
import { LineChart } from "@mui/x-charts/LineChart";

import { DynamicUserCampaign } from "../DataTable/DynamicCampaignTable";

type MiniLineChartData = {
  campaignData: UserCampaign[] | DynamicUserCampaign[];
};

export function MiniLineChart({ campaignData }: MiniLineChartData) {
  let dataMap = new Map([["ALL_TIME", { clicks: 0, impressions: 0 }]]);

  campaignData?.forEach((product) => {
    const key = product?.date || "ALL_TIME";

    if (!dataMap.has(key)) {
      dataMap.set(key, {
        clicks: 0,
        impressions: 0,
      });
    }
    const aggregatedData = dataMap.get(key);

    if (aggregatedData) {
      dataMap.set(key, {
        clicks: aggregatedData?.clicks + product?.clicks,
        impressions: aggregatedData?.impressions + product?.impressions,
      });
    }

    if (dataMap.size > 1) {
      dataMap.delete("ALL_TIME");
    }
  });

  const labels = Array.from(dataMap.keys());
  const dataSet1 = Array.from(dataMap.values()).map((data) => data.clicks);
  const dataSet2 = Array.from(dataMap.values()).map((data) => data.impressions);
  //["#02b2af" "rgb(53, 162, 235)", "rgba(53, 162, 235, 0.5)"]

  return (
    <div style={{ width: "100%", margin: "0 auto" }}>
      <LineChart
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
    </div>
  );
}
