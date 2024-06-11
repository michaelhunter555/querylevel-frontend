import React from "react";

import { TextFieldInput } from "@/components/CreateCampaignSteps/CreateShoppingCampaign/TextFieldInputs";
import { useInvalidateQuery } from "@/hooks/invalidateQueries";
import { useForm } from "@/hooks/useForm";
import { AdGroupCriterionResource } from "@/types";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";

interface CostPerClick {
  node: AdGroupCriterionResource;
  onCancel: (event: React.MouseEvent<HTMLElement>) => void;
  updateCostPerClick?: (
    node: AdGroupCriterionResource,
    cpc: number
  ) => Promise<void>;
  isLoading?: boolean;
  setNegativeStatus?: (value: React.SetStateAction<number>) => void;
}

export const UpdateCostPerClick = ({
  updateCostPerClick,
  node,
  onCancel,
  isLoading,
  setNegativeStatus,
}: CostPerClick) => {
  const { invalidateQuery } = useInvalidateQuery();
  const [formState, inputHandler, setFormData] = useForm(
    {
      cpc: {
        value: (node?.cpc_bid_micros / 1000000).toFixed(2) || 0,
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
          title="Set CpC bid"
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
              node,
              formState?.inputs?.cpc?.value as number
            ).then(() => setNegativeStatus?.(0));
            onCancel(event);
          }}
        >
          {isLoading ? <Skeleton sx={{ width: "100%" }} /> : "Save"}
        </Button>
      </Stack>
    </Box>
  );
};
