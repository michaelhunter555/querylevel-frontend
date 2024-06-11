import React, { useState } from "react";

import { State } from "@/types";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import MenuItem from "@mui/material/MenuItem";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

//const Autocomplete = dynamic(() => import("@mui/material/Autocomplete"),  { ssr: false })
type InventoryFilter = {
  formState?: State;
  selectedFilter: string | null;
  openInventoryFilter: boolean;
  selectedInventoryFilter: string;
  filteredData: AvailableProducts[];
  inventoryFilterIsLoading: boolean;
  inputHandler: (
    id: string,
    value: string | number | boolean,
    isValid: boolean
  ) => void;
  onFilterSelect: (filter: any) => void;
  onOpenInventoryFilter: (val: boolean) => void;
  onInventoryFilterChange: (val: string) => void;
};

export type AvailableProducts = {
  category: string;
  count?: number;
  formState: State;
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
  product_type_l1: "Product Type",
  product_channel: "Product Channel",
  product_item_id: "Product Id",
  product_condition: "Product Condition",
};

export const InventoryFilter = ({
  inputHandler,
  formState,
  onFilterSelect,
  selectedFilter,
  openInventoryFilter,
  onOpenInventoryFilter,
  selectedInventoryFilter,
  onInventoryFilterChange,
  filteredData,
  inventoryFilterIsLoading,
}: InventoryFilter) => {
  const [open, setOpen] = useState<boolean>(false);

  const clearForm = () => {
    onInventoryFilterChange("");
    inputHandler("inventoryFilters", "", true);
    setOpen(false);
  };

  return (
    <>
      <FormControl>
        <FormLabel id="setInventoryFilter"></FormLabel>
        <RadioGroup
          value={openInventoryFilter ? "filterProducts" : "noFilter"}
          onChange={(event) => {
            onOpenInventoryFilter(event.target.value === "filterProducts");
            clearForm();
          }}
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
      {openInventoryFilter && (
        <Stack direction="row" alignItems="center" spacing={2}>
          <Stack>
            <Select
              sx={{ width: 250 }}
              displayEmpty
              value={selectedFilter || "Select Filter"}
              onChange={onFilterSelect}
            >
              {Object.entries(InventorySegments).map(([key, segment]) => (
                <MenuItem key={key} value={key}>
                  {segment}
                </MenuItem>
              ))}
            </Select>
          </Stack>
          <Stack>
            <Typography color="text.secondary">=</Typography>
          </Stack>
          <Stack>
            <Autocomplete
              id="FilterOptions"
              sx={{ width: 300 }}
              open={open}
              onOpen={() => {
                setOpen(true);
              }}
              disabled={inventoryFilterIsLoading}
              onClose={() => setOpen(false)}
              isOptionEqualToValue={(option, value) => option === value}
              getOptionLabel={(option: any) => option?.category} //find correct type
              options={filteredData}
              loading={inventoryFilterIsLoading}
              value={
                filteredData?.find(
                  (item) => item?.category === selectedInventoryFilter
                ) || null
              }
              onChange={(event, newValue) => {
                if (newValue) {
                  onInventoryFilterChange(newValue?.category);
                  inputHandler(
                    "inventoryFilters",
                    `${selectedFilter} = ${newValue?.category}`,
                    true
                  );
                }
              }}
              renderInput={(params) => (
                <TextField
                  value={formState?.inputs?.inventoryFilters?.value}
                  {...params}
                  id="inventoryFilters"
                  label="Select Segment"
                  InputProps={{
                    ...params?.InputProps,
                    endAdornment: (
                      <React.Fragment>
                        {inventoryFilterIsLoading ? (
                          <CircularProgress color="inherit" size={20} />
                        ) : null}
                        {params?.InputProps?.endAdornment}
                      </React.Fragment>
                    ),
                  }}
                />
              )}
            />
          </Stack>
          {selectedFilter && selectedInventoryFilter && (
            <Stack>
              <Button onClick={clearForm}> Clear </Button>
            </Stack>
          )}
        </Stack>
      )}
    </>
  );
};
