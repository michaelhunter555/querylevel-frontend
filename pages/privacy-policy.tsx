import React, { useState } from "react";

import { useSession } from "next-auth/react";

import getLPTheme from "@/components/DashboardHome/HompePageTheme";
import PrivacyPolicy from "@/components/Legal/PrivacyPolicy";
import { PaletteMode } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const PrivacyPage = () => {
  const { data: session } = useSession();

  const userTheme = session?.user?.theme as PaletteMode;
  const [mode, setMode] = useState<PaletteMode>(userTheme || "dark");
  const customTheme = createTheme(getLPTheme(mode));

  // console.log(session);
  return (
    <ThemeProvider theme={customTheme}>
      <CssBaseline />
      <PrivacyPolicy />
    </ThemeProvider>
  );
};

export default PrivacyPage;
