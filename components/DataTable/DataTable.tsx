// import React, { useEffect, useState } from "react";

// import { useCreateAdGroup, useGetAdGroups } from "@/hooks/adGroups-hook";
// import {
//   useAdScheduleApi,
//   useDeleteCampaign,
//   useUpdateCampaignStatus,
// } from "@/hooks/campaign-hooks";
// import {
//   useCreateRootPartitionNode,
//   useEditProductPartition,
//   useGetProductPartitions,
//   useUpdateCpcBids,
//   useUpdateNegativeStatus,
// } from "@/hooks/productPartion-hook";
// import { UserCampaign } from "@/types";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import BackspaceIcon from "@mui/icons-material/Backspace";
// import EditCalendarIcon from "@mui/icons-material/EditCalendar";
// import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
// import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
// import PauseIcon from "@mui/icons-material/Pause";
// import PlayArrowIcon from "@mui/icons-material/PlayArrow";
// import SettingsIcon from "@mui/icons-material/Settings";
// import {
//   Box,
//   Button,
//   Card,
//   Collapse,
//   Divider,
//   Grid,
//   IconButton,
//   Stack,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Tooltip,
//   Typography,
// } from "@mui/material";

// import { AdGroupsTableData } from "../CampaignsView/AdGroupsTable";
// import { CampaignViewSideBar } from "../CampaignsView/CampaignViewSideBarMenu/CampaignViewSideBar";
// //import RenderCampaignViewSideBar from "../CampaignsView/CampaignViewSideBarMenu/RenderCampaignViewSideBar";
// //import { EditCampaignDrawer } from "../EditCampaignDrawer/EditCampaignDrawer";
// import { PopperMessage } from "../Shared/PopperMessage";
// import { StatusDot } from "../Shared/StatusDot";
// import { LoadingTable } from "./LoadingTable";

// //seems we double named..

// export type AggregatedCampaignData = {
//   date: string;
//   campaigns: UserCampaign[];
// };

// function Row(props: {
//   campaign: UserCampaign;
//   chartData: UserCampaign[];
//   updatedCampaign: () => void;
//   segment: string;
//   status: string;
// }) {
//   //campaign level data passed down as props - rows
//   const { campaign, chartData, updatedCampaign, segment, status } = props;
//   //ad groups
//   const {
//     isLoading: adGroupsLoading,
//     getAdGroups,
//     adGroupData,
//   } = useGetAdGroups();
//   //product group view
//   const {
//     isLoading: partitionsLoading,
//     getProductPartitions,
//     productGroups,
//   } = useGetProductPartitions();
//   //handle opening of individual partitions
//   const [openPartition, setOpenPartition] = useState<{
//     [key: string]: boolean;
//   }>({});
//   //manages the table at campaign level
//   const [open, setOpen] = useState<boolean>(false);
//   //if a field was successfully updated increment, if greater > 0, call updatedCampaign
//   const [campaignFieldUpdated, setCampaignFieldUpdated] = useState<number>(0);
//   //manages the state of the edit drawer
//   const [isEditing, setIsEditing] = useState<boolean>(false);
//   //handles pausing campaigns component
//   const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
//   //current ad group set by clicking ad_group -> product group view
//   const [currentAdGroup, setCurrentAdGroup] = useState<string | number | null>(
//     null
//   );
//   //ad group's name
//   const [currentAdGroupName, setCurrentAdGroupName] = useState<string>("");
//   //handles delete campaigns component
//   const [deleteAnchorEl, setDeleteAnchorEl] = useState<null | HTMLElement>(
//     null
//   );
//   //toggles between partition table and campaign performance
//   const [toggleChart, setToggleChart] = useState<boolean>(false);
//   //toggle ad schedule
//   const [openAdSchedule, setOpenAdSchedule] = useState<boolean>(false);
//   //index of campaignMenu
//   const [selectedIndex, setSelectedIndex] = useState<number>(0);
//   //async request to udpdate campaign status ENABLED, PAUSED
//   const { isPostLoading, updateCampaignStatus, message } =
//     useUpdateCampaignStatus();
//   //component sidebar
//   const [campaignComponent, setCampaignComponent] = useState("adgroup");
//   //async request to delete campaign by id
//   const {
//     isPostLoading: isDeleting,
//     deleteCampaign,
//     message: deleteMessage,
//   } = useDeleteCampaign();
//   //creates root node for product_group view if no root subdivision
//   const {
//     createRootNode,
//     createRootNodeIsLoading,
//     createRootNodeSuccess,
//     resetCreateRootNodeSuccess,
//   } = useCreateRootPartitionNode();

//   const { getAdSchedule } = useAdScheduleApi();

