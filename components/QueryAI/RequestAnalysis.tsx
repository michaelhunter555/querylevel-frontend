import React, { useState } from "react";

import { useSession } from "next-auth/react";

import { useAI } from "@/hooks/ai-hook";
import { useInvalidateQuery } from "@/hooks/invalidateQueries";
import { useCheckDevice } from "@/hooks/use-device-hook";
import type { QueryGptResponse } from "@/types";
import { Alert, Divider, List, ListItem } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import FormHelperText from "@mui/material/FormHelperText";
import Grid from "@mui/material/Grid2";
import { SelectChangeEvent } from "@mui/material/Select";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useQuery } from "@tanstack/react-query";

import SelectSegment from "../CampaignsView/SelectDate";
import { SelectableDates } from "../CampaignsView/SelectDate.enums";
import { StyledStack } from "../Shared/StyledFadeInComponents";
import FeedbackItems from "./FeedbackItems";

const AnalyzePerformance = () => {
  const { data: session } = useSession();
  const { isMobile } = useCheckDevice();
  const {
    performDataAnalysis,
    isLoading: AIDataIsLoading,
    AIResponse,
    getFeedback,
  } = useAI();
  const { invalidateQuery } = useInvalidateQuery();
  const [resource, setResource] = useState<
    "product_group_view" | "shopping_performance_view" | null
  >(null);
  const [segment, setSegment] = useState<string>(SelectableDates.lastWeek);
  const [adGroupId, setAdGroupId] = useState<string | number | null>(null);
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [toggleReport, setToggleReport] = useState<boolean>(false);
  const [reportIndex, setReportIndex] = useState<number | null>(null);

  const [page, setPage] = useState<{ [key: string]: number }>({
    page: 1,
    limit: 10,
  });

  const { data: gptResponses, isLoading: gptIsLoading } = useQuery({
    queryKey: ["ai_feedback_data", page.page, page.limit],
    queryFn: () =>
      getFeedback(
        String(session?.user?._id),
        String(page.page),
        String(page.limit)
      ),
    enabled: Boolean(session?.user?._id && page.page !== 0),
  });

  const handleDataAnalysis = async () => {
    if (session?.user?._id && resource !== null && isChecked) {
      await performDataAnalysis(
        segment,
        String(resource),
        String(session?.user?._id),
        String(adGroupId)
      );
      await invalidateQuery("ai_feedback_data");
      setResource(null);
    }
  };

  const handleSegmentChange = (event: SelectChangeEvent<string>) => {
    setSegment(event.target.value);
  };

  const handlePageChange = (event: React.SyntheticEvent, val: number) => {
    setPage((prev) => ({ page: val, limit: prev.limit }));
  };

  const handleToggleReport = (i: number) => {
    setReportIndex(i);
    setToggleReport(true);
  };

  console.log(
    "GPT Response",
    gptResponses?.feedback[reportIndex as keyof typeof gptResponses.feedback]
      ?.response
  );

  return (
    <Container maxWidth="lg" sx={{ marginTop: 5 }}>
      <Grid container direction={isMobile ? "column" : "row"}>
        <Grid size={isMobile ? 12 : 3}>
          {/* previous List */}

          <Typography
            color="text.secondary"
            sx={{ textDecoration: "underline" }}
            variant="h3"
          >
            Previous Feedback
          </Typography>

          <List dense>
            {gptResponses &&
            !gptIsLoading &&
            gptResponses?.feedback?.length !== 0 ? (
              gptResponses?.feedback?.map(
                (queryGPT: QueryGptResponse, i: number) => (
                  <ListItem key={queryGPT?._id}>
                    <FeedbackItems
                      response={queryGPT?.response}
                      date={queryGPT?.date}
                      onDelete={() => console.log("deleted")}
                      onGet={() => handleToggleReport(i)}
                    />
                  </ListItem>
                )
              )
            ) : (
              <Typography
                variant="subtitle2"
                sx={{ fontSize: 11 }}
                color="text.secondary"
              >
                No responses found. maybe add one?
              </Typography>
            )}
          </List>
          <Alert icon={false} severity="warning">
            max 10 feedback per user
          </Alert>
        </Grid>
        <Divider
          flexItem
          orientation="vertical"
          sx={{ margin: "0.5rem auto" }}
        />
        <Grid size={isMobile ? 12 : 8}>
          {toggleReport && (
            <>
              <Chip
                label="Back to form"
                clickable
                onClick={() => setToggleReport((prev) => !prev)}
              />

              <Typography
                color="text.secondary"
                dangerouslySetInnerHTML={{
                  __html:
                    gptResponses?.feedback[
                      reportIndex as keyof typeof gptResponses.feedback
                    ]?.response,
                }}
              />
            </>
          )}

          {!toggleReport && (
            <>
              <Typography variant="h2" color="text.secondary">
                Welcome to QueryGPT Analysis{" "}
                <span
                  style={{
                    padding: 1,
                    border: "1px solid yellow",
                    backgroundColor: "#d1ae16",
                    color: "black",
                    borderRadius: 5,
                    fontSize: "11px",
                  }}
                >
                  Beta
                </span>
              </Typography>
              <Typography gutterBottom color="text.secondary">
                Analyze your shopping performance over the last 7, 14 or 30
                days.
              </Typography>
              <Divider sx={{ margin: "1rem auto" }} />

              <Stack spacing={2}>
                <FormHelperText>Select resource for analysis:</FormHelperText>
                <StyledStack
                  direction="row"
                  spacing={2}
                  delay={0.3}
                  yAxis={10}
                  visible={Boolean(
                    session?.user?._id && session?.user?.googleAccountId
                  )}
                >
                  <Chip
                    variant={
                      resource === "product_group_view" ? "filled" : "outlined"
                    }
                    label="Product Group View"
                    onClick={() => setResource("product_group_view")}
                    clickable
                    disabled={true}
                  />
                  <Chip
                    variant={
                      resource === "shopping_performance_view"
                        ? "filled"
                        : "outlined"
                    }
                    label="Shopping Performance View"
                    onClick={() => setResource("shopping_performance_view")}
                    clickable
                  />
                </StyledStack>

                <StyledStack
                  spacing={2}
                  delay={0.3}
                  yAxis={10}
                  visible={Boolean(
                    session?.user?._id && session?.user?.googleAccountId
                  )}
                >
                  <SelectSegment
                    segment={segment}
                    onSegmentChange={handleSegmentChange}
                    isLoading={AIDataIsLoading}
                    removeAllTime={true}
                  />
                </StyledStack>
                <Stack alignItems="end">
                  <Stack direction="row" alignItems="center">
                    <Typography variant="subtitle2" color="text.secondary">
                      I understand and give my consent to share my google ads
                      metrics data with openai
                    </Typography>
                    <Checkbox
                      checked={isChecked}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                        setIsChecked(event.target.checked)
                      }
                    />
                  </Stack>
                  <Chip
                    onClick={handleDataAnalysis}
                    label="Begin Analysis"
                    clickable
                    color="primary"
                    disabled={
                      !isChecked || resource === null || AIDataIsLoading
                    }
                  />
                </Stack>
              </Stack>
              <Stack>
                {AIResponse && !AIDataIsLoading && (
                  <Typography
                    color="text.secondary"
                    variant="subtitle2"
                    dangerouslySetInnerHTML={{ __html: AIResponse }}
                  />
                )}

                {AIDataIsLoading &&
                  Array.from({ length: 3 }).map((_, i) => (
                    <React.Fragment key={i}>
                      <Skeleton width="100%" />
                      <Skeleton width="100%" />
                      <Skeleton width="100%" />
                    </React.Fragment>
                  ))}

                {!AIResponse && (
                  <Typography variant="subtitle2" color="text.secondary">
                    Your response will display here.
                  </Typography>
                )}
              </Stack>
            </>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default AnalyzePerformance;
