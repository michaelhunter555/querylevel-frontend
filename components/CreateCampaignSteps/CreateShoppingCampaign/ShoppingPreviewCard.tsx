import React, { useState } from "react";

import { useSession } from "next-auth/react";

import { AdScheduleSelector } from "@/components/AdSchedule/AdScheduleSelector";
import SuccessModal from "@/components/Modal/SuccessModal";
import { TooltipMessage } from "@/components/TooltipMessage/TooltipMessage";
import { ShoppingCampaign, useCampaign } from "@/hooks/campaign-hooks";
import { useForm } from "@/hooks/useForm";
import { Keywords, SalePrice, ScheduleState } from "@/types";
import { adjustLongTitle } from "@/util/helpers/adjustLongTitle";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CardMedia from "@mui/material/CardMedia";
import Checkbox from "@mui/material/Checkbox";
import Divider from "@mui/material/Divider";
import Fade from "@mui/material/Fade";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import { SelectChangeEvent } from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { StyledStack } from "../../Shared/StyledFadeInComponents";
import { createTierCampaignFields } from "../createTierCampaignFields";
import { BidSeparation } from "./BidSeparation";
import { BidSeparationTableExample } from "./BidSeparationTableExample";
import { LocationSelect } from "./LocationSelect";
import { ShoppingCampaignTypes } from "./shoppingCampaign.enums";
import { ShoppingCampaignStrategy } from "./ShoppingCampaignStrategy";
import { ShoppingInputsLoading } from "./ShoppingInputsLoading";
import { TextFieldInput } from "./TextFieldInputs";

interface DemoProduct {
  title: string;
  condition?: string | undefined;
  imageLink: string;
  brand: string;
  salePrice: SalePrice;
  link?: string;
}

