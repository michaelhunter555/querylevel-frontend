import React, { useState } from "react";

import { useInvalidateQuery } from "@/hooks/invalidateQueries";
import { useAccountSettings } from "@/hooks/useAccountSettings";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import PricePreviewModal from "../Modal/PricePreviewModal";

interface SelectPlan {
  onSelectPlan: (val: PlanData) => void;
  selectedPlan: PlanData;
}
export type PlanData = {
  plan: string;
  cost: number | string;
  features?: string[];
  limitations?: string;
};

const tiers = [
  {
    id: "",
    title: "Free 7-day Trial",
    price: "0",
    description: [
      "Create 1 alpha/beta or three-tiered campaign",
      "Full App capabilities",
      "No card required - Create a tiered campaign and see if the app is a fit for your business",
    ],
    buttonText: "Try for free",
    buttonVariant: "outlined",
  },
  {
    id: "price_1PW8noP3CMhEecSyXbslSjWX",
    title: "Growing",
    subheader: "Recommended",
    price: "69",
    description: [
      "Centralized Shopping ads Experience",
      "10 alpha/beta or three-tiered campaigns per month",
      "Create unlimited invidual campaigns",
      "Priority email support",
      "Create Conversion Tags",
      "Manage Shopping Search Terms, add negative keywords, modify keywords (by type)",
      "Manage Geo-location",
      "Manage Inventory Filter",
      "Manage Ad Schedule",
      "Edit Settings",
    ],
    buttonText: "Get started",
    buttonVariant: "contained",
  },
  {
    id: "price_1PW8bfP3CMhEecSytNuKJkJp",
    title: "Pro",
    price: "89",
    description: [
      "All features of Growing",
      "15 alpha/beta or 3-tiered campaigns per month",
    ],
    buttonText: "Get started",
    buttonVariant: "outlined",
  },
];

interface UserPlanProps {
  hideButton?: boolean;
  userIsLoggedIn?: boolean;
  disableFree?: boolean;
  planType?: string;
  userSettings?: UserSettingsProps;
  handleTogglePlan?: () => void;
}

export type UserSettingsProps = {
  stripeCustomerId: string;
  accountActive: boolean;
  stripeSubscriptionId: string;
  planType: string;
};

