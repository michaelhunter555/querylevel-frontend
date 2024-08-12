import React from "react";

import { TooltipMessage } from "@/components/TooltipMessage/TooltipMessage";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { cpcBidSeparation } from "./shoppingCampaign.enums";

interface BidSeparator {
  onBidSeparationSelect: (val: number) => void;
  inputHandler: (id: string, val: number, isValid: boolean) => void;
  selectedBid: number | null;
}

export const BidSeparation: React.FC<BidSeparator> = ({
  onBidSeparationSelect,
  inputHandler,
  selectedBid,
}) => {
  const bidSeparationHandler = (val: cpcBidSeparation) => {
    onBidSeparationSelect(val);
    inputHandler("bidSeparation", val, true);
  };

  const title = "Bid Incrementation";
  const text =
    "ex. high < medium < low - The high priority campaign will receive the CpC bid you set, then the CpC bid will be incremented by the percentage you set.";

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "5px",
          width: "100%",
        }}
      >
        <Stack>
          <Typography>Bid Separation (%)</Typography>
        </Stack>
        <Stack>
          <TooltipMessage title={title} text={text} />
        </Stack>
      </Box>
      <Box
        sx={{
          display: "flex",
          gap: "5px",
          flexWrap: "wrap",
          width: "100%",
        }}
      >
        {Object.values(cpcBidSeparation)
          .filter((val) => typeof val === "number")
          .map((bid, i) => (
            <Chip
              key={i}
              size="medium"
              variant={selectedBid === bid ? "filled" : "outlined"}
              component={Button}
              label={`${(bid as cpcBidSeparation) * 100}%`}
              onClick={() => bidSeparationHandler(bid as cpcBidSeparation)}
              color="primary"
            />
          ))}
      </Box>
    </>
  );
};
