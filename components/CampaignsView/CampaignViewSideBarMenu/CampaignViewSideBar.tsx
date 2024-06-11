import React from "react";

import { useSession } from "next-auth/react";

import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import { campaignMenuItems } from "./CampaignViewSideBarItems";

interface CampaignViewSideBarProps {
  onMenuItemClick: (component: string) => void;
  status: string;
  selectedIndex: number;
  onSetSelectedIndex: (i: number) => void;
}

export const CampaignViewSideBar = ({
  onMenuItemClick,
  status,
  selectedIndex,
  onSetSelectedIndex,
}: CampaignViewSideBarProps) => {
  const { data: session } = useSession();

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: "15px",
        background: session?.user?.theme === "light" ? "#f5f5f5" : "",
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Typography variant="h6" color="text.secondary">
          Menu
        </Typography>
      </Box>
      <Divider variant="middle" />
      <List>
        {campaignMenuItems.map((menuText, i) => (
          <ListItem key={i}>
            <ListItemButton
              sx={{
                borderRadius: "15px",
              }}
              selected={selectedIndex === i}
              onClick={() => {
                onMenuItemClick(menuText.component);
                onSetSelectedIndex(i);
              }}
            >
              <ListItemIcon>{menuText.icon}</ListItemIcon>
              <ListItemText
                sx={{ display: "flex", flexDirection: "column" }}
                primary={menuText.text}
                secondary={menuText.secondary}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};
