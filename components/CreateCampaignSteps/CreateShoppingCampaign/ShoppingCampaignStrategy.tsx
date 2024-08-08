import React, { useState } from "react";

import { useSession } from "next-auth/react";

import TableRowsTwoToneIcon from "@mui/icons-material/TableRowsTwoTone";
import ViewStreamTwoToneIcon from "@mui/icons-material/ViewStreamTwoTone";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { ShoppingCampaignTypes } from "./shoppingCampaign.enums";

const threeTiered = ShoppingCampaignTypes.THREE_TIERED;
const alphaBeta = ShoppingCampaignTypes.ALPHA_BETA;
const LIGHT = "light";

export const ShoppingCampaignStrategy: React.FC<{
  onClick: (val: ShoppingCampaignTypes) => void;
}> = ({ onClick }): JSX.Element => {
  const { data: session } = useSession();
  const [campaignType, setCampaignType] = useState<ShoppingCampaignTypes | "">(
    ""
  );

  const campaignTypeHandler = (value: ShoppingCampaignTypes) => {
    setCampaignType(value);
    onClick(value);
  };

  return (
    <Grid container direction="row" alignItems="center" justifyContent="center">
      <Grid
        item
        xs={12}
        sm={5.5}
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <Stack
          justifyContent="center"
          alignItems="center"
          sx={{
            padding: 2,
            cursor: "pointer",
            border:
              campaignType === alphaBeta
                ? `1px solid ${
                    session?.user?.theme === LIGHT ? "black" : "white"
                  }`
                : "1px solid transparent",
            borderRadius: "15px",
          }}
          onClick={() => campaignTypeHandler(alphaBeta)}
        >
          <ViewStreamTwoToneIcon fontSize="large" />
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ fontWeight: 650 }}
          >
            Alpha-Beta Campaign
          </Typography>
          <Typography variant="subtitle2" color="text.secondary">
            Creates two campaigns with a high & low priority settings.
          </Typography>
        </Stack>
      </Grid>
      <Divider orientation="vertical" flexItem sx={{ margin: "1rem" }} />
      <Grid
        item
        xs={12}
        sm={5.5}
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <Stack
          justifyContent="center"
          alignItems="center"
          sx={{
            padding: 2,
            cursor: "pointer",
            border:
              campaignType === threeTiered
                ? `1px solid ${
                    session?.user?.theme === LIGHT ? "black" : "white"
                  }`
                : "1px solid transparent",
            borderRadius: "15px",
          }}
          onClick={() => campaignTypeHandler(threeTiered)}
        >
          <TableRowsTwoToneIcon fontSize="large" />
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ fontWeight: 650 }}
          >
            Three-tiered Campaign
          </Typography>
          <Typography variant="subtitle2" color="text.secondary">
            Creates 3 campaigns with a high, medium & low settings.
          </Typography>
        </Stack>
      </Grid>
    </Grid>
  );
};
