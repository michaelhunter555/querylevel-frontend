import React from "react";

import AutoFixHighRoundedIcon from "@mui/icons-material/AutoFixHighRounded";
import BookIcon from "@mui/icons-material/Book";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import QueryStatsRoundedIcon from "@mui/icons-material/QueryStatsRounded";
import SettingsSuggestRoundedIcon from "@mui/icons-material/SettingsSuggestRounded";
import SupportAgentRoundedIcon from "@mui/icons-material/SupportAgentRounded";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

const items = [
  {
    icon: <SettingsSuggestRoundedIcon />,
    title: "Quickly Build Campaigns",
    description:
      "Effortlessly turn what would be 22 tasks into 1-4 clicks. No need to worry about making mistakes.",
  },
  {
    icon: <BookIcon />,
    title: "Backed by Scholarly Research",
    description:
      "The strategies we offer are based on scholarly academic research. source (Raffinot & Riviere, 2014) - Query Level Matching",
    link: (
      <Link href="https://arxiv.org/pdf/1708.04586" target="_blank">
        View Article
      </Link>
    ),
  },
  {
    icon: <ManageAccountsIcon />,
    title: "Flexible Management options",
    description:
      "Manage your campaigns, ad groups, product groups, ad schedule, locations and general campaign settings in a streamlined manner.",
  },
  {
    icon: <AutoFixHighRoundedIcon />,
    title: "Account Management Capabilities",
    description:
      "We don't just let you create tiered campaigns. You can edit, remove and update your campaigns, manage keywords, locations, schedules, conversions, etc.",
  },
  {
    icon: <SupportAgentRoundedIcon />,
    title: "Reliable support",
    description:
      "Our goal is to help you build successful campaigns that improve ad quality and cpa. Our team is always here to answer your questions and guide you.",
  },
  {
    icon: <QueryStatsRoundedIcon />,
    title: "Simplified for the Individual",
    description:
      "You don't need to pay hundreds or even thousands for someone to come in and manually do this anymore. You are the captain of your ship.",
  },
];

export default function Highlights() {
  return (
    <Box
      id="highlights"
      sx={{
        pt: { xs: 4, sm: 12 },
        pb: { xs: 8, sm: 16 },
        color: "white",
        bgcolor: "#06090a",
        width: "100%",
        margin: "0 auto",
      }}
    >
      <Container
        sx={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: { xs: 3, sm: 6 },
        }}
      >
        <Box
          sx={{
            width: { sm: "100%", md: "60%" },
            textAlign: { sm: "left", md: "center" },
          }}
        >
          <Typography component="h2" variant="h4">
            What you're Getting.
          </Typography>
          <Typography variant="body1" sx={{ color: "grey.400" }}>
            Query Level offers a streamlined Google shopping experience meaning
            there are other creating, editing and mangement features available.
          </Typography>
        </Box>
        <Grid container spacing={2.5}>
          {items.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Stack
                direction="column"
                color="inherit"
                component={Card}
                spacing={1}
                useFlexGap
                sx={{
                  p: 3,
                  height: "100%",
                  border: "1px solid",
                  borderColor: "grey.800",
                  background: "transparent",
                  backgroundColor: "grey.900",
                }}
              >
                <Box sx={{ opacity: "50%" }}>{item.icon}</Box>
                <div>
                  <Typography fontWeight="medium" gutterBottom>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "grey.400" }}>
                    {item.description}
                  </Typography>
                  {item.link && item.link}
                </div>
              </Stack>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
