import React, { useState } from "react";

import { PaletteMode, useTheme } from "@mui/material";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import CardMedia from "@mui/material/CardMedia";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";

interface CaseStudyProps {
  theme: PaletteMode;
  isAlphaBeta: boolean;
  onSwitchChange: () => void;
}

export const FadeContentBox = styled(Box)(({ theme }) => ({
  position: "relative",
  maxHeight: 100,
  overflow: "hidden",
  "&:after": {
    content: '""',
    textAlign: "center",
    color: "#b1b1b1",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "5em",
    background: `linear-gradient(to top, ${theme.palette.background.paper}, transparent)`,
  },
}));

const caseStudyStats = [
  //   {
  //     name: "MFD",
  //     explantion: "In this example, we can see that the user has two campaigns",
  //     AOV: 1900,
  //     type: "Alpha-beta",
  //     niche: "Fireplaces",
  //     clicks: "76.9k",
  //     impressions: "9.88m",
  //     avgCpc: "0.52",
  //     cost: "$40.3k",
  //     conversions: 196,
  //     costPerConversion: 205,
  //     conversionRate: 0.25,
  //     dates: "August 2021 - March 2023",
  //   },
  {
    name: "PFD",
    explanation:
      "In this example we have a fitness niche website selling USA brand named home fitness products. A three-tiered strategy (see diagram above) was most fitting due to the uniqueness of product names and titles. At the start of restructuring the campaigns for PFD, the owners were paying the same price for lower quality search terms as they were for high-quality, decision-level and buyer-intent based queries. Naturally, not being able to decide which keywords trigger your shopping ad is a limitation of Google shopping, but by there are other means in which we can leverage shopping ads to our advantage. Given full control and the trust of PFD to re-structure their ads, went with a 3-tiered campaign wrapped under a shared budget with various settings and modifications to ensure all three campaigns were performing as one. It took roughly 2-weeks to start seeing consistent results with careful keyword monitoring. By 'keyword monitoring', we mean carefully following the search terms to make sure they are landing in the right campaigns. Overall, for the vendor Proform, PFD had achieved a conversion rate of 2.83% meaning, PFD converted nearly 3 of every 100 users!",
    explanationTwo:
      "Validation is a key phase before mass dispersal and the performance of the proform campaigns under a 3-tier structure worked as hypothesized. As can be seen from the data, Low priority handled all brand specific + product title search terms (see diagram above). It was clear that if a user searches with this keyword intent, it's likely they are in the decision phase. So, why not bid as competitively as possible when we know this is going to likely lead to a sale? Well, that's exactly what we're doing with this structure. At the same time, we did not rule out that an interest-level search term could lead to a sale. However, the likliness that it would[lead to a sale] was much lower if keywords such as the brand and product title were missing. Hence, this is why our high-priority (low quality keywords) show first with the lowest bid. The strategy is not limited to just one brand or type of brand either.",
    explanationThree:
      " Here you can see the three-tier strategy was then used on multiple brands to which over time a conversion rate of over 5% was acheived. To put it frank, this website quickly became a 7-figure business with the help of this shopping campaign structure. When your store is getting sales, Google's algorithm sort of rewards you in away by noting that your store likely led to a positive experience and therefore the algorithm will optimize your website more for similar search terms int he future. What this means is an increased liklihood of getting more sales. These results are not limited to PFD either but just serve as an example of what can be acheived if the query level bidding strategy is adopted.",
    AOV: 400,
    niche: "Home Fitness",
    type: "3-tiered",
    clicks: "7,041",
    impressions: "1.36m",
    avgCpc: "0.44",
    cost: "$3,092.39",
    conversions: 199,
    costPerConversion: 15.51,
    conversionRate: 2.83,
    dates: "June 2020 - July 2022",
  },
];