const ShoppingProductPreview: React.FC<{
  product: DemoProduct | null;
  keywords: Keywords[];
  productIsLoading: boolean;
}> = ({ product, keywords, productIsLoading }): JSX.Element => {
  const { data: session } = useSession();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [showOriginalKeywords, setShowOriginalKeywords] =
    useState<boolean>(false);
  const [selectedBidSeparation, setSelectedBidSeparation] = useState<
    number | null
  >(0.1);
  const [campaignType, setCampaignType] = useState<ShoppingCampaignTypes | "">(
    ""
  );
  const [excludedLocation, setExcludedLocation] = useState<string[]>([]);
  const [targetedLocation, setTargetedLocation] = useState<string[]>([]);
  const [adSchedule, setAdSchedule] = useState({});
  const {
    isPostLoading,
    createThreeTieredShoppingCampaign,
    createAlphaBetaShoppingCampaign,
    message,
    errorMessage,
    error,
    success,
    clearError,
  } = useCampaign();
  const brandKeyword = keywords?.find(
    (keyword) => keyword?.brand === product?.brand
  );
  const [formState, inputHandler, setFormData] = useForm(
    createTierCampaignFields,
    false
  );

  const submitFormHandler = async (event: any) => {
    event.preventDefault();

    const shoppingFormInputs: ShoppingCampaign = {
      vendor: brandKeyword?.brand as string,
      budget: formState?.inputs?.budget?.value as number,
      adSchedule: adSchedule as ScheduleState,
      targetedLocations: targetedLocation as string[],
      excludedLocations: excludedLocation as string[],
      enabled: formState?.inputs?.enabled?.value as boolean,
      cpc: formState?.inputs?.cpc?.value as number,
      enhancedClick: formState?.inputs?.enhancedClick?.value as boolean,
      bidSeparation: formState?.inputs?.bidSeparation?.value as number,
      productTitle: keywords?.map((val) => val?.title).flat() || [],
      sku: keywords?.map((val) => val?.sku).flat() || [],
    };

    if (campaignType === ShoppingCampaignTypes.ALPHA_BETA) {
      try {
        await createAlphaBetaShoppingCampaign(shoppingFormInputs).then(() => {
          setOpenModal(true);
        });
      } catch (err) {
        console.log(
          "There was an error with creating a 3-tiered Campaign",
          err
        );
      }
    } else {
      try {
        await createThreeTieredShoppingCampaign(shoppingFormInputs).then(() => {
          setOpenModal(true);
        });
      } catch (err) {
        console.log(
          "There was an error with creating a 3-tiered Campaign",
          err
        );
      }
    }

    //reset form inputs
    setCampaignType("");
    setExcludedLocation([]);
    setTargetedLocation([]);
    setAdSchedule({});
    setFormData(createTierCampaignFields, false);
  };

  const bidSeparationHandler = (val: number) => {
    setSelectedBidSeparation(val);
    inputHandler("bidSeparation", val, true);
  };

  const campaignTypeHandler = (val: ShoppingCampaignTypes) => {
    setCampaignType(val);
    inputHandler("campaignType", val, true);
  };

  const excludeLocationHandler = (
    event: SelectChangeEvent<typeof excludedLocation>
  ) => {
    const {
      target: { value },
    } = event;
    setExcludedLocation(typeof value === "string" ? value.split(",") : value);
    inputHandler("exclude-location", value.toString(), true);
  };

  const targetLocationHandler = (
    event: SelectChangeEvent<typeof targetedLocation>
  ) => {
    const {
      target: { value },
    } = event;
    setTargetedLocation(typeof value === "string" ? value.split(",") : value);
  };

  const titles = keywords?.map((val) => val?.title).flat();
  const skus = keywords?.map((val) => val?.sku).flat();
  const brand = keywords?.[0]?.brand;
  const titlePreview = adjustLongTitle(titles, brand, skus);

  const showOriginalKeyWordsHandler = () => {
    setShowOriginalKeywords((prev) => !prev);
  };

  const closeSuccessModal = () => {
    if (error) {
      clearError();
    }
    setOpenModal(false);
  };

  const title = "Campaign Filtering";
  const text =
    "We remove all non-alphanumeric values as well as brand and sku from title. We handle brand and sku keywords separately. This is important for how your ads are triggered based on search query & priority.";

  const title2 = "Campaign Structure";
  const text2 =
    "Select between an alpha/beta (2 campaigns high & low priority), or a 3-tiered campaign (high, medium and low priority). ";
  return (
    <>
      <SuccessModal
        open={openModal}
        onClose={closeSuccessModal}
        message={message}
        error={error}
        errorMessage={errorMessage}
        success={success}
      />

      {!isPostLoading && !productIsLoading && (
        <StyledStack
          delay={0.1}
          visible={!productIsLoading}
          sx={{ width: "100%", boxSizing: "border-box" }}
        >
          <Paper elevation={1} sx={{ borderRadius: "15px", width: "100%" }}>
            <Grid
              container
              direction="row"
              sx={{ marginBottom: "2rem ", flexWrap: "wrap", padding: "10px" }}
              spacing={3}
            >
              {product && (
                <Grid item xs={12} md={4}>
                  <StyledStack
                    delay={0.2}
                    visible={!productIsLoading}
                    yAxis={5}
                    alignItems="center"
                    sx={{ margin: "2rem 0" }}
                  >
                    <CardMedia
                      component="img"
                      image={product?.imageLink}
                      alt={`${product?.title}-${product?.brand}`}
                      sx={{
                        width: { xs: "75%", md: "50%" },
                        transition: "ease-in 2s",
                        borderRadius: "15px",
                      }}
                    />
                  </StyledStack>

                  <StyledStack
                    visible={!productIsLoading}
                    delay={0.3}
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    <Stack>
                      <Typography variant="h5">Keyword Preview</Typography>
                    </Stack>
                    <Stack>
                      <TooltipMessage title={title} text={text} />
                    </Stack>

                    <Stack>
                      <Link
                        component="button"
                        onClick={showOriginalKeyWordsHandler}
                      >
                        {!showOriginalKeywords
                          ? "See original"
                          : "See modified"}
                      </Link>
                    </Stack>
                  </StyledStack>
                  <Fade in={!productIsLoading}>
                    <Divider
                      sx={{ margin: "0 auto", width: "100%" }}
                      flexItem
                    />
                  </Fade>
                  <Fade in={!productIsLoading}>
                    <Stack>
                      <Grid container spacing={1}>
                        {!showOriginalKeywords && (
                          <Grid item xs={12}>
                            <Typography> Product Titles:</Typography>
                            {keywords &&
                              titlePreview?.slice(0, 5)?.map((val, i) => (
                                <Box
                                  key={i}
                                  sx={{
                                    width: "100%",
                                    display: "flex",
                                    flexWrap: "wrap",
                                  }}
                                >
                                  <Typography
                                    variant="subtitle2"
                                    color="text.secondary"
                                    sx={{
                                      overflowWrap: "break-word",
                                      wordWrap: "break-word",
                                      hyphens: "auto",
                                    }}
                                  >
                                    {i + 1}. {val}
                                  </Typography>
                                </Box>
                              ))}
                          </Grid>
                        )}

                        {showOriginalKeywords && (
                          <Grid item xs={12}>
                            <Typography> Product Titles:</Typography>
                            {keywords &&
                              keywords?.slice(0, 5)?.map((val, i) => (
                                <Box key={i}>
                                  <Typography
                                    variant="subtitle2"
                                    color="text.secondary"
                                  >
                                    {i + 1}. {val.title}
                                  </Typography>
                                </Box>
                              ))}
                          </Grid>
                        )}

                        <Grid item xs={12}>
                          <Typography>Product Skus:</Typography>
                          {keywords &&
                            keywords?.slice(0, 5)?.map((val, i) => (
                              <Box key={i}>
                                <Typography
                                  variant="subtitle2"
                                  color="text.secondary"
                                >
                                  {i + 1}. {val?.sku}
                                </Typography>
                              </Box>
                            ))}
                        </Grid>

                        <Grid item xs={12}>
                          <Typography>
                            We will create keywords for all {keywords.length}{" "}
                            product titles.
                          </Typography>
                        </Grid>
                      </Grid>
                    </Stack>
                  </Fade>
                </Grid>
              )}
              <Divider
                orientation="vertical"
                flexItem
                sx={{ margin: "0 1rem" }}
              />
              <Fade in={!productIsLoading}>
                <Grid item xs={12} md={7}>
                  <form onSubmit={submitFormHandler}>
                    <Grid
                      container
                      sx={{
                        flexDirection: { xs: "column", md: "row" },
                        alignItems: { md: "center" },
                        gap: 2,
                        width: "100%",
                      }}
                    >
                      <Grid item xs={12}>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: { xs: "column", md: "row" },
                            alignItems: "center",
                            gap: "5px",
                          }}
                        >
                          <Stack>
                            <Typography>Campaign Structure</Typography>
                          </Stack>
                          <Stack>
                            <TooltipMessage title={title2} text={text2} />
                          </Stack>
                        </Box>

                        <ShoppingCampaignStrategy
                          onClick={campaignTypeHandler}
                          campaignType={campaignType}
                        />
                        <Divider
                          sx={{
                            margin: "1rem auto",
                            width: "100%",
                          }}
                        />
                      </Grid>
                      {/**Brand Name: string */}
                      <Grid item xs={12}>
                        <Typography>Brand Name</Typography>
                        <Typography variant="h5" color="text.secondary">
                          {keywords && keywords[0]?.brand}
                        </Typography>
                        <Stack direction="row">
                          <FormGroup
                            sx={{
                              width: "100%",
                              margin: "1rem",
                              flexDirection: "row",
                              flexWrap: "nowrap",
                            }}
                          >
                            <FormControlLabel
                              control={
                                <Checkbox
                                  id="enabled"
                                  name="enabled"
                                  checked={
                                    formState?.inputs?.enabled?.value as boolean
                                  }
                                  onChange={(event) =>
                                    inputHandler(
                                      "enabled",
                                      event.target.checked,
                                      true
                                    )
                                  }
                                />
                              }
                              label="Enable Campaigns"
                            />
                            <Divider
                              orientation="vertical"
                              flexItem
                              sx={{
                                margin: "0 1rem",
                                display: { xs: "none", md: "block" },
                              }}
                            />
                            <FormControlLabel
                              control={
                                <Checkbox
                                  id="enhancedClick"
                                  name="enhancedClick"
                                  checked={
                                    formState?.inputs?.enhancedClick
                                      ?.value as boolean
                                  }
                                  onChange={(event) =>
                                    inputHandler(
                                      "enhancedClick",
                                      event.target.checked,
                                      true
                                    )
                                  }
                                />
                              }
                              label="Enhance CpC?"
                            />
                          </FormGroup>
                        </Stack>
                      </Grid>
                      {/**Ad Schedule: [{},] */}
                      <Grid item xs={12}>
                        <AdScheduleSelector onSelectAdDate={setAdSchedule} />
                      </Grid>

                      {/**targeted locations: string[] */}
                      <Grid item xs={12} md={5}>
                        <LocationSelect
                          id="target-location"
                          outlinedInputId="target-location-input"
                          inputLabel="Target location(s)"
                          onTargetLocation={targetLocationHandler}
                          targetLocation={targetedLocation}
                        />
                      </Grid>

                      {/**excluded locations: string[]*/}
                      <Grid item xs={12} md={5}>
                        <LocationSelect
                          id="exclude-location"
                          outlinedInputId="exclude-location-input"
                          inputLabel="Exclude location(s)"
                          onTargetLocation={excludeLocationHandler}
                          targetLocation={excludedLocation}
                          isExcluded={true}
                        />
                      </Grid>

                      {/** shared budget:number */}
                      <Grid item xs={12} lg={5}>
                        <TextFieldInput
                          id="budget"
                          name="budget"
                          type="number"
                          title="Set Shared Budget"
                          defaultValue={
                            formState?.inputs?.budget?.value as number
                          }
                          inputHandler={inputHandler}
                          hasAdornment={true}
                        />
                      </Grid>

                      {/*CPC bids: number */}
                      <Grid item xs={12} lg={5}>
                        <TextFieldInput
                          id="cpc"
                          name="cpc"
                          type="number"
                          title="Set CpC Bids"
                          defaultValue={formState?.inputs?.cpc?.value as number}
                          inputHandler={inputHandler}
                          hasAdornment={true}
                        />
                      </Grid>

                      {/**Bid separation: number */}
                      <Grid item xs={12} lg={5}>
                        <BidSeparation
                          onBidSeparationSelect={bidSeparationHandler}
                          inputHandler={inputHandler}
                          selectedBid={selectedBidSeparation}
                        />
                      </Grid>

                      <Grid
                        item
                        xs={12}
                        lg={5}
                        sx={{ display: "flex", alignItems: "center" }}
                      >
                        <BidSeparationTableExample
                          bidSeparation={Number(selectedBidSeparation)}
                          costPerClick={Number(formState?.inputs?.cpc?.value)}
                          campaignType={campaignType}
                        />
                      </Grid>
                    </Grid>
                    <Divider
                      sx={{
                        margin: "1rem auto",
                        width: "100%",
                      }}
                    />
                    <Stack
                      sx={{
                        margin: "1rem auto",
                        width: "100%",
                      }}
                    >
                      <Button
                        variant="outlined"
                        type="submit"
                        disabled={
                          !formState?.isValid || !session?.user?.accountActive
                        }
                      >
                        Create Campaigns
                      </Button>
                    </Stack>
                  </form>
                </Grid>
              </Fade>
            </Grid>
          </Paper>
        </StyledStack>
      )}
      {(isPostLoading || productIsLoading) && <ShoppingInputsLoading />}
    </>
  );
};

export default ShoppingProductPreview;
