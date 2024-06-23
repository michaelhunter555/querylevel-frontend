import React, { useState } from "react";

import Link from "next/link";

import { useForm } from "@/hooks/useForm";
import emailjs from "@emailjs/browser";
import XIcon from "@mui/icons-material/X";
import { Link as MuiLink } from "@mui/material/";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

const logoStyle = {
  width: "140px",
  height: "auto",
};

function Copyright() {
  return (
    <Stack>
      <Stack direction="row" alignItems="center" spacing={1}>
        <Typography variant="body2" color="text.secondary" mt={1}>
          {"Copyright © "} QueryLevel.com {new Date().getFullYear()}
        </Typography>
      </Stack>
      <Typography variant="subtitle2" color="text.secondary">
        Google Shopping™ price comparison service & Google AdWords™ advertising
        service are trademarks of Google LLC
      </Typography>
    </Stack>
  );
}

interface HomeFooter {
  mode: "light" | "dark";
}

export default function HomePageFooter({ mode }: HomeFooter) {
  const [formState, inputHandler, setFormData] = useForm(
    { email: { value: "", isValid: false } },
    false
  );
  const [emailSent, setEmailSent] = useState<boolean>(false);
  const emailIsValid = (email: string) => /^\S+@\S+\.\S+$/.test(email);

  const scrollToSection = (sectionId: string) => {
    const sectionElement = document.getElementById(sectionId);
    const offset = 128;
    if (sectionElement) {
      const targetScroll = sectionElement.offsetTop - offset;
      sectionElement.scrollIntoView({ behavior: "smooth" });
      window.scrollTo({
        top: targetScroll,
        behavior: "smooth",
      });
    }
  };

  const handleSubscribeUser = async (
    event: React.ChangeEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const email = { email: formState?.inputs?.email?.value };
    await emailjs
      .send(
        `${process.env.NEXT_PUBLIC_EMAIL_SERVICE_KEY}`,
        `${process.env.NEXT_PUBLIC_EMAIL_TEMPLATE}`,
        email,
        {
          publicKey: process.env.NEXT_PUBLIC_EMAIL_KEY,
        }
      )
      .then(
        (result) => {
          setEmailSent(true);
          event.target.reset();
        },
        (error) => {
          console.log(error.text);
        }
      );
    setFormData(
      {
        email: { value: "", isValid: false },
      },
      false
    );
  };

  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: { xs: 4, sm: 8 },
        py: { xs: 8, sm: 10 },
        textAlign: { sm: "center", md: "left" },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
            minWidth: { xs: "100%", sm: "60%" },
          }}
        >
          <Box sx={{ width: { xs: "100%", sm: "60%" } }}>
            <Box sx={{ ml: "-15px" }}>
              {mode === "dark" ? (
                <img
                  src="/query-level-night.svg"
                  style={logoStyle}
                  alt="logo of sitemark"
                />
              ) : (
                <img
                  src="/query-level-day.svg"
                  style={logoStyle}
                  alt="logo of sitemark"
                />
              )}
            </Box>
            <Typography variant="body2" fontWeight={600} gutterBottom>
              Newsletter
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Subscribe to our newsletter for weekly updates and promotions.
            </Typography>

            {emailSent && "You have been successfully subscribed!"}
            <form onSubmit={handleSubscribeUser}>
              <Stack direction="row" spacing={1} useFlexGap>
                <TextField
                  disabled={emailSent}
                  id="subscribeEmail"
                  hiddenLabel
                  size="small"
                  variant="outlined"
                  sx={{ minWidth: "auto" }}
                  aria-label="Enter your email address"
                  placeholder="Your email address"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    inputHandler(
                      "subscribeEmail",
                      e.target.value,
                      emailIsValid(e.target.value)
                    );

                    if (emailIsValid(e.target.value)) {
                      setFormData(
                        {
                          email: { value: e.target.value, isValid: true },
                        },
                        true
                      );
                    }
                  }}
                />
                <Button
                  disabled={!formState.isValid}
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{ flexShrink: 0 }}
                >
                  Subscribe
                </Button>
              </Stack>
            </form>
          </Box>
        </Box>
        <Box
          sx={{
            display: { xs: "none", sm: "flex" },
            flexDirection: "column",
            gap: 1,
          }}
        >
          <Typography variant="body2" fontWeight={600}>
            Product
          </Typography>
          <MuiLink
            color="text.secondary"
            onClick={() => scrollToSection("features")}
            sx={{ cursor: "pointer" }}
          >
            Features
          </MuiLink>
          <MuiLink
            color="text.secondary"
            onClick={() => scrollToSection("highlights")}
            sx={{ cursor: "pointer" }}
          >
            Highlights
          </MuiLink>
          <MuiLink
            color="text.secondary"
            onClick={() => scrollToSection("pricing")}
            sx={{ cursor: "pointer" }}
          >
            Pricing
          </MuiLink>
          <MuiLink
            color="text.secondary"
            onClick={() => scrollToSection("faq")}
            sx={{ cursor: "pointer" }}
          >
            FAQs
          </MuiLink>
        </Box>
        <Box
          sx={{
            display: { xs: "none", sm: "flex" },
            flexDirection: "column",
            gap: 1,
          }}
        >
          <Typography variant="body2" fontWeight={600}>
            Questions
          </Typography>
          <MuiLink color="text.secondary">support@querylevel.com</MuiLink>
        </Box>
        <Box
          sx={{
            display: { xs: "none", sm: "flex" },
            flexDirection: "column",
            gap: 1,
          }}
        >
          <Typography variant="body2" fontWeight={600}>
            Legal
          </Typography>
          <MuiLink
            component={Link}
            color="text.secondary"
            href="/terms-of-service"
          >
            Terms
          </MuiLink>
          <MuiLink
            component={Link}
            color="text.secondary"
            href="/privacy-policy"
          >
            Privacy
          </MuiLink>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          pt: { xs: 4, sm: 8 },
          width: "100%",
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          <MuiLink
            component={Link}
            color="text.secondary"
            href="/privacy-policy"
          >
            Privacy Policy
          </MuiLink>
          <Typography display="inline" sx={{ mx: 0.5, opacity: 0.5 }}>
            &nbsp;•&nbsp;
          </Typography>
          <MuiLink
            component={Link}
            color="text.secondary"
            href="/terms-of-service"
          >
            Terms of Service
          </MuiLink>
        </div>
        <Stack
          direction="row"
          justifyContent="left"
          alignItems="center"
          spacing={1}
          useFlexGap
          sx={{
            color: "text.secondary",
          }}
        >
          <IconButton
            color="inherit"
            href="https://x.com/querylevelist"
            aria-label="GitHub"
            sx={{ alignSelf: "center" }}
          >
            <XIcon />
          </IconButton>
          |
          <Typography color="text.secondary">support@QueryLevel.com</Typography>
          {/* <IconButton
            color="inherit"
            href="https://www.linkedin.com/"
            aria-label="LinkedIn"
            sx={{ alignSelf: "center" }}
          >
            <LinkedInIcon />
          </IconButton> */}
        </Stack>
      </Box>
      <Stack sx={{ width: "100%" }}>
        <Copyright />
      </Stack>
    </Container>
  );
}
