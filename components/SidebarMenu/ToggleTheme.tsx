import React, { useState } from "react";

import { useSession } from "next-auth/react";

import { useThemeToggle } from "@/hooks/toggle-hook";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";

import { ThemeColor } from "./enums.menuItems";

export const ToggleTheme = () => {
  const { data: session } = useSession();
  const [checked, setChecked] = useState<boolean>(false);
  const { togglePaletteMode } = useThemeToggle();

  const toggleThemeColor = () => {
    if (session?.user?._id) {
      togglePaletteMode(session?.user?._id).then(() =>
        setChecked((prev) => !prev)
      );
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
      <Stack>
        {session?.user?.theme === "light" ? (
          <Brightness7Icon />
        ) : (
          <Brightness4Icon />
        )}
      </Stack>
      <Stack>
        <Switch
          disabled={!session?.user?._id}
          checked={checked}
          onChange={toggleThemeColor}
        />
      </Stack>
      <Stack>
        <Typography variant="subtitle2" color="text.secondary">
          {session?.user?.theme === ThemeColor.LIGHT ? "light" : "dark"} mode
          selected
        </Typography>
      </Stack>
    </Box>
  );
};
