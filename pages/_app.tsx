import React, { useEffect, useState } from "react";

import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";

import AppLayout from "@/components/Shared/AppLayout/AppLayout";
import LoadingIndicator from "@/components/Shared/AppLayout/LoadingIndicator";
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { AuthProvider } from "../context/authProvider";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleStart = () => {
      setLoading(true);
    };
    const handleComplete = () => {
      setLoading(false);
    };

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router]);

  return (
    <SessionProvider session={pageProps.session}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Head>
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1"
            />
            <title>Query Level - Structured Shopping Ads on Click</title>
          </Head>
          <AppLayout>
            <GoogleTagManager gtmId={`${process.env.NEXT_PUBLIC_GTM_ID}`} />
            <GoogleAnalytics
              gaId={`${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
            />
            <LoadingIndicator loading={loading} />
            <Component {...pageProps} />
          </AppLayout>
        </AuthProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}
