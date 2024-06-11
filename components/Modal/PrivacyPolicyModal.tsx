import React from "react";

import Modal from "@mui/material/Modal";

import PrivacyPolicy from "../Legal/PrivacyPolicy";
import { StyledBoxContainer } from "./ModalStyles";

interface PrivacyPolicyModal {
  open: boolean;
  onClose: () => void;
}

const PrivacyPolicyModal = ({ open, onClose }: PrivacyPolicyModal) => {
  return (
    <Modal open={open} onClose={onClose}>
      <StyledBoxContainer>
        <PrivacyPolicy />
      </StyledBoxContainer>
    </Modal>
  );
};

export default PrivacyPolicyModal;
