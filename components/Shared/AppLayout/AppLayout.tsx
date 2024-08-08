import React, { ReactNode, useContext, useEffect, useState } from "react";

import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

import { Content, PageContainer } from "@/components/Footer/FooterStyles";
import PrivacyPolicyModal from "@/components/Modal/PrivacyPolicyModal";
import TermsOfServiceModal from "@/components/Modal/TermsOfServiceModal";
import SidebarMenu from "@/components/SidebarMenu/SidebarMenu";
import { PlanTypes } from "@/components/UserSettings/enums.plans";
import { AuthContext } from "@/context/auth-context";
import { AuthActionTypes } from "@/context/authActions";
import { userCanAccessApp } from "@/util/helpers/confirmUserPrivelages";
import { selectPalette } from "@/util/siteTheme/selectPalette";
import { createTheme, ThemeProvider } from "@mui/material";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";

import { GlobalStyles } from "../../../styles/GlobalStyles";

interface LayoutProps {
  children: ReactNode;
}
const acceptableRoutes = [
  "/user-dashboard",
  "/manage-subscription",
  "/create-tiered-campaigns",
  "/contact-us",
  "/",
];
const AppLayout = ({ children }: LayoutProps) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const themePreference = session?.user?.theme || "light";
  const defaultTheme = selectPalette(themePreference);
  const themeModeSwitch = createTheme(defaultTheme);
  const authContext = useContext(AuthContext);
  const [openPrivacyPolicy, setOpenPrivacyPolicy] = useState(false);
  const [openTerms, setOpenTerms] = useState(false);
  //const [component, setComponent] = useState("authenticate"); //billing
  const canAccess = userCanAccessApp(session);
  const routerIsHome = router.pathname === "/";
  const routerIsAuthPage = router.pathname === "/user-dashboard";

  const checkUserStatus = status !== "loading" && status === "unauthenticated";
  const shouldLogin = !session?.user?._id && routerIsAuthPage;

  useEffect(() => {
    if (checkUserStatus && !routerIsHome && !routerIsAuthPage) {
      router.push("/");
    }
  }, [session?.user?._id, router]);

  useEffect(() => {
    if (
      session?.user?.planType === PlanTypes.PAY_AS_YOU_GO &&
      !acceptableRoutes.includes(router.pathname)
    ) {
      router.back();
    }
  }, []);

  useEffect(() => {
    if (!session?.user?._id && authContext?.state.accountId) {
      authContext?.dispatch({ type: AuthActionTypes.LOGOUT });
    }
  }, [session?.user?._id, authContext?.state.accountId]);

  useEffect(() => {
    if (session?.user?._id && !canAccess) {
      router.push("/manage-subscription"); //instead route to /manage-subscription page
    }
  }, [session?.user?._id]);

  const handlePrivacyPolicyModal = () => setOpenPrivacyPolicy((prev) => !prev);
  const handleTermsModal = () => setOpenTerms((prev) => !prev);

  return (
    <ThemeProvider theme={themeModeSwitch}>
      <PageContainer>
        {!routerIsHome && <GlobalStyles />}
        <Content>
          <PrivacyPolicyModal
            open={openPrivacyPolicy}
            onClose={handlePrivacyPolicyModal}
          />
          <TermsOfServiceModal open={openTerms} onClose={handleTermsModal} />
          <Grid
            container
            direction="row"
            sx={{ paddingTop: 2, height: "100%" }}
          >
            {!routerIsHome && (
              <Grid item xs={12} md={2}>
                <SidebarMenu hasAppAccess={canAccess} />
              </Grid>
            )}
            <Divider
              orientation="vertical"
              sx={{ margin: "0 0.5rem", maxWidth: "90%" }}
            />
            {(session?.user?._id || shouldLogin || routerIsHome) && (
              <Grid item xs={12} md={routerIsHome ? 12 : 9.5}>
                {children}
              </Grid>
            )}
            {/* {status === "loading" && <CircularProgress />} */}
          </Grid>
        </Content>
        <Divider variant="fullWidth" flexItem sx={{ marginTop: "5rem" }} />
        {!routerIsHome && (
          <Stack
            sx={{ margin: "1.5rem 0", paddingLeft: "1rem" }}
            direction="row"
            spacing={2}
            alignItems="center"
          >
            <Link
              sx={{ textDecoration: "none", cursor: "pointer" }}
              onClick={handlePrivacyPolicyModal}
            >
              Privacy Policy
            </Link>
            <Link
              sx={{ textDecoration: "none", cursor: "pointer" }}
              onClick={handleTermsModal}
            >
              Terms Of Service
            </Link>
          </Stack>
        )}
      </PageContainer>
    </ThemeProvider>
  );
};

export default AppLayout;
