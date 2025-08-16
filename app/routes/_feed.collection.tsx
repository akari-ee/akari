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
import { useEffect, useRef, useState } from "react";
import { Masonry, Image } from "gestalt";

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
  const gridRef = useRef<any>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (gridRef.current?.handleResize) {
      gridRef.current.handleResize();
    }
  }, []);

  return (
    <HydrationBoundary state={dehydratedState}>
      <main className="flex flex-col items-center justify-center gap-4 py-4 md:py-6 w-full h-full">
        <Suspense>
          <SuspenseInfiniteQuery {...collectionQueryOptions.list(supabase, 1)}>
            {({ data, fetchNextPage, hasNextPage, isFetchingNextPage }) => (
              <>
                <div className="w-full h-full">
                  {isMounted && (
                    <Masonry
                      ref={gridRef}
                      columnWidth={280}
                      gutterWidth={15}
                      items={data}
                      layout="flexible"
                      minCols={1}
                      renderItem={({ data: item, itemIdx }) => (
                        <Link
                          key={item.id}
                          to={`/collection/view/${item.id}`}
                          className="block rounded-lg overflow-hidden hover:opacity-90 transition-opacity"
                        >
                          <Image
                            alt={item.title}
                            src={item.thumbnail?.url}
                            color={item.thumbnail?.avg_color ?? "#f2f2f2"}
                            naturalWidth={item.thumbnail?.width || 400}
                            naturalHeight={item.thumbnail?.height || 300}
                            decoding="async"
                            loading={itemIdx < 8 ? "eager" : "lazy"}
                          />
                        </Link>
                      )}
                    />
                  )}
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
