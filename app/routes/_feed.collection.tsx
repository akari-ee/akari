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
import { DEFAULT_PAGE_SIZE } from "~/constant/service";
import { Badge } from "~/components/ui/badge";

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
                <div className="w-full h-full">
                  <div className="columns-2 sm:columns-3 lg:columns-4 gap-4 space-y-4">
                    {data.map((item, itemIdx) => (
                      <Link
                        key={item.id}
                        prefetch="render"
                        to={`/collection/view/${item.id}`}
                        className="group block rounded-lg overflow-hidden hover:opacity-90 transition-all duration-300 relative break-inside-avoid mb-4"
                        style={{
                          backgroundColor:
                            item.thumbnail?.avg_color ?? "#f2f2f2",
                        }}
                      >
                        <img
                          alt={item.title}
                          src={item.thumbnail?.url}
                          // color={item.thumbnail?.avg_color ?? "#f2f2f2"}
                          width={item.thumbnail?.width || 400}
                          height={item.thumbnail?.height || 300}
                          // naturalWidth={item.thumbnail?.width || 400}
                          // naturalHeight={item.thumbnail?.height || 300}
                          decoding="async"
                          loading={
                            itemIdx < DEFAULT_PAGE_SIZE ? "eager" : "lazy"
                          }
                          className="h-auto"
                        />
                        {/* 상단 좌측 photographer.name */}
                        <div className="absolute top-0 left-0  to-transparent p-3 transform -translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                          <Badge asChild>
                            <Link to="/">
                              @{item.photographer?.name || "Unknown"}
                            </Link>
                          </Badge>
                        </div>
                        {/* 하단 title과 description */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                          <div className="flex flex-col gap-2">
                            <h3 className="text-white font-semibold text-base leading-tight drop-shadow-lg truncate">
                              {item.title}
                            </h3>
                            {item.description && (
                              <p className="text-white/80 text-xs leading-relaxed drop-shadow-lg line-clamp-2 font-normal">
                                {item.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
                {hasNextPage && (
                  <InView
                    onChange={(inView) => {
                      if (inView && !isFetchingNextPage) {
                        fetchNextPage();
                      }
                    }}
                    rootMargin="800px 0px"
                    threshold={0.3}
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
