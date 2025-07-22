import { data, Link } from "react-router";
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
import PrevButton from "~/components/shared/prev-button";
import { SOCIAL_ICON_MAP } from "~/components/icons/icon-social";
import { Button } from "~/components/ui/button";
import ErrorBoundaryFallback from "~/components/shared/error-boundary-fallback";
import { EllipsisIcon } from "lucide-react";
import Carousel from "~/components/shared/carousel";

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
                  >
                    {({ data: photographer }) => (
                      <div className="flex flex-col items-center gap-4">
                        <header className="mb-8 flex flex-row items-center w-full gap-3">
                          <PrevButton />
                          <h1 className="text-2xl font-semibold w-full">
                            @{photographer?.name}
                          </h1>
                        </header>
                        <div className="w-32 h-32">
                          <img
                            src={photographer?.url!}
                            alt={photographer?.name}
                            width={300}
                            height={300}
                            className="object-cover w-full h-full rounded-full"
                          />
                        </div>
                        <aside className="flex flex-row gap-1 w-fit border rounded-lg p-1">
                          {photographer?.social.map(({ id, platform, url }) => {
                            const Icon = SOCIAL_ICON_MAP[platform];

                            return (
                              <Button
                                key={id}
                                asChild
                                variant={"ghost"}
                                size={"icon"}
                              >
                                <Link to={url}>
                                  <Icon className="size-5" />
                                </Link>
                              </Button>
                            );
                          })}
                        </aside>
                        <article className="w-full space-y-2 border rounded-lg p-4">
                          <h2 className="font-medium">작가의 말</h2>
                          <p>{photographer?.introduction}</p>
                        </article>
                      </div>
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
                        <div className="flex flex-col gap-3 flex-wrap">
                          {collection.length > 0 ? (
                            <>
                              {collection.map((item) => (
                                <div key={item.id} className="h-60 border">
                                  {item.title}
                                </div>
                              ))}
                              <div className="text-right">
                                <Button
                                  variant={"secondary"}
                                  size={"lg"}
                                  className="rounded-full shadow-none"
                                >
                                  더보기
                                </Button>
                              </div>
                            </>
                          ) : (
                            <div className="text-muted-foreground">
                              컬렉션이 없습니다.
                            </div>
                          )}
                        </div>
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
                      {({ data: photo }) => (
                        <div>
                          {photo.length > 0 ? (
                            <>
                              <Carousel items={photo} />
                              <div className="flex justify-center items-center">
                                <Button
                                  asChild
                                  variant={"secondary"}
                                  size={"icon"}
                                  className="rounded-full shadow-none"
                                >
                                  <Link to={"#"}>
                                    <EllipsisIcon />
                                  </Link>
                                </Button>
                              </div>
                            </>
                          ) : (
                            <div className="text-muted-foreground">
                              사진이 없습니다.
                            </div>
                          )}
                        </div>
                      )}
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
