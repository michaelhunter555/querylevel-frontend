import React from "react";

import { signOut, useSession } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";

import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

export const UserAccountCard = ({ loading }: { loading: boolean }) => {
  const { data: session } = useSession();

  const handleSignOut = () => {
    signOut({ callbackUrl: "/user-dashboard" });
    localStorage.removeItem("brand");
    localStorage.removeItem("campaign");
  };
  return (
    <Paper
      elevation={0}
      sx={{
        padding: "0.5rem",
        borderRadius: "15px",
        border: "1px solid #bbb",
        margin: { xs: "2rem auto", md: "" },
      }}
    >
      <Stack direction="row" alignItems="center" spacing={2}>
        <Avatar
          src={session?.user?.image}
          alt={`${session?.user?.name}-${Math.floor(Math.random() * 1000)}`}
          sx={{ width: 50, height: 50, marginBottom: 1 }}
        />
        <Typography variant="subtitle2" color="text.secondary">
          Connected to Account Id:{" "}
          {loading ? "loading..." : session?.user?.googleAccountId}
        </Typography>
      </Stack>
      <Stack justifyContent="center" alignItems="center" sx={{ width: "100%" }}>
        <Button
          sx={{
            backgroundColor: "white",
            color: "#444",
            "&:hover": { backgroundColor: "#f9f9f9" },
          }}
          startIcon={<FcGoogle />}
          onClick={handleSignOut}
          variant="contained"
        >
          logout
        </Button>
      </Stack>
    </Paper>
  );
};

export default UserAccountCard;
