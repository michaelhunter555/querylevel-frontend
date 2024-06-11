import React, { useEffect } from "react";

import { useInvalidateQuery } from "@/hooks/invalidateQueries";
import { useForm } from "@/hooks/useForm";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";

import { TextFieldInput } from "../CreateCampaignSteps/CreateShoppingCampaign/TextFieldInputs";

interface CreateAdGroupFormProps {
  campaignResource: string;
  createAdGroup?: (adGroup: {
    [key: string]: string | number;
  }) => Promise<void>;
  createAdGroupIsLoading: boolean;
  onCancel: (event: React.MouseEvent<HTMLElement>) => void;
}

export const CreateAdGroupForm = ({
  campaignResource,
  createAdGroup,
  createAdGroupIsLoading,
  onCancel,
}: CreateAdGroupFormProps) => {
  const { invalidateQuery } = useInvalidateQuery();
  const [formState, inputHandler, setFormData] = useForm(
    {
      name: {
        value: "",
        isValid: false,
      },
      adGroupCpcBid: {
        value: 0,
        isValid: false,
      },
    },
    false
  );

  useEffect(() => {
    if (
      formState?.inputs?.name?.value &&
      formState?.inputs?.adGroupCpcBid?.value &&
      formState?.isValid
    ) {
      setFormData(
        {
          name: {
            value: formState?.inputs?.name?.value,
            isValid: true,
          },
          adGroupCpcBid: {
            value: formState?.inputs?.adGroupCpcBid?.value,
            isValid: true,
          },
        },
        true
      );
    }
  }, [formState?.inputs?.name?.value, formState?.inputs?.adGroupCpcBid?.value]);

  const createAdGroupObject = {
    name: formState?.inputs?.name?.value?.toString() as string,
    adGroupCpcBid: Number(formState?.inputs?.adGroupCpcBid?.value) as number,
    campaignResource: campaignResource,
  };

  const handleCreateAdGroupRequest = async () => {
    await createAdGroup?.(createAdGroupObject).then(async () => {
      await invalidateQuery("adGroups");
    });
  };

  return (
    <Box>
      <Stack sx={{ padding: "5px" }}>
        <TextFieldInput
          id="name"
          name="name"
          type="text"
          title="New ad group name"
          defaultValue={formState?.inputs?.name?.value as string}
          inputHandler={inputHandler}
          hasAdornment={false}
        />
      </Stack>
      <Stack sx={{ padding: "5px" }}>
        <TextFieldInput
          id="adGroupCpcBid"
          name="adGroupCpcBid"
          type="number"
          title="Set cpc bid"
          defaultValue={formState?.inputs?.adGroupCpcBid?.value as number}
          inputHandler={inputHandler}
          hasAdornment={true}
        />
      </Stack>

      <Stack direction="row" alignItems="center" spacing={2}>
        <Button onClick={onCancel}>
          {createAdGroupIsLoading ? (
            <Skeleton sx={{ width: "100%" }} />
          ) : (
            "Cancel"
          )}
        </Button>
        <Button
          disabled={!formState.isValid}
          onClick={async (event: React.MouseEvent<HTMLElement>) => {
            await handleCreateAdGroupRequest();
            onCancel(event);
          }}
        >
          {createAdGroupIsLoading ? (
            <Skeleton sx={{ width: "100%" }} />
          ) : (
            "Save"
          )}
        </Button>
      </Stack>
    </Box>
  );
};
