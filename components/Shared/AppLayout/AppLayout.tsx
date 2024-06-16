import React, { ReactNode, useContext, useEffect, useState } from "react";

import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

import { Content, PageContainer } from "@/components/Footer/FooterStyles";
import Header from "@/components/Header/Header";
import PrivacyPolicyModal from "@/components/Modal/PrivacyPolicyModal";
import TermsOfServiceModal from "@/components/Modal/TermsOfServiceModal";
import SidebarMenu from "@/components/SidebarMenu/SidebarMenu";
import { AuthContext } from "@/context/auth-context";
import { AuthActionTypes } from "@/context/authActions";
import { userCanAccessApp } from "@/util/helpers/confirmUserPrivelages";
import { selectPalette } from "@/util/siteTheme/selectPalette";
import { createTheme, ThemeProvider } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";

import { GlobalStyles } from "../../../styles/GlobalStyles";

interface LayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: LayoutProps) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { source } = router.query;
  const themePreference = session?.user?.theme || "dark";
  const defaultTheme = selectPalette(themePreference);
  const themeModeSwitch = createTheme(defaultTheme);
  const authContext = useContext(AuthContext);
  const [openPrivacyPolicy, setOpenPrivacyPolicy] = useState(false);
  const [openTerms, setOpenTerms] = useState(false);
  const [component, setComponent] = useState("authenticate"); //billing
  const canAccess = userCanAccessApp(session);
  const routerIsHome = router.pathname === "/";
  const routerIsAuthPage = router.pathname === "/user-dashboard";

  const checkUserStatus = status !== "loading" && status === "unauthenticated";

  useEffect(() => {
    if (checkUserStatus && !routerIsHome && !routerIsAuthPage) {
      router.push("/user-dashboard");
    }
  }, [session?.user?._id, router]);

  useEffect(() => {
    if (!session?.user?._id && authContext?.state.accountId) {
      authContext?.dispatch({ type: AuthActionTypes.LOGOUT });
    }
  }, [session?.user?._id, authContext?.state.accountId]);

  useEffect(() => {
    if (session?.user?._id && !canAccess) {
      router.push("/manage-subscription"); //instead route to /manage-subscription page
    }
  }, [session?.user?._id, component]);

  useEffect(() => {
    if (source === "stripe") {
      router.push("/manage-subscription"); //instead route to billing page
    }
  }, [source]);

  // const handleMenuItemClick = (componentName: string) => {
  //   setComponent(componentName);
  // };

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
                <Header />
                <SidebarMenu hasAppAccess={canAccess} />
              </Grid>
            )}
            <Divider
              orientation="vertical"
              sx={{ margin: "0 0.5rem", maxWidth: "90%" }}
            />
            {status !== "loading" && (
              <Grid item xs={12} md={routerIsHome ? 12 : 9.5}>
                {children}
              </Grid>
            )}
            {status === "loading" && <CircularProgress />}
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
