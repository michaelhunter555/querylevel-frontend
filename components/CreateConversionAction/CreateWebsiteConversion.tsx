import React, { useState } from "react";

import dynamic from "next/dynamic";

import {
  useCreateConversion,
  useGetConversionData,
} from "@/hooks/create-conversion-hook";
import { useInvalidateQuery } from "@/hooks/invalidateQueries";
import { useForm } from "@/hooks/useForm";
import { WebsiteConversion } from "@/types";
import { createConversionObject } from "@/util/helpers/createConversion";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useQuery } from "@tanstack/react-query";

import { StyledFadeIn } from "../Shared/StyledFadeInComponents";
import { createConversionFields } from "./conversionCreationFields";
import { ConversionLoadingSkeleton } from "./ConversionLoadingSkeleton";

const ConversionsTable = dynamic(() => import("./ConversionsTable"), {
  ssr: false,
});
const ConversionFormFields = dynamic(() => import("./ConversionFormFields"), {
  ssr: false,
});

const CreateWebsiteConversion = () => {
  const [toggleForm, setToggleForm] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const { isPostLoading, createWebsiteConversion, response } =
    useCreateConversion();
  const { getConversionData } = useGetConversionData();
  const [formState, inputHandler, setFormData] = useForm(
    createConversionFields,
    false
  );
  const { invalidateQuery } = useInvalidateQuery();
  const { data: conversionData, isLoading: tableIsLoading } = useQuery({
    queryKey: ["conversionData"],
    queryFn: () => getConversionData(),
    staleTime: Infinity,
  });

  const createConversionHandler = async () => {
    const conversionData: WebsiteConversion = createConversionObject(formState);
    try {
      await createWebsiteConversion(conversionData);
      if (response) {
        setSuccess(true);
      }
      invalidateQuery("conversionData");
      handleFormToggle();
    } catch (err) {
      console.log("There was an error in CreateWebsiteConversion action.", err);
    }
  };

  const handleFormToggle = () => {
    setToggleForm((prev) => !prev);
  };

  // console.log(conversionData, "ConversionData");
  return (
    <Box sx={{ marginTop: "1rem" }}>
      <Stack direction={"row"} alignItems="center" spacing={2}>
        <Button
          variant="outlined"
          endIcon={toggleForm ? "" : <AddIcon />}
          onClick={handleFormToggle}
        >
          {toggleForm ? <ArrowBackIcon /> : "Create Conversion"}
        </Button>
        <Alert icon={false} severity="info" variant="outlined">
          This feauture supports website purchase conversion management.
        </Alert>
      </Stack>
      <Grid
        container
        spacing={2}
        direction="row"
        alignItems="center"
        justifyContent="center"
        sx={{ margin: "0 auto", width: "auto" }}
      >
        {toggleForm && (
          <Paper
            sx={{
              padding: "2rem",
              borderRadius: "15px",
              margin: "1rem auto",
              width: { xs: "100%", md: "60%" },
            }}
          >
            <Alert
              severity={success ? "success" : "info"}
              action={
                success && (
                  <Button
                    size="small"
                    color="inherit"
                    onClick={() => setSuccess(false)}
                  >
                    Close
                  </Button>
                )
              }
            >
              {success
                ? "Successfully Created Conversion Action"
                : "Create Website Conversion tracking"}
              .
            </Alert>
            <Typography color="text.secondary" variant="h5">
              Create Conversion Action
            </Typography>
            <Divider orientation="vertical" />
            {isPostLoading && <ConversionLoadingSkeleton />}
            {!isPostLoading && (
              <StyledFadeIn delay={0.1} visible={!isPostLoading}>
                <ConversionFormFields
                  formState={formState}
                  inputHandler={inputHandler}
                />
              </StyledFadeIn>
            )}

            <Divider sx={{ margin: "0.5rem auto" }} />
            <Stack direction="row" justifyContent="flex-end" spacing={3}>
              <Button
                color="error"
                disabled={isPostLoading}
                onClick={handleFormToggle}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={async () => {
                  await createConversionHandler();
                  // console.log(formState?.inputs);
                }}
                disabled={!formState.isValid || isPostLoading}
              >
                Create Conversion
              </Button>
            </Stack>
          </Paper>
        )}
        {!toggleForm && (
          <ConversionsTable
            conversionData={conversionData}
            tableIsLoading={tableIsLoading}
          />
        )}
      </Grid>
    </Box>
  );
};

export default CreateWebsiteConversion;
