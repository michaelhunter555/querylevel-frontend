import React from "react";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";

import { ShoppingCampaignTypes } from "./shoppingCampaign.enums";

type BidSeparationExample = {
  bidSeparation: number;
  costPerClick: number;
  campaignType: ShoppingCampaignTypes | "";
};

export const BidSeparationTableExample = ({
  bidSeparation,
  costPerClick,
  campaignType,
}: BidSeparationExample) => {
  let bidSeparationArray = [];
  let loops = 3;
  if (campaignType === ShoppingCampaignTypes.ALPHA_BETA) {
    loops = 2;
  }

  const roundToTwo = (value: number) => Number(value.toFixed(2));

  let initialCostPerClick = costPerClick;

  for (let i = 0; i < loops; i++) {
    if (i === 0) {
      bidSeparationArray.push(roundToTwo(costPerClick));
    } else if (i === 1) {
      costPerClick =
        initialCostPerClick + initialCostPerClick * (1 * bidSeparation);
      bidSeparationArray.push(roundToTwo(costPerClick));
    } else {
      costPerClick =
        initialCostPerClick + initialCostPerClick * (2 * bidSeparation);
      bidSeparationArray.push(roundToTwo(costPerClick));
    }
  }

  return (
    <TableContainer>
      <Table sx={{ maxWidth: "100%" }}>
        <TableHead>
          <TableRow>
            <TableCell>High</TableCell>
            {loops !== 2 && <TableCell>Medium</TableCell>}
            <TableCell>Low</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            {bidSeparationArray.map((val, i) => (
              <TableCell key={i}>
                <Typography variant="subtitle2" color="text.secondary">
                  {!isNaN(val) && costPerClick > 0 ? val.toFixed(2) : 0}
                </Typography>
              </TableCell>
            ))}
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};
