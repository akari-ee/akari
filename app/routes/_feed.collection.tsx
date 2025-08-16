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
import { useEffect, useRef } from "react";
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

function _optionalChain(ops: string | any[]) {
  let lastAccessLHS: undefined = undefined;
  let value = ops[0];
  let i = 1;
  while (i < ops.length) {
    const op = ops[i];
    const fn = ops[i + 1];
    i += 2;
    if ((op === "optionalAccess" || op === "optionalCall") && value == null) {
      return undefined;
    }
    if (op === "access" || op === "optionalAccess") {
      lastAccessLHS = value;
      value = fn(value);
    } else if (op === "call" || op === "optionalCall") {
      value = fn((...args: any) => value.call(lastAccessLHS, ...args));
      lastAccessLHS = undefined;
    }
  }
  return value;
}

export default function CollectionRoute({ loaderData }: Route.ComponentProps) {
  const supabase = createBrowserClient();
  const { dehydratedState } = loaderData;
  const scrollContainerRef = useRef<any>(null);
  const gridRef = useRef<any>(null);

  useEffect(() => {
    _optionalChain([
      gridRef,
      "access",
      (_: { current: any }) => _.current,
      "optionalAccess",
      (_2: { handleResize: any }) => _2.handleResize,
      "call",
      (_3: () => any) => _3(),
    ]);
  }, []);

  return (
    <HydrationBoundary state={dehydratedState}>
      <main className="flex flex-col items-center justify-center gap-4 py-4 md:py-6 w-full h-full">
        <Suspense>
          <SuspenseInfiniteQuery {...collectionQueryOptions.list(supabase, 1)}>
            {({ data, fetchNextPage, hasNextPage, isFetchingNextPage }) => (
              <div
                ref={(el) => {
                  scrollContainerRef.current = el;
                }}
                className="w-full h-full flex items-center justify-center"
                tabIndex={0}
              >
                {scrollContainerRef.current && (
                  <Masonry
                    ref={(ref) => {
                      gridRef.current = ref;
                    }}
                    columnWidth={320}
                    gutterWidth={20}
                    items={data}
                    layout="flexible"
                    minCols={1}
                    renderItem={({ data, itemIdx }) => (
                      <Link
                        key={data.id}
                        to={`/collection/view/${data.id}`}
                        style={{ contentVisibility: "auto" }}
                      >
                        <div className="rounded-lg overflow-hidden">
                          <Image
                            alt={data.title}
                            src={data.thumbnail?.url}
                            color={data.thumbnail.avg_color ?? "#f2f2f2"}
                            naturalWidth={data.thumbnail.width!}
                            naturalHeight={data.thumbnail.height!}
                            decoding="async"
                            loading={itemIdx < 8 ? "eager" : "lazy"}
                          />
                        </div>
                      </Link>
                    )}
                    scrollContainer={() => scrollContainerRef.current}
                  />
                )}
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
              </div>
            )}
          </SuspenseInfiniteQuery>
        </Suspense>
      </main>
    </HydrationBoundary>
  );
}
