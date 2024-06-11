import React, { useState } from "react";

import Image from "next/image";

import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CardMedia from "@mui/material/CardMedia";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

import CampaignProductGroups from "../../assets/campaignsview.png";
import ShoppingDash from "../../assets/GoogleShoppingProject.png";
import ManageSearchTerms from "../../assets/manageSearchTerms.png";

const CardMediaStyles = styled(CardMedia)(({ theme }) => ({
  position: "relative",
  width: "auto",
  height: "auto",
}));

interface ClickSlideProps {
  togglePaletteImage: string;
}

export const ClickSliderFeatures = ({
  togglePaletteImage,
}: ClickSlideProps) => {
  const [countIndex, setCountIndex] = useState(0);

  const featuresArray = [
    {
      id: 0,
      imageSrc: ShoppingDash,
      descriptionTitle: "Shopping dashboard",
      descriptionText:
        "Immediately view your shopping performance across all shopping campaigns on load. No need to click around or aggregate information to find out how your main source of income is doing. View Segments of Today, Yesterday, last 7 Days, last 14 Days, This Month and last 30 Days.",
      alt: "home-dash",
    },
    {
      id: 1,
      imageSrc: CampaignProductGroups,
      descriptionTitle: "Campaign Product Groups",
      descriptionText:
        "Manage and update your product groups on a brand and product id level. Simplify how you segment your campaigns by focusing on one brand per campaign and the products within that brand.",
      alt: "campaign-product-group-view",
    },
    {
      id: 2,
      imageSrc: ManageSearchTerms,
      descriptionTitle: "Manage Search Terms",
      descriptionText:
        "View search term on Daily, Weekly, Bi-Weekly and Monthly basis. You can add negative keywords, filter for keywords  and select on whether to add the keyword at the ad group or campaign level.",
      alt: "search-term-view",
    },
  ];

  const handleCountIncrement = () => {
    setCountIndex((prev) =>
      prev < featuresArray?.length - 1 ? prev + 1 : prev
    );
  };

  const handleCountDecrement = () => {
    setCountIndex((prev) => (prev !== 0 ? prev - 1 : prev));
  };

  const feature = featuresArray[countIndex];

  return (
    <Box>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="center"
      ></Stack>
      <Grid
        container
        direction={"row"}
        alignItems={"center"}
        justifyContent={"center"}
        spacing={2}
      >
        <Button onClick={handleCountDecrement} disabled={countIndex === 0}>
          <ArrowBackIosIcon />
        </Button>

        <Grid key={feature.id} item xs={12} md={5}>
          <CardMediaStyles
            title="Image"
            sx={{
              margin: "0 auto",
              border: `1px solid ${
                togglePaletteImage === "light" ? "white" : "#777"
              } `,
              borderRadius: "15px",
            }}
          >
            <Image
              src={feature?.imageSrc}
              alt={feature?.alt}
              layout="responsive"
              objectFit="cover"
              style={{ borderRadius: "15px" }}
            />
          </CardMediaStyles>
        </Grid>
        <Grid item xs={12} md={5}>
          <Stack alignItems={"center"}>
            <Paper sx={{ padding: "1.5rem", borderRadius: "15px" }}>
              <Typography color="text.secondary" variant="h2">
                {feature?.descriptionTitle}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                {feature?.descriptionText}
              </Typography>
            </Paper>
          </Stack>
        </Grid>
        <Button
          onClick={handleCountIncrement}
          disabled={countIndex === featuresArray.length - 1}
        >
          <ArrowForwardIosIcon />
        </Button>
      </Grid>
    </Box>
  );
};

/**
 *   <>
        
      <Grid key={i} item xs={12} md={5}>
        <CardMediaStyles
          title="Image"
          sx={{
            margin: "0 auto",
            border: `1px solid ${
              togglePaletteImage === "light" ? "white" : "#777"
            } `,
            borderRadius: "15px",
          }}
        >
          <Image
            src={feature.id === i ? feature.imageSrc}
            alt="campaign-structure"
            layout="responsive"
            objectFit="cover"
            style={{ borderRadius: "15px" }}
          />
        </CardMediaStyles>
      </Grid>
      
      <Grid item xs={12} md={5}>
        <Stack alignItems={"center"}>
          <Paper sx={{ padding: "1.5rem", borderRadius: "15px" }}>
            <Typography color="text.secondary" variant="h2">
              Shopping Dashboard
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Immediately view your shopping performance across all shopping
              campaigns on load. No need to click around or aggregate
              information to find out how your main source of income is doing.
              View Segments of Today, Yesterday, last 7 Days, last 14 Days, This
              Month and last 30 Days.
            </Typography>
          </Paper>
        </Stack>
      </Grid>
        </>
 */
