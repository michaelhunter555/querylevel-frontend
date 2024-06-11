import React from "react";

import { AdGroupCriterionResource } from "@/types";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

interface EditNodeButtonProps {
  node: AdGroupCriterionResource;
  modalEditHandler: (criterionId: number) => void;
}

export const EditNodeButton = ({
  node,
  modalEditHandler,
}: EditNodeButtonProps) => {
  return (
    <>
      {node?.listing_group?.type === 2 ? (
        <Tooltip title="edit subdivision">
          <IconButton
            sx={{ padding: "2px" }}
            size="small"
            onClick={() => modalEditHandler(node?.criterion_id)}
          >
            <EditIcon sx={{ fontSize: 13 }} />
          </IconButton>
        </Tooltip>
      ) : node?.listing_group?.type === 3 &&
        !node?.listing_group?.case_value?.product_item_id ? (
        <Tooltip title="add subdivision">
          <IconButton
            sx={{ padding: "2px" }}
            size="small"
            onClick={() => modalEditHandler(node?.criterion_id)}
          >
            <AddIcon sx={{ fontSize: 13 }} />
          </IconButton>
        </Tooltip>
      ) : null}
    </>
  );
};
