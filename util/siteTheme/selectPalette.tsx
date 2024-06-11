import { PaletteMode, ThemeOptions } from "@mui/material";

export const selectPalette = (mode: PaletteMode): ThemeOptions => ({
  palette: {
    mode: mode,
  },
  // components: {
  //   MuiPaper: {
  //     styleOverrides: {
  //       root: ({ theme }) => ({
  //         backgroundImage: "none",
  //         border: theme.palette.mode === "dark" ? "1px solid white" : "none",
  //         backgroundColor:
  //           theme.palette.mode === "dark"
  //             ? "#000"
  //             : theme.palette.background.paper,
  //       }),
  //     },
  //   },
  // },
});
