import React from "react";

import { Button, Divider, Modal, Stack, Typography } from "@mui/material";

import { StyledBoxContainer } from "./ModalStyles";

interface SharedModal {
  open: boolean;
  onClose: () => void;
  text: string | React.JSX.Element;
  onConfirmAction: () => void;
}

export const SharedModal = ({
  open,
  onClose,
  text,
  onConfirmAction,
}: SharedModal) => {
  return (
    <>
      <Modal open={open} onClose={onClose}>
        <StyledBoxContainer width="300px" height="auto">
          <Stack direction="column">
            <Stack>
              <Typography variant="subtitle1" color="text.secondary">
                {text}
              </Typography>
            </Stack>
            <Divider flexItem sx={{ margin: "0.5rem 0" }} />
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              justifyContent="flex-end"
            >
              <Button variant="outlined" color="error" onClick={onClose}>
                Cancel
              </Button>
              <Button variant="contained" onClick={onConfirmAction}>
                Confirm
              </Button>
            </Stack>
          </Stack>
        </StyledBoxContainer>
      </Modal>
    </>
  );
};
