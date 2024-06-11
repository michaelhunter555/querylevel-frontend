import { Theme } from "@mui/material";

export const getStyles = (
  name: string,
  targetedLocation: string[],
  theme: Theme
) => {
  return {
    fontWeight:
      targetedLocation?.indexOf(name) !== -1
        ? theme.typography.fontWeightBold
        : theme.typography.fontWeightRegular,
  };
};
