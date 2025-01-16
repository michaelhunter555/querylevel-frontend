import React from "react";

import { useSession } from "next-auth/react";

import { useThemeToggle } from "@/hooks/toggle-hook";
import DarkModeIcon from "@mui/icons-material/DarkModeRounded";
import LightModeIcon from "@mui/icons-material/LightModeRounded";
import MenuIcon from "@mui/icons-material/Menu";
import {
  FormHelperText,
  PaletteMode,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";

import ColorModeIconDropdown from "./ColorModeIcon";

const logoStyle = {
  width: "200px",
  height: "auto",
  cursor: "pointer",
};

type OpenMenuProps = {
  onMobileMenuClick: () => void;
};

const Header = ({ onMobileMenuClick }: OpenMenuProps) => {
  const { togglePaletteMode } = useThemeToggle();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { data: session } = useSession();
  const userTheme = session?.user?.theme === "light";
  const img =
    session?.user?._id && userTheme
      ? "/query-level-day.svg"
      : !session?.user?._id
      ? "/query-level-day.svg"
      : "query-level-night.svg";

  const resolveMode = session?.user?.theme as PaletteMode;
  const icon = {
    light: <LightModeIcon sx={{ color: "#f9d05f" }} />,
    dark: <DarkModeIcon sx={{ color: "white" }} />,
  }[resolveMode];

  return (
    <Container
      sx={{
        width: "100%",
        ...(isMobile && {
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          gap: 1,
          alignItems: "start",
        }),
      }}
    >
      {isMobile && (
        <IconButton onClick={onMobileMenuClick}>
          <MenuIcon />
        </IconButton>
      )}

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: { xs: "start", md: "center" },

          gap: "5px",
        }}
      >
        <img
          src={img}
          style={{ ...logoStyle, ...(isMobile && { height: 50 }) }}
        />
        {isMobile && (
          <Stack>
            <ColorModeIconDropdown />
            <FormHelperText sx={{ fontSize: 9 }}>
              {session?.user?.theme} mode
            </FormHelperText>
          </Stack>
        )}
      </Box>
    </Container>
  );
};

export default Header;
