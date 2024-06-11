import React from "react";

import Image from "next/image";

import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import CampaignImage from "../../assets/shoppings-ads-bot.png";

export const KnowledgeBase = () => {
  return (
    <Paper elevation={0}>
      <div style={{ width: "100%", height: "400px" }}>
        <Image
          src={CampaignImage}
          alt="campaign-structure"
          height={400}
          style={{ objectFit: "contain" }}
        />
      </div>
      <Typography>What you're seeing here...</Typography>
    </Paper>
  );
};
