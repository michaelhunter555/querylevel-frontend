import React, { useState } from "react";

import { MRT_RowSelectionState } from "material-react-table";
import dynamic from "next/dynamic";
import Link from "next/link";

import { TSearchTerms } from "@/types";
import { SelectChangeEvent } from "@mui/material";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";

import SelectDate from "../CampaignsView/SelectDate";
import { CampaignNameAndId } from "./CampaignInfo";

//import ManageNegativeKeywords from "./ManageNegativeKeywords";
//import DynamicSearchTermTable from "./SearchTermGridTable";

//import ManageCampaignCriterionNegativeKeywords from "./ManageCampaignCriterionNegativeKeywords";
const DynamicSearchTermTable = dynamic(() => import("./SearchTermGridTable"), {
  ssr: false,
  loading: () => <LinearProgress />,
});

interface SearchTermViewProps {
  segment: string;
  onSegmentChange: (str: SelectChangeEvent<string>) => void;
  campaignId: string;
  onSetCampaignId: (brand: string) => void;
  campaignNames: string[];
  campaignNamesLoading: boolean;
  searchTermsIsLoading: boolean;
  searchTermData: TSearchTerms[] | undefined;
}

const SearchTermView = ({
  segment,
  onSegmentChange,
  campaignId,
  onSetCampaignId,
  campaignNames,
  campaignNamesLoading,
  searchTermsIsLoading,
  searchTermData,
}: SearchTermViewProps) => {
  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});

  return (
    <Grid container direction="column" spacing={2} sx={{ marginBottom: 3 }}>
      <Grid item xs={12}>
        <CampaignNameAndId
          isLoading={campaignNamesLoading}
          campaignNames={campaignNames}
          selectedCampaign={campaignId}
          onCampaignChange={(campaign: string) => onSetCampaignId(campaign)}
        />
      </Grid>
      {campaignId ? (
        <>
          <Grid item xs={12}>
            <Typography color="text.secondary" variant="h5">
              Shopping Search Terms
            </Typography>
            <Box
              sx={{
                margin: "1rem 0",
                display: "flex",
                flexDirection: "row",
                gap: "5px",
                alignItems: "center",
              }}
            >
              <SelectDate
                removeAllTime={true}
                segment={segment}
                onSegmentChange={onSegmentChange}
                isLoading={searchTermsIsLoading}
              />
              <Chip
                label="Manage Keywords"
                component={Link}
                href="/manage-ad-group-keywords"
                variant="outlined"
              />

              <Alert severity="info">
                Add negative keywords in bulk. Only one match type can be set
                per operation. Please note that larger operations will
                experience longer wait times.
              </Alert>
            </Box>
            {searchTermData && (
              <DynamicSearchTermTable
                isLoading={searchTermsIsLoading}
                data={searchTermData as TSearchTerms[]}
                onRowSelection={setRowSelection}
                rowSelection={rowSelection}
              />
            )}
            {searchTermsIsLoading && <LinearProgress />}
          </Grid>
        </>
      ) : (
        !campaignId &&
        !searchTermsIsLoading && (
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
    </Grid>
  );
};

export default SearchTermView;
