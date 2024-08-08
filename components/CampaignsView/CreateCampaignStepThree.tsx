import React from "react";

import Link from "next/link";

import { State } from "@/types";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import {
  selectBiddingStrategy,
  selectCampaignPriority,
  selectGeoTargeting,
} from "./CreateCampaign.enums";

type CreateCampaignStepThree = {
  formState: State;
  onCreateCampaign: () => void;
  inputHandler: (
    id: string,
    value: string | number | boolean,
    isValid: boolean
  ) => void;
  //onClose: () => void;
};

const CreateCampaignStepThree = ({
  formState,
  onCreateCampaign,
  inputHandler,
}: // onClose,
CreateCampaignStepThree) => {
  const budgetIsShared =
    formState?.inputs?.budgetShared?.value === true ? "Shared" : "Individual";
  const budgetAmount = formState?.inputs?.budgetAmount?.value as number;

  const priority = formState?.inputs?.campaignPriority?.value;
  const biddingStrategyType = formState?.inputs?.biddingStrategyType?.value;
  const inventoryFilters = formState?.inputs?.inventoryFilters?.value;
  const geoTargetType = formState?.inputs?.geoTargetType?.value;
  const budgetName = formState?.inputs?.budgetName?.value;
  const costPerClick = formState?.inputs?.costPerClick?.value;
  const targetRoas = formState?.inputs?.targetRoas?.value;
  const targetRoasValue = formState?.inputs?.targetRoasValue?.value;

  const hasBudgetName = budgetName === "" ? "⚠️ name not added!" : budgetName;

  const targetGoogleSearch =
    formState?.inputs?.targetGoogleSearch?.value === true
      ? "Google Search"
      : "";
  const targetSearchNetwork =
    formState?.inputs?.targetSearchNetwork?.value === true
      ? "Search Network"
      : "";
  const targetContentNetwork =
    formState?.inputs?.targetContentNetwork?.value === true
      ? "Content Network"
      : "";

  const networks = [
    targetGoogleSearch,
    targetSearchNetwork,
    targetContentNetwork,
  ];

  const biddingStrategy =
    selectBiddingStrategy[biddingStrategyType as number].toLowerCase() ===
    "manual cpc" ? (
      <>
        {selectBiddingStrategy[biddingStrategyType as number].toLowerCase()} - $
        {costPerClick}
      </>
    ) : (
      <>
        {selectBiddingStrategy[biddingStrategyType as number].toLowerCase()} -{" "}
        {targetRoas ? targetRoas : targetRoasValue ? targetRoasValue : ""}%
      </>
    );

  return (
    <Paper
      sx={{
        padding: "1rem",
        borderRadius: "15px",
        margin: "2rem auto",
      }}
    >
      <Stack
        sx={{
          flexDirection: "row",
          alignItems: "start",
          gap: 1,
          flexWrap: "wrap",
        }}
      >
        {/* Campaign Name, Budget, Geo Target Type */}
        <Grid item xs={12} md={4}>
          <Grid item xs={12} md={8}>
            <Stack sx={{ width: "100%" }}>
              <Stack>
                <Typography variant="subtitle2" color="text.secondary">
                  Name:
                </Typography>
              </Stack>
              <Stack>
                <Chip color="info" label={hasBudgetName as string} />
              </Stack>
            </Stack>
          </Grid>

          <Grid item xs={12} md={8}>
            <Stack>
              <Stack>
                <Typography variant="subtitle2" color="text.secondary">
                  Daily Budget:
                </Typography>
              </Stack>
              <Stack>
                <Chip color="info" label={`$ ${budgetAmount} per day`} />
              </Stack>
            </Stack>
          </Grid>

          <Grid item xs={12} md={8}>
            <Stack>
              <Stack>
                <Typography variant="subtitle2" color="text.secondary">
                  Bidding Strategy:
                </Typography>
              </Stack>
              <Stack>
                <Chip color="info" label={biddingStrategy} />
              </Stack>
            </Stack>
          </Grid>

          <Grid item xs={12} md={8}>
            <Stack>
              <Stack>
                <Typography variant="subtitle2" color="text.secondary">
                  Target Type:
                </Typography>
              </Stack>
              <Stack>
                <Chip
                  color="info"
                  label={selectGeoTargeting[
                    geoTargetType as keyof typeof selectGeoTargeting
                  ].toLowerCase()}
                />
              </Stack>
            </Stack>
          </Grid>
        </Grid>

        <Divider orientation="vertical" flexItem />
        {/* All other related campaign info */}
        <Grid item xs={7}>
          <Stack direction="row" alignItems="flex-start" spacing={2}>
            <Stack spacing={2}>
              <Grid item xs={12}>
                <Stack>
                  <Stack>
                    <Typography variant="h6" color="text.secondary">
                      Filter:
                    </Typography>
                  </Stack>
                  <Stack>
                    <Chip
                      label={
                        !!inventoryFilters
                          ? (inventoryFilters as string).split("=")[1]
                          : "None"
                      }
                    />
                  </Stack>
                </Stack>
              </Grid>

              <Grid item xs={12}>
                <Stack>
                  <Stack>
                    <Typography variant="h6" color="text.secondary">
                      Priority:
                    </Typography>
                  </Stack>
                  <Stack>
                    <Chip
                      label={selectCampaignPriority[
                        priority as number
                      ].toLowerCase()}
                    />
                  </Stack>
                </Stack>
              </Grid>
            </Stack>

            <Stack spacing={2}>
              <Grid item xs={12}>
                <Stack>
                  <Stack>
                    <Typography variant="h6" color="text.secondary">
                      Status:
                    </Typography>
                  </Stack>
                  <Stack>
                    <Chip
                      label={
                        formState?.inputs?.campaignEnabled?.value === true
                          ? "Active"
                          : "Paused"
                      }
                    />
                  </Stack>
                </Stack>
              </Grid>

              <Grid item xs={12}>
                <Stack>
                  <Stack>
                    <Typography variant="h6" color="text.secondary">
                      Advertising Networks:
                    </Typography>
                  </Stack>
                  <Stack spacing={1}>
                    {networks &&
                      networks
                        ?.filter((val) => !!val)
                        ?.map((network, i) => (
                          <Chip
                            key={i}
                            label={network && network}
                            sx={{ fontSize: "11px" }}
                          />
                        ))}
                  </Stack>
                </Stack>
              </Grid>
            </Stack>

            <Stack spacing={2}>
              <Grid item xs={12}>
                <Stack>
                  <Stack>
                    <Typography variant="h6" color="text.secondary">
                      Budget Type:
                    </Typography>
                  </Stack>
                  <Stack>
                    <Chip label={budgetIsShared} />
                  </Stack>
                </Stack>
              </Grid>

              <Grid item xs={12}>
                <Stack>
                  <Stack>
                    <Typography variant="h6" color="text.secondary">
                      Target Country:
                    </Typography>
                  </Stack>
                  <Stack>
                    <Chip label={"United States"} />
                  </Stack>
                </Stack>
              </Grid>
            </Stack>
          </Stack>
          <Divider flexItem sx={{ margin: "0.5rem 0" }} />
          <Grid item xs={12}>
            <Typography variant="h6" color="text.secondary">
              What's Done for you:
            </Typography>
            <Typography variant="caption" color="text.secondary">
              As apart of this shopping campaign creation, we will also create
              an ad group (similar to your campaign name) & product group for
              all products.
            </Typography>
          </Grid>
        </Grid>
      </Stack>

      <Divider sx={{ margin: "0.5rem 0" }} />

      <Grid
        item
        xs={12}
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          width: "100%",
        }}
      >
        <FormGroup
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
            margin: "1rem",
          }}
        >
          <FormControlLabel
            control={
              <Checkbox
                id="campaignEnabled"
                name="campaignEnabled"
                defaultChecked={
                  formState?.inputs?.campaignEnabled?.value as boolean
                }
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  inputHandler("campaignEnabled", event.target.checked, true)
                }
              />
            }
            label="Enable Campaigns"
            sx={{ color: "text.secondary" }}
          />
        </FormGroup>

        <Stack spacing={2} direction="row" alignItems="center">
          <Button
            variant="outlined"
            component={Link}
            href="/campaign-view"
            color="error"
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={onCreateCampaign}
            disabled={!formState.isValid}
          >
            Create Campaign
          </Button>
        </Stack>
      </Grid>
    </Paper>
  );
};

export default CreateCampaignStepThree;
