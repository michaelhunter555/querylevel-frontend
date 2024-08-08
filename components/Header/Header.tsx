import React from "react";

import { useSession } from "next-auth/react";

import MenuIcon from "@mui/icons-material/Menu";
import { useMediaQuery, useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";

const logoStyle = {
  width: "250px",
  height: "auto",
  cursor: "pointer",
};

type OpenMenuProps = {
  onMobileMenuClick: () => void;
};

const Header = ({ onMobileMenuClick }: OpenMenuProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { data: session } = useSession();
  const userTheme = session?.user?.theme === "light";
  const img = userTheme ? "/query-level-day.svg" : "query-level-night.svg";
  return (
    <Container
      sx={{
        width: "100%",
        ...(isMobile && {
          display: "flex",
          flexDirection: "row",
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
          alignItems: "center",
          mb: 2,
          backgroundColor: "fff",
          gap: "5px",
          pointerEvents: "none",
        }}
      >
        <img
          src={img}
          style={{ ...logoStyle, ...(isMobile && { height: 50 }) }}
        />
      </Box>
    </Container>
  );
};

export default Header;
