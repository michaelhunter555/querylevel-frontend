import React from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

interface ModeSwitch {
  toggle: boolean;
  toggleScheduleHandler: () => void;
  isDisabled: boolean;
}

export const ModeSwitcher: React.FC<ModeSwitch> = ({
  toggle,
  toggleScheduleHandler,
  isDisabled,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: "10px",
      }}
    >
      <Stack>
        <Typography variant="subtitle2" color="text.secondary">
          Ad Schedule
        </Typography>
      </Stack>
      <Stack sx={{ margin: "0.5rem" }}>
        <Chip
          label={toggle ? "Pre-Set Times" : "Set Custom Time?"}
          variant="outlined"
          color="primary"
          size="small"
          component={Button}
          onClick={toggleScheduleHandler}
          disabled={isDisabled}
        />
      </Stack>
    </Box>
  );
};

export default ModeSwitcher;
