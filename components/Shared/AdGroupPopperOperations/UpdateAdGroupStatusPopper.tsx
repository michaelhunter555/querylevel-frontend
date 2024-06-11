import React from "react";

import { AdGroupOperationsPopper } from "./AdGroupPopper";

interface UpdateAdGroupStatus {
  adGroup: any;
  statusId: string;
  statusAnchorEl: { [key: string]: null | HTMLElement };
  statusUpdateIsLoading: boolean;
  adGroupStatusAnchorHandler: (
    event: React.MouseEvent<HTMLElement>,
    id: number | string
  ) => void;
  updateAdGroupStatus: (adGroup: {}) => Promise<void>;
}

export const UpdateAdGroupStatusPopper = ({
  adGroup,
  statusId,
  statusAnchorEl,
  statusUpdateIsLoading,
  adGroupStatusAnchorHandler,
  updateAdGroupStatus,
}: UpdateAdGroupStatus) => {
  return (
    <>
      <AdGroupOperationsPopper
        operationType={1}
        id={statusId as string}
        open={
          statusAnchorEl[adGroup?.id] !== null &&
          statusAnchorEl?.hasOwnProperty(adGroup?.id)
        }
        anchorEl={statusAnchorEl[adGroup?.id]}
        onCancel={(event: React.MouseEvent<HTMLElement>) =>
          adGroupStatusAnchorHandler(event, adGroup?.id)
        }
        placement="bottom"
        adGroup={adGroup}
        statusIsUpdating={statusUpdateIsLoading}
        updateAdGroupStatus={updateAdGroupStatus}
      />
    </>
  );
};
