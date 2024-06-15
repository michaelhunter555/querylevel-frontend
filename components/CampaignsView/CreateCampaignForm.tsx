import React, { useEffect, useState } from "react";

import dynamic from "next/dynamic";
import Link from "next/link";

import { useCampaign, useInventoryFilter } from "@/hooks/campaign-hooks";
import { useGetPortfolioStrategy } from "@/hooks/portfolio-strategies";
import { useForm } from "@/hooks/useForm";
import { useMerchantCenter } from "@/hooks/useMerchantCenter";
import {
  createBudgetData,
  createCampaignData,
} from "@/util/helpers/campaigns/createCampaignData";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import Paper from "@mui/material/Paper";
import { SelectChangeEvent } from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import Typography from "@mui/material/Typography";
import { useQuery } from "@tanstack/react-query";

//import BiddingStrategy from "./BiddingStrategy";
import { createCampaignFields } from "./createCampaignFields";
// import CreateCampaignStepOne from "./CreateCampaignStepOne";
// import CreateCampaignStepThree from "./CreateCampaignStepThree";
// import CreateCampaignStepTwo from "./CreateCampaignStepTwo";
import { NegativeKeywords } from "./NegativeKeywords";

const BiddingStrategy = dynamic(() => import("./BiddingStrategy"), {
  ssr: false,
});

const CreateCampaignStepOne = dynamic(() => import("./CreateCampaignStepOne"), {
  ssr: false,
});
const CreateCampaignStepTwo = dynamic(() => import("./CreateCampaignStepTwo"), {
  ssr: false,
});
const CreateCampaignStepThree = dynamic(
  () => import("./CreateCampaignStepThree"),
  { ssr: false }
);

const campaignSteps = [
  "Step 1: Campaign Details",
  "Step 2: Specifics",
  "Step 3: Review & Launch",
];

