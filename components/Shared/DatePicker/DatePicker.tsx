import React from "react";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

interface DatePickerProps {
  //date: Dayjs | null;
  name: string;
  inputHandler: (id: string, value: string, isValid: boolean) => void;
  formState: string;
  fullWidth?: boolean;
}

const today = new Date();
const DatePickerField = ({
  // date,
  name,
  inputHandler,
  formState,
  fullWidth,
}: DatePickerProps) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        sx={{ width: fullWidth ? "100%" : "auto" }}
        name={name}
        onChange={(newValue) => inputHandler(name, String(newValue), true)}
        value={formState}
      />
    </LocalizationProvider>
  );
};

export default DatePickerField;
