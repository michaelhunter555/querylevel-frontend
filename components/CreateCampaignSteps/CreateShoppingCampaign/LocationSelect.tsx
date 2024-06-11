import React from "react";

import { USStates } from "@/data/countries";
import { getStyles } from "@/util/helpers/getStyles";
import { useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select, { SelectChangeEvent } from "@mui/material/Select";

interface LocationSelector {
  targetLocation: string[];
  onTargetLocation: (event: SelectChangeEvent<string[]>) => void;
  inputLabel: string;
  id: string;
  outlinedInputId: string;
  isExcluded?: true;
}

export const LocationSelect: React.FC<LocationSelector> = ({
  targetLocation,
  onTargetLocation,
  inputLabel,
  id,
  outlinedInputId,
  isExcluded,
}) => {
  const theme = useTheme();

  const targetLocationHandler = (
    event: SelectChangeEvent<typeof targetLocation>
  ) => {
    const {
      target: { value },
    } = event;
    onTargetLocation(event);
  };

  //if excluded then remove USA
  const statesList = isExcluded ? USStates.slice(1) : USStates;

  return (
    <>
      <InputLabel id={id}>{inputLabel}</InputLabel>
      <Select
        multiple
        labelId={id}
        id={id}
        input={<OutlinedInput id={outlinedInputId} />}
        value={targetLocation}
        onChange={targetLocationHandler}
        sx={{ width: "100%" }}
        renderValue={(selected) => (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
            {selected.map((item) => (
              <Chip
                size="small"
                key={item}
                label={item}
                color={isExcluded ? "error" : "primary"}
              />
            ))}
          </Box>
        )}
      >
        {USStates &&
          statesList?.map((state) => {
            const id = state?.geo_target_constant?.id;
            const name = state?.geo_target_constant?.name;
            if (!id || !name) return null;
            return (
              <MenuItem
                key={id}
                value={`${name}:${id}`}
                style={getStyles(name, targetLocation, theme)}
              >
                {name} | id: {id}
              </MenuItem>
            );
          })}
      </Select>
    </>
  );
};
