import React from "react";

import { AvailableProducts, State } from "@/types";
import Grid from "@mui/material/Grid";
import { SelectChangeEvent } from "@mui/material/Select";
import Stack from "@mui/material/Stack";

import { Accordionize } from "../Accordion/Accordion";
import { LocationSelect } from "../CreateCampaignSteps/CreateShoppingCampaign/LocationSelect";
import { InventoryFilter } from "../InventoryFilter/InventoryFilter";
import { LocalInventory } from "../LocalInventory/LocalInventory";

type CreateCampaignStepTwo = {
  localInventoryIsExpanded: boolean;
  onToggleLocalInventory: () => void;
  formState: State;
  excludedLocation: string[];
  targetedLocation: string[];
  isExpanded: boolean;
  selectedFilter: string | null;
  openInventoryFilter: boolean;
  inputHandler: (
    id: string,
    value: string | number | boolean,
    isValid: boolean
  ) => void;
  filteredData: AvailableProducts[];
  inventoryFilterIsLoading: boolean;
  selectedInventoryFilter: string;
  toggleLocationAccordion: () => void;
  locationIsExpanded: boolean;
  onInventoryFilterChange: (val: string) => void;
  onExcludedLocation: (val: string[]) => void;
  onTargetedLocation: (val: string[]) => void;
  onFilterSelect: (filter: any) => void;
  onOpenInventoryFilter: (val: boolean) => void;
  toggleAccordion: () => void;
};

const CreateCampaignStepTwo = ({
  formState,
  inputHandler,
  onExcludedLocation,
  excludedLocation,
  targetedLocation,
  onTargetedLocation,
  isExpanded,
  onFilterSelect,
  selectedFilter,
  openInventoryFilter,
  onOpenInventoryFilter,
  toggleAccordion,
  selectedInventoryFilter,
  onInventoryFilterChange,
  toggleLocationAccordion,
  locationIsExpanded,
  filteredData,
  inventoryFilterIsLoading,

  localInventoryIsExpanded,
  onToggleLocalInventory,
}: CreateCampaignStepTwo) => {
  const excludeLocationHandler = (
    event: SelectChangeEvent<typeof excludedLocation>
  ) => {
    const {
      target: { value },
    } = event;
    onExcludedLocation(typeof value === "string" ? value.split(",") : value);
    inputHandler("exclude-location", value.toString(), true);
  };

  const targetLocationHandler = (
    event: SelectChangeEvent<typeof targetedLocation>
  ) => {
    const {
      target: { value },
    } = event;
    onTargetedLocation(typeof value === "string" ? value.split(",") : value);
  };

  return (
    <>
      <Grid item xs={11}>
        <Accordionize
          details="Set Inventory Filter"
          isExpanded={isExpanded}
          toggleAccordion={toggleAccordion}
        >
          <InventoryFilter
            formState={formState}
            inputHandler={inputHandler}
            onFilterSelect={onFilterSelect}
            selectedFilter={selectedFilter}
            openInventoryFilter={openInventoryFilter}
            onOpenInventoryFilter={onOpenInventoryFilter}
            selectedInventoryFilter={selectedInventoryFilter}
            onInventoryFilterChange={onInventoryFilterChange}
            filteredData={filteredData}
            inventoryFilterIsLoading={inventoryFilterIsLoading}
          />
        </Accordionize>

        <Accordionize
          details="Enable Local Inventory"
          isExpanded={localInventoryIsExpanded}
          toggleAccordion={onToggleLocalInventory}
        >
          <LocalInventory inputHandler={inputHandler} formState={formState} />
        </Accordionize>

        <Accordionize
          details="Set location Targets"
          isExpanded={locationIsExpanded}
          toggleAccordion={toggleLocationAccordion}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <Grid item xs={5}>
              <LocationSelect
                outlinedInputId="target-locations"
                targetLocation={targetedLocation}
                onTargetLocation={targetLocationHandler}
                inputLabel="Target Locations"
                id="targetLocations"
              />
            </Grid>

            <Grid item xs={5}>
              <LocationSelect
                outlinedInputId="exclude-locations"
                targetLocation={excludedLocation}
                onTargetLocation={excludeLocationHandler}
                inputLabel="Exclude Locations"
                id="excludedLocations"
                isExcluded={true}
              />
            </Grid>
          </Stack>
        </Accordionize>
      </Grid>
    </>
  );
};

export default CreateCampaignStepTwo;
