import React from "react";

import { AdGroupsTableData } from "@/components/CampaignsView/AdGroupsTable";
import { TextFieldInput } from "@/components/CreateCampaignSteps/CreateShoppingCampaign/TextFieldInputs";
import { useForm } from "@/hooks/useForm";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import { useQueryClient } from "@tanstack/react-query";

interface AdGroupCostPerClick {
  adGroup: AdGroupsTableData;
  onCancel: (event: React.MouseEvent<HTMLElement>) => void;
  updateCostPerClick?: (
    adGroup: AdGroupsTableData,
    cpc: number
  ) => Promise<void>;
  isLoading?: boolean;
}

export const UpdateAdGroupCostPerClick = ({
  updateCostPerClick,
  adGroup,
  onCancel,
  isLoading,
}: AdGroupCostPerClick) => {
  const queryClient = useQueryClient();
  const [formState, inputHandler, setFormData] = useForm(
    {
      cpc: {
        value: (adGroup?.cpc_bid_micros / 1000000).toFixed(2) || 0,
        isValid: false,
      },
    },
    false
  );

  //console.log("cpc partition", formState?.inputs);

  return (
    <Box sx={{ width: "100%" }}>
      <Stack sx={{ padding: "5px" }}>
        <TextFieldInput
          id="cpc"
          name="cpc"
          title="Edit CpC bid"
          type="number"
          defaultValue={formState?.inputs?.cpc?.value as number}
          hasAdornment={true}
          inputHandler={inputHandler}
        />
      </Stack>
      <Stack direction="row" spacing={2} alignItems="center">
        <Button size="small" onClick={onCancel}>
          {isLoading ? <Skeleton sx={{ width: "100%" }} /> : "Cancel"}
        </Button>
        <Button
          disabled={!formState.isValid}
          size="small"
          onClick={async (event: React.MouseEvent<HTMLElement>) => {
            await updateCostPerClick?.(
              adGroup,
              formState?.inputs?.cpc?.value as number
            ).then(async () => {
              onCancel(event);
              await queryClient.invalidateQueries({ queryKey: ["adGroups"] });
            });
            //console.log(adGroup, formState?.inputs?.cpc?.value as number);
          }}
        >
          {isLoading ? <Skeleton sx={{ width: "100%" }} /> : "Save"}
        </Button>
      </Stack>
    </Box>
  );
};
