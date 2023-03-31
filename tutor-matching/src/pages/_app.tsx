import "@/styles/globals.css";
import "react-tooltip/dist/react-tooltip.css";
import { ReactElement, ReactNode, useState } from "react";
import type { NextPage } from "next";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import { GoogleOAuthProvider } from "@react-oauth/google";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (count, error: any) => {
        // if no response probably network error and we want to retry?
        if (!error.response) {
          return true;
        }

        // else dont want to retry
        return false;
      },
    },
  },
});
export default function App({ Component, pageProps }: AppPropsWithLayout) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <QueryClientProvider client={queryClient}>
      <GoogleOAuthProvider clientId="316194138365-1fsflku0grfp2ig1gsb2lta01tf045l9.apps.googleusercontent.com">
        {getLayout(<Component {...pageProps} />)}
      </GoogleOAuthProvider>
    </QueryClientProvider>
  );
}
