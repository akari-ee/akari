import { getPhotoList, prefetchPhotoList } from "~/service/photo";
import type { Route } from "./+types/_feed._index";
import PhotoList from "~/components/photo-list";
// import { createServerClient } from "~/lib/supabase-server";
import { getAuth } from "@clerk/react-router/ssr.server";
import { HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { Suspense } from "react";
import { createServerClient } from "~/lib/supabase-server";
import { Await, data } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Hola" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function loader(args: Route.LoaderArgs) {
  const supabase = await createServerClient();
  const state = await prefetchPhotoList(supabase);

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

export default function MainRoute({ loaderData }: Route.ComponentProps) {
  return (
    <HydrationBoundary state={loaderData.dehydratedState}>
      <main className="flex flex-col items-center justify-center gap-4 py-4 md:py-6 w-full h-full">
        <Suspense fallback={<div>Loading...</div>}>
          <PhotoList />
        </Suspense>
      </main>
    </HydrationBoundary>
  );
}
