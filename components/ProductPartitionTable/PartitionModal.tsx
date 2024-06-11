import React, { useContext, useEffect, useMemo, useState } from "react";

import { AuthContext } from "@/context/auth-context";
import { AdGroupCriterionResource, CriterionData } from "@/types";
import { determineModalSelectOptions } from "@/util/helpers/productPartition/determineModalSelectOptions";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import Modal from "@mui/material/Modal";
import Select, { SelectChangeEvent } from "@mui/material/Select"; // Named import for TypeScript type
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { Content, PageContainer } from "../Footer/FooterStyles";
import { StyledBoxContainer } from "../Modal/ModalStyles";
import { determineNextNode } from "./determineNextNode";
import { SelectedPartitions } from "./SelectedPartitions";

interface PartitionModal {
  //setOperationComplete: () => void;
  selectedNode: AdGroupCriterionResource;
  open: boolean;
  onClose: () => void;
  partitionType: number;
  value: string | undefined;
  criterionData: CriterionData[];
  isLoading: boolean;
  children: AdGroupCriterionResource[];
  initialOption: string;
  adGroupResource: string;
  editPartitionTreeIsLoading: boolean;
  handleEditPartitionTree: (
    selectedNode: AdGroupCriterionResource,
    partitions: CriterionData[],
    removedPartitions: string[],
    adGroup: string
  ) => Promise<void>;
}

const el: string[] = ["brand", "type", "item_id"];

