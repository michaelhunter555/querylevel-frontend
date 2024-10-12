import React from "react";

import Link from "next/link";

import ToggleColorMode from "@/components/DashboardHome/ToggleColorMode";
import HomeIcon from "@mui/icons-material/Home";
import { Link as MuiLink, PaletteMode } from "@mui/material";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

interface PrivacyPolicyProps {
  onToggleTheme: () => void;
  theme: PaletteMode;
}

const PrivacyPolicy = ({ onToggleTheme, theme }: PrivacyPolicyProps) => {
  return (
    <Container
      maxWidth="lg"
      sx={{
        margin: "3rem auto",
        padding: "2rem",
        borderRadius: "10px",
        border: "1px solid #121212",
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography component="h2" variant="h3" color="text.secondary">
          Privacy Policy
        </Typography>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Link href="/">
            <HomeIcon color="primary" />
          </Link>
          <ToggleColorMode mode={theme} toggleColorMode={onToggleTheme} />
        </Stack>
      </Stack>
      <Divider sx={{ margin: "1rem 0" }} />
      <Typography component="h2" variant="h5" color="text.secondary">
        Google Limited Use Policy
      </Typography>

      <Typography gutterBottom variant="subtitle1" color="text.secondary">
        QueryLevel’s use and transfer to any other app of information received
        from Google APIs will adhere to{" "}
        <MuiLink
          href="https://developers.google.com/terms/api-services-user-data-policy#additional_requirements_for_specific_api_scopes"
          target="_blank"
        >
          Google API Services User Data Policy
        </MuiLink>
        , including the Limited Use requirements.
      </Typography>
      <Divider variant="middle" sx={{ margin: "1rem 0" }} />
      <Typography component="h2" variant="h6" color="text.secondary">
        1. Introduction
      </Typography>

      <Typography gutterBottom variant="subtitle1" color="text.secondary">
        Our app is committed to protecting your privacy. This Privacy Policy
        outlines the types of personal information we collect, how it is used,
        and the measures we take to ensure your data is protected.
      </Typography>

      <Typography component="h2" variant="h6" color="text.secondary">
        2. Information Collection
      </Typography>

      <Typography gutterBottom variant="subtitle1" color="text.secondary">
        When you authorize to use our app, we collect the following personal
        information: Google email address, Name, Google Ads account ID, and
        Merchant Center ID. This information is essential for providing you with
        personalized services and a seamless experience. Query Level uses a
        combination of Google Ads and Google Shopping to provide a seamless
        experience. All sensitive information collected is encrypted with
        AES-256 encryption technology, stored on a secure database and only
        decrypted when you are securely logged in and accessing the app.
      </Typography>

      <Typography component="h2" variant="h6" color="text.secondary">
        3. Use of Information
      </Typography>

      <Typography gutterBottom variant="subtitle1" color="text.secondary">
        The personal information you provide is used to allow you to take the
        following actions: To manage your subscription and authenticate your
        account. To view a personalized Google Ads experience by retrieving
        relevant data based on your interactions and account data. To perform
        create, remove, update & delete(remove) operations on all applicable app
        features for your Google Ads account
      </Typography>

      <Typography component="h2" variant="h6" color="text.secondary">
        4. Sharing of Information
      </Typography>
      <Typography gutterBottom variant="subtitle1" color="text.secondary">
        No other information beyond what is mentioned in '#2. Information
        Collection' is stored or collected. We do not sell your personal
        information.
      </Typography>

      <Typography component="h2" variant="h6" color="text.secondary">
        5. Consent
      </Typography>

      <Typography gutterBottom variant="subtitle1" color="text.secondary">
        Consent to collect and process your personal information is obtained
        through Google Authentication and Authorization at the time of your
        login. This process ensures that you are fully aware of the information
        being accessed by our app.
      </Typography>

      <Typography component="h2" variant="h6" color="text.secondary">
        6. User Rights
      </Typography>

      <Typography gutterBottom variant="subtitle1" color="text.secondary">
        As a user, you have the right to: Access the personal information we
        hold about you. Request the correction of any inaccurate information.
        Request the deletion of your personal data from our systems. To exercise
        any of these rights, please contact us via email at
        support@querylevel.com.
      </Typography>

      <Typography component="h2" variant="h6" color="text.secondary">
        7. Data Security
      </Typography>
      <Typography gutterBottom variant="subtitle1" color="text.secondary">
        We prioritize the security of your personal data. We employ AES-256
        encryption technology to protect your account-related information. Our
        databases are secured against unauthorized access, ensuring your
        information is safe.
      </Typography>

      <Typography component="h2" variant="h6" color="text.secondary">
        8. Compliance with the CCPA
      </Typography>
      <Typography gutterBottom variant="subtitle1" color="text.secondary">
        We comply with the requirements of the California Consumer Privacy Act
        (CCPA). If you are a resident of California, you have additional rights
        under this law, including the right to know about the personal
        information collected, processed, and disclosed.
      </Typography>
    </Container>
  );
};

export default PrivacyPolicy;
