import React, { useState } from "react";

import { useSession } from "next-auth/react";

import { State } from "@/types";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  Button,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

type InventoryFilter = {
  inputHandler?: (
    id: string,
    value: string | number | boolean,
    isValid: boolean
  ) => void;
  formState?: State;
  filteredData?: (string | number)[];
};

type AvailableProducts = {
  category: string;
  count?: number;
};

type ApiResponse = {
  segmentTitle: string;
  titles: string;
};

type Filter = {
  segment: string;
  data: AvailableProducts[];
  open: boolean;
};

const InventorySegments = {
  product_brand: "Brand",
  product_type: "Product Type",
  product_channel: "Product Channel",
  product_item_id: "Product Id",
  product_condition: "Product Condition",
};

export const InventoryFilter = ({
  inputHandler,
  formState,
}: InventoryFilter) => {
  const { data: session } = useSession();
  const [inventorySegment, setInventorySegment] = useState<string>("");
  const [filteredData, setFilterData] = useState<AvailableProducts[]>([]);
  const [openInventoryFilter, setOpenInventoryFilter] =
    useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [filters, setFilters] = useState<Filter[]>([
    { segment: "", data: [], open: false },
  ]);

  const updateFilterSegment = async (index: number, segment: string) => {
    // Step 1: Update the selected segment for the specific filter
    let newFilters = [...filters];
    newFilters[index] = { ...newFilters[index], segment: segment };

    // Step 2: Fetch data if the segment is not empty
    if (segment !== "") {
      try {
        setIsLoading(true);
        const response = await fetch(
          `/api/inventory-filter?id=${session?.user?._id}&filterSegment=${segment}`,
          { method: "GET" }
        );

        if (!response.ok) {
          throw new Error("There was an error with the response.");
        }

        const data = await response.json();
        const queryResults = data.productsAvailable.map(
          (item: ApiResponse) => ({
            category: item.segmentTitle,
            count: item.titles,
          })
        );

        // Step 3: Update only the relevant filter's data

        newFilters[index] = {
          ...newFilters[index],
          data: queryResults,
          open: true,
        };
        //console.log(newFilters);
        setFilters(newFilters);
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        console.error("There was an error retrieving inventory data.", err);
      }
    } else {
      // Clear data if the segment is empty
      newFilters[index] = { ...newFilters[index], data: [] };
      setFilters(newFilters);
    }
  };

  const addFilter = () => {
    if (filters.length < 4) {
      setFilters([...filters, { segment: "", data: [], open: false }]);
    }
  };

  const removeFilter = (index: number) => {
    setFilters(filters.filter((_, i) => i !== index));
  };

  const updateFilterOpenState = (index: number, open: boolean) => {
    const newFilters = [...filters];
    newFilters[index] = { ...newFilters[index], open };
    setFilters(newFilters);
  };

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="subtitle1" color="text.secondary">
          Set Inventory Filters
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <FormControl>
          <FormLabel id="setInventoryFilter"></FormLabel>
          <RadioGroup
            value={openInventoryFilter ? "filterProducts" : "noFilter"}
            onChange={(event) =>
              setOpenInventoryFilter(event.target.value === "filterProducts")
            }
          >
            <FormControlLabel
              value="noFilter"
              control={<Radio />}
              label="No Filter - Use all products available"
              sx={{ color: "text.secondary" }}
            />
            <FormControlLabel
              value="filterProducts"
              control={<Radio />}
              label="Filter products by my requirements"
              sx={{ color: "text.secondary" }}
            />
          </RadioGroup>
        </FormControl>
        {openInventoryFilter &&
          filters.map((filter, index) => (
            <Stack direction="row" alignItems="center" spacing={2}>
              <Stack>
                <Select
                  displayEmpty
                  value={filter.segment}
                  onChange={(event: SelectChangeEvent<string>) => {
                    setInventorySegment(event.target.value);
                    updateFilterSegment(index, event.target.value);
                  }}
                >
                  {Object.entries(InventorySegments).map(([key, segment]) => (
                    <MenuItem key={key} value={key}>
                      {segment}
                    </MenuItem>
                  ))}
                </Select>
              </Stack>
              <Stack>
                <Typography>=</Typography>
              </Stack>
              <Stack>
                <Autocomplete
                  id="FilterOptions"
                  sx={{ width: 300 }}
                  open={filter.open}
                  onOpen={() => {
                    updateFilterOpenState(index, true);
                  }}
                  onClose={() => updateFilterOpenState(index, false)}
                  isOptionEqualToValue={(option, value) => option === value}
                  getOptionLabel={(option: AvailableProducts) =>
                    `${option.category} (${option.count} products)`
                  }
                  options={filter.data}
                  loading={isLoading}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Segment"
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <React.Fragment>
                            {isLoading ? (
                              <CircularProgress color="inherit" size={20} />
                            ) : null}
                            {params.InputProps.endAdornment}
                          </React.Fragment>
                        ),
                      }}
                    />
                  )}
                />
              </Stack>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Button onClick={addFilter} disabled={filters.length >= 4}>
                  Add Filter
                </Button>
                {index !== 0 && (
                  <Button
                    variant="outlined"
                    onClick={() => removeFilter(index)}
                  >
                    X
                  </Button>
                )}
              </Stack>
            </Stack>
          ))}
      </AccordionDetails>
    </Accordion>
  );
};
