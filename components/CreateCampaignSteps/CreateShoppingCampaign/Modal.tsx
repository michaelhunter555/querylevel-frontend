import React from "react";

import { useSession } from "next-auth/react";
import Image from "next/image";

import { styledScroll } from "@/components/GoogleAuthButton/AuthStyles";
import CircleIcon from "@mui/icons-material/Circle";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import AlphaBetaDark from "../../../assets/alpha-beta-dark.svg";
import AlphaBetaLight from "../../../assets/alpha-beta-light.svg";
import ThreeTieredDark from "../../../assets/three-tier-dark.svg";
import ThreeTieredLight from "../../../assets/three-tier-light.svg";
import { StyledBoxContainer } from "../../Modal/ModalStyles";

const campaignDetails = [
  "Creates 2/3 campaigns, ad groups, product groups",
  "Adds Negative Keywords (brand, title, sku)",
  "Keywords allocated by priority",
  "Create Ad Schedule (optional)",
  "Sets Priority (high, medium, low)",
  "Cpc Bid separation (%)",
  "Set Target Locations",
  "Set Excluded Locations",
  "Set Budget (shared)",
  "Set Cost per Click",
  "Subdivides products by brand > product",
  "Create as paused/enabled",
  "Enabled Enhanced Cpc (optional)",
  "Edit & Manage in app",
];

const whyAlphaBeta =
  "Alpha-Beta Campaigns creates 2 Campaigns along side everything else in the details (left-panel). This campaign strategy is best suited for products that have generic product titles. For example, if you have a brand named 'Deluxium' and the product title '30x30in, 120LBS - DSK33232 - Round Coffee Table' then Alpha-Beta is more fitting because it's unlikely customers will search the exact product title. Instead, they are more likely to search 'brand' + 'generic phrase'. The alpha-Beta structure focuses on pushing all low quality search terms to the beta campaign (high priority). A low quality search term is a search term that suggests a user is in the interest-phase and therefore unlikely to buy (i.e. 'coffee tables on sale'). We don't rule out the customer just because of their search term. This is still a chance to introduce them (the user) to our website, but we will pay considerably less for their clicks. Only search terms related to the brand and/or sku 'Deluxium' will land in our low priority with a higher bid and for those terms we pay more for their likliness to convert. This is becuase the user is searching google for a said brand that you carry suggesting they know what they are looking for and now they just need to find a site they trust with a good price.";
const whyThreeTiered =
  "Three-tiered Campaigns are similar to Alpha-Beta campaigns in creation and purpose, but the major difference is there an additional campaign, ad group, product group, etc. The Three-tiered campaign structure is an optimal solution if you have product titles that are unique and/or catchy. For example, if you have a brand named 'Proform' and the product title is 'Hybrid Trainer Elliptical', then you may want to consider a 3-tiered structure. This campaign operation will set negative keywords at 3 levels with the highest set to receive all generic search terms, the medium to receive only brand + generic search terms and the low to receive all brand + product title + sku related search terms. This campaign structure adds a level of granularity and is a great way to impove your cost per acquisition.";

export const StrategyModal: React.FC<{
  open: boolean;
  onClose: () => void;
}> = ({ open, onClose }) => {
  const { data: session } = useSession();
  const modalHandler = () => {
    onClose();
  };

  const theme = session?.user?.theme;
  const alphaBetaImg = theme === "light" ? AlphaBetaLight : AlphaBetaDark;
  const ThreeTieredImg = theme === "light" ? ThreeTieredLight : ThreeTieredDark;

  return (
    <>
      <Modal open={open} onClose={modalHandler}>
        <StyledBoxContainer width="70%" sx={{ ...styledScroll }}>
          <Grid container direction="row">
            <Grid item xs={12} md={4}>
              <Stack spacing={3}>
                <Typography align="center" variant="h3" color="text.secondary">
                  What's Created
                </Typography>
                <Divider />
                <List>
                  {campaignDetails?.map((detail, i) => (
                    <ListItem key={i}>
                      <ListItemIcon>
                        <CircleIcon sx={{ fontSize: "10px" }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={detail}
                        sx={(theme) => ({
                          ...theme.typography.subtitle1,
                          color: theme.palette.text.secondary,
                        })}
                      />
                    </ListItem>
                  ))}
                </List>
              </Stack>
            </Grid>
            <Divider flexItem orientation="vertical" />
            <Grid item xs={12} md={7}>
              <Stack spacing={3} sx={{ paddingLeft: "1rem" }}>
                <Typography variant="h3" color="text.secondary">
                  Selecting a Strategy
                </Typography>
                <Divider />

                <Stack>
                  <Typography variant="h6" color="text.secondary">
                    Alpha-Beta Structure
                  </Typography>

                  <Typography
                    gutterBottom
                    variant="subtitle2"
                    color="text.secondary"
                  >
                    {whyAlphaBeta}
                  </Typography>
                  <Image
                    layout="response"
                    objectFit="contain"
                    src={alphaBetaImg}
                    alt="alpha-beta"
                  />
                </Stack>
                <Divider />
                <Stack>
                  <Typography variant="h6" color="text.secondary">
                    Three-Tiered Structure
                  </Typography>
                  <Typography
                    gutterBottom
                    variant="subtitle2"
                    color="text.secondary"
                  >
                    {whyThreeTiered}
                  </Typography>
                  <Image
                    layout="response"
                    objectFit="contain"
                    src={ThreeTieredImg}
                    alt="three-tiered"
                  />
                </Stack>
                <Alert severity="warning">
                  Campaigns still need to be monitored, managed and adjusted to
                  find what works best. Pro Plans have the option to manage
                  keywords with the one-click clean up service.
                </Alert>
              </Stack>
            </Grid>
          </Grid>

          <Button onClick={modalHandler}>Close</Button>
        </StyledBoxContainer>
      </Modal>
    </>
  );
};