const CreateNewCampaign = () => {
  const [targetedLocation, setTargetedLocation] = useState<string[]>([]);
  const [excludedLocation, setExcludedLocation] = useState<string[]>([]);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [keywords, setKeyword] = useState<string[]>([]);
  const { isPostLoading, createShoppingCampaign, message } = useCampaign();
  const [isTargetRoas, setIsTargetRoas] = useState<boolean>(false);
  const [isAccordionExpanded, setIsAccordionExpanded] = useState(false);
  const [selectedInventoryFilter, setSelectedInventoryFilter] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string>("");
  const [openInventoryFilter, setOpenInventoryFilter] =
    useState<boolean>(false);
  const [formState, inputHandler, setFormData] = useForm(
    createCampaignFields,
    false
  );
  const { getMerchantCenterId } = useMerchantCenter();
  const [locationIsExpanded, setLocationIsExpanded] = useState<boolean>(false);
  const {
    getFilteredData,
    filteredData,
    isLoading: inventoryFilterIsLoading,
  } = useInventoryFilter();
  const [openPortfolioStrategy, setOpenPortfolioStrategy] =
    useState<boolean>(false);
  const [newPortfolioStrategy, setNewPortfolioStrategy] =
    useState<boolean>(false);
  const [isManualCpc, setIsManualCpc] = useState<boolean>(true);
  const [localInventoryIsExpanded, setLocalInventoryExpanded] =
    useState<boolean>(false);
  const {
    isLoading: loadingPortfolio,
    portfolioStrategies,
    getPortfolioStrategy,
  } = useGetPortfolioStrategy();

  const { data: resourceNames, isLoading } = useQuery({
    queryKey: ["MerchantCenterId"],
    queryFn: () => getMerchantCenterId(),
    staleTime: Infinity,
  });

  // useEffect(() => {
  //   getMerchantCenterId();
  // }, []);

  // const { data: filteredDatas, isLoading: filterDataIsLoading, } = useQuery({
  //   queryKey: ['inventoryFilter', selectedFilter],
  //   queryFn: () => getFilteredData(selectedFilter),
  //   enabled: Boolean(selectedFilter !== "")
  //   staleTime: 15 * 60 * 1000,
  // })

  useEffect(() => {
    if (selectedFilter !== "") {
      getFilteredData(selectedFilter);
    }
  }, [selectedFilter]);

  useEffect(() => {
    //target roas - portfolio - standard
    if (isTargetRoas && !isManualCpc && !openPortfolioStrategy) {
      // console.log("isTargetRoas && !isManualCpc");
      setFormData(
        {
          ...formState.inputs,
          newPortfolioStrategyName: { value: "", isValid: true },
          targetRoasValue: { value: 0, isValid: false },
          costPerClick: { value: 0, isValid: true },
        },
        false
      );
      //target roas - new portfolio
    } else if (isTargetRoas && openPortfolioStrategy && !newPortfolioStrategy) {
      // console.log("isTargetRoas && newPortfolioStrategy");
      setFormData(
        {
          ...formState.inputs,
          newPortfolioStrategyName: { value: "", isValid: false },
          targetRoasValue: { value: 0, isValid: false },
          costPerClick: { value: 0, isValid: true },
        },
        false
      );
      //target roas - existing portfolio strategy
    } else if (
      isTargetRoas &&
      newPortfolioStrategy &&
      openPortfolioStrategy //newPortfolioStrategy ==== existing
    ) {
      // console.log("isTargetRoas && !newPortfolioStrategy");
      setFormData(
        {
          ...formState.inputs,
          targetRoasStrategyId: { value: "", isValid: false },
          targetRoasValue: { value: 0, isValid: true },
          costPerClick: { value: 0, isValid: true },
        },
        false
      );
      //manual CPC
    } else if (isManualCpc && !isTargetRoas) {
      // console.log("isManualCpc && !isTargetRoas");
      setFormData(
        {
          ...formState.inputs,
          costPerClick: { value: 0.0, isValid: false },
          targetRoasStrategyId: { value: "", isValid: true },
          targetRoasValue: { value: 0, isValid: true },
        },
        false
      );
    }
  }, [isTargetRoas, newPortfolioStrategy, isManualCpc, openPortfolioStrategy]);

  const biddingStrategyHandler = async () => {
    getPortfolioStrategy();
  };

  const isNewPortoflioStrategy =
    isTargetRoas && openPortfolioStrategy && !newPortfolioStrategy;
  const isExistingPortoflioStrategy =
    isTargetRoas && openPortfolioStrategy && newPortfolioStrategy;

  const createCampaignHandler = async () => {
    const budgetData = createBudgetData(formState);
    const campaignData = createCampaignData(
      formState,
      targetedLocation,
      excludedLocation,
      keywords,
      isNewPortoflioStrategy,
      isExistingPortoflioStrategy
    );

    // console.log({ campaignData: campaignData, budgetData: budgetData });

    if (formState.isValid) {
      try {
        createShoppingCampaign(campaignData, budgetData);
      } catch (err) {
        console.log(
          "There was an error with the request to create campaign.",
          err
        );
      }
    }
  };

  // console.log(keywords);

  const handleNextStep = () => {
    if (activeStep !== 2) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBackStep = () => {
    if (activeStep !== 0) {
      setActiveStep((prev) => prev - 1);
    }
  };

  const handleFilterSelection = (filter: any) => {
    setSelectedFilter(filter);
  };

  const handleInventoryFilterChange = (val: string) => {
    setSelectedInventoryFilter(val);
  };

  const toggleAccordion = () => setIsAccordionExpanded((prev) => !prev);

  const toggleLocationAccordion = () => setLocationIsExpanded((prev) => !prev);

  const handleTargetRoas = () => {
    setIsTargetRoas((prev) => !prev);
  };

  const portfolioStrategyHandler = () => {
    setOpenPortfolioStrategy((prev) => !prev);
  };

  const manualCpcHandler = () => {
    setIsManualCpc((prev) => !prev);
  };

  return (
    <Grid container sx={{ width: "100%", padding: "1rem" }}>
      <Box sx={{ width: "90%", margin: "0 auto" }}>
        <Stepper activeStep={activeStep}>
          {campaignSteps?.map((label, index) => {
            return (
              <Step
                key={`${index}-${label}`}
                completed={index < activeStep}
                active={index === activeStep}
                index={index}
              >
                <StepLabel
                  sx={{ fontWeight: activeStep === index ? "bold" : "" }}
                >
                  {label}
                </StepLabel>
              </Step>
            );
          })}
        </Stepper>
        <Stack direction="row" alignItems="center" sx={{ marginTop: "0.5rem" }}>
          {activeStep > 0 && (
            <Button
              variant="outlined"
              onClick={handleBackStep}
              disabled={activeStep === 0}
            >
              {" "}
              Back{" "}
            </Button>
          )}
          <Box sx={{ flex: "1 1 auto" }} />
          <Button
            variant="outlined"
            onClick={handleNextStep}
            disabled={
              activeStep === 2 ||
              !formState?.inputs?.budgetName?.isValid ||
              Number(formState?.inputs?.budgetAmount?.value) < 1
            }
          >
            {activeStep === 2 ? "Review" : "Next"}
          </Button>
        </Stack>
      </Box>
      <Divider flexItem />
      {/* general settings */}
      {activeStep === 0 && (
        <Grid
          container
          spacing={2}
          direction="row"
          alignItems="center"
          justifyContent="center"
          sx={{ margin: "0 auto", width: "100%" }} //remember to adjust width for tab and mobile
        >
          <CreateCampaignStepOne
            isLoading={isLoading}
            resourceNames={resourceNames}
            formState={formState}
            inputHandler={inputHandler}
          />
        </Grid>
      )}

      {/* ad schedule, locations && negative keywords? */}
      {activeStep === 1 && (
        <Grid
          container
          spacing={2}
          direction="row"
          alignItems="center"
          justifyContent="center"
          sx={{ margin: "0 auto", width: "100%" }}
        >
          <Grid item xs={11}>
            <Paper sx={{ borderRadius: "15px", padding: "1rem" }}>
              <BiddingStrategy
                formState={formState}
                inputHandler={inputHandler}
                isTargetRoas={isTargetRoas}
                setIsTargetRoas={handleTargetRoas}
                isManualCpc={isManualCpc}
                onManualCpc={manualCpcHandler}
                openPortfolio={openPortfolioStrategy}
                onOpenPortfolio={portfolioStrategyHandler}
                newPortfolioStrategy={newPortfolioStrategy}
                onNewPortfolioStrategy={() =>
                  setNewPortfolioStrategy((prev) => !prev)
                }
                onGetBidStrategies={biddingStrategyHandler}
                existingPortfolios={portfolioStrategies}
                loadingPortfolio={loadingPortfolio}
              />
            </Paper>
          </Grid>
          <CreateCampaignStepTwo
            localInventoryIsExpanded={localInventoryIsExpanded}
            onToggleLocalInventory={() =>
              setLocalInventoryExpanded((prev) => !prev)
            }
            filteredData={filteredData}
            inventoryFilterIsLoading={inventoryFilterIsLoading}
            formState={formState}
            inputHandler={inputHandler}
            excludedLocation={excludedLocation}
            targetedLocation={targetedLocation}
            onExcludedLocation={setExcludedLocation}
            onTargetedLocation={setTargetedLocation}
            isExpanded={isAccordionExpanded}
            onFilterSelect={(event: SelectChangeEvent<string>) => {
              handleFilterSelection(event.target.value);
            }}
            selectedInventoryFilter={selectedInventoryFilter}
            onInventoryFilterChange={(val: string) =>
              handleInventoryFilterChange(val)
            }
            selectedFilter={selectedFilter}
            toggleAccordion={toggleAccordion}
            toggleLocationAccordion={toggleLocationAccordion}
            locationIsExpanded={locationIsExpanded}
            openInventoryFilter={openInventoryFilter}
            onOpenInventoryFilter={setOpenInventoryFilter}
          />

          <Grid item xs={11}>
            <Paper sx={{ borderRadius: "15px", padding: "1rem" }}>
              <InputLabel>Add Negative keywords</InputLabel>
              <Alert severity="warning" sx={{ margin: "0.5rem 0 0.5rem" }}>
                Add "phrase", [exact], and broad negative keywords. Negative
                keywords should have a max length: 80 characters, or 10 words
                (whichever comes first).
              </Alert>
              <NegativeKeywords
                keywords={keywords}
                onSetKeyword={(keyword: string[]) => setKeyword(keyword)}
              />
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* additional settings */}
      {activeStep === 2 && !isPostLoading && (
        <Grid
          container
          spacing={2}
          direction="row"
          alignItems="center"
          justifyContent="center"
          sx={{ margin: "0 auto", width: "100%" }}
        >
          {!message && (
            <CreateCampaignStepThree
              formState={formState}
              onCreateCampaign={createCampaignHandler}
              inputHandler={inputHandler}
              //onClose={onClose}
            />
          )}
          {message && (
            <Stack>
              <Typography color="text.secondary">{message}</Typography>
              <Button variant="outlined" component={Link} href="/campaign-view">
                Close
              </Button>
            </Stack>
          )}
        </Grid>
      )}

      {activeStep === 2 && isPostLoading && (
        <Grid
          container
          spacing={2}
          direction="row"
          alignItems="center"
          justifyContent="center"
          sx={{ margin: "0 auto", width: "90%" }}
        >
          <CircularProgress />
        </Grid>
      )}
    </Grid>
  );
};

export default CreateNewCampaign;
