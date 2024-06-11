import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  MaterialReactTable,
  MRT_ColumnDef,
  MRT_GlobalFilterTextField,
  MRT_RowData,
  MRT_RowSelectionState,
  useMaterialReactTable,
} from 'material-react-table';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';

import {
  useCreateAdGroup,
  useGetAdGroups,
} from '@/hooks/adGroups-hook';
import {
  useAdScheduleApi,
  useDeleteCampaign,
  useInventoryFilter,
  useUpdateCampaignStatus,
} from '@/hooks/campaign-hooks';
import {
  useCreateRootPartitionNode,
  useEditProductPartition,
  useGetProductPartitions,
  useUpdateCpcBids,
  useUpdateNegativeStatus,
} from '@/hooks/productPartion-hook';
import {
  NestedProps,
  UserCampaign,
} from '@/types';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EventRepeatIcon from '@mui/icons-material/EventRepeat';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import PublicIcon from '@mui/icons-material/Public';
import SettingsIcon from '@mui/icons-material/Settings';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Fab from '@mui/material/Fab';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import {
  QueryObserverResult,
  RefetchOptions,
  useQuery,
} from '@tanstack/react-query';

import { AdScheduleModal } from '../AdScheduleModal.tsx/AdScheduleModal';
import { AdGroupsTableData } from '../CampaignsView/AdGroupsTable';
import {
  CampaignViewSideBar,
} from '../CampaignsView/CampaignViewSideBarMenu/CampaignViewSideBar';
//import  RenderCampaignViewSideBar from "../CampaignsView/CampaignViewSideBarMenu/RenderCampaignViewSideBar";
//import { EditCampaignDrawer } from "../EditCampaignDrawer/EditCampaignDrawer";
import { GeoLocationModal } from '../Modal/GeoLocationModal';
import { InventoryFilterModal } from '../Modal/InventoryFilterModal';
import { StatusDot } from '../Shared/StatusDot';

const EditCampaignDrawer = dynamic(
  () => import("../EditCampaignDrawer/EditCampaignDrawer"),
  { ssr: false }
);

const RenderCampaignViewSideBar = dynamic(
  () =>
    import(
      "../CampaignsView/CampaignViewSideBarMenu/RenderCampaignViewSideBar"
    ),
  { ssr: false }
);

//campaign Level
export interface DynamicCampaignTableProps {
  data: DynamicUserCampaign[];
  chartData: UserCampaign[];
  isLoading: boolean;
  updatedCampaign: () => void;
  segment: string;
  status: string;
  refetchCampaigns: (
    options?: RefetchOptions | undefined
  ) => Promise<QueryObserverResult<NestedProps[] | undefined, Error>>;
}

export type DynamicUserCampaign = {
  id: string;
  name: string;
  status: string | number;
  cost_micros: number;
  ctr: number;
  average_cpc: number;
  clicks: number;
  all_conversions: number;
  impressions: number;
  date?: any;
};

type AdGroupTable = {
  campaign: AdGroupCampaign;
  ad_group: AdGroup;
  metrics: Metrics;
};

type Metrics = {
  clicks: number;
  conversions: number;
  cost_micros: number;
  ctr: number;
  impression: number;
};

type AdGroupCampaign = {
  id: string;
  resource_name: string;
  bidding_strategy_type: number;
};

type AdGroup = {
  campaign: string;
  cpc_bid_micros: number;
  id: string;
  name: string;
  resource_name: string;
  target_roas: string | null;
  target_cpa_micros: number;
  status: number;
};

