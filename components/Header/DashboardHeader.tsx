import * as React from "react";

import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

import { PaletteMode } from "@mui/material";
import Stack from "@mui/material/Stack";

import ColorModeIconDropdown from "./ColorModeIcon";
import NavbarBreadcrumbs from "./NavbarBreadcrumbs";

interface DashboardHeaderProps {
  mode: PaletteMode;
}
export default function DashboardHeader() {
  const router = useRouter();
  const { data: session } = useSession();
  const showCrumbs = router.pathname !== "/" && session?.user?._id;

  return (
    <Stack
      direction="row"
      sx={{
        display: { xs: "none", md: "flex" },
        width: "100%",
        alignItems: { xs: "flex-start", md: "center" },
        justifyContent: "space-between",
        maxWidth: { sm: "100%", md: "1700px" },
        pt: 1.5,
      }}
      spacing={2}
    >
      {showCrumbs && (
        <>
          {" "}
          <NavbarBreadcrumbs />
          <Stack direction="row" sx={{ gap: 1 }}>
            <ColorModeIconDropdown />
          </Stack>
        </>
      )}
    </Stack>
  );
}
