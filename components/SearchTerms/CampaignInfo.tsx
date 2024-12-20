import React from "react";

import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import LinearProgress from "@mui/material/LinearProgress";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

import { StyledFadeIn } from "../Shared/StyledFadeInComponents";

const StyledPaper = styled(Paper)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  alignItems: "end",
  gap: "10px",
  borderRadius: "15px",
  padding: "2rem",
}));

interface ICampaignInfo {
  isLoading: boolean;
  campaignNames: string[];
  selectedCampaign: string;
  onCampaignChange: (val: string) => void;
  //onGetCampaignNames: (val: string) => void;
}

export const CampaignNameAndId = ({
  isLoading,
  campaignNames,
  selectedCampaign,
  onCampaignChange,
}: //onGetCampaignNames,
ICampaignInfo) => {
  return (
    <StyledPaper elevation={0}>
      <Stack justifyContent="center">
        <Typography>1. Select Available Campaign</Typography>
        {isLoading && <LinearProgress />}
        <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
          {!isLoading && campaignNames?.length === 0 && (
            <Typography color="text.secondary">
              No Active Campaigns Found
            </Typography>
          )}
          {!isLoading &&
            campaignNames?.map((campaign, i) => {
              return (
                <StyledFadeIn key={i} delay={i * 0.1} visible={!isLoading}>
                  <Chip
                    label={campaign.split(":")[0]}
                    clickable={true}
                    variant="outlined"
                    component={Button}
                    onClick={() => {
                      if (selectedCampaign !== campaign) {
                        onCampaignChange(campaign);
                        //onGetCampaignNames(campaign);
                      }
                    }}
                    color={
                      selectedCampaign === campaign ? "primary" : "default"
                    }
                  />
                </StyledFadeIn>
              );
            })}
        </Stack>
      </Stack>
    </StyledPaper>
  );
};

export default CampaignNameAndId;
