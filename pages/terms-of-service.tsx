import React, { useState } from "react";

import { useSession } from "next-auth/react";

import getLPTheme from "@/components/DashboardHome/HompePageTheme";
import TermsOfService from "@/components/Legal/TermsOfService";
import { PaletteMode } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const TermsOfServicePage = () => {
  const { data: session } = useSession();

  const userTheme = session?.user?.theme as PaletteMode;
  const [mode, setMode] = useState<PaletteMode>(userTheme || "dark");
  const customTheme = createTheme(getLPTheme(mode));

  const handleThemeChange = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeProvider theme={customTheme}>
      <CssBaseline />
      <TermsOfService onToggleTheme={handleThemeChange} theme={mode} />
    </ThemeProvider>
  );
};

export default TermsOfServicePage;
