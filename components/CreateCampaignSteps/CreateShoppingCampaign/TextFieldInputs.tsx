import React from "react";

import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

export const TextFieldInput: React.FC<{
  id: string;
  name: string;
  type: string;
  title: string;
  hasAdornment: boolean;
  defaultValue?: string | number | boolean | string[] | Record<string, any>[];
  value?: string | number | boolean | string[] | Record<string, any>[];
  step?: string;
  style?: boolean;
  inputHandler: (id: string, val: string | number, isValid: boolean) => void;
  adornmentValue?: string | number;
  helperText?: string;
}> = ({
  inputHandler,
  name,
  type,
  id,
  title,
  defaultValue,
  hasAdornment,
  style,
  value,
  adornmentValue,
  helperText,
  step,
}) => {
  return (
    <>
      {hasAdornment && (
        <>
          <Typography color="text.secondary">{title}</Typography>
          <TextField
            helperText={helperText || ""}
            sx={{ padding: style ? 0 : "" }}
            id={id}
            name={name}
            type={type}
            fullWidth
            defaultValue={defaultValue}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  {adornmentValue ? adornmentValue : "$"}
                </InputAdornment>
              ),
            }}
            inputProps={{
              step: step ? step : "0.01",
              ...(type === "number" && step ? { min: 1 } : {}),
            }}
            onChange={(event: any) =>
              inputHandler(
                id,
                event.target.value as number,
                event.target.value > 0
              )
            }
          />
        </>
      )}

      {!hasAdornment && (
        <>
          <Typography color="text.secondary">{title}</Typography>
          <TextField
            helperText={helperText || ""}
            sx={{
              ".css-1t8l2tu-MuiInputBase-input-MuiOutlinedInput-input": {
                padding: style ? 0 : "",
              },
              ".css-p51h6s-MuiInputBase-input-MuiOutlinedInput-input": {
                padding: style ? 0 : "",
              },
            }}
            id={id}
            name={name}
            type={type}
            defaultValue={defaultValue}
            value={value}
            onChange={(event: any) =>
              inputHandler(
                id,
                event.target.value || event.target.checked,
                event.target.checked === true ||
                  event.target.checked === false ||
                  event.target.value.length > 0
              )
            }
          />
        </>
      )}
    </>
  );
};
