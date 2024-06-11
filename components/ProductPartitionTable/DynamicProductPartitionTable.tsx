import React, { useMemo, useState } from "react";

import {
  MaterialReactTable,
  MRT_ColumnDef,
  useMaterialReactTable,
} from "material-react-table";
import { useSession } from "next-auth/react";

import { useGetProductPartitions } from "@/hooks/productPartion-hook";
import { useAnchorElement } from "@/hooks/useAnchorElement";
import { AdGroupCriterionResource, CriterionData } from "@/types";
import { determineDisplayText } from "@/util/helpers/productPartition/DetermineDisplayText";
import EditIcon from "@mui/icons-material/Edit";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import { StatusDot } from "../Shared/StatusDot";
import { determineNextNode } from "./determineNextNode";
import { EditNodeButton } from "./EditPartitionType/EditNodeButton";
import { TargetAndExcludePopper } from "./EditPartitionType/TargetAndExcludePopper";
import { UpdateCostPerClickPopper } from "./EditPartitionType/UpdateCostPerClickPopper";
import { PartitionModal } from "./PartitionModal";

interface IDynamicProductPartitionTable {
  data: AdGroupCriterionResource[];
  partitionIsLoading: boolean;
  currentAdGroupName: string;
  updateCostPerClick: (
    node: AdGroupCriterionResource,
    cpc: number | null
  ) => Promise<void>;
  bidsAreUpdating: boolean;
  updateNegativeStatus: (
    node: AdGroupCriterionResource,
    cpc: number | null
  ) => Promise<void>;
  negativeStatusLoading: boolean;
  handleEditPartitionTree: (
    selectedNodeId: AdGroupCriterionResource,
    partitions: CriterionData[],
    removedParitions: string[],
    adGroup: string
  ) => Promise<void>;
  editPartitionTreeIsLoading: boolean;
}

