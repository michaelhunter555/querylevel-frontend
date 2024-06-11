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
              Your very first payment is charged immediately via Stripe. Each
              billing period is 30 days from the start date of your
              subscription. Once a plan is selected, billing periods are managed
              internally through stripe.
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
            </Alert>
            <Typography gutterBottom variant="h6">
              Did not upgrade or downgrade before canceling in same month?
            </Typography>
            <Typography
              variant="body2"
              gutterBottom
              sx={{ maxWidth: { sm: "100%", md: "70%" } }}
            >
              As long as you canceled before the end of your next billing
              period, you will no longer receive any charges unless settling any
              amount owed. These situations usually occur when
              upgrading/downgrading before canceling in the same month.
            </Typography>
            <Typography gutterBottom variant="h6">
              Upgraded & Canceled
            </Typography>
            <Typography
              variant="body2"
              gutterBottom
              sx={{ maxWidth: { sm: "100%", md: "70%" } }}
            >
              When a plan is canceled, the plan status is updated to 'canceled'.
              There will be no further charges when your plan expires. However,
              any pending balances will be charged. For example, if you started
              on a 'growing' and then upgraded to 'pro' and then canceled, the
              difference would be settled based on the amount of time passed
              since the original plan, the amount remaining on the new plan and
              the difference in total due.
            </Typography>
            <Typography variant="h6">Downgraded & Canceled</Typography>
            <Typography
              variant="body2"
              gutterBottom
              sx={{ maxWidth: { sm: "100%", md: "70%" } }}
            >
              In the event where you downgrade from 'pro' to 'growing' and then
              cancel, the difference is applied as credit to your account. The
              difference will be credited/charged. Note, all credits applied to
              your balance are applied for future invoices. We do not issue
              refunds for downgrades. If you wish to cancel your plan and not be
              charged for an additional month, you must cancel before the plan
              expiry date. Please make sure to review our privacy policy and
              terms of service.
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
              when you upgraded. This means that the unused portion of the
              currently paid billing period is credited towards the new plan.
              The difference would be settled based on the amount of time passed
              since the original plan, the amount remaining on the new plan and
              the difference in total due. In the event where you downgrade from
              'pro' to 'growing', the difference is applied on top of the
              subscription fee for the next billing cycle.
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
              All features are available except tiered campaign creation. It it
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
              I started off as pro, created 15 campaigns, then quickly
              downgraded to the <code>growing</code> plan. Why am I seeing a
              lower campaign quota for my new billing period?
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography
              variant="body2"
              gutterBottom
              sx={{ maxWidth: { sm: "100%", md: "70%" } }}
            >
              If you downgrade after exceeding the campaign quota of a growing
              plan, the difference is deducted from your next billing period.
              This keeps it fair for us to offer the service as intended as well
              as for the customers who use our service as intended.
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
              Suppose you have a user switching from a $50 plan to a $30 plan on
              day 15 of a 30-day billing cycle: Unused Time on Current Plan: $50
              plan for 15 days = $25 (credited). Time Remaining on New Plan: $30
              plan for 15 days = $15 (charged). Charge for Next Billing Date:
              $30 plan for the next full 30-day cycle. These calculations ensure
              that the user is fairly charged only for the actual time they use
              each plan. This is how Stripe's proration logic works and why the
              values in the proration preview should match what you see in your
              billing dashboard.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Container>
  );
}
