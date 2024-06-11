import React from "react";

import InfoIcon from "@mui/icons-material/Info";
import { styled } from "@mui/material/styles";
import Tooltip, { tooltipClasses, TooltipProps } from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

type TooltipMessage = {
  title: string;
  text: string;
};

const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#f5f5f9",
    color: "rgba(0, 0, 0, 0.87)",
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(13),
    border: "1px solid #dadde9",
  },
}));

export const TooltipMessage = ({ title, text }: TooltipMessage) => {
  return (
    <HtmlTooltip
      title={
        <React.Fragment>
          <Typography color="inherit">{title}</Typography>
          <em>{text}</em>
        </React.Fragment>
      }
    >
      <InfoIcon fontSize="small" />
    </HtmlTooltip>
  );
};
