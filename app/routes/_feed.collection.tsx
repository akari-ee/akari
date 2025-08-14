import { Suspense } from "@suspensive/react";
import { SuspenseInfiniteQuery } from "@suspensive/react-query";
import { createBrowserClient } from "~/lib/supabase-client";
import { collectionQueryOptions } from "~/service/collection";
import { createServerClient } from "~/lib/supabase-server";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { InView } from "@suspensive/react-dom";
import { Link } from "react-router";
import type { Route } from "./+types/_feed.collection";

export async function loader() {
  const supabase = await createServerClient();
  const queryClient = new QueryClient();

  await queryClient.prefetchInfiniteQuery({
    ...collectionQueryOptions.list(supabase, 1),
  });

  return { dehydratedState: dehydrate(queryClient) };
}

let isInitialRequest = true;

export async function clientLoader({ serverLoader }: Route.ClientLoaderArgs) {
  if (isInitialRequest) {
    isInitialRequest = false;
    return await serverLoader();
  }
  return { dehydratedState: undefined };
}

clientLoader.hydrate = true as const;

export default function CollectionRoute({ loaderData }: Route.ComponentProps) {
  const supabase = createBrowserClient();
  const { dehydratedState } = loaderData;

  return (
    <HydrationBoundary state={dehydratedState}>
      <main className="flex flex-col items-center justify-center gap-4 py-4 md:py-6 w-full h-full">
        <Suspense>
          <SuspenseInfiniteQuery {...collectionQueryOptions.list(supabase, 1)}>
            {({ data, fetchNextPage, hasNextPage, isFetchingNextPage }) => (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-6 w-full">
                  {data.map((item) => (
                    <Link
                      key={item.id}
                      to={`/collection/view/${item.id}`}
                      className="block rounded-md overflow-hidden"
                    >
                      <div
                        className="w-full h-auto"
                        style={{
                          backgroundColor:
                            item.thumbnail?.avg_color ?? "#f2f2f2",
                          aspectRatio: "1 / 1",
                        }}
                      >
                        <img
                          src={item.thumbnail?.url}
                          alt={item.title}
                          className="w-full h-full object-cover object-center block"
                        />
                      </div>
                    </Link>
                  ))}
                </div>
                {hasNextPage && (
                  <InView
                    onChange={(inView) => {
                      if (inView && !isFetchingNextPage) {
                        fetchNextPage();
                      }
                    }}
                    rootMargin="300px 0px"
                    threshold={0.7}
                  >
                    {({ ref }) => (
                      <div
                        ref={ref}
                        className="py-4 text-sm text-muted-foreground"
                      >
                        {isFetchingNextPage
                          ? "로딩 중..."
                          : "스크롤하면 더 불러옵니다"}
                      </div>
                    )}
                  </InView>
                )}
              </>
            )}
          </SuspenseInfiniteQuery>
        </Suspense>
      </main>
    </HydrationBoundary>
  );
}
