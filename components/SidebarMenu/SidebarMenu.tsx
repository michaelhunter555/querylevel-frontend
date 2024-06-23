import React, { useEffect, useState } from "react";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";

import HomeIcon from "@mui/icons-material/Home";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { menuItems } from "./menus";
import { ToggleTheme } from "./ToggleTheme";

const SidebarMenu: React.FC<{
  hasAppAccess: boolean;
}> = ({ hasAppAccess }): JSX.Element => {
  const router = useRouter();
  const { data: session } = useSession();
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  useEffect(() => {
    if (router.pathname) {
      const index = menuItems?.findIndex(
        (value) => value?.route === router.pathname
      );
      setSelectedIndex(index !== -1 ? index : 0);
    }
  }, [router.pathname]);

  return (
    <>
      {session?.user?.googleAccountId && (
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="center"
          spacing={1}
        >
          <Avatar
            src={session?.user?.image}
            alt={`${session?.user?.name}-${Math.floor(Math.random() * 1000)}`}
            sx={{ width: 25, height: 25, marginBottom: 1 }}
          />
          <Typography variant="subtitle2" color="text.secondary">
            Account Id: {session?.user?.googleAccountId}
          </Typography>
          <Divider orientation="vertical" />
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
        </Stack>
      )}
      <Paper elevation={0} sx={{ borderRadius: "15px" }}>
        <List>
          {menuItems.map((menuText, i) => (
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
      </Paper>
    </>
  );
};

export default SidebarMenu;
