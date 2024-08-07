import React, { useMemo, useState } from "react";

import {
  MaterialReactTable,
  MRT_ColumnDef,
  MRT_GlobalFilterTextField,
  MRT_RowSelectionState,
  useMaterialReactTable,
} from "material-react-table";

import { useInvalidateQuery } from "@/hooks/invalidateQueries";
import { useGetShoppingSearchTerms } from "@/hooks/reports-hooks";
import { TSearchTerms } from "@/types";
import BlockIcon from "@mui/icons-material/Block";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import { SelectChangeEvent } from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { StyledFadeIn } from "../Shared/FadeInComponent";

interface DynamicSearchTermTable {
  data: TSearchTerms[];
  isLoading: boolean;
  onRowSelection: React.Dispatch<React.SetStateAction<MRT_RowSelectionState>>;
  rowSelection: MRT_RowSelectionState;
}

enum SearchTermTargetingStatus {
  UNSPECIFIED = 0,
  UNKNOWN = 1,
  ADDED = 2,
  EXCLUDED = 3,
  ADDED_EXCLUDED = 4,
  NONE = 5,
}

const reverseSearchTermTargetingStatusMap: { [key: string]: string } = {
  [SearchTermTargetingStatus.UNSPECIFIED]: "UNSPECIFIED",
  [SearchTermTargetingStatus.UNKNOWN]: "UNKNOWN",
  [SearchTermTargetingStatus.EXCLUDED]: "EXCLUDED",
  [SearchTermTargetingStatus.NONE]: "NONE",
};

