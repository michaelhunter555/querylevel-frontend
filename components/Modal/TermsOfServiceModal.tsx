import React from "react";

import Modal from "@mui/material/Modal";

import TermsOfService from "../Legal/TermsOfService";
import { StyledBoxContainer } from "./ModalStyles";

interface PrivacyPolicyModal {
  open: boolean;
  onClose: () => void;
}

const TermsOfServiceModal = ({ open, onClose }: PrivacyPolicyModal) => {
  return (
    <Modal open={open} onClose={onClose}>
      <StyledBoxContainer>
        <TermsOfService />
      </StyledBoxContainer>
    </Modal>
  );
};

export default TermsOfServiceModal;