//   const {
//     partitionResponse: partitionPostSuccess,
//     isPostLoading: editPartitionIsLoading,
//     editPartitionTree,
//     resetPartitionResponse,
//   } = useEditProductPartition();

//   const {
//     updateNegativeStatus,
//     isLoading: updatingNegativeStatus,
//     updateNegativeSucess,
//     resetUpdateNegativeSucess,
//   } = useUpdateNegativeStatus();

//   const {
//     isLoading: bidsAreUpdating,
//     updateCpCMicros,
//     updateCpcBidSuccess,
//     resetUpdateCpcBidSuccess,
//   } = useUpdateCpcBids();
//   //create an ad group
//   const {
//     createAdGroupSuccess,
//     adGroupPostIsLoading,
//     createAdGroup,
//     resetAdGroupResponse,
//   } = useCreateAdGroup();
//   //view search terms

//   useEffect(() => {
//     //if response.ok === true && a valid adgroup id
//     if ((partitionPostSuccess || createRootNodeSuccess) && currentAdGroup) {
//       if (createRootNodeSuccess) {
//         resetCreateRootNodeSuccess();
//       } else if (partitionPostSuccess) {
//         resetPartitionResponse();
//       }
//       getProductPartitionsHandler(currentAdGroup);
//     }
//   }, [partitionPostSuccess, createRootNodeSuccess]);

//   useEffect(() => {
//     //update negative success
//     if (updateNegativeSucess && currentAdGroup) {
//       resetUpdateNegativeSucess();
//       getProductPartitionsHandler(currentAdGroup);
//     }
//   }, [updateNegativeSucess]);

//   useEffect(() => {
//     if (updateCpcBidSuccess && currentAdGroup) {
//       resetUpdateCpcBidSuccess();
//       getProductPartitionsHandler(currentAdGroup);
//     }
//   }, [updateCpcBidSuccess]);

//   useEffect(() => {
//     if (createAdGroupSuccess) {
//       getAdGroups(campaign?.id, segment, status);
//       resetAdGroupResponse();
//     }
//   }, [createAdGroupSuccess]);

//   const setCurrentAdGroupHandler = (adGroupId: string | number) => {
//     setCurrentAdGroup(adGroupId);
//     //set name for partition table
//   };

//   //pause or enable campaign
//   const campaignStatusHandler = () => {
//     //console.log("updated Campaign");
//     if (campaign.id) {
//       // updateCampaignStatus(
//       //   campaign.id,
//       //   campaign?.status as enums.CampaignStatus
//       // );
//     }
//   };

//   //delete campaign
//   const deleteCampaignHandler = () => {
//     //console.log("Deleted Campaign");
//     if (campaign.id) {
//       deleteCampaign(campaign.id);
//     }
//   };

//   //open and close drawer
//   //if pause or delete anchors clicked, close them
//   const handleEditDrawer = () => {
//     setIsEditing(true);
//     if (anchorEl || deleteAnchorEl) {
//       setAnchorEl(null);
//       setDeleteAnchorEl(null);
//     }
//   };

//   //handle current status before and expected status after if confirm
//   const currentStatus: string = campaign?.status === 2 ? "Enabled" : "Paused";
//   const newStatus: string = currentStatus === "Enabled" ? "Paused" : "Enabled";

//   const pauseId = anchorEl ? "PauseCampaign" : null;
//   const openPauseAnchor = Boolean(anchorEl);
//   const handlePauseClick = (event: React.MouseEvent<HTMLElement>) => {
//     setAnchorEl(anchorEl ? null : event.currentTarget);

//     if (deleteAnchorEl) {
//       setDeleteAnchorEl(null);
//     }
//   };

//   //handle current status before and expected status after if confirm
//   const deleteId = deleteAnchorEl ? "DeleteCampaign" : null;
//   const openDeleteAnchor = Boolean(deleteAnchorEl);
//   const handleDeleteClick = (event: React.MouseEvent<HTMLElement>) => {
//     setDeleteAnchorEl(deleteAnchorEl ? null : event.currentTarget);
//     if (anchorEl) {
//       setAnchorEl(null);
//     }
//   };

//   //retrieve partitions for ad group
//   const getProductPartitionsHandler = (adGroupId: string | number) => {
//     if (adGroupId) {
//       getProductPartitions(status, segment, adGroupId);
//     }
//     setToggleChart(true);
//   };

//   //track what partitions are open and closed
//   const handlePartitionToggle = (id: string | number) => {
//     setOpenPartition((prev) => ({ ...prev, [id]: !prev[id] }));
//   };

