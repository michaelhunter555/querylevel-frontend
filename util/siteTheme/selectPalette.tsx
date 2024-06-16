import { PaletteMode, ThemeOptions } from "@mui/material";

const fonts = {
  styleOverrides: {
    root: {
      fontSize: "0.75rem",
    },
  },
};

export const selectPalette = (mode: PaletteMode): ThemeOptions => ({
  palette: {
    mode: mode,
  },
  typography: {
    h1: {
      fontSize: "1.5rem",
    },
    h2: {
      fontSize: "1.375rem",
    },
    h3: {
      fontSize: "1.25rem",
    },
    h4: {
      fontSize: "1.125rem",
    },
    h5: {
      fontSize: "1rem",
    },
    h6: {
      fontSize: "0.875rem",
    },
    subtitle1: {
      fontSize: "0.875rem",
    },
    subtitle2: {
      fontSize: "0.75rem",
    },
    body1: {
      fontSize: "0.875rem",
    },
    body2: {
      fontSize: "0.75rem",
    },
  },
  components: {
    MuiChip: {
      ...fonts,
    },
    MuiButton: {
      ...fonts,
    },
  },
});
