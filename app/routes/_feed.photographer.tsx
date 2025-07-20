import React, { Suspense } from "react";
import { createServerClient } from "~/lib/supabase-server";
import { prefetchPhotographerList } from "~/service/photographer";
import type { Route } from "./+types/_feed.photographer";
import { HydrationBoundary } from "@tanstack/react-query";
import PhotographerList from "~/components/photographer-list";

export async function loader(args: Route.LoaderArgs) {
  const supabase = await createServerClient();
  const state = await prefetchPhotographerList(supabase);

  return { dehydratedState: state };
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

export default function PhotographerRoute({
  loaderData,
}: Route.ComponentProps) {
  return (
    <HydrationBoundary state={loaderData.dehydratedState}>
      <main className="flex flex-col justify-center gap-4 py-4 md:py-6 w-full h-full">
        <header>
          <h1 className="text-xl font-medium">Photographers</h1>
        </header>
        <Suspense fallback={<div>Loading...</div>}>
          <PhotographerList />
        </Suspense>
      </main>
    </HydrationBoundary>
  );
}
