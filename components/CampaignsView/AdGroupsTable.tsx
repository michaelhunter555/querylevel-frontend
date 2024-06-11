import React, { useEffect, useMemo, useState } from "react";

import { useAnchorElement } from "@/hooks/useAnchorElement";
import { useForm } from "@/hooks/useForm";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Checkbox from "@mui/material/Checkbox";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Tooltip from "@mui/material/Tooltip";
import { useQueryClient } from "@tanstack/react-query";

import { UpdateAdGroupStatusPopper } from "../../components/Shared/AdGroupPopperOperations/UpdateAdGroupStatusPopper";
import { useUpdateAdGroups } from "../../hooks/adGroups-hook";
import { TextFieldInput } from "../CreateCampaignSteps/CreateShoppingCampaign/TextFieldInputs";
import { LoadingTable } from "../DataTable/LoadingTable";
import { BulkAdGroupOperationModal } from "../Modal/AdGroupBulkOperationModal";
import { UpdateAdGroupCostPerClickPopper } from "../Shared/AdGroupPopperOperations/UpdateAdGroupBidPopper";
import { StatusDot } from "../Shared/StatusDot";
import { CreateAdGroupPopper } from "./CreateAdGroupPopper";

interface AdGroupData {
  adGroupData: AdGroupsTableData[];
  adGroupsLoading: boolean;
  getProductPartitions: (adGroupId: string | number) => void;
  setCurrentAdGroup: (adGroup: string | number) => void;
  setCurrentAdGroupName: (name: string) => void;
  adGroupPostIsLoading: boolean;
  createAdGroup: (adGroup: { [key: string]: string | number }) => Promise<void>;
}

export type AdGroupsTableData = {
  adGroupId: number;
  adGroupResource: string;
  campaign: string;
  campaignId: number;
  campaignResource: string;
  cpc_bid_micros: number;
  name: string;
  status: number;
  target_cpa_micros: number;
  target_roas: number | null;
  average_cpc: number;
  clicks: number;
  conversions: number;
  cost_micros: number;
  ctr: number;
  impressions: number;
  bidding_strategy_type: number;
};

