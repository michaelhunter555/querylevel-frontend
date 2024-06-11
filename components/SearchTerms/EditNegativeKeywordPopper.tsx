import React from "react";

import { useInvalidateQuery } from "@/hooks/invalidateQueries";
import { useGetShoppingSearchTerms } from "@/hooks/reports-hooks";
import { useForm } from "@/hooks/useForm";
import {
  NegativeCampaignCriterionKeywordView,
  NegativeKeywordView,
  PopperPlacement,
} from "@/types";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import Popper from "@mui/material/Popper";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Stack from "@mui/material/Stack";

import { TextFieldInput } from "../CreateCampaignSteps/CreateShoppingCampaign/TextFieldInputs";

interface EditNegativeKeywordPopperProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  id: string;
  placement: PopperPlacement;
  selectedKeyword: NegativeKeywordView | NegativeCampaignCriterionKeywordView;
  criterionId: number;
  onCancel: (event: React.MouseEvent<HTMLElement>) => void;
  keywordLevel: "CAMPAIGN" | "AD_GROUP";
}

const KeywordMatchType = {
  2: "EXACT",
  3: "PHRASE",
  4: "BROAD",
};

const reverseKeywordMatchType = {
  EXACT: 2,
  PHRASE: 3,
  BROAD: 4,
};

export const EditNegativeKeywordPopper = ({
  anchorEl,
  id,
  open,
  placement,
  selectedKeyword,
  onCancel,
  keywordLevel,
}: EditNegativeKeywordPopperProps) => {
  const {
    editNegativeAdGroupCriterionKeyword: editAdGroupCriterion,
    editNegativeCampaignCriterionKeyword: editCampaignCriterion,
    editNegativeKeywordLoading: editIsLoading,
  } = useGetShoppingSearchTerms();
  const { invalidateQuery } = useInvalidateQuery();
  const [formState, inputHandler, setFormData] = useForm(
    {
      editNegativeKeyword: {
        value: selectedKeyword?.keyword?.text,
        isValid: false,
      },
      matchType: {
        value:
          KeywordMatchType[
            selectedKeyword?.keyword
              ?.match_type as keyof typeof KeywordMatchType
          ],
        isValid: false,
      },
    },
    false
  );

  const matchTypes = ["EXACT", "PHRASE", "BROAD"];
  const hasText = formState?.inputs?.editNegativeKeyword?.value;

  const handleEditNegativeKeyword = async () => {
    if (keywordLevel === "CAMPAIGN") {
      //call campaign_criterion level function
      const campaignKeyword =
        selectedKeyword as NegativeCampaignCriterionKeywordView;
      const keywordData = {
        campaignId: campaignKeyword?.campaign?.id,
        criterionId: campaignKeyword?.criterion_id,
        newKeyword: formState?.inputs?.editNegativeKeyword?.value,
        newMatchType:
          reverseKeywordMatchType[
            formState?.inputs?.matchType
              ?.value as keyof typeof reverseKeywordMatchType
          ],
      };
      //console.log(keywordData);
      await editCampaignCriterion(keywordData);
    } else if (keywordLevel === "AD_GROUP") {
      // call ad_group_criterion level
      const adGroupKeyword = selectedKeyword as NegativeKeywordView;
      const keywordData = {
        adGroupId: adGroupKeyword?.ad_group?.id,
        criterionId: adGroupKeyword?.criterion_id,
        newKeyword: formState?.inputs?.editNegativeKeyword?.value,
        newMatchType:
          reverseKeywordMatchType[
            formState?.inputs?.matchType
              ?.value as keyof typeof reverseKeywordMatchType
          ],
      };
      // console.log(keywordData);
      await editAdGroupCriterion(keywordData);
    }
  };

  const handleCancel = (event: React.MouseEvent<HTMLElement>) => {
    onCancel(event);
    setFormData(
      {
        editNegativeKeyword: {
          value: selectedKeyword?.keyword?.text,
          isValid: false,
        },
        matchType: {
          value:
            KeywordMatchType[
              selectedKeyword?.keyword
                ?.match_type as keyof typeof KeywordMatchType
            ],
          isValid: false,
        },
      },
      false
    );
  };

  return (
    <Popper
      sx={{ zIndex: 10 }}
      id={id}
      anchorEl={anchorEl}
      open={open}
      placement={placement as PopperPlacement}
    >
      <Card sx={{ width: 250, padding: "1rem" }}>
        <Box>
          <Stack spacing={2}>
            <TextFieldInput
              id="editNegativeKeyword"
              name="editNegativeKeyword"
              type="text"
              defaultValue={
                formState?.inputs?.editNegativeKeyword?.value as string
              }
              inputHandler={inputHandler}
              hasAdornment={false}
              title="Edit Keyword"
            />

            <Select
              id="matchType"
              name="matchType"
              value={formState?.inputs?.matchType?.value as string}
              onChange={(event: SelectChangeEvent<string>) => {
                inputHandler(
                  "matchType",
                  event.target.value,
                  event.target.value !== ""
                );
              }}
            >
              {matchTypes.map((matchType) => (
                <MenuItem key={matchType} value={matchType}>
                  {matchType}
                </MenuItem>
              ))}
            </Select>
          </Stack>
          <Divider />
          <Stack direction="row" alignItems="center" justifyContent="flex-end">
            <Button
              onClick={(event: React.MouseEvent<HTMLElement>) => {
                handleCancel(event);
              }}
            >
              Cancel
            </Button>
            <Button
              disabled={!hasText}
              onClick={async (event: React.MouseEvent<HTMLElement>) => {
                await handleEditNegativeKeyword().then(() => {
                  handleCancel(event);
                  invalidateQuery("negativeKeywords");
                });
              }}
            >
              {editIsLoading ? "Updating..." : "Save"}
            </Button>
          </Stack>
        </Box>
      </Card>
    </Popper>
  );
};
