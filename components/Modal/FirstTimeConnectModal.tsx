import React from "react";

import { Content, PageContainer } from "@/components/Footer/FooterStyles";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";

import { StyledBoxContainer } from "./ModalStyles";

interface FirstTimeConnectProps {
  open: boolean;
  onClose: () => void;
}

const FirstTimeConnectModal = ({ open, onClose }: FirstTimeConnectProps) => {
  return (
    <Modal open={open} onClose={onClose}>
      <StyledBoxContainer
        sx={{
          width: { sm: "100%", md: "450px" },
          height: "auto",
          padding: "1.5rem",
        }}
      >
        <PageContainer minHeight="100%">
          <Content>
            <Typography variant="subtitle1" color="text.secondary">
              When you authorize Query Level, the app will be able to retrieve
              Google Shopping ads and Merchant center data related to the ads
              account associated with your Google gmail. This also enables you
              to create, view, update and delete according the features
              available. These permission can be easily revoked at anytime via
              your account settings (3rd party app permission)
              {String.fromCodePoint(0x1f60a)}.
            </Typography>
          </Content>
          <Divider flexItem sx={{ margin: "0.5rem 0" }} />
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-end",
            }}
          >
            <Button variant="outlined" onClick={onClose}>
              Close
            </Button>
          </Box>
        </PageContainer>
      </StyledBoxContainer>
    </Modal>
  );
};

export default FirstTimeConnectModal;

/**
 * After authorization, query level will attempt to retrieve your ads
              data behind the scenes. When you make your first connection,
              Google (Google Cloud Platform) might not have your ad account data
              readily available. GCP needs to create an instance to process your
              request and for subsequent requests made on your part. This
              initial process may take a few seconds, leading to a possibly
              observed delay for your first time. It should not occur after
 */
