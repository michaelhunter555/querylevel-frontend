import React, { useState } from "react";

import { useSession } from "next-auth/react";
import Link from "next/link";

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
  const { data: session } = useSession();
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  return (
    <>
      {session?.user?.googleAccountId && (
        <Stack
          direction="row"
          alignItems="cener"
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
        </Stack>
      )}
      <Paper elevation={0} sx={{ borderRadius: "15px" }}>
        <List>
          {menuItems.map((menuText, i) => (
            <Link
              prefetch={false}
              key={i}
              href={session?.user?._id ? `${menuText?.route}` : "#"}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <ListItem>
                <ListItemButton
                  disabled={!session?.user?._id || !hasAppAccess}
                  sx={{ borderRadius: "15px" }}
                  selected={selectedIndex === i}
                  onClick={() => {
                    // onMenuItemClick(menuText.component);
                    setSelectedIndex(i);
                  }}
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
