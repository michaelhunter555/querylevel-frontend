import React, { useState } from "react";

import { useSession } from "next-auth/react";

import { useForm } from "@/hooks/useForm";
import emailjs from "@emailjs/browser";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { StyledFadeIn } from "../Shared/FadeInComponent";

const ContactForm = () => {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [emailSent, setEmailSent] = useState<boolean>(false);
  const [touch, setTouch] = useState<boolean>(false);

  const [formState, inputHandler, setformData] = useForm(
    {
      name: {
        value: "",
        isValid: false,
      },
      email: {
        value: session?.user?.email,
        isValid: true,
      },
      message: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const submitContactFormHandler = async (
    event: React.ChangeEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setIsLoading(true);
    const data = {
      email: formState?.inputs?.email.value,
      name: formState?.inputs?.name.value,
      message: formState?.inputs?.message.value,
    };

    await emailjs
      .send(
        `${process.env.NEXT_PUBLIC_EMAIL_SERVICE_KEY}`,
        `${process.env.NEXT_PUBLIC_EMAIL_TEMPLATE}`,
        data,
        {
          publicKey: process.env.NEXT_PUBLIC_EMAIL_KEY,
        }
      )
      .then(
        (result) => {
          console.log(result.text);
          setEmailSent(true);
          event.target.reset();
        },
        (error) => {
          console.log(error.text);
        }
      );

    setIsLoading(false);
    setformData(
      {
        name: {
          value: "",
          isValid: false,
        },
        email: {
          value: session?.user?.email,
          isValid: true,
        },
        message: {
          value: "",
          isValid: false,
        },
      },
      false
    );
    setTouch(false);
  };

  const handleBlur = (): void => {
    setTouch(true);
  };

  const nameError = !formState?.inputs?.name?.isValid;
  const messageError = !formState?.inputs?.message?.isValid;
  const messageIsValid = formState.isValid && !nameError && !messageError;

  let nameErrorText = "Please enter a valid name";
  let messageErrorText = "Messages must be at least 6 characters long";

  return (
    <>
      <StyledFadeIn visible={true} delay={0.1}>
        <Paper
          sx={{
            borderRadius: "15px",
            padding: "1rem",
            width: { xs: "100%", md: "70%" },
            margin: "2rem auto",
          }}
        >
          {touch && (
            <Alert severity={formState?.isValid ? "info" : "error"}>
              {!messageIsValid ? (
                <List>
                  {nameError && <ListItem>{nameErrorText}</ListItem>}
                  {messageError && <ListItem>{messageErrorText}</ListItem>}
                </List>
              ) : (
                "Message is ok to send"
              )}
            </Alert>
          )}
          {emailSent && (
            <Alert
              severity="success"
              action={
                <Button color="inherit" onClick={() => setEmailSent(false)}>
                  close
                </Button>
              }
            >
              Your email has been sent and our team will get back to you as soon
              as possible.
            </Alert>
          )}
          <Typography variant="subtitle1">
            If you have any questions, please send us an email and We'll get
            back to you within 24 hours.
          </Typography>
        </Paper>
        {!isLoading && (
          <form onSubmit={submitContactFormHandler}>
            <Grid
              container
              direction="column"
              spacing={2}
              sx={{
                width: { xs: "100%", md: "70%" },
                padding: "1rem",
                margin: "1rem auto",
              }}
            >
              <Grid item>
                <InputLabel>Name</InputLabel>
                <TextField
                  type="text"
                  id="name"
                  fullWidth
                  onBlur={handleBlur}
                  defaultValue={formState?.inputs?.name?.value}
                  onChange={(event) =>
                    inputHandler(
                      "name",
                      event.target.value as string,
                      event.target.value !== ""
                    )
                  }
                />
              </Grid>

              <Grid item>
                <InputLabel>E-mail</InputLabel>
                <TextField
                  type="email"
                  id="email"
                  fullWidth
                  disabled
                  defaultValue={formState?.inputs?.email?.value}
                />
              </Grid>

              <Grid item>
                <InputLabel>Message</InputLabel>
                <TextField
                  type="text"
                  id="email-message"
                  fullWidth
                  multiline
                  rows={4}
                  onBlur={handleBlur}
                  defaultValue={formState?.inputs?.message?.value}
                  onChange={(event) =>
                    inputHandler(
                      "message",
                      event.target.value as string,
                      event.target.value.length > 6
                    )
                  }
                />
              </Grid>
              <Stack alignItems="flex-end" sx={{ marginTop: "1rem" }}>
                <Button
                  variant="contained"
                  type="submit"
                  disabled={!formState?.isValid}
                >
                  Submit
                </Button>
              </Stack>
            </Grid>
          </form>
        )}
      </StyledFadeIn>
      {isLoading && (
        <Stack sx={{ width: "70%", margin: "1rem auto" }}>
          <Skeleton width="100%" />
          <Skeleton width="80%" />
          <Skeleton width="80%" />
        </Stack>
      )}
    </>
  );
};

export default ContactForm;