const CaseStudy = ({ theme, isAlphaBeta, onSwitchChange }: CaseStudyProps) => {
  const themeView = useTheme();
  const isMobileOrTablet = useMediaQuery(
    themeView.breakpoints.down("sm") || themeView.breakpoints.down("md")
  );
  const [readMore, setReadMore] = useState(false);

  const handleToggle = (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    onSwitchChange();
  };

  const handleReadMore = () => setReadMore((p) => !p);

  return (
    <Container maxWidth="lg" sx={{ marginTop: "3rem" }}>
      <Stack sx={{ width: "100%" }} spacing={2} alignItems="center">
        <Typography align="center" variant="h4" color="text.secondary">
          Case Study
        </Typography>
        <Typography color="text.secondary" fontWeight={600}>
          {caseStudyStats[0].name} - {caseStudyStats[0].niche}
        </Typography>

        <Typography color="text.secondary" fontWeight={600}>
          {caseStudyStats[0].dates}
        </Typography>
        <Typography variant="subtitle2" color="text.secondary">
          Read {readMore ? "less" : "more"}
        </Typography>
        <Switch onChange={handleReadMore} />

        <Box
          sx={{
            ...(isMobileOrTablet && { overflowX: "scroll" }),
            padding: 1,
            width: isMobileOrTablet ? "100%" : "auto",
          }}
        >
          {caseStudyStats
            // ?.filter((caseStudy) =>
            //   isAlphaBeta ? caseStudy.name === "MFD" : caseStudy.name === "PFD"
            // )
            ?.map((caseStudy, i) => (
              <Stack
                key={caseStudy.name}
                direction="row"
                alignItems="center"
                spacing={2}
              >
                <Paper sx={{ padding: 2, borderRadius: 5, minWidth: 150 }}>
                  <Stack alignItems="center" spacing={1}>
                    <Typography
                      fontWeight="bold"
                      variant="subtitle2"
                      color="text.secondary"
                    >
                      Type
                    </Typography>
                    <Divider flexItem />
                    <Typography variant="subtitle2" color="text.secondary">
                      {caseStudy.type}
                    </Typography>
                  </Stack>
                </Paper>
                <Paper sx={{ padding: 2, borderRadius: 5, minWidth: 150 }}>
                  <Stack alignItems="center" spacing={1}>
                    <Typography
                      fontWeight="bold"
                      variant="subtitle2"
                      color="text.secondary"
                    >
                      AOV
                    </Typography>
                    <Divider flexItem />
                    <Typography variant="subtitle2" color="text.secondary">
                      ${caseStudy.AOV}
                    </Typography>
                  </Stack>
                </Paper>
                <Paper sx={{ padding: 2, borderRadius: 5, minWidth: 150 }}>
                  <Stack alignItems="center" spacing={1}>
                    <Typography
                      fontWeight="bold"
                      variant="subtitle2"
                      color="text.secondary"
                    >
                      Clicks
                    </Typography>
                    <Divider flexItem />
                    <Typography variant="subtitle2" color="text.secondary">
                      {caseStudy.clicks}
                    </Typography>
                  </Stack>
                </Paper>
                <Paper sx={{ padding: 2, borderRadius: 5, minWidth: 150 }}>
                  <Stack alignItems="center" spacing={1}>
                    <Typography
                      fontWeight="bold"
                      variant="subtitle2"
                      color="text.secondary"
                    >
                      Conversions
                    </Typography>
                    <Divider flexItem />
                    <Typography variant="subtitle2" color="text.secondary">
                      {caseStudy.conversions}
                    </Typography>
                  </Stack>
                </Paper>
                <Paper sx={{ padding: 2, borderRadius: 5, minWidth: 150 }}>
                  <Stack alignItems="center" spacing={1}>
                    <Typography
                      fontWeight="bold"
                      variant="subtitle2"
                      color="text.secondary"
                    >
                      Conv. Rate
                    </Typography>
                    <Divider flexItem />
                    <Typography variant="subtitle2" color="text.secondary">
                      {caseStudy.conversionRate}%
                    </Typography>
                  </Stack>
                </Paper>
                <Paper sx={{ padding: 2, borderRadius: 5, minWidth: 150 }}>
                  <Stack alignItems="center" spacing={1}>
                    <Typography
                      fontWeight="bold"
                      variant="subtitle2"
                      color="text.secondary"
                    >
                      Avg. Cpc
                    </Typography>
                    <Divider flexItem />
                    <Typography variant="subtitle2" color="text.secondary">
                      ${caseStudy.avgCpc}
                    </Typography>
                  </Stack>
                </Paper>
                <Paper sx={{ padding: 2, borderRadius: 5, minWidth: 150 }}>
                  <Stack alignItems="center" spacing={1}>
                    <Typography
                      fontWeight="bold"
                      variant="subtitle2"
                      color="text.secondary"
                    >
                      Cost
                    </Typography>
                    <Divider flexItem />
                    <Typography variant="subtitle2" color="text.secondary">
                      {caseStudy.cost}
                    </Typography>
                  </Stack>
                </Paper>
              </Stack>
            ))}
        </Box>
        <Alert severity="info">
          These results are screenshots via the user's Google Dashboard with
          full consent
        </Alert>
        {readMore ? (
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              {caseStudyStats[0].explanation}
            </Typography>

            <CardMedia
              component="img"
              src="https://res.cloudinary.com/dtqbxfe7r/image/upload/v1728607028/Proform_three-tiered_example_sajqpa.png"
              alt={"Three-tiered-example"}
              sx={{
                obectFit: "contain",
                width: "100%",
                height: "100%",
                borderRadius: 5,
              }}
            />
            <Typography variant="subtitle2" color="text.secondary">
              {caseStudyStats[0].explanationTwo}
            </Typography>
            <CardMedia
              component="img"
              src="https://res.cloudinary.com/dtqbxfe7r/image/upload/v1728607028/profitness_deals_other_examples_g6dndu.png"
              alt="Other 3-tier examples"
              sx={{ width: "100%", height: "100%", borderRadius: 5 }}
            />
            <Typography variant="subtitle2" color="text.secondary">
              {caseStudyStats[0].explanationThree}
            </Typography>
          </Box>
        ) : (
          <FadeContentBox>
            <Typography variant="subtitle2" color="text.secondary">
              {caseStudyStats[0].explanation}
            </Typography>

            <CardMedia
              component="img"
              src="/Proform_three-tiered_example.png"
              alt={"Three-tiered-example"}
              sx={{
                obectFit: "contain",
                width: "100%",
                height: "100%",
                borderRadius: 5,
              }}
            />
            <Typography variant="subtitle2" color="text.secondary">
              {caseStudyStats[0].explanationTwo}
            </Typography>
            <CardMedia
              component="img"
              src="/profitness_deals_other_examples.png"
              alt="Other 3-tier examples"
              sx={{ width: "100%", height: "100%", borderRadius: 5 }}
            />
            <Typography variant="subtitle2" color="text.secondary">
              {caseStudyStats[0].explanationThree}
            </Typography>
          </FadeContentBox>
        )}
      </Stack>
    </Container>
  );
};

export default CaseStudy;
