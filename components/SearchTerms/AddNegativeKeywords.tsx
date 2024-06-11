import React, { useState } from "react";

import { useInvalidateQuery } from "@/hooks/invalidateQueries";
import { useGetShoppingSearchTerms } from "@/hooks/reports-hooks";
import EditIcon from "@mui/icons-material/Edit";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import Modal from "@mui/material/Modal";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { Content, PageContainer } from "../Footer/FooterStyles";
import { StyledBoxContainer } from "../Modal/ModalStyles";

interface AddNegativeKeywords {
  open: boolean;
  onClose: () => void;
  adGroup?: { id: number; name: string; campaign: string }[];
  campaign?: { id: number; name: string }[];
  keywordLevel: "CAMPAIGN" | "AD_GROUP";
}

export const AddNegativeKeywordsModal = ({
  keywordLevel,
  campaign,
  adGroup,
  open,
  onClose,
}: AddNegativeKeywords) => {
  const [negativeKeywords, setNegativeKeywords] = useState<string[]>([]);
  const [selectedAdGroup, setSelectedAdGroup] = useState<{
    name: string;
    id: number;
  }>({ name: adGroup?.[0]?.name as string, id: adGroup?.[0]?.id as number });
  const [changeAdGroup, setChangeAdGroup] = useState<boolean>(false);
  const {
    manuallyAddNegativeKeyword: addCampaignLevelKeyword,
    manuallyAddAdGroupNegativeKeyword: addAdGroupLevelKeyword,
    isManuallyAddingKeyword,
  } = useGetShoppingSearchTerms();
  const { invalidateQuery } = useInvalidateQuery();

  const handleAddNegativeKeyword = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const inputKeywords = event.target.value
      .trim()
      ?.split(",")
      ?.map((keyword) => keyword);

    setNegativeKeywords(inputKeywords);
  };

  const handleChangeAdGroup = () => {
    setChangeAdGroup((prev) => !prev);
  };

  const handleSelectChange = (event: SelectChangeEvent<number>) => {
    const selectedId = event.target.value as number;
    const findAdGroup = adGroup?.find((ag) => ag.id === selectedId);
    setSelectedAdGroup({
      name: findAdGroup?.name as string,
      id: findAdGroup?.id as number,
    });
    setChangeAdGroup((prev) => !prev);
  };

  const handleSubmitNegativeKeywords = async (event: any) => {
    event.preventDefault();

    if (keywordLevel === "CAMPAIGN") {
      await addCampaignLevelKeyword(
        { name: campaign?.[0].name as string, id: campaign?.[0].id as number },
        negativeKeywords
      );
    } else if (keywordLevel === "AD_GROUP") {
      await addAdGroupLevelKeyword(selectedAdGroup, negativeKeywords);
    }
    if (!isManuallyAddingKeyword) {
      onClose();
      invalidateQuery("negativeKeywords");
      setNegativeKeywords([]);
    }
  };

  return (
    <Modal
      open={open}
      onClose={() => {
        setNegativeKeywords([]);
        onClose();
      }}
    >
      <StyledBoxContainer width="40%" height="auto">
        <PageContainer minHeight="90%">
          <Content>
            <Stack spacing={2} sx={{ margin: "1rem 0" }}>
              {keywordLevel === "CAMPAIGN" && (
                <>
                  <Typography color="text.secondary" variant="h6">
                    Campaign: {campaign?.[0]?.name}
                  </Typography>
                </>
              )}
              <Stack>
                {keywordLevel === "AD_GROUP" && changeAdGroup ? (
                  <Select
                    value={selectedAdGroup.id}
                    onChange={handleSelectChange}
                  >
                    {adGroup?.map((val) => (
                      <MenuItem key={val?.id} value={val?.id}>
                        {val?.name}
                      </MenuItem>
                    ))}
                  </Select>
                ) : (
                  keywordLevel === "AD_GROUP" && (
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Stack>
                        <Typography color="text.secondary">
                          Ad Group:
                        </Typography>
                      </Stack>
                      <Stack>
                        <Button
                          onClick={handleChangeAdGroup}
                          endIcon={<EditIcon />}
                        >
                          {selectedAdGroup.name}
                        </Button>
                      </Stack>
                    </Stack>
                  )
                )}
              </Stack>
              <Stack spacing={2}>
                <Typography color="text.secondary">
                  Add Negative Keywords
                </Typography>
                <Alert severity="info">
                  Separate each keyword by comma - Match Types - "Phrase" -
                  [exact] - broad (max: 1000 per operation)
                </Alert>
                <form onSubmit={handleSubmitNegativeKeywords}>
                  <TextField
                    fullWidth
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      handleAddNegativeKeyword(event);
                    }}
                    multiline
                    rows={9}
                    helperText="i.e. 'used', 'refurbished', [installation guide]"
                  />
                  <Divider sx={{ margin: "0.5rem 0" }} />
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="flex-end"
                    spacing={2}
                  >
                    <Button
                      onClick={() => {
                        onClose();
                        setNegativeKeywords([]);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      disabled={negativeKeywords.length === 0}
                      type="submit"
                    >
                      {isManuallyAddingKeyword ? "Creating..." : "Submit"}
                    </Button>
                  </Stack>
                </form>
              </Stack>
            </Stack>
          </Content>
        </PageContainer>
      </StyledBoxContainer>
    </Modal>
  );
};
