import { useToggleCreator } from "~/hooks/use-toggle-creator";
import { CToast } from "~/components/shared/custom-toast";
import type { Route } from "./+types/_setting.setting.$id.profile";
import { data } from "react-router";
import { createServerClient } from "~/lib/supabase-server";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
  QueryErrorResetBoundary,
} from "@tanstack/react-query";
import { photographerQueryOptions } from "~/service/photographer";
import { createBrowserClient } from "~/lib/supabase-client";
import ActivateCreatorButton from "~/components/setting-page/activate-creator-button";
import CreatorProfileSetting from "~/components/setting-page/creator-profile-setting";
import { ErrorBoundary, Suspense } from "@suspensive/react";
import ErrorBoundaryFallback from "~/components/shared/error-boundary-fallback";
import { SuspenseQuery } from "@suspensive/react-query";
import { SpinnerBallIcon } from "@phosphor-icons/react";

export async function loader({ params }: Route.LoaderArgs) {
  const id = params.id;
  if (!id) throw data("Not found", { status: 404 });

  const supabase = await createServerClient();
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(photographerQueryOptions.info(supabase, id));

  return { dehydratedState: dehydrate(queryClient), id };
}

let isInitialRequest = true;

export async function clientLoader({
  serverLoader,
  params,
}: Route.ClientLoaderArgs) {
  const id = params.id;

  if (isInitialRequest) {
    isInitialRequest = false;
    return await serverLoader();
  }

  return { dehydratedState: undefined, id };
}

clientLoader.hydrate = true as const;

export default function PhotographerSettingProfileRoute({
  loaderData,
}: Route.ComponentProps) {
  const { dehydratedState, id } = loaderData;
  const supabase = createBrowserClient();

  const { isCreator, isUserLoading, loading, handleToggle } = useToggleCreator({
    toastComponent: (props) => <CToast {...props} />,
    onActivateMsg: "작가 활성화",
    onDeactivateMsg: "작가 비활성화",
    onErrorMsg: "상태 변경 실패",
  });

  return (
    <HydrationBoundary state={dehydratedState}>
      <main className="flex flex-col gap-6 h-full">
        <header>
          <h1 className="font-black text-2xl mb-4">작가 등록</h1>
        </header>
        <section className="flex-grow flex items-center justify-center">
          {isUserLoading ? (
            <SpinnerBallIcon className="animate-spin size-8" />
          ) : !isCreator ? (
            <div className="w-full flex flex-col items-center justify-center py-16">
              <span className="text-sm font-semibold text-center text-muted-foreground">
                작가로 전환하면 사진을 업로드하고 수익을 얻을 수 있어요.
              </span>
              <ActivateCreatorButton
                className="mt-4"
                isCreator={isCreator}
                onToggle={handleToggle}
                loading={loading}
              />
            </div>
          ) : (
            <QueryErrorResetBoundary>
              {({ reset }) => (
                <ErrorBoundary onReset={reset} fallback={ErrorBoundaryFallback}>
                  <Suspense
                    fallback={
                      <SpinnerBallIcon className="animate-spin size-8" />
                    }
                  >
                    <SuspenseQuery
                      {...photographerQueryOptions.info(supabase, id)}
                      select={(data) => ({
                        name: data.name,
                        introduction:
                          data.introduction?.replace(/\\n/g, "") || "",
                        social: data.social.reduce((acc, item) => {
                          acc[item.platform] = item.url;
                          return acc;
                        }, {} as Record<string, string | null | undefined>),
                      })}
                    >
                      {({ data: photographer }) => (
                        <CreatorProfileSetting
                          defaultValue={photographer}
                          isCreator={isCreator}
                          loading={loading}
                          onToggle={handleToggle}
                        />
                      )}
                    </SuspenseQuery>
                  </Suspense>
                </ErrorBoundary>
              )}
            </QueryErrorResetBoundary>
          )}
        </section>
      </main>
    </HydrationBoundary>
  );
}