//   //track if fields were updated
//   const updatedCampaignFieldsHandler = () => {
//     setCampaignFieldUpdated((prev) => prev + 1);
//   };

//   const handleMenuItemClick = (val: string) => {
//     setCampaignComponent(val);
//   };

//   const handleAdScheduleClick = () => {
//     setOpenAdSchedule((prev) => !prev);
//   };

//   return (
//     <>
//       <TableRow>
//         <TableCell>
//           <IconButton
//             size="small"
//             onClick={() => {
//               if (!open) {
//                 getAdGroups(campaign?.id, segment, status);
//               }
//               setOpen(!open);
//             }}
//           >
//             {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
//           </IconButton>
//         </TableCell>
//         <TableCell component="th" scope="row">
//           {campaign.name}
//         </TableCell>
//         <TableCell>
//           <StatusDot active={campaign.status === 2} />
//         </TableCell>
//         <TableCell>{campaign.id}</TableCell>
//         <TableCell>{campaign.ctr.toFixed(2)}</TableCell>
//         <TableCell>{campaign.average_cpc.toFixed(2)}</TableCell>
//         <TableCell>{campaign.clicks}</TableCell>
//         <TableCell>{(campaign.cost_micros / 1000000).toFixed(2)}</TableCell>
//         <TableCell>{campaign.all_conversions}</TableCell>
//       </TableRow>
//       <TableRow sx={{ marginBottom: 2 }}>
//         <TableCell
//           style={{ paddingBottom: 0, paddingTop: 0, width: "100%" }}
//           colSpan={9}
//         >
//           <Collapse in={open} timeout="auto" unmountOnExit>
//             <Box
//               sx={{
//                 margin: 1,
//                 height: "auto",
//               }}
//             >
//               <Grid container spacing={2} direction="row">
//                 <Grid item xs={12} md={3}>
//                   <Stack>
//                     <Typography color="text.secondary">
//                       Edit Campaign
//                     </Typography>
//                     <Stack
//                       direction="row"
//                       spacing={2}
//                       alignItems="center"
//                       justifyContent="flex-start"
//                       sx={{ marginTop: "0.5rem" }}
//                     >
//                       <Tooltip title="Edit Settings">
//                         <Button
//                           variant="contained"
//                           size="small"
//                           onClick={handleEditDrawer}
//                         >
//                           <SettingsIcon sx={{ fontSize: "20px" }} />
//                         </Button>
//                       </Tooltip>
//                       <EditCampaignDrawer
//                         open={isEditing}
//                         onClose={() => {
//                           //console.log("campaignfields", campaignFieldUpdated);
//                           if (campaignFieldUpdated > 0) {
//                             updatedCampaign();
//                             setCampaignFieldUpdated(0);
//                           }
//                           setIsEditing(false);
//                         }}
//                         campaignId={campaign.id}
//                         fieldUpdated={updatedCampaignFieldsHandler}
//                       />
//                       <Tooltip
//                         title={
//                           campaign.status === 2
//                             ? "Pause Campaign"
//                             : "Enable Campaign"
//                         }
//                       >
//                         <Button
//                           aria-describedby={pauseId as string}
//                           variant="outlined"
//                           size="small"
//                           color={campaign.status === 2 ? "primary" : "success"}
//                           onClick={handlePauseClick}
//                         >
//                           {campaign.status === 2 ? (
//                             <PauseIcon sx={{ fontSize: "20px" }} />
//                           ) : (
//                             <PlayArrowIcon sx={{ fontSize: "20px" }} />
//                           )}
//                         </Button>
//                       </Tooltip>
//                       <PopperMessage
//                         status={campaign.status as number}
//                         id={pauseId as string}
//                         open={openPauseAnchor}
//                         anchorEl={anchorEl}
//                         onCancel={handlePauseClick}
//                         onConfirm={campaignStatusHandler}
//                         text={`Change ${campaign.name}'s status from ${currentStatus} to ${newStatus}? Please confirm this action.`}
//                       />
//                       <Tooltip title="Delete Campaign">
//                         <Button
//                           aria-describedby={deleteId as string}
//                           variant="outlined"
//                           color="error"
//                           size="small"
//                           onClick={handleDeleteClick}
//                         >
//                           <BackspaceIcon sx={{ fontSize: "20px" }} />
//                         </Button>
//                       </Tooltip>
//                       <PopperMessage
//                         status={campaign.status as number}
//                         id={deleteId as string}
//                         open={openDeleteAnchor}
//                         anchorEl={deleteAnchorEl}
//                         onCancel={handleDeleteClick}
//                         onConfirm={deleteCampaignHandler}
//                         text={`Delete ${campaign.name}. Please note this action can not be undone.`}
//                       />
//                       <Divider orientation="vertical" flexItem />
//                       <Button
//                         onClick={() => {
//                           setOpenAdSchedule(true);
//                           getAdSchedule(campaign?.id);
//                         }}
//                         variant="outlined"
//                         sx={{ fontSize: "10px" }}
//                       >
//                         <EditCalendarIcon />
//                       </Button>
//                     </Stack>
//                   </Stack>

