import React from "react";

import { State } from "@/types";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";

interface InputableText {
  id: string;
  formState: State;
  inputHandler: (id: string, val: boolean | string, isValid: boolean) => void;
}

export const InputableText = ({
  id,
  formState,
  inputHandler,
}: InputableText) => {
  const hasInputAdornment = id === "campaignBudgetAmount" ? "$" : "";
  let formValue;
  if (id === "campaignBudgetAmount") {
    formValue = formState?.inputs?.campaignBudgetAmount?.value as number;
  } else {
    formValue = formState?.inputs[id]?.value as any;
  }

  return (
    <TextField
      id={id}
      name={id}
      value={typeof formValue === "number" ? Number(formValue) : formValue}
      InputProps={{
        startAdornment: hasInputAdornment && (
          <InputAdornment position="start">$</InputAdornment>
        ),
      }}
      inputProps={{
        step: id === "campaignBudgetAmount" ? 1 : 0.01,
      }}
      type={id === "campaignBudgetAmount" ? "number" : "text"}
      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
        inputHandler(id, event.target.value, event.target.value !== "");
      }}
    />
  );
};
