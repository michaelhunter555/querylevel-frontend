import React, { useState } from "react";

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";

import { useCheckDevice } from "@/hooks/use-device-hook";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import MuiDrawer, { drawerClasses } from "@mui/material/Drawer";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

import Header from "../Header/Header";
import { PlanTypes } from "../UserSettings/enums.plans";
import MenuContent from "./MenuContent";
import { menuItems } from "./menus";
import MobileSidebar from "./MobileSidebar";
import OptionsMenu from "./OptionMenu";

const Drawer = styled(MuiDrawer)({
  width: 270,
  flexShrink: 0,
  boxSizing: "border-box",
  mt: 10,
  [`& .${drawerClasses.paper}`]: {
    width: 270,
    boxSizing: "border-box",
  },
});

const SidebarMenu: React.FC<{
  hasAppAccess: boolean;
}> = ({ hasAppAccess }): JSX.Element => {
  const { isMobile } = useCheckDevice();

  const router = useRouter();
  const { data: session } = useSession();
  //const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [mobileMenu, setMobileMenu] = useState<boolean>(false);
  const acceptableRoutes = [
    "/user-dashboard",
    "/manage-subscription",
    "/create-tiered-campaigns",
    "/contact-us",
  ];

  const payAsGoUser = session?.user?.planType === PlanTypes.PAY_AS_YOU_GO; //payAsYouGo
  const filterMenuItems = menuItems.filter((item) => {
    if (payAsGoUser) {
      return acceptableRoutes?.includes(item.route);
    }
    return true;
  });

  // useEffect(() => {
  //   if (router.pathname) {
  //     const index = filterMenuItems?.findIndex(
  //       (value) => value?.route === router.pathname
  //     );
  //     setSelectedIndex(index !== -1 ? index : 0);
  //   }
  // }, [router.pathname]);

  const handleMobileMenuToggle = () => {
    setMobileMenu((prev) => !prev);
  };

  const handleMobileSignOut = () => {
    signOut({ callbackUrl: "/user-dashboard" });
    localStorage.removeItem("brand");
    localStorage.removeItem("campaign");
  };

  return (
    <>
      {isMobile && <Header onMobileMenuClick={handleMobileMenuToggle} />}
      {/*{session?.user?.googleAccountId && (
        <Stack
          direction="row"
          alignItems="center"
          justifyContent={isMobile ? "flex-start" : "center"}
          spacing={2}
          sx={{ ...(!isMobile && { marginBottom: "0.5rem" }) }}
        >
          <Avatar
            src={session?.user?.image}
            alt={`${session?.user?.name}-${Math.floor(Math.random() * 1000)}`}
            sx={{ width: 25, height: 25, marginBottom: 1 }}
          />
          <Typography variant="subtitle2" color="text.secondary">
            Account Id: {session?.user?.googleAccountId}
          </Typography>
          <Divider orientation="vertical" flexItem />
          <Tooltip title={isMobile ? "toggle theme" : "homepage"}>
            {isMobile ? (
              <IconButton
                onClick={async () => {
                  togglePaletteMode(session?.user?._id);
                }}
              >
                {session?.user?.theme === "light" ? (
                  <Brightness7Icon />
                ) : (
                  <Brightness4Icon />
                )}
              </IconButton>
            ) : (
              <Link
                prefetch={false}
                href="/"
                style={{
                  textDecoration: "none",
                  color: session?.user?.theme === "light" ? "#444" : "#f4f4f4",
                }}
              >
                <HomeIcon />
              </Link>
            )}
          </Tooltip>
          {isMobile && (
            <>
              <Divider orientation="vertical" flexItem />
              <Chip
                icon={<FcGoogle />}
                clickable
                component="button"
                onClick={handleMobileSignOut}
                label="sign out"
                variant="outlined"
              />
            </>
          )}
        </Stack>
      )} */}

      <Drawer
        variant="permanent"
        elevation={0}
        sx={{
          display: { xs: "none", md: "block" },
          [`& .${drawerClasses.paper}`]: {
            backgroundColor:
              session?.user?.theme === "dark"
                ? "#12121200"
                : "background.paper",
          },
        }}
      >
        <Header onMobileMenuClick={handleMobileMenuToggle} />

        <Divider
          flexItem
          sx={{
            margin: "0.5rem auto",
            width: "100%",
          }}
        />
        <MenuContent
          onClose={handleMobileMenuToggle}
          hasAppAccess={hasAppAccess}
        />
        <Stack
          direction="row"
          sx={{
            p: 2,
            gap: 1,
            alignItems: "center",
            borderTop: "1px solid",
            borderColor: "divider",
          }}
        >
          <Avatar
            src={session?.user?.image}
            alt={`${session?.user?.name}-${Math.floor(Math.random() * 1000)}`}
            sx={{ width: 25, height: 25, marginBottom: 1 }}
          />
          <Box sx={{ mr: "auto" }}>
            <Typography
              variant="body2"
              sx={{ fontWeight: 500, lineHeight: "16px" }}
            >
              {session?.user?.name}
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              {session?.user?.email}
            </Typography>
          </Box>
          <OptionsMenu />
        </Stack>
      </Drawer>
      <MobileSidebar
        open={mobileMenu}
        onClose={handleMobileMenuToggle}
        signOut={handleMobileSignOut}
        hasAppAccess={hasAppAccess}
      />
    </>
  );
};

export default SidebarMenu;
