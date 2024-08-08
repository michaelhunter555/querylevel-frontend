import React from "react";

import { State } from "@/types";
import Alert from "@mui/material/Alert";
import Checkbox from "@mui/material/Checkbox";
import Fade from "@mui/material/Fade";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import FormLabel from "@mui/material/FormLabel";
import Grid from "@mui/material/Grid";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import LinearProgress from "@mui/material/LinearProgress";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import TextField from "@mui/material/TextField";

import {
  selectBudgetDelivery,
  selectCampaignPriority,
  selectGeoTargeting,
} from "./CreateCampaign.enums";

interface CreateCampaignSteps {
  isLoading: boolean;
  resourceNames: string | string[];
  formState: State;
  inputHandler: (
    id: string,
    value: string | number | boolean,
    isValid: boolean
  ) => void;
}

const CreateCampaignStepOne = ({
  isLoading,
  resourceNames,
  formState,
  inputHandler,
}: CreateCampaignSteps) => {
  return (
    <>
      <Grid item xs={11}>
        {isLoading && <LinearProgress />}
        {!isLoading && (
          <Fade in={!isLoading}>
            <Alert severity="info">
              <code>Merchant Center Id:</code> {resourceNames}
            </Alert>
          </Fade>

          // <SelectAccounts
          //   resource={resource}
          //   resourceNames={resourceNames}
          //   onSelectResource={selectResourceHandler}
          // />
        )}
      </Grid>
      {/* BudgetName */}
      <Grid item xs={11} md={6}>
        <Paper sx={{ borderRadius: "15px", padding: "1rem" }}>
          <TextField
            fullWidth
            id="budgetName"
            name="budgetName"
            type="text"
            defaultValue={formState?.inputs?.budgetName?.value}
            helperText="Enter Campaign Name"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              inputHandler(
                "budgetName",
                event.target.value,
                event.target.value !== ""
              )
            }
          />
        </Paper>
      </Grid>
      {/* BudgetAmount */}
      <Grid item xs={11} md={5}>
        <Paper sx={{ borderRadius: "15px", padding: "1rem" }}>
          <TextField
            id="budgetAmount"
            name="budgetAmount"
            type="number"
            defaultValue={formState?.inputs?.budgetAmount?.value}
            helperText="Enter Budget Amount"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
            }}
            onChange={(event: any) =>
              inputHandler(
                "budgetAmount",
                event.target.value,
                event.target.value !== ""
              )
            }
          />
        </Paper>
      </Grid>

      {/* BudgetDelivery */}
      <Grid item xs={5}>
        <Paper sx={{ borderRadius: "15px", padding: "1rem" }}>
          <InputLabel id="budgetDelivery">Delivery</InputLabel>
          <Select
            labelId="budgetDelivery"
            id="budgetDeliveryMethod"
            name="budgetDeliveryMethod"
            type="text"
            value={formState?.inputs?.budgetDeliveryMethod?.value}
            onChange={(event: any) => {
              inputHandler(
                "budgetDeliveryMethod",
                event.target.value,
                event.target.value !== ""
              );
            }}
            sx={{ width: "100%" }}
          >
            {Object.values(selectBudgetDelivery).map((delivery, i) => (
              <MenuItem key={delivery} value={delivery}>
                {delivery}
              </MenuItem>
            ))}
          </Select>
        </Paper>
      </Grid>
      {/* BudgetShared */}
      <Grid item xs={6}>
        <Paper sx={{ borderRadius: "15px", padding: "1rem" }}>
          <FormControl>
            <FormLabel id="budgetShared">Shared Budget?</FormLabel>
            <RadioGroup
              row
              id="budgetShared"
              name="budgetShared"
              value={formState?.inputs?.budgetShared?.value}
              onChange={(event: any) => {
                inputHandler(
                  "budgetShared",
                  event.target.value,
                  event.target.value !== ""
                );
              }}
            >
              <FormControlLabel
                value={false}
                control={<Radio />}
                label="Individual"
                sx={{ color: "text.secondary" }}
              />
              <FormControlLabel
                value={true}
                control={<Radio />}
                label="Shared"
                sx={{ color: "text.secondary" }}
              />
            </RadioGroup>
          </FormControl>
        </Paper>
      </Grid>
      {/* TargetNetworks */}
      <Grid item xs={6}>
        <Paper
          elevation={1}
          sx={{
            borderRaidus: "15px",
            padding: "1rem",
          }}
        >
          <FormGroup>
            <FormLabel>Advertising Channels</FormLabel>
            <FormControlLabel
              sx={{ color: "text.secondary" }}
              id="targetGoogleSearch"
              name="targetGoogleSearch"
              label="Google Search"
              disabled
              control={
                <Checkbox
                  checked={
                    formState?.inputs?.targetGoogleSearch?.value as boolean
                  }
                  value={formState?.inputs?.targetGoogleSearch?.value}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    inputHandler(
                      "targetGoogleSearch",
                      event.target.checked,
                      true
                    );
                  }}
                />
              }
            />
            <FormControlLabel
              id="targetSearchNetwork"
              name="targetSearchNetwork"
              sx={{ color: "text.secondary" }}
              control={
                <Checkbox
                  checked={
                    formState?.inputs?.targetSearchNetwork?.value as boolean
                  }
                  value={formState?.inputs?.targetSearchNetwork?.value}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    inputHandler(
                      "targetSearchNetwork",
                      event.target.checked,
                      true
                    );
                  }}
                />
              }
              label="Search Partners Network"
            />
            {/* <FormControlLabel
              id="targetContentNetwork"
              name="targetContentNetwork"
              sx={{ color: "text.secondary" }}
              control={
                <Checkbox
                  checked={
                    formState?.inputs?.targetContentNetwork?.value as boolean
                  }
                  value={formState?.inputs?.targetContentNetwork?.value}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    inputHandler(
                      "targetContentNetwork",
                      event.target.checked,
                      true
                    );
                  }}
                />
              }
              label="Content Network"
            /> */}
          </FormGroup>
        </Paper>
      </Grid>
      {/* CampaignPriority */}
      <Grid item xs={5}>
        <Paper sx={{ borderRadius: "15px", padding: "1rem" }}>
          <InputLabel id="campaignPriority">Select Priority</InputLabel>
          <Select
            id="campaignPriority"
            name="campaignPriority"
            value={formState?.inputs?.campaignPriority?.value as number}
            onChange={(event: SelectChangeEvent<number>) => {
              inputHandler("campaignPriority", event.target.value, true);
            }}
            sx={{ width: "100%" }}
          >
            {Object.entries(selectCampaignPriority).map(([key, priority]) => (
              <MenuItem key={priority} value={key}>
                {priority}
              </MenuItem>
            ))}
          </Select>
        </Paper>
      </Grid>
      {/* GeoTargetType  */}
      <Grid item xs={11}>
        <Paper
          elevation={1}
          sx={{
            borderRaidus: "15px",
            padding: "1rem",
          }}
        >
          <FormControl>
            <FormLabel id="geoTargetType">Select Target Type</FormLabel>
            <RadioGroup
              id="geoTargetType"
              value={formState?.inputs?.geoTargetType?.value}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                inputHandler("geoTargetType", event.target.value, true);
              }}
            >
              {Object.entries(selectGeoTargeting).map(([key, targetType]) => (
                <FormControlLabel
                  id={targetType}
                  name={targetType}
                  key={targetType}
                  control={<Radio value={key} />}
                  label={targetType}
                  sx={{ color: "text.secondary" }}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </Paper>
      </Grid>
    </>
  );
};

export default CreateCampaignStepOne;