export const PartitionModal = ({
  open,
  onClose,
  value,
  criterionData,
  isLoading,
  selectedNode,
  children,
  initialOption,
  adGroupResource,
  handleEditPartitionTree,
  editPartitionTreeIsLoading,
}: PartitionModal) => {
  const authContext = useContext(AuthContext);
  const [option, setOption] = useState<string>(initialOption);
  const [isFindingPartitions, setIsFindingPartitions] =
    useState<boolean>(false);
  const [isSelectedChild, setIsSelectedChild] = useState<{
    [key: string]: boolean;
  }>({});
  const [updatePartitionData, setUpdatePartitionData] = useState<
    CriterionData[]
  >([]);
  const [initialSelectedIds, setInitialSelectedIds] = useState<{
    [key: string]: boolean;
  }>({});
  const [removePartitions, setRemovedPartitions] = useState<string[]>([]);

  //console.log("criterionData ", criterionData);

  //check boxes to items already existing in the tree
  useEffect(() => {
    if (criterionData && children && selectedNode?.criterion_id) {
      const initialSelection = initializeSelectedChild(
        criterionData,
        children,
        selectedNode?.criterion_id
      );
      setIsSelectedChild(initialSelection);

      setInitialSelectedIds(initialSelection);
    }
  }, [criterionData, children, selectedNode?.criterion_id]);

  //track new additions and removals
  useEffect(() => {
    const partitionOperations = criterionData?.filter(
      (criterion) => isSelectedChild[criterion?.partitionId]
    );
    setUpdatePartitionData(partitionOperations);
    setRemovedPartitions(handleRemovePartition());
  }, [isSelectedChild]);

  //determine the next selection option based on children case_value
  useEffect(() => {
    if (selectedNode?.criterion_id) {
      const nextOption = determineNextNode(selectedNode);
      setOption(nextOption);
    }
  }, [selectedNode?.criterion_id]);

  const initializeSelectedChild = (
    criterionData: CriterionData[],
    children: AdGroupCriterionResource[],
    selectedNodeId: number | null
  ) => {
    setIsFindingPartitions(true);
    const updatedSelection: { [key: string | number]: boolean } = {};
    criterionData?.forEach((partition) => {
      //if root node child is brand and brand has item id then item_id can be child as well 'all products'
      //get all products with case_value item_id and allow that as an option at root node level
      //check if the retrieved partitions parentId is a child of selectedNodeId
      if (Number(partition?.parentId) === selectedNodeId) {
        //check for conditions where at least one of the child ids exist already in our product group view
        const isChildPartition = children?.some(
          (child) => child?.criterion_id === partition?.partitionId
        );

        if (
          partition?.brand.join("") ||
          partition?.productType.join("") ||
          partition?.productId.join("")
        )
          updatedSelection[partition?.partitionId] = isChildPartition;
      }
    });
    setIsFindingPartitions(false);
    return updatedSelection;
  };

  //keep track of each checkbox by its id and it's current state
  const checkboxHandler = (id: number) => {
    setIsSelectedChild((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleOptionChange = (event: SelectChangeEvent) => {
    const newOption = event.target.value;
    setOption(newOption);

    //setIsSelectedChild({});
    //setUpdatePartitionData([]);
  };

  const handleRemovePartition = () => {
    const findRemoved = Object.keys(initialSelectedIds).filter(
      (id) => !isSelectedChild[id]
    );
    return findRemoved;
  };

  const partitionList = useMemo<React.JSX.Element[]>(() => {
    const dimensions =
      authContext?.state?.listingScope?.listing_scope?.dimensions;
    const scopeData = dimensions?.map(
      (val: { [key: string]: { [key: string]: any } }) => {
        const [key, filter] = Object.entries(val)[0];
        return {
          scopeKey: key,
          scopeValue: filter?.value,
        };
      }
    );

    return (
      criterionData &&
      criterionData
        ?.filter((node) => Number(node.parentId) === selectedNode.criterion_id)
        ?.flatMap((partition, i) => {
          let items: any = [];

          if (option === "brand") {
            items = partition?.brand;
          } else if (option === "type") {
            items = partition?.productType;
          } else if (option === "item_id") {
            items = partition?.productId;
          }

          if (scopeData && scopeData.length > 0) {
            const applicableScope = scopeData.find(
              (s: { [key: string]: string }) =>
                s.scopeKey === `product_${option}`
            );
            if (applicableScope) {
              items = items?.filter(
                (item: string) => item === applicableScope.scopeValue
              );
            }
          }

          return (
            !isLoading &&
            items?.map((item: string) => (
              <ListItem
                key={partition?.partitionId}
                disablePadding
                sx={{ background: "background.paper" }}
              >
                <ListItemIcon>
                  <Checkbox
                    disableRipple
                    edge="start"
                    checked={isSelectedChild[partition?.partitionId] ?? false}
                    onChange={() => checkboxHandler(partition?.partitionId)}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography color="text.secondary">{item}</Typography>
                  }
                />
              </ListItem>
            ))
          );
        })
    );
  }, [criterionData, option, isSelectedChild]);

  const selectorOptions = determineModalSelectOptions(selectedNode);
  return (
    <Modal
      open={open}
      onClose={() => {
        onClose();
      }}
    >
      <StyledBoxContainer width="50%" sx={{ maxHeight: "80vh" }}>
        <PageContainer minHeight="90%">
          <Content>
            <Stack>
              <Stack>
                <Typography variant="subtitle1" color="text.secondary">
                  subdivide - {value} by:
                </Typography>
              </Stack>
              <Stack sx={{ marginBottom: "1rem" }}>
                <Select value={option} onChange={handleOptionChange}>
                  {selectorOptions.map((val, i) => (
                    <MenuItem key={i} value={val}>
                      {val}
                    </MenuItem>
                  ))}
                </Select>
              </Stack>
              <Grid
                container
                direction="row"
                justifyContent="space-between"
                sx={{ maxHeight: "70vh%" }}
              >
                <Grid item xs={12} sm={5}>
                  <Stack
                    sx={{
                      padding: "0 0 0 1rem",
                    }}
                  >
                    <Typography color="text.secondary">
                      Available Selection
                    </Typography>
                    <Divider variant="fullWidth" />
                    {isLoading ? (
                      <>
                        <Skeleton width="90%" />
                        <Skeleton width="70%" />
                        <Skeleton width="70%" />
                      </>
                    ) : (
                      isFindingPartitions && (
                        <>
                          <Skeleton width="90%" />
                          <Skeleton width="70%" />
                          <Skeleton width="70%" />
                        </>
                      )
                    )}
                    {!isLoading && !isFindingPartitions && partitionList}
                  </Stack>
                </Grid>
                <Divider orientation="vertical" flexItem />
                {!isLoading && !isFindingPartitions && (
                  <>
                    <Grid item xs={12} sm={6}>
                      <Stack
                        sx={{
                          padding: "0 0 0 1rem",
                        }}
                      >
                        <Typography color="text.secondary">
                          Selected Items
                        </Typography>
                        <Divider variant="fullWidth" />
                        <SelectedPartitions
                          isLoading={isLoading}
                          selectedPartitions={updatePartitionData}
                          options={option}
                        />
                      </Stack>
                    </Grid>
                  </>
                )}
              </Grid>
            </Stack>
          </Content>
        </PageContainer>
        <Divider flexItem />

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="flex-end"
          sx={{ margin: "1rem 1rem" }}
          spacing={2}
        >
          <Button onClick={onClose}>Cancel</Button>
          <Button
            variant="contained"
            onClick={async () => {
              //if the are no pre-checked values, it shouldn't be clickable
              //if removed partitions.length && !existingId, return else if it does exist, remove it
              // console.log(selectedNode);
              await handleEditPartitionTree(
                selectedNode,
                updatePartitionData,
                removePartitions,
                adGroupResource
              );
              onClose();
              setOption(initialOption);
            }}
          >
            {editPartitionTreeIsLoading ? "Building..." : "Save"}
          </Button>
        </Stack>
      </StyledBoxContainer>
    </Modal>
  );
};
