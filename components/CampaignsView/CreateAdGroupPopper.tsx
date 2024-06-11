import React from "react";

import { PopperMessage } from "../Shared/PopperMessage";

interface CreateAdGroup {
  createAdGroupId: string;
  campaignResource: string;
  adGroupAnchorEl: HTMLElement | null;
  adGroupAnchorHandler: (event: React.MouseEvent<HTMLElement>) => void;
  createAdGroup?: (adGroup: {
    [key: string]: string | number;
  }) => Promise<void>;
  createAdGroupIsLoading?: boolean;
}
export const CreateAdGroupPopper = ({
  createAdGroupId,
  adGroupAnchorEl,
  adGroupAnchorHandler,
  createAdGroup,
  createAdGroupIsLoading,
  campaignResource,
}: CreateAdGroup) => {
  return (
    <>
      <PopperMessage
        id={createAdGroupId as string}
        status={5} //if status === 5
        open={!!adGroupAnchorEl}
        anchorEl={adGroupAnchorEl}
        onCancel={(event: React.MouseEvent<HTMLElement>) =>
          adGroupAnchorHandler(event)
        }
        createAdGroup={createAdGroup}
        createAdGroupIsLoading={createAdGroupIsLoading}
        campaignResource={campaignResource}
        placement="right-start"
      />
    </>
  );
};
