import React, { useEffect, useState } from "react";

import { useSession } from "next-auth/react";

import {
  useGetCampaigns,
  useInventoryFilter,
  useUpdateCampaign,
} from "@/hooks/campaign-hooks";
import { useInvalidateQuery } from "@/hooks/invalidateQueries";
import { useGetPortfolioStrategy } from "@/hooks/portfolio-strategies";
import { useGetSharedBudgets } from "@/hooks/reports-hooks";
import { useForm } from "@/hooks/useForm";
import {
  AccordionStates,
  UpdateBiddingStrategy,
  UpdateCampaignBudget,
} from "@/types";
import {
  createUpdateCampaignBiddingStrategyType,
  createUpdateCampaignBudget,
  createUpdateCampaignGeoTargetType,
  createUpdateCampaignSettings,
  createUpdateCampaignShoppingSettings,
  createUpdateNetworkSettings,
} from "@/util/helpers/campaigns/updateCampaignMap";
import CircularProgress from "@mui/material/CircularProgress";
import Drawer from "@mui/material/Drawer";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useQuery } from "@tanstack/react-query";

import { Accordionize } from "../Accordion/Accordion";
import BiddingStrategy from "../CampaignsView/BiddingStrategy";
import { LocalInventory } from "../LocalInventory/LocalInventory";
////import BiddingStrategy from "../CampaignsView/BiddingStrategy";
import { accordionState } from "./accordionState";
import { BudgetType } from "./EditCampaignComponents/BudgetType";
import { formStateHelper } from "./EditCampaignComponents/formStateHelper";
import { InputableText } from "./EditCampaignComponents/InputableText";
import { EditNetworkSettings } from "./EditCampaignComponents/NetworkSettings";
import { SelectorOptions } from "./EditCampaignComponents/SelectorOptions";
import { initialCampaignState } from "./initialCampaignState";
import { LoadingDrawerSkeleton } from "./LoadingDrawerSkeleton";

interface EditCampaign {
  open: boolean;
  onClose: () => void;
  campaignId: string;
  fieldUpdated: () => void;
}