const AdGroupsTable = ({
  adGroupData,
  adGroupsLoading,
  adGroupPostIsLoading,
  getProductPartitions, //modified
  setCurrentAdGroup,
  createAdGroup,
  setCurrentAdGroupName,
}: AdGroupData) => {
  const [createAdGroupAnchorEl, setCreateAdGroupAnchorEl] =
    useState<HTMLElement | null>(null);
  const queryClient = useQueryClient();
  const {
    updateAdGroupStatus,
    adGroupStatusUpdating,
    updateBidsAreLoading,
    updateAdGroupBids,
    updateAdGroupName,
    isLoading: updateAdGroupIsLoading,
  } = useUpdateAdGroups();
  const {
    anchorEl: adCpcAnchor,
    anchorElementHandler: handleAdGroupCpcAnchor,
    clearAnchorElement: clearAdGroupCpcAnchor,
  } = useAnchorElement();
  const {
    anchorEl: updateStatusAnchor,
    anchorElementHandler: handleUpdateStatusAnchor,
    clearAnchorElement: clearUpdateStatusAnchor,
  } = useAnchorElement();

  const [pages, setPages] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [rowSelection, setRowSelection] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [isHovered, setIsHovered] = useState<number | null>(null);
  const [operation, setOperation] = useState<number | null>(0);
  const [editName, setEditName] = useState<{ [key: string]: boolean }>({});
  const [adGroupName, setAdGroupName] = useState<string>("");
  const [formState, inputHandler, setFormData] = useForm(
    {
      adGroupName: {
        value: adGroupName,
        isValid: false,
      },
    },
    false
  );
  const [openModal, setOpenModal] = useState<boolean>(false);

  useEffect(() => {
    if (formState.inputs?.adGroupName?.value && formState?.isValid) {
      setFormData(
        {
          adGroupName: {
            value: formState?.inputs?.adGroupName?.value,
            isValid:
              (formState?.inputs?.adGroupName?.value as string).length > 0,
          },
        },
        true
      );
    }
  }, [formState?.inputs?.adGroupName?.value]);

  const aggregatedAdGroupData = useMemo(() => {
    const adGroupMap = new Map<string | number, any>();

    adGroupData?.forEach((adGroup) => {
      const id: number = adGroup?.adGroupId;
      if (!adGroupMap.has(id)) {
        adGroupMap.set(id, {
          name: adGroup?.name,
          status: adGroup?.status,
          cpc_bid_micros: adGroup.cpc_bid_micros,
          clicks: 0,
          ctr: 0,
          impressions: 0,
          cost_micros: 0,
          conversions: 0,
        });
      }
      const aggregateData = adGroupMap.get(id);

      aggregateData.clicks += adGroup.clicks;
      aggregateData.impressions += adGroup.impressions;
      aggregateData.cost_micros += adGroup.cost_micros;
      aggregateData.conversions += adGroup.conversions;

      aggregateData.ctr =
        aggregateData.impressions > 0
          ? (aggregateData.clicks / aggregateData.impressions) * 100
          : 0;

      adGroupMap.set(id, {
        name: adGroup?.name,
        status: adGroup?.status,
        ...aggregateData,
      });
    });
    return Array.from(adGroupMap, ([id, data]) => ({ id, ...data }));
  }, [adGroupData]);

  const finalAdGroupData = useMemo(
    () =>
      Object.keys(aggregatedAdGroupData).map((val: string | number) => {
        return {
          id: val,
          ...aggregatedAdGroupData[val as number],
        };
      }),
    [aggregatedAdGroupData]
  );

  const getProductPartitionHandler = (
    adGroupId: string | number,
    name: string
  ) => {
    if (
      (adGroupId && typeof adGroupId === "string") ||
      typeof adGroupId === "number"
    ) {
      getProductPartitions(adGroupId as number);
      setCurrentAdGroup(adGroupId as number);
      setCurrentAdGroupName(name);
    }
  };

  //const openCreateAdGroupAnchor = Boolean(createAdGroupAnchorEl);
  const createAdGroupId = createAdGroupAnchorEl ? "createAdGroup" : null;
  const createAdGroupAnchorHandler = (event: React.MouseEvent<HTMLElement>) => {
    setCreateAdGroupAnchorEl(
      createAdGroupAnchorEl ? null : event.currentTarget
    );
  };

  const adGroupCpcId = adCpcAnchor ? "updateAdGroupCpc" : null;
  const adGroupCostPerClickHandler = (
    event: React.MouseEvent<HTMLElement>,
    id: number | string
  ) => {
    handleAdGroupCpcAnchor(event, id);
    if (updateStatusAnchor) {
      clearUpdateStatusAnchor();
    }
  };

  const updateStatusId = updateStatusAnchor ? "updateAdGroupStatus" : null;
  const adGroupStatusHandler = (
    event: React.MouseEvent<HTMLElement>,
    id: number | string
  ) => {
    handleUpdateStatusAnchor(event, id);
    if (adCpcAnchor) {
      clearAdGroupCpcAnchor();
    }
  };

  //pagination
  const handlePageChange = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPages(newPage);
  };

  const handleRowsChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPages(0);
  };

  const indexOfFirstPage = pages * rowsPerPage;
  const indexOfLastPage = indexOfFirstPage + rowsPerPage;
  //pagination

  //CheckBoxSelection
  const handleSelectedRow = (id: number) => {
    // setRowSelection((prev) => ({
    //   ...prev,
    //   [id]: !prev[id],
    // }));

    setRowSelection((prev) => {
      const newSelection = { ...prev };

      if (newSelection[id]) {
        delete newSelection[id];
      } else {
        newSelection[id] = true;
      }
      return newSelection;
    });
  };

  const handleSomeSelected = () => {
    return finalAdGroupData.some((adGroup) => rowSelection[adGroup.id]);
  };

  const handleAllSelected = () => {
    return finalAdGroupData.every((adGroup) => rowSelection[adGroup.id]);
  };

  const handleParentCheckboxSelection = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const isChecked = event.target.checked;
    setRowSelection((prev) => {
      const newState: typeof prev = {};
      finalAdGroupData.forEach((adGroup, i) => {
        newState[adGroup.id] = isChecked;
      });
      return newState;
    });
  };
  //CheckBoxSelection
  //pass undefined as string because undefined will result to a string through Object methods
  const noKeys =
    Object.keys(rowSelection)?.length === 0 ||
    Object.values(rowSelection).every((val) => !val);

  const updateAdGroupNameHandler = async (adGroupId: number) => {
    const adGroup = {
      name: formState?.inputs?.adGroupName?.value as string,
      id: adGroupId,
    };

    if (adGroup.name === adGroupName) {
      setEditName((prev) => ({
        ...prev,
        [adGroup?.id]: !prev[adGroup?.id],
      }));

      setFormData(
        {
          adGroupName: {
            value: "",
            isValid: false,
          },
        },
        false
      );
      return;
    }

    await updateAdGroupName(adGroup)?.then(async () => {
      setEditName((prev) => ({
        ...prev,
        [adGroup?.id]: !prev[adGroup?.id],
      }));

      setFormData(
        {
          adGroupName: {
            value: "",
            isValid: false,
          },
        },
        false
      );
      await queryClient.invalidateQueries({ queryKey: ["adGroups"] });
    });
  };

  const actionText =
    operation === 0
      ? "Set Cpc"
      : operation === 1
      ? "Set Status"
      : operation === 2
      ? "Remove ad groups"
      : "select operation";

  const handleBulkAdGroupOperation = () => {
    const selection = Object.entries(rowSelection)
      ?.filter(([key, value]) => !!value)
      ?.map(([key, value]) => key);

    //send array of strings and the operation type.
    setRowSelection({});
    setOperation(null);
  };

  const handleModal = () => {
    setOpenModal((prev) => !prev);
  };

  const selection = Object.entries(rowSelection)
    ?.filter(([key, value]) => !!value)
    ?.map(([key, value]) => key);

  return (
    <>
      <BulkAdGroupOperationModal
        open={openModal}
        onClose={handleModal}
        operationType={operation}
        selectedAdGroups={selection}
        handleBulkCpcOperation={handleBulkAdGroupOperation}
        onRowSelection={setRowSelection}
        onOperation={setOperation}
      />
      <Paper elevation={2}>
        <TableContainer>
          <Stack
            direction="row"
            alignItems="center"
            spacing={2}
            sx={{ padding: "0.5rem" }}
          >
            <Button
              sx={{ minWidth: 200 }}
              color={operation === 2 ? "error" : "primary"}
              size="small"
              disabled={noKeys || operation === null}
              variant="outlined"
              onClick={handleModal}
            >
              {actionText}
            </Button>
            <Divider flexItem orientation="vertical" />
            <ButtonGroup size="small" component="div">
              {["Edit Bids", "Edit Status", "Remove"].map((item, i) => (
                <Button
                  key={item}
                  disabled={noKeys}
                  onClick={() => setOperation(i)}
                  variant={operation === i ? "contained" : "outlined"}
                  color={item === "Remove" ? "error" : "primary"}
                >
                  {item}
                </Button>
              ))}
            </ButtonGroup>
          </Stack>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>
                  <Checkbox
                    size="small"
                    checked={handleAllSelected()}
                    indeterminate={!handleAllSelected() && handleSomeSelected()}
                    onChange={handleParentCheckboxSelection}
                  />
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Stack>Ad Group</Stack>
                    <Stack>
                      <Tooltip title="create ad group" placement="right-end">
                        <IconButton
                          aria-describedby={createAdGroupId as string}
                          onClick={(event: React.MouseEvent<HTMLElement>) =>
                            createAdGroupAnchorHandler(event)
                          }
                        >
                          <AddCircleIcon color="primary" />
                        </IconButton>
                      </Tooltip>
                      <CreateAdGroupPopper
                        createAdGroupId={createAdGroupId as string}
                        adGroupAnchorEl={createAdGroupAnchorEl}
                        adGroupAnchorHandler={createAdGroupAnchorHandler}
                        createAdGroupIsLoading={adGroupPostIsLoading}
                        createAdGroup={createAdGroup}
                        campaignResource={adGroupData?.[0]?.campaignResource}
                      />
                    </Stack>
                  </Stack>
                </TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Max Cpc.</TableCell>
                <TableCell>Clicks</TableCell>
                <TableCell>CTR</TableCell>
                <TableCell>Cost</TableCell>
                <TableCell>Conversions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!adGroupsLoading &&
                finalAdGroupData
                  ?.slice(indexOfFirstPage, indexOfLastPage)
                  ?.map((adGroup, index) => (
                    <TableRow
                      key={adGroup?.id}
                      onMouseEnter={() => setIsHovered(adGroup?.id)}
                      onMouseLeave={() => setIsHovered(null)}
                    >
                      <TableCell>
                        <Checkbox
                          size="small"
                          checked={!!rowSelection[adGroup?.id]}
                          onChange={() => handleSelectedRow(adGroup?.id)}
                          disabled={adGroup?.status === 4}
                        />
                      </TableCell>
                      <TableCell sx={{ minWidth: 250 }}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          {!editName[adGroup?.id] && (
                            <Tooltip title="View Product Group">
                              <Link
                                component="button"
                                variant="subtitle2"
                                disabled={adGroup?.status === 4}
                                onClick={() => {
                                  getProductPartitionHandler(
                                    adGroup?.id,
                                    adGroup?.name
                                  );
                                }}
                              >
                                {adGroup?.name}
                              </Link>
                            </Tooltip>
                          )}
                          {editName[adGroup?.id] && (
                            <Stack>
                              <TextFieldInput
                                id="adGroupName"
                                name="adGroupName"
                                title=""
                                type="text"
                                hasAdornment={false}
                                style={true}
                                defaultValue={adGroup?.name || ""}
                                inputHandler={inputHandler}
                              />
                            </Stack>
                          )}
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={1}
                          >
                            {isHovered === adGroup?.id && (
                              <Tooltip
                                title={
                                  editName[adGroup?.id] ? "cancel" : "edit"
                                }
                              >
                                <IconButton
                                  onClick={() => {
                                    setAdGroupName(adGroup?.name);
                                    setEditName((prev) => ({
                                      ...prev,
                                      [adGroup?.id]: !prev[adGroup?.id],
                                    }));
                                    setFormData(
                                      {
                                        adGroupName: {
                                          value: "",
                                          isValid: false,
                                        },
                                      },
                                      false
                                    );
                                  }}
                                  sx={{ padding: "2px" }}
                                  size="small"
                                >
                                  {editName[adGroup?.id] ? (
                                    <CloseIcon
                                      sx={{ fontSize: 12, color: "red" }}
                                    />
                                  ) : (
                                    <EditIcon sx={{ fontSize: 12 }} />
                                  )}
                                </IconButton>
                              </Tooltip>
                            )}
                            {isHovered === adGroup?.id &&
                              formState?.isValid &&
                              editName[adGroup?.id] && (
                                <IconButton
                                  size="small"
                                  sx={{
                                    padding: 0,
                                    fontSize: 11,
                                    color: "green",
                                  }}
                                  onClick={async () => {
                                    await updateAdGroupNameHandler(adGroup?.id);
                                  }}
                                >
                                  Save
                                  {/* <CheckIcon
                                    sx={{ fontSize: 12, color: "green" }}
                                  /> */}
                                </IconButton>
                              )}
                          </Stack>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <StatusDot status={adGroup?.status} />
                          {(isHovered === adGroup?.id &&
                            adGroup?.status !== 4) ||
                          updateStatusAnchor[adGroup?.id] ? (
                            <IconButton
                              onClick={(event: React.MouseEvent<HTMLElement>) =>
                                adGroupStatusHandler(event, adGroup?.id)
                              }
                              aria-describedby={updateStatusId as string}
                              sx={{ padding: "2px" }}
                              size="small"
                            >
                              <KeyboardArrowDownIcon sx={{ fontSize: 12 }} />
                            </IconButton>
                          ) : (
                            ""
                          )}
                          <UpdateAdGroupStatusPopper
                            adGroup={adGroup}
                            statusId={updateStatusId as string}
                            statusAnchorEl={updateStatusAnchor}
                            adGroupStatusAnchorHandler={adGroupStatusHandler}
                            statusUpdateIsLoading={adGroupStatusUpdating}
                            updateAdGroupStatus={updateAdGroupStatus}
                          />
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Stack>
                            {(adGroup?.cpc_bid_micros / 1000000).toFixed(2)}
                          </Stack>
                          <Stack>
                            {(isHovered === adGroup?.id &&
                              adGroup?.status !== 4) ||
                            adCpcAnchor[adGroup?.id] ? (
                              <IconButton
                                aria-describedby={adGroupCpcId as string}
                                sx={{ padding: "2px" }}
                                size="small"
                                onClick={(
                                  event: React.MouseEvent<HTMLElement>
                                ) =>
                                  adGroupCostPerClickHandler(event, adGroup?.id)
                                }
                              >
                                <EditIcon sx={{ fontSize: 12 }} />
                              </IconButton>
                            ) : (
                              ""
                            )}
                            <UpdateAdGroupCostPerClickPopper
                              costPerClickId={adGroupCpcId as string}
                              cpcAnchorEl={adCpcAnchor}
                              costPerClickAnchorHandler={
                                adGroupCostPerClickHandler
                              }
                              adGroup={adGroup}
                              updateCostPerClick={updateAdGroupBids}
                              bidsAreUpdating={updateBidsAreLoading}
                            />
                          </Stack>
                        </Stack>
                      </TableCell>
                      <TableCell>{adGroup?.clicks}</TableCell>
                      <TableCell>{adGroup?.ctr.toFixed(2)}</TableCell>
                      <TableCell>
                        {(adGroup?.cost_micros / 1000000).toFixed(2)}
                      </TableCell>
                      <TableCell>{adGroup?.conversions}</TableCell>
                    </TableRow>
                  ))}
              {adGroupsLoading && (
                <LoadingTable isHome={true} length={3} isDashboard={true} />
              )}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={finalAdGroupData?.length}
            rowsPerPage={rowsPerPage}
            page={pages}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsChange}
          />
        </TableContainer>
      </Paper>
    </>
  );
};

export default AdGroupsTable;
