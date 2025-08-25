import { rootAuthLoader } from "@clerk/react-router/ssr.server";
import { ClerkProvider } from "@clerk/react-router";

import {
  isRouteErrorResponse,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useNavigation,
} from "react-router";
import type { Route } from "./+types/root";
import "./app.css";
import Providers from "./providers";
import { LoaderIcon } from "lucide-react";
import { Toaster } from "./components/ui/sonner";
import { koKR } from "@clerk/localizations";
import { Button } from "./components/ui/button";
import { shadcn } from "@clerk/themes";
import { useEffect } from "react";
import { initServiceWorker } from "./hooks/use-service-worker";

export async function loader(args: Route.LoaderArgs) {
  return rootAuthLoader(args);
}

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Josefin+Sans:ital,wght@0,100..700;1,100..700&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const navigation = useNavigation();
  const isNavigating = Boolean(navigation.location);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="min-h-dvh text-foreground bg-background font-sans antialiased relative">
        {isNavigating && (
          <LoaderIcon className="animate-spin absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        )}
        {children}
        <Toaster
          richColors
          position="top-center"
          className="flex justify-center"
          toastOptions={{
            className: "!rounded-full !w-fit",
          }}
        />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App({ loaderData }: Route.ComponentProps) {
  // 서비스 워커 등록
  initServiceWorker();

  return (
    <ClerkProvider
      loaderData={loaderData}
      localization={koKR}
      appearance={{
        baseTheme: shadcn,
        elements: {
          headerTitle: {
            fontSize: "22px",
          },
          buttonArrowIcon: {
            width: "0",
            height: "0",
            visibility: "hidden",
          },
          cardBox: {
            boxShadow: "none",
            borderWidth: "1px",
            border: "none",
            borderStyle: "none",
          },
          card: {
            boxShadow: "none",
            borderRadius: "0",
            borderStyle: "none",
          },
          formButtonPrimary: {
            padding: "8px",
            borderRadius: "24px",
          },
          footer: {
            backgroundColor: "white",
          },
          footerAction: {
            backgroundColor: "white",
            margin: "0 0",
          },
          formFieldLabelRow__identifier: {},
          formFieldLabel__identifier: {},
          formFieldInput__identifier: {
            padding: "18px",
            borderRadius: "24px",
          },
          formFieldLabelRow__password: {},
          formFieldLabel__password: {},
          formFieldInput__password: {
            padding: "18px",
            borderRadius: "24px",
          },
          formFieldInput__username: {
            padding: "18px",
            borderRadius: "24px",
          },
          formFieldInput__emailAddress: {
            padding: "18px",
            borderRadius: "24px",
          },
          formFieldInput__newPassword: {
            padding: "18px",
            borderRadius: "24px",
          },
          formFieldInput__confirmPassword: {
            padding: "18px",
            borderRadius: "24px",
          },
          socialButtonsIconButton: {
            borderRadius: "24px",
            boxShadow: "none",
          },
        },
        layout: {
          termsPageUrl: "https://clerk.com/terms",
          unsafe_disableDevelopmentModeWarnings: true,
          socialButtonsPlacement: "bottom",
          socialButtonsVariant: "iconButton",
          logoPlacement: "outside",
        },
        captcha: {
          size: "flexible",
          language: "ko-KR",
        },
        variables: {
          colorBackground: "white",
        },
      }}
    >
      <Providers>
        <main className="relative flex flex-col h-dvh">
          <div className="flex-grow">
            <Outlet />
          </div>
        </main>
      </Providers>
    </ClerkProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details: string | null = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "Oops, Page Not Found" : "Error";
    details = error.status === 404 ? null : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto h-dvh flex flex-col justify-center items-center gap-2">
      <h1 className="font-black text-4xl md:text-5xl">{message}</h1>
      <p>{details}</p>
      <div className="mt-8 flex flex-col gap-2 items-center">
        <Button asChild className="rounded-full" size={"lg"}>
          <Link to={"/"}>Back to Home</Link>
        </Button>
      </div>
    </main>
  );
}
