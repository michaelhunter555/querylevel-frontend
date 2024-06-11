import React from "react";

import { useInvalidateQuery } from "@/hooks/invalidateQueries";
import { useAccountSettings } from "@/hooks/useAccountSettings";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import LocalFloristIcon from "@mui/icons-material/LocalFlorist";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Modal from "@mui/material/Modal";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useQuery } from "@tanstack/react-query";

import { Content, PageContainer } from "../Footer/FooterStyles";
import { UserSettingsProps } from "../Signup/Plans";
import { StyledBoxContainer } from "./ModalStyles";

interface PricePreviewModal {
  open: boolean;
  onClose: () => void;
  planName: string;
  priceId: string;
  handleUpgradeSubscription: (
    priceId: string,
    planName: string
  ) => Promise<void>;
  isPostLoading: boolean;
  userSettings: UserSettingsProps;
  handleTogglePlan: () => void;
}

const PricePreviewModal = ({
  open,
  onClose,
  planName,
  priceId,
  handleUpgradeSubscription,
  isPostLoading,
  userSettings,
  handleTogglePlan,
}: PricePreviewModal) => {
  const { viewProrationUpgrade } = useAccountSettings();
  const { invalidateQuery } = useInvalidateQuery();

  const { data: prorationPreview, isLoading: loadingPreview } = useQuery({
    queryKey: ["prorationData", priceId],
    queryFn: () =>
      viewProrationUpgrade(
        priceId,
        userSettings?.stripeCustomerId as string,
        userSettings?.stripeSubscriptionId as string
      ),
    enabled: Boolean(
      priceId &&
        userSettings?.stripeCustomerId &&
        open &&
        userSettings?.stripeSubscriptionId
    ),
  });

  const plans = {
    pro: 39,
    growing: 19,
  };

  const buttonText =
    userSettings?.planType === "pro" && planName === "growing"
      ? "Downgrade to Growing"
      : userSettings?.planType === "growing" &&
        planName === "pro" &&
        "Upgrade to Pro";

  return (
    <Modal open={open} onClose={onClose}>
      <StyledBoxContainer height="auto" sx={{ width: { xs: "100%", md: 400 } }}>
        <PageContainer minHeight="90%">
          <Content sx={{ padding: "1rem" }}>
            {!loadingPreview && (
              <>
                <Typography color="text.secondary">
                  You are about to{" "}
                  {planName === "pro" ? "upgrade" : "downgrade"} to a{" "}
                  <b>{planName} </b>plan. You will be charged $
                  {(prorationPreview?.amount_due / 100).toFixed(2)} for the
                  difference at the start of the next billing date. This price
                  includes the plan fee for next month as well.
                </Typography>
                <Divider sx={{ margin: "0.5rem 0" }} />
                <List>
                  <ListItem>
                    <Typography color="text.secondary">
                      Unused time on curent plan: $
                      {(
                        prorationPreview?.lines?.data[0]?.amount / 100
                      )?.toFixed(2)}
                    </Typography>
                  </ListItem>
                  <ListItem>
                    <Typography color="text.secondary">
                      Time remaining on {planName}: $
                      {(
                        prorationPreview?.lines?.data[1]?.amount / 100
                      )?.toFixed(2)}
                    </Typography>
                  </ListItem>
                  <ListItem>
                    <Typography color="text.secondary">
                      Charge for next billing date: $
                      {(prorationPreview?.amount_due / 100).toFixed(2)}
                    </Typography>
                  </ListItem>
                  <ListItem>
                    <Typography color="text.secondary">
                      difference: $
                      {(
                        (prorationPreview?.amount_due / 100 -
                          plans[planName as keyof typeof plans]) as number
                      ).toFixed(2)}
                    </Typography>
                  </ListItem>
                </List>
              </>
            )}
            {loadingPreview && (
              <>
                <Skeleton width="100%" />
                <Skeleton width="80%" />
                <Skeleton width="80%" />
              </>
            )}
          </Content>
          <Typography color="text.secondary" variant="caption">
            By clicking {planName === "pro" ? "upgrade" : "downgrade"}, you
            approve this charge.
          </Typography>
          <Divider flexItem sx={{ margin: "0 0 1rem 0" }} />
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="flex-end"
            spacing={2}
          >
            <Button color="error" onClick={onClose}>
              Close
            </Button>

            <Button
              startIcon={
                planName === "pro" ? <EmojiEventsIcon /> : <LocalFloristIcon />
              }
              variant="outlined"
              onClick={async () => {
                await handleUpgradeSubscription(priceId, planName);
                //await invalidateQuery("userSettings");
                onClose();
                handleTogglePlan();
              }}
            >
              {isPostLoading ? "Updating Plan..." : buttonText}
            </Button>
          </Stack>
        </PageContainer>
      </StyledBoxContainer>
    </Modal>
  );
};
export default PricePreviewModal;