const DynamicSearchTermTable = ({
  data,
  isLoading,
  onRowSelection,
  rowSelection,
}: DynamicSearchTermTable) => {
  const [keywordMatchType, setKeywordMatchType] = useState<string>("EXACT");
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [negativeKeywordLevel, setNegativeKeywordLevel] = useState("AD_GROUP");
  const {
    addAdGroupNegativeKeywords,
    addCampaignNegativeKeywords,
    addNegativeKeywordsLoading,
  } = useGetShoppingSearchTerms();
  const { invalidateQuery } = useInvalidateQuery();
  const columns = useMemo<MRT_ColumnDef<TSearchTerms>[]>(
    () => [
      {
        accessorKey: "search_term",
        header: "Search Term",
        size: 150,
      },
      {
        accessorFn: (row) =>
          `${reverseSearchTermTargetingStatusMap[row?.status]}`,
        accessorKey: "status",
        header: "Status",
        size: 100,
        Cell: ({ cell }) => (
          <>
            {cell.row.original?.status ===
            SearchTermTargetingStatus.EXCLUDED ? (
              <Stack direction="row" alignItems="center" spacing={1}>
                <BlockIcon color="error" />
                <Typography variant="subtitle2" color="text.secondary">
                  Excluded
                </Typography>
              </Stack>
            ) : (
              <Typography variant="subtitle2" color="text.secondary">
                {reverseSearchTermTargetingStatusMap[cell.row.original?.status]}
              </Typography>
            )}
          </>
        ),
      },
      {
        accessorKey: "adGroupName",
        header: "Ad Group",
        size: 100,
      },
      {
        accessorKey: "clicks",
        header: "Clicks",
        size: 100,
      },
      {
        accessorKey: "impressions",
        header: "Impressions",
        size: 100,
      },
      {
        accessorKey: "search_term_match_type",
        header: "Match Type",
        size: 100,
      },
      {
        accessorFn: (row) => `${(row.cost_micros / 1000000).toFixed(2)}`,
        accessorKey: "cost_micros",
        header: "Cost",
        size: 100,
      },
      {
        accessorFn: (row) =>
          `${
            row.clicks > 0
              ? (row.cost_micros / 1000000 / row.clicks).toFixed(2)
              : "0.00"
          }`,
        accessorKey: "costPerClick",
        header: "Cpc",
        size: 150,
      },
    ],
    [data]
  );

  //console.log("keywordLevel to add for search term", rowSelection);
  const table = useMaterialReactTable?.({
    columns,
    data,
    enableRowSelection: (row) => row?.original.status !== 3,
    getRowId: (row, i) =>
      `${row?.search_term}|${row?.resource_name?.split("~")[2]}|${
        data?.[0]?.adGroupId
      }|${data?.[0]?.campaignId}`,
    state: {
      showGlobalFilter: true,
      isLoading: isLoading,
      rowSelection: rowSelection,
      density: "compact",
    },
    autoResetPageIndex: false,
    paginationDisplayMode: "pages",
    positionToolbarAlertBanner: "bottom",
    enableColumnActions: false,
    onRowSelectionChange: onRowSelection,
    renderTopToolbar: ({ table }) => {
      const handleClearSelections = () => {
        onRowSelection({});
      };
      const noneSelected = Object.keys(rowSelection).length === 0;

      return (
        <Stack
          direction="row"
          alignItems="center"
          spacing={3}
          sx={{ padding: "1rem" }}
        >
          <Stack>
            <Typography variant="subtitle2" color="text.secondary">
              Fiter Selection
            </Typography>
            <MRT_GlobalFilterTextField table={table} />
          </Stack>

          <Stack>
            <Typography variant="subtitle2" color="text.secondary">
              Add Negative Keywords
            </Typography>
            <Button
              variant="contained"
              disabled={noneSelected}
              //await then reset state if successful api response
              onClick={async () => {
                if (negativeKeywordLevel === "AD_GROUP") {
                  await addAdGroupNegativeKeywords(
                    rowSelection,
                    keywordMatchType
                  ).then(async () => {
                    await invalidateQuery("searchTermView");
                  });
                } else if (negativeKeywordLevel === "CAMPAIGN") {
                  await addCampaignNegativeKeywords(
                    rowSelection,
                    keywordMatchType
                  ).then(async () => {
                    await invalidateQuery("searchTermView");
                  });
                }
                onRowSelection({});
              }}
            >
              {addNegativeKeywordsLoading
                ? "...loading"
                : "Add Negative Keywords "}
            </Button>
          </Stack>

          <Box>
            <Stack alignItems="center">
              <Typography variant="subtitle2" color="text.secondary">
                Set Match Type
              </Typography>
            </Stack>

            <ButtonGroup variant="outlined">
              {["EXACT", "PHRASE", "BROAD"].map((matchType, i) => (
                <Button
                  key={matchType}
                  size="small"
                  variant={i === selectedIndex ? "contained" : "outlined"}
                  onClick={() => {
                    setKeywordMatchType(matchType);
                    setSelectedIndex(i);
                  }}
                >
                  {matchType}
                </Button>
              ))}
            </ButtonGroup>
          </Box>
          <Stack>
            <FormControl>
              <FormLabel
                id="demo-controlled-radio-buttons-group"
                sx={(style) => ({
                  ...style.typography.subtitle2,
                  color: style.palette.text.secondary,
                })}
              >
                Set Level
              </FormLabel>
              <RadioGroup
                aria-labelledby="demo-controlled-radio-buttons-group"
                name="controlled-radio-buttons-group"
                value={negativeKeywordLevel}
                onChange={(event: SelectChangeEvent<string>) =>
                  setNegativeKeywordLevel(event.target.value)
                }
              >
                <FormControlLabel
                  value="AD_GROUP"
                  control={<Radio size="small" />}
                  label="Ad Group"
                />
                <FormControlLabel
                  value="CAMPAIGN"
                  control={<Radio size="small" />}
                  label="Campaign"
                />
              </RadioGroup>
            </FormControl>
          </Stack>
          {table?.getIsSomeRowsSelected() && (
            <>
              <Divider orientation="vertical" flexItem />
              <Button onClick={handleClearSelections}>Clear Selections</Button>
            </>
          )}
        </Stack>
      );
    },
  });

  return (
    <StyledFadeIn visible={!isLoading} delay={0.1}>
      <MaterialReactTable table={table} />
    </StyledFadeIn>
  );
};

export default DynamicSearchTermTable;
