import React, { useState } from "react";

import { useSession } from "next-auth/react";

import { useGetProductPartitions } from "@/hooks/productPartion-hook";
import { useAnchorElement } from "@/hooks/useAnchorElement";
import { AdGroupCriterionResource, RenderRowProps } from "@/types"; // Adjust this path based on your project structure
import { determineDisplayText } from "@/util/helpers/productPartition/DetermineDisplayText";
import EditIcon from "@mui/icons-material/Edit";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { useQuery } from "@tanstack/react-query";

import { StatusDot } from "../Shared/StatusDot";
import { determineNextNode } from "./determineNextNode";
import { EditNodeButton } from "./EditPartitionType/EditNodeButton";
import { TargetAndExcludePopper } from "./EditPartitionType/TargetAndExcludePopper";
import { UpdateCostPerClickPopper } from "./EditPartitionType/UpdateCostPerClickPopper";
import { PartitionModal } from "./PartitionModal";

const RenderRow: React.FC<RenderRowProps> = ({
  node,
  level = 0,
  open,
  handleToggle,
  handleEditPartitionTree,
  updateNegativeStatus,
  negativeStatusLoading,
  bidsAreUpdating,
  updateCostPerClick,
  editPartitionTreeIsLoading,
  handleSelectedRow,
  selectedRows,
}) => {
  const { data: session } = useSession();
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [criterionId, setCriterionId] = useState<number | null>(null);
  const [initialOption, setInitialOption] = useState<string>("brand");
  const [selectedRow, setSelectedRow] = useState<{ [key: string]: boolean }>(
    {}
  );
  const {
    // criterionIsLoading,
    // criterionData,
    getEditablePartitions,
  } = useGetProductPartitions();
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

  const {
    data: criterionData,
    isLoading: criterionIsLoading,
    refetch: refetchCriterionData,
  } = useQuery({
    queryKey: ["EditablePartitions", node],
    queryFn: () => getEditablePartitions(),
    enabled: Boolean(node),
    staleTime: Infinity,
  });

  // useEffect(() => {
  //   if (node) {
  //     getEditablePartitions();
  //   }
  // }, [node]);

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

  //recursive row function
  const renderRow = (
    node: AdGroupCriterionResource,
    level: number
  ): JSX.Element => {
    const isHovered = hoveredNode === node?.criterion_id;
    //const hoveredNodeStatus = hoveredStatus === node?.criterion_id;
    const hasChildren = node.children && node.children.length > 0;
    const isRowOpen = open[node.criterion_id] || false;

    let displayText = determineDisplayText(node, level);

    const nextIcon = hasChildren && (
      <IconButton size="small" onClick={() => handleToggle(node.criterion_id)}>
        {isRowOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
      </IconButton>
    );

    const modalEditHandler = (criterionId: number) => {
      const determineSelectOption = determineNextNode(node);
      setInitialOption(determineSelectOption);
      setOpenModal(true);
      setCriterionId(criterionId);
      refetchCriterionData();
    };

    const currentTheme = session?.user?.theme;
    const subDivisionBackground = {
      backgroundColor: `${
        node?.listing_group?.type === 2 && currentTheme === "light"
          ? "#f1f3f4"
          : node?.listing_group?.type === 2 && currentTheme === "dark"
          ? "rgba(144, 202, 249, 0.16)"
          : isHovered &&
            node?.listing_group?.type === 3 &&
            currentTheme === "light"
          ? "#f5f7f7"
          : isHovered &&
            node?.listing_group?.type === 3 &&
            currentTheme === "dark"
          ? "rgba(144, 202, 249, 0.16)"
          : ""
      }`,
    };
    return (
      <>
        <PartitionModal
          selectedNode={node}
          value={criterionId === node?.criterion_id ? displayText : ""}
          open={openModal && criterionId === node?.criterion_id}
          onClose={() => {
            setOpenModal(false);
            setCriterionId(null);
          }}
          partitionType={node?.listing_group.type}
          criterionData={criterionData}
          isLoading={criterionIsLoading}
          initialOption={initialOption}
          children={node?.children}
          adGroupResource={node?.adGroupResource}
          handleEditPartitionTree={handleEditPartitionTree}
          editPartitionTreeIsLoading={editPartitionTreeIsLoading}
          //setOperationComplete={setOperationComplete}
        />
        <TableRow
          key={node?.criterion_id}
          onMouseEnter={() => setHoveredNode(node?.criterion_id)}
          onMouseLeave={() => setHoveredNode(null)}
          sx={subDivisionBackground}
        >
          <TableCell>
            <Stack direction="row" alignItems="center" sx={{ minWidth: 30 }}>
              <StatusDot
                active={!node?.negative && node?.listing_group?.type !== 2}
              />
              {(isHovered && node?.listing_group?.type !== 2) ||
              negativeAnchorEl[node?.criterion_id] ? (
                <IconButton
                  aria-describedby={negativeId as string}
                  sx={{ padding: "2px" }}
                  size="small"
                  onClick={(event: React.MouseEvent<HTMLElement>) =>
                    negativeAnchorHandler(event, node?.criterion_id)
                  }
                >
                  <KeyboardArrowDownIcon sx={{ fontSize: 12 }} />
                </IconButton>
              ) : (
                ""
              )}
              <TargetAndExcludePopper
                node={node}
                negativeId={negativeId as string}
                negativeAnchorEl={negativeAnchorEl}
                negativeStatusLoading={negativeStatusLoading}
                negativeAnchorHandler={negativeAnchorHandler}
                updateNegativeStatus={updateNegativeStatus}
              />
            </Stack>
          </TableCell>
          {/* <Checkbox
          <TableCell>
              value={!!selectedRow[node?.criterion_id]}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                handleSelectedRow(event, node?.criterion_id, node)
              }
          </TableCell>
            /> */}
          <TableCell
            style={{
              minWidth: 350,
              textOverflow: "ellipsis",
            }}
          >
            <Grid
              container
              direction="row"
              alignItems="center"
              sx={{ paddingLeft: `${level * 10}px` }}
            >
              <Grid item xs={1}>
                {nextIcon}
              </Grid>
              <Grid item xs={10}>
                {hasChildren ? (
                  <Typography variant="subtitle2">{displayText}</Typography>
                ) : (
                  <Typography variant="subtitle2">{displayText}</Typography>
                )}
              </Grid>
              <Grid item xs={1}>
                {isHovered && (
                  <EditNodeButton
                    node={node}
                    modalEditHandler={modalEditHandler}
                  />
                )}
              </Grid>
            </Grid>
          </TableCell>
          <TableCell>
            {node?.negative && node?.listing_group?.type === 3 ? (
              "Excluded"
            ) : node?.listing_group?.type === 2 ? (
              "--"
            ) : (
              <>
                {(node?.cpc_bid_micros / 1000000).toFixed(2)}{" "}
                <Tooltip title="Change Bid">
                  <IconButton
                    aria-describedby={costPerClickId as string}
                    size="small"
                    sx={{ padding: "2px" }}
                    onClick={(event: React.MouseEvent<HTMLElement>) =>
                      costPerClickAnchorHandler(event, node?.criterion_id)
                    }
                  >
                    {isHovered || cpcAnchorEl[node?.criterion_id] ? (
                      <EditIcon sx={{ fontSize: 13 }} />
                    ) : (
                      ""
                    )}{" "}
                  </IconButton>
                </Tooltip>
                <UpdateCostPerClickPopper
                  node={node}
                  costPerClickId={costPerClickId as string}
                  cpcAnchorEl={cpcAnchorEl}
                  bidsAreUpdating={bidsAreUpdating}
                  costPerClickAnchorHandler={costPerClickAnchorHandler}
                  updateCostPerClick={updateCostPerClick}
                />
              </>
            )}
          </TableCell>
          <TableCell>{node?.clicks}</TableCell>
          <TableCell>
            {node?.clicks > 0
              ? (node?.cost_micros / node?.clicks / 1000000)?.toFixed(2)
              : 0}
          </TableCell>
          <TableCell>{node?.impressions}</TableCell>
          <TableCell>{(node?.cost_micros / 1000000).toFixed(2)}</TableCell>
        </TableRow>
        {/* {hasChildren &&
          isRowOpen &&
          node.children.map((childNode) => (
            <RenderRow
              key={childNode.criterion_id}
              node={childNode}
              open={open}
              level={level + 1}
              handleToggle={handleToggle}
              handleEditPartitionTree={handleEditPartitionTree}
              updateNegativeStatus={updateNegativeStatus}
              negativeStatusLoading={negativeStatusLoading}
              bidsAreUpdating={bidsAreUpdating}
              updateCostPerClick={updateCostPerClick}
              editPartitionTreeIsLoading={editPartitionTreeIsLoading}
            />
          ))} */}
      </>
    );
  };

  return renderRow(node, level);
};

export default RenderRow;
