import { useState } from "react";

import { useSession } from "next-auth/react";

import NavAppBar from "@/components/DashboardHome/AppNavBar";
import FAQ from "@/components/DashboardHome/Faqs";
import { Features } from "@/components/DashboardHome/Features";
import Highlights from "@/components/DashboardHome/Highlights";
import HomePageFooter from "@/components/DashboardHome/HomePageFooter";
import getLPTheme from "@/components/DashboardHome/HompePageTheme";
import OneTimePayments from "@/components/DashboardHome/OneTimePayments";
import { SignInWithGoogle } from "@/components/Signup/GoogleSignUp";
import UserPlans, { PlanData } from "@/components/Signup/Plans";
import { PaletteMode } from "@mui/material";
import Box from "@mui/material/Box";
import CardMedia from "@mui/material/CardMedia";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

import {
  CampaignFeaturesTables,
  StructuredCampaignFeatures,
} from "../components/DashboardHome/StructuredCampaignFeatures";

const imgStyle = {
  borderRadius: "15px",
  width: "70%",
  boxShadow:
    "0 0 20px rgba(2, 31, 59, 0.7),1px 1.5px 2px -1px rgba(2, 31, 59, 0.65),4px 4px 12px -2.5px rgba(2, 31, 59, 0.65)",
};

export default function Home() {
  const { data: session } = useSession();
  const userTheme = session?.user?.theme as PaletteMode;
  const [mode, setMode] = useState<PaletteMode>(userTheme || "dark");
  const customTheme = createTheme(getLPTheme(mode));
  const defaultTheme = createTheme({ palette: { mode } });
  const [plan, setPlan] = useState<PlanData | null>(null);
  //console.log(session);

  const selectPlan = (val: PlanData) => {
    setPlan(val);
  };

  const handleToggleTheme = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeProvider theme={customTheme}>
      <CssBaseline />

      <NavAppBar mode={mode} toggleColorMode={handleToggleTheme} />
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={5}
        sx={{
          margin: { xs: "8rem auto", md: "10rem auto" },
          width: "100% !important",
          gap: "10px",
        }}
      >
        <Grid
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "1rem",
            }}
          >
            <Typography
              color="text.secondary"
              component="h2"
              variant="h4"
              align="center"
            >
              Because Structure{" "}
              <Typography
                component="span"
                variant="h3"
                style={{ color: "#0959aa" }}
              >
                {" "}
                Matters.
              </Typography>
            </Typography>
            <Typography gutterBottom color="text.secondary" align="center">
              Create complex campaigns designed to increase conversions and
              improve CPA in just a few clicks.
            </Typography>
            <Divider sx={{ width: "100%" }} />
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="center"
              spacing={2}
              sx={{ margin: "1rem 0" }}
            >
              <SignInWithGoogle />
            </Stack>
          </Box>
        </Grid>

        <Grid>
          <Stack
            direction="column"
            alignItems="center"
            spacing={2}
            sx={{ overFlow: "hidden", padding: { xs: "0.5rem", md: 0 } }}
          >
            <CardMedia
              component="img"
              src={`/create-tiers-${mode}.svg`}
              alt="tiered-campaigns"
              sx={{
                ...imgStyle,
                border:
                  mode === "light" ? "1px solid #888" : "1px solid #f7f7f7",
              }}
            />
          </Stack>
        </Grid>
      </Grid>

      <Divider flexItem />

      <Features mode={mode} />

      <Highlights />

      <Divider flexItem sx={{ marginBottom: "5rem" }} />

      <StructuredCampaignFeatures
        userTheme={session?.user?.theme as PaletteMode}
      />
      <CampaignFeaturesTables />

      <Divider flexItem sx={{ margin: "5rem auto" }} />

      <UserPlans hideButton={true} />

      <OneTimePayments />
      <FAQ />

      <Divider />
      <HomePageFooter mode={mode} />
    </ThemeProvider>
  );
}
