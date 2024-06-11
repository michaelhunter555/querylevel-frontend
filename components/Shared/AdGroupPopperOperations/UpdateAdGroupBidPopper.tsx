import React from "react";

import { AdGroupsTableData } from "@/components/CampaignsView/AdGroupsTable";

import { AdGroupOperationsPopper } from "./AdGroupPopper";

interface UpdateAdGroupCostPerClickProps {
  adGroup: any;
  costPerClickId: string;
  cpcAnchorEl: { [key: string]: null | HTMLElement };
  bidsAreUpdating: boolean;
  costPerClickAnchorHandler: (
    event: React.MouseEvent<HTMLElement>,
    id: number | string
  ) => void;
  updateCostPerClick: (
    adGroup: AdGroupsTableData,
    cpc: number
  ) => Promise<void>;
}

export const UpdateAdGroupCostPerClickPopper = ({
  adGroup,
  costPerClickId,
  cpcAnchorEl,
  bidsAreUpdating,
  costPerClickAnchorHandler,
  updateCostPerClick,
}: UpdateAdGroupCostPerClickProps) => {
  return (
    <>
      <AdGroupOperationsPopper
        operationType={0}
        id={costPerClickId as string}
        open={
          cpcAnchorEl[adGroup?.id] !== null &&
          cpcAnchorEl?.hasOwnProperty(adGroup?.id)
        }
        anchorEl={cpcAnchorEl[adGroup?.id]}
        onCancel={(event: React.MouseEvent<HTMLElement>) =>
          costPerClickAnchorHandler(event, adGroup?.id)
        }
        adGroup={adGroup}
        placement="top"
        bidsAreUpdating={bidsAreUpdating}
        updateCostPerClick={updateCostPerClick}
      />
    </>
  );
};
