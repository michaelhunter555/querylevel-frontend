import React from "react";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";

const features = [
  {
    id: 1,
    name: "Tiered Campaigns",
    description:
      "Create alpha/beta and tiered campaigns to improve CPA and quality score",
    icon: "",
  },
  {
    id: 2,
    name: "Shopping Ads Management",
    description: "Manage keywords, campaigns, ad groups and product groups",
    icon: "",
  },
  {
    id: 3,
    name: "Dedicated Support Group",
    description:
      "Contact us @appName.com or get instant support by joining our discord.",
    icon: "",
  },
];
export const AppFeatures = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        gap: "10px",
        margin: "1rem auto",
      }}
    >
      {features.map((feature, i) => (
        <Card
          key={feature.id}
          sx={{
            border: "1px solid #90caf9",

            height: "300px",
          }}
        >
          <Typography
            color="text.secondary"
            variant="h6"
            alignContent={"center"}
          >
            {feature.name}
          </Typography>
          <Divider sx={{ width: "100%" }} />
          <Box>
            <Typography color="text.secondary" variant="subtitle1">
              {feature.description}
            </Typography>
          </Box>
        </Card>
      ))}
    </Box>
  );
};
