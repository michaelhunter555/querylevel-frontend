import * as React from "react";

import { useSession } from "next-auth/react";

import { useThemeToggle } from "@/hooks/toggle-hook";
import DarkModeIcon from "@mui/icons-material/DarkModeRounded";
import LightModeIcon from "@mui/icons-material/LightModeRounded";
import { PaletteMode } from "@mui/material";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

export default function ColorModeIconDropdown(props: IconButtonProps) {
  const { data: session } = useSession();
  const { togglePaletteMode } = useThemeToggle();

  const handleClick = () => {
    togglePaletteMode(String(session?.user?._id));
  };

  const resolvedMode = session?.user?.theme as PaletteMode;
  const icon = {
    light: <LightModeIcon sx={{ color: "#f9d05f" }} />,
    dark: <DarkModeIcon />,
  }[resolvedMode];

  return (
    <React.Fragment>
      <Tooltip title={`Using ${session?.user?.theme} mode`}>
        <IconButton
          data-screenshot="toggle-mode"
          onClick={handleClick}
          size="small"
          aria-controls={"color-scheme-menu"}
          aria-haspopup="true"
          {...props}
        >
          {icon}
        </IconButton>
      </Tooltip>
    </React.Fragment>
  );
}
