import React, { useState } from "react";

import { useInvalidateQuery } from "@/hooks/invalidateQueries";
import { useGetShoppingSearchTerms } from "@/hooks/reports-hooks";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import Modal from "@mui/material/Modal";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { Content, PageContainer } from "../Footer/FooterStyles";
import { StyledBoxContainer } from "../Modal/ModalStyles";

interface BulkMatchModalProps {
  open: boolean;
  onClose: () => void;
  keywords: { [key: string]: boolean };
  onRowSelection: (
    row: React.SetStateAction<{ [key: string]: boolean }>
  ) => void;
  keywordLevel: "CAMPAIGN" | "AD_GROUP";
}

const keywordMatchTypes = {
  2: "EXACT",
  3: "PHRASE",
  4: "BROAD",
};

export const BulkMatchTypeModal = ({
  open,
  onClose,
  keywords,
  onRowSelection,
  keywordLevel,
}: BulkMatchModalProps) => {
  const [matchType, setMatchType] = useState<string>("2");
  const { invalidateQuery } = useInvalidateQuery();
  const {
    bulkUpdateCampaignCriterionKeywordMatchType: bulkUpdateCampaignCriterion,
    bulkUpdateAdGroupCriterionKeywordMatchType: bulkUpdateAdGroupCriterion,
    bulkUpdateMatchTypeIsLoading: bulkUpdateIsLoading,
  } = useGetShoppingSearchTerms();

  const handleUpdateMatchType = (event: SelectChangeEvent<string>) => {
    setMatchType(event.target.value);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <StyledBoxContainer sx={{ maxHeight: 175, maxWidth: 300 }}>
        <PageContainer minHeight="90%">
          <Content>
            {!bulkUpdateIsLoading ? (
              <>
                <Typography color="text.secondary" variant="subtitle2">
                  Update Match Type for selected Keywords
                </Typography>

                <Select
                  fullWidth
                  id="updateKeywords"
                  name="updateKeywords"
                  value={matchType}
                  onChange={handleUpdateMatchType}
                >
                  {Object.entries(keywordMatchTypes).map(([key, value]) => (
                    <MenuItem key={key} value={key}>
                      {value}
                    </MenuItem>
                  ))}
                </Select>
              </>
            ) : (
              <>
                <Skeleton sx={{ width: "100%" }} />
                <Skeleton sx={{ width: "80%" }} />
                <Skeleton sx={{ width: "80%" }} />
              </>
            )}
          </Content>
          <Divider sx={{ margin: "0.5rem 0" }} />
          <Stack
            direction="row"
            alignItems="center"
            spacing={2}
            justifyContent="flex-end"
          >
            <Button
              onClick={() => {
                onClose();
                setMatchType("2");
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={async () => {
                //console.log(keywords, matchType);
                if (keywordLevel === "CAMPAIGN") {
                  await bulkUpdateCampaignCriterion(
                    keywords,
                    Number(matchType)
                  ).then(async () => {
                    onRowSelection({});
                    onClose();
                    await invalidateQuery("negativeKeywords");
                  });
                } else if (keywordLevel === "AD_GROUP") {
                  await bulkUpdateAdGroupCriterion(
                    keywords,
                    Number(matchType)
                  ).then(async () => {
                    onRowSelection({});
                    onClose();
                    await invalidateQuery("negativeKeywords");
                  });
                }
              }}
            >
              Save
            </Button>
          </Stack>
        </PageContainer>
      </StyledBoxContainer>
    </Modal>
  );
};
