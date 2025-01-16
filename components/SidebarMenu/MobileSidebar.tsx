import React from "react";

import { useSession } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";

import { Typography } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Drawer, { drawerClasses } from "@mui/material/Drawer";
import Stack from "@mui/material/Stack";

import MenuContent from "./MenuContent";

interface MobileSidebar {
  open: boolean;
  onClose: () => void;
  hasAppAccess: boolean;
  signOut: () => void;
}

const MobileSidebar = ({
  open,
  onClose,
  hasAppAccess,
  signOut,
}: MobileSidebar) => {
  const { data: session } = useSession();

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        [`& .${drawerClasses.paper}`]: {
          backgroundImage: "none",
          backgroundColor: "background.paper",
        },
      }}
    >
      <Stack
        sx={{
          maxWidth: "70dvw",
          height: "100%",
        }}
      >
        <Stack direction="row" sx={{ p: 2, pb: 0, gap: 1 }}>
          <Stack
            direction="row"
            sx={{ gap: 1, alignItems: "center", flexGrow: 1, p: 1 }}
          >
            <Avatar
              sizes="small"
              alt={`${session?.user?.name}-query-user`}
              src={session?.user?.image}
              sx={{ width: 24, height: 24 }}
            />
            <Typography variant="subtitle2" color="text.secondary">
              {session?.user?.name}
            </Typography>
          </Stack>
        </Stack>
        <Divider />
        <Stack sx={{ flexGrow: 1 }}>
          <MenuContent onClose={onClose} hasAppAccess={hasAppAccess} />
          <Divider />
        </Stack>

        <Stack sx={{ p: 2 }}>
          <Button
            onClick={signOut}
            variant="outlined"
            fullWidth
            startIcon={<FcGoogle />}
          >
            Logout
          </Button>
        </Stack>
      </Stack>
    </Drawer>
  );
};

export default MobileSidebar;