//                   <Divider
//                     sx={{
//                       margin: "0.5rem 0",
//                     }}
//                   />
//                   <Stack sx={{ margin: "0.5rem 0" }} spacing={2}>
//                     <CampaignViewSideBar
//                       onMenuItemClick={handleMenuItemClick}
//                       status={status}
//                       selectedIndex={selectedIndex}
//                       onSetSelectedIndex={setSelectedIndex}
//                     />
//                   </Stack>
//                 </Grid>

//                 <Grid item xs={12} md={9}>
//                   {toggleChart &&
//                     productGroups &&
//                     campaignComponent === "adgroup" && (
//                       <Stack sx={{ width: "100%" }} alignItems="flex-start">
//                         <Button
//                           size="small"
//                           sx={{ fontSize: 11 }}
//                           startIcon={<ArrowBackIcon />}
//                           onClick={() => setToggleChart(false)}
//                         >
//                           Back to Ad Groups
//                         </Button>
//                       </Stack>
//                     )}

//                   {!toggleChart &&
//                     adGroupData &&
//                     campaignComponent === "adgroup" && (
//                       <Typography color="text.secondary">
//                         Ad Groups for {campaign?.name}
//                       </Typography>
//                     )}

//                   <RenderCampaignViewSideBar
//                     component={campaignComponent}
//                     campaignData={chartData}
//                     adGroupsLoading={adGroupsLoading}
//                     adGroupData={adGroupData as AdGroupsTableData[]}
//                     getProductPartitions={getProductPartitionsHandler}
//                     setCurrentAdGroup={setCurrentAdGroupHandler}
//                     adGroupPostIsLoading={adGroupPostIsLoading}
//                     createAdGroup={createAdGroup}
//                     setCurrentAdGroupName={setCurrentAdGroupName}
//                     toggle={toggleChart}
//                     partitionIsLoading={partitionsLoading}
//                     productGroups={productGroups}
//                     handleToggle={handlePartitionToggle}
//                     open={openPartition}
//                     currentAdGroupId={currentAdGroup ? currentAdGroup : null}
//                     currentAdGroupName={currentAdGroupName}
//                     createRootNode={createRootNode}
//                     editPartitionIsLoading={editPartitionIsLoading}
//                     editPartitionTree={editPartitionTree}
//                     updateNegativeStatus={updateNegativeStatus}
//                     negativeStatusLoading={updatingNegativeStatus}
//                     bidsAreUpdating={bidsAreUpdating}
//                     updateCostPerClick={updateCpCMicros}
//                     createRootNodeIsLoading={createRootNodeIsLoading}
//                   />
//                 </Grid>
//               </Grid>
//             </Box>
//           </Collapse>
//         </TableCell>
//       </TableRow>
//     </>
//   );
// }

// const AdCampaignsDataTable: React.FC<{
//   tableData: UserCampaign[];
//   isLoading: boolean;
//   chartData: UserCampaign[];
//   updatedCampaign: () => void;
//   segment: string;
//   status: string;
// }> = ({
//   tableData,
//   isLoading,
//   chartData,
//   updatedCampaign,
//   segment,
//   status,
// }) => {
//   return (
//     <TableContainer component={Card} sx={{ marginBottom: "5rem" }}>
//       <Table size="small">
//         <TableHead>
//           <TableRow>
//             <TableCell></TableCell>
//             <TableCell>Campaign Name</TableCell>
//             <TableCell>Status</TableCell>
//             <TableCell>Id</TableCell>
//             <TableCell>CTR</TableCell>
//             <TableCell>Average CPC</TableCell>
//             <TableCell>Clicks</TableCell>
//             <TableCell>Cost</TableCell>
//             <TableCell>Conversions</TableCell>
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           {tableData &&
//             !isLoading &&
//             tableData?.map((campaign, i) => (
//               <Row
//                 key={campaign.id}
//                 campaign={campaign}
//                 chartData={chartData.filter((c) => c.id === campaign.id)}
//                 updatedCampaign={updatedCampaign}
//                 segment={segment}
//                 status={status}
//               />
//             ))}
//           {isLoading && <LoadingTable isHome={false} />}
//         </TableBody>
//       </Table>
//     </TableContainer>
//   );
// };

// export default AdCampaignsDataTable;
