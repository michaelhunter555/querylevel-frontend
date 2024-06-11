import React from "react";

import { signIn, useSession } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";

import Button from "@mui/material/Button";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

type Loading = {
  isLoading: boolean;
};

export const UserNotLoggedIn = ({ isLoading }: Loading) => {
  const { data: session, status } = useSession();
  return (
    <>
      {!isLoading && !session?.user?._id && (
        <Typography color="text.secondary" variant="subtitle2">
          Authenticate your account with Google.
        </Typography>
      )}

      {isLoading &&
        Array.from({ length: 4 }).map((_, i) => (
          <Stack
            key={i}
            spacing={2}
            direction="row"
            alignItems="center"
            sx={{ width: "60%" }}
          >
            <Skeleton key={i} variant="rounded" width="100%" />
          </Stack>
        ))}

      {!session?.user?._id && !isLoading && (
        <Button
          sx={{
            backgroundColor: "white",
            color: "#444",
            "&:hover": { backgroundColor: "#f1f1f1" },
            width: "100%",
          }}
          startIcon={<FcGoogle />}
          onClick={() => signIn("google")}
          disabled={!!session?.user?._id}
          variant="contained"
        >
          {status === "loading" ? "...Loading" : "Sign In With Google"}
        </Button>
      )}
    </>
  );
};

export default UserNotLoggedIn;
