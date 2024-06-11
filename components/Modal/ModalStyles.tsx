import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";

type StyleBoxContent = {
  width?: number | string;
  height?: number | string;
};

export const StyledBoxContainer = styled(Box)<StyleBoxContent>(
  ({ theme, width, height }) => ({
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: width ? width : "60%",
    height: height ? height : "80vh",
    overflowY: "auto",
    background:
      theme.palette.mode === "light"
        ? "#ededed"
        : theme.palette.background.paper,
    border: "1px solid #bbb",
    boxShadow: [theme.shadows[3]],
    padding: 8,
    borderRadius: "10px",

    [theme.breakpoints.down("md")]: {
      width: "100%",
    },
    [theme.breakpoints.down("sm")]: {
      width: "95%",
    },
  })
);

export const StepperModalContainer = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  height: "80vh",
  background: theme.palette.background.paper,
  border: "1px solid #bbb",
  boxShadow: [theme.shadows[3]],
  padding: 8,
  borderRadius: "15px",
  [theme.breakpoints.down("md")]: {
    width: "100%",
  },
  [theme.breakpoints.down("sm")]: {
    width: "95%",
  },
}));
