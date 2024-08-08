import React, { useEffect, useState } from "react";

import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";

import { useGetGoogleAdAccountId } from "@/hooks/accountId-hook";
import { useGetAppAnalytics } from "@/hooks/customer-hooks";
import { ProductPerformanceData } from "@/types";
import { SelectChangeEvent, useMediaQuery, useTheme } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import LinearProgress from "@mui/material/LinearProgress";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useQuery } from "@tanstack/react-query";

import { StyledFadeIn } from "../Shared/StyledFadeInComponents";
//import AccountDataCards from "./AccountDataCards";
import { StyledBoxContainer } from "./AuthStyles";
//import DeviceData from "./DeviceData";
//import DoughnutChart from "./DoughnutChart";
//import LineChart  from "./LineChart";
import { PreLoginInfo } from "./PreLoginInfo";
import { TempLoadingCard } from "./tempLoadingCards";
//import ProductPerformance  from "./ProductPerformance";
import { UserAccountCard } from "./UserAccountCard";
import { UserNotLoggedIn } from "./UserNotLoggedIn";

const AccountDataCards = dynamic(() => import("./AccountDataCards"), {
  ssr: false,
  loading: () => <TempLoadingCard />,
});
const LineChart = dynamic(() => import("./LineChart"), {
  ssr: false,
  loading: () => {
    return (
      <>
        <Skeleton width="100%" height={40} />
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} width="85%" height={45} />
        ))}
      </>
    );
  },
});
const DoughnutChart = dynamic(() => import("./DoughnutChart"), {
  ssr: false,
  loading: () => {
    return (
      <Stack
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
        spacing={2}
      >
        <Skeleton variant="circular" height={250} width={250} />
      </Stack>
    );
  },
});
const ProductPerformance = dynamic(() => import("./ProductPerformance"), {
  ssr: false,
  loading: () => <LinearProgress />,
});