const DynamicCampaignTable = ({
  data,
  chartData,
  isLoading,
  segment,
  status,
  updatedCampaign,
  refetchCampaigns,
}: DynamicCampaignTableProps) => {
  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});
  //handleRowSelectionState in parent
  const { data: session } = useSession();
  //ad groups
  const {
    isLoading: adGroupsLoading,
    getAdGroups,
    //adGroupData,
  } = useGetAdGroups();
  //product group view
  const {
    isLoading: partitionsLoading,
    getProductPartitions,
    productGroups,
  } = useGetProductPartitions();
  //handle opening of individual partitions
  const [openPartition, setOpenPartition] = useState<{
    [key: string]: boolean;
  }>({});
  const [campaignId, setCampaignId] = useState<string | null>(
    data && data[0]?.id
  );
  //manages the location modal at campaign_criterion geo target consants
  const [openLocationSettings, setOpenLocationSettings] =
    useState<boolean>(false);

  //manages inventory filter modal for campaign_criterion listing_scope
  const [openListingScope, setOpenListingScope] = useState<boolean>(false);
  //if a field was successfully updated increment, if greater > 0, call updatedCampaign
  const [campaignFieldUpdated, setCampaignFieldUpdated] = useState<number>(0);
  //manages the state of the edit drawer
  const [isEditing, setIsEditing] = useState<boolean>(false);

  //current ad group set by clicking ad_group -> product group view
  const [currentAdGroup, setCurrentAdGroup] = useState<string | number | null>(
    null
  );
  //ad group's name
  const [currentAdGroupName, setCurrentAdGroupName] = useState<string>("");
  //toggles between partition table and campaign performance
  const [toggleChart, setToggleChart] = useState<boolean>(false);
  //toggle ad schedule
  const [openAdSchedule, setOpenAdSchedule] = useState<boolean>(false);
  //index of campaignMenu
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  //async request to udpdate campaign status ENABLED, PAUSED
  const {
    isPostLoading: updatingStatus,
    updateCampaignStatus,
    message,
  } = useUpdateCampaignStatus();
  //component sidebar
  const [campaignComponent, setCampaignComponent] = useState("adgroup");

  //async request to delete campaign by id
  const {
    isPostLoading: isDeleting,
    deleteCampaign,
    message: deleteMessage,
  } = useDeleteCampaign();
  //creates root node for product_group view if no root subdivision
  const {
    createRootNode,
    createRootNodeIsLoading,
    createRootNodeSuccess,
    resetCreateRootNodeSuccess,
  } = useCreateRootPartitionNode();

  const { getAdSchedule } = useAdScheduleApi();

  const {
    partitionResponse: partitionPostSuccess,
    isPostLoading: editPartitionIsLoading,
    editPartitionTree,
    resetPartitionResponse,
  } = useEditProductPartition();

  const {
    updateNegativeStatus,
    isLoading: updatingNegativeStatus,
    updateNegativeSucess,
    resetUpdateNegativeSucess,
  } = useUpdateNegativeStatus();

  const {
    isLoading: bidsAreUpdating,
    updateCpCMicros,
    updateCpcBidSuccess,
    resetUpdateCpcBidSuccess,
  } = useUpdateCpcBids();
  //create an ad group
  const {
    createAdGroupSuccess,
    adGroupPostIsLoading,
    createAdGroup,
    resetAdGroupResponse,
  } = useCreateAdGroup();

  const { getCampaignCriterionListingScope } = useInventoryFilter();

  const getAdGroupData = async (
    campaignId: string,
    segment: string,
    status: string
  ) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_SERVER}/api/getUserAdGroups?id=${session?.user?._id}&campaignId=${campaignId}&segment=${segment}&status=${status}`,
        { method: "GET" }
      );

      if (!response.ok) {
        throw new Error("Error trying to retrieve Ad Groups Data.");
      }

      const data = await response.json();

      const adGroupData = data?.adGroups?.map((adGroup: AdGroupTable) => {
        return {
          adGroupId: adGroup?.ad_group?.id,
          adGroupResource: adGroup.ad_group?.resource_name,
          campaignResource: adGroup.campaign.resource_name,
          campaignId: adGroup?.campaign.id,
          //everything else
          ...adGroup?.ad_group,
          ...adGroup?.campaign,
          ...adGroup?.metrics,
        };
      });

      return adGroupData;
    } catch (err) {
      console.log("Error with the request to retrieve Ad Groups Data:", err);
    }
  };

  const {
    data: adGroups,
    isLoading: adGroupsIsLoading,
    refetch: refetchAdGroups,
  } = useQuery({
    queryKey: ["adGroups", campaignId, segment, status],
    queryFn: async () =>
      await getAdGroupData(campaignId as string, segment, status),
    enabled: Boolean(campaignId), //!!campaignId,
    staleTime: Infinity,
  });

  const getProductPartitionData = async (
    status: string,
    segment: string,
    adGroupId: string | number
  ) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_SERVER}/api/reports/product-partition-metrics?id=${session?.user?._id}&status=${status}&segment=${segment}&adGroupId=${adGroupId}`
      );

      const data = await response.json();
      const flattenData = data?.productGroupView?.map((val: any) => {
        return {
          adGroupResource: val.ad_group.resource_name,
          AdGroupCriterionResource: val.ad_group_criterion.resource_name,
          ...val.ad_group_criterion,
          ...val.metrics,
          ...val.ad_group,
          ...val.segments,
        };
      });

      return flattenData;
    } catch (err) {
      console.log("There was an error retrieving product partition data.", err);
    }
  };

  const {
    data: productPartitionData,
    isLoading: partitionIsLoading,
    refetch: refetchPartitions,
  } = useQuery({
    queryKey: ["ProductPartitions", currentAdGroup, segment, status],
    queryFn: async () =>
      await getProductPartitionData(status, segment, currentAdGroup as string),
    enabled: Boolean(currentAdGroup),
    staleTime: Infinity,
  });

  console.log("Product Partition Data:", productPartitionData);

  const { data: listingScopeData, isLoading: loadingListingScope } = useQuery({
    queryKey: ["listingScopeData", campaignId],
    queryFn: () => getCampaignCriterionListingScope(campaignId as string),
    enabled: Boolean(campaignId),
    staleTime: Infinity,
  });

  const { data: campaignAdSchedule, isLoading: adScheduleIsLoading } = useQuery(
    {
      queryKey: ["adSchedule", campaignId],
      queryFn: () => getAdSchedule(campaignId as string),
      enabled: Boolean(openAdSchedule && campaignId),
      staleTime: Infinity,
    }
  );

  useEffect(() => {
    if (
      (partitionPostSuccess ||
        updateNegativeSucess ||
        updateCpcBidSuccess ||
        createRootNodeSuccess) &&
      currentAdGroup
    ) {
      refetchPartitions().then(() => {
        if (partitionPostSuccess) resetPartitionResponse();
        if (updateCpcBidSuccess) resetUpdateCpcBidSuccess();
        if (updateNegativeSucess) resetUpdateNegativeSucess();
        if (createRootNodeSuccess) resetCreateRootNodeSuccess();
      });
    }
  }, [
    partitionPostSuccess,
    updateNegativeSucess,
    updateCpcBidSuccess,
    createRootNodeSuccess,
    currentAdGroup,
    refetchPartitions,
  ]);

  //retrieve partitions for ad group
  const getProductPartitionsHandler = async (adGroupId: string | number) => {
    if (adGroupId) {
      setCurrentAdGroup(adGroupId);
    }
    setToggleChart(true);
  };

  const columns = useMemo<MRT_ColumnDef<DynamicUserCampaign>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Campaign Name",
        size: 150,
      },
      {
        accessorKey: "status",
        header: "Status",
        size: 100,
        Cell: ({ cell }) => <StatusDot status={Number(cell.getValue())} />,
      },
      {
        accessorKey: "clicks",
        header: "Clicks",
        size: 100,
      },
      { accessorKey: "impressions", header: "Impressions", size: 100 },
      {
        accessorFn: (row) => `${row.ctr.toFixed(2)}`,
        accessorKey: "ctr",
        header: "Ctr",
        size: 100,
      },
      {
        accessorFn: (row) => `${row.average_cpc.toFixed(2)}`,
        accessorKey: "average_cpc",
        header: "Aeverage Cpc",
        size: 100,
      },
      {
        accessorFn: (row) => `${(row.cost_micros / 1000000).toFixed(2)}`,
        accessorKey: "cost_micros",
        header: "Cost",
        size: 100,
      },
      {
        accessorKey: "all_conversions",
        header: "Conversions",
        size: 100,
      },
    ],
    [data]
  ) as MRT_ColumnDef<MRT_RowData, any>[];

  const table = useMaterialReactTable({
    columns,
    data,
    state: {
      rowSelection,
      isLoading: isLoading,
      showGlobalFilter: true,
      density: "compact",
      showProgressBars: false,
      showSkeletons: isLoading,
      showLoadingOverlay: false,
    },
    autoResetPageIndex: false,
    paginationDisplayMode: "pages",
    enableExpandAll: false,
    positionToolbarAlertBanner: "bottom",
    enableColumnActions: false,
    renderTopToolbar: ({ table }) => {
      //pause or enable campaign
      const campaignStatusHandler = () => {
        updateCampaignStatus(rowSelection, status).then((res) => {
          refetchCampaigns();
          setRowSelection({});
        });
      };

      //delete campaign
      const deleteCampaignHandler = () => {
        deleteCampaign(rowSelection).then((res) => {
          refetchCampaigns();
          setRowSelection({});
        });
      };

      const noneSelected = Object.keys(rowSelection).length === 0;
      return (
        <Stack
          direction="row"
          alignItems="center"
          spacing={2}
          sx={{ padding: "1rem" }}
        >
          <Stack>
            <MRT_GlobalFilterTextField table={table} />
          </Stack>

          <Stack direction="row" alignItems="center" spacing={2}>
            <Button
              onClick={campaignStatusHandler}
              disabled={noneSelected}
              variant="outlined"
            >
              {status === "ENABLED"
                ? "Pause"
                : updatingStatus
                ? "Updating..."
                : "Enable"}
            </Button>
            <Button
              onClick={deleteCampaignHandler}
              disabled={noneSelected}
              variant="outlined"
              color="error"
            >
              {isDeleting ? "Removing..." : "Remove"}
            </Button>
          </Stack>
        </Stack>
      );
    },
    enableRowSelection: true,
    enableDensityToggle: false,
    getRowId: (row, index) => `${row.id}`,
    onRowSelectionChange: setRowSelection,
    muiExpandButtonProps: ({ row, table }) => ({
      onClick: useCallback(() => {
        table.setExpanded({ [row.id]: !row.getIsExpanded() });
        if (row.original.id) {
          setCampaignId(row.original.id);
        }
        setToggleChart(false);
      }, [row.original.id]),
      //only 1 detail panel open at a time
      sx: {
        transform: row.getIsExpanded() ? "rotate(180deg)" : "rotate(-90deg)",
        transition: "transform 0.2s",
      },
    }),
    renderDetailPanel: ({ row }) => {
      //DETAIL PANEL
      const setCurrentAdGroupHandler = (adGroupId: string | number) => {
        setCurrentAdGroup(adGroupId);
        //set name for partition table
      };

      //open and close drawer
      //if pause or delete anchors clicked, close them
      const handleEditDrawer = () => {
        setIsEditing(true);
      };

      //track what partitions are open and closed
      const handlePartitionToggle = (id: string | number) => {
        setOpenPartition((prev) => ({ ...prev, [id]: !prev[id] }));
      };

      //track if fields were updated
      const updatedCampaignFieldsHandler = () => {
        setCampaignFieldUpdated((prev) => prev + 1);
      };

      const handleMenuItemClick = (val: string) => {
        setCampaignComponent(val);
      };

      const handleAdScheduleClick = () => {
        setOpenAdSchedule((prev) => !prev);
      };

      const handleLocationModal = () => {
        setOpenLocationSettings((prev) => !prev);
      };

      const handleOpenListingScope = () => {
        setOpenListingScope((prev) => !prev);
      };

      return (
        <>
          <Box
            sx={{
              margin: 1,
            }}
          >
            <Grid container spacing={2} direction="row">
              <Grid item xs={12} md={2.5}>
                <Stack>
                  <Typography color="text.secondary">Edit Campaign</Typography>
                  <Stack
                    direction="row"
                    spacing={2}
                    alignItems="center"
                    sx={{ marginTop: "0.5rem" }}
                  >
                    <Tooltip title="Campaign Settings">
                      <Button
                        variant="contained"
                        size="small"
                        onClick={handleEditDrawer}
                      >
                        <SettingsIcon sx={{ fontSize: "20px" }} />
                      </Button>
                    </Tooltip>
                    <EditCampaignDrawer
                      open={isEditing}
                      onClose={() => {
                        //console.log("campaignfields", campaignFieldUpdated);
                        if (campaignFieldUpdated > 0) {
                          updatedCampaign();
                          setCampaignFieldUpdated(0);
                        }
                        setIsEditing(false);
                      }}
                      campaignId={row.original.id}
                      fieldUpdated={updatedCampaignFieldsHandler}
                    />

                    <Divider orientation="vertical" flexItem />
                    <Tooltip title="geo-location settings">
                      <Fab
                        size="small"
                        color="primary"
                        onClick={handleLocationModal}
                      >
                        <PublicIcon />
                      </Fab>
                    </Tooltip>

                    <GeoLocationModal
                      open={openLocationSettings}
                      onClose={handleLocationModal}
                      campaignId={row.original.id}
                      campaignName={row.original.name}
                    />
                    <Tooltip title="ad schedule">
                      <Fab
                        size="small"
                        color="primary"
                        onClick={() => {
                          setOpenAdSchedule(true);
                          getAdSchedule(row.original?.id);
                        }}
                      >
                        <EventRepeatIcon />
                      </Fab>
                    </Tooltip>
                    <AdScheduleModal
                      campaignAdSchedule={campaignAdSchedule}
                      scheduleIsLoading={adScheduleIsLoading}
                      open={openAdSchedule}
                      onClose={handleAdScheduleClick}
                      name={row.original.name}
                      campaignId={row.original.id}
                    />
                    <Tooltip title="Inventory Filter">
                      <Fab
                        onClick={handleOpenListingScope}
                        size="small"
                        color="primary"
                      >
                        <Inventory2OutlinedIcon />
                      </Fab>
                    </Tooltip>
                    <InventoryFilterModal
                      open={openListingScope}
                      loadingListingScope={loadingListingScope}
                      onClose={handleOpenListingScope}
                      campaignId={row.original.id}
                      campaignName={row.original.name}
                      listingScopeData={listingScopeData}
                    />
                  </Stack>
                </Stack>

                <Divider
                  sx={{
                    margin: "0.5rem 0",
                  }}
                />
                <Stack sx={{ margin: "0.5rem 0" }} spacing={2}>
                  <CampaignViewSideBar
                    onMenuItemClick={handleMenuItemClick}
                    status={status}
                    selectedIndex={selectedIndex}
                    onSetSelectedIndex={setSelectedIndex}
                  />
                </Stack>
              </Grid>

              <Grid item xs={12} md={9.5}>
                {toggleChart &&
                  productPartitionData &&
                  campaignComponent === "adgroup" && (
                    <Stack sx={{ width: "100%" }} alignItems="flex-start">
                      <Button
                        size="small"
                        sx={{ fontSize: 11 }}
                        startIcon={<ArrowBackIcon />}
                        onClick={() => setToggleChart(false)}
                      >
                        Back to Ad Groups
                      </Button>
                    </Stack>
                  )}

                {!toggleChart &&
                  adGroups &&
                  campaignComponent === "adgroup" && (
                    <Typography color="text.secondary">
                      Ad Groups for {row.original.name}
                    </Typography>
                  )}

                <RenderCampaignViewSideBar
                  component={campaignComponent}
                  campaignData={chartData?.filter(
                    (c) => c.id === row.original.id
                  )}
                  adGroupsLoading={adGroupsIsLoading} //adGroupsLoading
                  adGroupData={adGroups as AdGroupsTableData[]} //change maade here adGroupData
                  setCurrentAdGroup={setCurrentAdGroupHandler}
                  adGroupPostIsLoading={adGroupPostIsLoading}
                  createAdGroup={createAdGroup}
                  setCurrentAdGroupName={setCurrentAdGroupName}
                  currentAdGroupId={currentAdGroup ? currentAdGroup : null}
                  currentAdGroupName={currentAdGroupName}
                  toggle={toggleChart}
                  getProductPartitions={getProductPartitionsHandler} // refetch partitions
                  partitionIsLoading={partitionIsLoading} //changed - partitionTestLoad
                  productGroups={productPartitionData} //changed - productGroups
                  handleToggle={handlePartitionToggle}
                  open={openPartition}
                  createRootNode={createRootNode}
                  editPartitionIsLoading={editPartitionIsLoading}
                  editPartitionTree={editPartitionTree}
                  updateNegativeStatus={updateNegativeStatus}
                  negativeStatusLoading={updatingNegativeStatus}
                  bidsAreUpdating={bidsAreUpdating}
                  updateCostPerClick={updateCpCMicros}
                  createRootNodeIsLoading={createRootNodeIsLoading}
                />
              </Grid>
            </Grid>
          </Box>
        </>
      );
    },
  });

  return <MaterialReactTable table={table} />;
};

export default DynamicCampaignTable;