const UserPlans = ({
  hideButton,
  userIsLoggedIn,
  disableFree,
  planType,
  userSettings,
  handleTogglePlan,
}: UserPlanProps) => {
  const [url, setUrl] = useState<string>("");
  const { invalidateQuery } = useInvalidateQuery();
  const { selectPaymentPlan, isPostLoading, upgradeSubscription } =
    useAccountSettings();
  const handlePlans = disableFree ? tiers?.slice(1) : tiers;
  const [selectedButton, setSelectedButton] = useState<number>(0);
  const [previewModal, setPreviewModal] = useState<{ [key: string]: boolean }>({
    growing: false,
    pro: false,
  });

  const handleSelectPaymentPlan = async (priceId: string, planName: string) => {
    const checkoutUrl = await selectPaymentPlan(
      priceId,
      planName,
      String(planType)
    );
    if (checkoutUrl) {
      setUrl(checkoutUrl);
    }
  };

  const handleSubscriptionChange = async (
    priceId: string,
    planName: string
  ) => {
    if (priceId && planName) {
      await upgradeSubscription(priceId, planName).then(() => {
        invalidateQuery("userSettings");
      });
    }
  };

  const handleUpdateModal = (planName: string) => {
    setPreviewModal((prev) => ({
      ...prev,
      [planName]: prev[planName] === true ? false : true,
    }));
  };

  return (
    <Container
      id="pricing"
      sx={{
        ...(!userIsLoggedIn
          ? {
              pt: { xs: 4, sm: 12 },
              pb: { xs: 8, sm: 16 },
            }
          : {}),
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: { xs: 3, sm: 6 },
      }}
    >
      <Box
        sx={{
          width: { sm: "100%", md: "60%" },
          textAlign: { sm: "left", md: "center" },
        }}
      >
        {!userIsLoggedIn && (
          <>
            <Typography component="h2" variant="h4" color="text.primary">
              Pricing
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Get 10x the value at the fraction of a cost. <br />
              Create, edit and manage your Shopping performance in all in one
              centralized experience.
            </Typography>
          </>
        )}
      </Box>
      <Grid
        container
        spacing={3}
        alignItems={!userIsLoggedIn ? "center" : "flex-start"}
        justifyContent="center"
      >
        {handlePlans?.map((tier, i) => (
          <Grid
            item
            key={tier.title.toLowerCase()}
            xs={12}
            sm={tier.title === "Enterprise" ? 12 : 6}
            md={4}
          >
            <PricePreviewModal
              open={previewModal[tier?.title?.toLowerCase()] === true}
              onClose={() => handleUpdateModal(tier?.title?.toLowerCase())}
              planName={tier?.title?.toLowerCase()}
              priceId={tier.id}
              isPostLoading={isPostLoading}
              handleUpgradeSubscription={handleSubscriptionChange}
              userSettings={userSettings as UserSettingsProps}
              handleTogglePlan={handleTogglePlan as () => void}
            />
            <Card
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                gap: 4,
                border: tier.title === "Professional" ? "1px solid" : undefined,
                borderColor:
                  tier.title === "Professional" ? "primary.main" : undefined,
                background:
                  tier.title === "Professional"
                    ? "linear-gradient(#6c2d65, #02283b)"
                    : undefined,
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    mb: 1,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    color: tier.title === "Professional" ? "grey.100" : "",
                  }}
                >
                  <Typography component="h3" variant="h6">
                    {tier.title}
                  </Typography>
                  {tier.title === "Professional" && (
                    <Chip
                      icon={<AutoAwesomeIcon />}
                      label={tier.subheader}
                      size="small"
                      sx={{
                        background: (theme) =>
                          theme.palette.mode === "light" ? "" : "none",
                        backgroundColor: "primary.contrastText",
                        "& .MuiChip-label": {
                          color: "primary.dark",
                        },
                        "& .MuiChip-icon": {
                          color: "primary.dark",
                        },
                      }}
                    />
                  )}
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "baseline",
                    color:
                      tier.title === "Professional" ? "grey.50" : undefined,
                  }}
                >
                  <Typography component="h3" variant="h2">
                    ${tier.price}
                  </Typography>
                  <Typography component="h3" variant="h6">
                    &nbsp; per Month
                  </Typography>
                </Box>
                <Divider
                  sx={{
                    my: 2,
                    opacity: 0.2,
                    borderColor: "grey.500",
                  }}
                />
                {tier.description.map((line) => (
                  <Box
                    key={line}
                    sx={{
                      py: 1,
                      display: "flex",
                      gap: 1.5,
                      alignItems: "center",
                    }}
                  >
                    <CheckCircleRoundedIcon
                      sx={{
                        width: 20,
                        color:
                          tier.title === "Professional"
                            ? "primary.light"
                            : "primary.main",
                      }}
                    />
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color:
                          tier.title === "Professional"
                            ? "grey.200"
                            : undefined,
                      }}
                    >
                      {line}
                    </Typography>
                  </Box>
                ))}
              </CardContent>
              {!hideButton && !url ? (
                <CardActions>
                  <Button
                    disabled={tier?.title?.toLowerCase() === planType}
                    onClick={() => {
                      setSelectedButton(i);
                      if (
                        userSettings?.stripeCustomerId && //has customer id already
                        userSettings?.stripeSubscriptionId && //has subscription id already
                        planType !== "canceled" && // not planType canceled or payAsYouGo
                        planType !== "payAsYouGo"
                      ) {
                        //pro or growing
                        handleUpdateModal(tier?.title?.toLowerCase());
                      } else {
                        handleSelectPaymentPlan(
                          tier?.id,
                          tier?.title?.toLowerCase()
                        );
                      }
                    }}
                    fullWidth
                    variant={tier.buttonVariant as "outlined" | "contained"}
                  >
                    {selectedButton === i && isPostLoading
                      ? "Loading..."
                      : tier?.title?.toLowerCase() === planType
                      ? "SELECTED"
                      : planType === "canceled" ||
                        planType === "free" ||
                        planType === "payAsYouGo"
                      ? tier?.buttonText
                      : planType !== tier?.title?.toLowerCase() &&
                        "Update Plan"}
                  </Button>
                </CardActions>
              ) : (
                ""
              )}

              {selectedButton === i && url && !hideButton && (
                <Button
                  href={url}
                  fullWidth
                  variant="contained"
                  color="primary"
                >
                  Go to Checkout
                </Button>
              )}
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default UserPlans;
