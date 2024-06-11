import React from "react";

import { AdGroupsTableData } from "@/components/CampaignsView/AdGroupsTable";
import { PopperPlacement } from "@/types";
import Card from "@mui/material/Card";
import Popper from "@mui/material/Popper";

import { UpdateAdGroupCostPerClick } from "./UpdateAdGroupBid";
import { UpdateAdGroupStatus } from "./UpdateStatusSelection";

interface AdGroupPopperActions {
  id: string;
  open: boolean;
  onCancel: (event: React.MouseEvent<HTMLElement>) => void;
  anchorEl: HTMLElement | null;
  placement?: PopperPlacement;
  operationType: number;
  // TODO:
  adGroup: AdGroupsTableData;
  bidsAreUpdating?: boolean;
  updateCostPerClick?: (
    adGroup: AdGroupsTableData,
    cpc: number
  ) => Promise<void>;
  //update adgroup status
  statusIsUpdating?: boolean;
  updateAdGroupStatus?: (adGroup: {}) => Promise<void>;
}

export const AdGroupOperationsPopper = ({
  id,
  open,
  anchorEl,
  placement,
  onCancel,
  operationType,
  bidsAreUpdating,
  updateCostPerClick,
  adGroup,
  statusIsUpdating,
  updateAdGroupStatus,
}: AdGroupPopperActions) => {
  return (
    <Popper
      id={id}
      open={open}
      anchorEl={anchorEl}
      placement={placement ? placement : "bottom-start"}
    >
      <Card sx={{ maxWidth: 250 }}>
        {/* {update name} */}
        {operationType === 0 ? (
          <UpdateAdGroupCostPerClick
            adGroup={adGroup}
            onCancel={onCancel}
            updateCostPerClick={updateCostPerClick}
            isLoading={bidsAreUpdating}
          />
        ) : (
          //update status
          operationType === 1 && (
            <UpdateAdGroupStatus
              adGroup={adGroup}
              onCancel={onCancel}
              statusIsUpdating={statusIsUpdating}
              updateAdGroupStatus={updateAdGroupStatus}
            />
          )
        )}
      </Card>
    </Popper>
  );
};
