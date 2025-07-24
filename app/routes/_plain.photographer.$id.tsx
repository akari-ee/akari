import { data } from "react-router";
import type { Route } from "./+types/_plain.photographer.$id";
import { createServerClient } from "~/lib/supabase-server";
import { photographerQueryOptions } from "~/service/photographer";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
  QueryErrorResetBoundary,
} from "@tanstack/react-query";
import { ErrorBoundary, Suspense } from "@suspensive/react";
import { SuspenseQuery } from "@suspensive/react-query";
import { createBrowserClient } from "~/lib/supabase-client";
import ErrorBoundaryFallback from "~/components/shared/error-boundary-fallback";
import PhotographerProfile from "~/components/photographer/photographer-profile";
import PhotographerCollection from "~/components/photographer/photographer-collection";
import PhotographerPhoto from "~/components/photographer/photographer-photo";

export async function loader({ params }: Route.LoaderArgs) {
  const id = params.id;

  if (!id) throw data("Not found", { status: 404 });

  const supabase = await createServerClient();
  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery(photographerQueryOptions.info(supabase, id)),
    queryClient.prefetchQuery(
      photographerQueryOptions.collection(supabase, id)
    ),
    queryClient.prefetchQuery(photographerQueryOptions.photo(supabase, id)),
  ]);

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

export default function PhotographerDetailRoute({
  loaderData,
}: Route.ComponentProps) {
  const { dehydratedState, id } = loaderData;
  const supabase = createBrowserClient();

  return (
    <HydrationBoundary state={dehydratedState}>
      <main className="flex flex-col flex-grow max-w-3xl container mx-auto py-8 px-4 h-full">
        <section className="flex flex-col gap-8 h-full">
          <QueryErrorResetBoundary>
            {({ reset }) => (
              <ErrorBoundary onReset={reset} fallback={ErrorBoundaryFallback}>
                <Suspense fallback={<div>작가 정보 로딩</div>}>
                  <SuspenseQuery
                    {...photographerQueryOptions.info(supabase, id)}
                    select={(data) => ({
                      ...data,
                      introduction:
                        data.introduction?.replace(/\\n/g, "") || "",
                    })}
                  >
                    {({ data: photographer }) => (
                      <PhotographerProfile photographer={photographer} />
                    )}
                  </SuspenseQuery>
                </Suspense>
                <section className="flex flex-col gap-6">
                  <header>
                    <h1 className="text-xl font-bold">작가의 컬렉션</h1>
                  </header>
                  <Suspense fallback={<div>작가 컬렉션 로딩</div>}>
                    <SuspenseQuery
                      {...photographerQueryOptions.collection(supabase, id)}
                    >
                      {({ data: collection }) => (
                        <PhotographerCollection collection={collection} />
                      )}
                    </SuspenseQuery>
                  </Suspense>
                </section>
                <section className="flex flex-col gap-6">
                  <header>
                    <h1 className="text-xl font-bold">작가의 사진</h1>
                  </header>
                  <Suspense fallback={<div>작가 사진 로딩</div>}>
                    <SuspenseQuery
                      {...photographerQueryOptions.photo(supabase, id)}
                    >
                      {({ data: photo }) => <PhotographerPhoto photo={photo} />}
                    </SuspenseQuery>
                  </Suspense>
                </section>
              </ErrorBoundary>
            )}
          </QueryErrorResetBoundary>
        </section>
      </main>
    </HydrationBoundary>
  );
}
