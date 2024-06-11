import React from "react";

import { CampaignType } from "@/components/CampaignOptionsBar/enums.campaignButtons";
import { Modal } from "@mui/material";

import { styledScroll } from "../GoogleAuthButton/AuthStyles";
import { CreateLocalInventoryCampaign } from "./CreateLocalInventoryAd";
import { CreateRemarketingCampaign } from "./CreateRemarketingCampaign";
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
          {campaignType === CampaignType.LOCAL_SHOPPING && (
            <CreateLocalInventoryCampaign />
          )}
          {campaignType === CampaignType.REMARKET && (
            <CreateRemarketingCampaign />
          )}
        </StyledBoxContainer>
      </Modal>
    </>
  );
};

export default CreateCampaignModal;
