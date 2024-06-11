import React from "react";

import { useForm } from "@/hooks/useForm";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";

import { TextFieldInput } from "../../CreateCampaignSteps/CreateShoppingCampaign/TextFieldInputs";

interface UpdateAdGroupNameForm {
  adGroupName: string; //currentAdGroupName
  adGroupId: string | number;
  isLoading: boolean;
  onCancel: (event: React.MouseEvent<HTMLElement>) => void;
  updateNameHandler?: (name: string, id: number | string) => Promise<void>;
}

export const UpdateAdGroupName = ({
  adGroupName,
  adGroupId,
  isLoading,
  onCancel,
  updateNameHandler,
}: UpdateAdGroupNameForm) => {
  const [formState, inputHandler, setFormData] = useForm(
    {
      name: {
        value: adGroupName || "",
        isValid: false,
      },
    },
    false
  );

  return (
    <Box>
      <Stack>
        <TextFieldInput
          id="name"
          name="name"
          title="Edit Ad group name"
          defaultValue={formState?.inputs?.name?.value as string}
          type="string"
          hasAdornment={false}
          inputHandler={inputHandler}
        />
      </Stack>
      <Stack>
        <Button size="small" onClick={onCancel}>
          {isLoading ? <Skeleton sx={{ width: "100%" }} /> : "Cancel"}
        </Button>
        <Button
          disabled={!formState.isValid}
          size="small"
          onClick={async (event: React.MouseEvent<HTMLElement>) => {
            await updateNameHandler?.(
              formState?.inputs?.name?.value as string,
              adGroupId
            );
            onCancel(event);
          }}
        >
          {isLoading ? <Skeleton sx={{ width: "100%" }} /> : "Save"}
        </Button>
      </Stack>
    </Box>
  );
};
