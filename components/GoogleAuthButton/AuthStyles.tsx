import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";

interface ClearBackground {
  clear?: boolean;
}

export const StyledBoxContainer = styled(Box)<ClearBackground>(
  ({ theme, clear }) => ({
    backgroundColor: clear ? "transparent" : theme.palette.background.paper,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    maxWidth: "100%",
    border: clear ? "1px solid white" : 0,
    borderRadius: "15px",
    boxSizing: "border-box",
    padding: "2rem",
    margin: "0.5rem 0 1rem",
    [theme.breakpoints.down("md")]: {
      flexDirection: "column",
    },
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
    },
  })
);

//overflow for table
export const styledScroll = {
  overflowY: "auto",

  pointerEvents: "auto",
  "&::-webkit-scrollbar": {
    width: "4px",
  },
  "&::-webkit-scrollbar-thumb": {
    background: "transparent",
    borderRadius: "30px",
  },
  "&::-webkit-scrollbar-thumb:hover": {
    background: "#8b8b8d",
  },
  "&::-webkit-scrollbar-track": {
    background: "#f1f1f1",
    borderRadius: "30px",
  },
  "&:hover": {
    "&::-webkit-scrollbar-thumb": {
      background: "#b5b5b5",
    },
    "&::-webkit-scrollbar-thumb:hover": {
      transition: "background 1s ease-in",
      background: "#8b8b8d",
    },
    "&::-webkit-scrollbar-track": {
      background: "#f1f1f1",
    },
  },
};
