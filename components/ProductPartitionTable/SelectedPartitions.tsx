import React from "react";

import { CriterionData } from "@/types";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";

interface SelectedPartitions {
  selectedPartitions: CriterionData[];
  isLoading: boolean;
  options: string;
}

export const SelectedPartitions = ({
  selectedPartitions,
  isLoading,
  options,
}: SelectedPartitions) => {
  const renderPartitions = (partition: CriterionData) => {
    let item: string[] = [];
    if (options === "brand") {
      item = partition?.brand;
    } else if (options === "type") {
      item = partition?.productType;
    } else if (options === "item_id") {
      item = partition?.productId;
    }
    return item.join("");
  };

  return (
    <>
      {selectedPartitions?.length === 0 && (
        <Typography color="text.secondary">No items selected.</Typography>
      )}
      {selectedPartitions?.map((partition, i) => (
        <ListItem key={partition?.partitionId}>
          {!isLoading && (
            <ListItemText
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
              primary={
                <Typography variant="subtitle2" color="text.secondary">
                  {renderPartitions(partition)}
                </Typography>
              }
              // secondary={<HighlightOffIcon />}
            />
          )}
        </ListItem>
      ))}
    </>
  );
};
