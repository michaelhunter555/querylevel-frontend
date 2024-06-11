import React from "react";

import { useInvalidateQuery } from "@/hooks/invalidateQueries";
import { useAccountSettings } from "@/hooks/useAccountSettings";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { QueryObserverResult } from "@tanstack/react-query";

import { Content, PageContainer } from "../Footer/FooterStyles";
import { StyledBoxContainer } from "./ModalStyles";

interface DeletePlanProps {
  open: boolean;
  onClose: () => void;
  planName: string;
  subscriptionId: string;
  onDeleteSubscription: () => void;
  refetchSettings: () => Promise<QueryObserverResult>;
}

const DeletePlanModal = ({
  open,
  onClose,
  planName,
  subscriptionId,
  onDeleteSubscription,
  refetchSettings,
}: DeletePlanProps) => {
  const { deleteUserSubscription, isPostLoading, deleteMessage } =
    useAccountSettings();
  const { invalidateQuery } = useInvalidateQuery();
  return (
    <Modal open={open} onClose={onClose}>
      <StyledBoxContainer height="auto" sx={{ width: { xs: "100%", md: 400 } }}>
        <PageContainer minHeight="90%">
          <Content sx={{ padding: "1rem" }}>
            {!deleteMessage ? (
              <>
                <Typography color="text.secondary" variant="h5">
                  Delete Plan?
                </Typography>
                <Alert severity="warning">
                  Your tier campaign quota will become 0 after successful
                  cancellation
                </Alert>
                <Typography gutterBottom color="text.secondary">
                  You are about to delete your {planName} plan. You will still
                  have access to the application until your plan expiry period.
                  Once this period ends, you will need to re-subscribe in order
                  to access app features.
                </Typography>
              </>
            ) : (
              <Typography color="text.secondary">{deleteMessage}</Typography>
            )}
          </Content>
          <Divider flexItem sx={{ margin: "1rem 0" }} />
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="flex-end"
            spacing={2}
          >
            <Button
              onClick={async () => {
                onClose();
                onDeleteSubscription();
                //await refetchSettings();
              }}
            >
              Close
            </Button>
            {!deleteMessage && (
              <Button
                color="error"
                variant="outlined"
                onClick={async () => {
                  try {
                    await deleteUserSubscription(subscriptionId);
                    // await refetchSettings();
                    // invalidateQuery("userSettings"); //userSettings
                    // onClose();
                    // onDeleteSubscription();
                  } catch (err) {}
                }}
              >
                {isPostLoading ? "Deleting Plan..." : "Delete Plan"}
              </Button>
            )}
          </Stack>
        </PageContainer>
      </StyledBoxContainer>
    </Modal>
  );
};
export default DeletePlanModal;
