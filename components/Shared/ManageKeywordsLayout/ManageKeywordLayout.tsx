import React, { useEffect, useState } from "react";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";

import CampaignNameAndId from "@/components/SearchTerms/CampaignInfo";
import {
  Alert,
  Box,
  Button,
  Chip,
  Grid,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";

interface ManageKeywordLayoutProps {
  keywordLevel: "AD_GROUP" | "CAMPAIGN";
  getCampaignNames: () => Promise<string[]>;
  getNegativeKeywords: (
    campaignId: string,
    keywordLevel: "AD_GROUP" | "CAMPAIGN"
  ) => Promise<any>;
  //component
  ManageNegativeKeywordsComponent: React.ComponentType<{
    keywordLevel: "AD_GROUP" | "CAMPAIGN";
    campaignId: string;
    data: any;
  }>;
}

const ManageKeywordsLayout = ({
  keywordLevel,
  getCampaignNames,
  getNegativeKeywords,
  ManageNegativeKeywordsComponent, // Component passed as a prop
}: ManageKeywordLayoutProps) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [campaignId, setCampaignId] = useState("");

  const sessionIsValid = session?.user?._id && session?.user?.googleAccountId;

  useEffect(() => {
    if (!sessionIsValid) {
      router.push("/user-dashboard");
    }
  }, [sessionIsValid]);

  const handleCampaignChange = (campaignId: string) => {
    setCampaignId(campaignId);
    localStorage.setItem("campaign", campaignId);
  };

  const { data: campaignNames, isLoading: campaignNamesLoading } = useQuery({
    queryKey: ["getCampaignNames"],
    queryFn: getCampaignNames,
    enabled: Boolean(session?.user?._id),
    staleTime: Infinity,
  });

  useEffect(() => {
    const storedData = localStorage.getItem("campaign");
    if (storedData && !campaignNamesLoading) {
      setCampaignId(storedData);
    }
  }, [campaignNamesLoading]);

  const { data: negativeKeywordsData, isLoading: negativeKeywordsLoading } =
    useQuery({
      queryKey: ["negativeKeywords", campaignId?.split(":")[1], keywordLevel],
      queryFn: () =>
        getNegativeKeywords(campaignId?.split(":")[1], keywordLevel),
      enabled: Boolean(campaignId?.split(":")[1] && session?.user?._id),
      staleTime: 10 * 60 * 60 * 1000,
    });

  return (
    <Grid container direction="column" spacing={2} sx={{ marginBottom: 3 }}>
      <Grid item>
        <CampaignNameAndId
          isLoading={campaignNamesLoading}
          campaignNames={campaignNames as string[]}
          selectedCampaign={campaignId}
          onCampaignChange={handleCampaignChange}
        />
      </Grid>
      <Grid item>
        {campaignId?.split(":")[1] &&
        !negativeKeywordsLoading &&
        negativeKeywordsData ? (
          <Box sx={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            <Typography color="text.secondary" variant="h5">
              {keywordLevel === "AD_GROUP" ? "Ad Group" : "Campaign"} Negative
              Keywords
            </Typography>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Chip
                label="Back to search Terms"
                prefetch={false}
                component={Link}
                href="/search-terms"
                variant="outlined"
              />
              <Alert severity="info">
                Add, modify and remove negative keywords at the{" "}
                {keywordLevel === "AD_GROUP" ? "ad group" : "campaign"} level.
              </Alert>
              <Button
                component={Link}
                prefetch={false}
                href={
                  keywordLevel === "AD_GROUP"
                    ? "/manage-campaign-keywords"
                    : "/manage-ad-group-keywords"
                }
              >
                {keywordLevel === "AD_GROUP"
                  ? "View Campaign Level"
                  : "View Ad Group Level"}
              </Button>
            </Stack>
            <ManageNegativeKeywordsComponent
              keywordLevel={keywordLevel}
              campaignId={campaignId?.split(":")[1]}
              data={
                keywordLevel === "AD_GROUP"
                  ? negativeKeywordsData?.flattenAdGroupCriterionKeywords
                  : negativeKeywordsData?.flattenCampaignCriterionKeywords?.filter(
                      (k: { [key: string]: string }) => !!k.keyword
                    )
              }
            />
          </Box>
        ) : (
          !negativeKeywordsLoading &&
          !campaignId?.split(":")[1] && (
            <Typography
              align="center"
              sx={{ marginTop: 7 }}
              variant="h4"
              color="text.secondary"
            >
              Select a campaign to get started.
            </Typography>
          )
        )}
        {negativeKeywordsLoading && !negativeKeywordsData && <LinearProgress />}
      </Grid>
    </Grid>
  );
};

export default ManageKeywordsLayout;
