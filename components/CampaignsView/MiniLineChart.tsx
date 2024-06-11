import React from "react";

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

import { UserCampaign } from "@/types";

import { DynamicUserCampaign } from "../DataTable/DynamicCampaignTable";

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
  const data = {
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
  };

  return (
    <div style={{ width: "80%", margin: "0 auto" }}>
      <Line options={options} data={data} />
    </div>
  );
}
