import React, { useMemo } from "react";

import { StyledFadeIn } from "@/components/Shared/StyledFadeInComponents";
import { ProductPerformanceData } from "@/types";
import { SelectChangeEvent } from "@mui/material";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";

import SelectDate from "../CampaignsView/SelectDate";
import { AnalyticsTableData } from "./AnalyticsTableData";
import { TempLoadingCard } from "./tempLoadingCards";

interface AccountCard {
  shoppingPerformance: ProductPerformanceData[];
  isLoading: boolean;
  segment: string;
  onSegmentChange: (val: SelectChangeEvent) => void;
}

const AccountDataCards = ({
  shoppingPerformance,
  isLoading,
  segment,
  onSegmentChange,
}: AccountCard) => {
  const homeAppAnalytics = useMemo(() => {
    //total values
    let total = {
      cost: 0,
      clicks: 0,
      impressions: 0,
      conversions: 0,
      averageCpc: 0,
      cpcValues: 0,
    };
    //array lists for chart view
    let sparkLineClicks: number[] = [];
    let sparkLineImpressions: number[] = [];
    let sparkLineConversions: number[] = [];
    let sparkLineCost: number[] = [];
    let sparkLineAvgCpc: number[] = [];

    //loop over shopping performance object
    shoppingPerformance?.forEach((val) => {
      const cost = val?.cost_micros ?? 0;
      const clicks = val?.clicks ?? 0;
      const cpc = val?.average_cpc ?? 0;
      const impressions = val?.impressions ?? 0;
      const conversions = val?.conversions ?? 0;
      //accumulate values
      total.cost += cost;
      total.clicks += clicks;
      total.impressions += impressions;
      total.conversions += conversions;

      //make sure cpc is there otherwise ignore it, no point in adding 0 to something.
      //push the list into arrays
      sparkLineClicks.push(Number(clicks));
      sparkLineImpressions.push(Number(impressions));
      sparkLineConversions.push(Number(conversions));
      sparkLineCost.push(Number(cost));
      sparkLineAvgCpc.push(Number(cpc));
    });

    // Convert total cost to units (already done in the parent component)
    total.cost = total.cost; // No need to divide again, already in units

    // Only calculate average CPC if there are clicks, otherwise, it remains 0
    if (total.clicks > 0) {
      total.averageCpc = total.cost / total.clicks; // Cost is already in units, clicks are unitless (whole nums)
    }

    return [
      {
        text: "Total Spent",
        value: Number(total?.cost?.toFixed(2) || 0),
        chartSegment: sparkLineCost,
      },
      {
        text: "Clicks",
        value: total?.clicks || 0,
        chartSegment: sparkLineClicks,
      },
      {
        text: "Avg. CpC",
        value: Number(total?.clicks > 0 ? total?.averageCpc?.toFixed(2) : 0),
        chartSegment: sparkLineAvgCpc,
      },
      {
        text: "Impressions",
        value: total?.impressions || 0,
        chartSegment: sparkLineImpressions,
      },
      {
        text: "Conversions",
        value: total.conversions,
        chartSegment: sparkLineConversions,
      },
    ];
  }, [shoppingPerformance]);

  const segmentChangeHandler = (val: SelectChangeEvent<string>) => {
    onSegmentChange(val);
  };

  return (
    <Grid
      container
      spacing={1}
      alignItems="center"
      justifyContent="start"
      sx={{
        display: "flex",
        gap: "10px",
        flexDirection: { xs: "column", md: "row" },
      }}
    >
      {isLoading && <TempLoadingCard />}

      {!isLoading &&
        shoppingPerformance &&
        homeAppAnalytics?.map((data, index) => (
          <StyledFadeIn
            key={index}
            visible={Boolean(!isLoading)}
            delay={0.1}
            sx={{
              width: { xs: "100%", md: "auto" },
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
            }}
          >
            <AnalyticsTableData
              key={index}
              text={data?.text}
              value={data?.value as number}
              isLoading={isLoading}
              sparkLineData={data?.chartSegment as number[]}
            />
          </StyledFadeIn>
        ))}
      <Divider flexItem sx={{ marginTop: "1rem" }} />

      <SelectDate
        removeAllTime={true}
        segment={segment}
        onSegmentChange={segmentChangeHandler}
        isLoading={isLoading}
      />
    </Grid>
  );
};

export default AccountDataCards;