export const DynamicProductPartitionTable = ({
  data,
  partitionIsLoading,
  currentAdGroupName,
  updateCostPerClick,
  bidsAreUpdating,
  updateNegativeStatus,
  negativeStatusLoading,
  handleEditPartitionTree,
  editPartitionTreeIsLoading,
}: IDynamicProductPartitionTable) => {
  const { data: session } = useSession();
  const [rowSelection, setRowSelection] = useState({});
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [criterionId, setCriterionId] = useState<number | null>(null);
  const [initialOption, setInitialOption] = useState<string>("brand");
  const { criterionIsLoading, criterionData, getEditablePartitions } =
    useGetProductPartitions();
  const {
    anchorEl: negativeAnchorEl,
    anchorElementHandler: handleNegativeAnchor,
    clearAnchorElement: clearNegativeAnchorElement,
  } = useAnchorElement();
  const {
    anchorEl: cpcAnchorEl,
    anchorElementHandler: handleCostPerClickAnchor,
    clearAnchorElement: clearCpcAnchor,
  } = useAnchorElement();

  const userTheme = session?.user?.theme;
  const styledScroll = {
    overflowX: "auto",

    pointerEvents: "auto",
    "&::-webkit-scrollbar": {
      width: "2px",
    },
    "&::-webkit-scrollbar-thumb": {
      background: "transparent",
      borderRadius: "30px",
    },
    "&::-webkit-scrollbar-thumb:hover": {
      background: userTheme === "light" ? "#8b8b8d" : "rgb(29,29,29)",
    },
    "&::-webkit-scrollbar-track": {
      background: userTheme === "light" ? "#f1f1f1" : "rgb(29,29,29)",
      borderRadius: "30px",
    },
    "&:hover": {
      "&::-webkit-scrollbar-thumb": {
        background: userTheme === "light" ? "#b5b5b5" : "#262f37",
      },
      "&::-webkit-scrollbar-thumb:hover": {
        transition: "background 1s ease-in",
        background: userTheme === "light" ? "#8b8b8d" : "#262f37",
      },
      "&::-webkit-scrollbar-track": {
        background: userTheme == "light" ? "#f1f1f1" : "rgb(29,29,29)",
      },
    },
  };

  //negaitve anchorEl id
  const negativeId = negativeAnchorEl ? "ExcludeOrTarget" : null;
  const negativeAnchorHandler = (
    event: React.MouseEvent<HTMLElement>,
    id: number | string
  ) => {
    handleNegativeAnchor(event, id);
    if (cpcAnchorEl) {
      clearCpcAnchor();
    }
  };

  //cpc anchorEl id
  const costPerClickId = cpcAnchorEl ? "UpdateCostPerClick" : null;
  const costPerClickAnchorHandler = (
    event: React.MouseEvent<HTMLElement>,
    id: number | string
  ) => {
    handleCostPerClickAnchor(event, id);
    if (negativeAnchorEl) {
      clearNegativeAnchorElement();
    }
  };

  const columns = useMemo<Array<MRT_ColumnDef<AdGroupCriterionResource>>>(
    () => [
      {
        accessorKey: "status",
        enableColumnOrdering: false,
        header: "",
        size: 50,
        Cell: ({ cell, row }) => {
          const isHovered = hoveredNode === row?.original?.criterion_id;
          const handleMouseEnter = () =>
            setHoveredNode(row.original.criterion_id);
          const handleMouseLeave = () => setHoveredNode(null);
          //console.log("IsHovered", isHovered);
          return (
            <Stack
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              direction="row"
              alignItems="center"
              sx={{ minWidth: 30 }}
            >
              <StatusDot
                active={
                  cell.getValue() === 2 && row.original.listing_group.type !== 2
                }
              />
              {(isHovered && row?.original?.listing_group?.type !== 2) ||
              negativeAnchorEl[row?.original?.criterion_id] ? (
                <IconButton
                  aria-describedby={negativeId as string}
                  sx={{ padding: "2px" }}
                  size="small"
                  onClick={(event: React.MouseEvent<HTMLElement>) =>
                    negativeAnchorHandler(event, row?.original?.criterion_id)
                  }
                >
                  <KeyboardArrowDownIcon sx={{ fontSize: 12 }} />
                </IconButton>
              ) : (
                ""
              )}
              <TargetAndExcludePopper
                node={row.original}
                negativeId={negativeId as string}
                negativeAnchorEl={negativeAnchorEl}
                negativeStatusLoading={negativeStatusLoading}
                negativeAnchorHandler={negativeAnchorHandler}
                updateNegativeStatus={updateNegativeStatus}
              />
            </Stack>
          );
        },
      },

      {
        id: "productTitle",
        header: "product",
        size: 280,
        Cell: ({ cell, row }) => {
          let displayText = determineDisplayText(row?.original);
          const hasChildren =
            row?.original?.children && row?.original?.children?.length > 0;

          const modalEditHandler = (criterionId: number) => {
            const determineSelectOption = determineNextNode(row?.original);
            setInitialOption(determineSelectOption);
            setOpenModal(true);
            setCriterionId(criterionId);
            getEditablePartitions();
          };
          return (
            <>
              <PartitionModal
                selectedNode={row?.original}
                value={
                  criterionId === row?.original?.criterion_id ? displayText : ""
                }
                open={openModal && criterionId === row?.original?.criterion_id}
                onClose={() => {
                  setOpenModal(false);
                  setCriterionId(null);
                }}
                partitionType={row?.original?.listing_group.type}
                criterionData={criterionData}
                isLoading={criterionIsLoading}
                initialOption={initialOption}
                children={row?.original?.children}
                adGroupResource={row?.original?.adGroupResource}
                handleEditPartitionTree={handleEditPartitionTree}
                editPartitionTreeIsLoading={editPartitionTreeIsLoading}
                //setOperationComplete={setOperationComplete}
              />
              <Grid
                container
                direction="row"
                alignItems="center"
                //sx={{ paddingLeft: `${level * 10}px` }}
              >
                <Grid item xs={10}>
                  {hasChildren ? (
                    <Typography variant="subtitle2" sx={{ fontSize: 13 }}>
                      {displayText}
                    </Typography>
                  ) : (
                    <Typography variant="subtitle2" sx={{ fontSize: 13 }}>
                      {displayText}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={1}>
                  {hoveredNode === row?.original?.criterion_id && (
                    <EditNodeButton
                      node={row?.original}
                      modalEditHandler={modalEditHandler}
                    />
                  )}
                </Grid>
              </Grid>
            </>
          );
        },
      },
      {
        accessorFn: (row) => `${(row?.cpc_bid_micros / 1000000).toFixed(2)}`,
        accessorKey: "cpc_bid_micros",
        header: "Max Cpc",
        size: 75,
        Cell: ({ cell, row }) => (
          <Box>
            {row?.original?.negative &&
            row?.original?.listing_group?.type === 3 ? (
              "Excluded"
            ) : row?.original?.listing_group?.type === 2 ? (
              "--"
            ) : (
              <>
                {(row?.original?.cpc_bid_micros / 1000000).toFixed(2)}{" "}
                <Tooltip title="Change Bid">
                  <IconButton
                    aria-describedby={costPerClickId as string}
                    size="small"
                    sx={{ padding: "2px" }}
                    onClick={(event: React.MouseEvent<HTMLElement>) =>
                      costPerClickAnchorHandler(
                        event,
                        row?.original?.criterion_id
                      )
                    }
                  >
                    {hoveredNode === row?.original?.criterion_id ||
                    cpcAnchorEl[row?.original?.criterion_id] ? (
                      <EditIcon sx={{ fontSize: 13 }} />
                    ) : (
                      ""
                    )}{" "}
                  </IconButton>
                </Tooltip>
                <UpdateCostPerClickPopper
                  node={row?.original}
                  costPerClickId={costPerClickId as string}
                  cpcAnchorEl={cpcAnchorEl}
                  bidsAreUpdating={bidsAreUpdating}
                  costPerClickAnchorHandler={costPerClickAnchorHandler}
                  updateCostPerClick={updateCostPerClick}
                />
              </>
            )}
          </Box>
        ),
      },
      {
        accessorKey: "clicks",
        header: "Clicks",
        size: 75,
      },
      {
        accessorFn: (row) =>
          `${
            row?.clicks > 0
              ? (row?.cost_micros / row?.clicks / 1000000)?.toFixed(2)
              : 0
          }`,
        id: "ctr",
        header: "Ctr",
        size: 75,
      },
      {
        accessorKey: "impressions",
        header: "Impressions.",
        size: 75,
      },
      {
        accessorFn: (row) => `${(row?.cost_micros / 1000000).toFixed(2)}`,
        accessorKey: "cost_micros",
        header: "Cost",
        size: 75,
      },
      {
        accessorKey: "conversions",
        header: "conversions.",
        size: 75,
      },
    ],
    [data]
  );

  const table = useMaterialReactTable({
    columns,
    data,
    enableExpanding: true,
    enableExpandAll: false,
    getSubRows: (row) => row?.children,
    enableRowSelection: true,
    muiTableHeadCellProps: {
      //simple styling with the `sx` prop, works just like a style prop in this example
      sx: {
        fontWeight: "normal",
        fontSize: "13px",
      },
    },
    muiSelectCheckboxProps: {
      sx: { "& .MuiSvgIcon-root": { fontSize: 15, padding: "0 0.1rem" } },
    },
    muiExpandButtonProps: {
      sx: { fontSize: 13 },
    },
    muiTableBodyCellProps: {
      sx: {
        fontWeight: "normal",
        fontSize: "12px",
      },
    },
    muiTableProps: {
      sx: { ...styledScroll },
    },
    enableColumnActions: false,
    getRowId: (row) => `${row?.criterion_id}`,
    getRowCanExpand: (row) => row?.original?.listing_group?.type !== 3,
    layoutMode: "grid-no-grow",
    state: {
      density: "compact",
      rowSelection: rowSelection,
      isLoading: partitionIsLoading,
      showGlobalFilter: true,
    },
    onRowSelectionChange: setRowSelection,
    positionToolbarAlertBanner: "top",
    renderTopToolbar: ({ table }) => {
      //const NoRowsSelected = Object.keys(rowSelection)?.length === 0;
      //CREATE ROOT NODE OPERATION OR HANDLE IN RETURN
      return (
        <Stack direction="row" alignItems="center" spacing={2}>
          <Button sx={{ fontSize: 10 }}>Bulk cpc</Button>

          <Button sx={{ fontSize: 10 }}>Target/exclude</Button>
        </Stack>
      );
    },
  });

  return (
    <>
      <MaterialReactTable table={table} />
    </>
  );
};
