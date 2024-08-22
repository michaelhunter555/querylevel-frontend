import React from "react";

import { State } from "@/types";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import CircularProgress from "@mui/material/CircularProgress";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import FormLabel from "@mui/material/FormLabel";
import Grid from "@mui/material/Grid";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { selectBiddingStrategy } from "./CreateCampaign.enums";

interface BiddingStrategyProps {
  existingPortfolios: PortfolioStrategy[];
  loadingPortfolio: boolean;
  formState: State;
  isTargetRoas: boolean;
  openPortfolio: boolean;
  newPortfolioStrategy: boolean;
  isManualCpc: boolean;
  onManualCpc: () => void;
  onGetBidStrategies: () => void;
  onNewPortfolioStrategy: () => void;
  onOpenPortfolio: () => void;
  setIsTargetRoas: () => void;
  inputHandler: (
    id: string,
    value: string | number | boolean,
    isValid: boolean
  ) => void;
  isEditingMode?: boolean;
  currentStrategy?: number;
}

type PortfolioStrategy = {
  id: number;
  name: string;
  campaign_count: number;
};

export const BiddingStrategy = ({
  inputHandler,
  formState,
  setIsTargetRoas,
  isTargetRoas,
  isManualCpc,
  onManualCpc,
  openPortfolio,
  onOpenPortfolio,
  newPortfolioStrategy,
  onNewPortfolioStrategy,
  existingPortfolios,
  loadingPortfolio,
  onGetBidStrategies,
  currentStrategy,
}: BiddingStrategyProps) => {
  const isStandardStrategy = !openPortfolio;
  const isCreatingNewPortfolio = openPortfolio && !newPortfolioStrategy;
  const isUsingExistingPortfolio = openPortfolio && newPortfolioStrategy;

  const clearInputs = () => {
    inputHandler("newPortfolioStrategyName", "", true);
  };

  const clearAllInputs = () => {
    inputHandler("newPortfolioStrategyName", "", true);
    inputHandler("targetRoasValue", "", true);
  };

  return (
    <>
      <InputLabel>Select Bidding Strategy</InputLabel>

      <Select
        id="biddingStrategyType"
        name="biddingStrategyType"
        value={formState?.inputs?.biddingStrategyType?.value as number}
        onChange={(event: SelectChangeEvent<number>) => {
          inputHandler("biddingStrategyType", event.target.value, true);
          setIsTargetRoas();
          onManualCpc();
          clearAllInputs();
        }}
        sx={{ width: "100%" }}
      >
        {Object.entries(selectBiddingStrategy).map(([key, value]) => (
          <MenuItem key={value} value={key}>
            {value}
          </MenuItem>
        ))}
      </Select>

      <Grid item xs={11} sx={{ margin: "1rem 0" }}>
        {isManualCpc && (
          <Stack direction="row" alignItems="center" spacing={2}>
            {currentStrategy !== 3 && (
              <Stack>
                <InputLabel>Set Cpc Bid</InputLabel>

                <TextField
                  id="costPerClick"
                  name="costPerClick"
                  type="number"
                  value={formState?.inputs?.costPerClick?.value}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    inputHandler(
                      "costPerClick",
                      event.target.value,
                      Number(event.target.value) > 0
                    )
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                  }}
                  inputProps={{ step: 0.01 }}
                />
              </Stack>
            )}
            <FormGroup>
              <FormControlLabel
                id="enhancedClick"
                name="enhancedClick"
                label="Enable Enhanced CPC"
                control={
                  <Checkbox
                    value={formState?.inputs?.enhancedClick?.value as boolean}
                    checked={formState?.inputs?.enhancedClick?.value as boolean}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                      inputHandler("enhancedClick", event.target.checked, true)
                    }
                  />
                }
              />
            </FormGroup>
          </Stack>
        )}
        {isTargetRoas && (
          <>
            <Alert severity="warning">
              Accounts must have at least <code>15 conversions</code> in the{" "}
              <code>Last 30 Days</code> or update will fail.
            </Alert>
            <Stack
              sx={{
                flexDirection: { xs: "column", md: "row" },
                alignItems: { xs: "normal", md: "center" },
                gap: 2,
              }}
            >
              {isStandardStrategy && (
                <Stack>
                  <InputLabel>Target ROAS %</InputLabel>
                  <TextField
                    id="targetRoasValue"
                    name="targetRoasValue"
                    type="number"
                    value={formState?.inputs?.targetRoasValue?.value}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                      inputHandler(
                        "targetRoasValue",
                        event.target.value,
                        Number(event.target.value) > 0
                      )
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">%</InputAdornment>
                      ),
                    }}
                    inputProps={{ step: 1 }}
                  />
                </Stack>
              )}
              {isCreatingNewPortfolio && (
                <>
                  <Stack>
                    <InputLabel>Target ROAS %</InputLabel>
                    <TextField
                      id="targetRoasValue"
                      name="targetRoasValue"
                      type="number"
                      value={formState?.inputs?.targetRoasValue?.value}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                        inputHandler(
                          "targetRoasValue",
                          event.target.value,
                          event.target.value !== ""
                        )
                      }
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">%</InputAdornment>
                        ),
                      }}
                      inputProps={{ step: 1 }}
                    />
                  </Stack>
                  <Stack>
                    <InputLabel id="newPortfolioStrategyName">Name</InputLabel>
                    <TextField
                      id="newPortfolioStrategyName"
                      name="newPortfolioStrategyName"
                      type="text"
                      value={formState?.inputs?.newPortfolioStrategyName?.value}
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement>
                      ) => {
                        inputHandler(
                          "newPortfolioStrategyName",
                          event.target.value,
                          event.target.value !== ""
                        );
                      }}
                    />
                  </Stack>
                </>
              )}

              {loadingPortfolio && isUsingExistingPortfolio && (
                <CircularProgress />
              )}
              {!loadingPortfolio &&
                isUsingExistingPortfolio &&
                existingPortfolios?.length === 0 && (
                  <Typography variant="subtitle2" color="text.secondary">
                    No existing portfolio strategies found.
                  </Typography>
                )}
              {!loadingPortfolio &&
                isUsingExistingPortfolio &&
                existingPortfolios?.length > 0 && (
                  <Select
                    id="targetRoasStrategyId"
                    name="targetRoasStrategyId"
                    value={
                      formState?.inputs?.targetRoasStrategyId?.value as string
                    }
                    onChange={(event: SelectChangeEvent) =>
                      inputHandler(
                        "targetRoasStrategyId",
                        event.target.value,
                        event.target.value !== ""
                      )
                    }
                  >
                    {existingPortfolios?.map(
                      (portfolio: PortfolioStrategy, i) => (
                        <MenuItem key={portfolio?.id} value={portfolio?.id}>
                          {portfolio?.name} - {portfolio?.campaign_count}
                        </MenuItem>
                      )
                    )}
                  </Select>
                )}
              <Stack>
                <Button
                  onClick={() => {
                    onOpenPortfolio();
                    clearInputs();
                  }}
                >
                  {openPortfolio
                    ? "Standard Strategies"
                    : "Portfolio Strategy ?"}
                </Button>
              </Stack>
            </Stack>
          </>
        )}
      </Grid>
      {openPortfolio && isTargetRoas && (
        <Grid item xs={11}>
          <Stack>
            <FormControl>
              <FormLabel id="portfolioStrategy">
                {"Create New Portfolio"}
              </FormLabel>
              <RadioGroup
                id="existingPortfolioStrategy"
                name="existingPortfolioStrategy"
                value={
                  formState?.inputs?.existingPortfolioStrategy?.value ||
                  formState?.inputs?.biddingStrategyType.value === 3
                }
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  inputHandler(
                    "existingPortfolioStrategy",
                    event.target.value,
                    true
                  )
                }
              >
                <FormControlLabel
                  value={false}
                  control={<Radio />}
                  label="Create New Portfolio Strategy"
                  sx={{ color: "text.secondary" }}
                  onChange={() => {
                    onNewPortfolioStrategy();
                  }}
                />

                <FormControlLabel
                  value={true}
                  control={<Radio />}
                  label="Use Existing Portfolio Strategy"
                  sx={{ color: "text.secondary" }}
                  onChange={() => {
                    onGetBidStrategies();
                    onNewPortfolioStrategy();
                  }}
                />
              </RadioGroup>
            </FormControl>
          </Stack>
        </Grid>
      )}
    </>
  );
};

export default BiddingStrategy;
