import React from "react";

import { styled } from "@mui/material/styles";

interface IEmphasizeText {
  children: React.ReactNode;
}

const SpanStyle = styled("span")(({ theme }) => ({
  fontWeight: 700,
  backgroundColor: "#f9f9f9",
  color: theme.palette.text.secondary,
  borderRadius: "5px",
}));

export const EmphasizeText = ({ children }: IEmphasizeText) => {
  return <SpanStyle>{children}</SpanStyle>;
};
