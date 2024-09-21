import React, { useEffect, useState } from "react";

import { signOut, useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { FcGoogle } from "react-icons/fc";

import { useAccountSettings } from "@/hooks/useAccountSettings";
import { useMediaQuery, useTheme } from "@mui/material";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useQuery } from "@tanstack/react-query";

import { StyledFadeIn } from "../Shared/StyledFadeInComponents";
import { PlanTypes } from "./enums.plans";
import PayAsYouGoOption from "./PayAsYouGo";

const DeletePlanModal = dynamic(() => import("../Modal/DeletePlanModal"), {
  ssr: false,
});
const UserPlans = dynamic(() => import("../Signup/Plans"), { ssr: false });
const ActiveSettingsTable = dynamic(() => import("./ActiveSettingsTable"), {
  ssr: false,
});
const BillingFaqs = dynamic(() => import("./BillingFaqs"), { ssr: false });
const BillingHistoryTable = dynamic(() => import("./BillingHistoryTable"), {
  ssr: false,
});

const UserSettings = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [togglePlan, setTogglePlan] = useState<boolean>(false);
  const [toggleFaqs, setToggleFaqs] = useState<boolean>(false);
  const { getAccountSettings } = useAccountSettings();
  const { data: session, status } = useSession();
  const userId = session?.user?._id;

  //fetches account settings
  const {
    data: userSettings,
    isLoading,
    refetch: refetchSettings,
  } = useQuery({
    queryKey: ["userSettings", userId],
    queryFn: () => getAccountSettings(),
    enabled: Boolean(userId && status !== "loading"),
    staleTime: Infinity,
  });

  useEffect(() => {
    const timer = setTimeout(() => refetchSettings(), 2000);
    return () => clearTimeout(timer);
  }, [session?.user?.planType]);

  const handleTogglePlan = () => {
    setTogglePlan((prev) => !prev);
  };

  const handleDeleteModalToggle = () => {
    setOpenDeleteModal((prev) => !prev);
  };

  const handleToggleFaqs = () => {
    setToggleFaqs((prev) => !prev);
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: "/user-dashboard" });
    localStorage.removeItem("brand");
    localStorage.removeItem("campaign");
  };

  //don't free plan option
  const shouldDisableFreePlan =
    userSettings?.planType === PlanTypes.FREE ||
    userSettings?.planType === PlanTypes.GROWING ||
    userSettings?.planType === PlanTypes.PRO ||
    userSettings?.planType === PlanTypes.CANCELED ||
    userSettings?.planType === PlanTypes.PAY_AS_YOU_GO;

  //display cancel button if subscribed
  const canCancel =
    userSettings?.planType === PlanTypes.GROWING ||
    userSettings?.planType === PlanTypes.PRO;

  const invalidateBilling = userSettings?.planType === PlanTypes.PAY_AS_YOU_GO;

  const checkDateForPlan = () => {
    //if user is Pay as go, they can be skipped. Otherwise, check.
    if (userSettings?.planType !== PlanTypes.PAY_AS_YOU_GO) {
      const today = new Date().getTime();
      const planExpireDate = new Date(
        String(userSettings?.nextBillingDate)
      ).getTime();
      return planExpireDate > today;
    }
    return true;
  };

  //check if the plan is expired to determine text display
  const planIsNotExpired = checkDateForPlan();

  return (
    <Box sx={{ width: "100%", marginTop: "3rem" }}>
      <DeletePlanModal
        open={openDeleteModal}
        onClose={handleDeleteModalToggle}
        planName={userSettings?.planType}
        subscriptionId={userSettings?.stripeSubscriptionId}
        onDeleteSubscription={handleTogglePlan}
        refetchSettings={refetchSettings}
      />
      <Paper
        sx={{
          padding: "2rem",
          display: "flex",
          flexDirection: { xs: "column", md: "row", gap: 5 },

          justifyContent: "space-between",
        }}
      >
        <Stack
          sx={{
            flexDirection: { xs: "column", md: "row" },
            gap: 2,
            alignItems: "center",
          }}
        >
          {togglePlan && (
            <Typography color="text.secondary" variant="subtitle2">
              Your{" "}
              {userSettings?.planType === PlanTypes.CANCELED
                ? "account access end"
                : "next billing"}{" "}
              date will be:{" "}
              {invalidateBilling
                ? "No Billing"
                : userSettings?.nextBillingDate?.split("T")[0]}
            </Typography>
          )}
          <Chip
            variant="outlined"
            label={!togglePlan ? "Manage Subscription" : "Go back"}
            component={Button}
            onClick={handleTogglePlan}
          />

          <Chip
            label={toggleFaqs ? "hide FAQS" : "FAQS"}
            component={Button}
            onClick={handleToggleFaqs}
          />

          {togglePlan && canCancel && !isMobile && (
            <>
              <Divider orientation="vertical" flexItem />
              <Chip
                variant="outlined"
                color="error"
                component={Button}
                onClick={handleDeleteModalToggle}
                label="Cancel Subscription"
              />
            </>
          )}

          {!isLoading && userSettings?.planType === PlanTypes.FREE && (
            <Alert severity={planIsNotExpired ? "info" : "warning"}>
              Your plan {planIsNotExpired ? "will end" : "ended"} on{" "}
              {userSettings?.nextBillingDate?.split("T")[0]}. Get $10 off your
              first month when selecting your first plan *Applies for
              subscriptions.
            </Alert>
          )}
        </Stack>
        {!isMobile && (
          <Stack>
            <Chip
              icon={<FcGoogle size={20} />}
              variant="outlined"
              label="| Log out"
              component={Button}
              onClick={handleSignOut}
            />
          </Stack>
        )}
      </Paper>
      <Box sx={{ marginTop: "1rem" }}>
        {toggleFaqs && (
          <Box sx={{ margin: "1rem 0" }}>
            <BillingFaqs />
          </Box>
        )}
        {userSettings?.stripeCustomerId &&
          userSettings?.planType === "canceled" && (
            <Alert severity="warning" variant="outlined">
              After your plan expires you won't be able to access app features.
            </Alert>
          )}
        {!isLoading && userSettings && !togglePlan && (
          <Stack>
            <StyledFadeIn visible={true} delay={0.1}>
              <ActiveSettingsTable user={userSettings} />

              <BillingHistoryTable
                stripeCustomerId={userSettings?.stripeCustomerId}
              />
            </StyledFadeIn>
          </Stack>
        )}
        {isLoading && <CircularProgress />}
        <Stack
          sx={{ display: "flex", flexDirection: { xs: "column", md: "row" } }}
        >
          {togglePlan && (
            <Box sx={{ maxWidth: { xs: "100%", md: "30%" } }}>
              <Typography align="center" variant="h4" color="text.secondary">
                One Time Purchase
              </Typography>
              <Typography align="center" color="text.secondary" gutterBottom>
                Only create tiered Campaigns or add monthly quota
              </Typography>

              <PayAsYouGoOption />
            </Box>
          )}
          {togglePlan && (
            <Divider orientation="vertical" flexItem sx={{ margin: "1rem" }} />
          )}

          {togglePlan && (
            <Stack>
              <Typography align="center" variant="h4" color="text.secondary">
                Subscription Models
              </Typography>
              <Typography align="center" color="text.secondary" gutterBottom>
                Access Full App Features
              </Typography>
              <UserPlans
                userSettings={userSettings}
                hideButton={false}
                userIsLoggedIn={Boolean(userId)}
                disableFree={shouldDisableFreePlan}
                planType={userSettings?.planType}
                handleTogglePlan={handleTogglePlan}
              />
              {isMobile && (
                <Stack
                  sx={{ marginTop: "2rem", gap: 2, flexDirection: "column" }}
                >
                  <Stack>
                    <Chip
                      icon={<FcGoogle size={20} />}
                      variant="outlined"
                      label="| Log out"
                      component={Button}
                      onClick={handleSignOut}
                    />
                  </Stack>
                  {togglePlan && canCancel && isMobile && (
                    <>
                      <Divider orientation="vertical" flexItem />
                      <Chip
                        variant="outlined"
                        color="error"
                        component={Button}
                        onClick={handleDeleteModalToggle}
                        label="Cancel Subscription"
                      />
                    </>
                  )}
                </Stack>
              )}
            </Stack>
          )}
        </Stack>
      </Box>
    </Box>
  );
};

export default UserSettings;
