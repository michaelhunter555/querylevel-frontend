import React from "react";

import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

const TermsOfService = () => {
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
      <Typography component="h2" variant="h3" color="text.secondary">
        Terms of Service
      </Typography>

      <Typography component="h2" variant="h6" color="text.secondary">
        1. Acceptance of Terms
      </Typography>
      <Typography gutterBottom variant="subtitle1" color="text.secondary">
        By accessing or using our app, you agree to be bound by these Terms of
        Service. If you do not agree to these terms, please do not use our
        services.
      </Typography>

      <Typography component="h2" variant="h6" color="text.secondary">
        2. Service Description
      </Typography>
      <Typography gutterBottom variant="subtitle1" color="text.secondary">
        Our app provides an enhanced Google Ads management experience,
        leveraging the Google Ads API to offer custom options for managing
        advertisements tailored to e-commerce businesses. Our service is
        designed to optimize your advertising efforts with Google Shopping Ads
        and provide personalized ad management solutions.
      </Typography>

      <Typography component="h2" variant="h6" color="text.secondary">
        3. User Responsibilities
      </Typography>
      <Typography gutterBottom variant="subtitle1" color="text.secondary">
        Users are expected to use our app responsibly and ethically. Due to API
        limitations, users with large inventories (+9,000 products) may find
        that certain features are less beneficial. Users are responsible for
        understanding these limitations and using our services accordingly.
      </Typography>

      <Typography component="h2" variant="h6" color="text.secondary">
        4. Subscription and Payment
      </Typography>
      <Typography gutterBottom variant="subtitle1" color="text.secondary">
        Our services are available under a subscription model. An initial fee
        will be charged upon selection of a plan on the date of purchase.
        Subsequently, a recurring fee will be charged every 30 days from the
        date of purchase via Stripe. By subscribing to our services, you
        authorize us to charge the applicable recurring subscription fees to
        your designated billing account.
      </Typography>

      <Typography component="h2" variant="h6" color="text.secondary">
        5. Cancellation and Refund Policy
      </Typography>
      <Typography gutterBottom variant="subtitle1" color="text.secondary">
        Subscriptions can be canceled at any time. Upon cancellation, you will
        continue to have access to the service until the end of your current
        billing cycle, but you will not be charged for subsequent periods. There
        are no refunds for subscription fees already paid, even if the service
        is not used during the subscription period. Note that Free-trials do not
        require a credit/debit card.
      </Typography>

      <Typography component="h2" variant="h6" color="text.secondary">
        6. Dispute Resolution
      </Typography>
      <Typography gutterBottom variant="subtitle1" color="text.secondary">
        We aim to resolve any disputes internally and amicably. If you have any
        concerns or disputes regarding our service, we encourage you to contact
        us directly for resolution. In cases where a resolution cannot be
        reached through direct communication, both parties retain the right to
        seek counsel or take other legal steps as deemed necessary.
      </Typography>

      <Typography component="h2" variant="h6" color="text.secondary">
        7. Modifications to Terms of Service
      </Typography>
      <Typography gutterBottom variant="subtitle1" color="text.secondary">
        We reserve the right to modify these Terms of Service at any time. Your
        continued use of the app after any such changes take effect constitutes
        your acceptance of the new Terms of Service.
      </Typography>
    </Container>
  );
};

export default TermsOfService;
