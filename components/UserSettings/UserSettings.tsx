import React, { useEffect, useState } from "react";

import { signOut, useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { FcGoogle } from "react-icons/fc";

import { useAccountSettings } from "@/hooks/useAccountSettings";
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
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [togglePlan, setTogglePlan] = useState<boolean>(false);
  const [toggleFaqs, setToggleFaqs] = useState<boolean>(false);
  const { getAccountSettings } = useAccountSettings();
  const { data: session } = useSession();
  const userId = session?.user?._id;

  const {
    data: userSettings,
    isLoading,
    refetch: refetchSettings,
  } = useQuery({
    queryKey: ["userSettings", userId],
    queryFn: () => getAccountSettings(),
    enabled: Boolean(userId),
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

  const shouldDisableFreePlan =
    userSettings?.planType === "free" ||
    userSettings?.planType === "growing" ||
    userSettings?.planType === "pro" ||
    userSettings?.planType === "canceled";

  const canCancel =
    userSettings?.planType === "growing" || userSettings?.planType === "pro";

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
          justifyContent: "space-between",
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          {togglePlan && (
            <Typography color="text.secondary" variant="subtitle2">
              Your{" "}
              {userSettings?.planType === "canceled"
                ? "account access end"
                : "next billing"}{" "}
              date will be {userSettings?.nextBillingDate?.split("T")[0]}
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

          {togglePlan && canCancel && (
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

          {!isLoading && userSettings?.planType === "free" && (
            <Alert action={<Button>Close</Button>} severity="info">
              Your plan will end on{" "}
              {userSettings?.nextBillingDate?.split("T")[0]} Get $10 off your
              first month when selecting a plan before the expiry date.
            </Alert>
          )}
        </Stack>
        <Stack>
          <Chip
            icon={<FcGoogle size={20} />}
            variant="outlined"
            label="| Log out"
            component={Button}
            onClick={handleSignOut}
          />
        </Stack>
      </Paper>
      <Box sx={{ marginTop: "1rem" }}>
        {toggleFaqs && (
          <Box sx={{ margin: "1rem 0" }}>
            <BillingFaqs />
          </Box>
        )}
        {userSettings?.stripeCustomerId &&
          userSettings?.planType === "canceled" && (
            <Alert
              severity="warning"
              variant="outlined"
              action={<code>code: oneMoreTry</code>}
            >
              After your plan expires you won't be able to access app features.
              Give us another try and get $5 off your next month.
            </Alert>
          )}
        {!isLoading && userSettings && !togglePlan && (
          <Stack>
            <ActiveSettingsTable user={userSettings} />

            {userSettings?.charges?.data?.length > 0 ? (
              <BillingHistoryTable charges={userSettings?.charges?.data} />
            ) : (
              <Typography color="text.secondary">
                No billing history available yet.
              </Typography>
            )}
          </Stack>
        )}
        {isLoading && <CircularProgress />}
        {/* userSettings.charges.data */}
        {togglePlan && (
          <UserPlans
            userSettings={userSettings}
            hideButton={false}
            userIsLoggedIn={Boolean(userId)}
            disableFree={shouldDisableFreePlan}
            planType={userSettings?.planType}
            handleTogglePlan={handleTogglePlan}
          />
        )}
      </Box>
    </Box>
  );
};

export default UserSettings;
