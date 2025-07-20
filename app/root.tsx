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
import { Toaster } from "./components/ui/sonner";
import { dark } from '@clerk/themes';

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
        <Toaster />
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
        formFieldLabel__username: "사용자명",
        formFieldLabel__emailAddress: "이메일",
        formButtonPrimary: "다음으로",
        formFieldLabel__newPassword: "새로운 비밀번호",
        formFieldLabel__confirmPassword: "비밀번호 확인",
        formFieldLabel__currentPassword: "현재 비밀번호",
        formFieldLabel__password: "새로운 비밀번호 확인",
        formFieldLabel__signOutOfOtherSessions: "모든 디바이스에서 로그아웃",
        badge__primary: "대표",
        reverification: {
          emailCode: {
            title: "인증 필요",
            subtitle: "계속하려면 이메일로 전송된 코드를 입력하세요.",
            resendButton: "코드를 받지 못했나요?",
          },
        },
        userProfile: {
          formButtonReset: "취소",
          formButtonPrimary__save: "저장",
          formButtonPrimary__remove: "제거",
          navbar: {
            title: "계정",
            description: "내 계정 정보 관리",
            account: "계정 관리",
            security: "보안 설정",
          },
          start: {
            headerTitle__account: "내 정보",
            headerTitle__security: "보안",
            profileSection: {
              title: "프로필 이미지",
              primaryButton: "변경",
            },
            usernameSection: {
              title: "사용자명",
              primaryButton__updateUsername: "변경",
              primaryButton__setUsername: "설정",
            },
            emailAddressesSection: {
              title: "이메일 주소",
              primaryButton: "이메일 추가하기",
              detailsAction__primary: "프라이머리",
              destructiveAction: "이메일 제거",
            },
            connectedAccountsSection: {
              title: "소셜 연동",
              primaryButton: "연결하기",
              destructiveActionTitle: "연동 해제",
            },
            passwordSection: {
              title: "비밀번호",
              primaryButton__updatePassword: "변경하기",
              primaryButton__setPassword: "비밀번호 설정",
            },
            activeDevicesSection: {
              title: "활성화된 장치",
              destructiveAction: "장치 제거",
            },
            dangerSection: {
              title: "계정 탈퇴",
              deleteAccountButton: "탈퇴하기",
            },
          },
          profilePage: {
            title: "프로필 업데이트",
            imageFormSubtitle: "업로드",
            fileDropAreaHint: "권장 비율 1:1, 10mb 이하",
          },
          usernamePage: {
            title__update: "사용자명 업데이트",
          },
          emailAddressPage: {
            title: "이메일 주소 업데이트",
            formHint: "이 이메일 주소를 계정에 추가하려면 인증이 필요합니다.",
            removeResource: {
              title: "이메일 제거",
              messageLine1: "선택하신 이메일이 제거됩니다.",
              messageLine2: "이 이메일 주소로는 더 이상 로그인할 수 없습니다.",
            },
          },
          passwordPage: {
            title__set: "비밀번호 설정",
            checkboxInfoText__signOutOfOtherSessions:
              "이전 비밀번호를 사용했던 다른 모든 기기에서 로그아웃하는 것을 권장합니다.",
            title__update: "비밀번호 변경",
          },
          deletePage: {
            title: "계정 탈퇴",
            messageLine1: "정말 탈퇴하시겠어요?",
            messageLine2: "이 작업은 되돌릴 수 없으므로 신중히 진행해 주세요.",
            actionDescription:
              "계속하려면 아래에 ‘Delete Account’를 입력하세요.",
            confirm: "탈퇴하기",
          },
          connectedAccountPage: {
            removeResource: {
              title: "연동 해제",
              messageLine2:
                "이 계정과 연결된 서비스를 더 이상 이용할 수 없으며, 관련 기능도 함께 비활성화됩니다.",
            },
          },
        },
        userButton: {
          action__manageAccount: "계정 관리",
          action__signOut: "로그아웃",
        },
      }}
      appearance={{
        // baseTheme: [dark],
        elements: {
          headerTitle: {
            fontSize: "22px",
          },
          buttonArrowIcon: {
            width: "0",
            height: "0",
            visibility: "hidden",
          },
        },
        layout: {
          termsPageUrl: "https://clerk.com/terms",
          unsafe_disableDevelopmentModeWarnings: true,
        },
        captcha: {
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
