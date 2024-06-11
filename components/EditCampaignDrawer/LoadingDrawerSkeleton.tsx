import React from "react";

import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";

export const LoadingDrawerSkeleton = () => {
  return (
    <Stack sx={{ width: "40vw", marginTop: "1rem" }} spacing={2}>
      <Skeleton variant="rounded" height={15} />
      <Skeleton animation="wave" variant="rounded" height={15} />
      <Skeleton animation="wave" variant="rounded" height={15} />
      <Skeleton animation="wave" variant="rounded" height={15} />
      <Skeleton animation={false} variant="rounded" height={15} width="90%" />
    </Stack>
  );
};
