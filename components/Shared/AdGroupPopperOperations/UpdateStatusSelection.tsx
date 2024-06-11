import React, { useState } from "react";

import { useInvalidateQuery } from "@/hooks/invalidateQueries";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";

interface AdGroupStatusProps {
  adGroup: any;
  onCancel: (event: React.MouseEvent<HTMLElement>) => void;
  updateAdGroupStatus?: (adGroup: {}) => Promise<void>;
  statusIsUpdating?: boolean;
}

export const UpdateAdGroupStatus = ({
  adGroup,
  updateAdGroupStatus,
  statusIsUpdating,
  onCancel,
}: AdGroupStatusProps) => {
  const [selected, setSelected] = useState(adGroup?.status);
  const { invalidateQuery } = useInvalidateQuery();
  const enabled = 2;
  const paused = 3;

  return (
    <Stack>
      <ListItemButton
        onClick={async (event: React.MouseEvent<HTMLElement>) => {
          if (selected !== enabled) {
            await updateAdGroupStatus?.(adGroup).then(async () => {
              onCancel(event);
              await invalidateQuery("adGroups");
            });
            setSelected(enabled);
          }
        }}
        selected={selected === enabled}
      >
        <ListItemText
          primary={
            <>
              {statusIsUpdating ? (
                <Stack sx={{ width: "100%" }}>
                  <Skeleton sx={{ minWidth: 80 }} />
                </Stack>
              ) : (
                `${selected === enabled ? "Enabled*" : "Enable"}`
              )}
            </>
          }
        />
      </ListItemButton>

      <ListItemButton
        onClick={async (event: React.MouseEvent<HTMLElement>) => {
          if (selected !== paused) {
            await updateAdGroupStatus?.(adGroup).then(async () => {
              onCancel(event);
              await invalidateQuery("adGroups");
            });
            setSelected(paused);
          }
        }}
        selected={selected === paused}
      >
        <ListItemText
          primary={
            <>
              {statusIsUpdating ? (
                <Stack sx={{ width: "100%" }}>
                  <Skeleton sx={{ minWidth: 80 }} />
                </Stack>
              ) : (
                `${selected === paused ? "Paused*" : "Pause"}`
              )}
            </>
          }
        />
      </ListItemButton>
    </Stack>
  );
};
