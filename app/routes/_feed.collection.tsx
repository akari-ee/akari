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
import MasonryGrid from "~/components/shared/masonry-grid";

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
                <MasonryGrid items={data}>
                  {(item) => (
                    <Link
                      to={`/collection/view/${item.id}`}
                      className="block break-inside-avoid rounded-md overflow-hidden mb-4 md:mb-6"
                    >
                      <div
                        className="w-full h-auto"
                        style={{
                          backgroundColor: item.thumbnail?.avg_color ?? "#f2f2f2",
                          aspectRatio:
                            item.thumbnail?.width && item.thumbnail?.height
                              ? `${item.thumbnail.width} / ${item.thumbnail.height}`
                              : "3 / 2",
                        }}
                      >
                        <img
                          src={item.thumbnail?.url}
                          alt={item.title}
                          loading="lazy"
                          className="w-full h-full object-cover block"
                        />
                      </div>
                    </Link>
                  )}
                </MasonryGrid>
                {hasNextPage ? (
                  <InView
                    onChange={(inView) => {
                      if (inView && !isFetchingNextPage) {
                        fetchNextPage();
                      }
                    }}
                    rootMargin="300px 0px"
                    threshold={0}
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
                ) : (
                  <div className="py-4 text-sm text-muted-foreground">
                    더 이상 항목이 없습니다
                  </div>
                )}
              </>
            )}
          </SuspenseInfiniteQuery>
        </Suspense>
      </main>
    </HydrationBoundary>
  );
}
