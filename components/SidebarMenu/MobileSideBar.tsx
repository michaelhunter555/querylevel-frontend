import React from "react";

import { useSession } from "next-auth/react";
import Link from "next/link";

import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";

import { MenuItem } from "./menus";
import { ToggleTheme } from "./ToggleTheme";

interface MobileSidebar {
  open: boolean;
  onClose: () => void;
  selectedIndex: number;
  filteredMenu: MenuItem[];
  hasAppAccess: boolean;
}

const MobileSidebar = ({
  open,
  onClose,
  selectedIndex,
  filteredMenu,
  hasAppAccess,
}: MobileSidebar) => {
  const { data: session } = useSession();

  return (
    <Drawer anchor="left" open={open} onClose={onClose}>
      <List>
        {filteredMenu?.map((menuText, i) => (
          <Link
            prefetch={false}
            key={i}
            href={
              session?.user?._id && session?.user?.googleAccountId
                ? `${menuText?.route}`
                : "#"
            }
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <ListItem>
              <ListItemButton
                onClick={onClose}
                disabled={!session?.user?._id || !hasAppAccess}
                sx={{ borderRadius: "15px" }}
                selected={selectedIndex === i}
                aria-current={selectedIndex === i ? "page" : undefined}
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
        <Divider />
        <Stack direction="row" justifyContent="center">
          <ToggleTheme />
        </Stack>
      </List>
    </Drawer>
  );
};

export default MobileSidebar;
