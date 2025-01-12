import React from "react";

import { useSession } from "next-auth/react";
import Link from "next/link";

import { Button } from "@mui/material";

export const SignInWithGoogle = () => {
  const { data: session } = useSession();
  // const router = useRouter();

  // if (session) {
  //   router.push("/user-dashboard");
  // }

  const userIsLoggedIn = session?.user?._id;

  return (
    <Link href="/user-dashboard">
      <Button variant="outlined" size="large">
        {userIsLoggedIn ? "View Dashboard" : "Get Started"}
      </Button>
    </Link>
  );
};
