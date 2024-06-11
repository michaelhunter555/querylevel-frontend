import React from "react";

import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";

import { Content, PageContainer } from "../Footer/FooterStyles";
import { StyledBoxContainer } from "../Modal/ModalStyles";

interface AddNegativeKeywordSuccess {
  open: boolean;
  handleModalSuccess: () => void;
  messageResponse: string;
}

export const AddNegativeKeywordSuccessModal = ({
  open,
  handleModalSuccess,
  messageResponse,
}: AddNegativeKeywordSuccess) => {
  return (
    <Modal open={open} onClose={handleModalSuccess}>
      <StyledBoxContainer sx={{ maxHeight: 100, maxWidth: 300 }}>
        <PageContainer minHeight="90%">
          <Content>
            <Typography color="text.secondary" variant="subtitle1">
              {messageResponse}
            </Typography>
          </Content>
          <Divider flexItem />

          <Button onClick={handleModalSuccess}>Close</Button>
        </PageContainer>
      </StyledBoxContainer>
    </Modal>
  );
};
