import {
  Animator,
  batch,
  Fade,
  Move,
  MoveIn,
  MoveOut,
  ScrollContainer,
  ScrollPage,
  Sticky,
} from "react-scroll-motion";

import { useCheckDevice } from "@/hooks/use-device-hook";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import {
  Avatar,
  CardMedia,
  Divider,
  PaletteMode,
  Stack,
  Typography,
} from "@mui/material";

import { SignInWithGoogle } from "../Signup/GoogleSignUp";

interface IScrollAnimation {
  mode: PaletteMode;
}
const queryLevelLogo =
  "https://res.cloudinary.com/dtqbxfe7r/image/upload/v1736699850/Untitled_design_3_vqv38c.svg";
const ShoppingSearchImg =
  "https://res.cloudinary.com/dtqbxfe7r/image/upload/v1736627423/shopping_search_image_nuvvrg.svg";
const googleAdsIcon =
  "https://res.cloudinary.com/dtqbxfe7r/image/upload/v1736627616/googleAds_xcwflc.png";
const googleShoppingIcon =
  "https://res.cloudinary.com/dtqbxfe7r/image/upload/v1736627616/googleShopping_nbf7ts.png";

const buyerFunnel =
  "https://res.cloudinary.com/dtqbxfe7r/image/upload/v1736701633/shopping_search_image_2_sogzxw.svg";

const analytics =
  "https://res.cloudinary.com/dtqbxfe7r/image/upload/v1736704020/19_gnqlyg.svg";

const sitePreview =
  "https://res.cloudinary.com/dtqbxfe7r/image/upload/v1736704020/20_yrdrsn.svg";
const HomeScrollAnimation = ({ mode }: IScrollAnimation) => {
  const { isMobile } = useCheckDevice();
  const ZoomInScrollOut = batch(Fade(), Sticky(), MoveOut(0, -200));
  const FadeUp = batch(Fade(), Move(), Sticky());

  return (
    <ScrollContainer>
      <ScrollPage>
        <Animator animation={ZoomInScrollOut}>
          <Stack
            alignItems="center"
            direction="column"
            sx={{ margin: "1rem auto" }}
            spacing={2}
          >
            <Stack alignItems="center" sx={{ width: "100%" }}>
              <Animator animation={MoveOut(-200, 0)}>
                <CardMedia
                  component="img"
                  src={queryLevelLogo}
                  alt="scrollytelling_logo"
                />
              </Animator>
              <Animator
                style={{ marginBottom: "1rem" }}
                animation={MoveOut(200, 0)}
              >
                <SignInWithGoogle />
              </Animator>
              <Typography
                align="center"
                sx={{ fontSize: isMobile ? 11 : "20px" }}
              >
                We Combined essential features from Google Ads & Google Shopping
              </Typography>
            </Stack>
            <Divider flexItem />
            <Stack
              direction="row"
              justifyContent="center"
              alignItems="center"
              spacing={2}
              sx={{ width: "100%" }}
            >
              <Avatar src={googleAdsIcon} />
              <Typography>+</Typography>
              <Avatar src={googleShoppingIcon} />
            </Stack>
          </Stack>
        </Animator>
      </ScrollPage>
      <ScrollPage>
        <Animator animation={batch(Fade(), Sticky(), MoveOut(0, -200))}>
          <Typography align="center" sx={{ fontSize: isMobile ? 14 : "20px" }}>
            To allow you to quickly build professionally structured Google
            Shopping Campaigns.
          </Typography>
          <Animator
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              margin: "1rem auto",
            }}
            animation={MoveOut(200, 0)}
          >
            <CardMedia
              src={ShoppingSearchImg}
              alt="shopping_image_"
              component="img"
              sx={{
                width: isMobile ? "100%" : 400,
                height: isMobile ? "100%" : 400,
              }}
            />
          </Animator>
        </Animator>
      </ScrollPage>
      <ScrollPage>
        <Animator animation={batch(Fade(), Sticky(), MoveOut(0, -200))}>
          <Animator animation={MoveOut(-200, 0)}>
            <Typography
              align="center"
              sx={{ fontSize: isMobile ? 14 : "20px" }}
            >
              Campaigns working together under one budget focusing on each buyer
              phase with bids.
            </Typography>
          </Animator>
          <Animator
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              margin: "1rem auto",
            }}
            animation={MoveOut(200, 0)}
          >
            <CardMedia
              src={buyerFunnel}
              alt="buyer_funnel_query_level"
              component="img"
              sx={{
                width: isMobile ? "100%" : 300,
                height: isMobile ? "100%" : 300,
              }}
            />
          </Animator>
        </Animator>
      </ScrollPage>

      <ScrollPage>
        <Animator
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
          animation={FadeUp}
        >
          <Typography align="center" sx={{ fontSize: isMobile ? 14 : "20px" }}>
            Simple User dashboard where we simplified processes ⛅️ without the
            need to sacrifice control.
          </Typography>
          <CardMedia
            src={analytics}
            alt="shopping_image_"
            component="img"
            sx={{
              width: isMobile ? "100%" : 300,
              height: isMobile ? "100%" : 300,
            }}
          />
        </Animator>
      </ScrollPage>

      <ScrollPage>
        <Animator
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
          animation={batch(Fade(), Sticky())}
        >
          <Animator animation={MoveIn(-200, 0)}>
            <SupportAgentIcon sx={{ color: "#2998f2", fontSize: 80 }} />
          </Animator>
          <Animator animation={MoveIn(-200, 0)}>
            Full support for any issues you face.
          </Animator>
        </Animator>
      </ScrollPage>

      <ScrollPage>
        <Animator
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
          animation={batch(Fade(), Sticky())}
        >
          <Animator animation={MoveIn(200, 0)}>
            Less effort with more control on your ads
          </Animator>
          <Animator animation={MoveIn(-200, 0)}>
            Built to help SMEs and soloprenuers
          </Animator>
        </Animator>
      </ScrollPage>
      <ScrollPage>
        <Animator animation={batch(Fade(), Sticky())}>
          <Animator animation={MoveOut(200, 0)}>
            <CardMedia
              component="img"
              src={queryLevelLogo}
              alt="scrollytelling_logo"
              sx={{
                width: isMobile ? "100%" : 200,
                height: isMobile ? "100%" : 200,
                margin: "0 auto",
              }}
            />
          </Animator>
          <Animator animation={MoveIn(-200, 0)}>
            <Typography align="center" sx={{ fontSize: isMobile ? 20 : 30 }}>
              Try a limited <span style={{ color: "#2998f2" }}>30-Day</span>{" "}
              Free Trial.
            </Typography>
          </Animator>
          <Animator animation={MoveIn(200, 0)}>
            <Typography align="center" sx={{ fontSize: "15px" }}>
              Create up to 3 Alpha/Beta or 3-Tiered Campaigns following
              relevance.
            </Typography>
          </Animator>
          <Divider sx={{ margin: "0.5rem auto" }} />
          <Typography align="center" sx={{ fontSize: "15px" }}>
            Test out all features of a pro-plan, no credit-card required.
          </Typography>
        </Animator>
      </ScrollPage>
    </ScrollContainer>
  );
};

export default HomeScrollAnimation;
