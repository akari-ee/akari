import React, { useState } from "react";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { toast } from "sonner";
import { CToast } from "./components/shared/custom-toast";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000 * 10,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            refetchOnMount: false,
            retry: false,
            refetchInterval: false,
            throwOnError: false,
          },
          mutations: {
            retry: 0,
            throwOnError: false,
            onError: (error, _, context) => {
              toast.custom((t) => <CToast title="에러 발생" isError />);
            },
            onSuccess: () => {
              toast.custom((t) => <CToast title="성공" />);
            },
          },
        },
        queryCache: new QueryCache({
          onError: (error) => {
            // toast("Event has been created.");
          },
        }),
      })
  );
  return (
    <ThemeProvider defaultTheme={"light"} attribute="class">
      <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
