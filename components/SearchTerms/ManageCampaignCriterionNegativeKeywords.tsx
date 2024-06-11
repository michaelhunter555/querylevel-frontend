import React, { useMemo, useState } from "react";

import {
  MaterialReactTable,
  MRT_ColumnDef,
  MRT_GlobalFilterTextField,
  useMaterialReactTable,
} from "material-react-table";

import { useInvalidateQuery } from "@/hooks/invalidateQueries";
import { useGetShoppingSearchTerms } from "@/hooks/reports-hooks";
import { useAnchorElement } from "@/hooks/useAnchorElement";
import AddIcon from "@mui/icons-material/Add";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Fab from "@mui/material/Fab";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";

import { AddNegativeKeywordsModal } from "./AddNegativeKeywords";
import { BulkMatchTypeModal } from "./BulkMatchTypeModal";
import { EditNegativeKeywordPopper } from "./EditNegativeKeywordPopper";

interface ManageNegativeKeywords {
  data: NegativeCampaignCriterionKeywordView[];
  campaignId: string;
  keywordLevel: "CAMPAIGN" | "AD_GROUP";
}

type NegativeCampaignCriterionKeywordView = {
  campaign_criterion: {
    keyword: { text: string; match_type: number };
    negative: boolean;
    criterion_id: number;
  };
  campaign: { id: number; name: string };
  keyword: { text: string; match_type: number };
  negative: boolean;
  criterion_id: number;
};

const matchTypeMapping = {
  0: "UNSPECIFIED",
  1: "UNKNOWN",
  2: "EXACT",
  3: "PHRASE",
  4: "BROAD",
};

//campaignId = data?.[0]?.resource_name?.split("~")[0]?.split("/")[3]
const ManageCampaignCriterionNegativeKeywords = ({
  data,
  keywordLevel,
}: ManageNegativeKeywords) => {
  const [openBulkMatch, setOpenBulkMatchType] = useState<boolean>(false);
  const [rowSelection, setRowSelection] = useState({});
  const [openAddKeywordModal, setOpenAddKeywordModal] =
    useState<boolean>(false);
  const {
    bulkRemoveIsLoading,
    bulkRemoveCampaignCriterionNegativeKeywords: bulkRemove,
  } = useGetShoppingSearchTerms();
  const { invalidateQuery } = useInvalidateQuery();
  const { anchorEl, anchorElementHandler } = useAnchorElement();
  const editAnchorId = anchorEl ? "editKeyword" : null;

  const handleBulkModalOpen = () => setOpenBulkMatchType((prev) => !prev);
  const handleKeywordModal = () => {
    setOpenAddKeywordModal((prev) => !prev);
  };

  const columns = useMemo<
    MRT_ColumnDef<NegativeCampaignCriterionKeywordView>[]
  >(
    () => [
      {
        accessorKey: "keyword.text",
        header: "Keyword",
        size: 150,
        enableColumnActions: true,
      },
      {
        accessorFn: (row) =>
          `${
            matchTypeMapping[
              Number(row?.keyword?.match_type) as keyof typeof matchTypeMapping
            ]
          }`,
        accessorKey: "keyword.match_type",
        header: "Match type",
        size: 150,
      },
      {
        accessorKey: "criterion_id",
        header: "id",
        size: 150,
      },
      {
        accessorKey: "campaign.name",
        header: "campaign",
        size: 150,
      },
    ],
    [data]
  );

  const table = useMaterialReactTable?.({
    columns,
    data,
    localization: {
      actions: "Edit",
    },
    state: {
      rowSelection,
      density: "compact",
      showGlobalFilter: true,
    },
    initialState: {
      columnPinning: { left: ["mrt-row-select"] },
    },

    paginationDisplayMode: "pages",
    onRowSelectionChange: setRowSelection,
    enableRowSelection: true,
    enableColumnPinning: true,
    enableRowActions: true,
    enableDensityToggle: false,
    enableExpandAll: false,
    positionToolbarAlertBanner: "bottom",
    getRowId: (row, index) =>
      `${row?.campaign?.id}-${row?.criterion_id}-${row?.keyword?.match_type}-${row?.keyword?.text}`,
    renderTopToolbar: ({ table }) => {
      //edit text

      //bulk
      //edit matchtype - criterion_id, adGroupId, search_term, matchType
      //remove - criterion_id, adGroupId
      const campaignData = table
        .getRowModel()
        .rows.slice(0, 1)
        .map((row) => row.original.campaign);
      const noneSelected = Object.keys(rowSelection).length === 0;
      return (
        <>
          <BulkMatchTypeModal
            open={openBulkMatch}
            onClose={handleBulkModalOpen}
            keywords={rowSelection}
            onRowSelection={setRowSelection}
            keywordLevel={keywordLevel}
          />
          <AddNegativeKeywordsModal
            open={openAddKeywordModal}
            onClose={handleKeywordModal}
            campaign={campaignData}
            keywordLevel={keywordLevel}
          />
          <Stack
            sx={{ padding: "1rem" }}
            direction="row"
            alignItems="center"
            spacing={2}
          >
            <Tooltip title="Add Campaign Negative Keywords">
              <Fab size="small" color="primary" onClick={handleKeywordModal}>
                <AddIcon />
              </Fab>
            </Tooltip>
            <MRT_GlobalFilterTextField table={table} />
            {!noneSelected && (
              <>
                {/* bulkEditMatchTypeNegativeKeywords */}
                <Button variant="outlined" onClick={handleBulkModalOpen}>
                  Bulk Edit Match Type
                </Button>
                {/* bulkRemoveCampaignCriterionNegativeKeywords */}
                <Button
                  variant="outlined"
                  color="error"
                  onClick={async () => {
                    await bulkRemove(rowSelection).then(async () => {
                      await invalidateQuery("negativeKeywords");
                      setRowSelection({});
                    });
                  }}
                >
                  {bulkRemoveIsLoading ? "...Removing" : "Bulk remove"}
                </Button>
              </>
            )}
          </Stack>
        </>
      );
    },
    renderRowActions: ({ row }) => (
      <Box sx={{ display: "flex" }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          {/* <Typography color="text.secondary" variant="subtitle2">
            {row?.original?.keyword?.text}
          </Typography> */}

          <IconButton
            aria-describedby={editAnchorId as string}
            sx={{ padding: "2px" }}
            onClick={(event: React.MouseEvent<HTMLElement>) => {
              anchorElementHandler(event, row?.original?.criterion_id);
              // console.log("anchorEl", anchorEl);
              // console.log("open", event, row?.original?.criterion_id);
            }}
          >
            <AddIcon sx={{ fontSize: "15px" }} />
          </IconButton>
        </Stack>
        <EditNegativeKeywordPopper
          keywordLevel={keywordLevel}
          open={Boolean(anchorEl[row?.original?.criterion_id])}
          id={editAnchorId as string}
          anchorEl={anchorEl[row?.original?.criterion_id]}
          selectedKeyword={row?.original}
          criterionId={row?.original?.criterion_id}
          placement="bottom-start"
          onCancel={(event: React.MouseEvent<HTMLElement>) => {
            anchorElementHandler(event, row?.original?.criterion_id);
            // console.log(event, row?.original?.criterion_id);
            // console.log("cancel", event, row?.original?.criterion_id);
          }}
        />
      </Box>
    ),
  });

  return <MaterialReactTable table={table} />;
};

export default ManageCampaignCriterionNegativeKeywords;
