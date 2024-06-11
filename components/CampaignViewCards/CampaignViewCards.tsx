import React, { useMemo } from "react";

import { UserCampaign } from "@/types";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

interface CampaignViewCardsProps {
  campaignData: UserCampaign[];
  isLoading: boolean;
}

const CampaignViewCards = ({
  campaignData,
  isLoading,
}: CampaignViewCardsProps) => {
  const aggregatedCampaignData = useMemo(() => {
    const campaignMap: { [key: string]: number } = {
      clicks: 0,
      conversions: 0,
      impressions: 0,
      ctr: 0,
      cost: 0,
      averageCpc: 0,
    };

    campaignData?.forEach((campaign) => {
      campaignMap.clicks += campaign.clicks;
      campaignMap.conversions += campaign.all_conversions;
      campaignMap.impressions += campaign.impressions;
      campaignMap.cost += campaign.cost_micros / 1000000;
    });

    if (campaignMap.impressions > 0) {
      campaignMap.ctr = (campaignMap.clicks / campaignMap.impressions) * 100;
    } else {
      campaignMap.ctr = 0;
    }

    campaignMap.averageCpc =
      campaignMap.clicks > 0 ? campaignMap.cost / campaignMap.clicks : 0;

    return [
      { name: "Clicks", value: campaignMap.clicks },
      { name: "Impressions", value: campaignMap.impressions },
      { name: "CTR", value: campaignMap.ctr.toFixed(2) + " %" },
      { name: "Avg. CPC", value: "$ " + campaignMap.averageCpc.toFixed(2) },
      { name: "Cost", value: "$ " + campaignMap.cost.toFixed(2) },
      { name: "Conversions", value: campaignMap.conversions },
    ];
  }, [campaignData]);

  return (
    <>
      {!isLoading &&
        aggregatedCampaignData?.map(({ name, value }) => (
          <Stack
            key={name}
            sx={{
              minWidth: 100,
              borderRadius: "5px",
              padding: "0.25rem",
            }}
            alignItems="center"
            component={Paper}
          >
            <Stack sx={{ width: "90%" }} alignItems="center">
              <Typography
                variant="subtitle1"
                color="text.secondary"
                fontWeight={600}
              >
                {name}
              </Typography>
            </Stack>
            <Divider flexItem />
            <Stack sx={{ width: "90%" }} alignItems="center">
              <Typography variant="subtitle1" color="text.secondary">
                {value}
              </Typography>
            </Stack>
            {/* <SparkLineChart data={sparkLineData} height={30} /> */}
          </Stack>
        ))}

      {isLoading &&
        Array.from({ length: 6 }).map((_, i) => (
          <Paper key={i}>
            <Stack
              sx={{
                minWidth: 100,
                borderRadius: "5px",
                padding: "0.7rem",
              }}
              alignItems="center"
            >
              <Stack sx={{ width: "90%" }}>
                <Skeleton />
              </Stack>
              <Divider flexItem />
              <Stack sx={{ width: "90%" }}>
                <Skeleton />
              </Stack>
            </Stack>
          </Paper>
        ))}
    </>
  );
};

export default CampaignViewCards;
