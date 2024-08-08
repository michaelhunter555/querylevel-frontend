import React, { useMemo, useState } from "react";

import { AdGroupCriterionResource, CriterionData } from "@/types";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";

import { LoadingTable } from "../DataTable/LoadingTable";
import RenderRow from "./RenderRow";

interface PartitionTable {
  createRootNodeIsLoading: boolean;
  productGroups: AdGroupCriterionResource[];
  partitionIsLoading: boolean;
  open: { [key: string]: boolean };
  currentAdGroupId: string | number | null;
  currentAdGroupName: string;
  handleToggle: (id: string | number) => void;
  createRootNode: (adGroupId: string | number) => Promise<void>;
  editPartitionIsLoading: boolean;
  editPartitionTree: (
    selectedNodeId: AdGroupCriterionResource,
    partitions: CriterionData[],
    removedParitions: string[],
    adGroup: string
  ) => Promise<void>;
  //pass to render row and popper
  updateNegativeStatus: (
    node: AdGroupCriterionResource,
    cpc: number | null
  ) => Promise<void>;
  negativeStatusLoading: boolean;
  bidsAreUpdating: boolean;
  updateCostPerClick: (
    node: AdGroupCriterionResource,
    cpc: number | null
  ) => Promise<void>;
}

const ProductPartitionTable = ({
  productGroups,
  partitionIsLoading,
  handleToggle,
  open,
  // setOperationComplete,
  currentAdGroupId,
  createRootNode,
  editPartitionTree,
  editPartitionIsLoading, // use for modal button or horizontal loader
  updateNegativeStatus,
  negativeStatusLoading, // think of something for this too
  bidsAreUpdating,
  updateCostPerClick,
  createRootNodeIsLoading,
  currentAdGroupName,
}: PartitionTable) => {
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

  const createHierarchyTable = useMemo(() => {
    let nodeMap = new Map();
    let rootNodes: AdGroupCriterionResource[] = [];

    // get all nodes and store them in a map
    productGroups?.forEach((group) => {
      const nodeId = group.criterion_id;
      if (!nodeMap.has(nodeId)) {
        nodeMap.set(nodeId, {
          ...group,
          children: [],
          clicks: 0,
          cost_micros: 0,
          impressions: 0,
          conversions: 0,
          conversions_value: 0,
        });
      }

      const aggregateData = nodeMap.get(nodeId);
      aggregateData.clicks += group.clicks;
      aggregateData.cost_micros += group.cost_micros;
      aggregateData.impressions += group.impressions;
      aggregateData.conversions += group.conversions;
      aggregateData.conversions_value += group.conversions_value;
    });

    // link children to their parent nodes
    nodeMap.forEach((node) => {
      const parentIdString = node?.listing_group?.parent_ad_group_criterion
        ?.split("~")
        .pop();
      const parentId = parentIdString ? Number(parentIdString) : null;

      if (parentId) {
        if (nodeMap.has(parentId)) {
          // if node has a parent, add it to the parent's children array
          const parentNode = nodeMap.get(parentId);
          parentNode.children.push(node);
        }
      } else {
        // node does not have a parent, so it's the root node
        rootNodes.push(node);
      }
    });

    return rootNodes;
  }, [productGroups]);

  const handlePageChange = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleRowPageChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const generateFlatList = (
    nodes: AdGroupCriterionResource[],
    isExpanded: { [key: string]: boolean },
    level = 0
  ) => {
    let flatList: any[] = [];
    nodes.forEach((node) => {
      const flatNode = { ...node, level };
      flatList.push(flatNode);

      if (node.children && isExpanded[node?.criterion_id]) {
        let childNodes = generateFlatList(node.children, isExpanded, level + 1);
        flatList = flatList.concat(childNodes);
      }
    });
    return flatList;
  };

  const flattenedHierarchyTable = useMemo(() => {
    return generateFlatList(createHierarchyTable, open);
  }, [createHierarchyTable, open]);

  const indexOfFirstPage = page * rowsPerPage;
  const indexOfLastPage = indexOfFirstPage + rowsPerPage;

  return (
    <Paper>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>
                Product Group ~{" "}
                <Typography variant="overline">
                  {currentAdGroupName.length > 25
                    ? currentAdGroupName.substring(0, 25) + "..."
                    : currentAdGroupName}
                </Typography>
              </TableCell>
              <TableCell>Max cpc</TableCell>
              <TableCell>Clicks</TableCell>
              <TableCell>Avg. cpc</TableCell>
              <TableCell>Impressions</TableCell>
              <TableCell>Cost</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {partitionIsLoading ? (
              <LoadingTable length={3} numCells={7} />
            ) : (
              flattenedHierarchyTable
                ?.slice(indexOfFirstPage, indexOfLastPage)
                .map((rootNode: AdGroupCriterionResource) => (
                  <RenderRow
                    key={rootNode.criterion_id}
                    node={rootNode}
                    open={open}
                    level={rootNode.level}
                    handleToggle={handleToggle}
                    handleEditPartitionTree={editPartitionTree}
                    updateNegativeStatus={updateNegativeStatus}
                    negativeStatusLoading={negativeStatusLoading}
                    bidsAreUpdating={bidsAreUpdating}
                    updateCostPerClick={updateCostPerClick}
                    editPartitionTreeIsLoading={editPartitionIsLoading}
                  />
                ))
            )}
            {!partitionIsLoading && createHierarchyTable.length === 0 && (
              <Stack
                alignItems="center"
                sx={{ width: "100%", padding: "2rem" }}
              >
                <Typography>No data available for selected Group.</Typography>
                <Button
                  variant="contained"
                  onClick={async () => {
                    if (currentAdGroupId) {
                      await createRootNode(currentAdGroupId);
                    }
                  }}
                >
                  {createRootNodeIsLoading
                    ? "building..."
                    : "create Product Group"}
                </Button>
              </Stack>
            )}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={flattenedHierarchyTable?.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowPageChange}
        />
      </TableContainer>
    </Paper>
  );
};

export default ProductPartitionTable;
