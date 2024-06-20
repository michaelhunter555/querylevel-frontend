import React from "react";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import CardMedia from "@mui/material/CardMedia";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

const AppErrorPage = () => {
  const { data: session } = useSession();

  return (
    <Paper elevation={2}>
      <Stack spacing={3} sx={{ padding: "2rem" }}>
        <Typography variant="h2">
          There appears to be an issue with finding your google account Id
        </Typography>
        <Typography gutterBottom>Below are 2 possible reasons.</Typography>
        <Typography color="text.secondary">
          1. The authorized google account does not have a{" "}
          <code>Google Ads </code> or <code>Google Merchant Center </code>
          account associated with it.
        </Typography>
        <Stack direction="row" spacing={3} alignItems="center">
          <Button
            variant="outlined"
            component="a"
            href="https://ads.google.com"
          >
            Create Google Ads account
          </Button>
          <Button
            variant="contained"
            component="a"
            href="https://merchants.google.com/"
          >
            Created Google Merchant Center Account
          </Button>
        </Stack>
        <Stack
          sx={{ flexDirection: { xs: "column", md: "row" } }}
          alignItems="center"
        >
          <Typography color="text.secondary">
            2. The first image next to this text shows two key scopes that must
            be granted in order for the app to be able to work properly. The
            second image shows what your permissions should look like after
            authorizing Query Level. If you did not authorize all scopes, the{" "}
            <code> Google Scopes </code>
            requested by <code>QueryLevel</code> were either partially granted
            or not granted at all. The type of authorization granted does not
            grant QueryLevel access to retrieve and aggregate your{" "}
            <code>Google Ads</code> or <code>Google Shopping</code> performance
            . If you wish to use the app with the associated account moving
            forward, a new authorization will be required. 1. Go to
            myaccount.google.com &gt; permissions, 2. delete Query Level from
            3rd party app permissions, 3. come back to Query Level, 4. sign-in,
            and authorize the app with the requested scopes.
          </Typography>
          <CardMedia
            component="img"
            src="/authorize_app.svg"
            height={500}
            width={400}
            alt="Authorize App"
          />
          <CardMedia
            component="img"
            src="/correct_access_img.svg"
            height={500}
            width={500}
            alt="Correct Access"
          />
        </Stack>
        <Alert
          severity="info"
          action={
            <Chip
              //   icon={<FcGoogle size={20} />}
              label="View App Permissions"
              component={Link}
              href="https://myaccount.google.com/connections"
              target="_blank"
            />
          }
        >
          If you suspect #2 may be the issue, it is suggested to remove the app
          from your permissions and re-authenticate.
        </Alert>
        <Typography color="text.secondary">
          If you are certain issues 1 & 2 are not the case, please contact us at
          support@querylevel.com.
        </Typography>
      </Stack>
      {session?.user?._id && (
        <>
          <Divider />
          <Button onClick={() => signOut({ callbackUrl: "/user-dashboard" })}>
            Log Out
          </Button>
        </>
      )}
    </Paper>
  );
};
export default AppErrorPage;