const EditCampaignDrawer = ({
  open,
  onClose,
  campaignId,
  fieldUpdated,
}: EditCampaign) => {
  const { data: session } = useSession();
  const { getSharedBudgets } = useGetSharedBudgets();
  const { getEditableCampaign } = useGetCampaigns();
  const [formState, inputHandler, setFormData] = useForm(
    initialCampaignState,
    false
  );
  const {
    isPostLoading,
    message,
    updateCampaignSettings,
    updateCampaignNetworkSettings,
    updateCampaignBudgetSettings,
    updateCampaignGeoTargeting,
    updateCampaignShoppingSettings,
    updateBiddingStrategyType,
    updateLocalInventory,
    //successflags
    updateDetailsSuccess,
  } = useUpdateCampaign();
  const [isExpand, setIsExpand] = useState<AccordionStates>(accordionState);
  const [openSharedModal, setOpenSharedModal] = useState<boolean>(false);
  const [sharedBudgetId, setSharedBudgetId] = useState<{
    name: string;
    resourceName: string;
  }>({
    name: "",
    resourceName: "",
  });
  const [isSharedBudget, setIsSharedBudget] = useState<boolean | undefined>();
  const [isTargetRoas, setIsTargetRoas] = useState<boolean>(false);
  const [isManualCpc, setIsManualCpc] = useState<boolean>(true);
  const [selectedInventoryFilter, setSelectedInventoryFilter] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string>("");
  const [openInventoryFilter, setOpenInventoryFilter] =
    useState<boolean>(false);
  const [openPortfolioStrategy, setOpenPortfolioStrategy] =
    useState<boolean>(false);
  const [newPortfolioStrategy, setNewPortfolioStrategy] =
    useState<boolean>(false);
  const {
    isLoading: loadingPortfolio,
    portfolioStrategies,
    getPortfolioStrategy,
  } = useGetPortfolioStrategy();
  const { getFilteredData } = useInventoryFilter();
  const { invalidateQuery } = useInvalidateQuery();
  const [resetState, setResetState] = useState(0);

  const {
    data: campaignData,
    isLoading,
    refetch: refetchEditableCampaigns,
  } = useQuery({
    queryKey: ["editableCampaign", campaignId],
    queryFn: () => getEditableCampaign(campaignId),
    enabled: open && Boolean(campaignId),
    staleTime: Infinity,
  });

  const { data: sharedBudgets, isLoading: sharedBudgetIsLoading } = useQuery({
    queryKey: ["sharedBudgets"],
    queryFn: () => getSharedBudgets(),
    enabled: openSharedModal,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (campaignData && campaignData.length > 0) {
      const currentFormState = formStateHelper(campaignData);
      setFormData(currentFormState, false);
      setIsSharedBudget(campaignData[0]?.explicitly_shared);
    }
    setIsTargetRoas(Boolean(campaignData?.[0]?.bidding_strategy_type === 8));
    setIsManualCpc(Boolean(campaignData?.[0]?.bidding_strategy_type === 3));
  }, [campaignData, resetState]);

  const biddingStrategyHandler = async () => {
    getPortfolioStrategy();
  };

  const updateCampaignSettingsHandler = async () => {
    const updatedCampaignSettings = createUpdateCampaignSettings(formState);
    if (campaignData && typeof campaignId === "number") {
      await updateCampaignSettings(
        campaignId as number,
        updatedCampaignSettings
      ).then(() => invalidateQuery("editableCampaign"));
    }
    fieldUpdated();
  };

  const updateNetworkSettingsHandler = async () => {
    const updatedNetworkSettings = createUpdateNetworkSettings(formState);
    if (campaignData && typeof campaignId === "number") {
      updateCampaignNetworkSettings(
        campaignId as number,
        updatedNetworkSettings
      ).then(() => invalidateQuery("editableCampaign"));
    }
    fieldUpdated();
  };

  const updateCampaignBudgetHandler = async () => {
    const updatedCampaignBudget = createUpdateCampaignBudget(formState);
    if (campaignData && typeof campaignData[0]?.campaign_budget === "string") {
      const currentCampaignBudget: UpdateCampaignBudget = {
        resource_name: campaignData[0]?.campaign_budget,
        amount_micros: campaignData[0]?.amount_micros / 1000000,
        explicitly_shared: campaignData[0]?.explicitly_shared,
        delivery_method: campaignData[0]?.delivery_method,
      };

      await updateCampaignBudgetSettings(
        campaignId,
        updatedCampaignBudget,
        currentCampaignBudget
      ).then(() => invalidateQuery("editableCampaign"));
    }
    fieldUpdated();
  };

  const updateCampaignGeoTargetHandler = async () => {
    const updatedCampaignGeoTarget =
      createUpdateCampaignGeoTargetType(formState);
    if (campaignData && typeof campaignId === "number") {
      // console.log(
      //   campaignId,
      //   updatedCampaignGeoTarget,
      //   campaignData[0]?.geo_target_type_setting?.positive_geo_target_type
      // );
      await updateCampaignGeoTargeting(
        campaignId as number,
        updatedCampaignGeoTarget
      ).then(() => invalidateQuery("editableCampaign"));
    }
    fieldUpdated();
  };

  const updateShoppingsSettingsHandler = async () => {
    const updatedCampaignShoppingSettings =
      createUpdateCampaignShoppingSettings(formState);
    if (campaignData && typeof campaignId === "number") {
      updateCampaignShoppingSettings(
        campaignId as number,
        updatedCampaignShoppingSettings
      ).then(() => invalidateQuery("editableCampaign"));
    }
    fieldUpdated();
  };

  const updateCampaignBiddingStrategyType = async () => {
    const updateBiddingStrategy =
      createUpdateCampaignBiddingStrategyType(formState);

    if (campaignData && typeof campaignId === "number") {
      updateBiddingStrategyType(
        campaignId as number,
        updateBiddingStrategy as UpdateBiddingStrategy
      ).then(() => invalidateQuery("editableCampaign"));
    }
    fieldUpdated();
  };

  const updateCampaignEnableLocalInvetory = async () => {
    //const localInventoryStatus = createUpdateLocalInventory(formState);
    if (campaignData && typeof campaignId === "number") {
      //console.log("jacked?", formState?.inputs.enableLocalInventory?.value);
      await updateLocalInventory(
        campaignId,
        formState?.inputs?.enableLocalInventory?.value as boolean
      ).then(() => invalidateQuery("editableCampaign"));
    }
    fieldUpdated();
  };

  const expandAccordion = (accordionProp: string) => {
    setIsExpand((prev) => ({
      ...(Object.keys(prev).reduce(
        (acc, key) => ({ ...acc, [key]: false }),
        {}
      ) as AccordionStates),
      [accordionProp]: !prev[accordionProp as keyof typeof isExpand],
    }));
  };

  const getSharedBudgetsHandler = () => {
    getSharedBudgets();
    setOpenSharedModal((prev) => !prev);
  };

  const selectSharedResourceHandler = (name: string, resource: string) => {
    setSharedBudgetId({
      name: name,
      resourceName: resource,
    });
    setOpenSharedModal(false);
    inputHandler("campaignBudgetName", name, true);
  };

  const toggleBudgetShareOptions = () => {
    setIsSharedBudget((prev) => !prev);
    //maybe dont need to clear state
    setSharedBudgetId({
      name: "",
      resourceName: "",
    });
  };

  const handleTargetRoas = () => {
    setIsTargetRoas((prev) => !prev);
  };

  const manualCpcHandler = () => {
    setIsManualCpc((prev) => !prev);
  };

  const portfolioStrategyHandler = () => {
    setOpenPortfolioStrategy((prev) => !prev);
  };

  const resetCanceledData = () => {
    setResetState((prev) => (prev += 1));
  };

  //console.log("FormState", formState);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        ".MuiDrawer-paperAnchorRight": {
          width: "40vw",
          padding: "1rem",
          background: session?.user?.theme === "light" ? "#f1f3f4" : "",
        },
      }}
    >
      {!isLoading && (
        <>
          <Typography color="text.secondary">
            Editing Campaign: {campaignData && campaignData[0]?.campaign_name}
          </Typography>
          <Stack>
            <Accordionize
              details={"Campaign Name"}
              isExpanded={isExpand.campaignName}
              toggleAccordion={() => expandAccordion("campaignName")}
              isEditingCampaign={true}
              updateCampaign={updateCampaignSettingsHandler}
              onClose={() => resetCanceledData()}
            >
              {!isPostLoading && (
                <InputableText
                  id="campaignName"
                  formState={formState}
                  inputHandler={inputHandler}
                />
              )}
              {isPostLoading && <CircularProgress />}
            </Accordionize>
            <Accordionize
              details={"Budget"}
              isExpanded={isExpand.budget}
              toggleAccordion={() => expandAccordion("budget")}
              isEditingCampaign={true}
              updateCampaign={updateCampaignBudgetHandler}
              onClose={() => resetCanceledData()}
            >
              <Stack spacing={2}>
                {!isPostLoading && (
                  <>
                    <InputableText
                      id="campaignBudgetAmount"
                      formState={formState}
                      inputHandler={inputHandler}
                    />

                    <BudgetType
                      currentResource={
                        campaignData && campaignData[0]?.campaign_budget
                      }
                      isSharedBudget={isSharedBudget as boolean}
                      onSetSharedBudget={toggleBudgetShareOptions}
                      isLoading={sharedBudgetIsLoading}
                      openSharedBudgets={openSharedModal}
                      onGetSharedBudgetList={getSharedBudgetsHandler}
                      onSelectNewSharedResource={selectSharedResourceHandler}
                      formState={formState}
                      inputHandler={inputHandler}
                      availableBudgets={sharedBudgets}
                    />

                    <SelectorOptions
                      id="campaignBudgetDelivery"
                      formState={formState}
                      inputHandler={inputHandler}
                    />
                  </>
                )}
                {isPostLoading && <CircularProgress />}
              </Stack>
            </Accordionize>
            <Accordionize
              details={"Geo Targeting"}
              isExpanded={isExpand.geoTargetType}
              toggleAccordion={() => expandAccordion("geoTargetType")}
              isEditingCampaign={true}
              updateCampaign={updateCampaignGeoTargetHandler}
              onClose={() => resetCanceledData()}
            >
              {!isPostLoading && (
                <SelectorOptions
                  id="positiveGeoTargetType"
                  formState={formState}
                  inputHandler={inputHandler}
                />
              )}
              {isPostLoading && <CircularProgress />}
            </Accordionize>
            <Accordionize
              details={"Network Settings"}
              isExpanded={isExpand.networkSettings}
              toggleAccordion={() => expandAccordion("networkSettings")}
              isEditingCampaign={true}
              updateCampaign={updateNetworkSettingsHandler}
              onClose={() => resetCanceledData()}
            >
              {!isPostLoading && (
                <EditNetworkSettings
                  formState={formState}
                  inputHandler={inputHandler}
                />
              )}
              {isPostLoading && <CircularProgress />}
            </Accordionize>

            <Accordionize
              details={"Bidding Strategy"}
              isExpanded={isExpand.biddingStrategyType}
              toggleAccordion={() => expandAccordion("biddingStrategyType")}
              isEditingCampaign={true}
              updateCampaign={updateCampaignBiddingStrategyType}
              onClose={() => resetCanceledData()}
            >
              {!isPostLoading && (
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
                  currentStrategy={campaignData?.[0]?.bidding_strategy_type}
                />
              )}
              {isPostLoading && <CircularProgress />}
            </Accordionize>
            <Accordionize
              details={"Campaign Priority"}
              isExpanded={isExpand.campaignPriority}
              toggleAccordion={() => expandAccordion("campaignPriority")}
              isEditingCampaign={true}
              updateCampaign={updateShoppingsSettingsHandler}
              onClose={() => resetCanceledData()}
            >
              {!isPostLoading && (
                <SelectorOptions
                  formState={formState}
                  inputHandler={inputHandler}
                  id="campaignPriority"
                />
              )}
              {isPostLoading && <CircularProgress />}
            </Accordionize>
            <Accordionize
              details={"Local Inventory"}
              isExpanded={isExpand.enableLocal}
              toggleAccordion={() => expandAccordion("enableLocal")}
              isEditingCampaign={true}
              updateCampaign={updateCampaignEnableLocalInvetory}
              onClose={() => resetCanceledData()}
            >
              {!isPostLoading && (
                <LocalInventory
                  formState={formState}
                  inputHandler={inputHandler}
                />
              )}

              {isPostLoading && <CircularProgress />}
            </Accordionize>
            {/* <Accordionize
              details={"Inventory Filter"}
              isExpanded={isExpand.inventoryFilter}
              toggleAccordion={() => expandAccordion("inventoryFilter")}
              isEditingCampaign={true}
              onClose={() => resetCanceledData()}
            >
              <InventoryFilter
                formState={formState}
                inputHandler={inputHandler}
                onFilterSelect={(event: SelectChangeEvent<string>) =>
                  handleSelectedFilterChange(event)
                }
                selectedFilter={selectedFilter}
                openInventoryFilter={openInventoryFilter}
                onOpenInventoryFilter={setOpenInventoryFilter}
                selectedInventoryFilter={selectedInventoryFilter}
                onInventoryFilterChange={(val: string) =>
                  handleInventoryFilterChange(val)
                }
                filteredData={filteredData as AvailableProducts[]}
                inventoryFilterIsLoading={inventoryFilterIsLoading}
              />
            </Accordionize> */}
          </Stack>
        </>
      )}
      {isLoading && <LoadingDrawerSkeleton />}
    </Drawer>
  );
};

export default EditCampaignDrawer;
