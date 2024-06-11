import React from "react";

import { State } from "@/types";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import FormLabel from "@mui/material/FormLabel";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";

import { TextFieldInput } from "../CreateCampaignSteps/CreateShoppingCampaign/TextFieldInputs";
import {
  ConversionAttributionModel,
  ConversionCountType,
} from "./conversionAction.enums";

type ConversionFormFields = {
  formState: State;
  inputHandler: (
    id: string,
    value: string | number | boolean,
    isValid: boolean
  ) => void;
};

const ConversionFormFields = ({
  formState,
  inputHandler,
}: ConversionFormFields) => {
  return (
    <>
      {/*ROW 1 NAME & ATTRIBUTION MODEL */}
      <Stack direction="row" spacing={2} alignItems="center">
        <Grid item xs={12} md={7}>
          <FormLabel id="conversionName">Name</FormLabel>
          <TextField
            fullWidth
            id="conversionName"
            name="conversionName"
            type="text"
            value={formState?.inputs?.conversionName?.value}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              inputHandler(
                "conversionName",
                event.target.value,
                event.target.value !== ""
              )
            }
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <InputLabel>Select Attribution Model</InputLabel>
          <Select
            fullWidth
            id="attributionModel"
            name="attributionModel"
            value={formState?.inputs?.attributionModel?.value as string}
            onChange={(event: SelectChangeEvent<string>) =>
              inputHandler(
                "attributionModel",
                event.target.value,
                event.target.value !== ""
              )
            }
          >
            {Object.entries(ConversionAttributionModel).map(([key, text]) => (
              <MenuItem key={text} value={key}>
                {text}
              </MenuItem>
            ))}
          </Select>
        </Grid>
      </Stack>

      <Divider sx={{ margin: "0.5rem auto" }} />

      {/*ROW 2 DEFAULT VALUE MANAGEMENT */}
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        sx={{ margin: "1rem 0" }}
      >
        <Grid item xs={11} md={6}>
          <TextFieldInput
            step="1"
            id="defaultValue"
            name="defaultValue"
            type="number"
            defaultValue={formState?.inputs?.defaultValue?.value}
            hasAdornment={true}
            inputHandler={inputHandler}
            title="Enter the value for each conversion action"
            helperText="If you only sell one type of product, enter the value of each sale. For example, if you sell only one product for $20, assign a value of $20. For each sale, Google Ads will record a value of $20."
          />
        </Grid>
        <Grid item xs={11} md={6} sx={{ padding: "0 0 0 2rem" }}>
          <FormControl>
            <FormLabel id="alwaysUseDefaultValue">Select Value</FormLabel>
            <RadioGroup
              id="alwaysUseDefaultValue"
              value={formState?.inputs?.alwaysUseDefaultValue?.value}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                inputHandler("alwaysUseDefaultValue", event.target.value, true);
              }}
            >
              <FormControlLabel
                id="useDefault"
                name="useDefault"
                control={<Radio size="small" />}
                value={true}
                label="Always use default value"
                sx={{ color: "text.secondary" }}
              />
              <FormHelperText>
                Recommended for purchases because every purchase is valuable.
              </FormHelperText>

              <FormControlLabel
                id="dontAlwaysUseDefault"
                name="dontAlwaysUseDefault"
                control={<Radio size="small" />}
                value={false}
                label="Don't always use default value"
                sx={{ color: "text.secondary" }}
              />
              <FormHelperText>
                Recommended for leads, sign-ups, and other conversions because
                only the first interaction is valuable.
              </FormHelperText>
            </RadioGroup>
          </FormControl>
        </Grid>
      </Stack>

      {/*ROW 3 COUNT & GOAL TYPE */}
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        sx={{ margin: "1rem 0" }}
      >
        <Grid item xs={11} md={6}>
          <InputLabel>Select Count Type</InputLabel>
          <Select
            fullWidth
            id="countingType"
            name="countingType"
            value={formState?.inputs?.countingType?.value as string}
            onChange={(event: SelectChangeEvent<string>) =>
              inputHandler(
                "countingType",
                event.target.value,
                event.target.value !== ""
              )
            }
          >
            {Object.entries(ConversionCountType).map(([key, text]) => (
              <MenuItem key={text} value={key}>
                {text}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>
            Decide on whether to count every click (recommended if every
            purchase is valuable) or one click (leads, sign-ups, etc.).
          </FormHelperText>
        </Grid>
        <Grid item xs={11} md={6} sx={{ padding: "0 0 0 2rem" }}>
          <Divider sx={{ margin: "0.5rem 0" }} />
          <FormControl>
            <FormLabel id="primaryForGoal">Select Goal Type</FormLabel>
            <RadioGroup
              id="primaryForGoal"
              value={formState?.inputs?.primaryForGoal?.value}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                inputHandler("primaryForGoal", event.target.value, true);
              }}
            >
              <FormControlLabel
                id="usePrimaryForGoal"
                name="usePrimaryForGoal"
                value={true}
                control={<Radio size="small" />}
                label="Use primary goal"
                sx={{ color: "text.secondary" }}
              />
              <FormHelperText>
                Use for bidding optimization & reporting
              </FormHelperText>
              <FormControlLabel
                id="dontUsePrimaryForGoal"
                name="dontUsePrimaryForGoal"
                value={false}
                control={<Radio size="small" />}
                label="Don't always use primary goal"
                sx={{ color: "text.secondary" }}
              />
              <FormHelperText>
                Only use for reporting purposes. Observe conversions, but do not
                optimize around them.
              </FormHelperText>
            </RadioGroup>
          </FormControl>
        </Grid>
      </Stack>

      {/*ROW 4 VIEW THROUGH & LOOKBACK WINDOWS */}
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        sx={{ margin: "1rem 0" }}
      >
        <Grid item xs={11} md={6}>
          <TextFieldInput
            title="View Through Look Back"
            helperText="Select the maximum time, after a person views your ad, that you want to count view-through conversions"
            id="viewThroughLookbackWindowDays"
            name="viewThroughLookbackWindowDays"
            type="number"
            hasAdornment={true}
            adornmentValue="Days"
            defaultValue={
              formState?.inputs?.viewThroughLookbackWindowDays?.value || 1
            }
            inputHandler={inputHandler}
            step="1.00"
          />
        </Grid>

        <Grid item xs={11} md={6}>
          <TextFieldInput
            title="Click Through Look Back"
            helperText="Select how much time after someone interacts with an ad you want to use to count conversions."
            id="clickThroughLookbackWindowDays"
            name="clickThroughLookbackWindowDays"
            type="number"
            hasAdornment={true}
            adornmentValue="Days"
            inputHandler={inputHandler}
            defaultValue={
              formState?.inputs?.clickThroughLookbackWindowDays?.value
            }
            step="1.00"
          />
        </Grid>
      </Stack>
    </>
  );
};

export default ConversionFormFields;
