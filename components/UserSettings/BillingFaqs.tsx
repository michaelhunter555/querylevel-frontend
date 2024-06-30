import React from "react";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";

export default function BillingFaqs() {
  const [expanded, setExpanded] = React.useState<string | false>(false);

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  return (
    <Container
      id="faq"
      sx={{
        pt: { xs: 4, sm: 12 },
        pb: { xs: 8, sm: 16 },
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: { xs: 3, sm: 6 },
      }}
    >
      <Typography
        component="h2"
        variant="h4"
        color="text.primary"
        sx={{
          width: { sm: "100%", md: "60%" },
          textAlign: { sm: "left", md: "center" },
        }}
      >
        Frequently asked questions
      </Typography>
      <Box sx={{ width: "100%" }}>
        <Accordion
          expanded={expanded === "panel1"}
          onChange={handleChange("panel1")}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1d-content"
            id="panel1d-header"
          >
            <Typography component="h3" variant="subtitle2">
              How do I contact customer support if I have a question or issue?
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography
              variant="body2"
              gutterBottom
              sx={{ maxWidth: { sm: "100%", md: "70%" } }}
            >
              You can reach our customer support team by emailing
              <Link> support@querylevel.com </Link>
              We&apos;re here to assist you promptly.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={expanded === "panel2"}
          onChange={handleChange("panel2")}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2d-content"
            id="panel2d-header"
          >
            <Typography component="h3" variant="subtitle2">
              How does billing work?
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography
              variant="body2"
              gutterBottom
              sx={{ maxWidth: { sm: "100%", md: "70%" } }}
            >
              Your very first payment is charged immediately via Stripe. After,
              each billing period is 30 days from the start date of your
              subscription. Once a plan is selected, billing periods are managed
              internally through stripe. Users are charged by the millisecond
              for time used on the app to allow for seamless upgrading and
              downgrading as needed (for appropriate billing proration). In the
              event where a customer cancels, the billing is not prorated.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={expanded === "panel3"}
          onChange={handleChange("panel3")}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel3d-content"
            id="panel3d-header"
          >
            <Typography component="h3" variant="subtitle2">
              What happens if I cancel after I upgrade/downgrade my plan?
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Alert severity="warning">
              When you cancel your plan, your tier campaign creating quota will
              become 0 and plan type updated to <code>'canceled'</code> plan.
              The campaigns and work you've create will remain as it belongs to
              your Google Ads Account.
            </Alert>
            <Typography gutterBottom variant="h6">
              What happens if I did not upgrade or downgrade before canceling in
              same month?
            </Typography>
            <Typography
              variant="body2"
              gutterBottom
              sx={{ maxWidth: { sm: "100%", md: "70%" } }}
            >
              As long as you canceled before the end of your next billing
              period, you will no longer receive any charges unless settling any
              amount owed. Additional fees are usually only incurred due to
              upgrading & downgrading in the same month.
            </Typography>
            <Typography gutterBottom variant="h6">
              I upgraded then canceled, what happens?
            </Typography>
            <Typography
              variant="body2"
              gutterBottom
              sx={{ maxWidth: { sm: "100%", md: "70%" } }}
            >
              When a plan is canceled, the plan status is updated to 'canceled'.
              There will be no further charges when your plan expires. If you
              upgrade from growing to pro and agreed to the new fee, you will
              may be charged an additional amount as an outstanding balance for
              the next billing period. The difference would be settled based on
              the amount of time passed since the currently selected plan, the
              would be amount of time remaining on the new plan and the
              calculated difference in total due.
            </Typography>
            <Typography variant="h6">
              I downgraded and canceled, what's next?
            </Typography>
            <Typography
              variant="body2"
              gutterBottom
              sx={{ maxWidth: { sm: "100%", md: "70%" } }}
            >
              The same applies but in reverse. However, note that your first
              month is charged in full and is not prorated. For subsequent
              months, if you downgraded, then the difference would be settled
              based on the amount of time passed since the currently selected
              plan, the would be amount of time remaining on the new plan and
              the calculated difference in total due. This may result in a
              credit that can be used in the future.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={expanded === "panel4"}
          onChange={handleChange("panel4")}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel4d-content"
            id="panel4d-header"
          >
            <Typography component="h3" variant="subtitle2">
              What happens if I upgrade/downgrade my plan ?
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography
              variant="body2"
              gutterBottom
              sx={{ maxWidth: { sm: "100%", md: "70%" } }}
            >
              If you upgrade your plan, Stripe prorates the subscription cost
              when you upgrade/downgrade. This means that the unused portion of
              the currently paid billing period is credited towards the new
              plan. The difference would be settled based on the amount of time
              passed since the currently selected plan, the would be amount of
              time remaining on the new plan and the calculated difference in
              total due. In the event where you downgrade from 'pro' to
              'growing', the difference is applied on top of the subscription
              fee for the next billing cycle.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={expanded === "panel5"}
          onChange={handleChange("panel5")}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel5d-content"
            id="panel5d-header"
          >
            <Typography component="h3" variant="subtitle2">
              What features can I access once my Plan is canceled but still
              before the expiry date?
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography
              variant="body2"
              gutterBottom
              sx={{ maxWidth: { sm: "100%", md: "70%" } }}
            >
              All features are available except tiered campaign creation. It is
              encouraged to create the campaigns you need before canceling.
              After you've canceled, your creation quota will become 0 and any
              further attemps will result in an unathorized error.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={expanded === "panel6"}
          onChange={handleChange("panel6")}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel6d-content"
            id="panel6d-header"
          >
            <Typography component="h3" variant="subtitle2">
              I started off as pro, created 15 campaigns, then downgraded to the{" "}
              <code>growing</code> plan. Why am I seeing a lower campaign quota
              for my new billing period?
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography
              variant="body2"
              gutterBottom
              sx={{ maxWidth: { sm: "100%", md: "70%" } }}
            >
              If you downgrade after exceeding the campaign quota of a growing
              plan, the difference is deducted from your quota for next billing
              period. Campaign creation quotas are managed internally by Query
              Level. Each user is allowed a specific set of tiered campaign
              creations each month.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={expanded === "panel7"}
          onChange={handleChange("panel7")}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel7d-content"
            id="panel7d-header"
          >
            <Typography component="h3" variant="subtitle2">
              How are upgrade & downgrade prorations calculated?
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography
              variant="body2"
              gutterBottom
              sx={{ maxWidth: { sm: "100%", md: "70%" } }}
            >
              When a subscription is upgraded, Stripe will automatically
              calculate the prorated amount owed. For instance, if you moved
              from a $10.00/mo subscription price to a $100.00/mo subscription
              price in the middle of a billing cycle, you would be owed a $5.00
              credit for the first price and then owe $50.00 for the new price.
              This means that you owe a total of $45.00 for the subscription
              upgrade. This amount is charged at the end of the billing cycle.
            </Typography>
            <Typography
              variant="body2"
              gutterBottom
              sx={{ maxWidth: { sm: "100%", md: "70%" } }}
            >
              When you downgraded or cancel a subscription, you might be owed a
              credit. For example, If you move from a $100.00/mo subscription
              price to a $10.00/mo subscription price in the middle of the
              billing cycle, you would be owed $50.00 for the first price and
              owe $5.00 for the new price. A total of $45.00 is now owed to you
              for the subscription downgrade and that credit ends up being added
              to your credit balance to be applied to future invoices.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={expanded === "panel8"}
          onChange={handleChange("panel8")}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel8d-content"
            id="panel8d-header"
          >
            <Typography component="h3" variant="subtitle2">
              How does Pay as you go work?
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography
              variant="body2"
              gutterBottom
              sx={{ maxWidth: { sm: "100%", md: "70%" } }}
            >
              The <code>Pay as you go</code> feature serves two key purposes. 1.
              Allow users to only access Query Level's core feature and create
              tiered Google Shopping ad campaigns. 2. Allow users on
              subscriptions to individually increase their quota as needed if
              they don't want to upgrade.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={expanded === "panel9"}
          onChange={handleChange("panel9")}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel9d-content"
            id="panel9d-header"
          >
            <Typography component="h3" variant="subtitle2">
              Does Query Level store any campaign related information about my
              account?
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography
              variant="body2"
              gutterBottom
              sx={{ maxWidth: { sm: "100%", md: "70%" } }}
            >
              No. We only encrypt and store your Google Ads account Id and
              neccessary credentials issued to Query Level by Google after
              successful app authorization. This is to retrieve specific Google
              Shopping Ads data when you're using the app. The app can only
              retrieve and perform operations at your request.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Container>
  );
}
