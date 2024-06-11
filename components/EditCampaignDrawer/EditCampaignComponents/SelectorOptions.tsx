import React from "react";

import {
  selectBiddingStrategy,
  selectBudgetDelivery,
  selectCampaignPriority,
  selectGeoTargeting,
} from "@/components/CampaignsView/CreateCampaign.enums";
import { State } from "@/types";
import { SelectChangeEvent } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

type EditSelectorOptions = {
  id: string;
  formState: State;
  inputHandler: (
    id: string,
    value: string | number | boolean,
    isValid: boolean
  ) => void;
};

export const SelectorOptions = ({
  id,
  formState,
  inputHandler,
}: EditSelectorOptions) => {
  let object: any = {};
  let title: string;
  switch (id) {
    case "campaignBudgetDelivery":
      object = selectBudgetDelivery;
      title = "Budget Delivery";
      break;
    case "campaignPriority":
      object = selectCampaignPriority;
      title = "Campaign Priority";
      break;
    case "biddingStrategyType":
      object = selectBiddingStrategy;
      title = "Bidding Strategy";
      break;
    case "positiveGeoTargetType":
      object = selectGeoTargeting;
      title = "Geo Targeting";
      break;
    default:
      object = selectCampaignPriority;
      title = "Options";
  }

  return (
    <>
      <InputLabel id={id}>Select {title}</InputLabel>
      <Select
        id={id}
        name={id}
        value={formState?.inputs[id]?.value as any}
        onChange={(event: SelectChangeEvent<number>) => {
          inputHandler(id, event.target.value, true);
        }}
        sx={{ width: "100%" }}
      >
        {Object.entries(object).map(([key, value]) => (
          <MenuItem key={value as string} value={key as string}>
            {value as string}
          </MenuItem>
        ))}
      </Select>
    </>
  );
};
