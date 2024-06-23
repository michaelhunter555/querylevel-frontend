import React from "react";

import { useSession } from "next-auth/react";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";

const logoStyle = {
  width: "250px",
  height: "auto",
  cursor: "pointer",
};

const Header = () => {
  const { data: session } = useSession();
  const userTheme = session?.user?.theme === "light";
  const img = userTheme ? "/query-level-day.svg" : "query-level-night.svg";
  return (
    <Container sx={{ width: "100%" }}>
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
        <img src={img} style={logoStyle} />
      </Box>
    </Container>
  );
};

export default Header;
