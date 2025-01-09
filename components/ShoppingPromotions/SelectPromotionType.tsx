import React, { useState } from "react";

import { useCheckDevice } from "@/hooks/use-device-hook";
import { useTheme } from "@mui/material/";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { promoItems } from "./promoItems";

interface SelectPromotionProps {
  onSelectPromotion: (id: number) => void;
}
const SelectPromotionType = ({ onSelectPromotion }: SelectPromotionProps) => {
  const theme = useTheme();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const { isMobile } = useCheckDevice();

  return (
    <Stack direction={isMobile ? "column" : "row"} spacing={2}>
      {promoItems?.map(({ promoType, icon, description, id }, i) => (
        <Paper
          elevation={0}
          key={id}
          sx={{
            borderRadius: 4,
            padding: 2,
            cursor: "pointer",
            ...(selectedId === i
              ? {
                  border:
                    theme.palette.mode === "light"
                      ? "1px solid rgb(24, 24, 24)"
                      : "1px solid rgb(221, 221, 221)",
                }
              : { border: "1px solid transparent" }),
          }}
          onClick={() => {
            setSelectedId(id);
            onSelectPromotion(id);
          }}
        >
          <Stack spacing={2}>
            <Stack alignItems="center">
              {icon}
              <Typography color="text.secondary" variant="subtitle1">
                {promoType}
              </Typography>
            </Stack>
            <Divider />
            <Stack>
              <Typography variant="subtitle2" color="text.secondary">
                {description}
              </Typography>
            </Stack>
          </Stack>
        </Paper>
      ))}
    </Stack>
  );
};

export default SelectPromotionType;
