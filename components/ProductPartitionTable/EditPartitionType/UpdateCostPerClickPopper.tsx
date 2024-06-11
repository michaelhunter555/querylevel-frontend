import React from "react";

import { PopperMessage } from "@/components/Shared/PopperMessage";
import { AdGroupCriterionResource } from "@/types";

interface UpdateCostPerClickProps {
  node: AdGroupCriterionResource;
  costPerClickId: string;
  cpcAnchorEl: { [key: string]: null | HTMLElement };
  bidsAreUpdating: boolean;
  costPerClickAnchorHandler: (
    event: React.MouseEvent<HTMLElement>,
    id: number | string
  ) => void;
  updateCostPerClick: (
    node: AdGroupCriterionResource,
    cpc: number | null
  ) => Promise<void>;
}

export const UpdateCostPerClickPopper = ({
  node,
  costPerClickId,
  cpcAnchorEl,
  bidsAreUpdating,
  costPerClickAnchorHandler,
  updateCostPerClick,
}: UpdateCostPerClickProps) => {
  return (
    <>
      <PopperMessage
        status={4}
        id={costPerClickId as string}
        open={
          cpcAnchorEl[node?.criterion_id] !== null &&
          cpcAnchorEl?.hasOwnProperty(node?.criterion_id)
        }
        anchorEl={cpcAnchorEl[node?.criterion_id]}
        onCancel={(event: React.MouseEvent<HTMLElement>) =>
          costPerClickAnchorHandler(event, node?.criterion_id)
        }
        placement="top"
        node={node}
        bidsAreUpdating={bidsAreUpdating}
        updateCostPerClick={updateCostPerClick}
      />
    </>
  );
};
