import React from "react";

import { CampaignType } from "@/components/CampaignOptionsBar/enums.campaignButtons";
import { Modal } from "@mui/material";

import { styledScroll } from "../GoogleAuthButton/AuthStyles";
import { CreateShoppingCampaigns } from "./CreateShoppingCampaigns";
import { StyledBoxContainer } from "./ModalStyles";

const CreateCampaignModal: React.FC<{
  open: boolean;
  openModal: () => void;
  campaignType: string | null;
}> = ({ open, openModal, campaignType }) => {
  return (
    <>
      <Modal open={open} onClose={openModal}>
        <StyledBoxContainer sx={{ ...styledScroll }}>
          {campaignType === CampaignType.SHOPPING && (
            <CreateShoppingCampaigns onClose={openModal} />
          )}
        </StyledBoxContainer>
      </Modal>
    </>
  );
};

export default CreateCampaignModal;