const GoogleAuthButton = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { data: session, status } = useSession();
  const router = useRouter();
  const [segment, setSegment] = useState("LAST_7_DAYS");
  const { isLoading, getResourceNamesHandler, accountIdError } =
    useGetGoogleAdAccountId();
  const [processedData, setProcessedData] = useState<{
    dateData: any[];
    productData: ProductPerformanceData[];
  } | null>(null);
  const { getCurrentAnalytics } = useGetAppAnalytics();

  //check if the user has a googleAccountId added yet.
  //This hook should only ever run once as long as the user's data is not removed from the DB.
  useEffect(() => {
    if (session?.user?._id && !session?.user?.googleAccountId) {
      getResourceNamesHandler();
    }
  }, [session?.user?._id]);

  useEffect(() => {
    if (status === "authenticated" && !isLoading && accountIdError) {
      router.push("/no-account-id-found");
    }
  }, [accountIdError, isLoading, status]);

  //const worker = new Worker("worker.ts")

  const authDataIsAvailable =
    session?.user?._id !== undefined &&
    segment &&
    session?.user?.googleAccountId;

  const { data: shoppingPerformanceData, isLoading: analyticsLoading } =
    useQuery({
      queryKey: ["AppAnalytics", segment],
      queryFn: () => getCurrentAnalytics(session?.user?._id as string, segment),
      enabled: Boolean(authDataIsAvailable),
      refetchOnWindowFocus: false,
    });

  useEffect(() => {
    if (shoppingPerformanceData) {
      const dateAggregatedData: any = {};
      const productAggregatedData: any = {};

      shoppingPerformanceData.forEach((product) => {
        // Date aggregation
        if (!dateAggregatedData[product.date]) {
          dateAggregatedData[product.date] = {
            clicks: 0,
            cost_micros: 0,
            conversions: 0,
            conversions_value: 0,
            impressions: 0,
          };
        }
        dateAggregatedData[product.date].clicks += product.clicks;
        dateAggregatedData[product.date].cost_micros +=
          product.cost_micros / 1000000;
        dateAggregatedData[product.date].conversions_value +=
          product.conversions_value;
        dateAggregatedData[product.date].conversions += product.conversions;
        dateAggregatedData[product.date].impressions += product.impressions;

        // Product title aggregation
        if (!productAggregatedData[product.product_title]) {
          productAggregatedData[product.product_title] = {
            clicks: 0,
            cost_micros: 0,
            conversions: 0,
            conversions_value: 0,
            impressions: 0,
          };
        }
        productAggregatedData[product.product_title].clicks += product.clicks;
        productAggregatedData[product.product_title].cost_micros +=
          product.cost_micros / 1000000;
        productAggregatedData[product.product_title].conversions_value +=
          product.conversions_value;
        productAggregatedData[product.product_title].conversions +=
          product.conversions;
        productAggregatedData[product.product_title].impressions +=
          product.impressions;
      });

      const dateFinalData = Object.keys(dateAggregatedData).map((date) => {
        const dateData = dateAggregatedData[date];
        const averageCPC =
          dateData.clicks > 0 ? dateData.cost_micros / dateData.clicks : 0;
        return {
          date,
          average_cpc: averageCPC.toFixed(2),
          ...dateData,
        };
      });

      const productFinalData = Object.keys(productAggregatedData).map(
        (product) => {
          const productData = productAggregatedData[product];
          const averageCPC =
            productData.clicks > 0
              ? productData.cost_micros / productData.clicks
              : 0;
          return {
            product_title: product,
            average_cpc: averageCPC.toFixed(2),
            ...productData,
          };
        }
      );

      setProcessedData({
        dateData: dateFinalData,
        productData: productFinalData,
      });
    }
  }, [shoppingPerformanceData]);

  //handles date segments with preset Date Queries
  const segmentsHandler = (event: SelectChangeEvent<string>) => {
    setSegment(event.target.value as string);
  };

  return (
    <>
      <StyledBoxContainer>
        {session?.user?._id && session?.user?.googleAccountId && (
          <AccountDataCards
            isLoading={analyticsLoading}
            shoppingPerformance={
              processedData?.productData as ProductPerformanceData[]
            }
            segment={segment}
            onSegmentChange={segmentsHandler}
          />
        )}
        {/* isLoading represents cases for needing to find the user's GoogleAccountId */}
        {isLoading && (
          <Stack
            spacing={2}
            alignItems="center"
            direction="row"
            sx={{ width: "50%" }}
          >
            <CircularProgress />
            <Typography color="text.secondary">
              Initializing app for new user...Please wait.
            </Typography>
          </Stack>
        )}
        {!isMobile && session?.user?._id && (
          <UserAccountCard loading={isLoading} />
        )}

        <Stack direction="column" alignItems="center" spacing={2}>
          <UserNotLoggedIn isLoading={isLoading as boolean} />
        </Stack>

        {/* {session?.user?._id &&
          !session.user.googleAccountId &&
          resourceNamesArray?.length > 1 && (
            <Stack direction="row" alignItems="center" spacing={2}>
              <SelectAccounts
                resource={selectedAccountId}
                resourceNames={resourceNamesArray}
                onSelectResource={(e: SelectChangeEvent) =>
                  selectAccountIdHandler(e.target.value)
                }
                onSetAccountId={setAccountIdHandler}
              />
            </Stack>
          )} */}

        {!session?.user?._id && !isLoading && <PreLoginInfo />}
      </StyledBoxContainer>

      {session?.user?._id && session?.user?.googleAccountId && (
        <StyledBoxContainer>
          <Grid container direction="row" alignItems="start">
            <Grid item xs={12} md={6}>
              <LineChart
                isLoading={analyticsLoading}
                productsData={
                  processedData?.dateData as ProductPerformanceData[]
                }
              />
            </Grid>

            <Grid
              item
              xs={12}
              md={6}
              sx={{
                width: "100%",
              }}
            >
              <DoughnutChart
                isLoading={analyticsLoading}
                productsData={
                  processedData?.productData as ProductPerformanceData[]
                }
              />
            </Grid>
          </Grid>
        </StyledBoxContainer>
      )}

      {session?.user?._id && session?.user?.googleAccountId && (
        <StyledBoxContainer>
          <Grid container direction="row" alignItems="center" spacing={1}>
            <StyledFadeIn delay={0.1} visible={true} sx={{ width: "100%" }}>
              <ProductPerformance
                isLoading={analyticsLoading}
                productsData={
                  processedData?.productData as ProductPerformanceData[]
                }
              />
            </StyledFadeIn>
            <Grid item xs={12} md={6}></Grid>

            {/* <Grid
              item
              xs={12}
              md={4}
              sx={{
                width: "80%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto",
              }}
            >
              <DeviceData
                isLoading={analyticsLoading}
                productsData={
                  processedData as ProductPerformanceData[]
                }
              />
            </Grid> */}
          </Grid>
        </StyledBoxContainer>
      )}
    </>
  );
};

export default GoogleAuthButton;
