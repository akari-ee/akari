import { rootAuthLoader } from "@clerk/react-router/ssr.server";
import { ClerkProvider } from "@clerk/react-router";

import {
  isRouteErrorResponse,
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
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App({ loaderData }: Route.ComponentProps) {
  return (
    <ClerkProvider
      loaderData={loaderData}
      localization={{
        signIn: {
          start: {
            title: "Log in",
            subtitle: "subtitle or description",
            actionText: "계정이 없으신가요?",
            actionLink: "가입하기",
          },
        },
        signUp: {
          start: {
            title: "Welcome to",
            subtitle: "subtitle or description",
            actionText: "계정이 있으신가요?",
            actionLink: "로그인하기",
          },
        },
        formButtonPrimary: "Continue",
      }}
      appearance={{
        // baseTheme: dark,
        elements: {
          // card: {
          //   background: "#0c0c0c8b",
          // },
          // footer: {
          //   background: "#0c0c0c8b",
          // },
          // socialButtonsBlockButton: {
          //   background: "#242429",
          // },
          headerTitle: {
            fontSize: "22px",
          },
          buttonArrowIcon: {
            width: "0",
            height: "0",
            visibility: "hidden",
          },
        },
        // signIn: {
        //   baseTheme: dark,
        // },
        // signUp: {
        //   baseTheme: dark,
        // },
        layout: {
          termsPageUrl: "https://clerk.com/terms",
        },
        captcha: {
          // theme: "dark",
          size: "flexible",
          language: "ko-KR",
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
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
