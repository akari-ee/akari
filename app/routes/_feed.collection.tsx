import { Suspense } from "@suspensive/react";
import { SuspenseInfiniteQuery } from "@suspensive/react-query";
import { createBrowserClient } from "~/lib/supabase-client";
import { collectionQueryOptions } from "~/service/collection";
import type { Route } from "./+types/_feed.collection";
import { createServerClient } from "~/lib/supabase-server";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { InView } from "@suspensive/react-dom";
import { Link } from "react-router";

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
            {({ data, fetchNextPage, hasNextPage, isFetchingNextPage }) =>
              data.map((item) => (
                <InView
                  triggerOnce
                  delay={300}
                  threshold={0.5}
                  rootMargin="100px"
                >
                  {({ ref, isInView }) => (
                    <div ref={ref} className="h-60 border">
                      <Link
                        to={`/collection/${item.id}`}
                        className="h-full block"
                      >
                        {isInView ? item.title : "Out of View"}
                      </Link>
                    </div>
                  )}
                </InView>
              ))
            }
          </SuspenseInfiniteQuery>
        </Suspense>
      </main>
    </HydrationBoundary>
  );
}
