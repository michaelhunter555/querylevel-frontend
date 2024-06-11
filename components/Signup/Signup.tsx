import React, { ChangeEvent, useState } from "react";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";

import useHttp from "@/hooks/http-hook";
import { useForm } from "@/hooks/useForm";
import {
  Box,
  Button,
  Container,
  FormLabel,
  Paper,
  Stack,
  TextField,
} from "@mui/material";

import { PlanData } from "./Plans";

const Signup = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoginMode, setIsLoginMode] = useState<boolean>(true);
  const [selectedPlan, setSelectedPlan] = useState("BASIC");
  const { isLoading, isPostLoading, error, success, sendRequest, clearError } =
    useHttp();
  const [formState, inputHandler, setFormData] = useForm(
    {
      name: {
        value: "",
        isValid: false,
      },
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
      userPlan: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  if (session) {
    router.push(`${process.env.NEXT_PUBLIC_NGROK_URI}`);
    return "Redirecting...";
  }

  const toggleSignupOrLogin = () => {
    if (!isLoginMode) {
      setFormData(
        {
          ...formState.inputs,
          name: { value: undefined, isValid: true },
          userPlan: { value: undefined, isValid: true },
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        { ...formState.inputs, name: { value: "", isValid: false } },
        false
      );
    }
    setIsLoginMode((prev) => !prev);
  };

  const submitHandler = async (event: any) => {
    event.preventDefault();
    if (isLoginMode) {
      try {
        signIn("Credentials", {
          username: formState?.inputs?.email?.value,
          password: formState?.inputs?.password?.value,
        });
        if (session) {
          router.push(`${process.env.NEXT_PUBLIC_NGROK_URI}`);
          return "redirecting...";
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        const response = await sendRequest(
          "/api/auth/sign-up",
          "POST",
          JSON.stringify({
            username: formState?.inputs?.email?.value,
            password: formState?.inputs?.password?.value,
            name: formState?.inputs?.name?.value,
            userPlan: formState?.inputs?.userPlan?.value,
          }),
          { "Content-Type": "application/json" }
        );

        const { password, email } = response;

        signIn("Credentials", {
          username: email,
          password: password,
        });
      } catch (err) {
        console.log(err);
      }
    }
  };

  const selectPlanHandler = (val: PlanData) => {
    setSelectedPlan(val?.plan);
    inputHandler("userPlan", val.plan, val.plan !== "");
  };

  return (
    <Container
      component={Paper}
      sx={{
        border: "1px solid #bdbdbd",
        width: { lg: "600px", md: "70%", sm: "100%" },
        paddingBottom: "1rem",
      }}
    >
      <form onSubmit={submitHandler}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "5px",
            padding: "1rem",
          }}
        >
          {!isLoginMode && (
            <Stack>
              <FormLabel>Name</FormLabel>
              <TextField
                id="name"
                name="name"
                type="text"
                value={formState?.inputs?.name?.value}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  inputHandler(
                    "name",
                    event.target.value as string,
                    event.target.value !== ""
                  )
                }
              />
            </Stack>
          )}
          {!isLoginMode && (
            <Stack>
              <FormLabel>e-mail</FormLabel>
              <TextField
                id="email"
                name="email"
                type="email"
                value={formState?.inputs?.email?.value}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  inputHandler(
                    "email",
                    event.target.value as string,
                    event.target.value !== ""
                  )
                }
              />
            </Stack>
          )}
          {!isLoginMode && (
            <Stack>
              <FormLabel>Password</FormLabel>
              <TextField
                id="password"
                name="password"
                type="password"
                value={formState?.inputs?.password?.value}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  inputHandler(
                    "password",
                    event.target.value as string,
                    event.target.value.length > 6
                  )
                }
              />
            </Stack>
          )}
          {!isLoginMode && (
            <Stack>
              <FormLabel>Select Plan</FormLabel>
            </Stack>
          )}
          <Button variant="contained" type="submit">
            {isLoginMode ? "Login" : "Sign-up"}
          </Button>
        </Box>
      </form>
      <Stack direction="row" justifyContent="center" sx={{ width: "100%" }}>
        <Button variant="outlined" onClick={toggleSignupOrLogin}>
          {isLoginMode ? "Switch to Sign-up" : "Switch to Login"}
        </Button>
      </Stack>
    </Container>
  );
};

export default Signup;
