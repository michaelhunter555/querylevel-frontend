import React, { useState } from "react";

import DevicesRoundedIcon from "@mui/icons-material/DevicesRounded";
import EdgesensorHighRoundedIcon from "@mui/icons-material/EdgesensorHighRounded";
import ViewQuiltRoundedIcon from "@mui/icons-material/ViewQuiltRounded";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

const shadow =
  "0 0 10px rgba(2, 31, 59, 0.7),1px 1.5px 2px -1px rgba(2, 31, 59, 0.65),4px 4px 12px -2.5px rgba(2, 31, 59, 0.65)";
const imgStyles = {
  boxShadow: { xs: "none", md: `${shadow}` },
  borderRadius: { xs: "none", md: "10px" },
  width: "100%",
  height: "100%",
};

const items = [
  {
    icon: <ViewQuiltRoundedIcon />,
    title: "Shopping Performance Analytics",
    description: "View performance on daily, 7, 14, monthly, and last 30 days.",
    imageLight: (
      <CardMedia
        component="img"
        src="/home-dash-light.png"
        alt={`Features`}
        sx={{ ...imgStyles, objectFit: "contain" }}
      />
    ),
    imageDark: (
      <CardMedia
        component="img"
        src="/home-dash-dark.png"
        alt={`Features`}
        sx={{ ...imgStyles, objectFit: "contain" }}
      />
    ),
  },
  {
    icon: <EdgesensorHighRoundedIcon />,
    title: "Manage Campaigns",
    description:
      "View, edit and manage the performance of indivual campaigns, ad groups & product groups",
    imageLight: (
      <CardMedia
        component="img"
        src="/use-campaign-light.png"
        alt={`Features`}
        sx={{ ...imgStyles, objectFit: "contain" }}
      />
    ),
    imageDark: (
      <CardMedia
        component="img"
        src="/use-campaign-dark.png"
        alt={`Features`}
        sx={{ ...imgStyles, objectFit: "contain" }}
      />
    ),
  },
  {
    icon: <DevicesRoundedIcon />,
    title: "Search Terms & more",
    description:
      "Add, Edit and remove negative keywords as you please for both campaign and ad group levels.",
    imageLight: (
      <CardMedia
        component="img"
        src="/search-terms-light.png"
        alt={`Features`}
        sx={{ ...imgStyles, objectFit: "contain" }}
      />
    ),
    imageDark: (
      <CardMedia
        component="img"
        src="/search-terms-dark.png"
        alt={`Features`}
        sx={{ ...imgStyles, objectFit: "contain" }}
      />
    ),
  },
];

interface AppFeatures {
  mode: string;
}

export const Features = ({ mode }: AppFeatures) => {
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);

  const handleItemClick = (index: number) => {
    setSelectedItemIndex(index);
  };

  const selectedFeature = items[selectedItemIndex];

  return (
    <Container id="features" sx={{ py: { xs: 8, sm: 16 } }}>
      <Grid container spacing={6}>
        <Grid item xs={12} md={4}>
          <div>
            <Typography component="h2" variant="h4" color="text.primary">
              Centralized Shopping Experience
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mb: { xs: 2, sm: 4 } }}
            >
              Not only can you easily create campaigns in a few clicks. You can
              also view and modify your manage & edit Shopping campaign
              performance
            </Typography>
          </div>
          <Grid
            container
            item
            gap={1}
            sx={{ display: { xs: "auto", sm: "none" } }}
          >
            {items.map(({ title }, index) => (
              <Chip
                key={index}
                label={title}
                onClick={() => handleItemClick(index)}
                sx={{
                  borderColor: (theme) => {
                    if (theme.palette.mode === "light") {
                      return selectedItemIndex === index ? "primary.light" : "";
                    }
                    return selectedItemIndex === index ? "primary.light" : "";
                  },
                  background: (theme) => {
                    if (theme.palette.mode === "light") {
                      return selectedItemIndex === index ? "none" : "";
                    }
                    return selectedItemIndex === index ? "none" : "";
                  },
                  backgroundColor:
                    selectedItemIndex === index ? "primary.main" : "",
                  "& .MuiChip-label": {
                    color: selectedItemIndex === index ? "#fff" : "",
                  },
                }}
              />
            ))}
          </Grid>
          <Box
            component={Card}
            variant="outlined"
            sx={{
              display: { xs: "auto", sm: "none" },
              mt: 4,
            }}
          >
            {mode === "dark"
              ? items[selectedItemIndex].imageDark
              : items[selectedItemIndex].imageLight}

            <Box sx={{ px: 2, pb: 2 }}>
              <Typography
                color="text.primary"
                variant="body2"
                fontWeight="bold"
              >
                {selectedFeature.title}
              </Typography>
              <Typography
                color="text.secondary"
                variant="body2"
                sx={{ my: 0.5 }}
              >
                {selectedFeature.description}
              </Typography>
            </Box>
          </Box>
          <Stack
            direction="column"
            justifyContent="center"
            alignItems="flex-start"
            spacing={2}
            useFlexGap
            sx={{ width: "100%", display: { xs: "none", sm: "flex" } }}
          >
            {items.map(
              ({ icon, title, description, imageLight, imageDark }, index) => (
                <Card
                  key={index}
                  variant="outlined"
                  component={Button}
                  onClick={() => handleItemClick(index)}
                  sx={{
                    p: 3,
                    height: "fit-content",
                    width: "100%",
                    background: "none",
                    backgroundColor:
                      selectedItemIndex === index
                        ? "action.selected"
                        : undefined,
                    borderColor: (theme) => {
                      if (theme.palette.mode === "light") {
                        return selectedItemIndex === index
                          ? "primary.light"
                          : "grey.200";
                      }
                      return selectedItemIndex === index
                        ? "primary.dark"
                        : "grey.800";
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: "100%",
                      display: "flex",
                      textAlign: "left",
                      flexDirection: { xs: "column", md: "row" },
                      alignItems: { md: "center" },
                      gap: 2.5,
                    }}
                  >
                    <Box
                      sx={{
                        color: (theme) => {
                          if (theme.palette.mode === "light") {
                            return selectedItemIndex === index
                              ? "primary.main"
                              : "grey.300";
                          }
                          return selectedItemIndex === index
                            ? "primary.main"
                            : "grey.700";
                        },
                      }}
                    >
                      {icon}
                    </Box>
                    <Box sx={{ textTransform: "none" }}>
                      <Typography
                        color="text.primary"
                        variant="body2"
                        fontWeight="bold"
                      >
                        {title}
                      </Typography>
                      <Typography
                        color="text.secondary"
                        variant="body2"
                        sx={{ my: 0.5 }}
                      >
                        {description}
                      </Typography>
                    </Box>
                  </Box>
                </Card>
              )
            )}
          </Stack>
        </Grid>
        <Grid
          item
          xs={12}
          md={8}
          sx={{ display: { xs: "none", sm: "flex" }, width: "100%" }}
        >
          <Card
            variant="outlined"
            sx={{
              height: "100%",
              width: "100%",
              display: { xs: "none", sm: "flex" },
              pointerEvents: "none",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "transparent",
              boxShadow: imgStyles.boxShadow,
            }}
          >
            {mode === "dark"
              ? items[selectedItemIndex].imageDark
              : items[selectedItemIndex].imageLight}
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};
