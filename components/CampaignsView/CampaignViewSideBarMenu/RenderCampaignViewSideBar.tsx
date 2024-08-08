import React from "react";

import dynamic from "next/dynamic";

import { StyledFadeIn } from "@/components/Shared/StyledFadeInComponents";
//import ProductPartitionTable from "@/components/ProductPartitionTable/ProductPartitionTable";
import { AdGroupCriterionResource, CriterionData, UserCampaign } from "@/types";
import LinearProgress from "@mui/material/LinearProgress";

import { AdGroupsTableData } from "../AdGroupsTable";
import { MiniLineChart } from "../MiniLineChart";
import { CampaignMenuItemComponent } from "./campaignSideBar.enum";

const AdGroupsTable = dynamic(
  () => import("@/components/CampaignsView/AdGroupsTable"),
  { ssr: false, loading: () => <LinearProgress /> }
);

const ProductPartitionTable = dynamic(
  () => import("@/components/ProductPartitionTable/ProductPartitionTable"),
  { ssr: false, loading: () => <LinearProgress /> }
);

interface RenderCampaignSideBar {
  component: string;
  //Ad Groups Component
  adGroupData: AdGroupsTableData[];
  adGroupsLoading: boolean;
  getProductPartitions: (adGroupId: string | number) => void;
  setCurrentAdGroup: (adGroup: string | number) => void;
  setCurrentAdGroupName: (name: string) => void;
  adGroupPostIsLoading: boolean;
  createAdGroup: (adGroup: { [key: string]: string | number }) => Promise<void>;
  //mini line chart
  campaignData: UserCampaign[];
  toggle: boolean;
  //product partition table
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

const RenderCampaignViewSideBar = ({
  //menu item
  component,
  //adgroup
  adGroupData,
  adGroupsLoading,
  getProductPartitions,
  setCurrentAdGroup,
  setCurrentAdGroupName,
  adGroupPostIsLoading,
  createAdGroup,
  //mini line chart
  campaignData,
  toggle, //toggle component state
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
  productGroups,
}: RenderCampaignSideBar) => {
  switch (component) {
    case CampaignMenuItemComponent.AD_GROUP:
      return (
        <>
          {!toggle && (
            <StyledFadeIn delay={0.1} visible={true}>
              <AdGroupsTable
                adGroupData={adGroupData}
                adGroupsLoading={adGroupsLoading}
                setCurrentAdGroup={setCurrentAdGroup}
                setCurrentAdGroupName={setCurrentAdGroupName}
                adGroupPostIsLoading={adGroupPostIsLoading}
                createAdGroup={createAdGroup}
                getProductPartitions={getProductPartitions}
              />
            </StyledFadeIn>
          )}

          {toggle && (
            <StyledFadeIn delay={0.1} visible={true}>
              <ProductPartitionTable
                partitionIsLoading={partitionIsLoading}
                productGroups={productGroups}
                handleToggle={handleToggle}
                open={open}
                //setOperationComplete={handlePartitionOperationComplete}
                currentAdGroupId={currentAdGroupId ? currentAdGroupId : null}
                currentAdGroupName={currentAdGroupName}
                createRootNode={createRootNode}
                editPartitionIsLoading={editPartitionIsLoading}
                editPartitionTree={editPartitionTree}
                updateNegativeStatus={updateNegativeStatus}
                negativeStatusLoading={negativeStatusLoading}
                bidsAreUpdating={bidsAreUpdating}
                updateCostPerClick={updateCostPerClick}
                createRootNodeIsLoading={createRootNodeIsLoading}
              />
            </StyledFadeIn>
          )}
        </>
      );
    case CampaignMenuItemComponent.CAMPAIGN_CHART_DATA:
      return (
        <StyledFadeIn delay={0.1} visible={true}>
          <MiniLineChart campaignData={campaignData} />
        </StyledFadeIn>
      );

    default:
      return <MiniLineChart campaignData={campaignData} />;
  }
};

export default RenderCampaignViewSideBar;
