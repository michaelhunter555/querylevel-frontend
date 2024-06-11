import React from "react";

import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { Content, PageContainer } from "../Footer/FooterStyles";
import { StyledBoxContainer } from "./ModalStyles";

interface SuccessModalProps {
  open: boolean;
  onClose: () => void;
  message: string;
  error: boolean;
  success: boolean;
  errorMessage: string;
}

function SuccessModal({
  open,
  onClose,
  message,
  errorMessage,
  error,
  success,
}: SuccessModalProps) {
  return (
    <Modal open={open} onClose={onClose}>
      <StyledBoxContainer sx={{ height: "auto", maxWidth: 300 }}>
        <PageContainer minHeight="90%">
          <Content>
            <Stack alignItems="center" spacing={2}>
              <Typography variant="subtitle1" color="text.secondary">
                {success && message}
                {error && errorMessage}
              </Typography>
            </Stack>
          </Content>
          <Divider />
          <Button onClick={onClose}>close</Button>
        </PageContainer>
      </StyledBoxContainer>
    </Modal>
  );
}

export default SuccessModal;
