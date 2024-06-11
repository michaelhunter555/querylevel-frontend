import React from "react";

import { PopperMessage } from "@/components/Shared/PopperMessage";
import { AdGroupCriterionResource } from "@/types";

interface TargetAndExcludeProps {
  node: AdGroupCriterionResource;
  negativeId: string;
  negativeAnchorEl: { [key: string]: null | HTMLElement };
  negativeStatusLoading: boolean;
  negativeAnchorHandler: (
    event: React.MouseEvent<HTMLElement>,
    id: number | string
  ) => void;
  updateNegativeStatus: (
    node: AdGroupCriterionResource,
    cpc: number | null
  ) => Promise<void>;
}

export const TargetAndExcludePopper = ({
  node,
  negativeId,
  negativeAnchorEl,
  negativeStatusLoading,
  negativeAnchorHandler,
  updateNegativeStatus,
}: TargetAndExcludeProps) => {
  return (
    <>
      <PopperMessage
        status={!node?.negative ? 0 : 1}
        id={negativeId as string}
        open={
          negativeAnchorEl[node?.criterion_id] !== null &&
          negativeAnchorEl?.hasOwnProperty(node?.criterion_id)
        }
        anchorEl={negativeAnchorEl[node?.criterion_id]}
        onCancel={(event: React.MouseEvent<HTMLElement>) =>
          negativeAnchorHandler(event, node?.criterion_id)
        }
        placement="bottom"
        node={node}
        updateNegativeStatus={updateNegativeStatus}
        negativeStatusLoading={negativeStatusLoading}
      />
    </>
  );
};
