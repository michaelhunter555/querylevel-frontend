import React from "react";

import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";

import { StyledBoxContainer } from "./ModalStyles";

interface Modal {
  open: boolean;
  onClose: () => void;
  error: string;
}

const ErrorModal: React.FC<Modal> = ({ open, onClose, error }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <StyledBoxContainer>
        <Typography>{error}</Typography>
      </StyledBoxContainer>
    </Modal>
  );
};

export default ErrorModal;
