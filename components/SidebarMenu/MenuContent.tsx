import { useEffect, useState } from "react";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";

import { useCheckDevice } from "@/hooks/use-device-hook";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";

import { PlanTypes } from "../UserSettings/enums.plans";
import { menuItems, secondaryMenuItems } from "./menus";

interface MenuContentProps {
  hasAppAccess: boolean;
  onClose: () => void;
}

const acceptableRoutes = [
  "/user-dashboard",
  "/manage-subscription",
  "/create-tiered-campaigns",
  "/contact-us",
];

const MenuContent = ({ hasAppAccess, onClose }: MenuContentProps) => {
  const router = useRouter();
  const { data: session } = useSession();
  const { isMobile } = useCheckDevice();
  const [selected, setSelected] = useState<number | null>(null);
  const [secondSelect, setSecondSelect] = useState<number | null>(null);

  useEffect(() => {
    if (router.pathname) {
      const index = filterMenuItems?.findIndex(
        (value) => value?.route === router.pathname
      );
      setSelected(index !== -1 ? index : null);
    }
  }, [router.pathname]);

  const payAsGoUser = session?.user?.planType === PlanTypes.PAY_AS_YOU_GO; //payAsYouGo

  const filterMenuItems = menuItems.filter((item) => {
    if (payAsGoUser) {
      return acceptableRoutes?.includes(item.route);
    }
    return true;
  });

  const handleSelected = (i: number) => {
    if (secondSelect !== null) {
      setSecondSelect(null);
    }
    setSelected(i);
  };

  const handleSecondSelect = (i: number) => {
    if (selected !== null) {
      setSelected(null);
    }
    setSecondSelect(i);
  };

  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: "space-between" }}>
      <List dense>
        {filterMenuItems?.map((menuText, i) => (
          <Link
            prefetch={false}
            key={i}
            href={
              session?.user?._id &&
              session?.user?.googleAccountId &&
              hasAppAccess
                ? `${menuText?.route}`
                : "#"
            }
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <ListItem disablePadding sx={{ display: "block" }}>
              <ListItemButton
                onClick={() => {
                  if (isMobile) {
                    onClose();
                  }
                  handleSelected(i);
                }}
                disabled={!session?.user?._id || !hasAppAccess}
                sx={{ borderRadius: "15px" }}
                selected={selected === i}
                aria-current={selected === i ? "page" : undefined}
              >
                <ListItemIcon>{menuText.icon}</ListItemIcon>
                <ListItemText
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                  primary={menuText.text}
                  secondary={menuText.secondary}
                />
              </ListItemButton>
            </ListItem>
          </Link>
        ))}
      </List>

      <List dense>
        {secondaryMenuItems?.map((menuText, i) => (
          <Link
            prefetch={false}
            key={i}
            href={
              session?.user?._id &&
              session?.user?.googleAccountId &&
              hasAppAccess
                ? `${menuText?.route}`
                : "#"
            }
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <ListItem disablePadding sx={{ display: "block" }}>
              <ListItemButton
                onClick={() => {
                  if (isMobile) {
                    onClose();
                  }
                  handleSecondSelect(i);
                }}
                disabled={!session?.user?._id || !hasAppAccess}
                sx={{ borderRadius: "15px" }}
                selected={secondSelect === i}
                aria-current={secondSelect === i ? "page" : undefined}
              >
                <ListItemIcon>{menuText.icon}</ListItemIcon>
                <ListItemText
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                  primary={menuText.text}
                  secondary={menuText.secondary}
                />
              </ListItemButton>
            </ListItem>
          </Link>
        ))}
      </List>
    </Stack>
  );
};

export default MenuContent;
